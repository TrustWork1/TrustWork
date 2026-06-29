import math
from datetime import timedelta

from django.conf import settings
from django.utils import timezone

DEFAULT_OTP_VALIDITY_MINUTES = 10


def get_otp_validity_minutes():
    """Return the configured OTP validity period in minutes."""
    try:
        minutes = int(getattr(settings, "OTP_VALIDITY_MINUTES", DEFAULT_OTP_VALIDITY_MINUTES))
    except (TypeError, ValueError):
        minutes = DEFAULT_OTP_VALIDITY_MINUTES
    return max(1, minutes)


def stamp_user_otp(user, otp):
    """Attach a new OTP and timestamp to a user instance without saving it."""
    user.otp = otp
    user.otp_created_at = timezone.now()


def save_user_otp(user):
    """Persist OTP fields while staying compatible with test doubles."""
    try:
        user.save(update_fields=["otp", "otp_created_at"])
    except TypeError:
        user.save()


def clear_user_otp(user):
    """Clear a verified OTP from the user instance."""
    user.otp = None
    user.otp_created_at = None


def otp_expires_at(user):
    created_at = getattr(user, "otp_created_at", None)
    otp = getattr(user, "otp", None)
    if not otp or not created_at:
        return None
    return created_at + timedelta(minutes=get_otp_validity_minutes())


def otp_remaining_seconds(user):
    expires_at = otp_expires_at(user)
    if not expires_at:
        return 0
    return max(0, int(math.ceil((expires_at - timezone.now()).total_seconds())))


def otp_remaining_minutes(seconds):
    if seconds <= 0:
        return 0
    return max(1, int(math.ceil(seconds / 60)))


def is_user_otp_expired(user):
    expires_at = otp_expires_at(user)
    return bool(expires_at and expires_at <= timezone.now())


def still_valid_otp_message(channel, seconds):
    destination = "email" if channel == "email" else "phone"
    minutes = otp_remaining_minutes(seconds)
    unit = "minute" if minutes == 1 else "minutes"
    return f"Please check your {destination}. The OTP is valid for the next {minutes} {unit}."
