from datetime import timedelta
from unittest.mock import Mock, patch

from django.test import TestCase
from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.test import APIRequestFactory

from api.subscription_views import (
    SubscriptionTokenValidationView,
    WebsiteMtnPreapprovalStatusView,
    WebsiteMtnSubscriptionInitiateView,
    WebsiteOrangeSubscriptionInitiateView,
    WebsiteOrangeSubscriptionStatusView,
    WebsiteStripeSubscriptionInitiateView,
    WebsiteStripeSubscriptionStatusView,
    WebsiteSubscriptionEmailCheckView,
    WebsiteSubscriptionPlanDetailView,
)
from content_management.models.home_page_models import (
    PriceFeatures,
    PricingPlan,
    PricingPlanSection,
)
from customuser.models import CustomUser
from profile_management.models import (
    Profile,
    SubscriptionPaymentAttempt,
    Subscriptions,
)


class WebsiteSubscriptionViewTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = CustomUser.objects.create_user(
            email="web-sub@example.com",
            password="StrongPass123",
            user_type="provider",
            full_name="Website Subscriber",
        )
        self.profile = Profile.objects.create(user=self.user)
        self.token = Token.objects.create(user=self.user)
        self.pricing_section = PricingPlanSection.objects.create(
            header="Best Packages For You",
            description="CMS pricing",
        )
        self.monthly_plan = PricingPlan.objects.create(
            pricingplan_section=self.pricing_section,
            plan_name="Monthly",
            description="Monthly access",
            price="10000.00",
            billing_cycle="Month",
        )
        PriceFeatures.objects.create(
            pricing_plan=self.monthly_plan,
            features="Secure subscription activation",
        )
        PriceFeatures.objects.create(
            pricing_plan=self.monthly_plan,
            features="Mobile money and card payment support",
        )

    def test_validate_token_accepts_bearer_token(self):
        request = self.factory.post(
            "/subscription/validate-token/",
            {},
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {self.token.key}",
        )

        response = SubscriptionTokenValidationView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["valid"])
        self.assertEqual(response.data["user"]["email"], self.user.email)
        self.assertFalse(response.data["user"]["is_payment_verified"])

    def test_email_check_existing_user_returns_login_path(self):
        request = self.factory.post(
            "/api/v1/subscription/auth/check-email/",
            {"email": self.user.email},
            format="json",
        )

        response = WebsiteSubscriptionEmailCheckView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["exists"])
        self.assertFalse(response.data["password_sent"])
        self.assertEqual(response.data["login_endpoint"], "/api/login/")

    def test_email_check_new_user_sends_generated_password(self):
        request = self.factory.post(
            "/api/v1/subscription/auth/check-email/",
            {"email": "new-web-user@example.com"},
            format="json",
        )

        with patch("api.subscription_views.send_mail", return_value=1) as send_mail:
            response = WebsiteSubscriptionEmailCheckView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data["exists"])
        self.assertTrue(response.data["created"])
        self.assertTrue(response.data["password_sent"])
        user = CustomUser.objects.get(email="new-web-user@example.com")
        self.assertEqual(user.user_type, "client")
        self.assertTrue(Profile.objects.filter(user=user).exists())
        send_mail.assert_called_once()
        mail_kwargs = send_mail.call_args.kwargs
        self.assertIn("Password:", mail_kwargs["message"])
        self.assertNotIn("account password is", mail_kwargs["message"])
        self.assertIn("Copy only the password", mail_kwargs["html_message"])

    def test_subscription_plan_detail_returns_cms_plan_features(self):
        request = self.factory.get(
            f"/api/v1/subscription/plans/{self.monthly_plan.id}/",
            format="json",
        )

        response = WebsiteSubscriptionPlanDetailView.as_view()(request, plan_id=self.monthly_plan.id)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["id"], self.monthly_plan.id)
        self.assertEqual(response.data["data"]["amount"], "10000.00")
        self.assertEqual(response.data["data"]["amount_integer"], 10000)
        self.assertEqual(response.data["data"]["subscription_frequency"], "monthly")
        self.assertEqual(len(response.data["data"]["features"]), 2)
        self.assertEqual(response.data["data"]["section"]["header"], "Best Packages For You")

    def test_mtn_initiate_normalizes_payload_for_escrow(self):
        gateway = Mock()
        gateway.initialize_subscription.return_value = {
            "subscription_id": "sub-1",
            "referenceId": "ref-1",
            "payment_status": "pending",
        }
        request = self.factory.post(
            "/api/v1/subscription/mtn/initiate/",
            {
                "phone_number": "+237 651 890 022",
                "amount": "1000",
                "subscription_frequency": "month",
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {self.token.key}",
        )

        with patch("api.subscription_views.PaymentGatewayAPI", return_value=gateway):
            response = WebsiteMtnSubscriptionInitiateView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["referenceId"], "ref-1")
        self.assertEqual(response.data["next_action"]["type"], "mtn_momo_approval")
        self.assertIn("dial your MTN MoMo code", response.data["next_action"]["message"])
        self.assertTrue(
            SubscriptionPaymentAttempt.objects.filter(
                profile=self.profile,
                provider="mtn",
                reference_id="ref-1",
                payment_status="pending",
            ).exists()
        )
        gateway.initialize_subscription.assert_called_once_with(
            {
                "email": self.user.email,
                "phone_number": "237651890022",
                "amount": "1000",
                "subscription_frequency": "monthly",
            }
        )

    def test_active_subscription_blocks_new_checkout_attempts(self):
        Subscriptions.objects.create(
            profile=self.profile,
            subscription_frequency="monthly",
            subscription_plan="Membership_monthly",
            purchase_token="active-token",
            expire_at=timezone.now() + timedelta(days=10),
        )
        gateway = Mock()
        request = self.factory.post(
            "/api/v1/subscription/mtn/initiate/",
            {
                "phone_number": "+237 651 890 022",
                "amount": "1000",
                "subscription_frequency": "monthly",
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {self.token.key}",
        )

        with patch("api.subscription_views.PaymentGatewayAPI", return_value=gateway):
            response = WebsiteMtnSubscriptionInitiateView.as_view()(request)

        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.data["code"], "active_subscription_exists")
        gateway.initialize_subscription.assert_not_called()

    def test_pending_attempt_blocks_new_checkout_across_providers(self):
        SubscriptionPaymentAttempt.objects.create(
            profile=self.profile,
            provider="mtn",
            reference_id="pending-ref",
            payment_status="pending",
            subscription_frequency="monthly",
            amount="1000.00",
            expires_at=timezone.now() + timedelta(minutes=20),
        )
        request = self.factory.post(
            "/api/v1/subscription/orange/initiate/",
            {
                "phone_number": "+237 697 279 862",
                "amount": "1000",
                "subscription_frequency": "weekly",
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {self.token.key}",
        )
        gateway = Mock()

        with patch("api.subscription_views.PaymentGatewayAPI", return_value=gateway):
            response = WebsiteOrangeSubscriptionInitiateView.as_view()(request)

        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.data["code"], "subscription_payment_pending")
        self.assertEqual(response.data["pending_attempt"]["provider"], "mtn")
        gateway.initialize_orange_website_subscription.assert_not_called()

    def test_expired_pending_attempt_allows_new_checkout(self):
        SubscriptionPaymentAttempt.objects.create(
            profile=self.profile,
            provider="mtn",
            reference_id="expired-ref",
            payment_status="pending",
            subscription_frequency="monthly",
            amount="1000.00",
            expires_at=timezone.now() - timedelta(minutes=1),
        )
        gateway = Mock()
        gateway.initialize_orange_website_subscription.return_value = {
            "success": True,
            "status": "PENDING",
            "orderId": "ORD-2",
            "payToken": "PAY-2",
        }
        request = self.factory.post(
            "/api/v1/subscription/orange/initiate/",
            {
                "phone_number": "+237 697 279 862",
                "amount": "1000",
                "subscription_frequency": "weekly",
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {self.token.key}",
        )

        with patch("api.subscription_views.PaymentGatewayAPI", return_value=gateway):
            response = WebsiteOrangeSubscriptionInitiateView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["referenceId"], "PAY-2")
        self.assertEqual(
            SubscriptionPaymentAttempt.objects.get(reference_id="expired-ref").payment_status,
            "expired",
        )

    def test_paid_preapproval_status_activates_subscription(self):
        gateway = Mock()
        gateway.get_mtn_subscription_preapproval_status.return_value = {
            "subscription_id": "sub-1",
            "referenceId": "ref-1",
            "payment_status": "paid",
            "subscription_frequency": "monthly",
            "amount": "1000",
        }
        request = self.factory.get(
            "/api/v1/subscription/mtn/preapproval-status/ref-1/",
            HTTP_AUTHORIZATION=f"Bearer {self.token.key}",
        )

        with patch("api.subscription_views.PaymentGatewayAPI", return_value=gateway), \
                patch("api.subscription_views.handle_successful_referral_subscription") as referral:
            response = WebsiteMtnPreapprovalStatusView.as_view()(request, reference_id="ref-1")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["payment_status"], "paid")
        self.assertTrue(response.data["subscription_activated"])
        subscription = Subscriptions.objects.get(profile=self.profile)
        self.assertEqual(subscription.subscription_frequency, "monthly")
        self.assertEqual(subscription.subscription_plan, "Membership_monthly")
        self.assertEqual(subscription.purchase_token, "ref-1")
        self.assertGreater(subscription.expire_at, timezone.now() + timedelta(days=20))
        self.profile.refresh_from_db()
        self.assertTrue(self.profile.is_payment_verified)
        referral.assert_called_once_with(
            self.user,
            subscription_price="1000",
            provider="mtn_website_subscription",
        )

    def test_pending_preapproval_status_does_not_activate_subscription(self):
        gateway = Mock()
        gateway.get_mtn_subscription_preapproval_status.return_value = {
            "subscription_id": "sub-1",
            "referenceId": "ref-1",
            "payment_status": "pending",
            "subscription_frequency": "monthly",
            "amount": "1000",
        }
        request = self.factory.get(
            "/api/v1/subscription/mtn/preapproval-status/ref-1/",
            HTTP_AUTHORIZATION=f"Bearer {self.token.key}",
        )

        with patch("api.subscription_views.PaymentGatewayAPI", return_value=gateway):
            response = WebsiteMtnPreapprovalStatusView.as_view()(request, reference_id="ref-1")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["payment_status"], "pending")
        self.assertFalse(response.data["subscription_activated"])
        self.assertFalse(Subscriptions.objects.filter(profile=self.profile).exists())

    def test_orange_initiate_uses_website_subscription_payment_type(self):
        gateway = Mock()
        gateway.initialize_orange_website_subscription.return_value = {
            "success": True,
            "status": "PENDING",
            "orderId": "ORD-1",
            "payToken": "PAY-1",
            "orangeTransactionId": 5,
        }
        request = self.factory.post(
            "/api/v1/subscription/orange/initiate/",
            {
                "phone_number": "+237 697 279 862",
                "amount": "1000",
                "subscription_frequency": "weekly",
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {self.token.key}",
        )

        with patch("api.subscription_views.PaymentGatewayAPI", return_value=gateway):
            response = WebsiteOrangeSubscriptionInitiateView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["referenceId"], "PAY-1")
        self.assertEqual(response.data["next_action"]["type"], "orange_money_approval")
        self.assertIn("Orange Money payment prompt", response.data["next_action"]["message"])
        self.assertTrue(
            SubscriptionPaymentAttempt.objects.filter(
                profile=self.profile,
                provider="orange",
                reference_id="PAY-1",
                payment_status="pending",
            ).exists()
        )
        gateway.initialize_orange_website_subscription.assert_called_once_with(
            {
                "email": self.user.email,
                "subscriberMsisdn": "697279862",
                "amount": "1000",
                "subscription_frequency": "weekly",
                "description": "TrustWork weekly website subscription",
                "user_id": self.user.id,
            }
        )

    def test_paid_orange_status_activates_subscription(self):
        gateway = Mock()
        gateway.get_orange_subscription_status.return_value = {
            "subscription_id": "orange-sub-1",
            "referenceId": "PAY-1",
            "payment_status": "paid",
            "subscription_frequency": "weekly",
            "amount": "1000",
        }
        request = self.factory.get(
            "/api/v1/subscription/orange/status/PAY-1/",
            HTTP_AUTHORIZATION=f"Bearer {self.token.key}",
        )

        with patch("api.subscription_views.PaymentGatewayAPI", return_value=gateway), \
                patch("api.subscription_views.handle_successful_referral_subscription"):
            response = WebsiteOrangeSubscriptionStatusView.as_view()(request, reference_id="PAY-1")

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["subscription_activated"])
        self.assertTrue(Subscriptions.objects.filter(profile=self.profile, purchase_token="PAY-1").exists())

    def test_stripe_initiate_creates_payment_intent_with_subscription_metadata(self):
        payment_intent = {
            "id": "pi_123",
            "status": "requires_payment_method",
            "client_secret": "pi_secret",
            "metadata": {
                "subscription_frequency": "monthly",
                "subscription_amount": "12.50",
                "currency": "usd",
            },
        }
        request = self.factory.post(
            "/api/v1/subscription/stripe/initiate/",
            {
                "amount": "12.50",
                "currency": "usd",
                "subscription_frequency": "monthly",
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {self.token.key}",
            HTTP_IDEMPOTENCY_KEY="idem-1",
        )

        with patch("api.subscription_views.stripe.PaymentIntent.create", return_value=payment_intent) as create:
            response = WebsiteStripeSubscriptionInitiateView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["payment_intent_id"], "pi_123")
        self.assertEqual(response.data["client_secret"], "pi_secret")
        self.assertTrue(
            SubscriptionPaymentAttempt.objects.filter(
                profile=self.profile,
                provider="stripe",
                reference_id="pi_123",
                payment_status="pending",
            ).exists()
        )
        self.assertEqual(create.call_args.kwargs["amount"], 1250)
        self.assertEqual(create.call_args.kwargs["idempotency_key"], "idem-1")
        self.assertEqual(create.call_args.kwargs["metadata"]["user_id"], str(self.user.id))

    def test_stripe_initiate_uses_cms_pricing_plan_amount(self):
        payment_intent = {
            "id": "pi_plan",
            "status": "requires_payment_method",
            "client_secret": "pi_plan_secret",
            "metadata": {
                "subscription_frequency": "monthly",
                "subscription_amount": "10000.00",
                "currency": "xaf",
            },
        }
        request = self.factory.post(
            "/api/v1/subscription/stripe/initiate/",
            {
                "pricing_plan_id": self.monthly_plan.id,
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {self.token.key}",
            HTTP_IDEMPOTENCY_KEY="idem-plan-1",
        )

        with patch("api.subscription_views.stripe.PaymentIntent.create", return_value=payment_intent) as create:
            response = WebsiteStripeSubscriptionInitiateView.as_view()(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(create.call_args.kwargs["amount"], 10000)
        self.assertEqual(create.call_args.kwargs["currency"], "xaf")
        self.assertEqual(
            create.call_args.kwargs["metadata"]["pricing_plan_id"],
            str(self.monthly_plan.id),
        )
        self.assertEqual(response.data["pricing_plan"]["subscription_frequency"], "monthly")

    def test_stripe_initiate_rejects_raw_card_details(self):
        request = self.factory.post(
            "/api/v1/subscription/stripe/initiate/",
            {
                "amount": "12.50",
                "currency": "usd",
                "subscription_frequency": "monthly",
                "card_number": "4242424242424242",
                "cvv": "123",
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {self.token.key}",
        )

        with patch("api.subscription_views.stripe.PaymentIntent.create") as create:
            response = WebsiteStripeSubscriptionInitiateView.as_view()(request)

        self.assertEqual(response.status_code, 400)
        self.assertIn("Do not send card details", response.data["error"])
        create.assert_not_called()

    def test_paid_stripe_status_activates_subscription(self):
        payment_intent = {
            "id": "pi_paid",
            "status": "succeeded",
            "client_secret": "pi_secret",
            "metadata": {
                "user_id": str(self.user.id),
                "email": self.user.email,
                "subscription_frequency": "monthly",
                "subscription_amount": "12.50",
                "currency": "usd",
            },
        }
        request = self.factory.get(
            "/api/v1/subscription/stripe/status/pi_paid/",
            HTTP_AUTHORIZATION=f"Bearer {self.token.key}",
        )

        with patch("api.subscription_views.stripe.PaymentIntent.retrieve", return_value=payment_intent), \
                patch("api.subscription_views.handle_successful_referral_subscription"):
            response = WebsiteStripeSubscriptionStatusView.as_view()(request, payment_intent_id="pi_paid")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["payment_status"], "paid")
        self.assertTrue(response.data["subscription_activated"])
        self.assertTrue(Subscriptions.objects.filter(profile=self.profile, purchase_token="pi_paid").exists())

    def test_paid_status_does_not_replace_existing_active_subscription(self):
        Subscriptions.objects.create(
            profile=self.profile,
            subscription_frequency="monthly",
            subscription_plan="Membership_monthly",
            purchase_token="already-active",
            expire_at=timezone.now() + timedelta(days=10),
        )
        payment_intent = {
            "id": "pi_late_paid",
            "status": "succeeded",
            "client_secret": "pi_secret",
            "metadata": {
                "user_id": str(self.user.id),
                "email": self.user.email,
                "subscription_frequency": "yearly",
                "subscription_amount": "100000",
                "currency": "xaf",
            },
        }
        request = self.factory.get(
            "/api/v1/subscription/stripe/status/pi_late_paid/",
            HTTP_AUTHORIZATION=f"Bearer {self.token.key}",
        )

        with patch("api.subscription_views.stripe.PaymentIntent.retrieve", return_value=payment_intent), \
                patch("api.subscription_views.handle_successful_referral_subscription") as referral:
            response = WebsiteStripeSubscriptionStatusView.as_view()(request, payment_intent_id="pi_late_paid")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["payment_status"], "paid")
        self.assertFalse(response.data["subscription_activated"])
        self.assertTrue(
            Subscriptions.objects.filter(
                profile=self.profile,
                purchase_token="already-active",
                is_active=True,
            ).exists()
        )
        self.assertFalse(Subscriptions.objects.filter(profile=self.profile, purchase_token="pi_late_paid").exists())
        referral.assert_not_called()
