from rest_framework import serializers
from chat_management.models import ChatRoom, Notification, Messages
# from profile_management.models import Profile
from api.profile.serializers import ProfileSerializer

class ChatRoomSerializer(serializers.ModelSerializer):
    # user1=serializers.CharField(source="user1.user.full_name",read_only=True)
    # user2=serializers.CharField(source="user2.user.full_name",read_only=True)
    user1=ProfileSerializer(read_only=True)
    user2=ProfileSerializer(read_only=True)
    last_message_details=serializers.SerializerMethodField()
    def get_last_message_details(self,obj):
        return MessagesSerializer(Messages.objects.filter(chat_room=obj).last()).data
    class Meta:
        model=ChatRoom
        fields=['user1','user2','id','last_message_details']

class MessagesSerializer(serializers.ModelSerializer):
    sender=serializers.CharField(source="sender.user.full_name")
    sender_pic=serializers.CharField(source="sender.profile_picture")
    sender_id=serializers.IntegerField(source="sender.id")
    
    # reciever_pic=serializers.SerializerMethodField()
    class Meta:
        model=Messages
        fields="__all__"
    # def get_reciever_pic(self,obj):
    #     pass


class AttatchmentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Messages
        fields=['id', 'message', 'file',]

from api.project.serializers import ProjectSerializer

from rest_framework import serializers
from chat_management.models import  Profile
from project_management.models import Project




class NotificationSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'sender', 'receiver', 'created_at', 'has_read', 'object_type', 'project_id', 'bid_id']

    def get_sender(self, obj):
        serializer = ProfileSerializer(obj.sender)
        return serializer.data
    def get_sender_name(self, obj):
        return obj.sender.user.full_name if obj.sender.user else "name not available"

    def get_sender_profile_pic(self, obj):
        return obj.sender.profile_picture if obj.sender and obj.sender.profile_picture else "profile_picture not available"
