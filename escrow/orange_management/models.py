import uuid

from django.db import models


class OrangePayTransaction(models.Model):

    # 🔹 Status Choices
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('AUTHORIZED', 'Authorized'),
        ('FAILED', 'Failed'),
        ('SUCCESS', 'Success'),
        ('CANCELLED', 'Cancelled'),
    ]

    INIT_STATUS_CHOICES = [
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    ]

    CONFIRM_STATUS_CHOICES = [
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    ]

    # 🔹 Order Info
    user_id=models.CharField(max_length=100, null=True, blank=True)
    project_id = models.CharField(max_length=100, null=True, blank=True)
    bid_id = models.CharField(max_length=100, null=True, blank=True)
    payment_type = models.CharField(max_length=50, null=True, blank=True, default="orange_project")
    order_id = models.CharField(max_length=100, unique=True)
    pay_token = models.CharField(
        max_length=100,
        unique=True,
        default=uuid.uuid4,
        editable=False
    )

    # 🔹 Transaction Details
    orange_txn_id = models.CharField(max_length=100, null=True, blank=True)
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    transaction_mode = models.CharField(max_length=100, null=True, blank=True)

    # 🔹 Payment Info
    subscriber_msisdn = models.CharField(max_length=20)
    channel_user_msisdn = models.CharField(max_length=20, null=True, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)

    # 🔹 Status Info
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )

    init_txn_status = models.CharField(
        max_length=10,
        choices=INIT_STATUS_CHOICES,
        null=True,
        blank=True
    )

    confirm_txn_status = models.CharField(
        max_length=10,
        choices=CONFIRM_STATUS_CHOICES,
        null=True,
        blank=True
    )

    # 🔹 Messages
    init_txn_message = models.TextField(null=True, blank=True)
    confirm_txn_message = models.TextField(null=True, blank=True)

    # 🔹 Metadata
    description = models.TextField(null=True, blank=True)
    notif_url = models.URLField(null=True, blank=True)

    # 🔹 Time
    create_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # 🔹 Raw Response (for debugging)
    raw_response = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_id']),
            models.Index(fields=['pay_token']),
            models.Index(fields=['status']),
            models.Index(fields=['transaction_id']),
        ]

    def __str__(self):
        return f"{self.order_id or 'NoOrder'} - {self.status}"

    # 🔹 Helper Methods
    def is_success(self):
        return (self.status or "").upper() == 'SUCCESS'

    def is_failed(self):
        return (self.status or "").upper() in {'FAILED', 'CANCELLED'}

    def is_pending(self):
        return (self.status or "").upper() in {'PENDING', 'AUTHORIZED'}


class OrangeMtnSubscriptionTransaction(models.Model):

    orange_transaction = models.ForeignKey(
        OrangePayTransaction,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subscriptions"
    )
    email                  = models.EmailField(null=True, blank=True)
    amount                 = models.FloatField()
    subscription_frequency = models.CharField(max_length=50, null=True, blank=True)
    reference_id           = models.CharField(max_length=255, null=True, blank=True)
    payment_status         = models.CharField(max_length=20,choices=[("pending","pending"),("success","success"),("failed","failed")],default="pending")
    unique_code = models.CharField(max_length=20, null=True, blank=True, unique=True)
    unique_code_status = models.CharField(max_length=100, null= True, blank=True, default="inactive")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} - {self.payment_status}"
