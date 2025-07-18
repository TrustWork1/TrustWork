from rest_framework import serializers
from customuser.models import CustomUser
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.template.loader import render_to_string
import random
from django.conf import settings
from django.contrib.auth.models import Group
from utils import send_otp_sms
from master.models import Location
# from master import *
import master
import os
import environ
env = environ.Env()
environ.Env.read_env(".env")
TRUSTWORK_BASE_API = os.getenv('TRUSTWORK_BASE_API')


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields ="__all__"


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    otp = serializers.CharField(read_only=True) 
    

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'user_type', 'otp', 'full_name'] 


    def create(self, validated_data):
        otp = str(random.randint(1000, 9999))
        print(otp)
        # Create the user but set is_active=False until OTP is verified
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            user_type=validated_data['user_type'],
            full_name=validated_data.get('full_name', ''),
            is_active=True  # User will remain inactive until OTP is verified
        )
        phone_extension = validated_data.get("phone_extension", "")
        phone_number = validated_data.get("phone", "")
        if validated_data.get("phone"):
            send_otp_sms(phone_extension + phone_number, otp)
        if validated_data.get("email"):
            
            self.send_otp_email( email=validated_data['email'],otp=otp)
        # Store the OTP in some way (e.g., in a database or cache)
        user.otp = otp
        user.save()

        return user

    def send_otp_email(self, email, otp):
        subject = 'Your Registration OTP'
        message = f'Your OTP for registration is {otp}.'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]

        # Render the email body from the HTML template
        html_message = render_to_string('email_temp.html', {
            'title': 'Registration OTP',
            'otp': f'Your OTP for registration is {otp}.',
            'image': TRUSTWORK_BASE_API
        })

        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=recipient_list,
            html_message=html_message,
            fail_silently=True
        )
        

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(required=True, allow_blank=True)
    fcmtoken = serializers.CharField(required=False, allow_blank=True)
    devicetype = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        password = data.get('password', '').strip()

        if not email and not phone:
            raise serializers.ValidationError("Either email or phone is required.")

        if not password:
            raise serializers.ValidationError("Password is required.")

        return data

User = get_user_model()

class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    class Meta:
        fields = ['email']

    def validate(self, data):
        email = data.get('email')
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError('There is no user registered with this email address.')
        return data

    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        token = PasswordResetTokenGenerator().make_token(user)
        uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
        
        domain = self.context['request'].get_host() 
        link = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
        reset_url = self.context['frontend_url'] + f"reset-password?token={token}&email={email}"
        
        html_content = render_to_string('email_temp.html', {
            'title': 'Password Reset Request',
            'verify_link': f'Hello,<br>Use the following link to reset your password. Click this 👉',
            'url': reset_url,
            'image': TRUSTWORK_BASE_API
        })
        send_mail(
            subject="Trustwork Support",
            message=f"Change your password",
            html_message = html_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    # groups=GroupSerializer(many=True)
    group = serializers.SerializerMethodField()  #
    is_payment_verified = serializers.SerializerMethodField()  #
    # year_of_experiance = serializers.SerializerMethodField()
    is_profile_updated = serializers.SerializerMethodField()  #
    
    class Meta:
        model=User
        # fields="__all__"
        exclude=["password","user_permissions"]
    # def get_year_of_experiance(self, obj):
    #     try:
    #         return Profile.objects.get(User=obj).year_of_experiance
    #     except:
    #         return None

    def get_is_payment_verified(self,obj):
        try:
            return Profile.objects.get(user=obj).is_payment_verified
        except:
            return None
    def get_is_profile_updated(self,obj):
        try:
            return Profile.objects.get(user=obj).is_profile_updated
        except:
            return None
    def get_group(self, obj):
        group = obj.groups.first() 
        return GroupSerializer(group).data if group else None

class SetNewPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    # uidb64 = serializers.CharField()
    email=serializers.CharField(write_only=True)
    token = serializers.CharField()

    def validate(self, data):
        try:
            password = data.get('new_password')
            confirm_password = data.get('confirm_password')
            email=data.get("email")
            print(email)
            if password != confirm_password:
                raise serializers.ValidationError("Passwords do not match.")
            
            # uidb64 = data.get('uidb64')
            token = data.get('token')
            # uidb64,token=token.split("__##__")
            # user_id = force_str(urlsafe_base64_decode())
            user = User.objects.get(email=email)

            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError('The reset link is invalid or has expired.')
            
            user.set_password(password)
            user.save()
            data['user'] = user

            return data
        except DjangoUnicodeDecodeError:
            raise serializers.ValidationError('Invalid UID')
    def save(self):
        password = self.validated_data['new_password']
        user = self.validated_data['user']
        
        user.set_password(password) 
        user.save() 
        return user
    

class ChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self,data):
        password = data.get('new_password')
        confirm_password = data.get('confirm_password')
        

        if password!= confirm_password:
            raise serializers.ValidationError("Passwords do not match.")
        

        

        return data


