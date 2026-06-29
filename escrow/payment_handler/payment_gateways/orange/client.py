import requests
from django.conf import settings

from orange_management.utils import get_access_token

API_URL = settings.ORANGE_API_URL
X_AUTH_TOKEN = settings.ORANGE_X_AUTH_TOKEN


def check_payment_status(pay_token: str) -> dict:
    token = get_access_token()

    response = requests.get(
        f"{API_URL}omcoreapis/1.0.2/mp/paymentstatus/{pay_token}",
        headers={
            "X-AUTH-TOKEN": X_AUTH_TOKEN,
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        timeout=15,
    )
    response.raise_for_status()
    return response.json()
