import json
from datetime import timedelta
from types import SimpleNamespace
from unittest.mock import Mock, patch

from django.contrib.auth import authenticate
from django.core import mail
from django.test import SimpleTestCase, TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIRequestFactory

from api.auth.views import (
    AuthVerifyOTPView,
    GenerateOTPView,
    ResendOtp,
    UserProfileCreateView,
)
from customuser.models import CustomUser
from profile_management.models import Profile
from utils import send_otp_sms


@override_settings(
    AUTHENTICATION_BACKENDS=[
        "customuser.backends.EmailBackend",
        "customuser.backends.PhoneBackend",
    ]
)
class LoginBackendTests(TestCase):
    def test_email_login_failure_does_not_crash_when_many_profiles_have_blank_phone(self):
        CustomUser.objects.create_user(
            email="email-login@example.com",
            password="CorrectPass123",
            user_type="client",
        )
        for index in range(3):
            user = CustomUser.objects.create_user(
                email=f"blank-phone-{index}@example.com",
                password="OtherPass123",
                user_type="client",
            )
            Profile.objects.create(user=user, phone=None)

        user = authenticate(
            email="email-login@example.com",
            password="WrongPass123",
        )

        self.assertIsNone(user)

    def test_phone_login_checks_duplicate_profiles_without_raising(self):
        first_user = CustomUser.objects.create_user(
            email="phone-one@example.com",
            password="WrongOwnerPass123",
            user_type="client",
        )
        matching_user = CustomUser.objects.create_user(
            email="phone-two@example.com",
            password="CorrectPhonePass123",
            user_type="client",
        )
        Profile.objects.create(user=first_user, phone="651890022")
        Profile.objects.create(user=matching_user, phone="651890022")

        user = authenticate(phone="651890022", password="CorrectPhonePass123")

        self.assertEqual(user, matching_user)


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    DEFAULT_FROM_EMAIL="noreply@example.com",
    EMAIL_HOST_USER="noreply@example.com",
)
class GenerateOTPViewTests(SimpleTestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = GenerateOTPView.as_view()
        self.user = SimpleNamespace(
            pk=1,
            email="reset@example.com",
            otp=None,
            password_reset_otp=None,
            save=Mock(),
        )
        self.profile = SimpleNamespace(
            user=self.user,
            status="active",
            phone_extension="+237",
            phone="651890022",
        )
        mail.outbox = []

    def test_email_reset_delivers_otp_to_test_inbox_without_requiring_sms(self):
        with patch("api.auth.views.CustomUser.objects.get", return_value=self.user), \
             patch("api.auth.views.Profile.objects.get", return_value=self.profile), \
             patch("api.auth.views.send_otp_sms", side_effect=Exception("SMS down")) as send_sms:
            response = self.view(self.factory.post(
                "/api/generate-otp/",
                {"email": self.user.email},
                format="json",
            ))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "OTP has been sent to your email"})
        send_sms.assert_not_called()
        self.assertEqual(len(self.user.otp), 4)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, [self.user.email])
        self.assertEqual(mail.outbox[0].subject, "Password Reset OTP")
        self.assertIn(self.user.otp, mail.outbox[0].body)

    def test_phone_reset_sends_generated_otp_to_sms_gateway_without_email(self):
        with patch("api.auth.views.Profile.objects.get", return_value=self.profile), \
             patch("api.auth.views.send_mail", return_value=1) as send_mail, \
             patch("api.auth.views.send_otp_sms") as send_sms:
            response = self.view(self.factory.post(
                "/api/generate-otp/",
                {"phone": self.profile.phone},
                format="json",
            ))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "OTP has been sent to your phone"})
        send_mail.assert_not_called()
        send_sms.assert_called_once()
        self.assertEqual(send_sms.call_args.args[0], "+237651890022")
        self.assertEqual(len(self.user.otp), 4)
        self.assertEqual(send_sms.call_args.args[1], self.user.otp)
        self.assertEqual(len(mail.outbox), 0)


