# Generated by Django 4.2.17 on 2025-01-02 13:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('project_management', '0013_alter_project_city_alter_project_street'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transactions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('escrow_id', models.UUIDField(blank=True, null=True)),
                ('status', models.CharField(max_length=100)),
                ('bid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='project_management.bid')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
