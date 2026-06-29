from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("customuser", "0012_customuser_otp_created_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="subscription_password_generated_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
