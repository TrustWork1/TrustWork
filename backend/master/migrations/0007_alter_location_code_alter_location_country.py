# Generated by Django 4.2.20 on 2025-04-08 13:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('master', '0006_alter_jobcategory_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='location',
            name='code',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='location',
            name='country',
            field=models.TextField(blank=True, null=True),
        ),
    ]
