from django.apps import AppConfig


class ProfileManagementConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'profile_management'

    def ready(self):
        from . import signals  # noqa: F401
