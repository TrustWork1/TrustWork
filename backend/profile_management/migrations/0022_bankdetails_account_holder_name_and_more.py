# Generated by Django 4.2.21 on 2025-05-21 11:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profile_management', '0021_mtnaccount'),
    ]

    operations = [
        migrations.AddField(
            model_name='bankdetails',
            name='account_holder_name',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='bankdetails',
            name='payment_type',
            field=models.CharField(blank=True, max_length=25, null=True),
        ),
        migrations.AlterField(
            model_name='bankdetails',
            name='bank_name',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.DeleteModel(
            name='MTNAccount',
        ),
    ]
