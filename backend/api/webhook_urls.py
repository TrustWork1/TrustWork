from django.urls import path

from payment_handle.webhooks import (
    AppStoreWebhookView,
    EscrowCollectionWebhook,
    EscrowDisbursementWebhook,
    GooglePlayWebhookView,
)

urlpatterns = [
    path('escrow_collection/', EscrowCollectionWebhook.as_view(), name='escrow_collection'),
    path('escrow_disbursement/', EscrowDisbursementWebhook.as_view(), name='escrow_collection'),
    path('google-play/', GooglePlayWebhookView.as_view(), name='google-play-webhook'),
    path('app-store/', AppStoreWebhookView.as_view(), name='app-store-webhook'),
]
