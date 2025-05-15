
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProfileSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from profile_management.models import BankDetails,UserDocuments,MembershipPlans,ProfileMembership,Profile
from .serializers import BankDetailsSerializer,UserDocumentsSerializer,MembershipPlansSerializer,ProfileMembershipSerializer,ProfilePreviousWorksSerializer,PreviousWorks
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from django.contrib.auth.models import Group
from django.core.mail import send_mail
from master.models import JobCategory
from django.db import transaction
from .serializers import ProfileSerializer
from .serializers import ProfilePaymentStatusSerializer
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
from geopy.distance import geodesic
from master.models import Location
from api.project.serializers import ProjectSerializer
# from .serializers import ProfileCoverImageUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from geopy.distance import geodesic
from customuser.models import CustomUser
from payment_handle.gateways.MTN import disbursement
from project_management.models import Profile, Project, Bid
from master.models import Location
import stripe, logging
from django.db.models import Q
from django.http import Http404


from rest_framework import generics, permissions
from .serializers import ProfileSerializer
from django.conf import settings
User = get_user_model()
from api.pagination import CustomPagination, CustomPaginationProjectProfile
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
stripe.api_key = settings.STRIPE_TEST_SECRET_KEY

class ProfileAPIViewSearch(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request,user_type):
        search_query = request.query_params.get('search', '')
        print(request.user.user_type)
        print(user_type)
        if search_query:
            profiles = Profile.objects.filter(user__user_type__icontains=user_type.strip()).filter(Q(user__full_name__icontains=search_query)|Q(user__email__icontains=search_query))
        else:
            profiles = Profile.objects.all()[:10]

        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)


