from unittest.mock import Mock, patch

from django.test import SimpleTestCase

from payment_handle.gateways.escrow import (
    PaymentGatewayAPI,
    normalize_mtn_cameroon_msisdn,
    normalize_orange_cameroon_msisdn,
)


class PaymentGatewayAPITests(SimpleTestCase):
    def test_normalize_mtn_cameroon_msisdn_accepts_local_and_country_code(self):
        self.assertEqual(normalize_mtn_cameroon_msisdn("651890022"), "237651890022")
        self.assertEqual(normalize_mtn_cameroon_msisdn("+237 651 890 022"), "237651890022")

    def test_normalize_mtn_cameroon_msisdn_rejects_non_mobile_numbers(self):
        with self.assertRaises(ValueError):
            normalize_mtn_cameroon_msisdn("4874554545")

    def test_normalize_orange_cameroon_msisdn_accepts_common_formats(self):
        self.assertEqual(normalize_orange_cameroon_msisdn("697279862"), "697279862")
        self.assertEqual(normalize_orange_cameroon_msisdn("0697279862"), "697279862")
        self.assertEqual(normalize_orange_cameroon_msisdn("+237 697 279 862"), "697279862")
        self.assertEqual(normalize_orange_cameroon_msisdn("00237697279862"), "697279862")

    def test_initialize_orange_payment_normalizes_number_before_http_call(self):
        gateway = PaymentGatewayAPI(base_url="http://escrow.local")
        response = Mock()
        response.json.return_value = {"success": True}

        with patch("payment_handle.gateways.escrow.requests.post", return_value=response) as post:
            result = gateway.initialize_orange_payment({
                "amount": "100",
                "subscriberMsisdn": "+237 697 279 862",
            })

        self.assertEqual(result, {"success": True})
        self.assertEqual(post.call_args.kwargs["json"]["subscriberMsisdn"], "697279862")

    def test_initialize_orange_payment_accepts_phone_number_alias(self):
        gateway = PaymentGatewayAPI(base_url="http://escrow.local")
        response = Mock()
        response.json.return_value = {"success": True}

        with patch("payment_handle.gateways.escrow.requests.post", return_value=response) as post:
            result = gateway.initialize_orange_payment({
                "amount": "100",
                "phone_number": "697279682",
            })

        self.assertEqual(result, {"success": True})
        self.assertEqual(post.call_args.kwargs["json"]["subscriberMsisdn"], "697279682")

    def test_initialize_subscription_rejects_invalid_mtn_number_before_http_call(self):
        gateway = PaymentGatewayAPI()

        with patch("payment_handle.gateways.escrow.requests.post") as post:
            response = gateway.initialize_subscription({
                "amount": "100",
                "phone_number": "4874554545",
            })

        self.assertEqual(response["status"], "failed")
        self.assertIn("valid Cameroon MTN number", response["message"])
        post.assert_not_called()

    def test_initialize_orange_subscription_uses_orange_payment_endpoint(self):
        gateway = PaymentGatewayAPI()
        gateway.initialize_orange_payment = Mock(return_value={"success": True})

        response = gateway.initialize_orange_subscription({
            "amount": "100",
            "subscriberMsisdn": "651890022",
        })

        self.assertEqual(response, {"success": True})
        gateway.initialize_orange_payment.assert_called_once_with({
            "amount": "100",
            "subscriberMsisdn": "651890022",
            "payment_type": "orange_subscription",
        })

    def test_initialize_orange_website_subscription_uses_website_payment_type(self):
        gateway = PaymentGatewayAPI()
        gateway.initialize_orange_payment = Mock(return_value={"success": True})

        response = gateway.initialize_orange_website_subscription({
            "amount": "100",
            "subscriberMsisdn": "651890022",
        })

        self.assertEqual(response, {"success": True})
        gateway.initialize_orange_payment.assert_called_once_with({
            "amount": "100",
            "subscriberMsisdn": "651890022",
            "payment_type": "orange_website_subscription",
        })

    def test_orange_subscription_code_posts_to_escrow_orange_code_endpoint(self):
        gateway = PaymentGatewayAPI()
        response = Mock()
        response.json.return_value = {"subscription_frequency": "monthly"}

        with patch("payment_handle.gateways.escrow.requests.post", return_value=response) as post:
            data = gateway.orange_subscription_code("ORANGE123")

        self.assertEqual(data, {"subscription_frequency": "monthly"})
        self.assertEqual(post.call_args.args[0], f"{gateway.base_url}/orange/check_subscription_code/")
        self.assertEqual(post.call_args.kwargs["json"], {"code": "ORANGE123"})

    def test_mtn_preapproval_status_calls_escrow_endpoint(self):
        gateway = PaymentGatewayAPI(base_url="http://escrow.local")
        response = Mock()
        response.json.return_value = {"payment_status": "paid"}

        with patch("payment_handle.gateways.escrow.requests.get", return_value=response) as get:
            data = gateway.get_mtn_subscription_preapproval_status("ref-123")

        self.assertEqual(data, {"payment_status": "paid"})
        self.assertEqual(
            get.call_args.args[0],
            "http://escrow.local/mtn-momo/preapproval-status/ref-123",
        )

    def test_orange_subscription_status_calls_escrow_endpoint(self):
        gateway = PaymentGatewayAPI(base_url="http://escrow.local")
        response = Mock()
        response.json.return_value = {"payment_status": "paid"}

        with patch("payment_handle.gateways.escrow.requests.get", return_value=response) as get:
            data = gateway.get_orange_subscription_status("pay-token")

        self.assertEqual(data, {"payment_status": "paid"})
        self.assertEqual(
            get.call_args.args[0],
            "http://escrow.local/orange/subscription/status/pay-token/",
        )
