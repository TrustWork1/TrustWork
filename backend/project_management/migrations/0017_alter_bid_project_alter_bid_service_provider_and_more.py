# Generated by Django 4.2.18 on 2025-02-04 14:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('profile_management', '0010_alter_profile_phone'),
        ('master', '0006_alter_jobcategory_image'),
        ('project_management', '0016_alter_project_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bid',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='bid', to='project_management.project'),
        ),
        migrations.AlterField(
            model_name='bid',
            name='service_provider',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='profile_bid', to='profile_management.profile'),
        ),
        migrations.AlterField(
            model_name='feedback',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='project_management.project'),
        ),
        migrations.AlterField(
            model_name='feedback',
            name='service_provider',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='profile_feedback', to='profile_management.profile'),
        ),
        migrations.AlterField(
            model_name='project',
            name='client',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='client', to='profile_management.profile'),
        ),
        migrations.AlterField(
            model_name='project',
            name='project_category',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='master.jobcategory'),
        ),
        migrations.AlterField(
            model_name='project',
            name='project_location',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='master.location'),
        ),
        migrations.AlterField(
            model_name='transactions',
            name='bid',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='project_management.bid'),
        ),
        migrations.AlterField(
            model_name='transactions',
            name='project',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='project_management.project'),
        ),
    ]
