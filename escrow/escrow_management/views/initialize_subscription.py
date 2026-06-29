import logging
from uuid import UUID

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from escrow_management.models import MtnSubscriptionTransaction
from escrow_management.tasks import check_subscription_status, generate_unique_code
from payment_handler.payment_gateways.MTN_MoMo.mtn_subscription import (
    MtnMoMoSubscription,
)
from payment_handler.payment_gateways.MTN_MoMo.utils import (
    is_mtn_account_active,
    mtn_failure_message,
    normalize_mtn_cameroon_msisdn,
)

logger = logging.getLogger("escrow_management.views.initialize_subscription")


def _normalize_mtn_subscription_status(status_value):
    normalized = str(status_value or "").strip().upper()
    if normalized in {"SUCCESS", "SUCCESSFUL", "SUCCESSFULL", "PAID"}:
        return "paid"
    if normalized in {"FAILED", "FAIL", "CANCELLED", "CANCELED", "EXPIRED"}:
        return "failed"
    return "pending"


def _subscription_response(subscription, provider_response=None):
    return {
        "subscription_id": str(subscription.id),
        "referenceId": str(subscription.reference_id) if subscription.reference_id else None,
        "reference_id": str(subscription.reference_id) if subscription.reference_id else None,
        "email": subscription.email,
        "amount": subscription.amount,
        "payment_status": subscription.payment_status,
        "subscription_frequency": subscription.subscription_frequency,
        "unique_code_status": subscription.unique_code_status,
        "provider_response": provider_response or {},
    }


class InitiateSubscription(APIView):
    @transaction.atomic
    def post(self,request):
        try:
            collection = MtnMoMoSubscription()

            amount = request.data.get("amount")
            phone_number = request.data.get("phone_number")
            email = request.data.get("email")
            subscription_frequency = request.data.get("subscription_frequency")

            try:
                phone_number = normalize_mtn_cameroon_msisdn(phone_number)
            except ValueError as exc:
                return Response({"status": "failed", "message": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

            account_status = collection.getAccountStatus(phone_number)
            if not is_mtn_account_active(account_status):
                return Response(
                    {
                        "status": "failed",
                        "message": "The MTN MoMo payer account was not found or is not active.",
                        "account_status": account_status,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            subscription = MtnSubscriptionTransaction.objects.create(
                subscription_frequency = subscription_frequency,
                email = email,
                amount = amount
            )
            response = collection.requestToPay(amount=amount, external_id=str(subscription.id), phone_number=phone_number)
            # print("Response: ", response)

            if response.get('status_code') not in {200, 201, 202}:
                subscription.delete()
                return Response({
                    "status": "failed",
                    "message": "Failed to send request.",
                    "provider_response": response.get("response_text", ""),
                }, status=status.HTTP_502_BAD_GATEWAY)

            subscription.reference_id = UUID(response.get('ref_id'))
            subscription.save()
            status_response=collection.getTransactionStatus(response.get('ref_id'))

            # print("status_response: ",status_response)
            logger.info("MTN Subscription Details:")
            logger.debug(f"status_response: {status_response}")
            logger.info("-" * 80)

            payment_status = str(status_response.get('status') or "").lower()
            if payment_status == "failed":
                # subscription.delete()
                subscription.payment_status = "failed"
                subscription.save()
                reason = status_response.get("reason", "")
                return Response({
                    "status": "failed",
                    "message": mtn_failure_message(reason),
                    "provider_reason": reason,
                }, status=status.HTTP_400_BAD_REQUEST)

            # ✅ Schedule Celery task after 10 minutes (only once)
            # run_at = datetime.now(timezone.utc) + timedelta(minutes=10)
            # check_subscription_status.apply_async(args=[str(subscription.id)], eta=run_at)
            check_subscription_status.apply_async(args=[str(subscription.id)], countdown=600, ignore_result=False)
            return Response({
                "response": status_response,
                "subscription_id": str(subscription.id),
                "referenceId": str(subscription.reference_id),
                "reference_id": str(subscription.reference_id),
                "payment_status": subscription.payment_status,
                "subscription_frequency": subscription.subscription_frequency,
                "amount": subscription.amount,
            })

        except Exception as e:
            return Response({
                "status": "error",
                "message": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SubscriptionCode(APIView):
    def post(self, request):
        try:
            code = request.data.get("code").strip()

            subscription = MtnSubscriptionTransaction.objects.get(unique_code=code, unique_code_status="active")
            data = {
                "id": str(subscription.id),
                "created_at": subscription.created_at,
                "updated_at": subscription.updated_at,
                "email": subscription.email,
                "amount": subscription.amount,
                "payment_status": subscription.payment_status,
                "unique_code": subscription.unique_code,
                "unique_code_status": subscription.unique_code_status,
                "subscription_frequency": subscription.subscription_frequency,
            }

            subscription.unique_code_status = "used"
            subscription.save()
            return Response(data)

        except MtnSubscriptionTransaction.DoesNotExist:
            return Response({"error": "Invalid subscription code or used code."})

        except Exception:
            return Response({"error": "Something went wrong."})


class MtnSubscriptionPreapprovalStatus(APIView):
    def get(self, request, reference_id):
        try:
            subscription = MtnSubscriptionTransaction.objects.filter(
                Q(reference_id=reference_id) | Q(id=reference_id)
            ).first()
        except (ValueError, ValidationError):
            subscription = None

        if not subscription:
            return Response(
                {"error": "Subscription reference not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        provider_response = {}
        if subscription.reference_id:
            try:
                provider_response = MtnMoMoSubscription().getTransactionStatus(
                    str(subscription.reference_id)
                )
            except Exception as exc:
                return Response(
                    {
                        "error": "Unable to fetch MTN preapproval status.",
                        "details": str(exc),
                    },
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            payment_status = _normalize_mtn_subscription_status(
                provider_response.get("status")
            )
            update_fields = ["payment_status", "updated_at"]
            subscription.payment_status = payment_status

            if payment_status == "paid" and not subscription.unique_code:
                subscription.unique_code = generate_unique_code()
                subscription.unique_code_status = "active"
                update_fields.extend(["unique_code", "unique_code_status"])

            subscription.save(update_fields=update_fields)

        return Response(_subscription_response(subscription, provider_response))
