from django.contrib import admin

from orange_management.models import (
    OrangeMtnSubscriptionTransaction,
    OrangePayTransaction,
)


@admin.register(OrangePayTransaction)
class OrangePayTransactionAdmin(admin.ModelAdmin):
    list_display = ("order_id", "user_id", "project_id", "bid_id", "payment_type", "subscriber_msisdn", "amount", "status", "created_at")
    search_fields = ("order_id", "pay_token", "subscriber_msisdn", "transaction_id", "orange_txn_id", "user_id", "project_id", "bid_id")
    list_filter = ("status", "payment_type", "created_at")


@admin.register(OrangeMtnSubscriptionTransaction)
class OrangeMtnSubscriptionTransactionAdmin(admin.ModelAdmin):
    list_display = ("email", "amount", "subscription_frequency", "payment_status", "unique_code_status", "created_at")
    search_fields = ("email", "reference_id", "unique_code")
    list_filter = ("payment_status", "unique_code_status", "created_at")
