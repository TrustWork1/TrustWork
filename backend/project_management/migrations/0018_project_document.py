# Generated by Django 4.2.19 on 2025-02-06 06:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project_management', '0017_alter_bid_project_alter_bid_service_provider_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='document',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
    ]
