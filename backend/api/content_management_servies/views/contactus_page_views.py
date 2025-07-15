from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from content_management.models.home_page_models import DownloadSection
from content_management.models.contactus_page_models import *
from api.content_management_servies.serializers.contactus_page_serializers import *

class ContactUsDetailsView(APIView):
    permission_classes=[IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Contact-Us Page Section",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            ),
        ],
        responses={200: ContactUsSerializer(many=True), 400: "Bad Request"},
    )
    def get(self, request):
        try:
            contact_us = ContactUs.objects.last()
            if not contact_us:
                return Response([], status=status.HTTP_200_OK)

            contact_us_serializer = ContactUsSerializer(contact_us)
            data = contact_us_serializer.data

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Something went wrong: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @swagger_auto_schema(
        operation_description="Contact-Us Page Section",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            ),
        ],
        request_body=ContactUsSerializer,
        responses={200: ContactUsSerializer, 400: "Bad Request"},
    )
    def post(self, request):
        if ContactUs.objects.exists():
            return Response({"error": "Contact Us Section already exists"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ContactUsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            data = serializer.data
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Contact-Us Page Section",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            ),
        ],
        request_body=ContactUsSerializer,
        responses={200: ContactUsSerializer, 400: "Bad Request"},
    )
    def put(self, request):
        try:
            about_us = ContactUs.objects.last()
            if not about_us:
                return Response({"error": "About Us Section not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = ContactUsSerializer(about_us, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                data = serializer.data
                return Response(data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except ContactUs.DoesNotExist:
            return Response({"error": "About Us Section not found"}, status=status.HTTP_404_NOT_FOUND)

# Contact Us Form
class ContactUsFormView(APIView):
    def get_permissions(self):
        if self.request.method in ['GET', 'DELETE']:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    @swagger_auto_schema(
        operation_description="Contact-Us Form",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                name='id',
                in_=openapi.IN_QUERY,
                description="Contact-Us Form ID",
                type=openapi.TYPE_NUMBER,
                required=False
            ),
        ],
        responses={200: ContactFormSerializer(many=True), 400: "Bad Request"},
    )
    def get(self, request, pk=None):
        if pk:
            try:
                contact = ContactForm.objects.get(pk=pk)
                serializer = ContactFormSerializer(contact)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ContactForm.DoesNotExist:
                return Response({"error": "Contact form entry not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            contacts = ContactForm.objects.all().order_by("-id")
            serializer = ContactFormSerializer(contacts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Contact-Us Form",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            ),
        ],
        request_body=ContactFormSerializer,
        responses={200: ContactFormSerializer(many=True), 400: "Bad Request"},
    )
    def post(self, request):
        serializer = ContactFormSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def put(self, request, pk=None):
    #     if not pk:
    #         return Response({"error": "ContactForm ID is required for update"}, status=status.HTTP_400_BAD_REQUEST)
    #     try:
    #         contact = ContactForm.objects.get(pk=pk)
    #     except ContactForm.DoesNotExist:
    #         return Response({"error": "ContactForm not found"}, status=status.HTTP_404_NOT_FOUND)

    #     serializer = ContactFormSerializer(contact, data=request.data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Contact-Us Form",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            ),
            openapi.Parameter(
                name='id',
                in_=openapi.IN_QUERY,
                description="Contact-Us Form ID",
                type=openapi.TYPE_NUMBER,
                required=True
            ),
        ],
        responses={200: "ContactForm deleted successfully", 400: "Bad Request"},
    )
    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "ContactForm ID is required for deletion"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            contact = ContactForm.objects.get(pk=pk)
            contact.delete()
            return Response({"message": "ContactForm deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except ContactForm.DoesNotExist:
            return Response({"error": "ContactForm not found"}, status=status.HTTP_404_NOT_FOUND)

class ContactUsView(APIView):

    @swagger_auto_schema(
        operation_description="Contact-Us Page",
        responses={200: "Contact-Us Page Fetched successfully", 400: "Bad Request"},
    )
    def get(self, request):
        response_data = {}

        download_section = DownloadSection.objects.last()
        contact_us = ContactUs.objects.last()
        if contact_us:
            response_data = {
                "id": contact_us.id,
                "section_header": contact_us.section_header,
                "section_description": contact_us.section_description,
                "title": contact_us.title,
                "description": contact_us.description,
                "call_center_number": contact_us.call_center_number,
                "email": contact_us.email,
                "location": contact_us.location,
                "social_links": {
                    "facebook_url": contact_us.facebook_url,
                    "x_url": contact_us.x_url,
                    "linkedin_url": contact_us.linkedin_url,
                    "youtube_url": contact_us.youtube_url,
                },
                "longitude": contact_us.longitude,
                "latitude": contact_us.latitude,
                "map_url": contact_us.map_url,
                "get_in_touch_title": contact_us.get_in_touch_title,
                "get_in_touch_description": contact_us.get_in_touch_description,
                "download_section": {
                    "playstore_link": download_section.app_download.playstore_link if download_section.app_download else None,
                    "appstore_link": download_section.app_download.appstore_link if download_section.app_download else None
                }
            }
        
        return Response(response_data, status=status.HTTP_200_OK)
