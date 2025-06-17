from django.db import models

# Terms & Conditions section
class TermsConditionsSection(models.Model):
    section_header = models.CharField(max_length=255, blank=True, null=True)
    section_description = models.TextField(blank=True, null=True)
    details = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.section_header or "Terms_Conditions Untitled"
