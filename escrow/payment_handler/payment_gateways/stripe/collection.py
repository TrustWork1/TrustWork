import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

def stripe_collection(amount,escrow_id,transaction_id,currency="usd"):
    payment_indent = stripe.PaymentIntent.create(
                # amount=round(float(amount)),
                amount= int(round(float(amount) * 100)),
                currency=currency,
                automatic_payment_methods={"enabled": True},
                # payment_method_types=['card'],
                # capture_method='manual',
                metadata={'user_id': escrow_id,"transaction_id":transaction_id},use_stripe_sdk=True
            )
    return {'session_id': payment_indent.id, 'client_secret': payment_indent.client_secret, 'payment_indent':payment_indent.id, 'stripe_id': payment_indent.stripe_id, 'payment_status': payment_indent.status,"payment_id":payment_indent.id}