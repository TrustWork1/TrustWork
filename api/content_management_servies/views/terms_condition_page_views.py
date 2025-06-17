from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from content_management.models.terms_condition_page_models import *
from api.content_management_servies.serializers.terms_condition_page_serializers import *

class TermsConditionsSectionView(APIView):
    permission_classes=[IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Terms Conditions Page",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            ),
        ],
        responses={200: TermsConditionsSectionSerializer(many=True), 400: "Bad Request"},
    )
    def get(self, request):
        section = TermsConditionsSection.objects.last()
        if not section:
            return Response([], status=status.HTTP_200_OK)
        
        serializer = TermsConditionsSectionSerializer(section)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Terms Conditions Page",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            ),
        ],
        request_body=TermsConditionsSectionSerializer,
        responses={200: TermsConditionsSectionSerializer(many=True), 400: "Bad Request"},
    )
    def post(self, request):
        # Check if TermsConditionsSection already exists
        if TermsConditionsSection.objects.exists():
            return Response({"message": "TermsConditionsSection already exists. Use PUT to update."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        serializer = TermsConditionsSectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Terms Conditions Page",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            ),
        ],
        request_body=TermsConditionsSectionSerializer,
        responses={200: TermsConditionsSectionSerializer(many=True), 400: "Bad Request"},
    )
    def put(self, request):
        feature_section = TermsConditionsSection.objects.first()
        if not feature_section:
            return Response({"message": "TermsConditionsSection does not exist. Use POST to create."},
                            status=status.HTTP_404_NOT_FOUND)
        
        serializer = TermsConditionsSectionSerializer(feature_section, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "TermsConditionsSection updated successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TermsConditionsView(APIView):

    @swagger_auto_schema(
        operation_description="Terms Conditions Page",
        responses={200: "Privacy Policy Page Fetched successfully", 400: "Bad Request"},
    )
    def get(self, request):
        response_data = {}

        # Terms Conditions Section
        terms_conditions_section = TermsConditionsSection.objects.last()
        if terms_conditions_section:
            response_data = {
                "id": terms_conditions_section.id,
                "section_header": terms_conditions_section.section_header,
                "section_description": terms_conditions_section.section_description,
                "details": terms_conditions_section.details
            }
        return Response(response_data, status=status.HTTP_200_OK)
