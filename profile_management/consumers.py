import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Profile, Chat
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
        else:
            self.room_group_name = f"chat_{self.user.id}"

            # Join the room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        receiver_id = data['receiver']

        receiver = await sync_to_async(Profile.objects.get)(id=receiver_id)

        # Save message to the database
        chat_message = await sync_to_async(Chat.objects.create)(
            sender=self.scope['user'].profile,
            receiver=receiver,
            message=message
        )

        # Send the message to the receiver
        await self.channel_layer.group_send(
            f"chat_{receiver.user.id}",
            {
                'type': 'chat_message',
                'message': message,
                'sender': self.scope['user'].username,
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender,
        }))
