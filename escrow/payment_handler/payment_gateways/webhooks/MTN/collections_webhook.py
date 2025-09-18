import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from escrow_management.models import Escrow,Transactions,Events, MtnSubscriptionTransaction
from uuid import UUID
from time import sleep
import string, random
from django.utils import timezone
import logging

logger = logging.getLogger("payment_handler.payment_gateways.webhooks.MTN.collections_webhook")

TRUSTWORK_BASE_API=settings.TRUSTWORK_BASE_API

class MtnCollectionWebhook(APIView):
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
            logger.info("MTN Callback url calling")
            logger.debug(f"request_data: {request_data}")
            logger.info("-" * 80)
            print("MTN Callback url calling")
            print("request_data: ",request_data)
            external_id = request_data.get("externalId")
            status = request_data.get("status", "").upper()
            payeenote = request_data.get("payeeNote", "").upper()

            if not external_id:
                return Response({"error": "Missing externalId"}, status=400)

            if payeenote == "SUBSCRIPTION":
                # Handle subscription payment
                try:
                    subscription = MtnSubscriptionTransaction.objects.get(id=UUID(external_id))
                except MtnSubscriptionTransaction.DoesNotExist:
                    logger.error(f"Subscription not found for externalId={external_id}")
                    return Response({"status": "ignored", "reason": "subscription_not_found"}, status=200)
                
                if subscription.payment_status in ["used", "paid"]:
                    return Response({"status": "ignored", "reason": "already_subscription_paid"}, status=200)
                
                subscription.payment_status = "paid" if status == "SUCCESSFUL" else "failed"
                subscription.save()

                if status == "SUCCESSFUL":
                    subscription.unique_code = self.generate_unique_code()
                    subscription.unique_code_status = "active"
                    subscription.save()
                    phone_no = request_data.get("payer", {}).get("partyId")
                    try:
                        url = f"{TRUSTWORK_BASE_API}/api/send_subscription_code/"
                        headers = {"Content-Type": "application/json"}
                        body = {
                            "code": subscription.unique_code,
                            "email": subscription.email,
                            "phone_no": phone_no
                        }
                        requests.post(url, json=body, headers=headers)
                    except requests.exceptions.RequestException as e:
                        logger.exception("Error sending subscription code")
                        print(f"Error during sending subscription code: {e}")
                return Response({"status": status}, status=200)
            
            else:
                # Handle escrow collection
                try:
                    escrow = Escrow.objects.get(id=UUID(external_id))
                except Escrow.DoesNotExist:
                    logger.error(f"Escrow not found for externalId={external_id}")
                    return Response({"status": "ignored", "reason": "Escrow_not_found"}, status=200)

                escrow.status = "collection_success" if status == "SUCCESSFUL" else "collection_failed"
                escrow.collection_date = timezone.now()
                escrow.save()

                transaction = (
                    Transactions.objects.filter(escrow=escrow, transaction_type="collection").order_by("-created_at").first()
                )
                if transaction:
                    transaction.status = "completed" if status == "SUCCESSFUL" else "failed"
                    transaction.save()

                Events.objects.create(
                    event_type=escrow.status,
                    event_description=f"MTN Collection callback received with status: {status}",
                    escrow=escrow
                )
                
                try:
                    url = f"{TRUSTWORK_BASE_API}/api/webhooks/escrow_collection/"
                    headers = {"Content-Type": "application/json"}
                    requests.post(url, json=request_data, headers=headers)
                except requests.exceptions.RequestException as e:
                    logger.error(f"Error during collection response sending: {e}")
                    print(f"Error during collection response sending: {e}")

                return Response({"status": status}, status=200)
        
        except Exception as e:
            logger.exception("Unexpected error in MTN callback handler")
            return Response({"error": str(e)}, status=500)
    
    @staticmethod
    def generate_unique_code():
        characters = string.ascii_uppercase + string.digits
        while True:
            length = random.randint(8, 16)  # Random length between 8 and 16
            code = ''.join(random.choices(characters, k=length))
            if not MtnSubscriptionTransaction.objects.filter(unique_code=code).exists():
                return code