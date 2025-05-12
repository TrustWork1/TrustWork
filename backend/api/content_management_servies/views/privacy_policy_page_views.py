from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from content_management.models.privacy_policy_page_models import *
from api.content_management_servies.serializers.privacy_policy_page_serializers import *

class PrivacyPolicySectionView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        section = PrivacyPolicySection.objects.last()
        if not section:
            return Response([], status=status.HTTP_200_OK)
        
        serializer = PrivacyPolicySectionSerializer(section)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
