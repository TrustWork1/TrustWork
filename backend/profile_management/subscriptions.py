from django.utils import timezone

from profile_management.models import Subscriptions


def refresh_profile_subscription_status(profile):
    if not profile or not getattr(profile, "pk", None):
        return False

    now = timezone.now()
    active_subscriptions = Subscriptions.objects.filter(profile=profile, is_active=True)
    active_subscriptions.filter(expire_at__isnull=True).update(is_active=False)
    active_subscriptions.filter(expire_at__lte=now).update(is_active=False)

    is_verified = Subscriptions.objects.filter(
        profile=profile,
        is_active=True,
        expire_at__gt=now,
    ).exists()

    if profile.is_payment_verified != is_verified:
        profile.is_payment_verified = is_verified
        profile.save(update_fields=["is_payment_verified", "updated_at"])

    return is_verified
