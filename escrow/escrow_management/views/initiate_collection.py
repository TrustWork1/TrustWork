from uuid import UUID

import stripe
from django.conf import settings
from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from escrow_management.models import Escrow, Events, Transactions
from payment_handler.payment_gateways.MTN_MoMo.collection import MtnMoMoCollection
from payment_handler.payment_gateways.MTN_MoMo.utils import (
    is_mtn_account_active,
    mtn_failure_message,
    normalize_mtn_cameroon_msisdn,
)
from payment_handler.payment_gateways.stripe.collection import stripe_collection
from user_management.models import User


def validate_json_structure(data):
    if not isinstance(data, dict):
        return False

    if 'amount' not in data or 'currency' not in data:
        return False

    if 'payer' not in data or 'payee' not in data:
        return False

    if not isinstance(data['payer'], dict) or not isinstance(data['payee'], dict):
        return False

    # Check for required keys inside 'payer' and 'payee'
    for role in ['payer', 'payee']:
        role_data = data[role]

        if 'mobile_number' not in role_data or 'email' not in role_data:
            return False

    return True



class InitiatePaymentAPI(APIView):
    @transaction.atomic
    def post(self,request):
        """
        create a new Escrow , get or create user, event create, Transaction Create
        """
        try:
            collection=MtnMoMoCollection()


            # if not validate_json_structure(request.data):
            #     return Response({"message":"Invalid Json"})

            amount=request.data.get("amount")
            phone_number=request.data.get("phone_number")
            external_resource_id=request.data.get("external_resource_id")
            external_callback_url=request.data.get("callback_url")
            payer=request.data.get("payer")
            payee=request.data.get("payee")

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

            payer,_=User.objects.get_or_create(phone_number=payer['mobile_number'], email=payer['email'])
            payee,_=User.objects.get_or_create(phone_number=payee['mobile_number'], email=payee['email'])

            escrow=Escrow.objects.create(amount=amount, external_resource_id=external_resource_id, status="pending", payer=payer, payee=payee, external_callback_url=external_callback_url, payment_method="mtn-momo")
            Events.objects.create(event_type="collection_initialized", event_description="", escrow=escrow)

            response=collection.requestToPay(amount=amount, external_id=str(escrow.id), phone_number=phone_number)
            # print("Response: ",response)

            if response.get('status_code') not in {200, 201, 202}:
                escrow.status = "collection_failed"
                escrow.save()
                Events.objects.create(event_type="collection_failed", event_description="Payment initiation failed", escrow=escrow)
                return Response({
                    "response": {"status": "failed"},
                    "message": "Failed to initiate payment",
                    "provider_response": response.get("response_text", ""),
                }, status=status.HTTP_502_BAD_GATEWAY)

            Events.objects.create(event_type="collection_in_progress", event_description="", escrow=escrow)
            escrow.collection_ref_id = UUID(response.get('ref'))
            escrow.save()
            status_response=collection.getTransactionStatus(response.get('ref'))
            # print("status_response: ",status_response)

            payment_status = str(status_response.get('status') or "").lower()

            if payment_status == "pending":
                transaction_id=Transactions.objects.create(escrow=escrow, amount=amount, status="pending", transaction_type="collection", payment_method="mtn-momo", external_transaction_id=response['ref'], external_callback_url=external_callback_url)

            elif payment_status == "failed":
                escrow=Escrow.objects.get(id=escrow.id, external_resource_id=external_resource_id, payment_method="mtn-momo")
                escrow.status = "collection_failed"
                escrow.save()
                transaction_id=Transactions.objects.create(escrow=escrow, amount=amount, status="failed", transaction_type="collection", payment_method="mtn-momo", external_transaction_id=response['ref'], external_callback_url=external_callback_url)
                reason = status_response.get("reason", "")
                Events.objects.create(event_type="collection_failed", event_description=reason, escrow=escrow)
                return Response(
                    {
                        "transaction_id": transaction_id.id,
                        "response": status_response,
                        "message": mtn_failure_message(reason),
                        "provider_reason": reason,
                        "escrow_id": escrow.id,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            elif payment_status == "successful":
                escrow.status = "collection_success"
                escrow.save()
                transaction_id=Transactions.objects.create(escrow=escrow, amount=amount, status="completed", transaction_type="collection", payment_method="mtn-momo", external_transaction_id=response['ref'], external_callback_url=external_callback_url)

            else:
                transaction_id=Transactions.objects.create(escrow=escrow, amount=amount, status="pending", transaction_type="collection", payment_method="mtn-momo", external_transaction_id=response['ref'], external_callback_url=external_callback_url)

            return Response({"transaction_id":transaction_id.id, 'response':status_response, "escrow_id":escrow.id})

        except Exception as e:
            return Response({
                "status": "error",
                "message": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TransactionStatusAPI(APIView):
    def get(self,request,txn_id):
        '''
        gets the transaction status for the given id
        '''
        collection=MtnMoMoCollection()

        external_transaction_id=Transactions.objects.get(escrow__id=txn_id).external_transaction_id
        # collection=MtnMoMoCollection()
        status=collection.getTransactionStatus(external_transaction_id )
        if status:
            print(status)
        return Response({"status":status})


class ValidMtnAccount(APIView):
    def get(self,request):
        '''
        gets the MTN Account Valid or not status for collection payment
        '''
        account_number=request.data.get("account_number")
        collection=MtnMoMoCollection()
        try:
            response=collection.getAccountStatus(account_number=account_number)
        except ValueError as exc:
            return Response({"result": False, "message": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(response, status=status.HTTP_200_OK)


class InitiateStripeCollection(APIView):
    def post(self,request):
        amount=float(request.data.get("amount"))
        external_resource_id=request.data.get("external_resource_id")
        external_callback_url=request.data.get("callback_url")
        payer=request.data.get("payer")
        payee=request.data.get("payee")

        payer,_=User.objects.get_or_create(external_user_id=payer['user_id'])
        payee,_=User.objects.get_or_create(external_user_id=payee['user_id'])

        escrow=Escrow.objects.create(amount=amount, external_resource_id=external_resource_id, status="pending", payer=payer, payee=payee, external_callback_url=external_callback_url, payment_method="stripe")
        Events.objects.create(event_type="collection_initialized", event_description="", escrow=escrow)
        # collection=MtnMoMoCollection()
        transaction=Transactions.objects.create(escrow=escrow, amount=amount, status="pending", transaction_type="collection", payment_method="stripe", external_callback_url=external_callback_url)

        response=stripe_collection(amount,escrow.id, transaction.id)
        transaction.external_transaction_id=response['payment_id']
        transaction.save()
        Events.objects.create(event_type="collection_in_progress", event_description="", escrow=escrow)

        return Response({"transaction_id":transaction.id, "escrow_id":escrow.id, **response} )


STRIPE_COLLECTION_WEBHOOK_SECRET = settings.STRIPE_COLLECTION_WEBHOOK_SECRET
class StripeCollectionStatus(APIView):
    def post(self, request):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_COLLECTION_WEBHOOK_SECRET
            )
        except ValueError as e:
            print("⚠️ Invalid payload:", e)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            print("⚠️ Invalid signature:", e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        # Handle successful payment
        if event["type"] == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            payment_id = payment_intent["id"]

            try:
                transaction = Transactions.objects.get(external_transaction_id=payment_id)
                transaction.status = "completed"
                transaction.save()

                escrow_obj = transaction.escrow
                escrow_obj.status = "collection_success"
                escrow_obj.save()

                Events.objects.create(
                    event_type="collection_success",
                    event_description="Stripe payment succeeded",
                    escrow=escrow_obj
                )

                """
                Project/bid payment referral rewards are intentionally not
                applied in escrow. TrustWork owns users/referral counters and
                should handle that only if project payments are approved for
                referral rewards later.
                """

                print(f"PaymentIntent {payment_id} marked as completed.")
            except Transactions.DoesNotExist:
                print(f"No transaction found for PaymentIntent {payment_id}")

        # Handle failed payment
        elif event["type"] == "payment_intent.payment_failed":
            payment_intent = event["data"]["object"]
            payment_id = payment_intent["id"]

            try:
                transaction = Transactions.objects.get(external_transaction_id=payment_id)
                transaction.status = "failed"
                transaction.save()

                escrow_obj = transaction.escrow
                escrow_obj.status = "collection_failed"
                escrow_obj.save()

                Events.objects.create(
                    event_type="collection_failed",
                    event_description="Stripe payment failed",
                    escrow=escrow_obj
                )

                print(f"PaymentIntent {payment_id} marked as failed.")
            except Transactions.DoesNotExist:
                print(f"No transaction found for PaymentIntent {payment_id}")

        return Response(status=status.HTTP_200_OK)
