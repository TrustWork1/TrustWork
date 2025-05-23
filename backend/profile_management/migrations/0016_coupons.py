# Generated by Django 4.2.21 on 2025-05-08 12:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('profile_management', '0015_subscriptions_purchase_token'),
    ]

    operations = [
        migrations.CreateModel(
            name='Coupons',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(choices=[('active', 'active'), ('inactive', 'inactive'), ('block', 'block')], default='active', max_length=50)),
                ('coupon_code', models.CharField(blank=True, max_length=20, null=True, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('expire_date', models.DateField(blank=True, null=True)),
                ('from_user', models.CharField(blank=True, max_length=20, null=True, unique=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_coupon', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
