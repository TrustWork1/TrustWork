from rest_framework.views import APIView
from rest_framework.response import Response
from escrow_management.models import MtnSubscriptionTransaction
from payment_handler.payment_gateways.MTN_MoMo.mtn_subscription import MtnMoMoSubscription
import json
import re
from django.db import transaction
from rest_framework import status
import logging
from uuid import UUID


logger = logging.getLogger(__name__)


class InitiateSubscription(APIView):
    @transaction.atomic
    def post(self,request):
        try:
            collection = MtnMoMoSubscription()
            
            amount = request.data.get("amount")
            phone_number = request.data.get("phone_number")
            email = request.data.get("email")
            subscription_frequency = request.data.get("subscription_frequency")
            
            subscription = MtnSubscriptionTransaction.objects.create(
                subscription_frequency = subscription_frequency,
                email = email,
                amount = amount
            )
            response = collection.requestToPay(amount=amount, external_id=str(subscription.id), phone_number=phone_number)
            # print("Response: ", response)
            
            if response.get('status_code') == 500:
                subscription.delete()
                return Response({"status": "failed", "message": "Failed to send request."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            subscription.reference_id = UUID(response.get('ref_id'))
            subscription.save()
            status_response=collection.getTransactionStatus(response.get('ref_id'))
            # print("status_response: ",status_response)
            logger.info("MTN Subscription Details:")
            logger.debug(f"status_response: {status_response}")
            logger.info("-" * 80)
            
            payment_status = status_response.get('status')
            if payment_status.lower() == "failed":
                subscription.delete()
                return Response({"status": "failed", "message": "Invalid phone number."}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"response": status_response, "subscription_id": str(subscription.id)})
        
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

        except Exception as e:
            return Response({"error": "Something went wrong."})