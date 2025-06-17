from django.db import models
from profile_management.models import AbstractModel,Profile
# Create your models here.

class CMS(AbstractModel):
    title=models.TextField()
    content=models.TextField()
    # status=models.CharField(max_length=100,choices=[("Active","Active"),("Inactive","Inactive"), ("Pending","Pending"),("Reject","Reject")])
    
    
class FAQ(AbstractModel):
    question=models.TextField()
    answer=models.TextField()
    # status=models.CharField(max_length=100,choices=[("Active","Active"),("Inactive","Inactive"), ("Pending","Pending"),("Reject","Reject")])


class QMS(AbstractModel):
    user = models.ForeignKey(Profile,on_delete=models.CASCADE,null=True)
    query = models.TextField()
    answer = models.TextField()
    query_at = models.DateTimeField(auto_now_add=True)
    answer_at = models.DateTimeField(null=True)
    # query_from = models.TextField(null=True)

class QMSResponse(AbstractModel):
    qms=models.ForeignKey(QMS,on_delete=models.CASCADE)
    response=models.TextField(null=True)
    