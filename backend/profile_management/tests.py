from datetime import timedelta

from django.core import mail
from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.authtoken.models import Token

from core.authentication import SubscriptionAwareTokenAuthentication
from customuser.models import CustomUser
from profile_management.models import Profile, Subscriptions
from profile_management.receipts import ReceiptPayload, send_payment_receipt_email
from profile_management.subscriptions import refresh_profile_subscription_status
from project_management.models import Bid, Project, Transactions


class SubscriptionStatusTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="subscriber@example.com",
            password="StrongPass123",
            user_type="provider",
            full_name="Subscriber",
        )
        self.profile = Profile.objects.create(user=self.user, is_payment_verified=True)

    def test_expired_subscription_disables_access(self):
        subscription = Subscriptions.objects.create(
            profile=self.profile,
            subscription_frequency="weekly",
            subscription_plan="Membership_weekly",
            expire_at=timezone.now() - timedelta(seconds=1),
        )

        self.assertFalse(refresh_profile_subscription_status(self.profile))

        subscription.refresh_from_db()
        self.profile.refresh_from_db()
        self.assertFalse(subscription.is_active)
        self.assertFalse(self.profile.is_payment_verified)

    def test_active_subscription_keeps_access(self):
        Subscriptions.objects.create(
            profile=self.profile,
            subscription_frequency="weekly",
            subscription_plan="Membership_weekly",
            expire_at=timezone.now() + timedelta(days=7),
        )

        self.assertTrue(refresh_profile_subscription_status(self.profile))

        self.profile.refresh_from_db()
        self.assertTrue(self.profile.is_payment_verified)

    def test_missing_expiry_does_not_grant_access(self):
        subscription = Subscriptions.objects.create(
            profile=self.profile,
            subscription_frequency="weekly",
            subscription_plan="Membership_weekly",
            expire_at=None,
        )

        self.assertFalse(refresh_profile_subscription_status(self.profile))

        subscription.refresh_from_db()
        self.profile.refresh_from_db()
        self.assertFalse(subscription.is_active)
        self.assertFalse(self.profile.is_payment_verified)

    def test_token_authentication_refreshes_expired_subscription(self):
        Subscriptions.objects.create(
            profile=self.profile,
            subscription_frequency="weekly",
            subscription_plan="Membership_weekly",
            expire_at=timezone.now() - timedelta(seconds=1),
        )
        token = Token.objects.create(user=self.user)

        authenticated_user, _ = SubscriptionAwareTokenAuthentication().authenticate_credentials(token.key)

        self.assertEqual(authenticated_user, self.user)
        self.profile.refresh_from_db()
        self.assertFalse(self.profile.is_payment_verified)


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    DEFAULT_FROM_EMAIL="noreply@example.com",
    PAYMENT_RECEIPT_EMAIL_ENABLED=True,
)
class PaymentReceiptTests(TestCase):
    def setUp(self):
        self.client_user = CustomUser.objects.create_user(
            email="client@example.com",
            password="StrongPass123",
            user_type="client",
            full_name="Client User",
        )
        self.client_profile = Profile.objects.create(user=self.client_user)
        self.provider_user = CustomUser.objects.create_user(
            email="provider@example.com",
            password="StrongPass123",
            user_type="provider",
            full_name="Provider User",
        )
        self.provider_profile = Profile.objects.create(user=self.provider_user)

    def test_receipt_email_contains_pdf_attachment(self):
        sent = send_payment_receipt_email(
            ReceiptPayload(
                receipt_number="TW-TEST-000001",
                recipient_email=self.client_user.email,
                customer_name="Client User",
                item_name="TrustWork Monthly Subscription",
                amount="10000",
                currency="XAF",
                payment_method="Stripe",
                payment_reference="pi_test",
                paid_at=timezone.now(),
                billing_period="Valid until 30 Jun 2026",
            )
        )

        self.assertTrue(sent)
        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertEqual(message.to, [self.client_user.email])
        self.assertIn("TrustWork Payment Receipt", message.subject)
        self.assertEqual(len(message.attachments), 1)
        filename, content, mimetype = message.attachments[0]
        self.assertEqual(filename, "TW-TEST-000001.pdf")
        self.assertEqual(mimetype, "application/pdf")
        self.assertTrue(content.startswith(b"%PDF"))

    def test_subscription_signal_sends_receipt_once(self):
        with self.captureOnCommitCallbacks(execute=True):
            subscription = Subscriptions.objects.create(
                profile=self.client_profile,
                subscription_frequency="monthly",
                subscription_plan="Membership_monthly",
                purchase_token="sub-ref-1",
                expire_at=timezone.now() + timedelta(days=30),
                receipt_amount="10000",
                receipt_currency="XAF",
                receipt_payment_method="mtn_website_subscription",
            )

        subscription.refresh_from_db()
        self.assertIsNotNone(subscription.receipt_email_sent_at)
        self.assertEqual(len(mail.outbox), 1)

        with self.captureOnCommitCallbacks(execute=True):
            subscription.save()

        self.assertEqual(len(mail.outbox), 1)

    def test_project_collection_completion_sends_client_receipt(self):
        project = Project.objects.create(
            client=self.client_profile,
            project_title="Kitchen Repair",
            project_description="Repair work",
            project_address="Douala",
            project_budget=15000,
            project_timeline="1 week",
            project_hrs_week="10",
        )
        bid = Bid.objects.create(
            project=project,
            service_provider=self.provider_profile,
            bid_details="I can do it",
            quotation_details="Materials included",
            project_total_cost="15000",
            time_line="1 week",
        )

        with self.captureOnCommitCallbacks(execute=True):
            transaction = Transactions.objects.create(
                bid=bid,
                project=project,
                status="completed",
                transaction_type="collection",
                payment_type="orange",
                payment_token="PAY-1",
            )

        transaction.refresh_from_db()
        self.assertIsNotNone(transaction.receipt_email_sent_at)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Project payment - Kitchen Repair", mail.outbox[0].body)
