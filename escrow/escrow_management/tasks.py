from celery import shared_task
from django.utils import timezone
from .models import MtnSubscriptionTransaction
from payment_handler.payment_gateways.MTN_MoMo.mtn_subscription import MtnMoMoSubscription
import logging
import string
import random
import requests
from django.conf import settings

TRUSTWORK_BASE_API=settings.TRUSTWORK_BASE_API

logger = logging.getLogger("escrow_management.tasks")


@shared_task(bind=True, name="check_subscription_status")
def check_subscription_status(self, subscription_id):
    """
    Celery task to check the status of an MTN MoMo subscription payment
    after a delay (e.g., 10 minutes).
    """
    try:
        logger.info(f"Task started: Checking subscription {subscription_id}")
        subscription = MtnSubscriptionTransaction.objects.get(id=subscription_id)

        # Skip if already updated by callback
        if subscription.payment_status != "pending":
            logger.info(f"Subscription {subscription_id} already updated: {subscription.payment_status}")
            return {"subscription_id": subscription_id, "status": subscription.payment_status}

        collection = MtnMoMoSubscription()
        status_response = collection.getTransactionStatus(str(subscription.reference_id))
        status_value = status_response.get("status", "").lower()

        if status_value == "successful":
            subscription.payment_status = "paid"
            subscription.unique_code = generate_unique_code()
            subscription.unique_code_status = "active"
            subscription.save()
            phone_no = status_response.get("payer", {}).get("partyId")
            try:
                url = f"{TRUSTWORK_BASE_API}/api/send_subscription_code/"
                headers = {"Content-Type": "application/json"}
                body = {
                    "code": subscription.unique_code,
                    "email": subscription.email,
                    "phone_no": phone_no
                }
                requests.post(url, json=body, headers=headers)
            except requests.exceptions.RequestException as e:
                logger.exception("Error sending subscription code")
                print(f"Error during sending subscription code: {e}")
            logger.info(f"Subscription {subscription_id} marked as PAID")
            return {"subscription_id": subscription_id, "status": "paid"}

        elif status_value == "failed":
            subscription.payment_status = "failed"
            subscription.save()
            logger.info(f"Subscription {subscription_id} marked as FAILED")
            return {"subscription_id": subscription_id, "status": "failed"}

        else:
            # Still pending → optionally re-schedule another check
            logger.info(f"Subscription {subscription_id} still pending after delay")
            # Uncomment below if you want to keep retrying every 10 minutes:
            # check_subscription_status.apply_async(args=[subscription.id], countdown=600)
            return {"subscription_id": subscription_id, "status": "pending"}

    except MtnSubscriptionTransaction.DoesNotExist:
        logger.error(f"Subscription {subscription_id} not found")
        return {"subscription_id": subscription_id, "error": "not_found"}

    except Exception as e:
        logger.exception(f"Error checking subscription {subscription_id}: {e}")
        return {"subscription_id": subscription_id, "error": str(e)}


def generate_unique_code():
        characters = string.ascii_uppercase + string.digits
        while True:
            length = random.randint(8, 16)  # Random length between 8 and 16
            code = ''.join(random.choices(characters, k=length))
            if not MtnSubscriptionTransaction.objects.filter(unique_code=code).exists():
                return code
