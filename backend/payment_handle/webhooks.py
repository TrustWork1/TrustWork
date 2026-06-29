import base64
import hashlib
import json
import os
import uuid

import environ
import jwt
import requests
import stripe
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from profile_management.models import Subscriptions
from project_management.models import Bid, Notification, Transactions

env = environ.Env()
environ.Env.read_env(".env")
ESCROW_BASE_API = os.getenv('ESCROW_BASE_API')

stripe.api_key = settings.STRIPE_TEST_SECRET_KEY

class EscrowCollectionWebhook(APIView):
    permission_classes=[AllowAny]
    def post(self,request):
        """
        {'financialTransactionId': '1732426759', 'externalId': '622f3da7-930d-4173-9945-88c2d7f79e02', 'amount': '100', 'currency': 'XAF', 'payer': {'partyIdType': 'MSISDN', 'partyId': '467331234521'},

        """
        print("MTN Callback url called")
        print("Callback: ",request.data)
        data=request.data
        external_id = data.get("externalId")
        status = data.get("status", "").upper()

        if not external_id:
            return Response({"error": "Missing externalId"}, status=400)

        try:
            transaction=Transactions.objects.filter(escrow_id=external_id, transaction_type="collection").last()

            if status == "SUCCESSFUL":
                transaction.status = "completed"
                transaction.bid.status = "Accepted"
                transaction.bid.is_accepted = True
                transaction.project.status = "ongoing"

                transaction.bid.save()
                transaction.project.save()
                transaction.save()

                """
                Project/bid payment referral rewards are intentionally disabled.
                If business confirms project payments should count as referrals,
                call the project-payment referral helper here after collection
                success, using transaction.bid.project.client.user as payer.
                """
                # handle_successful_referral_project_payment(
                #     payer_user=transaction.bid.project.client.user,
                #     amount=transaction.bid.project_total_cost,
                #     provider="mtn_project_collection",
                # )

                Notification.objects.create(
                    sender=transaction.bid.project.client,
                    receiver=transaction.bid.project.client,
                    title="Payment Successfull",
                    message=f"Payment for project {transaction.bid.project.project_title} is successfull",
                    object_type="payment completed",
                    project_id=transaction.bid.project.id,
                    bid_id=transaction.bid.id
                )
            else:
                transaction.status = "failed"
                transaction.save()

                Notification.objects.create(
                    sender=transaction.bid.project.client,
                    receiver=transaction.bid.project.client,
                    title="Payment Failed",
                    message=f"Payment for project {transaction.bid.project.project_title} is failed",
                    object_type="payment not completed",
                    project_id=transaction.bid.project.id,
                    bid_id=transaction.bid.id
                )

            return Response({"message": f"Callback processed with status: {status}"}, status=200)

        except Transactions.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class EscrowDisbursementWebhook(APIView):
    permission_classes=[AllowAny]
    def post(self,request):
        """
        {'financialTransactionId': '1732426759', 'externalId': '622f3da7-930d-4173-9945-88c2d7f79e02', 'amount': '100', 'currency': 'XAF', 'payer': {'partyIdType': 'MSISDN', 'partyId': '467331234521'},

        """
        print("MTN Callback url called")
        print("Callback: ",request.data)
        data=request.data
        external_id = data.get("externalId")
        status = data.get("status", "").upper()

        if not external_id:
            return Response({"error": "Missing externalId"}, status=400)

        try:
            transaction=Transactions.objects.filter(escrow_id=external_id, transaction_type="disbursement").last()

            if status == "SUCCESSFUL":
                transaction.status="completed"
                transaction.project.status="completed"
                transaction.project.save()
                transaction.save()

                Notification.objects.create(
                    sender=transaction.bid.project.client,
                    receiver=transaction.bid.project.client,
                    title="Payment Received",
                    message=f"Payment Received for project {transaction.bid.project.project_title}",
                    object_type="payment completed",
                    project_id=transaction.bid.project.id,
                    bid_id=transaction.bid.id
                )
            else:
                transaction.status="failed"
                # transaction.project.status="completed"
                # transaction.project.save()
                transaction.save()

            return Response({"message": f"Callback processed with status: {status}"}, status=200)

        except Transactions.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


