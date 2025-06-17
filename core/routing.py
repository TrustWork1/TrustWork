from django.urls import path,re_path
from .consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<stream_name>\d+)/$', ChatConsumer.as_asgi()),  # WebSocket endpoint for the chat
]






# from django.urls import path,re_path
# from .consumers import ChatConsumer

# websocket_urlpatterns = [
#     path('ws/chat/', ChatConsumer.as_asgi()),
#     # re_path(r'ws/chat/$', ChatConsumer.as_asgi()),
# ]

#git

# from django.urls import path, re_path

# from . import consumers

# websocket_urlpatterns = [
#     re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
# ]