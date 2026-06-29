from datetime import timedelta

from django.core import mail
from django.test import SimpleTestCase, TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from customuser.models import CustomUser
from profile_management.models import Coupons, Profile, Subscriptions

from .views import _referral_content_data, _user_referral_summary


class ReferralResponseHelperTests(SimpleTestCase):
    def test_user_referral_summary_includes_code_count_and_amount(self):
        user = type("User", (), {
            "user_referal_code": "REF12345",
            "referred_by_code": "PARENT12",
            "total_referal_count": "2",
            "total_referal_amount": "10",
            "is_discount": True,
        })()

        self.assertEqual(_user_referral_summary(user), {
            "user_referal_code": "REF12345",
            "referred_by_code": "PARENT12",
            "total_referal_count": "2",
            "total_referal_amount": "10",
            "is_discount": True,
        })

    def test_referral_content_data_keeps_existing_mobile_fields(self):
        referral = type("Referral", (), {
            "id": 1,
            "content": "Invite your friends",
            "icon": type("Icon", (), {"url": "/media/app_refer/1.png"})(),
        })()

        self.assertEqual(_referral_content_data(referral), {
            "id": 1,
            "content": "Invite your friends",
            "icon": "/media/app_refer/1.png",
        })


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    DEFAULT_FROM_EMAIL="noreply@example.com",
    SECURE_SSL_REDIRECT=False,
)
class ReferralSubscriptionFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.referrer = CustomUser.objects.create_user(
            email="referrer@example.com",
            password="StrongPass123",
            user_type="provider",
            full_name="Referrer User",
        )
        Profile.objects.create(user=self.referrer, phone="100000001")

    def test_signup_subscription_rewards_referrer_and_sends_email(self):
        register_response = self.client.post(
            "/api/user/register/",
            {
                "email": "referred@example.com",
                "password": "StrongPass123",
                "user_type": "client",
                "full_name": "Referred User",
                "phone": "100000002",
                "referred_by_code": self.referrer.user_referal_code,
            },
            format="json",
        )
        self.assertEqual(register_response.status_code, 200)

        referred_user = CustomUser.objects.get(email="referred@example.com")
        self.assertEqual(referred_user.referred_by_code, self.referrer.user_referal_code)
        self.referrer.refresh_from_db()
        self.assertEqual(self.referrer.total_referal_count, "0")
        self.assertEqual(self.referrer.total_referal_amount, "0")

        self.client.force_authenticate(user=referred_user)
        subscription_response = self.client.post(
            "/api/handle_subscription/",
            {
                "subscriptionPlan": "Membership_monthly",
                "subscription_price": "100",
                "subscriptionType": "google",
                "subscriptionReceipt": {"purchaseToken": "purchase-token-1"},
            },
            format="json",
        )
        self.assertEqual(subscription_response.status_code, 200)

        self.referrer.refresh_from_db()
        referred_user.profile.refresh_from_db()
        self.assertEqual(self.referrer.total_referal_count, "1")
        self.assertEqual(self.referrer.total_referal_amount, "5")
        self.assertTrue(self.referrer.is_discount)
        self.assertTrue(referred_user.profile.is_payment_verified)
        self.assertTrue(
            Subscriptions.objects.filter(profile=referred_user.profile, is_active=True).exists()
        )
        self.assertTrue(
            Coupons.objects.filter(
                user=self.referrer,
                from_user=str(referred_user.pk),
                is_active=True,
            ).exists()
        )
        self.assertIn("Successful Referral Completed", [email.subject for email in mail.outbox])

        self.client.post(
            "/api/handle_subscription/",
            {
                "subscriptionPlan": "Membership_monthly",
                "subscription_price": "100",
                "subscriptionType": "google",
                "subscriptionReceipt": {"purchaseToken": "purchase-token-2"},
            },
            format="json",
        )

        self.referrer.refresh_from_db()
        self.assertEqual(self.referrer.total_referal_count, "1")
        self.assertEqual(self.referrer.total_referal_amount, "5")
        self.assertEqual(
            Coupons.objects.filter(
                user=self.referrer,
                from_user=str(referred_user.pk),
            ).count(),
            1,
        )

    def test_get_referral_code_returns_authenticated_users_code(self):
        self.client.force_authenticate(user=self.referrer)
        response = self.client.get("/api/get_referal_code/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["user_referal_code"], self.referrer.user_referal_code)
        self.assertIsNone(response.data["data"]["referred_by_code"])

    def test_subscription_signal_rewards_referrer_if_flow_does_not_call_service(self):
        referred_user = CustomUser.objects.create_user(
            email="direct-subscription@example.com",
            password="StrongPass123",
            user_type="client",
            full_name="Direct Subscription",
            referred_by_code=self.referrer.user_referal_code,
        )
        referred_profile = Profile.objects.create(user=referred_user, phone="100000003")

        with self.captureOnCommitCallbacks(execute=True):
            Subscriptions.objects.create(
                profile=referred_profile,
                subscription_frequency="monthly",
                subscription_plan="Membership_monthly",
                purchase_token="direct-subscription-token",
                expire_at=timezone.now() + timedelta(days=30),
                receipt_amount="200",
                receipt_currency="XAF",
                receipt_payment_method="stripe_website_subscription",
            )

        self.referrer.refresh_from_db()
        self.assertEqual(self.referrer.total_referal_count, "1")
        self.assertEqual(self.referrer.total_referal_amount, "10")
        self.assertIn("Successful Referral Completed", [email.subject for email in mail.outbox])
