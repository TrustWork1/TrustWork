from django.urls import path

from escrow_management.views.initiate_collection import (
    InitiateStripeCollection,
    StripeCollectionStatus,
)

# from escrow_management.views.stripe import CreateEscrowPayment, ReleaseEscrowPayment
from escrow_management.views.stripe import (  #, PaymentReleaseOut,  ProcessStripeSessionCreate
    PaymentStatus,
    ProcessStripeSession,
    ReleasePayout,
    StripeDisbursementAPI,
    StripeDisbursementWebhook,
)

urlpatterns = [
    # path("create-escrow/", CreateEscrowPayment.as_view(), name="create_escrow"),
    # path("release-escrow/", ReleaseEscrowPayment.as_view(), name="release_escrow"),
    path('api/process-stripe-session/', ProcessStripeSession.as_view(), name='process-payment'),
    path('api/payment-status-view/<str:session_id>/', PaymentStatus.as_view(), name='process-payment'),
    path('initiate_stripe_payment/',InitiateStripeCollection.as_view()),
    path('stripe_payment_status/',StripeCollectionStatus.as_view(), name='stripe-payment-status'),    # Webhook Response

    path('api/stripe-bank-payout-check/', ReleasePayout.as_view(), name='stripe-payout'),
    path('initialize_disbursement/', StripeDisbursementAPI.as_view(), name='stripe-disbursement'),
    path("webhooks/stripe_escrow_disbursement/", StripeDisbursementWebhook.as_view()),    # Webhook Response
]
