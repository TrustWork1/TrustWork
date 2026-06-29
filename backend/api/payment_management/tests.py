from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from api.payment_management.views import PaymentApiView
from customuser.models import CustomUser
from profile_management.models import Profile


class PaymentApiViewTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = CustomUser.objects.create_user(
            email="payment@example.com",
            password="StrongPass123",
            user_type="provider",
            full_name="Payment User",
        )
        self.profile = Profile.objects.create(user=self.user, is_payment_verified=True)

    def test_membership_payment_endpoint_does_not_grant_access_without_subscription(self):
        request = self.factory.post(
            "/api/membership-payment/",
            {"phone_number": "237697279862"},
            format="json",
        )
        force_authenticate(request, user=self.user)

        response = PaymentApiView.as_view()(request)

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.data["is_payment_verified"])
        self.profile.refresh_from_db()
        self.assertFalse(self.profile.is_payment_verified)