class ProfileSelfView(APIView):
    permission_classes=[IsAuthenticated]
    parser_classes=[MultiPartParser,FormParser]
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
    )
    def get(self,request):
        profile=get_object_or_404(Profile,user__pk=request.user.pk)
        serializer=ProfileSerializer(profile)
        # print(request.user.id)
        coupon_check=Coupons.objects.filter(user=request.user.id, is_active=True)
        # for coupon in coupon_check:
        #     if coupon.expire_date < timezone.now().date():
        #         coupon.is_active=False
        #         coupon.save()
        if coupon_check.exists():
            request.user.is_discount=True
            request.user.save()
        else:
            request.user.is_discount=False
            request.user.save()

        response = {
            "status" : 200,
            "type" : "success",
            "message" : "data fetched successfully",
            "data" : serializer.data
        }    
        return Response(response,status=status.HTTP_200_OK)
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
        request_body=ProfileSerializer,
    )
    def put(self, request):
        print(request.data)
        
        profile = get_object_or_404(Profile, user__pk=request.user.pk)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            data=serializer.save(is_profile_updated=True)
            if "job_category" in request.data:
                try:
                    ids=str(request.data.get('job_category')).split(",")

                    job_categories = JobCategory.objects.filter(id__in=ids)
                    data.job_category.clear()
                    data.job_category.set(job_categories)
                    
                except Exception as e:
                        print(e) 
            response={
                "status":200,
                "type":"success",
                "message":"Profile Updated successfully",
                "data":serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes=[MultiPartParser,FormParser,JSONParser]
    
    @swagger_auto_schema(
        operation_description="Retrieve a profile by ID or list of profiles by user type",
        manual_parameters=[
            openapi.Parameter(
                'user_type', openapi.IN_QUERY, description="Filter profiles by user type", type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                'Authorization', openapi.IN_HEADER, description="Authorization token (Bearer token)", type=openapi.TYPE_STRING, required=True
            )
        ],
        responses={200: ProfileSerializer(many=True)}
    )
    # def get(self, request,user_type=None, pk=None):
    #     if pk:
    #         profile = get_object_or_404(Profile, pk=pk)
    #         serializer = ProfileSerializer(profile)
    #     else:
    #         if user_type:
    #             paginator = CustomPagination()
    #             profiles = Profile.objects.filter(user__user_type=user_type).order_by("-id").order_by("-updated_at")
    #             profiles = paginator.paginate_queryset(profiles, request)
    #             serializer = ProfileSerializer(profiles, many=True)
    #             return paginator.get_paginated_response(serializer.data)
    #         else:
    #             profiles = Profile.objects.all()
    #             serializer = ProfileSerializer(profiles, many=True)

    #     response = {
    #         "status" : 200,
    #         "type" : "success",
    #         "message" : "data fetched successfully",
    #         "data" : serializer.data
    #     }    
    #     return Response(response,status=status.HTTP_200_OK)

    def get(self, request, user_type=None, pk=None):
        if pk:
            profile = get_object_or_404(Profile, pk=pk)
            serializer = ProfileSerializer(profile)
        else:
            profiles = Profile.objects.all().order_by("-updated_at")
            if user_type:
                profiles = profiles.filter(user__user_type=user_type)
            
            phone = request.query_params.get('search', None)
            if phone:
                profiles = Profile.objects.filter(phone__icontains=phone) 
            email = request.query_params.get('search', None)
            if email:
                profiles = Profile.objects.filter(user__email__icontains=email) 
            full_name = request.query_params.get('search', None)
            if full_name:
                profiles = profiles|Profile.objects.filter(user__full_name__icontains=full_name)
            paginator = CustomPagination()
            profiles = profiles.order_by("-id", "-updated_at")
            paginated_profiles = paginator.paginate_queryset(profiles, request)
            
            serializer = ProfileSerializer(paginated_profiles, many=True)
            return paginator.get_paginated_response(serializer.data)

        response = {
            "status": 200,
            "type": "success",
            "message": "Data fetched successfully",
            "data": serializer.data
        }
        return Response(response, status=status.HTTP_200_OK)

    # def get(self, request, user_type=None, pk=None):
    #     if pk:
    #         profile = get_object_or_404(Profile, pk=pk) 
    #         serializer = ProfileSerializer(profile)
    #     else:
    #         profiles = Profile.objects.filter(is_profile_updated=True)

    #         if user_type:
    #             profiles = profiles.filter(user__user_type=user_type)

    #             search_query = request.query_params.get('search', None) 
    #             if search_query:
    #                 profiles = profiles.filter(
    #                     Q(user__email_icontains=search_query) | 
    #                     Q(user__full_name_icontains=search_query)
    #                 )

    #         profiles = profiles.order_by("-id", "-updated_at") 
    #         paginator = CustomPagination()
    #         paginated_profiles = paginator.paginate_queryset(profiles, request)

    #         serializer = ProfileSerializer(paginated_profiles, many=True) 
    #         return paginator.get_paginated_response(serializer.data)

    #     response = {
    #     "status": 200, "type": "success",
    #     "message": "Data fetched successfully", "data": serializer.data
    #     }
    #     return Response(response, status=status.HTTP_200_OK)

    # def post(self, request):
    #     # data={**request.data}
    #     print(type(request.data))
    #     # data['user_id']=request.user.id
    #     serializer = ProfileSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Create a new profile",
        request_body=ProfileSerializer,
        manual_parameters=[
        openapi.Parameter(
                'Authorization', openapi.IN_HEADER, description="Authorization token (Bearer token)", type=openapi.TYPE_STRING, required=True
            )],
        responses={
            201: ProfileSerializer,
            400: "Bad Request"
        }
    )
    def post(self, request,user_type=None):
        data = request.data
        print(request.data)
        user = None
        with transaction.atomic():
            if 'user' not in data:
                email = data.get('email')
                phone = data.get('phone')
                print(phone)
                print(email)
                existing_user = User.objects.filter(email=email).first()
                existing_phone = Profile.objects.filter(phone=phone).exists()
                print(existing_phone)
                if existing_user and existing_phone:
                    return Response({
                        "status": 400,
                        "type": "error",
                        "message": "Failed",
                        "data": {
                            "user": ["An account with this email and phone already exists."]
                        }
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                if existing_user:
                    return Response({
                        "status": 400,
                        "type": "error",
                        "message": "Failed",
                        "data": {
                            "user": ["An account with this email already exists."]
                        }
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                if existing_phone:
                    return Response({
                        "status": 400,
                        "type": "error",
                        "message": "Failed",
                        "data": {
                            "user": ["An account with this phone already exists."]
                        }
                    }, status=status.HTTP_400_BAD_REQUEST)
                if email:
                    user, created = User.objects.get_or_create(email=email)

                    if created:
                        random_password = get_random_string(length=10)
                        user.set_password(random_password)
                        user.user_type = user_type
                        full_name=data.get("full_name")
                        user.full_name=data.get("full_name")
                        user.first_name=full_name.split(" ")[0]
                        user.last_name="" if len(full_name.split(" "))==1 else " ".join(full_name.split(" ")[1:])
                        user.save()

                        group_name = user_type.capitalize()
                        group, _ = Group.objects.get_or_create(name=group_name)
                        user.groups.add(group)
                        try:
                            send_mail(
                            'Your Account Has Been Created',
                            f'Hello {user.email}, your account has been created. Your password is {random_password}',
                            settings.DEFAULT_FROM_EMAIL,
                            [user.email],
                            fail_silently=True,
                            )
                        except:
                            pass
                    # data['user'] = user.id
                    # request.data._mutable=True
                    request.data['user']=user.id

            else:
                user = request.user
            # request.data._mutable=True
            request.data['user_type']=user_type
            print(request.data)
            serializer = ProfileSerializer(data=request.data)
            if serializer.is_valid():
                data=serializer.save()
                try:
                    job_categories = JobCategory.objects.filter(id__in=eval(str(request.data['job_category'])))
                    data.job_category.clear()
                    data.job_category.set(job_categories)
                except Exception as e:
                    print(e)
                    pass    
                response={
                    "status":200,
                    "type":"success",
                    "message":"profile created successfully",
                    "data":serializer.data
                }
                return Response(response, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Update a profile.",
        request_body=ProfileSerializer,
        responses={200: ProfileSerializer, 400: "Bad Request"},
        manual_parameters=[
            openapi.Parameter(
                'user_type', openapi.IN_QUERY, 
                description="User type of the profile", 
                type=openapi.TYPE_STRING, required=False
            ),
            openapi.Parameter(
                'pk', openapi.IN_PATH, 
                description="Primary key of the profile to update", 
                type=openapi.TYPE_INTEGER, required=True
            ),
            openapi.Parameter(
                'Authorization', openapi.IN_HEADER,
                description="Authorization token (Bearer Token)", 
                type=openapi.TYPE_STRING, required=True
            ),
        ]
    )
    def put(self, request, pk,user_type=None):
        updated_data = request.data.copy()
        phone = updated_data.get('phone')
        # print(phone)
        if phone:
            # Check if phone exists for a different profile
            existing_phone = Profile.objects.filter(phone=phone).exclude(id=pk).exists()
            if existing_phone:
                # Remove phone so it won't overwrite existing value
                updated_data.pop('phone')
                return Response({
                    "status": 400,
                    "type": "error",
                    "message": "Failed",
                    "data": {
                        "user": ["An account with this phone already exists."]
                    }
                }, status=status.HTTP_400_BAD_REQUEST)

        profile = get_object_or_404(Profile, pk=pk)
        serializer = ProfileSerializer(profile, data=updated_data, partial=True)
        if serializer.is_valid():
            data=serializer.save()
            if "job_category" in request.data:
                try:
                    job_categories = JobCategory.objects.filter(id__in=eval(str(request.data['job_category'])))
                    # ids=str(request.data.get('job_category')).split(",")
                    # print(ids)
                    # job_categories = JobCategory.objects.filter(id__in=ids)
                    data.job_category.clear()
                    data.job_category.set(job_categories)
                    
                except Exception as e:
                        print(e) 
            response={
                "status":201,
                "type":"success",
                "message":"Profile Updated successfully",
                "data":serializer.data
            }
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
            operation_description="Delete a profile.",
            manual_parameters=[
                openapi.Parameter(
                    'pk', openapi.IN_PATH,
                    description="Primary key of the profile to delete",
                    type=openapi.TYPE_INTEGER, required=True
                    ),
                    openapi.Parameter(
                        'Authorization', openapi.IN_HEADER,
                        description="Authorization token (Bearer Token)",
                        type=openapi.TYPE_STRING, required=True
                    ),
            ]
    )
    def delete(self, request, pk,user_type=None):
        profile = get_object_or_404(Profile, pk=pk)
        profile.user.delete()
        profile.delete()

        response = {
            "status" : 200,
            "type" : "success",
            "message" : "profile deleted successfully"
        }
        return Response(response,status=status.HTTP_200_OK)


# class JobCategoryUpdateView(APIView):
#     permission_classes=[IsAuthenticated]
#     parser_classes=[MultiPartParser,FormParser]
#     def put(self, request):
#         print(request.data)
        
#         profile = get_object_or_404(Profile, user__pk=request.user.pk)
#         serializer = ProfileSerializer(profile, data=request.data, partial=True)

#         if serializer.is_valid():
#             data = serializer.save(is_profile_updated=True)
            
#             if "job_category" in request.data:
#                 try:
#                     job_category_ids = request.data.get('job_category')
#                     if not isinstance(job_category_ids, list):
#                         job_category_ids = [job_category_ids]
                    
#                     job_categories = JobCategory.objects.filter(id__in=job_category_ids)
                    
#                     data.job_category.clear()
#                     data.job_category.set(job_categories)
                    
#                 except Exception as e:
#                     print(f"Error updating job categories: {e}")
            
#             response = {
#                 "status": 201,
#                 "type": "success",
#                 "message": "Profile Updated successfully",
#                 "data": serializer.data
#             }
#             return Response(response, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ChangeProfileStatusView(APIView):
    def put(self,request,pk=None,user_type=None):
        profile = get_object_or_404(Profile, pk=pk)
        profile.user.is_active=True if request.data.get("status")=="active" else False
        profile.user.save()
        profile.status=request.data.get("status")
        profile.save()

        response = {
            "status" : 202,
            "type" : "success",
            "message" : "profile status changed successfully"
        } 
        return Response(response,status=status.HTTP_202_ACCEPTED)



# class BankDetailsAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     @swagger_auto_schema(
#         operation_summary="Retrieve a specific bank detail or all bank details for the authenticated user",
#         manual_parameters=[
#             openapi.Parameter(
#                 'Authorization',
#                 openapi.IN_HEADER,
#                 description="Authorization token (Bearer Token)",
#                 type=openapi.TYPE_STRING,
#                 required=True 
#             )
#         ],
#         responses={200: BankDetailsSerializer(many=True)},
#         tags=['BankDetails'],
#     )
#     # def get(self, request, pk=None):
#     #     if pk:
#     #         bank_detail = get_object_or_404(BankDetails, pk=pk,user_profile__user=request.user)
#     #         serializer = BankDetailsSerializer(bank_detail)
#     #     else:
#     #         bank_details = BankDetails.objects.filter(user_profile__user=request.user).order_by("-updated_at")
#     #         serializer = BankDetailsSerializer(bank_details, many=True)

#     #     response = {
#     #         "status" : 200,
#     #         "type" : "success",
#     #         "message" : "data fetched successfully",
#     #         "data" : serializer.data
#     #     }
#     #     return Response(response,status=status.HTTP_200_OK)

#     def get(self, request, pk=None):
#         search_query = request.query_params.get("search", None)
        
#         if pk:
#             bank_detail = get_object_or_404(
#                 BankDetails,
#                 pk=pk,
#                 user_profile__user=request.user
#             )
#             serializer = BankDetailsSerializer(bank_detail)
#         else:
#             bank_details = BankDetails.objects.filter(user_profile__user=request.user)
            
#             if search_query:
#                 bank_details = bank_details.filter(Q(bank_name__icontains=search_query))
            
#             bank_details = bank_details.order_by("-updated_at")
#             serializer = BankDetailsSerializer(bank_details, many=True)

#         response = {
#             "status": 200,
#             "type": "success",
#             "message": "data fetched successfully",
#             "data": serializer.data
#         }
#         return Response(response, status=status.HTTP_200_OK)


#     @swagger_auto_schema(
#         request_body=BankDetailsSerializer,
#         operation_summary="Create a new bank detail",
#         manual_parameters=[
#             openapi.Parameter(
#                 'Authorization',
#                 openapi.IN_HEADER,
#                 description="Authorization token (Bearer Token)",
#                 type=openapi.TYPE_STRING,
#                 required=True 
#             )
#         ],
#         responses={201: BankDetailsSerializer},
#         tags=['BankDetails'],
#     )
#     def post(self, request):
#         data={**request.data}
#         print(request.user.id)
#         data['user_profile']=Profile.objects.get(user__id=request.user.id).pk
#         serializer = BankDetailsSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             response={
#                 "status" : 200,
#                 "type" : "success",
#                 "message" : "data created successfully",
#                 "data" : serializer.data
#             } 
#             return Response(response, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     @swagger_auto_schema(
#         operation_summary="Update Bank Details",
#         operation_description="Updates bank details for a specific bank record by primary key (pk).",
#         manual_parameters=[
#             openapi.Parameter(
#                 'Authorization',
#                 openapi.IN_HEADER,
#                 description="Authorization token (Bearer Token)",
#                 type=openapi.TYPE_STRING,
#                 required=True 
#             )
#         ],
#         request_body=BankDetailsSerializer,
#         responses={
#             200: openapi.Response(
#                 description="Data updated successfully",
#                 schema=openapi.Schema(
#                     type=openapi.TYPE_OBJECT,
#                     properties={
#                         "status": openapi.Schema(type=openapi.TYPE_INTEGER, description="Status code"),
#                         "type": openapi.Schema(type=openapi.TYPE_STRING, description="Response type"),
#                         "message": openapi.Schema(type=openapi.TYPE_STRING, description="Success message"),
#                         "data": openapi.Schema(type=openapi.TYPE_OBJECT, description="Updated bank details", additional_properties=True),
#                     }
#                 ),
#             ),
#             400: openapi.Response(
#                 description="Validation error",
#                 schema=openapi.Schema(
#                     type=openapi.TYPE_OBJECT,
#                     properties={
#                         'errors': openapi.Schema(type=openapi.TYPE_OBJECT, description="Detailed validation errors")
#                     }
#                 ),
#             ),
#             404: openapi.Response(description="Bank detail not found")
#         }
#     )
#     def put(self, request, pk):
#         bank_detail = get_object_or_404(BankDetails, pk=pk)
#         serializer = BankDetailsSerializer(bank_detail, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             response={
#                 "status" : 200,
#                 "type" : "success",
#                 "message" : "data updated successfully",
#                 "data" : serializer.data
#             }
#             return Response(response,status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     @swagger_auto_schema(
#         operation_summary="Delete a bank detail",
#         manual_parameters=[
#             openapi.Parameter(
#                 'Authorization',
#                 openapi.IN_HEADER,
#                 description="Authorization token (Bearer Token)",
#                 type=openapi.TYPE_STRING,
#                 required=True 
#             )
#         ],
#         responses={200: 'Bank detail deleted successfully'},
#         tags=['BankDetails'],
#     )
#     def delete(self, request, pk):
#         bank_detail = get_object_or_404(BankDetails, pk=pk)
#         bank_detail.delete()
#         response={
#             "status" : 200,
#             "type" : "success",
#             "message" : "data deleted successfully"
#         }
#         return Response(response,status=status.HTTP_200_OK)


import pycountry

def get_currency_code(country_code):
    country = pycountry.countries.get(alpha_2=country_code)
    if country:
        
        country_currency_map = {
    "AF": "AFN",  # Afghanistan -> Afghan Afghani
    "AL": "ALL",  # Albania -> Albanian Lek
    "DZ": "DZD",  # Algeria -> Algerian Dinar
    "AD": "EUR",  # Andorra -> Euro
    "AO": "AOA",  # Angola -> Angolan Kwanza
    "AR": "ARS",  # Argentina -> Argentine Peso
    "AM": "AMD",  # Armenia -> Armenian Dram
    "AU": "AUD",  # Australia -> Australian Dollar
    "AT": "EUR",  # Austria -> Euro
    "AZ": "AZN",  # Azerbaijan -> Azerbaijani Manat
    "BS": "BSD",  # Bahamas -> Bahamian Dollar
    "BH": "BHD",  # Bahrain -> Bahraini Dinar
    "BD": "BDT",  # Bangladesh -> Bangladeshi Taka
    "BB": "BBD",  # Barbados -> Barbadian Dollar
    "BY": "BYN",  # Belarus -> Belarusian Ruble
    "BE": "EUR",  # Belgium -> Euro
    "BZ": "BZD",  # Belize -> Belize Dollar
    "BJ": "CDF",  # Benin -> Central African CFA Franc
    "BT": "BTN",  # Bhutan -> Bhutanese Ngultrum
    "BO": "BOB",  # Bolivia -> Bolivian Boliviano
    "BA": "BAM",  # Bosnia and Herzegovina -> Convertible Mark
    "BW": "BWP",  # Botswana -> Botswanan Pula
    "BR": "BRL",  # Brazil -> Brazilian Real
    "BN": "BND",  # Brunei -> Brunei Dollar
    "BG": "BGN",  # Bulgaria -> Bulgarian Lev
    "BF": "XOF",  # Burkina Faso -> West African CFA Franc
    "BI": "BIF",  # Burundi -> Burundian Franc
    "KH": "KHR",  # Cambodia -> Cambodian Riel
    "CM": "CDF",  # Cameroon -> Central African CFA Franc
    "CA": "CAD",  # Canada -> Canadian Dollar
    "CV": "CVE",  # Cape Verde -> Cape Verdean Escudo
    "KY": "KYD",  # Cayman Islands -> Cayman Islands Dollar
    "CF": "XAF",  # Central African Republic -> Central African CFA Franc
    "TD": "CDF",  # Chad -> Central African CFA Franc
    "CL": "CLP",  # Chile -> Chilean Peso
    "CN": "CNY",  # China -> Chinese Yuan
    "CO": "COP",  # Colombia -> Colombian Peso
    "KM": "KMF",  # Comoros -> Comorian Franc
    "CG": "CDF",  # Congo, Republic of the -> Congolese Franc
    "CD": "CDF",  # Congo, Democratic Republic of the -> Congolese Franc
    "CR": "CRC",  # Costa Rica -> Costa Rican Colón
    "CI": "CFA",  # Côte d'Ivoire -> West African CFA Franc
    "HR": "HRK",  # Croatia -> Croatian Kuna
    "CU": "CUP",  # Cuba -> Cuban Peso
    "CY": "CYP",  # Cyprus -> Cypriot Pound
    "CZ": "CZK",  # Czech Republic -> Czech Koruna
    "DK": "DKK",  # Denmark -> Danish Krone
    "DJ": "DJF",  # Djibouti -> Djiboutian Franc
    "DM": "DOP",  # Dominica -> Dominican Peso
    "DO": "DOM",  # Dominican Republic -> Dominican Peso
    "EC": "USD",  # Ecuador -> United States Dollar
    "EG": "EGP",  # Egypt -> Egyptian Pound
    "SV": "SVC",  # El Salvador -> Salvadoran Colón
    "GQ": "GNF",  # Equatorial Guinea -> Central African CFA Franc
    "ER": "ERN",  # Eritrea -> Eritrean Nakfa
    "EE": "EEK",  # Estonia -> Estonian Kroon
    "ET": "ETB",  # Ethiopia -> Ethiopian Birr
    "FJ": "FJD",  # Fiji -> Fijian Dollar
    "FI": "EUR",  # Finland -> Euro
    "FR": "EUR",  # France -> Euro
    "GA": "GFA",  # Gabon -> Central African CFA Franc
    "GM": "GMD",  # Gambia -> Gambian Dalasi
    "GE": "GEL",  # Georgia -> Georgian Lari
    "DE": "EUR",  # Germany -> Euro
    "GH": "GHS",  # Ghana -> Ghanaian Cedi
    "GR": "EUR",  # Greece -> Euro
    "GD": "XCD",  # Grenada -> East Caribbean Dollar
    "GT": "GTQ",  # Guatemala -> Guatemalan Quetzal
    "GN": "GNF",  # Guinea -> Guinean Franc
    "GW": "GNF",  # Guinea-Bissau -> Guinean Franc
    "GY": "GYD",  # Guyana -> Guyanese Dollar
    "HT": "HTG",  # Haiti -> Haitian Gourde
    "HN": "HNL",  # Honduras -> Honduran Lempira
    "HK": "HKD",  # Hong Kong -> Hong Kong Dollar
    "HU": "HUF",  # Hungary -> Hungarian Forint
    "IS": "ISK",  # Iceland -> Icelandic Krona
    "IN": "INR",  # India -> Indian Rupee
    "ID": "IDR",  # Indonesia -> Indonesian Rupiah
    "IR": "IRR",  # Iran -> Iranian Rial
    "IQ": "IQD",  # Iraq -> Iraqi Dinar
    "IE": "EUR",  # Ireland -> Euro
    "IL": "ILS",  # Israel -> Israeli New Shekel
    "IT": "EUR",  # Italy -> Euro
    "JM": "JMD",  # Jamaica -> Jamaican Dollar
    "JP": "JPY",  # Japan -> Japanese Yen
    "JO": "JOD",  # Jordan -> Jordanian Dinar
    "KZ": "KZT",  # Kazakhstan -> Kazakhstani Tenge
    "KE": "KES",  # Kenya -> Kenyan Shilling
    "KI": "AUD",  # Kiribati -> Australian Dollar
    "KP": "KPW",  # North Korea -> North Korean Won
    "KR": "KRW",  # South Korea -> South Korean Won
    "KW": "KWD",  # Kuwait -> Kuwaiti Dinar
    "KG": "KGS",  # Kyrgyzstan -> Kyrgyzstani Som
    "LA": "LAK",  # Laos -> Laotian Kip
    "LV": "LVL",  # Latvia -> Latvian Lats
    "LB": "LBP",  # Lebanon -> Lebanese Pound
    "LS": "LSL",  # Lesotho -> Lesotho Loti
    "LR": "LRD",  # Liberia -> Liberian Dollar
    "LY": "LYD",  # Libya -> Libyan Dinar
    "LI": "CHF",  # Liechtenstein -> Swiss Franc
    "LT": "LTL",  # Lithuania -> Lithuanian Litas
    "LU": "EUR",  # Luxembourg -> Euro
    "MO": "MOP",  # Macau -> Macanese Pataca
    "MK": "MKD",  # North Macedonia -> Macedonian Denar
    "MG": "MGA",  # Madagascar -> Malagasy Ariary
    "MW": "MWK",  # Malawi -> Malawian Kwacha
    "MY": "MYR",  # Malaysia -> Malaysian Ringgit
    "MV": "MVR",  # Maldives -> Maldivian Rufiyaa
    "ML": "CFA",  # Mali -> West African CFA Franc
    "MT": "MNT",  # Malta -> Maltese Lira
    "MH": "USD",  # Marshall Islands -> United States Dollar
    "MQ": "EUR",  # Martinique -> Euro
    "MR": "MRU",  # Mauritania -> Ouguiya
    "MU": "MUR",  # Mauritius -> Mauritian Rupee
    "YT": "EUR",  # Mayotte -> Euro
    "MX": "MXN",  # Mexico -> Mexican Peso
    "FM": "USD",  # Micronesia -> United States Dollar
    "MD": "MDL",  # Moldova -> Moldovan Leu
    "MC": "EUR",  # Monaco -> Euro
    "MN": "MNT",  # Mongolia -> Mongolian Tugrik
    "ME": "EUR",  # Montenegro -> Euro
    "MA": "MAD",  # Morocco -> Moroccan Dirham
    "MZ": "MZN",  # Mozambique -> Mozambican Metical
    "MM": "MMK",  # Myanmar -> Myanmar Kyat
    "NA": "NAD",  # Namibia -> Namibian Dollar
    "NR": "AUD",  # Nauru -> Australian Dollar
    "NP": "NPR",  # Nepal -> Nepalese Rupee
    "NL": "EUR",  # Netherlands -> Euro
    "NC": "XPF",  # New Caledonia -> CFP Franc
    "NZ": "NZD",  # New Zealand -> New Zealand Dollar
    "NI": "NIO",  # Nicaragua -> Nicaraguan Córdoba
    "NE": "CDF",  # Niger -> Central African CFA Franc
    "NG": "NGN",  # Nigeria -> Nigerian Naira
    "NO": "NOK",  # Norway -> Norwegian Krone
    "NP": "NPR",  # Nepal -> Nepalese Rupee
    "OM": "OMR",  # Oman -> Omani Rial
    "PK": "PKR",  # Pakistan -> Pakistani Rupee
    "PA": "PAB",  # Panama -> Panamanian Balboa
    "PG": "PGK",  # Papua New Guinea -> Kina
    "PY": "PYG",  # Paraguay -> Paraguayan Guarani
    "PE": "PEN",  # Peru -> Peruvian Nuevo Sol
    "PH": "PHP",  # Philippines -> Philippine Peso
    "PL": "PLN",  # Poland -> Polish Zloty
    "PT": "PTE",  # Portugal -> Portuguese Escudo
    "QA": "QAR",  # Qatar -> Qatari Rial
    "RO": "RON",  # Romania -> Romanian Leu
    "RU": "RUB",  # Russia -> Russian Ruble
    "RW": "RWF",  # Rwanda -> Rwandan Franc
    "SA": "SAR",  # Saudi Arabia -> Saudi Riyal
    "SD": "SDG",  # Sudan -> Sudanese Pound
    "SN": "XOF",  # Senegal -> West African CFA Franc
    "SC": "SCR",  # Seychelles -> Seychellois Rupee
    "SL": "SLL",  # Sierra Leone -> Sierra Leonean Leone
    "SG": "SGD",  # Singapore -> Singapore Dollar
    "SK": "SKK",  # Slovakia -> Slovak Koruna
    "SI": "SIT",  # Slovenia -> Slovenian Tolar
    "SB": "SBD",  # Solomon Islands -> Solomon Islands Dollar
    "SO": "SOS",  # Somalia -> Somali Shilling
    "ZA": "ZAR",  # South Africa -> South African Rand
    "SS": "SSP",  # South Sudan -> South Sudanese Pound
    "ES": "EUR",  # Spain -> Euro
    "LK": "LKR",  # Sri Lanka -> Sri Lankan Rupee
    "SD": "SDG",  # Sudan -> Sudanese Pound
    "SR": "SRD",  # Suriname -> Surinamese Dollar
    "SE": "SEK",  # Sweden -> Swedish Krona
    "CH": "CHF",  # Switzerland -> Swiss Franc
    "SY": "SYP",  # Syria -> Syrian Pound
    "TW": "TWD",  # Taiwan -> New Taiwan Dollar
    "TJ": "TJS",  # Tajikistan -> Tajikistani Somoni
    "TZ": "TZS",  # Tanzania -> Tanzanian Shilling
    "TH": "THB",  # Thailand -> Thai Baht
    "TG": "CDF",  # Togo -> Central African CFA Franc
    "TO": "TOP",  # Tonga -> Tongan Paʻanga
    "TT": "TTD",  # Trinidad and Tobago -> Trinidad and Tobago Dollar
    "TN": "TND",  # Tunisia -> Tunisian Dinar
    "TR": "TRY",  # Turkey -> Turkish Lira
    "TM": "TMT",  # Turkmenistan -> Turkmenistan Manat
    "TC": "XCD",  # Turks and Caicos Islands -> East Caribbean Dollar
    "TV": "AUD",  # Tuvalu -> Australian Dollar
    "UG": "UGX",  # Uganda -> Ugandan Shilling
    "UA": "UAH",  # Ukraine -> Ukrainian Hryvnia
    "AE": "AED",  # United Arab Emirates -> UAE Dirham
    "GB": "GBP",  # United Kingdom -> British Pound
    "US": "USD",  # United States -> United States Dollar
    "UY": "UYU",  # Uruguay -> Uruguayan Peso
    "UZ": "UZS",  # Uzbekistan -> Uzbekistani Som
    "VU": "VUV",  # Vanuatu -> Vanuatu Vatu
    "VE": "VES",  # Venezuela -> Venezuelan Bolívar
    "VN": "VND",  # Vietnam -> Vietnamese Dong
    "WF": "CFP",  # Wallis and Futuna -> CFP Franc
    "YE": "YER",  # Yemen -> Yemeni Rial
    "ZM": "ZMW",  # Zambia -> Zambian Kwacha
    "ZW": "ZWD",  # Zimbabwe -> Zimbabwe Dollar
}

        return country_currency_map.get(country.alpha_2, "Currency not found")
    else:
        return "Country not found"

class BankDetailsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = {**request.data}
        try:
            user_profile = Profile.objects.get(user__id=request.user.id)
            data['user_profile'] = user_profile.pk
            user=user_profile.user
            email = user.email
            username = user.full_name
            #user_profile= user_profile.pk
            # data['user_profile'] = user_profile
            # email = CustomUser.objects.get(id=user_profile).email
            # username = CustomUser.objects.get(id=user_profile).full_name
            # bank_details = BankDetails.objects.get(user_profile_id=user_profile)
            # phone = Profile.objects.get(id=user_profile).phone
            # city = Profile.objects.get(id=user_profile).city
            # location_id  = Location.objects.get(id=user_profile).country
            # countey_loc = get_country_code(location_id)
            # state = Profile.objects.get(id=user_profile).state
            # street = Profile.objects.get(id=user_profile).street
            # zipcode = Profile.objects.get(id=user_profile).zip_code  
            # country_code = data.get("country", "IN")
            # if len(country_code) != 2:
            #     return JsonResponse({"error": "Invalid country code"}, status=400)
            
            bank_account_number = data.get('bank_account_number', '')
            # account_check = BankDetails.objects.filter(user_profile=user_profile, bank_account_number=bank_account_number).exists()

            # if account_check:
            #     return Response({"error": "Bank account already exists."}, status=400)

            # Checking if a Stripe account already exists
            existing_banks = BankDetails.objects.filter(user_profile=user_profile)
            stripe_account_id = existing_banks.last().stripe_account_id if existing_banks.exists() else None

            try:
                country = data.get("country", "US")
                currency_code = get_currency_code(country)

                bank_token = stripe.Token.create(
                    bank_account={
                        'country': country,
                        'currency': currency_code,
                        'account_holder_name': username,
                        'account_holder_type': 'individual',
                        'routing_number': data.get('ifsc_code', ''),
                        'account_number': bank_account_number,
                    },
                )
                
                if stripe_account_id:
                    # Use existing Stripe account
                    external_account = stripe.Account.create_external_account(
                        stripe_account_id,
                        external_account=bank_token.id
                    )
                    final_stripe_account_id = stripe_account_id
                else:
                    # Create new Stripe account
                    account = stripe.Account.create(
                        type = 'express',   # custom or express
                        country = country,
                        email = email,
                        business_type = "individual",
                        capabilities = {
                            "card_payments": {"requested": True},
                            "transfers": {"requested": True}
                        },
                    )
                    external_account = stripe.Account.create_external_account(
                        account.id,
                        external_account=bank_token.id
                    )
                    final_stripe_account_id = account.id

                fingerprint = external_account.fingerprint
                if BankDetails.objects.filter(user_profile=user_profile, bank_account_fingerprint=fingerprint).exists():
                    return Response({"error": "Bank account already exists."}, status=400)
                
                new_bank_details = BankDetails.objects.create(
                    user_profile=user_profile,
                    bank_name=data.get('bank_name'),
                    bank_account_number=external_account.last4,
                    ifsc_code=data.get('ifsc_code', ''),
                    is_primary=data.get('is_primary', False),
                    stripe_account_id=final_stripe_account_id,
                    stripe_bank_account_id=external_account.id,
                    stripe_external_account_id=bank_token.id,
                    routing_number=data.get('ifsc_code', ""),
                    bank_account_fingerprint=fingerprint,
                )
                if not stripe_account_id:
                    new_bank_details.is_primary = True
                    new_bank_details.save()

                return Response({
                    "status": 200,
                    "type": "success",
                    "message": "Bank account added successfully",
                    "bank_details": BankDetailsSerializer(new_bank_details).data
                }, status=status.HTTP_200_OK)

            except stripe.error.StripeError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": f"Something went wrong: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get(self, request, pk=None):
        try:
            if pk:
                bank_details = BankDetails.objects.filter(id=pk).first()
                return Response(BankDetailsSerializer(bank_details).data)
            else:
                user_profile = Profile.objects.get(user__id=request.user.id)
                user_profile = user_profile.pk
                bank_details = BankDetails.objects.filter(user_profile_id=user_profile)
                paginator = CustomPagination()
                paginated = paginator.paginate_queryset(bank_details, request)

                response_data = []
                for detail in paginated:
                    stripe_data = {}
                    if detail.stripe_account_id and detail.stripe_bank_account_id:
                        try:
                            bank_account = stripe.Account.retrieve_external_account(
                                detail.stripe_account_id,
                                detail.stripe_bank_account_id,
                            )
                            stripe_data = {
                                "bank_name": bank_account.get("bank_name"),
                                "last4": bank_account.get("last4"),
                                "ifsc_code": bank_account.get("routing_number"),
                                "account_holder_name": bank_account.get("account_holder_name"),
                                "currency": bank_account.get("currency"),
                            }
                        except Exception as e:
                            stripe_data = {"error": f"Stripe fetch failed: {str(e)}"}

                    response_data.append({
                        "id": detail.id,
                        "bank_name": detail.bank_name,
                        "bank_account_number": bank_account.get("last4"),
                        "ifsc_code": bank_account.get("routing_number"),
                        "routing_number": bank_account.get("routing_number"),
                        "currency": bank_account.get("currency"),
                        "is_primary": detail.is_primary,
                        "status": detail.status,
                        "created_at": detail.created_at,
                        "updated_at": detail.updated_at,
                        "user_profile": detail.user_profile.id,
                        # "stripe_details": stripe_data,
                    })

                return paginator.get_paginated_response(response_data)
        
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        except BankDetails.DoesNotExist:
            return Response({"error": "Bank details not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": f"Something went wrong: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # def put(self, request, pk):
    #     try:
    #         user_profile = Profile.objects.get(user=request.user)
    #         bank_detail = get_object_or_404(BankDetails, pk=pk, user_profile=user_profile)

    #         # Get current Stripe IDs
    #         stripe_account_id = bank_detail.stripe_account_id
    #         stripe_external_account_id = bank_detail.stripe_external_account_id

    #         # Remove old external bank account
    #         if stripe_account_id and stripe_external_account_id:
    #             stripe.Account.delete_external_account(
    #                 stripe_account_id, stripe_external_account_id
    #             )

    #         # Create new external bank account token
    #         currency_code = get_currency_code(request.data.get("country"))
    #         external_account = stripe.Token.create(
    #             bank_account={
    #                 'country': request.data.get("country"),
    #                 'currency': currency_code,
    #                 'account_holder_name': user_profile.user.full_name,
    #                 'account_holder_type': 'individual',
    #                 'routing_number': request.data.get("routing_number"),
    #                 'account_number': request.data.get("bank_account_number"),
    #             },
    #         )

    #         # Update BankDetails model
    #         serializer = BankDetailsSerializer(bank_detail, data={
    #             **request.data,
    #             "stripe_external_account_id": external_account.id,
    #             "stripe_bank_account_id": external_account.bank_account.id,
    #         }, partial=True)

    #         if serializer.is_valid():
    #             serializer.save()
    #             return Response({
    #                 "status": 200,
    #                 "type": "success",
    #                 "message": "Bank details updated successfully",
    #                 "stripe_account_id": stripe_account_id,
    #                 "stripe_external_account_id": external_account.id,
    #                 "stripe_bank_account_id": external_account.bank_account.id,
    #                 "bank_details": serializer.data
    #             }, status=status.HTTP_200_OK)

    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    #     except Profile.DoesNotExist:
    #         return Response({"detail": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)
    #     except stripe.error.StripeError as e:
    #         return Response({"error": f"Stripe error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    #     except Exception as e:
    #         print(f"Error: {e}")
    #         return Response({"error": f"Something went wrong: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, pk=None):
        try:
            bank_details = get_object_or_404(BankDetails, id=pk)
            user_profile = Profile.objects.get(user=request.user)

            # Check if the bank belongs to the logged-in user
            if bank_details.user_profile != user_profile:
                return Response({"error": "Unauthorized access."}, status=403)

            total_bank = BankDetails.objects.filter(user_profile=user_profile)

            if bank_details.is_primary == True:
                if total_bank.count() > 1:
                    return Response({"error": "You cannot delete the default/primary account"}, status=400)
            
            # If it's the only bank, delete the whole Stripe account
            if total_bank.count() == 1:
                try:
                    stripe.Account.delete(bank_details.stripe_account_id)
                except stripe.error.InvalidRequestError as e:
                    print(f"Stripe account not found or already deleted: {e.user_message}")
                bank_details.delete()
                return Response({"message": "Bank account deleted successfully"}, status=200)
            
            try:
                stripe.Account.delete_external_account(
                    bank_details.stripe_account_id,
                    bank_details.stripe_bank_account_id
                )
            except stripe.error.StripeError as e:
                return Response({"error": f"Stripe error: {e.user_message}"}, status=400)
            
            bank_details.delete()
            return Response({"message": "Bank account deleted successfully"}, status=200)
        
        except Http404:
                return Response({"error": "Bank account not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error: {e}")
            return Response({"error": f"Something went wrong: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PrimaryBankView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request, pk):
        try:
            user_profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({"detail": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the bank detail the user wants to make primary
        bank_detail = get_object_or_404(BankDetails, pk=pk, user_profile=user_profile)
        try:
            stripe.Account.modify_external_account(
                bank_detail.stripe_account_id,
                bank_detail.stripe_bank_account_id,
                default_for_currency=True
            )
        except stripe.error.StripeError as e:
            return Response({"error": f"Stripe error: {e.user_message}"}, status=400)

        # Unset existing primary bank (if any)
        BankDetails.objects.filter(user_profile=user_profile, is_primary=True).update(is_primary=False)

        # Set the selected bank as primary
        bank_detail.is_primary = True
        bank_detail.save()

        serializer = BankDetailsSerializer(bank_detail)

        response = {
            "status": 200,
            "type": "success",
            "message": "Bank account set as primary successfully.",
            "data": serializer.data
        }
        return Response(response, status=status.HTTP_200_OK)


class UserDocumentsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Retrieve User Documents",
        operation_description="Fetches user documents. If a primary key (pk) is provided, it fetches a specific document; otherwise, it fetches all documents for the user.",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: openapi.Response(
                description="Data fetched successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "status": openapi.Schema(type=openapi.TYPE_INTEGER, description="Status code"),
                        "type": openapi.Schema(type=openapi.TYPE_STRING, description="Response type"),
                        "message": openapi.Schema(type=openapi.TYPE_STRING, description="Success message"),
                        "data": openapi.Schema(type=openapi.TYPE_ARRAY, description="User documents data", items=openapi.Items(type=openapi.TYPE_OBJECT))
                    }
                )
            ),
            404: openapi.Response(description="Document not found"),
        }
    )
    def get(self, request, pk=None):
        if pk:
            document = get_object_or_404(UserDocuments, pk=pk,user_profile__user=request.user)
            serializer = UserDocumentsSerializer(document)
        else:
            documents = UserDocuments.objects.filter(user_profile__user=request.user).order_by('-updated_at')
            serializer = UserDocumentsSerializer(documents, many=True)

        response={
            "status" : 200,
            "type" : "success",
            "message" : "data fetched successfully",
            "data" : serializer.data
        }
        return Response(response,status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=MembershipPlansSerializer)
    def post(self, request):
        # data={**request.data}
        # request.data._is_mutable=True
        # data['user']=request.user.id
        request.data['user_profile']=Profile.objects.get(user__id=request.user.id).pk  # If giving error then remove this line
        serializer = UserDocumentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response={
            "status" : 201,
            "type" : "success",
            "message" : "data updated successfully",
            "data" : serializer.data
        }
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=MembershipPlansSerializer)
    def put(self, request, pk):
        document = get_object_or_404(UserDocuments, pk=pk)
        serializer = UserDocumentsSerializer(document, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            response={
            "status" : 202,
            "type" : "success",
            "message" : "data updated successfully",
            "data" : serializer.data
        }
            return Response(response,status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(responses={204: 'No Content'})
    def delete(self, request, pk):
        document = get_object_or_404(UserDocuments, pk=pk)
        document.delete()
        response={
            "status" : 200,
            "type" : "success",
            "message" : "data deleted successfully",
        }
        return Response(response,status=status.HTTP_200_OK)


# class MembershipPlansAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, pk=None):
#         if pk:
#             membership = get_object_or_404(MembershipPlans, pk=pk)
#             serializer = MembershipPlansSerializer(membership)
#         else:
#             memberships = MembershipPlans.objects.all()
#             serializer = MembershipPlansSerializer(memberships, many=True)

#         response={
#             "status" : 200,
#             "type" : "success",
#             "message" : "data fetched successfully",
#             "data" : serializer.data
#         }
#         return Response(response,status=status.HTTP_200_OK)

#     def post(self, request):
#         serializer = MembershipPlansSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             response={
#             "status" : 201,
#             "type" : "success",
#             "message" : "data created successfully",
#             "data" : serializer.data
#         }
#             return Response(response, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def put(self, request, pk):
#         membership = get_object_or_404(MembershipPlans, pk=pk)
#         serializer = MembershipPlansSerializer(membership, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             response={
#             "status" : 202,
#             "type" : "success",
#             "message" : "data updated successfully",
#             "data" : serializer.data
#         }
#             return Response(response,status=status.HTTP_202_ACCEPTED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         membership = get_object_or_404(MembershipPlans, pk=pk)
#         membership.delete()
#         response={
#             "status" : 200,
#             "type" : "success",
#             "message" : "data deleted successfully"
#             }
#         return Response(response,status=status.HTTP_200_OK)

class MembershipPlansAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
            manual_parameters=[
                openapi.Parameter('Authorization',openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)",
                    type=openapi.TYPE_STRING,required=True
                )
        ],
        responses={200: MembershipPlansSerializer(many=True)})
    # def get(self, request, pk=None):
    #     if pk:
    #         membership = get_object_or_404(MembershipPlans, pk=pk)
    #         serializer = MembershipPlansSerializer(membership)
    #     else:
    #         memberships = MembershipPlans.objects.all()
    #         title = request.query_params.get('title', None)
    #         if title:
    #             memberships = memberships.filter(title__icontains=title)
    #         serializer = MembershipPlansSerializer(memberships, many=True)


    #     response = {
    #         "status": 200,
    #         "type": "success",
    #         "message": "Data fetched successfully",
    #         "data": serializer.data
    #     }
    #     return Response(response, status=status.HTTP_200_OK)
    #     # return paginator.get_paginated_response(serializer.data)

    def get(self, request, pk=None):
        search_query = request.query_params.get("search", None)

        if pk:
            membership = get_object_or_404(MembershipPlans, pk=pk)
            serializer = MembershipPlansSerializer(membership)
        else:
            if search_query:
                memberships = memberships.filter(Q(plan_name__icontains=search_query))
            else:
                memberships = MembershipPlans.objects.all().order_by("-updated_at")  
            serializer = MembershipPlansSerializer(memberships, many=True)

        response = {
            "status": 200,
            "type": "success",
            "message": "Data fetched successfully",
            "data": serializer.data
        }
        return Response(response, status=status.HTTP_200_OK)


    @swagger_auto_schema(
            manual_parameters=[
                openapi.Parameter('Authorization',openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)",
                    type=openapi.TYPE_STRING,required=True
                )
            ],
            request_body=MembershipPlansSerializer)
    def post(self, request):
        serializer = MembershipPlansSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response = {
                "status": 201,
                "type": "success",
                "message": "Data created successfully",
                "data": serializer.data
            }
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
            manual_parameters=[
                openapi.Parameter('Authorization',openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)",
                    type=openapi.TYPE_STRING,required=True
                )
            ],
            request_body=MembershipPlansSerializer)
    def put(self, request, pk):
        membership = get_object_or_404(MembershipPlans, pk=pk)
        serializer = MembershipPlansSerializer(membership, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            response = {
                "status": 202,
                "type": "success",
                "message": "Data updated successfully",
                "data": serializer.data
            }
            return Response(response, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
            manual_parameters=[
                openapi.Parameter('Authorization',openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)",
                    type=openapi.TYPE_STRING,required=True
                )
            ],
            responses={204: 'No Content'})
    def delete(self, request, pk):
        membership = get_object_or_404(MembershipPlans, pk=pk)
        membership.delete()
        response = {
            "status": 200,
            "type": "success",
            "message": "Data deleted successfully"
        }
        return Response(response, status=status.HTTP_200_OK)


class ProfileMembershipAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('Authorization',openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,required=True
            )
        ],
        responses={200: ProfileMembershipSerializer(many=True)})
    def get(self, request, pk=None):
        if pk:
            profile_membership = get_object_or_404(ProfileMembership, pk=pk)
            serializer = ProfileMembershipSerializer(profile_membership)
        else:
            profile_memberships = ProfileMembership.objects.all()
            title = request.query_params.get('title', None)
            if title:
                memberships = memberships.filter(title__icontains=title)
        
            serializer = ProfileMembershipSerializer(profile_memberships, many=True)

        response = {
            "status": 200,
            "type": "success",
            "message": "Data fetched successfully",
            "data": serializer.data
        }
        return Response(response, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('Authorization',openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,required=True
            )
        ],
        request_body=ProfileMembershipSerializer)
    def post(self, request):
        serializer = ProfileMembershipSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            response = {
                "status": 201,
                "type": "success",
                "message": "Data created successfully",
                "data": serializer.data
            }
            return Response(response, status=status.HTTP_201_CREATED)
        return Response({"status": 400, "type": "error", "message": "Failed", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
            manual_parameters=[
                    openapi.Parameter('Authorization',openapi.IN_HEADER,
                        description="Authorization token (Bearer Token)",
                        type=openapi.TYPE_STRING,required=True
                    )
                ],
            request_body=MembershipPlansSerializer)
    def put(self, request, pk):
        profile_membership = get_object_or_404(ProfileMembership, pk=pk)
        serializer = ProfileMembershipSerializer(profile_membership, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            response = {
                "status": 202,
                "type": "success",
                "message": "Data updated successfully",
                "data": serializer.data
            }
            return Response(response, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
            manual_parameters=[
                openapi.Parameter('Authorization',openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)",
                    type=openapi.TYPE_STRING,required=True
                )
            ],
            responses={204: 'No Content'})
    def delete(self, request, pk):
        profile_membership = get_object_or_404(ProfileMembership, pk=pk)
        profile_membership.delete()
        response = {
            "status": 200,
            "type": "success",
            "message": "Data deleted successfully"
        }
        return Response(response, status=status.HTTP_200_OK)


# # class ProfileMembershipAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, pk=None):
#         if pk:
#             profile_membership = get_object_or_404(ProfileMembership, pk=pk)
#             serializer = ProfileMembershipSerializer(profile_membership)
#         else:
#             profile_memberships = ProfileMembership.objects.all()
#             serializer = ProfileMembershipSerializer(profile_memberships, many=True)

#         response={
#             "status" : 200,
#             "type" : "success",
#             "message" : "data fetched successfully",
#             "data" : serializer.data
#         }
#         return Response(response,status=status.HTTP_200_OK)

#     def post(self, request):
#         serializer = ProfileMembershipSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             response={
#             "status" : 201,
#             "type" : "success",
#             "message" : "data created successfully",
#             "data" : serializer.data
#         }
#             return Response(response, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def put(self, request, pk):
#         profile_membership = get_object_or_404(ProfileMembership, pk=pk)
#         serializer = ProfileMembershipSerializer(profile_membership, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             response={
#             "status" : 202,
#             "type" : "success",
#             "message" : "data updated successfully",
#             "data" : serializer.data
#         }
#             return Response(response,status=status.HTTP_202_ACCEPTED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         profile_membership = get_object_or_404(ProfileMembership, pk=pk)
#         profile_membership.delete()
#         response={
#             "status" : 200,
#             "type" : "success",
#             "message" : "data deleted successfully",
            
#         }
#         return Response(response,status=status.HTTP_200_OK)   

class ProfileDetailUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(
            operation_description="View Profile",
            operation_summary="View Profile",
            manual_parameters=(
                openapi.Parameter(
                    'Authorization', 
                    openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)", 
                    type=openapi.TYPE_STRING, 
                    required=True
                ),
            ),
            responses={200: ProfileSerializer(many=True)}
    )

    def get_object(self):
        return Profile.objects.get(user=self.request.user)
    
class ProfileCoverImageUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes=[MultiPartParser,FormParser]
    @swagger_auto_schema(
            operation_description="Update Profile Cover Image",
            operation_summary="Update Profile Cover Image",
            manual_parameters=[
                openapi.Parameter(
                    'Authorization',
                    openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)",
                    type=openapi.TYPE_STRING,
                    required=True
                    ),
                openapi.Parameter(
                    'cover_image',
                    openapi.IN_FORM,
                    description="cover_image",
                    type=openapi.TYPE_FILE,
                    required=True
                ),
            ],
            responses={200: 'Profile Cover Image Updated'}
    )
    def patch(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# class PaymentStatusview(generics.CreateAPIView):
#     permission_classes = [IsAuthenticated]
    # def post(self, request):
    #     payment_id = request.data.get('payment_id')
    #     payment = Payment.objects.get(id=payment_id)
    #     payment.status = 'paid'
    #     payment.save()
    #     return Response({"message": "Payment status updated successfully"}, status=status.HTTP_200_OK)
    
class PaymentStatusView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
            operation_description="Payment Status",
            operation_summary="Payment Status",
            manual_parameters=[
                openapi.Parameter(
                    'Authorization',
                    openapi.IN_HEADER,
                    description="Authorization token (Bearer Token)",
                    type=openapi.TYPE_STRING,
                    required=True
                    ),
            ],
            request_body=ProfilePaymentStatusSerializer,
            responses={200: ProfilePaymentStatusSerializer(many=True)}
    )
    def post(self, request):
        try:
            profile = Profile.objects.get(user__id=request.user.id)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProfilePaymentStatusSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# class ProfileDetails(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, user_type=None, pk=None):

