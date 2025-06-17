from django.db import models, IntegrityError
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin  #AbstractUser
from django.contrib.auth import get_user_model
from .managers import CustomUserManager
import string,random
from django.core.exceptions import ValidationError


class CustomUser(AbstractBaseUser, PermissionsMixin):
    USER_TYPE_CHOICES = (
        ('admin', 'Admin'),
        ('client', 'Client'),
        ('provider', 'Service Provider'),
    )
    otp = models.CharField(max_length=6, blank=True, null=True)
    password_reset_otp = models.CharField(max_length=4, blank=True, null=True)
    # reset_otp_created_at = models.DateTimeField(auto_now_add=True)
    first_name=models.CharField(max_length=70,null=True,blank=True)
    last_name=models.CharField(max_length=70,null=True,blank=True)
    full_name=models.CharField(max_length=70,null=True)
    email = models.EmailField(null=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_user_active=models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    fcmtoken = models.CharField(max_length=500, null=True, blank=True)
    devicetype = models.CharField(max_length=20, null=True, blank=True)
    referred_by_code = models.CharField(max_length=20, null=True, blank=True)
    # unique referal code per user.
    user_referal_code = models.CharField(max_length=20, null=True, blank=True)
    total_referal_amount=models.TextField(default=0,null=True)
    total_referal_count=models.TextField(default=0,null=True)
    is_discount=models.BooleanField(default=False)     # check user need discount
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    def save(self,*args, **kwargs):
        # Check if email is already taken (for new objects or changed emails)
        if self.email and self.pk is None and CustomUser.objects.filter(email=self.email).exists():
            raise ValidationError("A user with this email already exists.")
        
        if not self.user_referal_code:
            self.user_referal_code=self.generate_unique_code()
        return super().save(*args, **kwargs)
    @staticmethod
    def generate_unique_code():
        code_length = 8
        characters = string.ascii_uppercase + string.digits
        while True:
            code = ''.join(random.choice(characters)
                           for _ in range(code_length))
            try:
                CustomUser.objects.get(user_referal_code=code)
            except:
                return code
    def __str__(self):
        return self.email
