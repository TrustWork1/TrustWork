import json
from datetime import timedelta
from types import SimpleNamespace
from unittest.mock import Mock, patch

from django.test import SimpleTestCase, TestCase
from django.utils import timezone
from rest_framework.test import APIRequestFactory, force_authenticate

from api.profile.views import (
    HandleMtnSubscription,
    PaymentStatusView,
    SendRequestToSubscribe,
)
from customuser.models import CustomUser
from profile_management.models import Profile, Subscriptions


class SubscriptionPaymentRequestTests(SimpleTestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_send_subscription_request_can_initialize_orange_subscription(self):
        gateway = Mock()
        gateway.initialize_orange_subscription.return_value = {
            "success": True,
            "status": "PENDING",
            "orderId": "ORD-123",
            "payToken": "PAY-123",
            "subscriptionTransactionId": 10,
        }
        user = SimpleNamespace(id=77, is_authenticated=True)
        request = self.factory.post(
            "/api/send_subscription_request/",
            {
                "email": "subscriber@example.com",
                "phone_number": "651890022",
                "amount": "100",
                "subscription_frequency": "monthly",
                "payment_type": "orange",
            },
            format="json",
        )
        force_authenticate(request, user=user)

        with patch("api.profile.views.PaymentGatewayAPI", return_value=gateway):
            response = SendRequestToSubscribe.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Orange payment request sent successfully.")
        gateway.initialize_orange_subscription.assert_called_once_with({
            "email": "subscriber@example.com",
            "subscriberMsisdn": "651890022",
            "amount": "100",
            "subscription_frequency": "monthly",
            "payment_type": "orange_subscription",
            "description": "TrustWork monthly subscription",
            "user_id": 77,
        })
        gateway.initialize_subscription.assert_not_called()

    def test_orange_subscription_alias_defaults_to_orange_payment(self):
        gateway = Mock()
        gateway.initialize_orange_subscription.return_value = {"success": True, "status": "PENDING"}
        request = self.factory.post(
            "/api/send_orange_subscription_request/",
            {
                "email": "subscriber@example.com",
                "subscriberMsisdn": "237651890022",
                "amount": 100,
                "subscription_frequency": "month",
            },
            format="json",
        )

        with patch("api.profile.views.PaymentGatewayAPI", return_value=gateway):
            response = SendRequestToSubscribe.as_view()(request)

        self.assertEqual(response.status_code, 200)
        gateway.initialize_orange_subscription.assert_called_once()
        self.assertEqual(
            gateway.initialize_orange_subscription.call_args.args[0]["subscriberMsisdn"],
            "651890022",
        )
        self.assertEqual(
            gateway.initialize_orange_subscription.call_args.args[0]["subscription_frequency"],
            "monthly",
        )

    def test_orange_subscription_accepts_phone_extension_and_local_zero(self):
        gateway = Mock()
        gateway.initialize_orange_subscription.return_value = {"success": True, "status": "PENDING"}
        request = self.factory.post(
            "/api/send_orange_subscription_request/",
            {
                "email": "subscriber@example.com",
                "phone_extension": "+237",
                "phone_number": "0697279862",
                "amount": 100,
                "subscription_frequency": "monthly",
            },
            format="json",
        )

        with patch("api.profile.views.PaymentGatewayAPI", return_value=gateway):
            response = SendRequestToSubscribe.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            gateway.initialize_orange_subscription.call_args.args[0]["subscriberMsisdn"],
            "697279862",
        )

    def test_send_subscription_request_keeps_mtn_default(self):
        gateway = Mock()
        gateway.initialize_subscription.return_value = {"status": "pending"}
        request = self.factory.post(
            "/api/send_subscription_request/",
            {
                "email": "subscriber@example.com",
                "phone_number": "651890022",
                "amount": "100",
                "subscription_frequency": "weekly",
            },
            format="json",
        )

        with patch("api.profile.views.PaymentGatewayAPI", return_value=gateway):
            response = SendRequestToSubscribe.as_view()(request)

        self.assertEqual(response.status_code, 200)
        gateway.initialize_subscription.assert_called_once_with({
            "email": "subscriber@example.com",
            "phone_number": "237651890022",
            "amount": "100",
            "subscription_frequency": "weekly",
        })
        gateway.initialize_orange_subscription.assert_not_called()

    def test_orange_subscription_returns_provider_failure_message(self):
        gateway = Mock()
        provider_message = "60019 :: Le solde du compte du payeur est insuffisant"
        gateway.initialize_orange_subscription.return_value = {
            "success": False,
            "message": "Orange API error.",
            "detail": json.dumps({
                "message": provider_message,
                "data": {
                    "inittxnstatus": "60019",
                    "inittxnmessage": "Le solde du compte du payeur est insuffisant",
                    "status": "FAILED",
                },
            }),
        }
        request = self.factory.post(
            "/api/send_orange_subscription_request/",
            {
                "email": "subscriber@example.com",
                "phone_number": "237697279862",
                "amount": "3000",
                "subscription_frequency": "weekly",
            },
            format="json",
        )

        with patch("api.profile.views.PaymentGatewayAPI", return_value=gateway):
            response = SendRequestToSubscribe.as_view()(request)

        self.assertEqual(response.status_code, 400)
        self.assertIn("wallet has enough balance", response.data["error"])
        self.assertIn("wallet has enough balance", response.data["message"])
        self.assertEqual(response.data["orange_detail"]["data"]["inittxnstatus"], "60019")

    def test_mtn_subscription_returns_clear_wallet_failure_message(self):
        gateway = Mock()
        gateway.initialize_subscription.return_value = {
            "status": "FAILED",
            "reason": "COULD_NOT_PERFORM_TRANSACTION",
        }
        request = self.factory.post(
            "/api/send_subscription_request/",
            {
                "email": "subscriber@example.com",
                "phone_number": "651890022",
                "amount": "3000",
                "subscription_frequency": "weekly",
            },
            format="json",
        )

        with patch("api.profile.views.PaymentGatewayAPI", return_value=gateway):
            response = SendRequestToSubscribe.as_view()(request)

        self.assertEqual(response.status_code, 400)
        self.assertIn("wallet has enough balance", response.data["message"])
        self.assertEqual(response.data["reason"], "COULD_NOT_PERFORM_TRANSACTION")


