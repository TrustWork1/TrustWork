import logging
import os
import random

import environ
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.db import transaction
from django.template.loader import render_to_string
from django.utils.encoding import DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.auth.otp import (
    clear_user_otp,
    get_otp_validity_minutes,
    is_user_otp_expired,
    otp_remaining_minutes,
    otp_remaining_seconds,
    save_user_otp,
    stamp_user_otp,
    still_valid_otp_message,
)
from customuser.models import CustomUser
from profile_management.models import Coupons, Profile
from profile_management.subscriptions import refresh_profile_subscription_status
from utils import send_otp_sms

from .serializers import (
    ChangePasswordSerializer,
    GenerateOTPSerializer,
    LoginSerializer,
    RegistrationSerializer,
    ResetPasswordEmailRequestSerializer,
    SetNewPasswordSerializer,
    UserProfileSerializer,
    UserSerializer,
)

User = get_user_model()
logger = logging.getLogger(__name__)

env = environ.Env()
environ.Env.read_env(".env")
TRUSTWORK_BASE_API = os.getenv('TRUSTWORK_BASE_API')
ADMIN_URL = os.getenv('ADMIN_URL')


def _save_user_fields(user, fields):
    try:
        user.save(update_fields=fields)
    except TypeError:
        user.save()


class RegisterView(APIView):
    permission_classes=[AllowAny]
    @swagger_auto_schema(
        request_body=RegistrationSerializer,
        responses={
            status.HTTP_201_CREATED: openapi.Response(
                description="User registered successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message': openapi.Schema(type=openapi.TYPE_STRING, description="Success message"),
                        'email': openapi.Schema(type=openapi.TYPE_STRING, description="Registered email"),
                        'otp': openapi.Schema(type=openapi.TYPE_STRING, description="OTP sent to the user's email"),
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Validation errors",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'errors': openapi.Schema(type=openapi.TYPE_OBJECT, description="Detailed validation errors")
                    }
                )
            )
        }
    )
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            referal_code=request.data.get("referred_by_code","")
            if referal_code:
                referer_user=CustomUser.objects.filter(user_referal_code=referal_code).last()
                if not referer_user:
                    return Response({"message":"Invalid Referal code"})
            user = serializer.save(referred_by_code=request.data.get("referred_by_code",''))
            print(user.otp)
            return Response({
                "data" : serializer.data,
                'message': 'User registered successfully. Please check your email for the OTP.',
                'email': user.email,
                # 'otp': user.otp
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):

    @swagger_auto_schema(
        operation_description="Verify OTP for user registration.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
                'otp': openapi.Schema(type=openapi.TYPE_STRING, description='One-Time Password'),
            },
            required=['email', 'otp'],
        ),
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="OTP Verified successfully.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'status': openapi.Schema(type=openapi.TYPE_INTEGER, example=200),
                        'type': openapi.Schema(type=openapi.TYPE_STRING, example='success'),
                        'message': openapi.Schema(type=openapi.TYPE_STRING, example='OTP Verified'),
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Invalid OTP or User does not exist.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            )
        }
    )
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        print(otp)
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the OTP matches
        if user.otp == otp:
            if is_user_otp_expired(user):
                return Response(
                    {'error': 'OTP has expired. Please request a new OTP.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.is_user_active = True  # Activate the user
            clear_user_otp(user)
            _save_user_fields(user, ["is_user_active", "otp", "otp_created_at"])
            response={
                "status":200,
                "type":"success",
                "message":"OTP Verified",
                # "data":serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=False
            )
        ],
        request_body=LoginSerializer,
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Login successful",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'accessToken': openapi.Schema(type=openapi.TYPE_STRING, description="User's access token"),
                        'UserData': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            description="Serialized user data",
                            additional_properties=openapi.Schema(type=openapi.TYPE_STRING)
                        ),
                        'status': openapi.Schema(type=openapi.TYPE_STRING, description="Status code as a string"),
                        'message': openapi.Schema(type=openapi.TYPE_STRING, description="Success message"),
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Invalid credentials or validation errors",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING, description="Error message"),
                    }
                )
            )
        }
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            # print(serializer.data)
            # fcmtoken = request.serializer.data.get("fcmtoken", "")
            # devicetype = serializer.data.get("devicetype", "")
            if serializer.data.get("email"):
                user = authenticate(request, email=serializer.data['email'], password=serializer.data['password']) # fcmtoken=serializer.data['fcmtoken'], devicetype=serializer.data['devicetype']
            else:
                user = authenticate(request, phone=serializer.data['phone'], password=serializer.data['password']) # , fcmtoken=serializer.data['fcmtoken'], devicetype=serializer.data['devicetype']

            if user is not None:
                if user.profile.status == "deleted":
                    return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
                elif user.is_active:
                    user.fcmtoken=request.data.get("deviceToken",'')
                    user.devicetype=request.data.get("deviceType",'')
                    user.save()

                    refresh_profile_subscription_status(user.profile)

                    coupon_check=Coupons.objects.filter(user=user.id, is_active=True)
                    # for coupon in coupon_check:
                    #     if coupon.expire_date < timezone.now().date():
                    #         coupon.is_active=False
                    #         coupon.save()
                    if coupon_check.exists():
                        user.is_discount=True
                        user.save()
                    else:
                        user.is_discount=False
                        user.save()
                    login(request, user)
                    token, created = Token.objects.get_or_create(user=user)
                    return Response({'accessToken': token.key,"UserData":UserSerializer(instance=user).data,"status":"200","message":"Login Success."}, status=status.HTTP_200_OK)
                return Response({'error': 'User Not verified'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

        error_messages = serializer.errors

        # Extract first error message
        if isinstance(error_messages, dict):
            first_error_key = next(iter(error_messages))
            first_error_value = error_messages[first_error_key]
            if isinstance(first_error_value, list):
                error_message = first_error_value[0]
            else:
                error_message = first_error_value
        else:
            error_message = "Invalid data"

        return Response({
            "status": "400",
            "message": "Failed",
            "type": "error",
            "error": error_message
        }, status=status.HTTP_400_BAD_REQUEST)

class AdminLoginView(APIView):
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=False
            )
        ],
        request_body=LoginSerializer,
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Admin Login successful",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'accessToken': openapi.Schema(type=openapi.TYPE_STRING, description="User's access token"),
                        'UserData': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            description="Serialized user data",
                            additional_properties=openapi.Schema(type=openapi.TYPE_STRING)
                        ),
                        'status': openapi.Schema(type=openapi.TYPE_STRING, description="Status code as a string"),
                        'message': openapi.Schema(type=openapi.TYPE_STRING, description="Success message"),
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Invalid credentials or validation errors",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING, description="Error message"),
                    }
                )
            )
        }
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            if serializer.data.get("email"):
                user = authenticate(request, email=serializer.data['email'], password=serializer.data['password'])
            else:
                user = authenticate(request, phone=serializer.data['phone'], password=serializer.data['password'])

            if user:
                user_type = user.user_type
                if user.is_active and user_type.lower() == "admin":
                    login(request, user)
                    token, created = Token.objects.get_or_create(user=user)
                    return Response({'accessToken': token.key,"UserData":UserSerializer(instance=user).data,"status":"200","message":"Login Success."}, status=status.HTTP_200_OK)
                return Response({'error': 'You do not have permission for Admin login'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Logout the authenticated user.",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=False
            )
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(description="Logout successful."),
            status.HTTP_401_UNAUTHORIZED: openapi.Response(description="Unauthorized."),
        }
    )
    def post(self, request):
    #     request.user.auth_token.delete()
    #     logout(request)
    #     return Response(status=status.HTTP_204_NO_CONTENT)
        request.user.auth_token.delete()
        logout(request)
        return Response(
            {"status": 200, "message": "Logout successful"},
            status=status.HTTP_200_OK
        )

