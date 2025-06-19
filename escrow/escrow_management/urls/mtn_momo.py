from django.contrib import admin
from django.urls import path
from escrow_management.views.initiate_collection import InitiatePaymentAPI,TransactionStatusAPI, ValidMtnAccount
from escrow_management.views.initiate_disbursement import InitiateDisbursementAPI,DisbursementTransactionStatusAPI, MtnAccountAddStatusAPI
urlpatterns = [
    path('mtn_account_status/', ValidMtnAccount.as_view()),
    path('initialize_collection/', InitiatePaymentAPI.as_view()),
    path('get_collection_status/<uuid:txn_id>', TransactionStatusAPI.as_view()),
    
    
    path('mtn_account_add_status/', MtnAccountAddStatusAPI.as_view()),
    path('initialize_disbursement/', InitiateDisbursementAPI.as_view()),
    path('get_disbursement_status/<uuid:txn_id>', DisbursementTransactionStatusAPI.as_view()),
    
]