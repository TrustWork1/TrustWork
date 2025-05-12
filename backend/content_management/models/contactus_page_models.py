from django.db import models

# ContactUs section
class ContactUs(models.Model):
    section_header = models.CharField(max_length=255, blank=True, null=True)
    section_description = models.TextField(blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    call_center_number = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    location = models.CharField(max_length=500, blank=True, null=True)
    facebook_url = models.TextField(blank=True, null=True)
    x_url = models.TextField(blank=True, null=True)
    linkedin_url = models.TextField(blank=True, null=True)
    youtube_url = models.TextField(blank=True, null=True)
    longitude = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.CharField(max_length=255, blank=True, null=True)
    map_url = models.TextField(blank=True, null=True)
    get_in_touch_title = models.CharField(max_length=255, blank=True, null=True)
    get_in_touch_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title or "Untitled ContactUs Section"

# Contact Form 
class ContactForm(models.Model):
    full_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    subject = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.full_name or 'Anonymous'} - {self.subject or 'No Subject'}"
    
    class Meta:
        ordering = ['id'] 
