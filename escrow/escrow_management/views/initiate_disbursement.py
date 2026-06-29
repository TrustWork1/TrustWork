from uuid import UUID

from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from escrow_management.models import Escrow, Events, Transactions

# from payment_handler.payment_gateways.MTN_MoMo.collection import MtnMoMoCollection
from payment_handler.payment_gateways.MTN_MoMo.disbursement import MtnMoMoDisbursement
from payment_handler.payment_gateways.MTN_MoMo.utils import (
    is_mtn_account_active,
    mtn_failure_message,
    normalize_mtn_cameroon_msisdn,
)

disbursement=MtnMoMoDisbursement()

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



class InitiateDisbursementAPI(APIView):
    @transaction.atomic
    def post(self,request):
        """
        create a new Escrow , get or create  user, event create, Transaction Create
        """
        try:
            disbursement=MtnMoMoDisbursement()

            amount=request.data.get("amount")
            phone_number=request.data.get("phone_number")
            escrow_id=request.data.get("escrow_id")
            external_callback_url=request.data.get("callback_url")

            try:
                phone_number = normalize_mtn_cameroon_msisdn(phone_number)
            except ValueError as exc:
                return Response({"status": "failed", "message": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

            account_status = disbursement.getAccountStatus(phone_number)
            if not is_mtn_account_active(account_status):
                return Response(
                    {
                        "status": "failed",
                        "message": "The MTN MoMo payee account was not found or is not active.",
                        "account_status": account_status,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            escrow_obj=Escrow.objects.get(id=escrow_id)
            escrow_obj.external_callback_url=external_callback_url
            escrow_obj.payment_method += ", mtn-momo"
            escrow_obj.save()

            with transaction.atomic():
                Events.objects.create(event_type="disbursement_initialized", event_description="Disbursement request initialized", escrow=escrow_obj)
                response=disbursement.disburse(amount=amount, external_id=str(escrow_obj.id), phone_number=phone_number)
                # print("Response: ",response)

                if response.get("status_code") not in {200, 201, 202}:
                    escrow_obj.status = "disbursement_failed"
                    escrow_obj.save()
                    Events.objects.create(
                        event_type="disbursement_failed",
                        event_description="Failed to initiate disbursement",
                        escrow=escrow_obj
                    )
                    return Response(
                        {
                            "response": {"status": "failed"},
                            "message": "Failed to initiate disbursement",
                            "provider_response": response.get("response_text", ""),
                        },
                        status=status.HTTP_502_BAD_GATEWAY
                    )

                escrow_obj.disbursement_ref_id = UUID(response.get('ref'))
                escrow_obj.save()

                transaction_id=Transactions.objects.create(escrow=escrow_obj, amount=amount, status="pending", transaction_type="disbursement", payment_method="mtn-momo", external_transaction_id=response['ref'], external_callback_url=external_callback_url)
                status_response=disbursement.getTransactionStatus(response.get('ref'))
                # print("status_response: ",status_response)

                Events.objects.create(
                    event_type="disbursement_in_progress",
                    event_description="Disbursement is pending confirmation",
                    escrow=escrow_obj
                )

                payment_status = status_response.get("status", "").lower()

                if payment_status == "failed" or not payment_status:
                    escrow_obj.status = "disbursement_failed"
                    escrow_obj.save()
                    transaction_id.status = "failed"
                    transaction_id.save()

                    reason = status_response.get("reason", "Unknown failure")
                    Events.objects.create(
                        event_type="disbursement_failed",
                        event_description=reason,
                        escrow=escrow_obj
                    )
                    return Response(
                        {
                            "transaction_id": transaction_id.id,
                            "response": status_response,
                            "message": mtn_failure_message(reason),
                            "provider_reason": reason,
                            "escrow_id": escrow_obj.id,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                elif payment_status == "successful":
                    escrow_obj.status = "disbursement_success"
                    escrow_obj.save()
                    transaction_id.status = "completed"
                    transaction_id.save()

                    Events.objects.create(
                        event_type="disbursement_successful",
                        event_description="Funds successfully disbursed",
                        escrow=escrow_obj
                    )

            return Response({
                "transaction_id": transaction_id.id,
                "response": status_response,
                "escrow_id": escrow_obj.id
            })

        except Escrow.DoesNotExist:
            return Response({
                "status": "error",
                "message": "Invalid Escrow ID",
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                "status": "error",
                "message": "An unexpected error occurred.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DisbursementTransactionStatusAPI(APIView):
    def get(self,request,txn_id):
        '''
        gets the transaction status for the given id
        '''
        external_transaction_id=Transactions.objects.get(escrow__id=txn_id).external_transaction_id
        status=disbursement.getTransactionStatus(external_transaction_id )
        if status:
            print(status)
        return Response({"status":status})

class MtnAccountAddStatusAPI(APIView):
    def get(self,request):
        '''
        gets the MTN Account Valid or not status for storing for disbursement
        '''
        account_number=request.data.get("account_number")
        disbursement=MtnMoMoDisbursement()
        try:
            response=disbursement.getAccountStatus(account_number=account_number)
        except ValueError as exc:
            return Response({"result": False, "message": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(response, status=status.HTTP_200_OK)