#         latitude = request.query_params.get("latitude")
#         longitude = request.query_params.get("longitude")
#         radius = request.query_params.get("radius", 10)
#         user_type = request.query_params.get("user_type")
#         if not user_type:
#             return Response("user_type is required")
#         print("latitudelatitude--------", latitude, longitude, radius, user_type)
#         if pk:
#             profile = get_object_or_404(Profile, pk=pk)
#             serializer = ProfileSerializer(profile)
#             response = {
#                 "status": 200,
#                 "type": "success",
#                 "message": "Data fetched successfully",
#                 "data": serializer.data,
#             }
#             return Response(response, status=status.HTTP_200_OK)

#         # profiles = Profile.objects.all().order_by("updated_at")
#         # Paginate profiles
#         filtered_profiles = []

#         if latitude and longitude:
#             profiles = Profile.objects.filter(location__latitude=latitude, location__longitude=longitude)

#             print("profiles", profiles)
#             print(".exclude(request.user.id)---------", request.user.id)
        
#             profiles = profiles.filter(user__user_type=user_type)
#             user_location = (float(latitude), float(longitude))
#             profiles_data = []
            
#             for profile in profiles:
#                 location = Location.objects.filter(latitude=latitude,longitude=longitude).first()
#                 if location:
#                     profile_location = (location.latitude, location.longitude)
#                     if geodesic(user_location, profile_location).km <= float(radius):
#                         filtered_profiles.append(profile)

