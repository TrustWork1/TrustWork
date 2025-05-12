from django.db import models
from profile_management.models import AbstractModel
# Create your models here.

class Location(models.Model):
    country=models.TextField(null=True, blank=True)
    code=models.TextField(null=True, blank=True)
    latitude = models.CharField(max_length=100, null=True, blank=True, help_text="Latitude")
    longitude = models.CharField(max_length=100, null=True, blank=True, help_text="Longitude")
    # radius = models.CharField(max_length= 20, null=True, blank=True, help_text="Redius")

    # class Meta:
    #     unique_together = ('latitude', 'longitude')

    def __str__(self):
        return f"{self.latitude}, {self.longitude}" # , {self.radius}
    

class JobCategory(AbstractModel):
    title=models.CharField(max_length=100)
    description=models.TextField()
    image=models.FileField(upload_to="profiles/", null=True, blank=True)
    
    def __str__(self):
        return self.title
