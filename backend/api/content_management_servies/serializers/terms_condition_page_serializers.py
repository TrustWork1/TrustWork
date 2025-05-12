from rest_framework import serializers
from content_management.models.terms_condition_page_models import *

class TermsConditionsSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TermsConditionsSection
        fields = '__all__'
