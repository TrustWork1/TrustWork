from django.db import models

# AboutUs section
class AboutUs(models.Model):
    section_header = models.CharField(max_length=255, blank=True, null=True)
    section_description = models.TextField(blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image1 = models.ImageField(upload_to='aboutus_page/', blank=True, null=True)
    image2 = models.ImageField(upload_to='aboutus_page/', blank=True, null=True)

    def __str__(self):
        return self.title or "AboutUs Untitled"

# Why You Trust Us section
class WhyYouTrustUsSection(models.Model):
    section_header = models.CharField(max_length=255, blank=True, null=True)
    section_description = models.TextField(blank=True, null=True)
    section_image = models.ImageField(upload_to='aboutus_page/', blank=True, null=True)
    image = models.ImageField(upload_to='aboutus_page/', blank=True, null=True)
    mission_title = models.CharField(max_length=255, blank=True, null=True)
    mission_description = models.TextField(blank=True, null=True)
    vision_title = models.CharField(max_length=255, blank=True, null=True)
    vision_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.section_header or "WhyYouTrustUsSection Untitled"

# Why You Trust Us Features
class WhyYouTrustUsFeature(models.Model):
    why_you_trust_us_section = models.ForeignKey(WhyYouTrustUsSection, on_delete=models.CASCADE, related_name='why_you_trust_us_feature')
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    icon = models.ImageField(upload_to='aboutus_page/', blank=True, null=True)

    def __str__(self):
        return self.title or "WhyYouTrustUsFeature Untitled"
    
    class Meta:
        ordering = ['id'] 
