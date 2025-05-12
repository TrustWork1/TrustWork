from rest_framework import serializers
from content_management.models.home_page_models import *

class AppDownloadSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppDownload
        fields = '__all__'

class AppInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppInfo
        fields = '__all__'

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = '__all__'

class FeatureSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureSection
        fields = '__all__'

class HowItWorksStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = HowItWorksStep
        fields = '__all__'

class HowItWorksSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HowItWorksSection
        fields = '__all__'

class PriceFeaturesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceFeatures
        fields = '__all__'

class PricingPlanSerializer(serializers.ModelSerializer):
    billing_cycle = serializers.CharField()
    class Meta:
        model = PricingPlan
        fields = '__all__'

    def validate_billing_cycle(self, value):
        valid_choices = dict(PricingPlan.BILLING_CHOICES).keys()
        if value.capitalize() not in valid_choices:
            valid_str = ", ".join(valid_choices)
            raise serializers.ValidationError(
                f'"{value.capitalize()}" is not a valid choice. Choose from: {valid_str}'
            )
        return value.capitalize()

class PricingPlanSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingPlanSection
        fields = '__all__'

class ReferralSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralSection
        fields = '__all__'

class DownloadSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DownloadSection
        fields = '__all__'

