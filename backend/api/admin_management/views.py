from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from adminsite_management.models import CMS, FAQ,QMS,QMSResponse
from .serializers import CMSSerializer, FAQSerializer,QMSSerializer,QMSReponseSerializer
from profile_management.models import Profile
from rest_framework import status
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
# from adminsite_management.models import CMS, FAQ
from .serializers import CMSSerializer, FAQSerializer
from api.pagination import CustomPagination, CustomPaginationTransition
from drf_yasg.views import get_schema_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db.models import Q, Sum, FloatField
from django.db.models.functions import Cast


# CMS SearchView 
class ProfileAPIViewSearch(APIView):

    def get(self, request):
        search_query = request.query_params.get('search', '')

        if search_query:
            cmss = CMS.objects.filter(title__icontains=search_query)
        else:
            cmss = CMS.objects.all()[:10]
        serializer = CMSSerializer(cmss, many=True)


        return Response(serializer.data)


class CMSListCreateAPIView(APIView):

    @swagger_auto_schema(
            operation_description="List all CMS",
            responses={
            200: CMSSerializer(), 404: "FAQ not found"
        }
    )
    def get(self, request):
        print("called")
        cms_entries = CMS.objects.all().order_by('id')
        name = request.query_params.get('search', None)
        if name:
            cms_entries = cms_entries.filter(title__icontains=name)
        paginator = CustomPaginationTransition()
        paginated_cms = paginator.paginate_queryset(cms_entries, request)
        serializer = CMSSerializer(paginated_cms, many=True)
        return paginator.get_paginated_response(serializer.data)

    @swagger_auto_schema(
        operation_description="Create a new CMS entry.",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True 
            )
        ],
        request_body=CMSSerializer,
        responses={
            status.HTTP_201_CREATED: openapi.Response(
                description="CMS entry created successfully.",
                schema=CMSSerializer
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Validation errors",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'status': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'type': openapi.Schema(type=openapi.TYPE_STRING),
                        'message': openapi.Schema(type=openapi.TYPE_STRING),
                        'errors': openapi.Schema(type=openapi.TYPE_OBJECT),
                    }
                )
            )
        }
    )
    def post(self, request):
        serializer = CMSSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": 201,
                "type": "success",
                "message": "CMS entry created successfully!",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "status": 400,
            "type": "error",
            "message": "Failed to create CMS entry.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class CMSDetailAPIView(APIView):

    @swagger_auto_schema(
        operation_description="Retrieve a CMS entry by ID.",
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="CMS entry retrieved successfully.",
                schema=CMSSerializer
            ),
            status.HTTP_404_NOT_FOUND: openapi.Response(
                description="CMS entry not found.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING, description="Error message")
                    }
                )
            )
        },
        manual_parameters=[
            openapi.Parameter(
                'pk',
                openapi.IN_PATH,
                description="Primary key of the CMS entry",
                type=openapi.TYPE_INTEGER,
                required=True
            )
        ]
    )
    def get(self, request, pk):
        try:
            cms_entry = CMS.objects.get(pk=pk)
        except CMS.DoesNotExist:
            return Response({'error': 'CMS entry not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CMSSerializer(cms_entry)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Update a CMS entry by ID.",
        request_body=CMSSerializer,
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="CMS entry updated successfully.",
                schema=CMSSerializer
            ),
            status.HTTP_404_NOT_FOUND: openapi.Response(
                description="CMS entry not found.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING, description="Error message")
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(
                description="Validation errors in submitted data.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'field_name': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING))
                    }
                )
            )
        },
        # manual_parameters=[
        #     openapi.Parameter(
        #         'pk',
        #         openapi.IN_PATH,
        #         description="Primary key of the CMS entry",
        #         type=openapi.TYPE_INTEGER,
        #         required=True
        #     )
        # ]
    )
    def put(self, request, pk):
        try:
            cms_entry = CMS.objects.get(pk=pk)
        except CMS.DoesNotExist:
            return Response({'error': 'CMS entry not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CMSSerializer(cms_entry, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Delete a CMS entry by ID.",
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="CMS entry deleted successfully.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "status": openapi.Schema(type=openapi.TYPE_INTEGER, description="Response status code"),
                        "type": openapi.Schema(type=openapi.TYPE_STRING, description="Response type"),
                        "message": openapi.Schema(type=openapi.TYPE_STRING, description="Success message"),
                    }
                )
            ),
            status.HTTP_404_NOT_FOUND: openapi.Response(
                description="CMS entry not found.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING, description="Error message")
                    }
                )
            )
        }
    )
    def delete(self, request, pk):
        try:
            cms_entry = CMS.objects.get(pk=pk)
        except CMS.DoesNotExist:
            return Response({'error': 'CMS entry not found'}, status=status.HTTP_404_NOT_FOUND)
        cms_entry.delete()
        response ={
            "status" : 200,
            "type" : "success",
            "message" : "data deleted successfully"
        }
        return Response(response,status=status.HTTP_200_OK)


