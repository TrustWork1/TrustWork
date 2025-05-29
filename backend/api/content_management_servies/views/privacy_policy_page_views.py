from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from content_management.models.privacy_policy_page_models import *
from api.content_management_servies.serializers.privacy_policy_page_serializers import *

class PrivacyPolicySectionView(APIView):
    permission_classes=[IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Privacy Policy Page",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            ),
        ],
        responses={200: PrivacyPolicySectionSerializer(many=True), 400: "Bad Request"},
    )
    def get(self, request):
        section = PrivacyPolicySection.objects.last()
        if not section:
            return Response([], status=status.HTTP_200_OK)
        
        serializer = PrivacyPolicySectionSerializer(section)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Privacy Policy Page Section",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            ),
        ],
        request_body=PrivacyPolicySectionSerializer,
        responses={200: PrivacyPolicySectionSerializer(many=True), 400: "Bad Request"},
    )
    def post(self, request):
        # Check if PrivacyPolicySection already exists
        if PrivacyPolicySection.objects.exists():
            return Response({"message": "PrivacyPolicySection already exists. Use PUT to update."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        serializer = PrivacyPolicySectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Privacy Policy Page Section",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            ),
        ],
        request_body=PrivacyPolicySectionSerializer,
        responses={200: PrivacyPolicySectionSerializer(many=True), 400: "Bad Request"},
    )
    def put(self, request):
        feature_section = PrivacyPolicySection.objects.first()
        if not feature_section:
            return Response({"message": "PrivacyPolicySection does not exist. Use POST to create."},
                            status=status.HTTP_404_NOT_FOUND)
        
        serializer = PrivacyPolicySectionSerializer(feature_section, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "PrivacyPolicySection updated successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PrivacyPolicyView(APIView):

    @swagger_auto_schema(
        operation_description="Privacy Policy Page",
        responses={200: "Privacy Policy Page Fetched successfully", 400: "Bad Request"},
    )
    def get(self, request):
        response_data = {}

        # Privacy Policy Section
        privacy_policy_section = PrivacyPolicySection.objects.last()
        if privacy_policy_section:
            response_data = {
                "id": privacy_policy_section.id,
                "section_header": privacy_policy_section.section_header,
                "section_description": privacy_policy_section.section_description,
                "details": privacy_policy_section.details
            }
        return Response(response_data, status=status.HTTP_200_OK)