#             serializer = ProfileSerializer(filtered_profiles, many=True)
#             return Response(serializer.data)

#         # paginator = CustomPagination()
#         # paginated_profiles = paginator.paginate_queryset(profiles, request)
#         # serializer = ProfileSerializer(paginated_profiles, many=True)
#         # profiles_data = serializer.data
#         # return paginator.get_paginated_response(profiles_data)
#         return Response([])


class ProfileDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        search_query = request.query_params.get('search', '')
        if pk:
            return Response(ProfileSerializer(Profile.objects.get(pk=pk)).data)
        user = request.user 
        latitude = request.query_params.get("latitude")
        longitude = request.query_params.get("longitude")
        radius = request.query_params.get("radius", 10)
        # user_type = request.query_params.get("user_type")
        if not latitude or not longitude:
            return Response(
                {
                    "status": 400,
                    "type": "error",
                    "message": "Latitude and longitude are required",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_profile = user.profile
            user_type = user_profile.get_user_type_display()
        except Profile.DoesNotExist:
            return Response(
                {
                    "status": 400,
                    "type": "error",
                    "message": "User profile not found",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if user_type == "client":
            providers=Profile.objects.filter(user__user_type='provider')
            if search_query == '':
                providers=Profile.objects.filter(user__user_type='provider')
            if search_query:
                providers = Profile.objects.filter(user__full_name__icontains=search_query)
            filtered_providers = self.filter_by_location(providers, latitude, longitude)
            # feedback = Feedback.objects.get(providers)
            paginator = CustomPaginationProjectProfile()
            paginated_profiles = paginator.paginate_queryset(filtered_providers, request)
            serializer = ProfileSerializer(paginated_profiles, many=True) # list(filtered_providers)
            # serializer = ProfileSerializer(paginated_profiles, many=True)
            return paginator.get_paginated_response(serializer.data)
            

        elif user_type == "provider":
            # projects = Project.objects.filter(bid__service_provider=user_profile).select_related("client")
            clients = Profile.objects.filter(user__user_type='client')
            if search_query:
                clients = clients.filter(user__full_name__icontains=search_query)
            filtered_clients = self.filter_by_location(clients, latitude, longitude)
            paginator = CustomPaginationProjectProfile()
            paginated_profiles = paginator.paginate_queryset(list(filtered_clients), request)
            # serializer = ProfileSerializer(paginated_profiles, many=True)
            serializer = ProfileSerializer(paginated_profiles, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        return Response(
            {
                "status": 400,
                "type": "error",
                "message": "Invalid user type",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    from geopy.distance import geodesic 

    def filter_by_location(self, profiles, latitude, longitude):
        user_location = (float(latitude), float(longitude))
        filtered_profiles = []
        radius = 10
        for profile in profiles:  
            location = profile.location 
            if location:
                profile_location = (location.latitude, location.longitude)
                distance = geodesic(user_location, profile_location).km
                if distance <= radius: # float(radius)
                    filtered_profiles.append(profile)

        return filtered_profiles

# from chat_management.models import Message,Conversation
    # def filter_by_location(self, profiles, latitude, longitude, radius):
    #     user_location = (float(latitude), float(longitude))
    #     print("user_location", user_location)
    #     filtered_profiles = []
    #     for projects in profiles:
    #         location = Profile.location
    #         if location:
    #             print(f"Latitude: {location.latitude}, Longitude: {location.longitude}")
    #             profile_location = (location.latitude, location.longitude)
    #             distance = geodesic(user_location, profile_location).km
    #             if distance <= float(radius):
    #                 filtered_profiles.append(projects)
    #         else:
    #             print("Location is None or invalid") 

    #     # for profile in profiles:
    #     #     location = profile.location
    #     #     print("location", location)
    #     #     if location:
    #     #         profile_location = (location.latitude, location.longitude)
    #     #         print("profile_location", profile_location)
    #     #         distance = geodesic(user_location, profile_location).km
    #     #         print("distance", distance)
    #     #         if distance <= float(radius):
    #     #             filtered_profiles.append(profile)

    #     # return filtered_profiles

from django.db.models import F, Case, When, Value, BooleanField


class ProjectDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        search_query = request.query_params.get('search', '')
        if pk:
            project=Project.objects.get(pk=pk)
            # project=project.annotate(
            # can__send_bid=Case(
            #     When(bid__service_provider=request.user.profile, then=Value(False)),
            #     default=Value(True),
            #     output_field=BooleanField()
            # )
            # ).last()
            bids=Bid.objects.filter(project=project,service_provider=request.user.profile).exclude(status__iexact="Rejected")
            print(bids.count())
            if bids.count()>0:
                can__send_bid=False
            else:
                can__send_bid=True
                
            serializer=ProjectSerializer(project)

            return Response({"can__send_bid":can__send_bid,**serializer.data})
        user = request.user 
        print("user", user)
        # conversation_id = Message.objects.filter(Conversation=conversation_id).last()
        latitude = request.query_params.get("latitude")
        longitude = request.query_params.get("longitude")
        radius = request.query_params.get("radius", 10)
       
        if not latitude or not longitude:
            return Response(
                {
                    "status": 400,
                    "type": "error",
                    "message": "Latitude and longitude are required",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            user_profile = user.profile
            user_type = user_profile.get_user_type_display()
        except Profile.DoesNotExist:
            return Response(
                {
                    "status": 400,
                    "type": "error",
                    "message": "User profile not found",
                    
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        # user_type="provider"
        if user_type == "provider":
            user_categories=JobCategory.objects.filter(id__in=Profile.objects.get(id=user_profile.id).job_category.all().values_list("id",flat=True))
            #user_categories=JobCategory.objects.filter()
            clients = Project.objects.filter(project_category__in=JobCategory.objects.filter(id__in=user_categories)).exclude(status__iexact="completed").exclude(status__iexact="ongoing").exclude(status__iexact="myoffer") # client__user_type='client'
            if search_query == '':
                clients = Project.objects.filter(project_category__in=JobCategory.objects.filter(id__in=user_categories)).exclude(status__iexact="completed").exclude(status__iexact="ongoing").exclude(status__iexact="myoffer") # client__user_type='client'
            if search_query:
                clients = Project.objects.filter(Q(project_title__icontains=search_query) | Q(project_description__icontains=search_query))
            filtered_clients = self.filter_by_location(clients, latitude, longitude)
            if not filtered_clients:
                return Response({"message": "No clients found"}, status=status.HTTP_200_OK)
            paginator = CustomPaginationProjectProfile()
            paginated_profiles = paginator.paginate_queryset(filtered_clients, request)
            if not paginated_profiles:
                return Response({"message": "No clients found"}, status=status.HTTP_200_OK)
            serializer = ProjectSerializer(paginated_profiles, many=True)
            # serializer = ProjectSerializer(filtered_clients, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        return Response({"message": "Invalid user type"}, status=status.HTTP_400_BAD_REQUEST)

            
            # last_message_details = None
            # try:
            #     conversation = Conversation.objects.filter(participant=user_type).first()
            #     if conversation:
            #         last_message = Message.objects.filter(conversation=conversation).order_by('-sent_at').first()
            #         if last_message:
            #             last_message_details = {
            #                 "content": last_message.content,
            #                 "sent_at": last_message.sent_at,
            #             }
            # except Conversation.DoesNotExist:
            #     last_message_details = None

            # return Response(
            #     {
            #         "status": 200,
            #         "type": "success",
            #         "message": "Client details fetched successfully",
            #         "data": serializer.data,
            #         # "last_message": last_message_details,
            #     },
            #     status=status.HTTP_200_OK,
            # )

        
    def filter_by_location(self, profiles, latitude, longitude):
        user_location = (float(latitude), float(longitude))
        filtered_profiles = []
        radius = 10
        for projects in profiles:
            location = projects.project_location
            if location:
                profile_location = (location.latitude, location.longitude)
                distance = geodesic(user_location, profile_location).km
                if distance <= radius: #float(radius)
                    filtered_profiles.append(projects)

        return filtered_profiles

from profile_management.models import Subscriptions, Coupons
from datetime import datetime, timedelta
from django.utils import timezone
class HandleSubscription(APIView):
    def post(self,request):
        subscription_plan=request.data.get("subscriptionPlan")
        subscription_price=request.data.get("subscription_price",0)
        subscription_type=request.data.get("subscriptionType")
        

        if subscription_type.lower() == "google":
            subscription_receipt = request.data.get("subscriptionReceipt", {})
            purchase_token = subscription_receipt.get("purchaseToken")
        
        if subscription_type.lower() == "apple":
            subscription_receipt = request.data.get("subscriptionReceipt", {})
            purchase_token = subscription_receipt.get("transactionId")

        # check_purchase_token = Subscriptions.objects.filter(profile=request.user.profile,is_active=True, purchase_token=purchase_token)
        # if check_purchase_token.exists():
        #     return Response({"error":"Purchase token exists, try again."}, status=status.HTTP_400_BAD_REQUEST)

        Subscriptions.objects.filter(profile=request.user.profile,is_active=True).update(is_active=False)
        frequency=subscription_plan.split("_")[1]
        Subscriptions.objects.create(profile=request.user.profile,subscription_frequency=frequency.lower(),subscription_plan=subscription_plan,purchase_token=purchase_token)
        user_profile=request.user.profile
        user_profile.is_payment_verified=True
        referer_user=CustomUser.objects.filter(user_referal_code=request.user.referred_by_code).last()
        if referer_user:
            referer_user.total_referal_amount=float(referer_user.total_referal_amount)+float(subscription_price)*(5/100)
            referer_user.total_referal_count=int(referer_user.total_referal_count)+1
            referer_user.save()
        user_profile.save()
        coupon = Coupons.objects.filter(user=request.user, is_active=True).first()
        if coupon:
            coupon.is_active = False
            coupon.save()

        give_discount = CustomUser.objects.filter(user_referal_code=request.user.referred_by_code)
        referred_user = give_discount.first()
        # expire_date=timezone.now() + timedelta(days=30)
        from_user = Coupons.objects.filter(from_user=request.user.id).exists()
        
        if give_discount.exists():
            if not from_user:
                Coupons.objects.create(user=referred_user, from_user=request.user.id)
                CustomUser.objects.filter(user_referal_code=request.user.referred_by_code).update(is_discount=True)

        has_active_coupon = Coupons.objects.filter(user=request.user, is_active=True).exists()
        if not has_active_coupon:
            CustomUser.objects.filter(id=request.user.id).update(is_discount=False)

        return Response({"user_details":ProfileSerializer(request.user.profile).data})

class CouponsView(APIView):
    def get(self, request):
        print(request.user.id)
        coupons=Coupons.objects.filter(user=request.user.id, is_active=True)
        data=[]
        for coupon in coupons:
            data.append({
                "coupon_code": coupon.coupon_code,
                "is_active": coupon.is_active,
                #"expire_date": coupon.expire_date
            })

        response = {
            "status" : 200,
            "type" : "success",
            "message" : "All coupon fetched successfully",
            "data" : data
        }    
        return Response(response,status=status.HTTP_200_OK)

class HandleWithdraw(APIView):
    def post(self,request):
        user=request.user
        withdrawal_amount=user.total_referal_amount
        if not withdrawal_amount:
            withdrawal_amount=1
        mobile_number=user.profile.phone
        if not mobile_number:
            mobile_number="0"
        response=disbursement(withdrawal_amount,mobile_number)
        print(response)
        if "SUCCESS" in response.get("status",'').upper():
            user.total_referal_amount=0
        return Response({"message":response})
    
class PreviousWorksApiView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes=[MultiPartParser,FormParser,JSONParser]

    def post(self,request):
        print(request.data)
        print(request.FILES)
        for i in request.FILES.getlist('image'):
            PreviousWorks.objects.create(image=i,profile=request.user.profile)
        return Response({"message":"upload success"})
    
    def get(self,request):
        serializer=ProfilePreviousWorksSerializer(PreviousWorks.objects.filter(profile=request.user.profile))
        return Response(serializer.data)
    
    def delete(self, request,pk):
        data=get_object_or_404(PreviousWorks,pk=pk)
        data.delete()
        return Response({"message":"Deletion Successfull"})
        
