import logging
import random
import string

import requests
from celery import shared_task
from django.conf import settings

from orange_management.models import (
    OrangeMtnSubscriptionTransaction,
    OrangePayTransaction,
)
from payment_handler.payment_gateways.orange.client import check_payment_status

TRUSTWORK_BASE_API = settings.TRUSTWORK_BASE_API
logger = logging.getLogger("orange_management.tasks")


def _normalize_payment_status(status_value: str | None) -> str:
    normalized = (status_value or "").strip().upper()
    status_map = {
        "SUCCESSFULL": "SUCCESS",
        "SUCCESSFUL": "SUCCESS",
        "SUCCESS": "SUCCESS",
        "AUTHORIZED": "AUTHORIZED",
        "FAILED": "FAILED",
        "CANCELLED": "CANCELLED",
        "CANCELED": "CANCELLED",
        "EXPIRED": "FAILED",
        "PENDING": "PENDING",
    }
    return status_map.get(normalized, "PENDING")


def _extract_payment_state(payload: dict | None) -> tuple[str, dict]:
    payload = payload or {}
    data = payload.get("data") or {}
    status_value = (
        data.get("status")
        or payload.get("status")
        or data.get("paymentStatus")
        or payload.get("paymentStatus")
    )
    return _normalize_payment_status(status_value), data


def generate_unique_code() -> str:
    characters = string.ascii_uppercase + string.digits
    while True:
        length = random.randint(8, 16)
        code = "".join(random.choices(characters, k=length))
        if not OrangeMtnSubscriptionTransaction.objects.filter(unique_code=code).exists():
            return code


def _is_subscription_payment(payment_type: str | None) -> bool:
    return str(payment_type or "").lower() in {
        "subscription",
        "orange_subscription",
        "orange_website_subscription",
        "orange_mtn_subscription",
    }


def _is_website_subscription_payment(payment_type: str | None) -> bool:
    return str(payment_type or "").lower() in {
        "website_subscription",
        "orange_website_subscription",
    }


def notify_trustwork_orange_payment(
    txn: OrangePayTransaction,
    api_response: dict | None = None,
    payment_state: str | None = None,
):
    """Dispatch async Celery task to notify Trustwork. Retries automatically on failure."""
    if not TRUSTWORK_BASE_API:
        logger.warning("TRUSTWORK_BASE_API not set; skipping Orange payment notification.")
        return

    status_value = _normalize_payment_status(
        payment_state or _extract_payment_state(api_response)[0] or txn.status
    )
    notify_trustwork_orange_payment_task.delay(txn.id, status_value)


@shared_task(bind=True, name="notify_trustwork_orange_payment_task", max_retries=5)
def notify_trustwork_orange_payment_task(self, txn_id: int, payment_state: str):
    if not TRUSTWORK_BASE_API:
        logger.warning("TRUSTWORK_BASE_API not set; skipping Orange payment notification.")
        return

    try:
        txn = OrangePayTransaction.objects.prefetch_related("subscriptions").get(id=txn_id)
    except OrangePayTransaction.DoesNotExist:
        logger.error("OrangePayTransaction id=%s not found; cannot notify Trustwork.", txn_id)
        return

    subscription = txn.subscriptions.order_by("-created_at").first()
    status_value = _normalize_payment_status(payment_state)

    try:
        if _is_subscription_payment(txn.payment_type) and subscription:
            if _is_website_subscription_payment(txn.payment_type):
                logger.info(
                    "Skipping code notification for website Orange subscription order_id=%s",
                    txn.order_id,
                )
                return
            if status_value != "SUCCESS":
                return
            url = f"{TRUSTWORK_BASE_API}/api/send_subscription_code/"
            body = {
                "code": subscription.unique_code,
                "email": subscription.email,
                "phone_no": txn.subscriber_msisdn,
            }
        else:
            url = f"{TRUSTWORK_BASE_API}/api/orange_payment_success/"
            body = {
                "status": status_value,
                "order_id": txn.order_id,
                "pay_token": txn.pay_token,
                "orange_txn_id": txn.orange_txn_id or txn.transaction_id,
                "amount": str(txn.amount),
                "phone_no": txn.subscriber_msisdn,
                "user_id": txn.user_id,
                "project_id": txn.project_id,
                "bid_id": txn.bid_id,
                "payment_type": txn.payment_type,
                "description": txn.description,
            }

        response = requests.post(url, json=body, timeout=10)
        response.raise_for_status()
        logger.info(
            "Trustwork notification sent for order_id=%s status=%s (attempt %d/%d)",
            txn.order_id, status_value, self.request.retries + 1, self.max_retries + 1,
        )

    except requests.exceptions.RequestException as exc:
        countdown = min(30 * (2 ** self.request.retries), 600)
        logger.warning(
            "Trustwork notification failed for order_id=%s (attempt %d/%d), retrying in %ds: %s",
            txn.order_id, self.request.retries + 1, self.max_retries + 1, countdown, exc,
        )
        raise self.retry(exc=exc, countdown=countdown) from exc


