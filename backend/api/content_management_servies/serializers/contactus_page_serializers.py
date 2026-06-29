from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import URLValidator
from rest_framework import serializers

from content_management.models.contactus_page_models import ContactForm, ContactUs


class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = '__all__'

    def validate(self, attrs):
        validator = URLValidator()
        url_fields = ['facebook_url', 'instagram_url', 'x_url', 'linkedin_url', 'youtube_url']
        for field in url_fields:
            url = attrs.get(field)
            if url:
                try:
                    validator(url)
                except DjangoValidationError as err:
                    raise serializers.ValidationError({field: "Enter a valid URL."}) from err
        return attrs

class ContactFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactForm
        fields = '__all__'
