from rest_framework import serializers
from adminsite_management.models import CMS, FAQ,QMS,QMSResponse
from api.profile.serializers import ProfileSerializer
from project_management.models import Currency

class CMSSerializer(serializers.ModelSerializer):
    class Meta:
        model = CMS
        fields = ['id', 'title', 'content', 'status']  # 'id' field is included for better API representation

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'status']  # 'id' field is included for better API representation

class QMSSerializer(serializers.ModelSerializer):
    user=ProfileSerializer(read_only=True)
    class Meta:
        model=QMS
        fields=['id', 'query', 'answer', 'status',"updated_at",'user']

    def create(self,validated_data):
        return QMS.objects.create(**validated_data)
    
class QMSReponseSerializer(serializers.ModelSerializer):
    qms=QMSSerializer(read_only=True)
    class Meta:
        model=QMSResponse
        fields=['id', 'qms', 'response']

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'