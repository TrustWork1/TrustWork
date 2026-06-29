from rest_framework import serializers

from content_management.models.privacy_policy_page_models import PrivacyPolicySection


class PrivacyPolicySectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyPolicySection
        fields = '__all__'