def convert_id_to_uuid(original_id):
    sha256_hash = hashlib.sha256(original_id.encode()).hexdigest()
    unique_id = uuid.UUID(sha256_hash[:32])

    return unique_id
class ProcessStripeSession(APIView):
    # def post(self, request):
    #     session_id = request.data.get('session_id')
    #     bid_id = request.data.get('bid_id')
    #     project_id = Bid.objects.get(id=bid_id).project.id
    #     project_details = Project.objects.get(id=project_id)
    #     bid_details = Bid.objects.get(id=bid_id)
    #     bid_details.status = "Accepted"
    #     project_details.status = "ongoing"
    #     bid_details.save()
    #     project_details.save()
    #     user_id = request.user.id
    #     uuid_session_id = convert_id_to_uuid(session_id)
    #     print("uuid_session_id", uuid_session_id)
    #     if not session_id and bid_id:
    #         return Response({'error': 'Session ID & Bid ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    #     payment = Transactions.objects.filter(bid_id=bid_id) # project_id=project_id, bid_id=bid_id,
    #     try:

    #         project_b_url = f"{ESCROW_BASE_API}/webhooks/stripe/process-session/" # stripe/api/process-stripe-session/   /stripe/process-session/"
    #     # project_b_url = "http://127.0.0.1:8000/webhooks/stripe/process-session/" # /stripe/process-session/"
    #         payload = {'session_id': session_id, 'bid_id':bid_id}
    #         response = requests.post(project_b_url, json=payload)
    #     except:
    #         pass
    #     payment_status=request.data.get("status",'')
    #     if "fail" in payment_status:
    #         payment.update(status="failed")
    #     else:
    #         payment.update(status='completed')

    #         return Response({'message': 'Payment Successfully'}, status=status.HTTP_200_OK)

    #     return Response({'error': 'Failed to process payment in Project B'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        session_id = request.data.get('session_id')
        bid_id = request.data.get('bid_id')

        if not session_id or not bid_id:
            return Response({'error': 'Session ID & Bid ID are required'}, status=status.HTTP_400_BAD_REQUEST)

        if not Bid.objects.filter(id=bid_id).exists():
            return Response({'error': 'Invalid bid_id'}, status=status.HTTP_404_NOT_FOUND)

        # Fetch bid and related project in a single query
        bid_details = Bid.objects.select_related("project").get(id=bid_id)
        project_details = bid_details.project

        uuid_session_id = convert_id_to_uuid(session_id)
        print("uuid_session_id", uuid_session_id)

        try:
            # Send request to external project
            project_b_url = f"{ESCROW_BASE_API}/webhooks/stripe/process-session/"
            payload = {'session_id': session_id, 'bid_id': bid_id}
            response = requests.post(project_b_url, json=payload)
            response_data = response.json()
        except requests.RequestException as e:
            return Response({'error': 'Failed to communicate with external service', 'details': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Fetch payment record
        payment = Transactions.objects.filter(bid_id=bid_id).last()
        if not payment:
            return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)

        # Handle payment status
        external_status = response_data.get('status', '').lower()
        # payment_status = request.data.get("status", "").lower()
        if "fail" in external_status:
            payment.status = "failed"
            payment.save()

            # Send failure notification to client and provider
            Notification.objects.create(
                receiver=payment.bid.project.client,
                title="Payment Failed",
                message=f"Your payment for project {payment.bid.project.project_title} has failed.",
                object_type = "payment failed",
                project_id = payment.bid.project.id,
                bid_id = payment.bid.id
            ).send_to_token(extra_data=json.dumps({"notification_type": "payment_failed"}))

            Notification.objects.create(
                receiver=payment.bid.service_provider,
                title="Payment Failed",
                message=f"The payment for the bid on project {payment.bid.project.project_title} has failed.",
                object_type = "payment failed",
                project_id = payment.bid.project.id,
                bid_id = payment.bid.id
            ).send_to_token(extra_data=json.dumps({"notification_type": "payment_failed"}))

            return Response({'message': 'Payment marked as failed'}, status=status.HTTP_200_OK)

        # If payment is successful, update status
        payment.status = "completed"
        payment.save()

        # Update project and bid status
        all_bid=Bid.objects.filter(project=project_details).exclude(id=bid_id)
        all_bid.update(status="Rejected", is_accepted=False)
        bid_details.status = "Accepted"
        bid_details.is_accepted = True
        project_details.status = "ongoing"
        bid_details.save()
        project_details.save()

        """
        Project/bid payment referral rewards are intentionally disabled.
        If business confirms project payments should count as referrals, call
        the project-payment referral helper here after Stripe collection success.
        """
        # handle_successful_referral_project_payment(
        #     payer_user=payment.bid.project.client.user,
        #     amount=payment.bid.project_total_cost,
        #     provider="stripe_project_collection",
        # )

        return Response({'message': 'Payment successfully processed'}, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class GooglePlayWebhookView(APIView):
    def post(self, request):
        message_data = request.data.get("message", {}).get("data")
        if not message_data:
            return Response({"error": "Invalid data"}, status=400)

        decoded = base64.b64decode(message_data).decode('utf-8')
        data = json.loads(decoded)
        # print("Decoded Payload:", data)

        subscription = data.get("subscriptionNotification")
        if not subscription:
            return Response({"message": "No subscription notification found"}, status=200)
        notification_type = subscription.get("notificationType")
        purchase_token = subscription.get("purchaseToken")  # Unique Token

        if notification_type in [3, 13] and purchase_token:  # 3 means CANCELED(play store)
            event = "CANCELED" if notification_type == 3 else "EXPIRED"
            print(event)
            updated = Subscriptions.objects.filter(purchase_token=purchase_token, is_active=True).update(is_active=False)
            return Response({"message": f"Canceled {updated} subscription(s)"}, status=200)

        return Response({"message": "Ignored or missing data"}, status=200)

@method_decorator(csrf_exempt, name='dispatch')
class AppStoreWebhookView(APIView):
    def post(self, request):
        signed_payload = request.data.get("signedPayload")
        if not signed_payload:
            return Response({"error": "Invalid data"}, status=400)

        try:
            # Decode outer signed payload
            payload = jwt.decode(signed_payload, options={"verify_signature": False})
            # print("Decoded Outer Payload:", json.dumps(payload, indent=2))

            data = payload.get("data", {})
            signed_transaction_info = data.get("signedTransactionInfo")

            if not signed_transaction_info:
                return Response({"error": "Missing signedTransactionInfo"}, status=400)

            transaction_info = jwt.decode(signed_transaction_info, options={"verify_signature": False})
            # print("Decoded Transaction Info:", json.dumps(transaction_info, indent=2))

            # renewal_info = jwt.decode(signed_renewal_info, options={"verify_signature": False})
            # print("Decoded Renewal Info:", json.dumps(renewal_info, indent=2))

            original_transaction_id = transaction_info.get("originalTransactionId")
            notification_type = payload.get("notificationType")

            if notification_type in ["CANCEL", "EXPIRED", "DID_CHANGE_RENEWAL_STATUS"] and original_transaction_id:
                event = "EXPIRED" if notification_type == "EXPIRED" else "CANCELED"
                print(event)
                updated = Subscriptions.objects.filter(
                    purchase_token=original_transaction_id,
                    is_active=True
                ).update(is_active=False)

                return Response({"message": f"Canceled {updated} subscription(s)"}, status=200)

            elif notification_type == "SUBSCRIBED" and original_transaction_id:
                # You can handle the new subscription here
                # Maybe store the transaction or mark the user as subscribed
                return Response({"message": "New subscription received"}, status=200)

            return Response({"message": "Notification processed but not actionable"}, status=200)

        except jwt.DecodeError:
            return Response({"error": "Invalid JWT format"}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
