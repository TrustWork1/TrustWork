from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from content_management.models.home_page_models import DownloadSection
from content_management.models.aboutus_page_models import *
from api.content_management_servies.serializers.aboutus_page_serializers import *

import os
import environ
env = environ.Env()
environ.Env.read_env(".env")
BASE_API = os.getenv('BASE_API')

class AboutUsSectionView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        try:
            about_us = AboutUs.objects.last()
            if not about_us:
                return Response([], status=status.HTTP_200_OK)

            serializer = AboutUsSerializer(about_us)
            data = serializer.data
            if about_us.image1:
                data['image1'] = BASE_API+about_us.image1.url
            if about_us.image2:
                data['image2'] = BASE_API+about_us.image2.url
            
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self, request):
        # Check if AboutUs already has data
        if AboutUs.objects.exists():
            return Response({"error": "About Us Section already exists"}, status=status.HTTP_400_BAD_REQUEST)
    
        serializer = AboutUsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            data = serializer.data
            # Add image URLs if available
            if serializer.instance.image1:
                data['image1'] = request.build_absolute_uri(serializer.instance.image1.url)
            if serializer.instance.image2:
                data['image2'] = request.build_absolute_uri(serializer.instance.image2.url)
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request):
        try:
            about_us = AboutUs.objects.last()
            if not about_us:
                return Response({"error": "About Us Section not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = AboutUsSerializer(about_us, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                data = serializer.data
                if about_us.image1:
                    data['image1'] = request.build_absolute_uri(about_us.image1.url)
                if about_us.image2:
                    data['image2'] = request.build_absolute_uri(about_us.image2.url)
                return Response(data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except AboutUs.DoesNotExist:
            return Response({"error": "About Us Section not found"}, status=status.HTTP_404_NOT_FOUND)

class TrustUsSectionView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        try:
            trustus_section = WhyYouTrustUsSection.objects.last()
            if not trustus_section:
                return Response([], status=status.HTTP_200_OK)
            
            serializer = WhyYouTrustUsSectionSerializer(trustus_section)
            data = serializer.data
            if trustus_section.section_image:
                data['section_image'] = BASE_API+trustus_section.section_image.url
            if trustus_section.image:
                data['image'] = BASE_API+trustus_section.image.url
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        # Check if WhyYouTrustUsSection already exists
        if WhyYouTrustUsSection.objects.exists():
            return Response({"message": "WhyYouTrustUs Section already exists. Use PUT to update."},
                            status=status.HTTP_400_BAD_REQUEST)
        
        serializer = WhyYouTrustUsSectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        trustus_section = WhyYouTrustUsSection.objects.first()
        if not trustus_section:
            return Response({"message": "WhyYouTrustUs Section does not exist. Use POST to create."},
                            status=status.HTTP_404_NOT_FOUND)
        
        serializer = WhyYouTrustUsSectionSerializer(trustus_section, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "WhyYouTrustUs Section updated successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TrustUsFeatureView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, pk=None):
        if pk:
            try:
                feature = WhyYouTrustUsFeature.objects.get(id=pk)
                data = {
                    "id": feature.id,
                    "title": feature.title,
                    "description": feature.description,
                    "icon": BASE_API+feature.icon.url if feature.icon else None
                }
            except WhyYouTrustUsFeature.DoesNotExist:
                return Response({"error": "Feature not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            features = WhyYouTrustUsFeature.objects.all()
            data = [
                {
                    "id": feature.id,
                    "title": feature.title,
                    "description": feature.description,
                    "icon": BASE_API+feature.icon.url if feature.icon else None
                }
                for feature in features
            ]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        section = WhyYouTrustUsSection.objects.first()
        if not section:
            return Response({"error": "WhyYouTrustUs Section not available"}, status=status.HTTP_404_NOT_FOUND)

        feature_serializer = WhyYouTrustUsFeatureSerializer(data={
            'why_you_trust_us_section': section.id,
            'title': request.data.get('title'),
            'description': request.data.get('description'),
            'icon': request.FILES.get('icon'),
        })

        if feature_serializer.is_valid():
            feature_serializer.save()
            return Response(feature_serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, pk=None):
        if pk:
            try:
                feature = WhyYouTrustUsFeature.objects.get(id=pk)
                feature.title = request.data.get('title', feature.title)
                feature.description = request.data.get('description', feature.description)
                if 'icon' in request.FILES:
                    feature.icon = request.FILES['icon']
                feature.save()
            except WhyYouTrustUsFeature.DoesNotExist:
                return Response({"error": "Feature not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Why-You-Trust-Us Feature updated successfully"}, status=status.HTTP_200_OK)

    def delete(self, request, pk=None):
        try:
            feature = WhyYouTrustUsFeature.objects.get(id=pk)
            feature.delete()
            return Response({"message": "Why-You-Trust-Us Feature deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except WhyYouTrustUsFeature.DoesNotExist:
            return Response({"error": "Feature not found"}, status=status.HTTP_404_NOT_FOUND)

class AboutUsView(APIView):
    def get(self, request):
        response_data = {}

        # AboutUs Header
        about_us = AboutUs.objects.last()
        if about_us:
            response_data["about_us"] = {
                "id": about_us.id,
                "section_header": about_us.section_header,
                "section_description": about_us.section_description,
                "title": about_us.title,
                "description": about_us.description,
                "image1": BASE_API+about_us.image1.url if about_us.image1 else None,
                "image2": BASE_API+about_us.image2.url if about_us.image2 else None
            }
        
        # Why You Trust Us Header
        trustus_section = WhyYouTrustUsSection.objects.last()
        if trustus_section:
            features = WhyYouTrustUsFeature.objects.filter(why_you_trust_us_section=trustus_section)
            response_data["why_you_trust_us"] = {
                "id": trustus_section.id,
                "section_header": trustus_section.section_header,
                "section_description": trustus_section.section_description,
                "section_image": BASE_API+trustus_section.section_image.url if trustus_section.section_image else None,
                "features": [
                    {
                        "id": feature.id,
                        "title": feature.title,
                        "description": feature.description,
                        "icon": BASE_API+feature.icon.url if feature.icon else None
                    }
                    for feature in features
                ],
                "image": BASE_API+trustus_section.image.url if trustus_section.image else None,
                "mission_title": trustus_section.mission_title,
                "mission_description": trustus_section.mission_description,
                "vision_title": trustus_section.vision_title,
                "vision_description": trustus_section.vision_description
            }
        
        # Download Section
        download_section = DownloadSection.objects.last()
        if download_section:
            response_data["download_section"] = {
                "id": download_section.id,
                "title": download_section.title,
                "description": download_section.description,
                "playstore_link": download_section.app_download.playstore_link if download_section.app_download else None,
                "appstore_link": download_section.app_download.appstore_link if download_section.app_download else None,
                "image": BASE_API+download_section.image.url if download_section.image else None,
            }
        return Response(response_data, status=status.HTTP_200_OK)
