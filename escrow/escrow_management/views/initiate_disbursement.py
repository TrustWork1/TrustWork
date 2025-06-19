from rest_framework.views import APIView
from rest_framework.response import Response
from escrow_management.models import *
# from payment_handler.payment_gateways.MTN_MoMo.collection import MtnMoMoCollection
from payment_handler.payment_gateways.MTN_MoMo.disbursement import MtnMoMoDisbursement
from django.db import transaction
import json
import re
from rest_framework import status
collection=MtnMoMoDisbursement()

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
        collection=MtnMoMoDisbursement()

        phone_number=request.data.get("phone_number")
        escrow_id=request.data.get("escrow_id")
        escrow_obj=Escrow.objects.get(id=escrow_id)
        payee=escrow_obj.payee
        external_callback_url=request.data.get("callback_url")
        escrow_obj.external_callback_url=external_callback_url
        escrow_obj.save()
        with transaction.atomic():
            Events.objects.create(event_type="disbursement_initialized",event_description="",escrow=escrow_obj)
            # collection=MtnMoMoCollection()
            response=collection.disburse(amount=escrow_obj.amount,external_id=str(escrow_obj.id),phone_number=phone_number,payernote='MTN_Momo',payermessage='Disbursement')
            print(response)
            status=collection.getTransactionStatus(response.get('ref'))
            print(status)
            Events.objects.create(event_type="disbursement_in_progress",event_description="",escrow=escrow_obj)
            transaction_id=Transactions.objects.create(escrow=escrow_obj,amount=escrow_obj.amount,status="pending",transaction_type="disbursement",payment_method="mtn-momo",external_transaction_id=response['ref'],external_callback_url=external_callback_url)
        
        
        return Response({"transaction_id":transaction_id.id,'response':status})
    
class DisbursementTransactionStatusAPI(APIView):
    def get(self,request,txn_id):
        '''
        gets the transaction status for the given id
        '''
        external_transaction_id=Transactions.objects.get(escrow__id=txn_id).external_transaction_id
        # collection=MtnMoMoCollection()
        status=collection.getTransactionStatus(external_transaction_id )
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
        response=disbursement.getAccountStatus(account_number=account_number)
        return Response(response, status=status.HTTP_200_OK)

    
# login(
#     url="http://192.168.6.55/",
#     usernameId="username",
#     username="admin",
#     passwordId="password",
#     password="Admin@123",
#     submit_button_selector="btn.btn-primary.login-btn",
#     target_button_selector="btn"  
# )

