from django.urls import path
from .views import CreateEscrowCustomerView, CreateEscrowTransactionView, PaymentTransactionView, PaymentTransactionDetailView, ConfirmTransactionView, CancelTransactionView

urlpatterns = [
    path('create-customer/', CreateEscrowCustomerView.as_view(), name='service-provider-list'),
    path('escrow/transaction/', CreateEscrowTransactionView.as_view(), name='initiate_escrow'),


    # path('initiate-payment/', OrangeMoneyPaymentView.as_view(), name='initiate_payment'),
    path('payment/transaction/', PaymentTransactionView.as_view(), name='payment-transaction'),
    path('payment/transactions/<str:transaction_id>/', PaymentTransactionDetailView.as_view(), name='transaction-detail'),
    path('confirmpayment/transactions/<str:transaction_id>/', ConfirmTransactionView.as_view(), name='confirm_transaction'),
    path('payment/transactions/<str:transaction_id>/cancel/', CancelTransactionView.as_view(), name='cancel_transaction'),
]
