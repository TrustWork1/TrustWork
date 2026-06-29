from django.apps import AppConfig


class ChatConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chat_management'
    # def ready(self):
    #     import chat_management.signals
    # def ready(self):
    #     # Initialize Firebase
    #     cred = credentials.Certificate('credentials/ServiceAccountKey.json')
    #     firebase_admin.initialize_app(cred)