class RequestPasswordResetEmail(APIView):

    @swagger_auto_schema(
        operation_description="Request a password reset email.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email for password reset'),
            },
            required=['email'],
        ),
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Password reset link sent successfully.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'status': openapi.Schema(type=openapi.TYPE_INTEGER, example=200),
                        'type': openapi.Schema(type=openapi.TYPE_STRING, example='success'),
                        'message': openapi.Schema(type=openapi.TYPE_STRING, example='Password reset link sent to your email.'),
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Invalid email or user does not exist.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'email': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                    }
                )
            )
        }
    )
    def post(self, request):
        serializer = ResetPasswordEmailRequestSerializer(data=request.data, context={'request': request, 'frontend_url': ADMIN_URL})
        if serializer.is_valid():
            serializer.save()
            response={
                "status":200,
                "type":"success",
                "message":"Password reset link sent to your email.",
                # "data":serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordTokenCheckAPI(APIView):

    @swagger_auto_schema(
        operation_description="Verify the password reset token.",
        manual_parameters=[
            openapi.Parameter(
                'uidb64',
                openapi.IN_PATH,
                description='Base64 encoded user ID',
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                'token',
                openapi.IN_PATH,
                description='Password reset token',
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Token is valid.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(type=openapi.TYPE_BOOLEAN, example=True),
                        'uidb64': openapi.Schema(type=openapi.TYPE_STRING, example='some_uidb64'),
                        'token': openapi.Schema(type=openapi.TYPE_STRING, example='some_token'),
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Invalid token.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING, example='Invalid token'),
                    }
                )
            )
        }
    )
    def get(self, request, uidb64, token):
        try:
            user_id = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'success': True, 'uidb64': uidb64, 'token': token}, status=status.HTTP_200_OK)
        except DjangoUnicodeDecodeError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class SetNewPasswordAPIView(APIView):

    @swagger_auto_schema(
        operation_description="Reset user password.",
        request_body=SetNewPasswordSerializer,
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Password reset successful.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'status': openapi.Schema(type=openapi.TYPE_INTEGER, example=200),
                        'type': openapi.Schema(type=openapi.TYPE_STRING, example='success'),
                        'message': openapi.Schema(type=openapi.TYPE_STRING, example='Password reset Success.'),
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Invalid input.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'new_password': openapi.Schema(type=openapi.TYPE_STRING, example='Passwords do not match.'),
                        'email': openapi.Schema(type=openapi.TYPE_STRING, example='The reset link is invalid or has expired.'),
                    }
                )
            )
        }
    )
    def patch(self, request):
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response={
                "status":200,
                "type":"success",
                "message":"Password reset Success.",
                # "data":serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Change user password.",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'current_password': openapi.Schema(type=openapi.TYPE_STRING, example='current_password123'),
                'new_password': openapi.Schema(type=openapi.TYPE_STRING, example='new_password123'),
                'confirm_password': openapi.Schema(type=openapi.TYPE_STRING, example='new_password123'),
            },
            required=['current_password', 'new_password', 'confirm_password']
        ),
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Password updated successfully.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message': openapi.Schema(type=openapi.TYPE_STRING, example='Password updated successfully')
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Invalid input.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING, example='Current password is incorrect'),
                    }
                )
            )
        }
    )
    def patch(self,request):
        user = request.user

    # Get the new password and confirm password from the request data
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if current_password == new_password:
            return Response({'error': 'New password must be different from the current password.'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(current_password):
            return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)

User = get_user_model()

class GenerateOTPView(APIView):
    permission_classes = [AllowAny]
    serializer_class = GenerateOTPSerializer

    @swagger_auto_schema(
        operation_summary="Generate OTP for Password Reset",
        operation_description="Generates a 4-digit OTP and sends it to the user's email or phone for password reset.",
        request_body=GenerateOTPSerializer,
        responses={
            200: openapi.Response('OTP has been sent'),
            400: openapi.Response('Invalid data provided'),
            404: openapi.Response('No user found with this email or phone'),
            500: openapi.Response('Failed to send OTP'),
        }
    )
    def post(self, request):
        otp = ''.join([str(random.randint(0, 9)) for _ in range(4)])

        email = (request.data.get('email') or '').strip()
        phone = (request.data.get('phone') or '').strip()

        if not email and not phone:
            return Response(
                {'error': 'Email or phone is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if email:
                user = CustomUser.objects.get(email=email)
                profile = Profile.objects.get(user=user)
            else:
                profile = Profile.objects.get(phone=phone)
                user = profile.user
        except (CustomUser.DoesNotExist, Profile.DoesNotExist):
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        if profile.status == "deleted":
            return Response(
                {'message': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        stamp_user_otp(user, otp)
        # print(user.otp)

        try:
            if email:
                subject = 'Password Reset OTP'
                message = (
                    f'Your OTP for password reset is: {otp}\n'
                    f'This OTP is valid for {get_otp_validity_minutes()} minutes.'
                )
                from_email = settings.EMAIL_HOST_USER
                recipient_list = [email]

                # Render the email body from the HTML template
                html_message = render_to_string('email_temp.html', {
                    'title': 'Password Reset OTP',
                    'otp': message,
                    'image': TRUSTWORK_BASE_API
                })

                send_mail(
                    subject=subject,
                    message=message,
                    from_email=from_email,
                    recipient_list=recipient_list,
                    html_message=html_message
                )
                save_user_otp(user)

                return Response(
                    {'message': 'OTP has been sent to your email'},
                    status=status.HTTP_200_OK
                )

            phone_number = f"{profile.phone_extension or ''}{profile.phone or ''}"
            if not phone_number:
                return Response(
                    {'error': 'User phone number is not available'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            send_otp_sms(phone_number, otp)
            save_user_otp(user)
            return Response(
                {'message': 'OTP has been sent to your phone'},
                status=status.HTTP_200_OK
            )
        except Exception:
            logger.exception("Failed to send password reset OTP for user %s", user.pk)
            delivery_channel = 'email' if email else 'phone'
            return Response(
                {'error': f'Failed to send OTP {delivery_channel}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AuthVerifyOTPView(APIView):

    @swagger_auto_schema(
        operation_summary="Verify OTP for Account Activation",
        operation_description="Verifies the OTP sent to the user's email or phone. If valid, activates the user's account.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
                'phone': openapi.Schema(type=openapi.TYPE_STRING, description='User phone'),
                'otp': openapi.Schema(type=openapi.TYPE_STRING, description='OTP code sent to user'),
            },
            required=['otp']
        ),
        responses={
            200: openapi.Response('OTP verified successfully'),
            400: openapi.Response('OTP not verified or user does not exist'),
        }
    )
    def post(self, request):
        email = (request.data.get('email') or '').strip()
        phone = (request.data.get('phone') or '').strip()
        # print(request.data)
        otp = request.data.get('otp')

        if not email and not phone:
            return Response(
                {'error': 'Email or phone is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if email:
                user = CustomUser.objects.get(email=email)
            else:
                user = Profile.objects.get(phone=phone).user
                # user = CustomUser.objects.get(profile__phone=phone)
        except (CustomUser.DoesNotExist, Profile.DoesNotExist):
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        if user.password_reset_otp is not None and user.password_reset_otp == otp:
            user.password_reset_otp = None
            user.is_active = True
            user.is_user_active = True
            user.save()

            return Response(
                {'message': 'OTP verified successfully'},
                status=status.HTTP_200_OK
            )
        elif user.otp and user.otp == otp:
            if is_user_otp_expired(user):
                return Response(
                    {'error': 'OTP has expired. Please request a new OTP.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.is_user_active = True
            user.is_active = True
            clear_user_otp(user)
            _save_user_fields(user, ["is_user_active", "is_active", "otp", "otp_created_at"])
            return Response(
                {'message': 'OTP verified successfully'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'OTP not verified, please check your OTP'},
                status=status.HTTP_400_BAD_REQUEST
            )
        # serializer = VerifyOTPSerializer(data=request.data)
        # if serializer.is_valid():
        #     user = serializer.validated_data['user']
        #     user.password_reset_otp = None
        #     user.is_active = None
        #     user.save()

        #     return Response(
        #         {'message': 'OTP verified successfully'},
        #         status=status.HTTP_200_OK
        #     )
        # return Response(
        # serializer.errors,
        # status=status.HTTP_400_BAD_REQUEST
        # )

class ChangePasswordView(APIView):
    permission_classes = [AllowAny]
    serializer_class = ChangePasswordSerializer

    @swagger_auto_schema(
        operation_summary="Change Password",
        operation_description="Allows users to change their password after OTP verification.",
        request_body=ChangePasswordSerializer,
        responses={
            200: openapi.Response('Password changed successfully'),
            400: openapi.Response('Validation error: Incorrect password, passwords do not match, or user not verified'),
            404: openapi.Response('User not found'),
        }
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data.get('email')
        phone = serializer.validated_data.get('phone')
        new_password = serializer.validated_data['new_password']
        confirm_password = serializer.validated_data['confirm_password']

        try:
            if email:
                user = User.objects.get(email=email)
            if phone:
                user=Profile.objects.get(phone=phone).user
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # if not user.check_password(serializer.validated_data['current_password']):
        #     return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.is_active:
            return Response({'error': 'Please verify OTP before changing password'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.is_otp_verified = False
        user.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


class UserProfileCreateView(APIView):
    @staticmethod
    def _first_error_message(errors):
        if isinstance(errors, dict):
            for value in errors.values():
                message = UserProfileCreateView._first_error_message(value)
                if message:
                    return message
            return "Invalid input."
        if isinstance(errors, list | tuple):
            return UserProfileCreateView._first_error_message(errors[0]) if errors else "Invalid input."
        return str(errors) if errors else "Invalid input."

    @staticmethod
    def _safe_request_payload(data):
        payload = data.copy()
        sensitive_keys = {"password", "confirm_password", "otp", "token"}
        for key in sensitive_keys:
            if key in payload:
                payload[key] = "***"
        return payload

    @swagger_auto_schema(
        operation_description="Create a new user profile.",
        request_body=UserProfileSerializer,
        responses={
            status.HTTP_201_CREATED: openapi.Response(
                description="User profile created successfully.",
                schema=UserProfileSerializer
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Invalid input.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'email': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING), example=['This field may not be blank.']),
                        'password': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING), example=['This field may not be blank.']),
                        'phone': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING), example=['This field may not be blank.']),
                        'full_name': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING), example=['This field may not be blank.']),
                    }
                )
            )
        }
    )
    def post(self, request):
        if settings.DEBUG:
            logger.info(
                "DEV signup payload: %s",
                self._safe_request_payload(request.data),
            )
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            referal_code=request.data.get("referred_by_code","")
            if referal_code:
                referer_user=CustomUser.objects.filter(user_referal_code=referal_code).last()
                if not referer_user:
                    return Response({
                        "status": "400",
                        "type": "error",
                        "message": "Invalid Referal code",
                        "data": {"referred_by_code": ["Invalid Referal code"]},
                    }, status=status.HTTP_400_BAD_REQUEST)
            try:
                with transaction.atomic():
                    user = serializer.save(referred_by_code=referal_code)
            except DRFValidationError as exc:
                return Response({
                    "status": "400",
                    "type": "error",
                    "message": self._first_error_message(exc.detail),
                    "data": exc.detail,
                }, status=status.HTTP_400_BAD_REQUEST)
            response_data = UserProfileSerializer(user).data
            action = getattr(serializer, "registration_action", "created")
            message = {
                "created": f"User registered successfully. Please check your email or phone for the OTP. It is valid for {get_otp_validity_minutes()} minutes.",
                "reactivated": f"User account reactivated successfully. Please check your email or phone for the OTP. It is valid for {get_otp_validity_minutes()} minutes.",
                "updated_unverified": f"Registration details updated successfully. A new OTP has been sent. It is valid for {get_otp_validity_minutes()} minutes.",
            }.get(action, "User registered successfully. Please check your email or phone for the OTP.")
            return Response({
                "status": "200",
                "type": "success",
                "message": message,
                "data": response_data,
            }, status=status.HTTP_200_OK)

        error_message = self._first_error_message(serializer.errors)
        return Response({
            "status": "400",
            "type": "error",
            "message": error_message,
            "data": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

def send_otp_email(email, otp):
    subject = 'Your Registration OTP'
    message = f'Your OTP for registration is {otp}. This OTP is valid for {get_otp_validity_minutes()} minutes.'
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [email]

    # Render the email body from the HTML template
    html_message = render_to_string('email_temp.html', {
        'title': 'Registration OTP',
        'otp': message,
        'image': TRUSTWORK_BASE_API
    })

    send_mail(
        subject=subject,
        message=message,
        from_email=from_email,
        recipient_list=recipient_list,
        html_message=html_message
    )


class ResendOtp(APIView):
    permission_classes = [AllowAny]

    def _still_valid_response(self, user, channel):
        remaining_seconds = otp_remaining_seconds(user)
        return Response({
            "status": "200",
            "type": "success",
            "message": still_valid_otp_message(channel, remaining_seconds),
            "resent": False,
            "expires_in_seconds": remaining_seconds,
            "expires_in_minutes": otp_remaining_minutes(remaining_seconds),
        }, status=status.HTTP_200_OK)

    def _resent_response(self, channel):
        destination = "email" if channel == "email" else "phone"
        return Response({
            "status": "200",
            "type": "success",
            "message": f"OTP has been resent to your {destination}.",
            "resent": True,
            "expires_in_minutes": get_otp_validity_minutes(),
        }, status=status.HTTP_200_OK)

    def post(self, request):
        otp = str(random.randint(1000, 9999))
        email = str(request.data.get("email") or "").strip()
        phone = str(request.data.get("phone") or "").strip()

        if not email and not phone:
            return Response({
                "status": "400",
                "type": "error",
                "message": "Email or phone is required.",
            }, status=status.HTTP_400_BAD_REQUEST)

        if email:
            user = CustomUser.objects.filter(email=email).last()
            if not user:
                return Response({
                    "status": "404",
                    "type": "error",
                    "message": "User not found.",
                }, status=status.HTTP_404_NOT_FOUND)
            if user.is_user_active:
                return Response({
                    "status": "400",
                    "type": "error",
                    "message": "Account is already verified.",
                }, status=status.HTTP_400_BAD_REQUEST)
            if otp_remaining_seconds(user) > 0:
                return self._still_valid_response(user, "email")

            stamp_user_otp(user, otp)
            try:
                send_otp_email(email, otp)
                save_user_otp(user)
            except Exception:
                logger.exception("Failed to resend registration OTP email for user %s", user.pk)
                return Response({
                    "status": "500",
                    "type": "error",
                    "message": "Unable to resend OTP email. Please try again.",
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return self._resent_response("email")

        if phone:
            profile = Profile.objects.select_related("user").filter(phone=phone).last()
            if not profile:
                return Response({
                    "status": "404",
                    "type": "error",
                    "message": "User not found.",
                }, status=status.HTTP_404_NOT_FOUND)
            user = profile.user
            if user.is_user_active:
                return Response({
                    "status": "400",
                    "type": "error",
                    "message": "Account is already verified.",
                }, status=status.HTTP_400_BAD_REQUEST)
            if otp_remaining_seconds(user) > 0:
                return self._still_valid_response(user, "phone")

            phone_number = f"{profile.phone_extension or ''}{profile.phone or phone}"
            if not phone_number:
                return Response({
                    "status": "400",
                    "type": "error",
                    "message": "User phone number is not available.",
                }, status=status.HTTP_400_BAD_REQUEST)

            stamp_user_otp(user, otp)
            try:
                send_otp_sms(phone_number, otp)
                save_user_otp(user)
            except Exception:
                logger.exception("Failed to resend registration OTP SMS for user %s", user.pk)
                return Response({
                    "status": "500",
                    "type": "error",
                    "message": "Unable to resend OTP SMS. Please try again.",
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return self._resent_response("phone")
