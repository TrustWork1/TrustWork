# Generated by Django 4.2.17 on 2024-12-18 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project_management', '0009_bid_bid_sent'),
    ]

    operations = [
        migrations.AddField(
            model_name='bid',
            name='is_accepted',
            field=models.BooleanField(default=False),
        ),
    ]
