from rest_framework.authentication import TokenAuthentication

from profile_management.subscriptions import refresh_profile_subscription_status


class SubscriptionAwareTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        user, token = super().authenticate_credentials(key)
        try:
            profile = user.profile
        except Exception:
            profile = None
        if profile:
            refresh_profile_subscription_status(profile)
        return user, token
