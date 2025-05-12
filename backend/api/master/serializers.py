from rest_framework import serializers
from master.models import Location,JobCategory
from project_management.models import Feedback, Project

class LocationSerailizer(serializers.ModelSerializer):
    class Meta:
        model=Location
        fields="__all__"
        

class JobCategorySerailizer(serializers.ModelSerializer):
    class Meta:
        model=JobCategory
        fields="__all__"
    # def get_service_provider(self, obj):
    #     client_id = Project.objects.filter(client_id=id)
    #     # return ProjectSerializer(client_id, many=True).data
    #     return obj.client_id.id