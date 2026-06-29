import json
from unittest.mock import Mock, patch

from django.test import SimpleTestCase, TestCase
from rest_framework.test import APIRequestFactory

from escrow_management.models import MtnSubscriptionTransaction
from escrow_management.views.initialize_subscription import (
    MtnSubscriptionPreapprovalStatus,
)
from payment_handler.payment_gateways.MTN_MoMo.collection import MtnMoMoCollection
from payment_handler.payment_gateways.MTN_MoMo.utils import (
    is_mtn_account_active,
    mtn_failure_message,
    normalize_mtn_cameroon_msisdn,
)


class MtnMoMoNumberTests(SimpleTestCase):
    def test_normalize_mtn_cameroon_msisdn_accepts_local_and_country_code(self):
        self.assertEqual(normalize_mtn_cameroon_msisdn("651890022"), "237651890022")
        self.assertEqual(normalize_mtn_cameroon_msisdn("+237 651 890 022"), "237651890022")

    def test_normalize_mtn_cameroon_msisdn_rejects_non_mobile_numbers(self):
        with self.assertRaises(ValueError):
            normalize_mtn_cameroon_msisdn("4874554545")

    def test_collection_request_to_pay_sends_normalized_msisdn(self):
        response = Mock(status_code=202, text="")

        with patch.object(MtnMoMoCollection, "authToken", return_value={"access_token": "token"}), \
                patch("payment_handler.payment_gateways.MTN_MoMo.collection.requests.post", return_value=response) as post:
            result = MtnMoMoCollection().requestToPay(
                amount="100",
                phone_number="+237 651 890 022",
                external_id="external-id",
            )

        payload = json.loads(post.call_args.kwargs["data"])
        self.assertEqual(payload["payer"]["partyId"], "237651890022")
        self.assertEqual(result["status_code"], 202)

    def test_mtn_failure_message_maps_provider_reasons(self):
        self.assertIn("not found", mtn_failure_message("PAYER_NOT_FOUND"))
        self.assertIn("approve", mtn_failure_message("COULD_NOT_PERFORM_TRANSACTION"))
        self.assertIn(
            "balance",
            mtn_failure_message("LOW_BALANCE_OR_PAYEE_LIMIT_REACHED_OR_NOT_ALLOWED"),
        )

    def test_is_mtn_account_active_accepts_boolean_and_string_true(self):
        self.assertTrue(is_mtn_account_active({"result": True}))
        self.assertTrue(is_mtn_account_active({"result": "true"}))
        self.assertFalse(is_mtn_account_active({"result": False}))


class MtnSubscriptionPreapprovalStatusTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_status_lookup_updates_paid_subscription_by_reference(self):
        subscription = MtnSubscriptionTransaction.objects.create(
            email="subscriber@example.com",
            amount="1000",
            subscription_frequency="monthly",
        )
        subscription.reference_id = subscription.id
        subscription.save(update_fields=["reference_id"])
        request = self.factory.get(f"/mtn-momo/preapproval-status/{subscription.reference_id}")

        with patch(
            "escrow_management.views.initialize_subscription.MtnMoMoSubscription.getTransactionStatus",
            return_value={"status": "SUCCESSFUL"},
        ):
            response = MtnSubscriptionPreapprovalStatus.as_view()(
                request,
                reference_id=str(subscription.reference_id),
            )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["payment_status"], "paid")
        self.assertEqual(response.data["referenceId"], str(subscription.reference_id))
        subscription.refresh_from_db()
        self.assertEqual(subscription.payment_status, "paid")
        self.assertEqual(subscription.unique_code_status, "active")
