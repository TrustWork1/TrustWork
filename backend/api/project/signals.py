from django.db.models.signals import post_save,post_delete
from django.dispatch import receiver
from project_management.models import Bid,Project,Feedback
from chat_management.models import Notification
from api.profile.serializers  import ProfileSerializer
from profile_management.models import Profile
import firebase_admin








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
            )

        # Create a notification for the client when a service provider provides feedback
        if instance.provider_review and instance.provider_rating:
            Notification.objects.create(
                title="Feedback from Service Provider",
                message=f"You have received feedback from the service provider for your project: {instance.project.project_title}.",
                sender=instance.service_provider, 
                receiver=instance.project.client,  
            )







@receiver(post_delete, sender=Project)
def notification_on_project_deletion(sender, instance, **kwargs):  
    """
    Signal to notify all service providers when a project is deleted.
    """
    if instance.bids.exists():
        raise ValueError(f"Cannot delete project '{instance.project_title}' as it has associated bids.")

    # Fetch all service providers (modify this query if you need specific service providers)
    bids = instance.bid.all()
    service_providers = Profile.objects.filter(is_service_provider=True)  # Assuming `is_service_provider` is a field to identify service providers

    # Create a notification for each service provider
    for service_provider in service_providers:
        notification=Notification.objects.create(
            title="Project Deleted",
            message=f"The project '{instance.project_title}' has been deleted.",
            sender=None,  # Optionally, specify a sender (e.g., admin profile)
            receiver=service_provider,
        )
        notification.send_to_token()



@receiver(post_save,sender=Bid)
def bid_post_save_handler(sender,instance,created,**kwargs):
    if created:
        sender=instance.service_provider
        receiver= instance.project.client
        message = "Bid Has Been Created"
        notification = Notification.objects.create(sender=sender,receiver=receiver,message=message)
        sender=ProfileSerializer(sender)
        receiver=ProfileSerializer(receiver)

        data = {
            "sender" : sender.data,
            "receiver" : receiver.data,
            "message" : message
        }
        firebase_admin.firestore.client().collection("messages").add({"mssage":data['message']})
