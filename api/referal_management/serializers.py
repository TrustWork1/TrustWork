from rest_framework import serializers
from profile_management.models import AppReferContent

class AppReferSerializer(serializers.ModelSerializer):

    class Meta:
        model = AppReferContent
        fields = '__all__'