import stripe
from django.conf import settings
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import requests
from rest_framework.permissions import IsAuthenticated
from escrow_management.models import Escrow,Events
# from escrow_management.models import EscrowTransaction, Project

stripe.api_key = settings.STRIPE_SECRET_KEY
import os
import environ
env = environ.Env()
environ.Env.read_env(".env")
TRUSTWORK_BASE_API = os.getenv('TRUSTWORK_BASE_API')
ESCROW_BASE_API = os.getenv('ESCROW_BASE_API')

# class CreateEscrowPayment(APIView):
#     """Handles client payment into escrow account."""

#     def post(self, request):
#         try:
#             project_id = request.data["project_id"]
#             amount = request.data["amount"] 
#             currency = "usd"
#             client_stripe_id = request.data["client_stripe_id"]

#             payment_intent = stripe.PaymentIntent.create(
#                 amount=amount,
#                 currency=currency,
#                 payment_method_types=["card"],
#                 customer=client_stripe_id,
#                 confirm=True
#             )

#             escrow = EscrowTransaction.objects.create(
#                 project_id=project_id,
#                 client_stripe_id=client_stripe_id,
#                 amount=amount / 100, 
#                 currency=currency,
#                 stripe_payment_intent=payment_intent["id"],
#                 status="held"
#             )
#             return Response({"message": "Payment successful, funds hold in escrow.", "escrow_id": escrow.id}, status=status.HTTP_201_CREATED)

#         except stripe.error.StripeError as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# class ReleaseEscrowPayment(APIView):
#     """Releases payment from escrow to provider upon project completion."""

#     def post(self, request):
#         try:
#             project_id = request.data["project_id"]
#             project = Project.objects.get(id=project_id)

#             escrow = EscrowTransaction.objects.get(project_id=project_id, status="held")
#             provider_stripe_id = project.provider.stripe_account_id

#             total_amount = escrow.amount * 100 
#             service_fee = (settings.SERVICE_FEE_PERCENTAGE / 100) * total_amount
#             payout_amount = total_amount - service_fee  

#             transfer = stripe.Transfer.create(
#                 amount=int(payout_amount),
#                 currency="usd",
#                 destination=provider_stripe_id,
#                 transfer_group=f"project_{project_id}"
#             )
#             escrow.status = "released"
#             escrow.save()

#             return Response({"message": "Payment released to provider.", "transfer_id": transfer["id"]}, status=status.HTTP_200_OK)

#         except stripe.error.StripeError as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProcessPaymentAPIView(APIView):
    def post(self, request):
        project_id = request.data.get("project_id")
        client_id = request.data.get("client_id")
        provider_id = request.data.get("provider_id")
        amount = request.data.get("amount")
        currency = request.data.get("currency")

        if not all([project_id, client_id, provider_id, amount, currency]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  
                currency=currency,
                payment_method_types=["card"],
            )

            payment_status = intent["status"]
            transaction_id = intent["id"]

            payment_response = {
                "project_id": project_id,
                "client_id": client_id,
                "provider_id": provider_id,
                "transaction_id": transaction_id,
                "status": payment_status,
                "amount": amount,
                "currency": currency,
            }

            project_a_url = settings.PROJECT_A_URL + "/api/payment-response/"
            response = requests.post(project_a_url, json=payment_response)

            return Response(payment_response, status=status.HTTP_200_OK)

        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


 
 # New Implementation


# Implementation
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from escrow_management.models import StripePayment, Transactions
import uuid
from django.core.exceptions import ValidationError

import uuid, hashlib
def convert_id_to_uuid(original_id):
    sha256_hash = hashlib.sha256(original_id.encode()).hexdigest()
    unique_id = uuid.UUID(sha256_hash[:32])
    return unique_id
class ProcessStripeSession(APIView):
    def post(self, request):
        session_uuid = request.data.get("session_id")
        session_id = request.data.get('payment_intent_id')
        user_id = request.data.get('user_id')
        project_id = request.data.get('project_id', '')
        bid_id = request.data.get('bid_id', '')
        # payment_method = request.data.get('payment_method')
        amount = request.data.get('amount')
        currency = request.data.get('currency')
        payment_id = convert_id_to_uuid(session_id)
        print("payment_id", payment_id)
        if not project_id and bid_id:
            return Response({'error': 'Session ID and User ID are required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # project_id = get_object_or_404(pk=bid_id).project_id
            if not session_id or not user_id:
                return Response({'error': 'Session ID and User ID are required'}, status=status.HTTP_400_BAD_REQUEST)
            if session_id:
                # # session = stripe.checkout.Session.retrieve(session_uuid)
                # # stripe_session = stripe.PaymentIntent.retrieve(session_id)
                # # payment_intent_id = session.payment_intent
                # payment_intent = stripe.PaymentIntent.retrieve(session_id)
                # print("stripe_session", payment_intent)
                # if payment_intent.status == 'succeeded':
                transaction_uuid = str(uuid.uuid4())
                # if transaction_uuid:
                #     try:
                #         transaction = Transactions.objects.create(escrow=transaction_uuid, amount=amount, status='pending',  external_transaction_id=payment_id, external_callback_url='') # transaction_type="", payment_method='',
                #         # transaction.full_clean() 
                #         # transaction.save()
                #     except ValidationError as e:
                #         print(f"Validation error: {e}")
                if transaction_uuid:
                # transaction = Transactions.objects.create(escrow=transaction_uuid, amount=amount, status='pending', transaction_type="collection", payment_method='card', external_transaction_id=payment_id, external_callback_url=f'{ESCROW_BASE_API}/stripe/api/process-stripe-session/payment-success/')
                    payment = StripePayment.objects.create(session_id=session_id, user_id=user_id, amount = amount, currency = currency, project_id=project_id, bid_id=bid_id, external_transaction_id=transaction_uuid, status='pending') # payment_method=payment_method,
                else:
                    return Response({'error': 'Transaction UUID is required'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'message': 'Session received, waiting for Stripe confirmation'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PaymentStatus(APIView):
    def get(self, request, session_id):
        payment = get_object_or_404(StripePayment, session_id=session_id)
        print("payment", payment)
        return Response({'session_id': session_id, 'status': payment.status})


class ReleasePayout(APIView):
    def post(self, request):
        payment_intent_id = request.data.get('payment_intent_id', '')
        project_id = request.data.get('project_id')
        escrow_ids = request.data.get('escrow_id', '')
        bid_id = request.data.get('bid_id', '')
        amount = request.data.get('amount', '')
        stripe_payment_id = request.data.get('stripe_account_id', '')
        currency = request.data.get('currency', 'usd')
        # payment_method = request.data.get('payment_method', 'stripe')
        escrow_id = Transactions.objects.filter(escrow_id=escrow_ids)
        print("escrow_id", escrow_id)
        if not escrow_id:
            return Response({'error': 'Escrow ID not found'}, status=status.HTTP_400_BAD_REQUEST)
        # escrow = escrow_id.last()
        amount = Escrow.objects.get(id=escrow_id).amount
        transection_id = Transactions.objects.get(id=escrow_id).external_transaction_id
        method = Escrow.objects.get(id=escrow_id).payment_method
        try:
            if transection_id and method == "stripe":
                transfer = stripe.Transfer.create(
                    amount=amount,
                    currency=currency,
                    destination=stripe_payment_id,
                    transfer_group="payout"
                    )
                transfer_details = stripe.Transfer.retrieve(transfer.id)
                if transfer_details.status == 'succeeded':
                    transection_id.status = "transfered"
                    transection_id.save()                
                transection_id.status = "transfered"
                transection_id.save()
                return Response({'message': 'Payout Completed', 'tranfer_id': transfer.id}, status=status.HTTP_200_OK)
        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StripeDisbursementAPI(APIView):
    def post(self, request):
        try:
            escrow_id = request.data.get("escrow_id", "")
            stripe_account_id = request.data.get("stripe_account_id", "")
            external_callback_url = request.data.get("callback_url", "")

            escrow_obj = Escrow.objects.get(id=escrow_id)

            total_amount_dollars = float(escrow_obj.amount)
            amount_cents = int(total_amount_dollars * 100)

            acct = stripe.Account.retrieve(stripe_account_id)
            country = acct["country"]
            currency = acct["default_currency"]
            account_type = acct["type"]
            # print("Connected Account Country:", country)
            # print("Connected Account Type:", account_type)
            # print("Connected Account Currency:", currency)

            Events.objects.create(
                event_type="disbursement_initialized", event_description="", escrow=escrow_obj
            )

            transfer = stripe.Transfer.create(
                amount=amount_cents,
                currency="usd",
                destination=stripe_account_id,
            )
            transfer_details = stripe.Transfer.retrieve(transfer.id)

            Events.objects.create(
                event_type="disbursement_in_progress", event_description="", escrow=escrow_obj
            )

            payout = stripe.Payout.create(
                amount=amount_cents,
                currency="usd",
                stripe_account=stripe_account_id,
            )
            print("STATUS: ",payout.status)
            
            transaction = Transactions.objects.create(
                escrow=escrow_obj,
                amount=total_amount_dollars,
                status="pending",
                transaction_type="disbursement",
                payment_method="stripe",
                external_transaction_id=payout.id,
                external_callback_url=external_callback_url
            )

            return Response(
                {"transaction":str(transaction.id), "status": payout.status, "response":transfer_details},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print(str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


STRIPE_WEBHOOK_SECRET = settings.STRIPE_PAYOUT_WEBHOOK_SECRET

class StripeDisbursementWebhook(APIView):
    def post(self, request):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            print("⚠️ Invalid payload:", e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            print("⚠️ Invalid signature:", e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Handle payout events
        if event["type"] == "payout.paid":
            payment_status="paid"
            payout = event["data"]["object"]
            payout_id = payout["id"]

            try:
                transaction = Transactions.objects.get(external_transaction_id=payout_id)
                transaction.status = "completed"
                transaction.save()
                Events.objects.create(
                    event_type="disbursement_success", event_description="", escrow=transaction.escrow
                )

                escrow_obj = transaction.escrow
                escrow_obj.status = "disbursement_success"
                escrow_obj.disbursement_date = timezone.now()
                escrow_obj.save()

                print(f"Payout {payout_id} marked as completed.")
            except Transactions.DoesNotExist:
                print(f"No transaction found for payout {payout_id}")

        elif event["type"] == "payout.failed":
            payment_status="failed"
            payout = event["data"]["object"]
            payout_id = payout["id"]

            try:
                transaction = Transactions.objects.get(external_transaction_id=payout_id)
                transaction.status = "failed"
                transaction.save()
                Events.objects.create(
                    event_type="disbursement_failed", event_description="", escrow=transaction.escrow
                )

                escrow_obj = transaction.escrow
                escrow_obj.status = "disbursement_failed"
                escrow_obj.disbursement_date = timezone.now()
                escrow_obj.save()

                print(f"Payout {payout_id} marked as failed.")
            except Transactions.DoesNotExist:
                print(f"No transaction found for payout {payout_id}")
        
        url = f"{TRUSTWORK_BASE_API}/api/stripe-payment-status/"
        headers = {"Content-Type": "application/json"}
        data = {
            "escrow_id": str(transaction.escrow.id),
            "payment_status": payment_status
        }
        try:
            response = requests.put(url, json=data, headers=headers)
            print(response.json())
        except requests.exceptions.RequestException as e:
            print(f"Error during disbursement initialization: {e}")

        return Response(status=status.HTTP_200_OK)