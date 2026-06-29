import json
import logging
import re
import uuid
from decimal import Decimal, InvalidOperation

import requests
from django.conf import settings
from django.db import transaction
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from orange_management.models import (
    OrangeMtnSubscriptionTransaction,
    OrangePayTransaction,
)
from orange_management.tasks import (
    check_orange_payment_status,
    finalize_orange_payment,
    notify_trustwork_orange_payment,
)
from orange_management.utils import get_access_token
from payment_handler.payment_gateways.orange.client import check_payment_status

logger = logging.getLogger(__name__)

API_URL = settings.ORANGE_API_URL
X_AUTH_TOKEN = settings.ORANGE_X_AUTH_TOKEN
CHANNEL_USER_MSISDN = settings.ORANGE_MSISDN
PIN = settings.ORANGE_PIN


CUSTOMER_MSISDN_ERROR = "Use a valid Cameroon Orange Money number, e.g. 6XXXXXXXX or +2376XXXXXXXX."
CHANNEL_MSISDN_ERROR = (
    "Orange merchant number is not configured correctly. "
    "Please set CHANNEL_USER_MSISDN in escrow-microservice .env."
)


def _normalize_cameroon_msisdn(msisdn: str, *, is_channel: bool = False) -> str:
    digits = re.sub(r"\D", "", str(msisdn or ""))
    if digits.startswith("00"):
        digits = digits[2:]
    if digits.startswith("237") and len(digits) > 9:
        digits = digits[3:]
    if digits.startswith("0") and len(digits) > 9:
        digits = digits[1:]
    if not re.fullmatch(r"6\d{8}", digits):
        raise ValueError(CHANNEL_MSISDN_ERROR if is_channel else CUSTOMER_MSISDN_ERROR)
    return digits


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


def _website_subscription_response(txn: OrangePayTransaction, api_response: dict | None = None) -> dict:
    subscription = txn.subscriptions.order_by("-created_at").first()
    payment_status = "pending"
    if txn.is_success():
        payment_status = "paid"
    elif txn.is_failed():
        payment_status = "failed"

    return {
        "subscription_id": str(subscription.id) if subscription else None,
        "referenceId": txn.pay_token,
        "reference_id": txn.pay_token,
        "orderId": txn.order_id,
        "payToken": txn.pay_token,
        "orangeTransactionId": txn.orange_txn_id or txn.transaction_id or txn.id,
        "email": subscription.email if subscription else None,
        "amount": str(txn.amount),
        "payment_status": payment_status,
        "provider_status": txn.status,
        "subscription_frequency": (
            subscription.subscription_frequency if subscription else None
        ),
        "provider_response": api_response or txn.raw_response or {},
    }


def _format_orange_amount(amount) -> str:
    try:
        amount_value = Decimal(str(amount))
    except (InvalidOperation, TypeError, ValueError) as exc:
        raise ValueError("Invalid amount format.") from exc

    if amount_value < Decimal("10"):
        raise ValueError("Orange amount must be at least 10 FCFA.")
    if amount_value != amount_value.to_integral_value():
        raise ValueError("Orange amount must be a whole FCFA amount.")
    return str(int(amount_value))


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


def _parse_orange_http_error(response_text: str) -> tuple[str, dict | None]:
    try:
        payload = json.loads(response_text or "{}")
    except (TypeError, ValueError):
        return response_text or "Orange API error.", None

    if not isinstance(payload, dict):
        return "Orange API error.", None

    data = payload.get("data") if isinstance(payload.get("data"), dict) else {}
    message = (
        payload.get("message")
        or data.get("inittxnmessage")
        or data.get("confirmtxnmessage")
        or "Orange API error."
    )
    return message, payload


