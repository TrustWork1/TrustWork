from django.contrib import admin
from django.urls import path
from escrow_management.views.initiate_collection import InitiatePaymentAPI,TransactionStatusAPI, ValidMtnAccount
from escrow_management.views.initiate_disbursement import InitiateDisbursementAPI,DisbursementTransactionStatusAPI, MtnAccountAddStatusAPI
from escrow_management.views.initialize_subscription import InitiateSubscription, SubscriptionCode
from escrow_management.views.escrow_payment_status import EscrowTransactionStatus

urlpatterns = [
    path('mtn_account_status/', ValidMtnAccount.as_view()),
    path('initialize_collection/', InitiatePaymentAPI.as_view()),
    path('get_collection_status/<uuid:txn_id>', TransactionStatusAPI.as_view()),
    
    path('mtn_account_add_status/', MtnAccountAddStatusAPI.as_view()),
    path('initialize_disbursement/', InitiateDisbursementAPI.as_view()),
    path('get_disbursement_status/<uuid:txn_id>', DisbursementTransactionStatusAPI.as_view()),

    path('initialize_subscription/', InitiateSubscription.as_view()),
    path('check_subscription_code/', SubscriptionCode.as_view()),

    path('escrow_payment_status/<str:escrow_id>/', EscrowTransactionStatus.as_view()),
]