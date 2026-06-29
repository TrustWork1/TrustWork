from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("customuser", "0011_alter_customuser_email"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="otp_created_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
