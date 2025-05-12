from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import LocationSerailizer,JobCategorySerailizer
from master.models import Location,JobCategory

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class LocationApiView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve all job categories",
        responses={200: JobCategorySerailizer(many=True)}
    )
    def get(self,request):
        data=Location.objects.all()
        data=LocationSerailizer(data,many=True)
        return Response(data.data,status=status.HTTP_200_OK)
        

class JobCategoryApiView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve all job categories",
        responses={200: JobCategorySerailizer(many=True)},
    )
    # def get(self,request):
    #     data=JobCategory.objects.all()
    #     data=JobCategorySerailizer(data,many=True)
    #     return Response(data.data,status=status.HTTP_200_OK)
    def get(self, request, pk=None):
        try:
            provider_id = request.query_params.get('provider_id', "")
            user_type = request.query_params.get('user_type', " ")
            if pk:
                active_categories = JobCategory.objects.filter(pk=pk).order_by('updated_at').first()
                if active_categories:
                    serializer = JobCategorySerailizer(active_categories, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
            
            elif user_type:
                if user_type == 'client':
                    categories = JobCategory.objects.filter(profile__user__user_type='client').order_by('updated_at')
                elif user_type == 'provider':
                    if provider_id:
                        categories = JobCategory.objects.filter(profile__user__user_type='provider', profile__id=provider_id).order_by('-updated_at')
                    else:
                        categories = JobCategory.objects.filter(profile__user__user_type='provider').distinct().order_by('updated_at')
                else:
                    return Response({"message": "Invalid user type"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                data=JobCategory.objects.all().distinct().order_by('updated_at')
                serializer = JobCategorySerailizer(data, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            serializer = JobCategorySerailizer(categories, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"message": "Error occurred. Please check", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )