# Generated by Django 4.2.16 on 2024-11-19 10:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('master', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='MembershipPlans',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[('active', 'active'), ('inactive', 'inactive'), ('block', 'block')], default='active', max_length=50)),
                ('plan_name', models.CharField(max_length=250)),
                ('plan_benefits', models.TextField()),
                ('plan_duration', models.CharField(max_length=250)),
                ('plan_details', models.TextField()),
                ('plan_price', models.CharField(max_length=100)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[('active', 'active'), ('inactive', 'inactive'), ('block', 'block')], default='active', max_length=50)),
                ('phone', models.CharField(blank=True, max_length=15, null=True, unique=True)),
                ('address', models.TextField(blank=True, null=True)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='profiles/')),
                ('cover_image', models.ImageField(blank=True, null=True, upload_to='profiles/')),
                ('associated_organization', models.CharField(blank=True, max_length=500, null=True)),
                ('organization_registration_id', models.CharField(blank=True, max_length=500, null=True)),
                ('service_details', models.TextField(blank=True, null=True)),
                ('client_notes', models.TextField(blank=True, null=True)),
                ('profile_bio', models.TextField(blank=True, null=True)),
                ('profession', models.TextField(null=True)),
                ('street', models.CharField(blank=True, max_length=255, null=True)),
                ('city', models.CharField(blank=True, max_length=255, null=True)),
                ('state', models.CharField(blank=True, max_length=255, null=True)),
                ('zip_code', models.CharField(max_length=255, null=True)),
                ('notification_status', models.BooleanField(default=False)),
                ('is_accepted_terms_conditions', models.BooleanField(default=False)),
                ('is_payment_verified', models.BooleanField(default=False)),
                ('is_profile_updated', models.BooleanField(default=False)),
                ('profile_rating', models.IntegerField(default=0, null=True)),
                ('country', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='master.location')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='UserDocuments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[('active', 'active'), ('inactive', 'inactive'), ('block', 'block')], default='active', max_length=50)),
                ('document_type', models.CharField(max_length=255)),
                ('document', models.FileField(upload_to='documents/')),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='profile_management.profile')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ProfileMembership',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[('active', 'active'), ('inactive', 'inactive'), ('block', 'block')], default='active', max_length=50)),
                ('start_date', models.DateField(default=django.utils.timezone.now)),
                ('end_date', models.DateField(blank=True, null=True)),
                ('membership_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='profile_management.membershipplans')),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='profile_management.profile')),
            ],
            options={
                'unique_together': {('profile', 'membership_plan', 'start_date')},
            },
        ),
        migrations.CreateModel(
            name='ProfileJobCategories',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job_category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='master.jobcategory')),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='profile_management.profile')),
            ],
        ),
        migrations.AddField(
            model_name='profile',
            name='job_category',
            field=models.ManyToManyField(through='profile_management.ProfileJobCategories', to='master.jobcategory'),
        ),
        migrations.AddField(
            model_name='profile',
            name='membership_plan',
            field=models.ManyToManyField(related_name='profiles', through='profile_management.ProfileMembership', to='profile_management.membershipplans'),
        ),
        migrations.AddField(
            model_name='profile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_messages', to='profile_management.profile')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_messages', to='profile_management.profile')),
            ],
        ),
        migrations.CreateModel(
            name='BankDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[('active', 'active'), ('inactive', 'inactive'), ('block', 'block')], default='active', max_length=50)),
                ('bank_name', models.CharField(max_length=200)),
                ('bank_account_number', models.CharField(max_length=40)),
                ('ifsc_code', models.CharField(max_length=40)),
                ('is_primary', models.BooleanField(default=False)),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='profile_management.profile')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
