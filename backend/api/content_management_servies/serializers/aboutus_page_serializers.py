from rest_framework import serializers
from content_management.models.aboutus_page_models import *

class AboutUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutUs
        fields = '__all__'

class WhyYouTrustUsSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhyYouTrustUsSection
        fields = '__all__'

class WhyYouTrustUsFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhyYouTrustUsFeature
        fields = '__all__'
