

from django.db.models.signals import post_save
from django.dispatch import receiver
from chat_management.models import  Notification
from project_management.models import Project,Bid
from profile_management.models import Profile
from django.utils.timezone import now

# @receiver(post_save, sender=Project)
# def create_project_notification(sender, instance, created, **kwargs):
#     if created:
#         service_providers = Profile.objects.filter(user__user_type='provider')
#         for provider in service_providers:
#             Notification.objects.create(
#                 notification_type='project_created',
#                 title="New Project Available!",
#                 message=f"A new project titled '{instance.title}' has been posted. Check it out and place your bids.",
#                 sender=instance.client,  # Assuming `client` is the ForeignKey in Project
#                 created_at=now()).recipients.add(provider)
            

# # Signal handler for bid creation
# @receiver(post_save, sender=Bid)
# def create_bid_notification(sender, instance, created, **kwargs):
#     if created:
#         # Notify the client about the new bid
#         Notification.objects.create(
#             notification_type='bid_floated',
#             title="New Bid Submitted",
#             message=f"Service provider {instance.service_provider.user.full_name} has placed a bid on your project '{instance.project.title}'.",
#             sender=instance.service_provider.profile,  # Assuming `service_provider` links to Profile
#             created_at=now()
#         ).recipients.add(instance.project.client)

# # Signal handler for bid acceptance
# @receiver(post_save, sender=Bid)
# def handle_bid_status_change(sender, instance, **kwargs):
#     if instance.status == 'accepted':
#         # Notify the accepted service provider
#         Notification.objects.create(
#             notification_type='bid_accepted',
#             title="Bid Accepted!",
#             message=f"Your bid for the project '{instance.project.title}' has been accepted by the client.",
#             sender=instance.project.client,
#             created_at=now()
#         ).recipients.add(instance.service_provider.profile)
#     elif instance.status == 'rejected':
#         # Notify the rejected service provider
#         Notification.objects.create(
#             notification_type='bid_rejected',
#             title="Bid Rejected",
#             message=f"Your bid for the project '{instance.project.title}' has been rejected by the client.",
#             sender=instance.project.client,
#             created_at=now()
#         ).recipients.add(instance.service_provider.profile)

import firebase_admin

@receiver(post_save, sender=Notification) 
def send_notification_to_firebase_handler(sender, instance, created, **kwargs):
        if created:
            sender=instance.sender.user.user_type



            
            firebase_admin.firestore.client().collection("messages").add({"message":instance.message,"title" : instance.title,"receiver" : instance.receiver.user.full_name,"sender":instance.sender.user.full_name})





from django.db.models.signals import post_save,post_delete
from django.dispatch import receiver
from project_management.models import Bid,Project,Feedback
from chat_management.models import Notification
from api.profile.serializers  import ProfileSerializer
from profile_management.models import Profile
import firebase_admin
# from chat_management.signals import *

@receiver(post_save,sender=Bid)
def bid_post_save_handler(sender,instance,created,**kwargs):
    if created:
        sender=instance.service_provider
        receiver= instance.project.client
        message = "Bid Has Been Created"
        notification = Notification.objects.create(
            sender=sender,
            receiver=receiver,
            message=message,
            object_type = "bid created",
            bid_id = instance.id,
            project_id = instance.project.id
        )
        sender=ProfileSerializer(sender)
        receiver=ProfileSerializer(receiver)

        data = {
            "sender" : sender.data,
            "receiver" : receiver.data,
            "message" : message,
            "object_type" : "bid",
            "object_type" : "bid created",
            "bid_id" : instance.id,
            "project_id" : instance.project.id
        }
        firebase_admin.firestore.client().collection("messages").add({"mssage":data['message']})




@receiver(post_save, sender=Feedback)
def create_feedback_notification(sender, instance, created, **kwargs):
    """
    Signal to create a notification when feedback is created or updated.
    """
    if created:
        if instance.client_review and instance.client_rating:
            Notification.objects.create(
                title="New Feedback Received",
                message=f"You have received feedback for the project: {instance.project.project_title}.",
                sender=instance.project.client, 
                receiver=instance.service_provider,
                object_type = "project feedback",
                project_id = instance.project.id,
                bid_id = ""
            )

        # Create a notification for the client when a service provider provides feedback
        if instance.provider_review and instance.provider_rating:
            Notification.objects.create(
                title="Feedback from Service Provider",
                message=f"You have received feedback from the service provider for your project: {instance.project.project_title}.",
                sender=instance.service_provider, 
                receiver=instance.project.client,
                object_type = "provider feedback",
                project_id = instance.project.id,
                bid_id = ""
            )            