def finalize_orange_payment(txn: OrangePayTransaction, api_response: dict | None = None):
    subscription = txn.subscriptions.order_by("-created_at").first()
    if subscription:
        update_fields = ["payment_status"]
        if not subscription.unique_code:
            subscription.unique_code = generate_unique_code()
            subscription.unique_code_status = "active"
            update_fields.extend(["unique_code", "unique_code_status"])
        subscription.payment_status = "success"
        subscription.save(update_fields=update_fields)

    """
    Referral rewards belong to TrustWork because it owns user/referral data.
    Escrow only notifies TrustWork about Orange success; project-payment
    referral rewards should stay inactive unless the business approves them.
    """
    notify_trustwork_orange_payment(txn, api_response, payment_state="SUCCESS")


@shared_task(bind=True, name="check_orange_payment_status")
def check_orange_payment_status(self, transaction_db_id: int):
    logger.info("Checking Orange payment status for transaction id=%s", transaction_db_id)

    try:
        txn = OrangePayTransaction.objects.get(id=transaction_db_id)
    except OrangePayTransaction.DoesNotExist:
        logger.error("OrangePayTransaction id=%s not found", transaction_db_id)
        return {"transaction_id": transaction_db_id, "error": "not_found"}

    if txn.status not in {"PENDING", "AUTHORIZED"}:
        return {"transaction_id": transaction_db_id, "status": txn.status}

    try:
        result = check_payment_status(txn.pay_token)
    except requests.HTTPError as exc:
        response_text = exc.response.text if exc.response is not None else ""
        logger.error("Orange status API HTTP error for id=%s: %s", transaction_db_id, response_text)
        return {"transaction_id": transaction_db_id, "error": "http_error"}
    except requests.Timeout:
        logger.error("Orange status API timed out for id=%s", transaction_db_id)
        return {"transaction_id": transaction_db_id, "error": "timeout"}
    except Exception as exc:
        logger.exception("Unexpected Orange status polling error for id=%s", transaction_db_id)
        return {"transaction_id": transaction_db_id, "error": str(exc)}

    payment_state, inner_data = _extract_payment_state(result)
    txn.status = payment_state
    txn.orange_txn_id = inner_data.get("id") or txn.orange_txn_id
    txn.transaction_id = inner_data.get("txnid") or txn.transaction_id
    txn.transaction_mode = inner_data.get("txnMode") or inner_data.get("txnmode") or txn.transaction_mode
    txn.confirm_txn_status = str(inner_data.get("confirmtxnstatus") or result.get("confirmtxnstatus") or "")
    txn.confirm_txn_message = inner_data.get("confirmtxnmessage") or result.get("confirmtxnmessage")
    txn.raw_response = result
    txn.save(
        update_fields=[
            "status",
            "orange_txn_id",
            "transaction_id",
            "transaction_mode",
            "confirm_txn_status",
            "confirm_txn_message",
            "raw_response",
            "updated_at",
        ]
    )

    if payment_state == "SUCCESS":
        finalize_orange_payment(txn, result)
        return {"transaction_id": transaction_db_id, "status": "SUCCESS"}

    if payment_state in {"FAILED", "CANCELLED"}:
        txn.subscriptions.update(payment_status="failed")
        notify_trustwork_orange_payment(txn, result, payment_state=payment_state)
        return {"transaction_id": transaction_db_id, "status": payment_state}

    retries_done = self.request.retries
    max_retries = 3
    if retries_done < max_retries:
        raise self.retry(countdown=300, max_retries=max_retries)

    logger.warning("Orange transaction id=%s still pending after retries", transaction_db_id)
    return {"transaction_id": transaction_db_id, "status": "PENDING"}
