# Generated by Django 4.2.18 on 2025-01-29 11:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customuser', '0003_customuser_referred_by_code_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='total_referal_amount',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='total_referal_count',
            field=models.TextField(null=True),
        ),
    ]
