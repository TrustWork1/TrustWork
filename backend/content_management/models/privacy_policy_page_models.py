from django.db import models

# Privacy Policy section
class PrivacyPolicySection(models.Model):
    section_header = models.CharField(max_length=255, blank=True, null=True)
    section_description = models.TextField(blank=True, null=True)
    details = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return self.section_header or "PrivacyPolicySection Untitled"
