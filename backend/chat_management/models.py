from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from master.models import JobCategory
from django.utils.timezone import now
from profile_management.models import Profile
# from project_management.models import Project
from customuser.models import CustomUser
from profile_management.models import AbstractModel
from firebase_admin import messaging

class ChatRoom(AbstractModel):
    user1=models.ForeignKey(Profile,related_name="user1",on_delete=models.SET_NULL,null=True)
    user2=models.ForeignKey(Profile,related_name="user2",on_delete=models.SET_NULL,null=True)
    
class Messages(AbstractModel):
    chat_room=models.ForeignKey(ChatRoom,on_delete=models.CASCADE)
    message=models.TextField(null=True)
    sender=models.ForeignKey(Profile,related_name="sender",on_delete=models.SET_NULL,null=True)

class Attatchment(AbstractModel):
    message=models.ForeignKey(Messages,on_delete=models.CASCADE)
    file=models.FileField(upload_to='chatroom/')
    # sender=models.ForeignKey(Profile,related_name="messages",on_delete=models.SET_NULL,null=True)

class Notification(models.Model):
 
    NOTIFICATION_TYPES = [
        ('project_created', 'Project Created'),
        ('bid_floated', 'Bid Floated'),
        ('bid_accepted', 'Bid Accepted'),
        ('bid_rejected', 'Bid Rejected'),
        ('general', 'General Notification'),]
    
    # notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES,default='general')
    title = models.CharField(max_length=255)
    message = models.TextField()
    sender = models.ForeignKey(Profile,on_delete=models.CASCADE,null=True,blank=True,related_name='sent_notifications')
    receiver = models.ForeignKey(Profile,on_delete=models.CASCADE,null=True,blank=True,related_name='received_notifications')
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    has_read = models.BooleanField(default=False)
    status = models.BooleanField(default=True)
    object_type = models.CharField(max_length=255, null=True, blank=True)
    object_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} {self.object_id}"
    
# m=firebase_admin.messaging.Message(notification=firebase_admin.messaging.Notification(title="Hello",body="Ok"),token=r"dB0s4RnqQHGoTMr0nZgBtb:APA91bFKg586PIR0y0F37USJ2_MRVSqv57aODvXbTEcseW-oTckqhIGWM8rc7iFoa5vPR__kCHybEdohtesOxH8rO25q31UNO3RKt-rAkF9bInZfCkRigw0")

    def send_to_token(self,extra_data={}):
        if self.receiver.user.fcmtoken:
            message = messaging.Message(notification=messaging.Notification(title="TrustWork",body=self.message),
                token=self.receiver.user.fcmtoken,data=extra_data
            )
            response = messaging.send(message)