# Reset Password
class GenerateOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=4)

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return user
    
    def validate(self, data):
        email = data.get('email')
        otp = data.get('otp')
        user = User.objects.get(email=email)

        # Assuming you have a field to check email verification
        if not user.is_active:  # Replace with your actual verification field
            raise serializers.ValidationError("Email is not verified.")
        
        if user.otp != otp:  # Ensure you have a way to handle OTP
            raise serializers.ValidationError("Invalid OTP.")

        data['user'] = user  # Add user to data for use in save method
        return data
    
    def save(self):
        user = self.validated_data['user']
        password = self.validated_data['new_password']
        
        user.set_password(password)
        user.save()
        return user
    # def validate(self, data):
    #     email = data.get('email')
    #     otp = data.get('otp')
    #     user = User.objects.get(email=email)
    #     if user.email is False:
    #         raise serializers.ValidationError("Email is not verified")
    #     if user.otp != otp:
    #         raise serializers.ValidationError("Invalid OTP")
    #     return data


    # def save(self):
    #     password = self.validated_data['new_password']
    #     user = self.validated_data['user']
        
    #     user.set_password(password) 
    #     user.save() 
    #     return user

class ChangePasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(required=False)
    
    # current_password = serializers.CharField(min_length=8, write_only=True)
    new_password = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({
                'error': "New password and confirm password don't match."
            })        
        return data

from rest_framework import serializers
from customuser.models import CustomUser
from profile_management.models import  Profile


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=True)
    
    phone = serializers.CharField(required=False,write_only=True,allow_blank=True)
    profession = serializers.CharField(required=False)
    email=serializers.EmailField(required=False,allow_blank=True)
    associated_organization = serializers.CharField(required=False, allow_blank=True)
    organization_registration_id = serializers.CharField(required=False, allow_blank=True)
    latitude = serializers.CharField(required=False, write_only=True)
    longitude = serializers.CharField(required=False, write_only=True)
    phone_extension=serializers.CharField(required=False,write_only=True)
    # year_of_experiance = serializers.CharField(required=False)
    otp = serializers.CharField(read_only=True) 

    class Meta:
        model = CustomUser
        fields = [
            'email', 'password', 'first_name', 'last_name', 
            'user_type', 'full_name', 'phone', "phone_extension",
            'profession', 'associated_organization', 
            'organization_registration_id', 'latitude', 'longitude' ,'otp'# 'year_of_experiance'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }
    def send_otp_email(self, email, otp):
        subject = 'Your Registration OTP'
        message = f'Your OTP for registration is {otp}.'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]

        html_message = render_to_string('email_temp.html', {
            'title': 'Registration OTP',
            'otp': f'Your OTP for registration is {otp}.',
            'image': TRUSTWORK_BASE_API
        })

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=recipient_list,
                html_message=html_message,
                fail_silently=False  # catch error instead of hiding it
            )
        except Exception as e:
            print(f"[EMAIL ERROR] OTP mail sending failed: {e}")
    def validate(self, data):
        email = data.get('email',"")
        phone = data.get('phone',"")

        # Check if either email or phone is provided
        if not email and not phone:
            raise serializers.ValidationError("Either email or phone number must be provided.")

        # Check if email already exists
        if email and CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Account with this email already exists."})

        # Check if phone already exists
        if phone and Profile.objects.filter(phone=phone).exists():
            raise serializers.ValidationError({"phone": "Account with this phone already exists."})

        return data
    def create(self, validated_data):
        otp = str(random.randint(1000, 9999))

        user_type = validated_data['user_type']
        latitude = validated_data.pop('latitude', None)
        longitude = validated_data.pop('longitude', None)
        print(validated_data)
        # Extract fields specific to the profile
        profile_data = {
            # 'full_name': validated_data.pop('full_name'),
            'phone': validated_data.pop('phone', ''),
            "phone_extension": validated_data.pop("phone_extension", "")
        }
        
        if user_type == 'provider':
            profile_data['profession'] = validated_data.pop('profession')
            profile_data['associated_organization'] = validated_data.pop('associated_organization')
            profile_data['organization_registration_id'] = validated_data.pop('organization_registration_id')

        # Create the CustomUser instance
        user = CustomUser(**validated_data)
        full_name=validated_data.get("full_name")
        user.full_name=full_name
        user.first_name=full_name.split(" ")[0]
        user.last_name="" if len(full_name.split(" "))==1 else " ".join(full_name.split(" ")[1:])
        # self.send_otp_email( email=validated_data['email'],otp=otp)
        if profile_data.get("phone_extension") and profile_data.get("phone"):
            send_otp_sms(profile_data.get("phone_extension")+profile_data.get("phone"),otp)
        if validated_data.get("email"):
            
            self.send_otp_email( email=validated_data['email'],otp=otp)
        user.otp = otp

        user.set_password(validated_data['password'])
        user.save()

        # Create the Profile instance
        profile = Profile.objects.create(user=user, **profile_data)

        # if latitude and longitude:
        #     location = Location.objects.create(latitude=latitude, longitude=longitude)
        #     profile.location = location
        #     profile.save()

        if latitude and longitude:
            location = Location.objects.create(latitude=latitude, longitude=longitude)
            profile.location = location
            profile.save()
            location.save()
        print(latitude, "latitude checking")
        return user
