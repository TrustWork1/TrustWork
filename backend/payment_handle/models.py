from django.db import models
import uuid

from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.


User = get_user_model()

# Escrow Payment

class EscrowTransaction(models.Model):
    payer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='escrow_transactions')
    # payer = models.ForeignKey(User, on_delete=models.CASCADE)
    payee_phone = models.CharField(max_length=15)
    # payee_phone = models.ForeignKey("EscrowCustomer", max_length=15, on_delete=models.CASCADE, related_name='escrow_transactions')
    payee_email = models.EmailField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=[('in_escrow', 'In Escrow'), ('released', 'Released'), ('refunded', 'Refunded')])
    escrow_account_id = models.CharField(max_length=50)

    def __str__(self):
        # return f"Transaction {self.id} - {self.status}"
        return f"Transaction {self.id}: {self.payer.username} to {self.payee_phone} - {self.amount} - {self.status}"


class BankAddress(models.Model):
    countries_currencies = {
    ("US", "United States"),
    ("EU", "Germany"),
    ("GB", "United Kingdom"),
    ("JP", "Japan"),
    ("CH", "Switzerland"),
    ("AU", "Australia"),
    ("CA", "Canada"),
    ("CN", "China"),
    ("HK", "Hong Kong"),
    ("IN", "India"),
    ("KR", "South Korea"),
    ("MX", "Mexico"),
    ("NZ", "New Zealand"),
    ("RU", "Russia"),
    ("SG", "Singapore"),
    ("ZA", "South Africa"),
    ("BR", "Brazil"),
    ("TR", "Turkey"),
    ("SE", "Sweden"),
    ("NO", "Norway"),
    }
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=6, choices=countries_currencies)  

    def __str__(self):
        return f"{self.city}, {self.state}, {self.country}"

class DisbursementMethod(models.Model):
    CURRENCY_CHOICES = (
        ("usd", "US Dollar"),
        ("eur", "Euro"),
        ("gbp", "British Pound"),
        ("jpy", "Japanese Yen"),
        ("chf", "Swiss Franc"),
        ("aud", "Australian Dollar"),
        ("cad", "Canadian Dollar"),
        ("cny", "Chinese Renminbi"),
        ("hkd", "Hong Kong Dollar"),
        ("inr", "Indian Rupee"),
        ("krw", "South Korean Won"),
        ("mxn", "Mexican Peso"),
        ("nzd", "New Zealand Dollar"),
        ("rub", "Russian Ruble"),
        ("sgd", "Singapore Dollar"),
        ("zar   ", "South African Rand"))   

    escrow_customer = models.ForeignKey("EscrowCustomer", on_delete=models.CASCADE)
    account_name = models.CharField(max_length=100)
    account_type = models.CharField(max_length=20, choices=(("savings", "Savings"), ("checking", "Checking")))
    bank_aba_routing_number = models.CharField(max_length=20)
    bank_account_number = models.CharField(max_length=20)
    bank_address = models.ForeignKey(BankAddress, on_delete=models.CASCADE)
    bank_name = models.CharField(max_length=100)
    currency = models.CharField(max_length=6, choices=CURRENCY_CHOICES)
    type = models.CharField(max_length=20, default="ach")

    def __str__(self):
        return f"{self.account_name} - {self.bank_name}"

class EscrowCustomer(models.Model):
    countries_currencies = {
    ("US", "United States"),
    ("EU", "Germany"),
    ("GB", "United Kingdom"),
    ("JP", "Japan"),
    ("CH", "Switzerland"),
    ("AU", "Australia"),
    ("CA", "Canada"),
    ("CN", "China"),
    ("HK", "Hong Kong"),
    ("IN", "India"),
    ("KR", "South Korea"),
    ("MX", "Mexico"),
    ("NZ", "New Zealand"),
    ("RU", "Russia"),
    ("SG", "Singapore"),
    ("ZA", "South Africa"),
    ("BR", "Brazil"),
    ("TR", "Turkey"),
    ("SE", "Sweden"),
    ("NO", "Norway"),
    }
    # customer_id = models.AutoField(unique=True, primary_key=True)
    customer_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    address_line1 = models.CharField(max_length=100)
    address_line2 = models.CharField(max_length=100, blank=True, null=True) 
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    country = models.CharField(max_length=6, choices=countries_currencies) 
    post_code = models.CharField(max_length=20)
    escrow_customer_id = models.CharField(max_length=100, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    disbursement_methods = models.ManyToManyField(DisbursementMethod, related_name='customers')
    webhook_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"



# Orange Payment

class PaymentTransaction(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('AUTHORIZED', 'Authorized'),
        ('FAILED', 'Failed'),
        ('SUCCESS', 'Success'),
        ('CANCELLED', 'Cancelled'),
    ]

    order_id = models.CharField(max_length=50, unique=True)
    partner_reference_id = models.CharField(max_length=50, blank=True, null=True)
    confirm_mode = models.CharField(max_length=10, blank=True, null=True)
    account_credential_type = models.CharField(max_length=20, blank=True, null=True)
    account_credential_value = models.CharField(max_length=50, blank=True, null=True)
    
    offer_id = models.CharField(max_length=50, blank=True, null=True)
    offer_description = models.CharField(max_length=255, blank=True, null=True)
    offer_category = models.CharField(max_length=10, blank=True, null=True)
    offer_service_class = models.CharField(max_length=10, blank=True, null=True)
    offer_type = models.CharField(max_length=10, blank=True, null=True)
    
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    vat_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    vat_rate = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=3)
    
    customer_msisdn = models.CharField(max_length=20)
    transaction_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    # transaction_id = models.CharField(max_length=100, blank=True, null=True)
    payment_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.order_id} - Status: {self.payment_status}"
