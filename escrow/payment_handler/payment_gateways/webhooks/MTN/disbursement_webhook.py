import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from escrow_management.models import Escrow,Transactions,Events
from uuid import UUID
from time import sleep
from django.utils import timezone
TRUSTWORK_BASE_API=settings.TRUSTWORK_BASE_API

class MtnDisbursementWebhook(APIView):
    '''
    gets the transaction status for the given id
    
    {'financialTransactionId': '1732426759', 'externalId': '622f3da7-930d-4173-9945-88c2d7f79e02', 'amount': '100', 'currency': 'XAF', 'payer': {'partyIdType': 'MSISDN', 'partyId': '467331234521'}, "status": "SUCCESSFUL"}
    '''
    def post(self, request):
        return self.handle_callback(request.data)

    def put(self, request):
        return self.handle_callback(request.data)

    def handle_callback(self, request_data):
        from uuid import UUID
        from time import sleep
        sleep(2)

        try:
            external_id = request_data.get("externalId")
            status = request_data.get("status", "").upper()

            if not external_id:
                return Response({"error": "Missing externalId"}, status=400)

            escrow = Escrow.objects.get(id=UUID(external_id))

            escrow.status = "disbursement_success" if status == "SUCCESSFUL" else "disbursement_failed"
            escrow.disbursement_date = timezone.now()
            escrow.save()

            transaction = Transactions.objects.filter(escrow=escrow, transaction_type="disbursement").last()
            if transaction:
                transaction.status = "completed"
                transaction.save()

            Events.objects.create(
                event_type=escrow.status,
                event_description=f"MTN Disbursement callback received with status: {status}",
                escrow=escrow
            )

            url = f"{TRUSTWORK_BASE_API}/api/webhooks/escrow_disbursement/"
            headers = {"Content-Type": "application/json"}
            
            try:
                requests.post(url, json=request_data, headers=headers)
            except requests.exceptions.RequestException as e:
                print(f"Error during disbursement response sending: {e}")
                pass

            return Response({"status": status})

        except Escrow.DoesNotExist:
            return Response({"error": "Escrow not found"}, status=404)

        except Exception as e:
            return Response({"error": str(e)}, status=500)