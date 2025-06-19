from django.contrib import admin
from django.urls import path
# from escrow_management.views.stripe import CreateEscrowPayment, ReleaseEscrowPayment
# from payment_handler.payment_gateways.stripe_payment.payment_pay_in import ProcessPaymentAPIView
from escrow_management.views.stripe import ProcessStripeSession, PaymentStatus, ReleasePayout, StripeDisbursementAPI, StripeDisbursementWebhook #, PaymentReleaseOut,  ProcessStripeSessionCreate
from escrow_management.views.initiate_collection import InitiateStripeCollection, StripeCollectionStatus
urlpatterns = [
    # path("create-checkout-session/", CreateCheckoutSession.as_view(), name="create_checkout_session"),
    # path("create-escrow/", CreateEscrowPayment.as_view(), name="create_escrow"),
    # path("release-escrow/", ReleaseEscrowPayment.as_view(), name="release_escrow"),
    # path('process-payment/', ProcessPaymentAPIView.as_view(), name='process-payment'),
    path('api/process-stripe-session/', ProcessStripeSession.as_view(), name='process-payment'),
    path('api/payment-status-view/<str:session_id>/', PaymentStatus.as_view(), name='process-payment'),
    path('initiate_stripe_payment/',InitiateStripeCollection.as_view()),
    path('stripe_payment_status/',StripeCollectionStatus.as_view(), name='stripe-payment-status'),

    path('api/stripe-bank-payout-check/', ReleasePayout.as_view(), name='stripe-payout'),
    # path('api/stripe_payout/', PaymentReleaseOut.as_view(), name='stripe-payout'),
    # path('api/process-stripe-session-creation/', ProcessStripeSessionCreate.as_view(), name='process-payment'),
    # path('api/payment-view/', PaymentStatusSession.as_view(), name='process-payment'),
    path('initialize_disbursement/', StripeDisbursementAPI.as_view(), name='stripe-disbursement'),
    path("webhooks/stripe_escrow_disbursement/", StripeDisbursementWebhook.as_view()),
]