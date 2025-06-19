import requests

from rest_framework.views import APIView
from rest_framework.response import Response
from escrow_management.models import Escrow,Transactions,Events
from uuid import UUID
from time import sleep
from django.utils import timezone
class MtnDisbursementWebhook(APIView):
    def post(self,request):
        '''
        gets the transaction status for the given id
        
        {'financialTransactionId': '1732426759', 'externalId': '622f3da7-930d-4173-9945-88c2d7f79e02', 'amount': '100', 'currency': 'EUR', 'payer': {'partyIdType': 'MSISDN', 'partyId': '467331234521'}, 
        '''
        sleep(10)
        print("DATA from ",request.data)
        escrow=Escrow.objects.get(id=UUID(request.data.get('externalId')))
        callback_url=escrow.external_callback_url
        requests.post(callback_url,json=request.data)
        if 'SUCCESSFUL' in request.data.get('status'):
            escrow.status='disbursement_success'
            escrow.disbursement_date=timezone.now()
            escrow.save()
            transaction=Transactions.objects.filter(escrow=escrow,transaction_type='disbursement').last()
            transaction.status='completed'
            transaction.save()
            Events.objects.create(event_type='disbursement_success',event_description="Payment Sent",escrow=escrow)
        else:
            escrow.status='disbursement_failed'
            escrow.disbursement_date=timezone.now()
            escrow.save()
            transaction=Transactions.objects.filter(escrow=escrow,transaction_type='disbursement').last()
            transaction.status='completed'
            transaction.save()
            Events.objects.create(event_type='disbursement_failed',event_description="Payment Failed",escrow=escrow)
            
        return Response({"status":request.data})
    def put(self,request):
        '''
        gets the transaction status for the given id
        '''
        sleep(10)
        print("DATA from ",request.data)
        escrow=Escrow.objects.get(id=UUID(request.data.get('externalId')))
        callback_url=escrow.external_callback_url
        requests.post(callback_url,json=request.data)
        if 'SUCCESSFUL' in request.data.get('status'):
            escrow.status='disbursement_success'
            escrow.disbursement_date=timezone.now()
            escrow.save()
            transaction=Transactions.objects.filter(escrow=escrow,transaction_type='disbursement').last()
            transaction.status='completed'
            transaction.save()
            Events.objects.create(event_type='disbursement_success',event_description="Payment Sent",escrow=escrow)
        else:
            escrow.status='disbursement_failed'
            escrow.disbursement_date=timezone.now()
            escrow.save()
            transaction=Transactions.objects.filter(escrow=escrow,transaction_type='disbursement').last()
            transaction.status='completed'
            transaction.save()
            Events.objects.create(event_type='disbursement_failed',event_description="Payment Failed",escrow=escrow)
            
        return Response({"status":request.data})