from django.db import models
from user_management.models import BaseModel,User

# Create your models here.

class Escrow(BaseModel):
    amount=models.CharField(max_length=50)
    status=models.CharField(max_length=100,choices=[("pending","pending"),('collection_success','collection_success'),('disbursement_success','disbursement_success'),('collection_failed','collection_failed'),('disbursement_failed','disbursement_failed')])
    collection_date=models.DateTimeField(auto_now_add=True, null=True, blank=True)
    disbursement_date=models.DateTimeField(null=True)
    external_resource_id=models.TextField(default='')
    payer=models.ForeignKey(User,on_delete=models.DO_NOTHING,related_name='payer')
    payee=models.ForeignKey(User,on_delete=models.DO_NOTHING,related_name='payee')
    external_callback_url=models.CharField(max_length=255,null=True)
    payment_method=models.CharField(max_length=100,choices=[('mtn-momo','mtn-momo'),('stripe','stripe')],default='mtn-momo')
    reference_id = models.UUIDField(blank=True,null=True)
    

class Events(BaseModel):
    event_type=models.CharField(max_length=100,choices=[
        ("collection_initialized",'collection_initialized'),
        ('collection_in_progress','collection_in_progress'),
        ('collection_success','collection_success'),
        ('disbursement_initialized','disbursement_initialized'),
        ('disbursement_in_progress','disbursement_in_progress'),
        ('disbursement_success','disbursement_success'),
        ('collection_failed','collection_failed'),
        ('disbursement_failed','disbursement_failed'),
    ])
    event_description=models.TextField(default='')
    escrow=models.ForeignKey(Escrow,on_delete=models.CASCADE)
    

class Transactions(BaseModel):
    # payer=models.ForeignKey(User,on_delete=models.DO_NOTHING,related_name='payer')
    # payee=models.ForeignKey(User,on_delete=models.DO_NOTHING,related_name='payee')
    escrow=models.ForeignKey(Escrow,on_delete=models.CASCADE)
    amount=models.CharField(max_length=50)
    status=models.CharField(max_length=100,choices=[('pending','pending'),('completed','completed'),('failed','failed')])
    transaction_type=models.CharField(max_length=100,choices=[('disbursement','disbursement'),('collection','collection')])
    payment_method=models.CharField(max_length=100,choices=[('mtn-momo','mtn-momo'),('stripe','stripe')],default='mtn-momo')
    external_transaction_id=models.CharField(max_length=100,null=True)
    external_callback_url=models.CharField(max_length=255,null=True)
# class Collections(BaseModel):
#     escrow=models.ForeignKey(Escrow,on_delete=models.CASCADE)
#     amount=models.CharField(max_length=50)
#     payment_method=models.CharField(max_length=100,choices=['mtn-momo','mtn-momo'],default='mtn-momo')
#     transaction=models.ForeignKey(Transactions,on_delete=models.CASCADE)

# class Disbursements(BaseModel):
#     pass


class StripePayment(models.Model):
    session_id = models.CharField(max_length=255, unique=True)
    user_id = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='pending') 
    created_at = models.DateTimeField(auto_now_add=True)
    amount = models.FloatField(max_length=50, null=True, blank=True)
    project_id = models.TextField(max_length=10, null=True, blank=True)
    bid_id = models.TextField(max_length=10, null=True, blank=True)
    currency = models.CharField(max_length=3, null= True, blank=True)
    external_transaction_id = models.CharField(max_length=100,null=True, blank=True)
    payment_method = models.CharField(max_length=50, default='card', null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

class MtnSubscriptionTransaction(BaseModel):
    subscription_frequency=models.CharField(max_length=100,choices=[("weekly","weekly"),("monthly",'monthly'),("yearly","yearly")])
    email = models.EmailField(null=True, blank=True)
    amount=models.CharField(max_length=50)
    payment_status = models.CharField(max_length=20, choices=[('paid', 'Paid'), ('failed', 'Failed'), ('pending', 'Pending')], default="pending")
    unique_code = models.CharField(max_length=20, null=True, blank=True, unique=True)
    unique_code_status = models.CharField(max_length=100, null= True, blank=True, default="inactive")
    reference_id = models.UUIDField(blank=True,null=True)
