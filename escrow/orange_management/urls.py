from django.urls import path

from orange_management.views import (
    OkResponseView,
    OrangeNotifyView,
    OrangePaymentStatusView,
    OrangePaymentView,
    OrangeSubscriptionStatusView,
    PaymentStatusView,
    SubscriptionCode,
)

urlpatterns = [
    path("pay/", OrangePaymentView.as_view(), name="orange-pay"),
    path("notify/", OrangeNotifyView.as_view(), name="orange-notify"),
    path("status/<str:txn_id>/", PaymentStatusView.as_view(), name="orange-transaction-status"),
    path("paymentstatus/<str:pay_token>/", OrangePaymentStatusView.as_view(), name="orange-payment-status"),
    path("subscription/status/<str:reference_id>/", OrangeSubscriptionStatusView.as_view(), name="orange-subscription-status"),
    path("check_subscription_code/", SubscriptionCode.as_view(), name="orange-subscription-code"),
    path('ok/', OkResponseView.as_view(), name='ok-api'),

]
