import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the stream name from the URL route
        stream_name = self.scope.get('url_route', {}).get('kwargs', {}).get('stream_name', None)
        self.room_group_name = f'chat_room_{stream_name}'  # Define the group name based on the stream
        self.room = stream_name
        
        # Join the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()  # Accept the WebSocket connection
        print("WebSocket connected to room:", self.room)

    async def receive(self, text_data):
        from chat_management.models import Messages, ChatRoom
        from profile_management.models import Profile
        from api.chat.serializers import MessagesSerializer
        try:
            data = json.loads(text_data)
            message = data.get('message', '')
            username = data.get('user_id', '')
            stream_name = self.room  # Get stream name directly from the instance variable

            # Save the message to the database
            await self.save_message(username, message, stream_name)

            # Broadcast the message to the group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'user_id': username,
                }
            )
            print("Message received and sent to group:", data)

        except json.JSONDecodeError:
            print("Invalid JSON received")

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"WebSocket disconnected from room {self.room_group_name}")

    async def chat_message(self, event):
        # from chat_management.models import Messages, ChatRoom
        from api.chat.serializers import MessagesSerializer
        # Retrieve the last message for the given chat room
        message = await self.get_last_message(self.room)

        # Send the message to WebSocket
        await self.send(text_data=json.dumps({
            'message':message
        }))

    @sync_to_async
    def save_message(self, username, message, stream_name):
        from chat_management.models import Messages, ChatRoom
        from profile_management.models import Profile
        from api.chat.serializers import MessagesSerializer
        # Fetch the Profile and ChatRoom objects from the database
        sender = Profile.objects.get(id=username)
        chat_room = ChatRoom.objects.get(id=stream_name)

        # Save the message in the database
        new_message = Messages.objects.create(sender=sender, message=message, chat_room=chat_room)
        return new_message

    @sync_to_async
    def get_last_message(self, stream_name):
        from chat_management.models import Messages, ChatRoom
        from profile_management.models import Profile
        from api.chat.serializers import MessagesSerializer
        # Get the last message for the given chat room
        chat_room = ChatRoom.objects.get(id=stream_name)
        return MessagesSerializer(Messages.objects.filter(chat_room=chat_room).last()).data

