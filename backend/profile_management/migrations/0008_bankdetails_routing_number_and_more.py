# Generated by Django 4.2.18 on 2025-01-30 08:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profile_management', '0007_subscriptions_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='bankdetails',
            name='routing_number',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='bankdetails',
            name='stripe_account_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='bankdetails',
            name='stripe_bank_account_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='bankdetails',
            name='stripe_external_account_id',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
