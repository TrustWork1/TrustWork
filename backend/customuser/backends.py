from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend

from profile_management.models import Profile


class EmailBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        UserModel = get_user_model()
        email = str(email or kwargs.get("username") or "").strip()
        if not email or not password:
            return None

        users = UserModel.objects.filter(email__iexact=email).order_by("-id")
        for user in users:
            if user.check_password(password):
                return user
        return None

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None

class PhoneBackend(BaseBackend):
    def authenticate(self, request, phone=None, password=None, **kwargs):
        phone = str(phone or "").strip()
        if not phone or not password:
            return None

        profiles = (
            Profile.objects.select_related("user")
            .filter(phone=phone)
            .order_by("-updated_at", "-id")
        )
        for profile in profiles:
            user = profile.user
            if user and user.check_password(password):
                return user
        return None

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None
