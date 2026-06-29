import contextlib
import json
from types import SimpleNamespace
from unittest.mock import patch

from django.test import SimpleTestCase
from requests import HTTPError, Response
from rest_framework.test import APIRequestFactory

from orange_management.views import OrangePaymentView, _normalize_cameroon_msisdn


class OrangePaymentViewTests(SimpleTestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def test_normalize_cameroon_msisdn_accepts_common_orange_formats(self):
        self.assertEqual(_normalize_cameroon_msisdn("697279862"), "697279862")
        self.assertEqual(_normalize_cameroon_msisdn("0697279862"), "697279862")
        self.assertEqual(_normalize_cameroon_msisdn("+237 697 279 862"), "697279862")
        self.assertEqual(_normalize_cameroon_msisdn("00237697279862"), "697279862")

    def test_channel_msisdn_validation_uses_configuration_message(self):
        with self.assertRaisesRegex(ValueError, "CHANNEL_USER_MSISDN"):
            _normalize_cameroon_msisdn("", is_channel=True)

    def test_orange_subscription_payment_does_not_require_user_id(self):
        txn = SimpleNamespace(
            id=11,
            order_id="ORD-123",
            pay_token="PAY-123",
            project_id=None,
            bid_id=None,
            payment_type="orange_subscription",
            status="PENDING",
        )
        subscription = SimpleNamespace(id=22)

        with patch("orange_management.views.initiate_payment", return_value={
            "orderId": "ORD-123",
            "payToken": "PAY-123",
            "data": {"status": "PENDING"},
        }), \
             patch("orange_management.views._normalize_cameroon_msisdn", side_effect=lambda value, **kwargs: value), \
             patch("orange_management.views.transaction.atomic", return_value=contextlib.nullcontext()), \
             patch("orange_management.views.OrangePayTransaction.objects.create", return_value=txn) as create_txn, \
             patch("orange_management.views.OrangeMtnSubscriptionTransaction.objects.create", return_value=subscription) as create_subscription, \
             patch("orange_management.views.check_orange_payment_status.apply_async") as schedule_status_check:
            response = OrangePaymentView.as_view()(self.factory.post(
                "/orange/pay/",
                {
                    "amount": "100",
                    "subscriberMsisdn": "651890022",
                    "payment_type": "orange_subscription",
                    "email": "subscriber@example.com",
                    "subscription_frequency": "monthly",
                },
                format="json",
            ))

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["subscriptionTransactionId"], 22)
        create_txn.assert_called_once()
        self.assertIsNone(create_txn.call_args.kwargs["user_id"])
        create_subscription.assert_called_once()
        self.assertEqual(create_subscription.call_args.kwargs["email"], "subscriber@example.com")
        schedule_status_check.assert_called_once_with(args=[11], countdown=600)

    def test_orange_project_payment_still_requires_user_id(self):
        response = OrangePaymentView.as_view()(self.factory.post(
            "/orange/pay/",
            {
                "amount": "100",
                "subscriberMsisdn": "651890022",
                "payment_type": "orange_project",
                "project_id": 1,
                "bid_id": 2,
            },
            format="json",
        ))

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.data["success"])
        self.assertIn("user_id", response.data["message"])

    def test_orange_provider_http_error_returns_provider_message(self):
        provider_message = "60019 :: Le solde du compte du payeur est insuffisant"
        orange_response = Response()
        orange_response.status_code = 400
        orange_response._content = json.dumps({
            "message": provider_message,
            "data": {
                "inittxnstatus": "60019",
                "inittxnmessage": "Le solde du compte du payeur est insuffisant",
                "status": "FAILED",
            },
        }).encode("utf-8")

        with patch("orange_management.views._normalize_cameroon_msisdn", side_effect=lambda value, **kwargs: value), \
             patch("orange_management.views.initiate_payment", side_effect=HTTPError(response=orange_response)):
            response = OrangePaymentView.as_view()(self.factory.post(
                "/orange/pay/",
                {
                    "amount": "3000",
                    "subscriberMsisdn": "697279862",
                    "payment_type": "orange_subscription",
                    "email": "subscriber@example.com",
                    "subscription_frequency": "weekly",
                },
                format="json",
            ))

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.data["success"])
        self.assertEqual(response.data["message"], provider_message)
        self.assertEqual(response.data["detail"]["data"]["inittxnstatus"], "60019")
