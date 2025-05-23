# Generated by Django 4.2.19 on 2025-02-07 07:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('profile_management', '0011_previousworks'),
    ]

    operations = [
        migrations.AlterField(
            model_name='previousworks',
            name='description',
            field=models.CharField(null=True),
        ),
        migrations.AlterField(
            model_name='previousworks',
            name='profile',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='previous_works', to='profile_management.profile'),
        ),
    ]
