from django.db.models.signals import post_save,post_delete
from django.dispatch import receiver
from project_management.models import Bid,Project,Feedback
from chat_management.models import Notification
from api.profile.serializers  import ProfileSerializer
from profile_management.models import Profile
import firebase_admin
# from chat_management.signals import *



# @receiver(post_save, sender=Project)
# def project_post_save_handler(sender, instance, created, **kwargs):
#     if created:
#         sender_profile = instance.client
#         message = f"Project '{instance.project_title}' has been created by {sender_profile.user.full_name}."
#         related_providers = Profile.objects.filter(job_category=instance.project_category).exclude(user=instance.client.user)
#         # related_providers = Project.objects.filter(service_provider=Bid.objects.filter(service_provider__id= instance.client.user.id).values_list('service_provider__id', flat=True))

#         # related_providers = related_providers
#         for provider in related_providers:
#             Notification.objects.create(
#                 sender=sender_profile,
#                 receiver=provider,
#                 title="New Project Created",
#                 message=message
#             )
#         sender_data = ProfileSerializer(sender_profile).data
#         sender_full_name = sender_data.get('full_name')
#         for provider in related_providers:
#             receiver_data = ProfileSerializer(provider).data
#             receiver_full_name = receiver_data.get('full_name')
#             firebase_admin.firestore.client().collection("messages").add({
#                 "message": message,
#                 "sender": {"full_name": sender_full_name},
#                 "receiver": {"full_name": receiver_full_name},
#             })







# @receiver(post_delete, sender=Project)
# def project_post_delete_handler(sender, instance, **kwargs):
#     sender_profile = instance.client
#     message = f"Project '{instance.project_title}' has been deleted by {sender_profile.user.full_name}."
#     related_providers = Profile.objects.filter(jobcategory=instance.project_category)
#     for provider in related_providers:
#         Notification.objects.create(
#             sender=sender_profile,
#             receiver=provider,
#             title="Project Deleted",
#             message=message
#         )
#     sender_data = ProfileSerializer(sender_profile).data
#     for provider in related_providers:
#         receiver_data = ProfileSerializer(provider).data
#         firebase_admin.firestore.client().collection("messages").add({
#             "message": message,
#             "sender": sender_data,
#             "receiver": receiver_data,
#         })


# @receiver(post_save, sender=Feedback)
# def create_feedback_notification(sender, instance, created, **kwargs):
#     """
#     Signal to create a notification when feedback is created or updated.
#     """
#     if created:
#         if instance.client_review and instance.client_rating:
#             Notification.objects.create(
#                 title="New Feedback Received",
#                 message=f"You have received feedback for the project: {instance.project.project_title}.",
#                 sender=instance.project.client, 
#                 receiver=instance.service_provider,  
#             )

#         # Create a notification for the client when a service provider provides feedback
#         if instance.provider_review and instance.provider_rating:
#             Notification.objects.create(
#                 title="Feedback from Service Provider",
#                 message=f"You have received feedback from the service provider for your project: {instance.project.project_title}.",
#                 sender=instance.service_provider, 
#                 receiver=instance.project.client,  
#             )