class SubscriptionCodeRedemptionTests(SimpleTestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.profile = SimpleNamespace(id=5, is_payment_verified=False, save=Mock())
        self.user = SimpleNamespace(id=9, is_authenticated=True, profile=self.profile)

    def test_check_subscription_codes_can_redeem_orange_code(self):
        gateway = Mock()
        gateway.orange_subscription_code.return_value = {
            "id": "orange-sub-1",
            "email": "subscriber@example.com",
            "amount": 100,
            "subscription_frequency": "monthly",
            "payment_status": "success",
        }
        active_subscription_qs = Mock()
        request = self.factory.post(
            "/api/check_subscription_codes/",
            {"code": "ORANGE123", "payment_type": "orange"},
            format="json",
        )
        force_authenticate(request, user=self.user)

        with patch("api.profile.views.PaymentGatewayAPI", return_value=gateway), \
             patch("api.profile.views.Subscriptions.objects.filter", return_value=active_subscription_qs), \
             patch("api.profile.views.Subscriptions.objects.create") as create_subscription, \
             patch("api.profile.views.ProfileSerializer", return_value=SimpleNamespace(data={"id": 5})), \
             patch("api.profile.views.handle_successful_referral_subscription") as referral_handler:
            response = HandleMtnSubscription.as_view()(request)

        self.assertEqual(response.status_code, 200)
        gateway.orange_subscription_code.assert_called_once_with("ORANGE123")
        gateway.mtn_subscription_code.assert_not_called()
        active_subscription_qs.update.assert_called_once_with(is_active=False)
        self.assertEqual(create_subscription.call_args.kwargs["profile"], self.profile)
        self.assertEqual(create_subscription.call_args.kwargs["subscription_frequency"], "monthly")
        self.assertEqual(create_subscription.call_args.kwargs["subscription_plan"], "Membership_monthly")
        self.assertTrue(self.profile.is_payment_verified)
        self.profile.save.assert_called_once()
        referral_handler.assert_called_once_with(
            self.user,
            subscription_price=100,
            provider="orange_subscription",
        )

    def test_check_subscription_codes_falls_back_to_orange_when_code_is_not_mtn(self):
        gateway = Mock()
        gateway.mtn_subscription_code.return_value = {"error": "Invalid subscription code or used code."}
        gateway.orange_subscription_code.return_value = {
            "amount": 200,
            "subscription_frequency": "yearly",
            "payment_status": "success",
        }
        request = self.factory.post(
            "/api/check_subscription_codes/",
            {"code": "ORANGE123"},
            format="json",
        )
        force_authenticate(request, user=self.user)

        with patch("api.profile.views.PaymentGatewayAPI", return_value=gateway), \
             patch("api.profile.views.Subscriptions.objects.filter", return_value=Mock()), \
             patch("api.profile.views.Subscriptions.objects.create"), \
             patch("api.profile.views.ProfileSerializer", return_value=SimpleNamespace(data={"id": 5})), \
             patch("api.profile.views.handle_successful_referral_subscription") as referral_handler:
            response = HandleMtnSubscription.as_view()(request)

        self.assertEqual(response.status_code, 200)
        gateway.mtn_subscription_code.assert_called_once_with("ORANGE123")
        gateway.orange_subscription_code.assert_called_once_with("ORANGE123")
        referral_handler.assert_called_once_with(
            self.user,
            subscription_price=200,
            provider="orange_subscription",
        )


class PaymentStatusViewTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = CustomUser.objects.create_user(
            email="status@example.com",
            password="StrongPass123",
            user_type="provider",
            full_name="Status User",
        )
        self.profile = Profile.objects.create(user=self.user, is_payment_verified=True)

    def test_payment_status_cannot_grant_access_without_active_subscription(self):
        request = self.factory.post(
            "/api/profile/payment-status/",
            {"is_payment_verified": True},
            format="json",
        )
        force_authenticate(request, user=self.user)

        response = PaymentStatusView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data["is_payment_verified"])
        self.profile.refresh_from_db()
        self.assertFalse(self.profile.is_payment_verified)

    def test_payment_status_returns_active_subscription_state(self):
        Subscriptions.objects.create(
            profile=self.profile,
            subscription_frequency="weekly",
            subscription_plan="Membership_weekly",
            expire_at=timezone.now() + timedelta(days=7),
        )
        request = self.factory.post(
            "/api/profile/payment-status/",
            {"is_payment_verified": False},
            format="json",
        )
        force_authenticate(request, user=self.user)

        response = PaymentStatusView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["is_payment_verified"])
