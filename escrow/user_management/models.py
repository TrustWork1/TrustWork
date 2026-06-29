from uuid import uuid4

from django.db import models

# Create your models here.

class BaseModel(models.Model):
    class Meta:
        abstract=True
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    id=models.UUIDField(default=uuid4,primary_key=True)
class User(BaseModel):
    external_user_id=models.CharField(max_length=500)
    phone_number=models.CharField(max_length=500)
    email=models.CharField(max_length=500)
    user_type=models.CharField(max_length=500)
    prefered_payment_method=models.CharField(max_length=500,default="")
