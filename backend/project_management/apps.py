from django.apps import AppConfig


class ProjectManagementConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'project_management'

    # def ready(self):
    #     from api.project import signals
