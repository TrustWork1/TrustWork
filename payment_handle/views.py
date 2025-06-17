from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.permissions import AllowAny
from .models import EscrowTransaction
from .models import EscrowCustomer, DisbursementMethod, BankAddress
from .serializers import EscrowCustomerSerializer, EscrowTransactionSerializer, PaymentTransactionDetailSerializer, ConfirmTransactionSerializer
from django.conf import settings
import requests
from django.db import transaction
from django.contrib.auth.models import User

from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import PaymentTransaction
from .serializers import PaymentTransactionDetailSerializer
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from .models import PaymentTransaction
from rest_framework import status, generics
from rest_framework.response import Response
from .models import PaymentTransaction
from .serializers import PaymentTransactionDetailSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from .models import PaymentTransaction
from .serializers import ConfirmTransactionSerializer
# Create your views here.

# Escrow Payment Transection APIView
class CreateEscrowCustomerView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = EscrowCustomerSerializer(data=request.data)
        
        if serializer.is_valid():
            data = serializer.validated_data
            disbursement_methods_payload = []
            for disbursement_method_data in data['disbursement_methods']:
                disbursement_methods_payload.append({
                    "account_name": disbursement_method_data['account_name'],
                    "account_type": disbursement_method_data['account_type'],
                    "bank_aba_routing_number": disbursement_method_data['bank_aba_routing_number'],
                    "bank_account_number": disbursement_method_data['bank_account_number'],
                    "bank_address": {
                        "city": disbursement_method_data['bank_address']['city'],
                        "state": disbursement_method_data['bank_address']['state'],
                        "country": disbursement_method_data['bank_address']['country']
                    },
                    "bank_name": disbursement_method_data['bank_name'],
                    "currency": disbursement_method_data['currency'],
                    "type": disbursement_method_data['type']
                    #get('type', 'ach')
                })

                # disbursement_methods_payload.append({
                #     "account_name": disbursement_method_data['account_name'],
                #     "account_type": disbursement_method_data['account_type'],
                #     "bank_aba_routing_number": disbursement_method_data['bank_aba_routing_number'],
                #     "bank_account_number": disbursement_method_data['bank_account_number'],
                #     "bank_address": {
                #         "city": disbursement_method_data['bank_address']['city'],
                #         "state": disbursement_method_data['bank_address']['state'],
                #         "country": disbursement_method_data['bank_address']['country']
                #     },
                #     "bank_name": disbursement_method_data['bank_name'],
                #     "currency": disbursement_method_data['currency'],
                #     "type": disbursement_method_data['type']
                # })

            payload = {
                "email": data['email'],
                "first_name": data['first_name'],
                "middle_name": data.get('middle_name', ""),
                "last_name": data['last_name'],
                "address": {
                    "line1": data['address_line1'],
                    "line2": data.get('address_line2', ""),
                    "city": data['city'],
                    "state": data['state'],
                    "country": data['country'],
                    "post_code": data['post_code']
                },
                "date_of_birth": data['date_of_birth'].strftime('%Y-%m-%d'),
                "phone_number": data['phone_number'],
                "disbursement_methods": disbursement_methods_payload,
                "webhooks": [{
                    "url": data.get('webhook_url', '')
                }]
            }

            escrow_url = 'https://api.escrow.com/2017-09-01/customer'
            email = settings.ESCROW_API_EMAIL
            api_key = settings.ESCROW_API_KEY

            try:
                response = requests.post(escrow_url, auth=(email, api_key), json=payload)
                response_data = response.json()

                if response.status_code == 201:
                    with transaction.atomic():
                        escrow_customer, created = EscrowCustomer.objects.update_or_create(
                            email=data['email'],
                            defaults={
                                'first_name': data['first_name'],
                                'middle_name': data.get('middle_name', ""),
                                'last_name': data['last_name'],
                                'address_line1': data['address_line1'],
                                'address_line2': data.get('address_line2', ""),
                                'city': data['city'],
                                'state': data['state'],
                                'country': data['country'],
                                'post_code': data['post_code'],
                                'phone_number': data['phone_number'],
                                'escrow_customer_id': response_data.get('id')
                            }
                        )

                        disbursement_methods_data = data['disbursement_methods']
                        for disbursement_method_data in disbursement_methods_data:
                            bank_address_data = disbursement_method_data['bank_address']
                            bank_address = BankAddress.objects.create(
                                city=bank_address_data['city'],
                                state=bank_address_data['state'],
                                country=bank_address_data['country'] 
                            )
                            DisbursementMethod.objects.create(
                                escrow_customer=escrow_customer,
                                account_name=disbursement_method_data['account_name'],
                                account_type=disbursement_method_data['account_type'],
                                bank_aba_routing_number=disbursement_method_data['bank_aba_routing_number'],
                                bank_account_number=disbursement_method_data['bank_account_number'],
                                bank_address=bank_address,
                                bank_name=disbursement_method_data['bank_name'],
                                currency=disbursement_method_data['currency'],
                                type=disbursement_method_data['type']
                            )

                    status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
                    return Response(response_data, status=status_code)
                else:
                    return Response(response_data, status=response.status_code)

            except requests.RequestException as e:
                return Response({"error": "Failed to communicate with Escrow API", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CreateEscrowTransactionView(APIView):
    def post(self, request):
        buyer_email = request.data.get('buyer_email')
        seller_email = request.data.get('seller_email')
        amount = request.data.get('amount')
        description = request.data.get('description')
        item_title = request.data.get('item_title')
        item_description = request.data.get('item_description')
        seller_phone = request.data.get('seller_phone')

        if not buyer_email or not seller_email or not amount:
            return Response({"error": "Buyer email, seller email, and amount are required fields."}, status=status.HTTP_400_BAD_REQUEST)

        escrow_url = 'https://api.escrow.com/2017-09-01/transaction'
        email = settings.ESCROW_API_EMAIL
        api_key = settings.ESCROW_API_KEY

        payload = {
            "parties": [
                {
                    "role": "buyer",
                    "customer": buyer_email,
                    "initiator": True 
                },
                {
                    "role": "seller",
                    "customer": seller_email
                }
            ],
            "currency": "usd",
            "description": description,
            "items": [
                {
                    "title": item_title,
                    "description": item_description,
                    "type": "domain_name",
                    "inspection_period": 259200,
                    "quantity": 1,
                    "schedule": [
                        {
                            "amount": amount,
                            "payer_customer": buyer_email,
                            "beneficiary_customer": seller_email
                        }
                    ],
                    "extra_attributes": {
                        "image_url": "https://i.ebayimg.com/images/g/RicAAOSwzO5e3DZs/s-l1600.jpg",
                        "merchant_url": "https://www.ebay.com"
                    }
                }
            ]
        }

        try:
            response = requests.post(escrow_url, auth=(email, api_key), json=payload)
            response_data = response.json()

            if response.status_code == 201:
                transaction_id = response_data.get('id')
                payer = User.objects.filter(email=buyer_email).first()
                if not payer:
                    return Response({"error": "Buyer email is not valid."}, status=status.HTTP_400_BAD_REQUEST)

                escrow_transaction = EscrowTransaction.objects.create(
                    payer=payer,
                    payee_phone=seller_phone,
                    payee_email=seller_email,
                    amount=amount,
                    description=description,
                    status=response_data.get('status', 'in_escrow'),
                    escrow_account_id=transaction_id,
                )

                return Response({
                    "message": "Transaction created successfully.",
                    "data": {
                        "transaction_id": escrow_transaction.id,
                        "escrow_account_id": transaction_id,
                        "status": escrow_transaction.status
                    }
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    "error": "Failed to create transaction.",
                    "details": response_data
                }, status=response.status_code)

        except requests.RequestException as e:
            return Response({
                "error": "Failed to communicate with Escrow API",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




# Orange Payment APIView
class PaymentTransactionView(generics.CreateAPIView):
    queryset = PaymentTransaction.objects.all()
    serializer_class = PaymentTransactionDetailSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        transaction_data = {
            "order_id": data.get("partnerReferenceId"),
            "partner_reference_id": data.get("partnerReferenceId"),
            "confirm_mode": data.get("confirmMode"),
            "account_credential_type": data.get("accountCredential").get("type"),
            "account_credential_value": data.get("accountCredential").get("value"),
            "offer_id": data.get("offer").get("id"),
            "offer_description": data.get("offer").get("description"),
            "offer_category": data.get("offer").get("category"),
            "offer_service_class": data.get("offer").get("serviceClass"),
            "offer_type": data.get("offer").get("type"),
            "total_amount": str(data.get("offer").get("baseAmount").get("totalAmount")).replace(',', '.'),
            "net_amount": str(data.get("offer").get("baseAmount").get("netAmount")).replace(',', '.'),
            "vat_amount": str(data.get("offer").get("baseAmount").get("vatAmount")).replace(',', '.'),
            "vat_rate": str(data.get("offer").get("baseAmount").get("vatRate")).replace(',', '.'),
            "currency": data.get("offer").get("baseAmount").get("currency"),
            "customer_msisdn": data.get("customerMsisdn", "1234567820"),
        }

        serializer = self.get_serializer(data=transaction_data)
        if serializer.is_valid():
            transaction = serializer.save()

            return Response({
                'message': 'Transaction created successfully.',
                'transaction_id': transaction.transaction_id,
                'order_id': transaction.order_id
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ConfirmTransactionView(generics.UpdateAPIView):
    queryset = PaymentTransaction.objects.all()
    serializer_class = ConfirmTransactionSerializer
    lookup_field = 'transaction_id'

    def update(self, request, *args, **kwargs):
        transaction_id = self.kwargs.get('transaction_id')

        try:
            transaction = PaymentTransaction.objects.get(transaction_id=transaction_id)

            if transaction.payment_status != 'PENDING':
                return Response({
                    'message': 'Transaction cannot be confirmed as it is not in the PENDING state.'
                }, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(transaction, data={'payment_status': 'AUTHORIZED'}, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Transaction confirmed successfully.',
                    'transaction_id': transaction.transaction_id,
                    'status': transaction.payment_status
                }, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except PaymentTransaction.DoesNotExist:
            return Response({
                'message': 'Transaction not found.'
            }, status=status.HTTP_404_NOT_FOUND)

class PaymentTransactionDetailView(generics.RetrieveAPIView):
    queryset = PaymentTransaction.objects.all()
    serializer_class = PaymentTransactionDetailSerializer
    lookup_field = 'transaction_id'

    def get(self, request, *args, **kwargs):
        transaction_id = self.kwargs.get('transaction_id')
        # Retrieve the transaction or return 404 if not found
        transaction = get_object_or_404(PaymentTransaction, transaction_id=transaction_id)
        serializer = self.get_serializer(transaction)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CancelTransactionView(generics.DestroyAPIView):
    queryset = PaymentTransaction.objects.all()
    lookup_field = 'transaction_id'

    def delete(self, request, *args, **kwargs):
        transaction_id = self.kwargs.get('transaction_id')

        try:
            transaction = PaymentTransaction.objects.get(transaction_id=transaction_id)

            if transaction.payment_status != 'AUTHORIZED':
                return Response({
                    'message': 'Only authorized transactions can be cancelled.'
                }, status=status.HTTP_400_BAD_REQUEST)

            transaction.payment_status = 'CANCELLED'
            transaction.save()

            return Response({
                'message': 'Transaction cancelled successfully.',
                'transaction_id': transaction.transaction_id,
                'status': transaction.payment_status
            }, status=status.HTTP_200_OK)

        except PaymentTransaction.DoesNotExist:
            return Response({
                'message': 'Transaction not found.'
            }, status=status.HTTP_404_NOT_FOUND)



