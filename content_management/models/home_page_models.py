from django.db import models

# App Link
class AppDownload(models.Model):
    playstore_link = models.URLField(blank=True, null=True)
    appstore_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.playstore_link} - {self.appstore_link}"

# Banner section
class AppInfo(models.Model):
    tagline = models.CharField(max_length=255, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    app_download = models.ForeignKey(AppDownload, on_delete=models.CASCADE, related_name='app_links')
    image = models.ImageField(upload_to='home_page/', blank=True, null=True)

    def __str__(self):
        return self.title or "AppInfo Untitled"

# Our Features section
class FeatureSection(models.Model):
    header = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.header} - {self.description}"

class Feature(models.Model):
    feature_section = models.ForeignKey(FeatureSection, on_delete=models.CASCADE, related_name='features')
    title = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    icon = models.ImageField(upload_to='home_page/features/', blank=True, null=True)

    def __str__(self):
        return self.title or "Feature Untitled"
    
    class Meta:
        ordering = ['id'] 

# How It Works section
class HowItWorksSection(models.Model):
    header = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='home_page/how_it_works/', blank=True, null=True)

    def __str__(self):
        return f"{self.header} - {self.description} - {self.image}"

class HowItWorksStep(models.Model):
    howitworks_section = models.ForeignKey(HowItWorksSection, on_delete=models.CASCADE, related_name='steps')
    title = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    icon = models.ImageField(upload_to='home_page/how_it_works/', blank=True, null=True)

    def __str__(self):
        return self.title or "HowItWorksStep Untitled"
    
    class Meta:
        ordering = ['id'] 

# Best Packages For You section
class PricingPlanSection(models.Model):
    header = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.header} - {self.description}"

class PricingPlan(models.Model):
    BILLING_CHOICES = (
        ('Week', 'Week'),
        ('Month', 'Month'),
        ('Year', 'Year'),
    )
    pricingplan_section = models.ForeignKey(PricingPlanSection, on_delete=models.CASCADE, related_name='pricing_plans')
    plan_name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CHOICES, blank=True, null=True)

    def __str__(self):
        return self.plan_name
    
    class Meta:
        ordering = ['id'] 

class PriceFeatures(models.Model):
    features = models.TextField(blank=True, null=True)
    pricing_plan = models.ForeignKey(PricingPlan, on_delete=models.CASCADE, related_name='price_features')

    def __str__(self):
        return self.features or "No PriceFeatures"
    
    class Meta:
        ordering = ['id'] 

# Referral section
class ReferralSection(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    button_title = models.CharField(max_length=255, default='GET STARTED', blank=True, null=True)
    button_link = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='home_page/', blank=True, null=True)

    def __str__(self):
        return self.title or "ReferralSection Untitled"

# Download section
class DownloadSection(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    app_download = models.ForeignKey(AppDownload, on_delete=models.CASCADE, related_name='app_download_links')
    image = models.ImageField(upload_to='home_page/', blank=True, null=True)

    def __str__(self):
        return self.title or "DownloadSection Untitled"
