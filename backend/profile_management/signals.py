import logging

from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from api.referal_management.services import handle_successful_referral_subscription
from profile_management.models import SubscriptionPaymentAttempt, Subscriptions
from profile_management.receipts import (
    ReceiptPayload,
    payment_method_label,
    send_payment_receipt_email,
)
from project_management.models import Transactions

logger = logging.getLogger(__name__)


def _profile_display_name(profile):
    user = getattr(profile, "user", None)
    return (
        str(getattr(user, "full_name", "") or "").strip()
        or str(getattr(user, "email", "") or "").strip()
        or "TrustWork User"
    )


def _subscription_receipt_payload(subscription):
    profile = subscription.profile
    user = profile.user
    attempt = None
    if subscription.purchase_token:
        attempt = SubscriptionPaymentAttempt.objects.filter(
            reference_id=str(subscription.purchase_token)
        ).first()

    amount = subscription.receipt_amount
    currency = subscription.receipt_currency or "XAF"
    payment_method = subscription.receipt_payment_method
    if attempt:
        amount = amount if amount is not None else attempt.amount
        currency = currency or attempt.currency
        payment_method = payment_method or attempt.provider

    valid_until = (
        f"Valid until {timezone.localtime(subscription.expire_at).strftime('%d %b %Y')}"
        if subscription.expire_at
        else ""
    )
    return ReceiptPayload(
        receipt_number=f"TW-SUB-{subscription.id:06d}",
        recipient_email=user.email,
        customer_name=_profile_display_name(profile),
        item_name=f"TrustWork {subscription.subscription_frequency.title()} Subscription",
        amount=amount,
        currency=currency,
        payment_method=payment_method_label(payment_method),
        payment_reference=str(subscription.purchase_token or f"subscription-{subscription.id}"),
        paid_at=subscription.created_at,
        billing_period=valid_until,
    )


def _transaction_receipt_payload(transaction_obj):
    bid = transaction_obj.bid
    project = transaction_obj.project or getattr(bid, "project", None)
    profile = getattr(project, "client", None)
    user = getattr(profile, "user", None)
    reference = (
        transaction_obj.payment_token
        or transaction_obj.external_order_id
        or transaction_obj.gateway_transaction_id
        or transaction_obj.escrow_id
        or f"transaction-{transaction_obj.id}"
    )
    return ReceiptPayload(
        receipt_number=f"TW-PAY-{transaction_obj.id:06d}",
        recipient_email=getattr(user, "email", ""),
        customer_name=_profile_display_name(profile),
        item_name=f"Project payment - {getattr(project, 'project_title', 'TrustWork project')}",
        amount=getattr(bid, "project_total_cost", None),
        currency="XAF",
        payment_method=payment_method_label(transaction_obj.payment_type),
        payment_reference=str(reference),
        paid_at=transaction_obj.updated_at or transaction_obj.created_at,
        billing_period="Project bid payment",
    )


def _claim_subscription_receipt(subscription_id):
    return Subscriptions.objects.filter(
        id=subscription_id,
        receipt_email_sent_at__isnull=True,
    ).update(receipt_email_sent_at=timezone.now())


def _claim_transaction_receipt(transaction_id):
    return Transactions.objects.filter(
        id=transaction_id,
        receipt_email_sent_at__isnull=True,
    ).update(receipt_email_sent_at=timezone.now())


def _send_subscription_receipt(subscription_id):
    subscription = (
        Subscriptions.objects.select_related("profile__user")
        .filter(id=subscription_id)
        .first()
    )
    if not subscription or not _claim_subscription_receipt(subscription_id):
        return

    try:
        send_payment_receipt_email(_subscription_receipt_payload(subscription))
    except Exception:
        logger.exception("Unable to send subscription receipt email for %s", subscription_id)
        Subscriptions.objects.filter(id=subscription_id).update(receipt_email_sent_at=None)


def _send_transaction_receipt(transaction_id):
    transaction_obj = (
        Transactions.objects.select_related("bid", "project__client__user", "bid__project__client__user")
        .filter(id=transaction_id)
        .first()
    )
    if not transaction_obj or not _claim_transaction_receipt(transaction_id):
        return

    try:
        send_payment_receipt_email(_transaction_receipt_payload(transaction_obj))
    except Exception:
        logger.exception("Unable to send project payment receipt email for %s", transaction_id)
        Transactions.objects.filter(id=transaction_id).update(receipt_email_sent_at=None)


@receiver(post_save, sender=Subscriptions)
def send_subscription_receipt_on_activation(sender, instance, **kwargs):
    if (
        not instance.is_active
        or instance.receipt_email_sent_at
        or not instance.expire_at
        or instance.expire_at <= timezone.now()
    ):
        return
    transaction.on_commit(lambda: _send_subscription_receipt(instance.id))


@receiver(post_save, sender=Subscriptions)
def reward_referrer_on_subscription_activation(sender, instance, created, **kwargs):
    if (
        not created
        or not instance.is_active
        or not instance.expire_at
        or instance.expire_at <= timezone.now()
    ):
        return

    transaction.on_commit(
        lambda: handle_successful_referral_subscription(
            instance.profile.user,
            subscription_price=instance.receipt_amount or 0,
            provider=instance.receipt_payment_method or "subscription",
        )
    )


@receiver(post_save, sender=Transactions)
def send_project_payment_receipt_on_completion(sender, instance, **kwargs):
    if (
        instance.receipt_email_sent_at
        or str(instance.transaction_type or "").lower() != "collection"
        or str(instance.status or "").strip().lower() != "completed"
    ):
        return
    transaction.on_commit(lambda: _send_transaction_receipt(instance.id))