def initiate_payment(amount, subscriber, notif_url, description="Payment") -> dict:
    token = get_access_token()
    subscriber_msisdn = _normalize_cameroon_msisdn(subscriber)
    channel_user_msisdn = _normalize_cameroon_msisdn(CHANNEL_USER_MSISDN, is_channel=True)
    amount_text = _format_orange_amount(amount)
    if subscriber_msisdn == channel_user_msisdn:
        raise ValueError("subscriberMsisdn must be a customer number, not the merchant number.")

    init_response = requests.post(
        f"{API_URL}omcoreapis/1.0.2/mp/init",
        headers={
            "X-AUTH-TOKEN": X_AUTH_TOKEN,
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        timeout=15,
    )
    init_response.raise_for_status()

    init_data = init_response.json().get("data") or {}
    pay_token = init_data.get("payToken")
    if not pay_token:
        raise ValueError("Orange init response did not include payToken.")

    order_id = f"ORD-{uuid.uuid4().hex[:10].upper()}"
    payload = {
        "notifUrl": notif_url,
        "channelUserMsisdn": channel_user_msisdn,
        "amount": amount_text,
        "subscriberMsisdn": subscriber_msisdn,
        "pin": PIN,
        "orderId": order_id,
        "description": str(description or "Payment")[:50],
        "payToken": pay_token,
    }

    pay_response = requests.post(
        f"{API_URL}omcoreapis/1.0.2/mp/pay",
        headers={
            "X-AUTH-TOKEN": X_AUTH_TOKEN,
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        json=payload,
        timeout=20,
    )
    pay_response.raise_for_status()

    return {
        "orderId": order_id,
        "payToken": pay_token,
        "data": pay_response.json(),
    }


@method_decorator(csrf_exempt, name="dispatch")
class OrangePaymentView(APIView):
    def post(self, request):
        try:
            amount = request.data.get("amount")
            subscriber_msisdn = request.data.get("subscriberMsisdn")
            description = request.data.get("description", "Payment")
            user_id = request.data.get("user_id")
            project_id = request.data.get("project_id")
            bid_id = request.data.get("bid_id")
            payment_type = request.data.get("payment_type", "orange_project")
            email = request.data.get("email")
            subscription_frequency = request.data.get("subscription_frequency")
            is_subscription = _is_subscription_payment(payment_type)

            required_fields = {
                "amount": amount,
                "subscriberMsisdn": subscriber_msisdn,
            }
            if is_subscription:
                required_fields.update(
                    {
                        "email": email,
                        "subscription_frequency": subscription_frequency,
                    }
                )
            else:
                required_fields.update(
                    {
                        "user_id": user_id,
                        "project_id": project_id,
                        "bid_id": bid_id,
                    }
                )
            missing_fields = [field for field, value in required_fields.items() if not value]
            if missing_fields:
                return Response(
                    {
                        "success": False,
                        "message": f"Missing required fields: {', '.join(missing_fields)}.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                amount = float(amount)
            except (TypeError, ValueError):
                return Response(
                    {"success": False, "message": "Invalid amount format."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if amount <= 0:
                return Response(
                    {"success": False, "message": "Amount must be positive."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                subscriber_msisdn = _normalize_cameroon_msisdn(subscriber_msisdn)
                channel_user_msisdn = _normalize_cameroon_msisdn(CHANNEL_USER_MSISDN, is_channel=True)
            except ValueError as exc:
                return Response(
                    {"success": False, "message": str(exc)},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if subscriber_msisdn == channel_user_msisdn:
                return Response(
                    {
                        "success": False,
                        "message": "subscriberMsisdn must be a customer number, not the merchant number.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # existing_txn = OrangePayTransaction.objects.filter(
            #     subscriber_msisdn=subscriber_msisdn,
            #     amount=amount,
            #     status="PENDING",
            # ).first()
            # if existing_txn:
            #     return Response(
            #         {
            #             "success": True,
            #             "message": "Payment already initiated.",
            #             "orderId": existing_txn.order_id,
            #             "payToken": existing_txn.pay_token,
            #             "orangeTransactionId": existing_txn.id,
            #         },
            #         status=status.HTTP_200_OK,
            #     )

            notif_url = request.build_absolute_uri(reverse("orange-notify"))
            result = initiate_payment(
                amount=amount,
                subscriber=subscriber_msisdn,
                notif_url=notif_url,
                description=description,
            )
            logger.info("Orange payment initiated for user_id=%s order_id=%s", user_id, result.get("orderId"))

            orange_response = result.get("data") or {}
            payment_state, inner_data = _extract_payment_state(orange_response)

            with transaction.atomic():
                txn = OrangePayTransaction.objects.create(
                    user_id=user_id,
                    project_id=project_id,
                    bid_id=bid_id,
                    payment_type=payment_type,
                    order_id=result.get("orderId"),
                    pay_token=result.get("payToken"),
                    subscriber_msisdn=subscriber_msisdn,
                    channel_user_msisdn=channel_user_msisdn,
                    amount=amount,
                    orange_txn_id=inner_data.get("id"),
                    transaction_id=inner_data.get("txnid"),
                    transaction_mode=inner_data.get("txnMode") or inner_data.get("txnmode"),
                    status=payment_state,
                    init_txn_status=str(orange_response.get("status") or ""),
                    init_txn_message=orange_response.get("message"),
                    confirm_txn_status=str(inner_data.get("confirmtxnstatus") or ""),
                    confirm_txn_message=inner_data.get("confirmtxnmessage"),
                    description=description,
                    notif_url=notif_url,
                    raw_response=orange_response,
                )

                subscription_txn = None
                if is_subscription:
                    subscription_txn = OrangeMtnSubscriptionTransaction.objects.create(
                        orange_transaction=txn,
                        email=email,
                        amount=amount,
                        subscription_frequency=subscription_frequency,
                        reference_id=txn.order_id,
                        payment_status="pending",
                    )

            if txn.status in {"PENDING", "AUTHORIZED"}:
                try:
                    check_orange_payment_status.apply_async(args=[txn.id], countdown=600)
                except Exception:
                    logger.exception("Unable to schedule Orange status polling for txn_id=%s", txn.id)
            elif txn.status == "SUCCESS":
                finalize_orange_payment(txn, orange_response)

            response_payload = {
                "success": True,
                "message": "Payment initiated successfully.",
                "orderId": txn.order_id,
                "payToken": txn.pay_token,
                "orangeTransactionId": txn.id,
                "project_id": txn.project_id,
                "bid_id": txn.bid_id,
                "payment_type": txn.payment_type,
                "status": txn.status,
                "data": orange_response,
            }
            if subscription_txn:
                response_payload["subscriptionTransactionId"] = subscription_txn.id

            return Response(
                response_payload,
                status=status.HTTP_200_OK,
            )

        except ValueError as exc:
            return Response(
                {"success": False, "message": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except requests.HTTPError as exc:
            response_text = exc.response.text if exc.response is not None else ""
            provider_message, provider_detail = _parse_orange_http_error(response_text)
            response_status = status.HTTP_502_BAD_GATEWAY
            if exc.response is not None and 400 <= exc.response.status_code < 500:
                response_status = status.HTTP_400_BAD_REQUEST
            logger.error("Orange API HTTP error during initiate: %s", response_text)
            return Response(
                {
                    "success": False,
                    "message": provider_message,
                    "detail": provider_detail or response_text,
                },
                status=response_status,
            )
        except requests.Timeout:
            logger.error("Orange API request timed out during initiate.")
            return Response(
                {"success": False, "message": "Orange API timeout. Please retry."},
                status=status.HTTP_504_GATEWAY_TIMEOUT,
            )
        except Exception as exc:
            logger.exception("Unexpected error in OrangePaymentView")
            return Response(
                {
                    "success": False,
                    "message": "Internal server error.",
                    "detail": str(exc),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@method_decorator(csrf_exempt, name="dispatch")
class OrangeNotifyView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        payload = request.data if isinstance(request.data, dict) else {}
        order_id = payload.get("orderId")
        pay_token = payload.get("payToken")
        txnid = payload.get("txnid")
        payment_state, inner_data = _extract_payment_state(payload)

        logger.info(
            "Orange webhook received for order_id=%s payment_state=%s txnid=%s",
            order_id,
            payment_state,
            txnid,
        )

        if not order_id:
            return Response(
                {"received": False, "message": "Missing orderId."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            txn = OrangePayTransaction.objects.get(order_id=order_id)
        except OrangePayTransaction.DoesNotExist:
            logger.error("Orange webhook transaction not found for order_id=%s", order_id)
            return Response({"received": True}, status=status.HTTP_200_OK)

        txn.status = payment_state
        txn.transaction_id = txnid or inner_data.get("txnid") or txn.transaction_id
        txn.orange_txn_id = inner_data.get("id") or txn.orange_txn_id
        txn.transaction_mode = inner_data.get("txnMode") or inner_data.get("txnmode") or txn.transaction_mode
        txn.pay_token = pay_token or txn.pay_token
        txn.confirm_txn_status = str(inner_data.get("confirmtxnstatus") or payload.get("confirmtxnstatus") or "")
        txn.confirm_txn_message = inner_data.get("confirmtxnmessage") or payload.get("confirmtxnmessage")
        txn.raw_response = payload
        txn.save(
            update_fields=[
                "status",
                "transaction_id",
                "orange_txn_id",
                "transaction_mode",
                "pay_token",
                "confirm_txn_status",
                "confirm_txn_message",
                "raw_response",
                "updated_at",
            ]
        )

        if payment_state == "SUCCESS":
            finalize_orange_payment(txn, payload)
        elif payment_state in {"FAILED", "CANCELLED"}:
            txn.subscriptions.update(payment_status="failed")
            notify_trustwork_orange_payment(txn, payload, payment_state=payment_state)

        return Response({"received": True}, status=status.HTTP_200_OK)


class SubscriptionCode(APIView):
    def post(self, request):
        try:
            code = (request.data.get("code") or "").strip()
            if not code:
                return Response(
                    {"error": "Code is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            subscription = OrangeMtnSubscriptionTransaction.objects.get(
                unique_code=code,
                unique_code_status="active",
            )
            data = {
                "id": str(subscription.id),
                "created_at": subscription.created_at,
                "email": subscription.email,
                "amount": subscription.amount,
                "payment_status": subscription.payment_status,
                "unique_code": subscription.unique_code,
                "unique_code_status": subscription.unique_code_status,
                "subscription_frequency": subscription.subscription_frequency,
            }

            subscription.unique_code_status = "used"
            subscription.save(update_fields=["unique_code_status"])
            return Response(data, status=status.HTTP_200_OK)

        except OrangeMtnSubscriptionTransaction.DoesNotExist:
            return Response(
                {"error": "Invalid subscription code or used code."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception:
            logger.exception("Unexpected error while validating Orange subscription code")
            return Response(
                {"error": "Something went wrong."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PaymentStatusView(APIView):
    def get(self, request, txn_id):
        try:
            txn = (
                OrangePayTransaction.objects.filter(orange_txn_id=txn_id).first()
                or OrangePayTransaction.objects.filter(order_id=txn_id).first()
                or OrangePayTransaction.objects.filter(pay_token=txn_id).first()
            )

            if not txn:
                return Response(
                    {"error": "Transaction not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(
                {
                    "order_id": txn.order_id,
                    "pay_token": txn.pay_token,
                    "status": txn.status,
                    "init_status": txn.init_txn_status,
                    "confirm_status": txn.confirm_txn_status,
                    "amount": txn.amount,
                    "project_id": txn.project_id,
                    "bid_id": txn.bid_id,
                    "payment_type": txn.payment_type,
                    "subscriber_msisdn": txn.subscriber_msisdn,
                    "transaction_id": txn.transaction_id,
                    "orange_txn_id": txn.orange_txn_id,
                    "message": {
                        "init": txn.init_txn_message,
                        "confirm": txn.confirm_txn_message,
                    },
                    "is_success": txn.is_success(),
                    "is_failed": txn.is_failed(),
                    "is_pending": txn.is_pending(),
                    "created_at": txn.created_at,
                    "updated_at": txn.updated_at,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as exc:
            logger.exception("Unexpected error in PaymentStatusView")
            return Response(
                {"error": str(exc)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class OrangePaymentStatusView(APIView):
    def get(self, request, pay_token):
        if not pay_token:
            return Response(
                {"success": False, "message": "payToken is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = check_payment_status(pay_token)
            payment_state, _ = _extract_payment_state(result)
            return Response(
                {"success": True, "status": payment_state, "data": result},
                status=status.HTTP_200_OK,
            )
        except requests.HTTPError as exc:
            response_text = exc.response.text if exc.response is not None else ""
            logger.error("Orange status check HTTP error: %s", response_text)
            return Response(
                {
                    "success": False,
                    "message": "Orange API error.",
                    "detail": response_text,
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except Exception:
            logger.exception("Unexpected error in OrangePaymentStatusView")
            return Response(
                {"success": False, "message": "Internal server error."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class OrangeSubscriptionStatusView(APIView):
    """Refresh and return website Orange subscription status by payment reference."""

    def get(self, request, reference_id):
        txn = (
            OrangePayTransaction.objects.filter(pay_token=reference_id).first()
            or OrangePayTransaction.objects.filter(order_id=reference_id).first()
            or OrangePayTransaction.objects.filter(orange_txn_id=reference_id).first()
            or OrangePayTransaction.objects.filter(transaction_id=reference_id).first()
        )
        if not txn:
            return Response(
                {"error": "Orange subscription reference not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        if not _is_subscription_payment(txn.payment_type):
            return Response(
                {"error": "Orange reference is not a subscription payment."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        api_response = txn.raw_response or {}
        if txn.is_pending():
            try:
                api_response = check_payment_status(txn.pay_token)
            except requests.HTTPError as exc:
                response_text = exc.response.text if exc.response is not None else ""
                logger.error("Orange subscription status HTTP error: %s", response_text)
                return Response(
                    {
                        "error": "Orange API error.",
                        "detail": response_text,
                    },
                    status=status.HTTP_502_BAD_GATEWAY,
                )
            except requests.Timeout:
                return Response(
                    {"error": "Orange API timeout. Please retry."},
                    status=status.HTTP_504_GATEWAY_TIMEOUT,
                )
            except Exception as exc:
                logger.exception("Unexpected Orange subscription status error")
                return Response(
                    {"error": "Unable to fetch Orange subscription status.", "detail": str(exc)},
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            payment_state, inner_data = _extract_payment_state(api_response)
            txn.status = payment_state
            txn.orange_txn_id = inner_data.get("id") or txn.orange_txn_id
            txn.transaction_id = inner_data.get("txnid") or txn.transaction_id
            txn.transaction_mode = (
                inner_data.get("txnMode")
                or inner_data.get("txnmode")
                or txn.transaction_mode
            )
            txn.confirm_txn_status = str(
                inner_data.get("confirmtxnstatus")
                or api_response.get("confirmtxnstatus")
                or ""
            )
            txn.confirm_txn_message = (
                inner_data.get("confirmtxnmessage")
                or api_response.get("confirmtxnmessage")
            )
            txn.raw_response = api_response
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
                subscription = txn.subscriptions.order_by("-created_at").first()
                if subscription:
                    subscription.payment_status = "success"
                    subscription.save(update_fields=["payment_status"])
                if not _is_website_subscription_payment(txn.payment_type):
                    finalize_orange_payment(txn, api_response)
            elif payment_state in {"FAILED", "CANCELLED"}:
                txn.subscriptions.update(payment_status="failed")
                if not _is_website_subscription_payment(txn.payment_type):
                    notify_trustwork_orange_payment(
                        txn,
                        api_response,
                        payment_state=payment_state,
                    )

        return Response(_website_subscription_response(txn, api_response))


class OkResponseView(APIView):

    def get(self, request):
        return Response(
            {"message": "OK"},
            status=status.HTTP_200_OK
        )
