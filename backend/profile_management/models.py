from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
# from master.models import JobCategory
from django.utils.timezone import now
import string,random
from django.core.exceptions import ValidationError
# from project_management.models import Project
# Create your models here.

class AbstractModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status=models.CharField(max_length=50,choices=[("active","active"),("inactive","inactive"),("block","block")],default="active")
    class Meta:
       abstract = True


class BankDetails(AbstractModel):
    user_profile=models.ForeignKey("Profile",on_delete=models.CASCADE)

    bank_name=models.CharField(max_length=200)
    bank_account_number=models.CharField(max_length=40)
    ifsc_code=models.CharField(max_length=40, null=True)
    is_primary=models.BooleanField(default=False)
    stripe_account_id = models.CharField(max_length=255, null=True, blank=True)
    stripe_bank_account_id = models.CharField(max_length=255, null=True, blank=True)
    stripe_external_account_id = models.CharField(max_length=255, null=True, blank=True)
    routing_number = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.bank_name} -- {self.bank_account_number}"

class UserDocuments(AbstractModel):
    user_profile=models.ForeignKey("Profile",on_delete=models.CASCADE)
    document_type=models.CharField(max_length=255)
    document=models.FileField(upload_to="documents/")
    def __str__(self):
        return f"{self.document_type}"
User = get_user_model()

class MembershipPlans(AbstractModel):
    plan_name=models.CharField(max_length=250)
    plan_duration=models.CharField(max_length=50)
    plan_benefits=models.TextField()
    plan_duration=models.CharField(max_length=250)
    plan_details=models.TextField()
    plan_price=models.CharField(max_length=100)
    # user_type=models.CharField(max_length=250)
    
class PreviousWorks(AbstractModel):
    image=models.FileField(null=True)
    description=models.CharField(null=True)
    profile=models.ForeignKey("Profile", related_name="previous_works",on_delete=models.CASCADE,blank=True)

class ProfileMembership(AbstractModel):
    profile = models.ForeignKey("Profile", on_delete=models.CASCADE)
    membership_plan = models.ForeignKey(MembershipPlans, on_delete=models.CASCADE)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f'{self.profile.user.email} - {self.membership_plan.plan_name}'

    class Meta:
        unique_together = ('profile', 'membership_plan', 'start_date')

class ProfileJobCategories(models.Model):
    profile=models.ForeignKey('Profile',on_delete=models.CASCADE)
    job_category=models.ForeignKey('master.JobCategory',on_delete=models.CASCADE)

class Subscriptions(AbstractModel):
    profile=models.ForeignKey("Profile",on_delete=models.CASCADE,related_name="profile_subscription")
    subscription_frequency=models.CharField(max_length=100,choices=[("weekly","weekly"),("monthly",'monthly'),("yearly","yearly")])
    subscription_plan=models.CharField(max_length=100)
    is_active=models.BooleanField(default=True)
    purchase_token=models.TextField(blank=True, null=True)

class Profile(AbstractModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    membership_plan = models.ManyToManyField(MembershipPlans, through='ProfileMembership', related_name='profiles')
    phone = models.CharField(max_length=15, blank=True, null=True)
    phone_extension=models.CharField(max_length=10,blank=True,null=True)
    address = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    cover_image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    associated_organization=models.CharField(max_length=500,null=True,blank=True)
    organization_registration_id=models.CharField(max_length=500,null=True,blank=True)
    service_details = models.TextField(blank=True, null=True) 
    client_notes = models.TextField(blank=True, null=True)
    year_of_experiance = models.TextField(blank=True, null=True)
    profile_bio=models.TextField(null=True,blank=True)
    profession=models.TextField(null=True)
    street=models.CharField(max_length=255,null=True,blank=True)
    city=models.CharField(max_length=255,null=True,blank=True)
    state=models.CharField(max_length=255,null=True,blank=True)
    zip_code=models.CharField(max_length=255,null=True, blank=True)
    location=models.ForeignKey("master.Location",on_delete=models.SET_NULL,null=True,related_name='location')
    country=models.ForeignKey("master.Location",on_delete=models.SET_NULL,null=True)
    notification_status=models.BooleanField(default=False)
    job_category=models.ManyToManyField('master.JobCategory',through=ProfileJobCategories)
    project=models.ForeignKey("project_management.Project",on_delete=models.SET_NULL,null=True)
    is_accepted_terms_conditions=models.BooleanField(default=False)
    is_payment_verified=models.BooleanField(default=False)
    is_profile_updated=models.BooleanField(default=False)
    profile_rating=models.IntegerField(null=True,default=0)
    notification_enabled = models.BooleanField(default=True)
    
    def __str__(self):
        return f'{self.user.email} - {self.get_user_type_display()}'
    def get_user_type_display(self):
        return f"{self.user.user_type}"
    # def __str__(self):
    #     return f"notification_status: {self.notifications_enabled}"
    
# # class Chat(models.Model):
# class Chat(models.Model):
#     sender = models.ForeignKey(Profile, related_name="sent_messages", on_delete=models.CASCADE)
#     receiver = models.ForeignKey(Profile, related_name="received_messages", on_delete=models.CASCADE)
#     message = models.TextField()
#     timestamp = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Message from {self.sender.user.full_name} to {self.receiver.user.full_name} at {self.timestamp}"
# class FirebaseToken(models.Model):
#     user = models.OneToOneField(Profile, on_delete=models.CASCADE)
#     token = models.TextField()

#     def __str__(self):
#         return f"{self.user.username}'s Firebase Token"

# class Conversation(models.Model):
#     participants = models.ManyToManyField("Profile", related_name="conversations")
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Conversation between {', '.join([str(p) for p in self.participants.all()])}"


# class Message(models.Model):
#     conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
#     sender = models.ForeignKey("Profile", on_delete=models.CASCADE, related_name="sent_messages")
#     content = models.TextField(blank=True, null=True)
#     sent_at = models.DateTimeField(default=now)
#     is_read = models.BooleanField(default=False)

#     def __str__(self):
#         return f"Message from {self.sender} at {self.sent_at}"
#############

class Coupons(AbstractModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_coupon")
    coupon_code = models.CharField(max_length=20, null=True, blank=True, unique=True)
    is_active = models.BooleanField(default=True)
    # expire_date = models.DateField(null=True, blank=True)
    from_user = models.CharField(max_length=20, null=True, blank=True, unique=True)

    def save(self,*args, **kwargs):
        if not self.coupon_code:
            self.coupon_code=self.generate_unique_code()
        return super().save(*args, **kwargs)
    
    @staticmethod
    def generate_unique_code():
        code_length = 8
        characters = string.ascii_uppercase + string.digits
        while True:
            code = ''.join(random.choice(characters) for _ in range(code_length))
            try:
                Coupons.objects.get(coupon_code=code)
            except:
                return code
    def __str__(self):
        return self.coupon_code