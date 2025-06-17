from rest_framework import serializers
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError as DjangoValidationError
from content_management.models.contactus_page_models import *

class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = '__all__'

    def validate(self, attrs):
        validator = URLValidator()
        url_fields = ['facebook_url', 'x_url', 'linkedin_url', 'youtube_url']
        for field in url_fields:
            url = attrs.get(field)
            if url:
                try:
                    validator(url)
                except DjangoValidationError:
                    raise serializers.ValidationError({field: "Enter a valid URL."})
        return attrs
    
class ContactFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactForm
        fields = '__all__'