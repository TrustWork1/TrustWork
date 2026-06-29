from django.conf import settings
from django.core.mail import send_mail
from django.db import IntegrityError, transaction
from django.template.loader import render_to_string

from customuser.models import CustomUser
from profile_management.models import Coupons

REFERRAL_REWARD_RATE = 0.05


def _to_float(value):
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


def _to_int(value):
    try:
        return int(float(value or 0))
    except (TypeError, ValueError):
        return 0


def _format_amount(value):
    rounded = round(float(value or 0), 2)
    if rounded.is_integer():
        return str(int(rounded))
    return str(rounded)


def _sync_discount_flag(user):
    has_active_coupon = Coupons.objects.filter(user=user, is_active=True).exists()
    if user.is_discount != has_active_coupon:
        user.is_discount = has_active_coupon
        user.save(update_fields=["is_discount"])


def _consume_active_coupon(user):
    coupon = Coupons.objects.filter(user=user, is_active=True).first()
    if coupon:
        coupon.is_active = False
        coupon.save(update_fields=["is_active", "updated_at"])
    _sync_discount_flag(user)


def _send_referral_success_email(referrer, referred_user, reward_amount, provider):
    if not referrer.email:
        return False

    referred_name = referred_user.full_name or referred_user.email or "A referred user"
    provider_label = (provider or "subscription").replace("_", " ").title()
    message = (
        f"{referred_name} has completed a successful {provider_label} payment. "
        f"Your successful referral count has been updated."
    )
    if reward_amount:
        message += f" Referral reward amount: {reward_amount}."

    try:
        html_message = render_to_string(
            "email_temp.html",
            {
                "title": "Successful Referral Completed",
                "otp": message,
                "image": getattr(settings, "TRUSTWORK_BASE_API", ""),
            },
        )
        sent_count = send_mail(
            subject="Successful Referral Completed",
            message=message,
            html_message=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[referrer.email],
            fail_silently=False,
        )
        return sent_count > 0
    except Exception:
        return False


def handle_successful_referral_subscription(user, subscription_price=0, provider="subscription"):
    """
    Reward a referrer exactly once after the referred user completes a paid
    subscription. The existing Coupons.from_user unique marker is used as the
    idempotency key, so subscription renewals do not inflate the people count.
    """
    result = {
        "rewarded": False,
        "email_sent": False,
        "reason": "",
        "referrer_id": None,
    }

    with transaction.atomic():
        subscriber = CustomUser.objects.select_for_update().get(pk=user.pk)
        _consume_active_coupon(subscriber)

        referral_code = (subscriber.referred_by_code or "").strip()
        if not referral_code:
            result["reason"] = "no_referral_code"
            return result

        referrer = (
            CustomUser.objects.select_for_update()
            .filter(user_referal_code=referral_code)
            .exclude(pk=subscriber.pk)
            .first()
        )
        if not referrer:
            result["reason"] = "invalid_referral_code"
            return result

        result["referrer_id"] = referrer.id
        if Coupons.objects.select_for_update().filter(from_user=str(subscriber.pk)).exists():
            result["reason"] = "already_rewarded"
            return result

        reward_amount = _to_float(subscription_price) * REFERRAL_REWARD_RATE
        referrer.total_referal_amount = _format_amount(
            _to_float(referrer.total_referal_amount) + reward_amount
        )
        referrer.total_referal_count = str(_to_int(referrer.total_referal_count) + 1)
        referrer.is_discount = True
        referrer.save(
            update_fields=[
                "total_referal_amount",
                "total_referal_count",
                "is_discount",
            ]
        )

        try:
            Coupons.objects.create(user=referrer, from_user=str(subscriber.pk))
        except IntegrityError:
            result["reason"] = "already_rewarded"
            return result

        result["rewarded"] = True
        result["reason"] = "rewarded"

    result["email_sent"] = _send_referral_success_email(
        referrer=referrer,
        referred_user=user,
        reward_amount=_format_amount(reward_amount),
        provider=provider,
    )
    return result


def handle_successful_referral_project_payment(*args, **kwargs):
    """
    Intentionally inactive for now.

    Project/bid payment referral rewards should not run until the business
    confirms that project payments count as referrals. If that rule is approved,
    successful project collection callbacks can call this function or delegate to
    handle_successful_referral_subscription with a new idempotency marker that is
    separate from subscription referrals.
    """
    return {"rewarded": False, "reason": "project_payment_referral_disabled"}
