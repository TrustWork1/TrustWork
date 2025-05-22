from django.db import models
from django.contrib.auth import get_user_model
from profile_management.models import Profile,AbstractModel
# Create your models here.



user = get_user_model()

class Project(AbstractModel):
    client = models.ForeignKey(Profile,on_delete=models.PROTECT,related_name='client')
    project_title = models.CharField(max_length=255)
    project_category = models.ForeignKey("master.JobCategory",on_delete=models.PROTECT,null=True)
    project_description = models.TextField()
    project_address = models.TextField()
    project_budget = models.FloatField()
    project_timeline = models.CharField(max_length=255)
    project_hrs_week=models.CharField(max_length=255,null=True)
    project_location=models.ForeignKey("master.Location",on_delete=models.PROTECT, null=True)
    document=models.FileField(null=True,blank=True)
    street = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=255, null=True)
    state_code = models.CharField(max_length=255, null=True)
    country = models.CharField(max_length=255, null=True)
    zip_code = models.CharField(max_length=255, null=True,blank=True)
    status=models.CharField(max_length=50,choices=[("active","active"),("ongoing","ongoing"),("completed","completed"),("inactive","inactive"),("block","block"), ("myoffer", "myoffer"),('Rejected',"Rejected")],default="active")
    bid_count= models.IntegerField(default=0)
    can_send_bid= models.BooleanField(default=False)
    def __str__(self):
        return f'{self.project_title}'


class Bid(AbstractModel):
    project=models.ForeignKey("Project",on_delete=models.PROTECT, related_name="bid")
    service_provider=models.ForeignKey(Profile,on_delete=models.PROTECT,related_name="profile_bid")
    bid_details=models.TextField()
    quotation_details=models.TextField()
    project_total_cost=models.TextField()
    time_line=models.TextField()
    time_line_hour=models.TextField(null=True)
    bid_sent = models.BooleanField(default=True)
    is_accepted = models.BooleanField(default=False)
    def __str__(self):
        return f'{self.service_provider}'
    


class Feedback(AbstractModel):
    project=models.ForeignKey(Project,on_delete=models.PROTECT)
    service_provider=models.ForeignKey(Profile,on_delete=models.PROTECT,related_name='profile_feedback')
    client_review=models.TextField(null=True,blank=True)
    provider_review=models.TextField(null=True,blank=True)
    client_rating=models.IntegerField(null=True,blank=True)
    provider_rating=models.IntegerField(null=True,blank=True)
    
    def __str__(self):
        return f'{self.service_provider}'
    

class Transactions(AbstractModel):
    escrow_id=models.UUIDField(blank=True,null=True)
    bid=models.ForeignKey(Bid,on_delete=models.PROTECT,null=True)
    status=models.CharField(max_length=100)
    transaction_type=models.CharField(null=True,max_length=100,choices=[("collection","collection"),("disbursement","disbursement")],default="collection")
    project=models.ForeignKey(Project,on_delete=models.PROTECT,null=True)
from django.db.models.signals import post_save,post_delete
from django.dispatch import receiver
from project_management.models import Bid,Project,Feedback
from chat_management.models import Notification
from api.profile.serializers  import ProfileSerializer
from api.project.serializers  import ProjectSerializer,BidSerializer
from profile_management.models import Profile
import firebase_admin
import json

@receiver(post_save, sender=Project)
def project_post_save_handler(sender, instance:Project, created, **kwargs):
    try:
        if created:
            sender_profile = instance.client
            message = f"Project '{instance.project_title}' has been created by {sender_profile.user.full_name}."
            related_providers = Profile.objects.filter(job_category=instance.project_category).exclude(user=instance.client.user)
            # related_providers = Project.objects.filter(service_provider=Bid.objects.filter(service_provider__id= instance.client.user.id).values_list('service_provider__id', flat=True))
            # if instance.status=="myoffer":
            #     related_providers=instance.bid.service_provider
            # related_providers = related_providers
            for provider in related_providers:
                try:
                    notification=Notification.objects.create(
                        sender=sender_profile,
                        receiver=provider,
                        title="New Project Created",
                        message=message,
                        object_type = "project",
                        object_id = instance.id
                    )
                    notification.send_to_token(extra_data={"project":json.dumps(ProjectSerializer(instance).data),"notification_type":"project_creation"})
                except :
                    pass
            sender_data = ProfileSerializer(sender_profile).data
            sender_full_name = sender_data.get('full_name')
    except:
        pass
        
        
@receiver(post_save, sender=Bid)
def bid_status_change_handler(sender, instance:Bid, created, **kwargs):
    try:
        if  not created:
            if instance.status=="Accepted":
                message=f"Bid for project -: {instance.project.project_title} has been Accepted"
                notification=Notification.objects.create(
                    sender=instance.project.client,
                    receiver=instance.service_provider,
                    title="Status of Bid has changed",
                    message=message,
                    object_type = "bid",
                    object_id = instance.id
                )
                project=ProjectSerializer(instance.project).data
                project.pop("client")
                notification.send_to_token(extra_data={"project":json.dumps(project),"notification_type":"bid_status_change",'bid_status':"accepted"})

            elif instance.status=="Rejected":
                message=f"Bid for project -: {instance.project.project_title} has been Rejected"
                notification=Notification.objects.create(
                    sender=instance.project.client,
                    receiver=instance.service_provider,
                    title="Status of Bid has changed",
                    message=message,
                    object_type = "bid",
                    object_id = instance.id
                )
                project=ProjectSerializer(instance.project).data
                project.pop("client")

                notification.send_to_token(extra_data={"project":json.dumps(project),"notification_type":"bid_status_change",'bid_status':"rejected"})

            else:
                message=f"A bid has been created for your project -: {instance.project.project_title}"
                notification=Notification.objects.create(
                    receiver=instance.project.client,
                    sender=instance.service_provider,
                    title="Bid has been created",
                    message=f"A bid has been created for your project -: {instance.project.project_title}",
                    object_type = "bid",
                    object_id = instance.id
                )
                project=ProjectSerializer(instance.project).data
                project.pop("client")
                notification.send_to_token(extra_data={"project":json.dumps(project),"notification_type":"bid_status_change",'bid_status':"active"})
    except:
        pass
        
