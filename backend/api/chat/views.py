
# from chat_management.utils import get_or_create_conversation 
from profile_management.models import Profile
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .serializers import NotificationSerializer
from rest_framework import status
from firebase_admin import messaging
from chat_management.models import Notification
from .serializers import ChatRoomSerializer,MessagesSerializer, AttatchmentSerializer
from chat_management.models import ChatRoom,Messages
class ChatHandlerView(APIView):
    # permission_classes=[IsAuthenticated]
    def post(self,request):
        user_profile=request.user.profile
        user_data={
            "user1":user_profile,
            "user2":request.data['user_id'],
        }
        user2=Profile.objects.get(id=request.data['user_id'])
        if ChatRoom.objects.filter(user1=user_profile,user2=user2):
            serializer=ChatRoomSerializer(ChatRoom.objects.filter(user1=user_profile,user2=user2).first())
        elif ChatRoom.objects.filter(user1=user2,user2=user_profile):
            serializer=ChatRoomSerializer(ChatRoom.objects.filter(user1=user2,user2=user_profile).first())
        else:
            serializer=ChatRoomSerializer(data=user_data)
            if serializer.is_valid(raise_exception=True):
                serializer.save(user1=request.user.profile,user2=user2)
        return Response(serializer.data)
    
    def get(self,request,chat_id=None):
        messages=Messages.objects.filter(chat_room__id=chat_id)
        serializer=MessagesSerializer(messages,many=True)
        return Response(serializer.data)
    
class ChatListView(APIView):
    def get(self,request):
        chat_rooms=ChatRoom.objects.filter(user1=request.user.profile)|ChatRoom.objects.filter(user2=request.user.profile)
        rooms=ChatRoomSerializer(chat_rooms,many=True)
        return Response(rooms.data)
    
class AttatchmentChatViewSent(APIView):
    def post(self,request):
        user_profile=request.user.profile
        chat_room=ChatRoom.objects.get(id=request.data['chat_id'])
        serializer=AttatchmentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user_profile=user_profile,chat_room=chat_room)
            return Response(serializer.data)
        return Response(serializer.errors)
    

# class AttatchmentView(APIView):
#     permission_classes = [IsAuthenticated]
#     def post(self,request, *args, **kwargs):
#         chat_room=ChatRoom.objects.get(id=request.data['chat_id'])
#         messages=Messages.objects.create(
#             chat_room=chat_room,
#             sender=request.user.profile,
#             message=request.data['message'],
#             attachment=request.data['attachment']
#             )
#         return Response({'message':'message sent'})


class SendAttachmentAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        data = request.data
        sender = request.user.profile
        message_id = data.get('message')

        try:
            message = Messages.objects.get(id=message_id)
        except Exception as e:
            print(e)
            return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AttatchmentSerializer(data=data)
        if serializer.is_valid():
            serializer.save(sender=sender, message=message)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SendNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        sender = request.user.profile
        receiver_id = data.get('receiver_id')
        # new_status = request.data.get('status')
        title = data.get('title')
        message = data.get('message')
        fcm_token = data.get('fcm_token')  # Token of the receiver device
        # profile_pic = data.get("profile_pic")
        # name = data.get("name")

        if not receiver_id or not title or not message or not fcm_token:
            return Response({"error": "Missing required fields"}, status=400)

        # if new_status is None:
        #     return Response({"error": "Status field is required"}, status=400)

 
        # # Save notification in the database
        notification = Notification.objects.create(
            sender=sender,
            receiver_id=receiver_id,
            title=title,
            message=message
        )

        # Send push notification using Firebase
        firebase_message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=message,
            ),
            token=fcm_token
        )
        try:
            messaging.send(firebase_message)
        except Exception as e:
            return Response({"error": f"Failed to send push notification: {str(e)}"}, status=500)

        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=201)


from rest_framework.generics import ListAPIView

class NotificationListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(receiver=self.request.user.profile,status=True).order_by('-created_at')




class ChangeNotificationStatusView(APIView):
    """
    API view to toggle the notification status (True/False) for the logged-in user.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        sender = request.user.profile.pk

        # Get the current status from the request
        new_status = request.data.get('status')

        if new_status is None:
            return Response({"error": "Status field is required"}, status=400)

        # Update the status of all notifications for the user
        Profile.objects.filter(user=request.user).update(notification_enabled=new_status)
        return Response({"success": True, "status": new_status}, status=200)
