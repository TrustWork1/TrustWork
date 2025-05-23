from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from customuser.models import CustomUser
from .serializers import RegistrationSerializer, LoginSerializer,UserProfileSerializer
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import DjangoUnicodeDecodeError
from profile_management.models import Profile
from .serializers import ResetPasswordEmailRequestSerializer, SetNewPasswordSerializer,ChangePasswordSerializer
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
import pytz
from utils import send_otp, send_otp_sms
from .serializers import GenerateOTPSerializer, VerifyOTPSerializer, ChangePasswordSerializer
from rest_framework.permissions import AllowAny
import random
from django.conf import settings

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from profile_management.models import Subscriptions, Coupons
from master.models import Location
User = get_user_model()


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
            user.is_user_active = True  # Activate the user
            user.save()
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
            print(serializer.data)
            # fcmtoken = request.serializer.data.get("fcmtoken", "")
            # devicetype = serializer.data.get("devicetype", "")
            if serializer.data.get("email"):
                user = authenticate(request, email=serializer.data['email'], password=serializer.data['password']) # fcmtoken=serializer.data['fcmtoken'], devicetype=serializer.data['devicetype']
            else:
                user = authenticate(request, phone=serializer.data['phone'], password=serializer.data['password']) # , fcmtoken=serializer.data['fcmtoken'], devicetype=serializer.data['devicetype']

            if user is not None:
                if user.is_active:
                    user.fcmtoken=request.data.get("deviceToken",'')
                    user.devicetype=request.data.get("deviceType",'')
                    user.save()
                    
                    if user.profile.is_payment_verified :
                        try:
                            subscription=Subscriptions.objects.get(profile=Profile.objects.get(user=user),is_active=True)
                            # subscription=user.profile.profile_subscription
                            freq_check=0
                            if subscription.subscription_frequency=="weekly":
                                freq_check=7
                            elif subscription.subscription_frequency=="monthly":
                                freq_check=30
                            elif subscription.subscription_frequency=="yearly":
                                freq_check=365
                            if timezone.now()- subscription.created_at > timedelta(days=freq_check):
                                user.profile.is_payment_verified=False
                                user.profile.save()
                        except Exception as e:
                            print(e)
                            pass
                    
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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        serializer = ResetPasswordEmailRequestSerializer(data=request.data, context={'request': request, 'frontend_url': 'https://trustwork-admin.dedicateddevelopers.us/'})
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

from .serializers import GenerateOTPSerializer, VerifyOTPSerializer, ChangePasswordSerializer
from rest_framework.permissions import AllowAny
import random
from django.conf import settings

User = get_user_model()

class GenerateOTPView(APIView):
    permission_classes = [AllowAny]
    serializer_class = GenerateOTPSerializer

    @swagger_auto_schema(
        operation_summary="Generate OTP for Password Reset",
        operation_description="Generates a 4-digit OTP and sends it to the user's email for password reset.",
        request_body=GenerateOTPSerializer,
        responses={
            200: openapi.Response('OTP has been sent to your email'),
            400: openapi.Response('Invalid data provided'),
            404: openapi.Response('No user found with this email'),
            500: openapi.Response('Failed to send email'),
        }
    )
    def post(self, request):
        otp = ''.join([str(random.randint(0, 9)) for _ in range(4)])

        email = request.data.get('email',None)
        phone = request.data.get('phone')
        
        try:
            if email:
                user = CustomUser.objects.get(email=email)
            if phone:
                try:
                    profile = Profile.objects.get(phone=phone)
                    user = profile.user
                    send_otp_sms(profile.phone_extension + profile.phone, otp)
                    user.otp = otp
                    user.save()
                    print(user.otp)
                    return Response({'message': 'OTP has been sent to your phone'}, status=status.HTTP_200_OK)
                except Profile.DoesNotExist:
                    return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
                # user=Profile.objects.get(phone=phone)
                # # user = CustomUser.objects.get(profile__phone=phone)
                # send_otp_sms(user.phone_extension+user.phone,otp)
                # user=user.user
                # user.otp = otp
                # user.save()
                # print(user.otp)
                # return Response(
                #         {'message': 'OTP has been sent to your phone'}, 
                #         status=status.HTTP_200_OK
                #         )
        except CustomUser.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
        
        user.otp = otp
        user.save()
        
        subject = 'Password Reset OTP'
        message = f'Your OTP for password reset is: {otp}\nThis OTP is valid for 10 minutes.'
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]
        
        # Render the email body from the HTML template
        html_message = render_to_string('emails/index.html', {
            'title': 'Password Reset OTP',
            'otp': f'Your OTP for password reset is: {otp}\nThis OTP is valid for 10 minutes.'
        })
        
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=recipient_list,
                html_message=html_message
            )
            return Response(
                {'message': 'OTP has been sent to your email'}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': 'Failed to send email'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AuthVerifyOTPView(APIView):

    @swagger_auto_schema(
        operation_summary="Verify OTP for Account Activation",
        operation_description="Verifies the OTP sent to the user's email. If valid, activates the user's account.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email'),
                'otp': openapi.Schema(type=openapi.TYPE_STRING, description='OTP code sent to user'),
            },
            required=['email', 'otp']
        ),
        responses={
            200: openapi.Response('OTP verified successfully'),
            400: openapi.Response('OTP not verified or user does not exist'),
        }
    )
    def post(self, request):
        email = request.data.get('email',None)
        phone = request.data.get('phone')
        print(request.data)
        otp = request.data.get('otp')
        print(otp)
        try:
            if email:
                user = CustomUser.objects.get(email=email)
            if phone:
                user=Profile.objects.get(phone=phone).user
                # user = CustomUser.objects.get(profile__phone=phone)
                print(user.otp)
        except CustomUser.DoesNotExist:
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
        elif user.otp and user.otp==otp:
            user.is_user_active = True
            user.is_active = True
            user.save()
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
        print(request.data)
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            referal_code=request.data.get("referred_by_code","")
            if referal_code:
                referer_user=CustomUser.objects.filter(user_referal_code=referal_code).last()
                if not referer_user:                    
                    return Response({"error":"Invalid Referal code"}, status=status.HTTP_400_BAD_REQUEST)
            user = serializer.save(referred_by_code=request.data.get("referred_by_code",''))
            response_data = serializer.data
            # response_data['year_of_experiance'] = request.data.get('year_of_experiance')
            return Response(response_data, status=status.HTTP_200_OK)
        error_message = list(serializer.errors.values())[0][0]  # Get the first error message
        error_string = f'{{"error": "{error_message}"}}'

        return Response({"error": f"{error_message}"}, status=status.HTTP_400_BAD_REQUEST)
        # serializer = UserProfileSerializer(data=request.data)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def send_otp_email(email, otp):
        subject = 'Your Registration OTP'
        message = f'Your OTP for registration is {otp}.'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]

        # Render the email body from the HTML template
        html_message = render_to_string('emails/index.html', {
            'title': 'Registration OTP',
            'otp': f'Your OTP for registration is {otp}.'
        })

        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=recipient_list,
            html_message=html_message
        )
class ResendOtp(APIView):
    def post(self,request):
        otp = str(random.randint(1000, 9999))
        email=request.data.get("email")
        phone=request.data.get("phone")
        if email:
            user=CustomUser.objects.filter(email=email).last()
            if user:
                send_otp_email(email,otp)
                user.otp=otp
                user.save()
        if phone:
            user=Profile.objects.filter(phone=phone).last()
            if user:
                send_otp_sms(user.phone_extension+phone,otp)
                user=user.user
                user.otp=otp
                user.save()

        return Response({"message":"Resend Otp Success"})