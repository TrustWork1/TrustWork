# Generated by Django 4.2.20 on 2025-04-17 15:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('content_management', '0007_alter_contactform_options_alter_feature_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pricefeatures',
            name='is_active',
        ),
    ]