# FAQ 
class ProfileAPIViewSearch(APIView):

    def get(self, request):
        search_query = request.query_params.get('search', '')

        if search_query:
            cmss = FAQ.objects.filter(question__icontains=search_query)
        else:
            cmss = FAQ.objects.all()[:10]
        serializer = FAQSerializer(cmss, many=True)

        return Response(serializer.data)

# FAQ API Views
class FAQListCreateAPIView(APIView):

    @swagger_auto_schema(
            operation_description="Get all FAQs.",
            responses={
                200: FAQSerializer(), 400: "Bad Request"
            }
    )
    def get(self, request):
        faq_entries = FAQ.objects.all().order_by('-updated_at')
        question = request.query_params.get("question", None)
        if question:
            faq_entries = faq_entries.filter(question__icontains=question)
        paginator = CustomPagination()
        paginated_faq = paginator.paginate_queryset(faq_entries, request)
        serializer = FAQSerializer(paginated_faq, many=True)
        return paginator.get_paginated_response(serializer.data)

    @swagger_auto_schema(
            operation_description="Create a new FAQ.",
            request_body=FAQSerializer,
            responses={
                201: FAQSerializer(), 400: "Bad Request"
                }
    )
    def post(self, request):
        serializer = FAQSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": 201,
                "type": "success",
                "message": "FAQ entry created successfully!",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "status": 400,
            "type": "error",
            "message": "Failed to create FAQ entry.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class FAQDetailAPIView(APIView):
    @swagger_auto_schema(
        operation_description="Get a FAQ by id.",
        responses={
            200: FAQSerializer(), 404: "FAQ not found"
        }
    )
    def get(self, request, pk):
        try:
            faq_entry = FAQ.objects.get(pk=pk)
        except FAQ.DoesNotExist:
            return Response({'error': 'FAQ entry not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = FAQSerializer(faq_entry)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
            operation_description="Update a FAQ.",
            request_body=FAQSerializer,
            responses={
                200: FAQSerializer(), 400: "Bad Request"
            }
    )
    def put(self, request, pk):
        try:
            faq_entry = FAQ.objects.get(pk=pk)
        except FAQ.DoesNotExist:
            return Response({'error': 'FAQ entry not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = FAQSerializer(faq_entry, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
            operation_description="Delete a FAQ.",
            request_body=FAQSerializer,
            responses={
                204: "FAQ deleted successfully", 404: "FAQ not found"
            }
    )
    def delete(self, request, pk):
        try:
            faq_entry = FAQ.objects.get(pk=pk)
        except FAQ.DoesNotExist:
            return Response({'error': 'FAQ entry not found'}, status=status.HTTP_404_NOT_FOUND)
        faq_entry.delete()
        response={
            "status" : 200,
            "type" : "success",
            "message" : "data deleted successfully"
        }
        return Response(status=status.HTTP_204_NO_CONTENT)

# QMS Field Search
class ProfileAPIViewSearch(APIView):

    def get(self, request,user_type):
        search_query = request.query_params.get('search', '')
        if search_query:
            profiles = QMS.objects.filter(user__user_type__icontains=user_type.strip()).filter(Q(user__full_name__icontains=search_query)|Q(user__email__icontains=search_query))
        else:
            profiles = QMS.objects.all()[:10]

        serializer = QMSSerializer(profiles, many=True)
        return Response(serializer.data)

class QMSAPIView(APIView):

    @swagger_auto_schema(
            operation_description="Get all QMS.",
            responses={
                200: QMSSerializer(many=True), 400: "Bad Request"
            }
    )
    def post(self,request):
        request.data['user']=request.user

        serializer = QMSSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=Profile.objects.get(user=request.user))
            return Response({
                "status": 200,
                "type": "success",
                "message": "Query created successfully!",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "status": 400,
            "type": "error",
            "message": "Failed to create Query.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
            operation_description="Get all QMS.",
            responses={
                200: QMSSerializer(many=True), 400: "Bad Request"
            }
    )
    def get(self, request, pk=None):
        if pk:
            try:
                query = QMS.objects.get(pk=pk)
                serializer = QMSSerializer(query)
                
            except QMS.DoesNotExist:
                return Response({'error': 'QMS query not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            query=QMS.objects.all().order_by('-updated_at')
            email = request.query_params.get('search', None)
            if email:
                query = query.filter(user__email__icontains=email)
            name = request.query_params.get('full_name', None)
            if name:
                query = query.filter(user__name__icontains=name)
            paginator = CustomPagination()
            result_page = paginator.paginate_queryset(query, request)
            serializer = QMSSerializer(result_page, many=True)
        # response={
        #         "status" : 200,
        #         "type" : "success",
        #         "message" : "data fetched successfully",
        #         'data' : serializer.data
        #     }
        return paginator.get_paginated_response(serializer.data)
        # return Response(response, status=status.HTTP_200_OK)

    @swagger_auto_schema(
            operation_description="Update QMS.",
            responses={
                200: QMSSerializer(), 400: "Bad Request"
            }
    )
    def put(self, request, pk):
        try:
            qms_entry = QMS.objects.get(pk=pk)
        except QMS.DoesNotExist:
            return Response({'error': 'QMS entry not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = QMSSerializer(qms_entry, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            response={
                "status" : 200,
                "type" : "success",
                "message" : "data updated successfully",
                'data' : serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
            operation_description="Delete QMS.",
            responses={
                200: "QMS deleted successfully", 400: "Bad Request"
            }
    )
    def delete(self, request, pk):
        try:
            qms_entry = QMS.objects.get(pk=pk)
        except QMS.DoesNotExist:
            return Response({'error': 'QMS entry not found'}, status=status.HTTP_404_NOT_FOUND)
        qms_entry.delete()
        response={
            "status" : 200,
            "type" : "success",
            "message" : "data deleted successfully"
        }
        return Response(response,status=status.HTTP_204_NO_CONTENT)

class QMSResponseApiView(APIView):

    @swagger_auto_schema(
            operation_description="Get QMS Response.",
            responses={
                200: QMSSerializer(), 400: "Bad Request"
            }
    )
    def get(self,request,pk=None):
        qms_response=QMSResponse.objects.filter(qms__pk=pk).last()
        serializer=QMSReponseSerializer(qms_response)
        data=serializer.data
        if not qms_response:
            data=QMS.objects.get(pk=pk)
            serializer=QMSSerializer(data)
            data={"qms":serializer.data,"response":""}
        data['qms']['user'] = {key: data['qms']['user'][key] for key in ["full_name","phone","email","user_type"] if key in data['qms']['user']}
        # data=serializer.data
        # keys_diff=set(data.keys())-{"full_name","phone","email"}
        response={
            "status" : 200,
            "type" : "success",
            "message" : "data fetched successfully",
            "data":data
        }
        return Response(response,status=status.HTTP_200_OK)
    

    @swagger_auto_schema(
            operation_description="Create QMS Response.",
            request_body=QMSReponseSerializer,
            responses={
                 200: QMSReponseSerializer(many=True), 400: "Bad Request"
                }
    )
    def post(self,request):
        qms_response=QMSResponse.objects.filter(qms__pk=request.data['qms']).last()
        # if qms_response:
        #     return Response({"errors":["Already Exists"]}, status=status.HTTP_400_BAD_REQUEST)

        serializer = QMSReponseSerializer(data=request.data)
        if serializer.is_valid():
            data=serializer.save(qms=QMS.objects.get(pk=request.data['qms']))
            send_mail(
                subject="Trustwork Support",
                message=f"{request.data['response']}",
                html_message=f"{request.data['response']}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[data.qms.user.user.email,"swapnil.chopra@webskitters.in"],
        )
            response={
                "status" : 200,
                "type" : "success",
                "message" : "QMS Replied successfully",
                "data":serializer.data
            }
            data.qms.status="inactive"
            data.qms.save()
            return Response(response,status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from customuser.models import CustomUser
from project_management.models import Project, Transactions
class DashboardAnalyticsView(APIView):
    def get(self,request):
        projects= Project.objects.all().count()
        clients = CustomUser.objects.filter(user_type="client").count()
        providers = CustomUser.objects.filter(user_type="provider").count()
        
        # Aggregate total project budget for active projects
        total_transaction = Transactions.objects.filter(status="completed").annotate(
            cost=Cast('bid__project_total_cost', FloatField())
        ).aggregate(total=Sum('cost'))['total'] or 0

        return Response({
            "projects": projects,
            "clients": clients,
            "providers": providers,
            "total_transaction": total_transaction
        }, status=status.HTTP_200_OK)