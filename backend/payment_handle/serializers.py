from rest_framework import serializers
from .models import EscrowCustomer, DisbursementMethod, BankAddress, EscrowTransaction, PaymentTransaction
from django.utils.dateparse import parse_date, parse_datetime
from datetime import datetime
from profile_management.models import Profile
from project_management.models import Project
from api.profile.serializers import ProfileSerializer
from api.project.serializers import ProjectSerializer

# Escrow Transection Model
class EscrowTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EscrowTransaction
        fields = ['id', 'payer', 'payee_email', 'amount', 'description', 'status', 'escrow_account_id']
        read_only_fields = ['payer', 'status', 'escrow_account_id']

class BankAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAddress
        fields = ['city', 'state', 'country']

class DisbursementMethodSerializer(serializers.ModelSerializer):
    bank_address = BankAddressSerializer()

    class Meta:
        model = DisbursementMethod
        fields = [
            'account_name', 'account_type', 'bank_aba_routing_number', 
            'bank_account_number', 'bank_address', 'bank_name', 'currency', 'type'
        ]

class EscrowCustomerSerializer(serializers.ModelSerializer):
    disbursement_methods = DisbursementMethodSerializer(many=True)

    class Meta:
        model = EscrowCustomer
        fields = [
            'first_name', 'middle_name', 'last_name', 'email', 'phone_number', 
            'address_line1', 'address_line2', 'city', 'state', 'country', 
            'post_code', 'escrow_customer_id', 'date_of_birth', 
            'disbursement_methods', 'webhook_url'
        ]

    def create(self, validated_data):
        disbursement_methods_data = validated_data.pop('disbursement_methods')
        
        date_of_birth = validated_data.get('date_of_birth')
        if isinstance(date_of_birth, str):
            validated_data['date_of_birth'] = parse_datetime(date_of_birth)

        escrow_customer = EscrowCustomer.objects.create(**validated_data)

        for disbursement_data in disbursement_methods_data:
            bank_address_data = disbursement_data.pop('bank_address')
            bank_address = BankAddress.objects.create(**bank_address_data)
            DisbursementMethod.objects.create(
                escrow_customer=escrow_customer,
                bank_address=bank_address,
                **disbursement_data
            )

        return escrow_customer
    

# Orange Transection Model
class PaymentTransactionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTransaction
        # fields = ['order_id', 'amount', 'currency', 'customer_msisdn', 'transaction_id', 'payment_status']
        read_only_fields = ['transaction_id', 'created_at', 'updated_at']
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        return {
            "id": instance.transaction_id,
            "originalId": instance.transaction_id,
            "partnerReferenceId": instance.partner_reference_id,
            "type": "DEBIT",
            "status": instance.payment_status,
            "creationDate": instance.created_at.isoformat(),
            "confirmOrCancelDate": instance.updated_at.isoformat(),
            "amount": {
                "totalAmount": str(instance.total_amount),
                "netAmount": str(instance.net_amount),
                "vatAmount": str(instance.vat_amount),
                "vatRate": str(instance.vat_rate),
                "currency": instance.currency
            },
            "account": {
                "id": instance.account_credential_value, 
                "name": "user name"
            },
            "offer": {
                "id": instance.offer_id,
                "description": instance.offer_description,
                "category": instance.offer_category,
                "serviceClass": instance.offer_service_class,
                "type": instance.offer_type,
                "baseAmount": {
                    "totalAmount": str(instance.total_amount),
                    "netAmount": str(instance.net_amount),
                    "vatAmount": str(instance.vat_amount),
                    "vatRate": str(instance.vat_rate),
                    "currency": instance.currency
                }
            },
            "partner": {
                "id": "1234",  
                "name": "Merchant name"
            }
        }

class ConfirmTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTransaction
        fields = ['transaction_id', 'payment_status']