class AuthVerifyOTPViewTests(SimpleTestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = AuthVerifyOTPView.as_view()
        self.user = SimpleNamespace(
            pk=1,
            email="reset@example.com",
            otp="1234",
            password_reset_otp=None,
            is_active=False,
            is_user_active=False,
            save=Mock(),
        )
        self.profile = SimpleNamespace(user=self.user)

    def test_verify_otp_requires_email_or_phone(self):
        response = self.view(self.factory.post(
            "/api/otp-verify/",
            {"otp": "1234"},
            format="json",
        ))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"error": "Email or phone is required"})

    def test_verify_otp_returns_400_for_unknown_phone(self):
        with patch("api.auth.views.Profile.objects.get", side_effect=Profile.DoesNotExist):
            response = self.view(self.factory.post(
                "/api/otp-verify/",
                {"phone": "000000000", "otp": "1234"},
                format="json",
            ))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"error": "User does not exist"})

    def test_verify_otp_by_phone_activates_user(self):
        with patch("api.auth.views.Profile.objects.get", return_value=self.profile):
            response = self.view(self.factory.post(
                "/api/otp-verify/",
                {"phone": "651890022", "otp": "1234"},
                format="json",
            ))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "OTP verified successfully"})
        self.assertTrue(self.user.is_active)
        self.assertTrue(self.user.is_user_active)
        self.user.save.assert_called_once()


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    DEFAULT_FROM_EMAIL="noreply@example.com",
    OTP_VALIDITY_MINUTES=10,
)
class ResendOtpViewTests(SimpleTestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = ResendOtp.as_view()

    def _email_queryset(self, user):
        queryset = Mock()
        queryset.last.return_value = user
        return queryset

    def test_email_resend_reports_existing_valid_otp_without_sending_mail(self):
        user = SimpleNamespace(
            pk=1,
            email="new@example.com",
            otp="1234",
            otp_created_at=timezone.now() - timedelta(minutes=5),
            is_user_active=False,
            save=Mock(),
        )

        with patch("api.auth.views.CustomUser.objects.filter", return_value=self._email_queryset(user)), \
             patch("api.auth.views.send_otp_email") as send_otp_email:
            response = self.view(self.factory.post(
                "/api/resend-otp/",
                {"email": user.email},
                format="json",
            ))

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data["resent"])
        self.assertEqual(response.data["expires_in_minutes"], 5)
        self.assertIn("valid for the next 5 minutes", response.data["message"])
        send_otp_email.assert_not_called()
        user.save.assert_not_called()

    def test_email_resend_generates_new_otp_after_expiry(self):
        user = SimpleNamespace(
            pk=1,
            email="new@example.com",
            otp="1234",
            otp_created_at=timezone.now() - timedelta(minutes=11),
            is_user_active=False,
            save=Mock(),
        )

        with patch("api.auth.views.CustomUser.objects.filter", return_value=self._email_queryset(user)), \
             patch("api.auth.views.send_otp_email") as send_otp_email:
            response = self.view(self.factory.post(
                "/api/resend-otp/",
                {"email": user.email},
                format="json",
            ))

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["resent"])
        self.assertEqual(response.data["expires_in_minutes"], 10)
        self.assertNotEqual(user.otp, "1234")
        send_otp_email.assert_called_once_with(user.email, user.otp)
        user.save.assert_called_once()


class SendOTPSMSTests(SimpleTestCase):
    def test_send_otp_sms_posts_phone_number_and_otp_to_provider(self):
        connection = Mock()
        response = Mock()
        response.read.return_value = b'{"success": true}'
        connection.getresponse.return_value = response

        with patch("utils.token_otp_sms", return_value="jwt-token"), \
             patch("http.client.HTTPSConnection", return_value=connection), \
             patch("builtins.print"):
            send_otp_sms("+237651890022", "9876")

        connection.request.assert_called_once()
        method, path, payload, headers = connection.request.call_args.args
        sms_payload = json.loads(payload)

        self.assertEqual(method, "POST")
        self.assertEqual(path, "/sms/send")
        self.assertEqual(headers["Authorization"], "Bearer jwt-token")
        self.assertEqual(sms_payload["to"], "+237651890022")
        self.assertIn("9876", sms_payload["message"])

    def test_send_otp_sms_raises_when_provider_rejects_message(self):
        connection = Mock()
        response = Mock()
        response.status = 200
        response.read.return_value = (
            b'{"success": false, "message": "Your balance is not enough to send message."}'
        )
        connection.getresponse.return_value = response

        with patch("utils.token_otp_sms", return_value="jwt-token"), \
             patch("http.client.HTTPSConnection", return_value=connection), \
             patch("builtins.print"):
            with self.assertRaisesRegex(RuntimeError, "balance is not enough"):
                send_otp_sms("+237651890022", "9876")


class UserProfileCreateViewTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = UserProfileCreateView.as_view()

    def test_phone_only_signup_allows_blank_email(self):
        with patch("api.auth.serializers.send_otp_sms") as send_sms:
            response = self.view(self.factory.post(
                "/api/user/register/",
                {
                    "email": "",
                    "phone": "651890022",
                    "password": "Secret123!",
                    "user_type": "client",
                    "full_name": "Phone Only",
                },
                format="json",
            ))

        self.assertEqual(response.status_code, 200)
        self.assertFalse(CustomUser.objects.filter(email="").exists())
        self.assertEqual(CustomUser.objects.filter(email__isnull=True).count(), 1)
        send_sms.assert_called_once()
        self.assertEqual(send_sms.call_args.args[0], "+237651890022")

    def test_phone_only_signup_sms_failure_returns_400_without_creating_user(self):
        with patch(
            "api.auth.serializers.send_otp_sms",
            side_effect=Exception("SMS provider down"),
        ):
            response = self.view(self.factory.post(
                "/api/user/register/",
                {
                    "email": "",
                    "phone": "651890023",
                    "password": "Secret123!",
                    "user_type": "client",
                    "full_name": "Phone Only",
                },
                format="json",
            ))

        self.assertEqual(response.status_code, 400)
        self.assertIn("Unable to send OTP SMS", response.data["message"])
        self.assertFalse(CustomUser.objects.filter(profile__phone="651890023").exists())

    def test_phone_only_signup_sms_balance_failure_returns_clear_message(self):
        with patch(
            "api.auth.serializers.send_otp_sms",
            side_effect=Exception("Your balance is not enough to send message."),
        ):
            response = self.view(self.factory.post(
                "/api/user/register/",
                {
                    "email": "",
                    "phone": "651890024",
                    "password": "Secret123!",
                    "user_type": "client",
                    "full_name": "Phone Only",
                },
                format="json",
            ))

        self.assertEqual(response.status_code, 400)
        self.assertIn("SMS wallet balance is too low", response.data["message"])
        self.assertFalse(CustomUser.objects.filter(profile__phone="651890024").exists())
