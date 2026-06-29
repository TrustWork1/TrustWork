import base64
import logging
import threading
import time

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


# ───────────────── ORANGE API CONFIG ─────────────────


API_URL = settings.ORANGE_API_URL

USERNAME = settings.ORANGE_USERNAME
PASSWORD = settings.ORANGE_PASSWORD
X_AUTH_TOKEN = settings.ORANGE_X_AUTH_TOKEN

CHANNEL_USER_MSISDN = settings.ORANGE_MSISDN
PIN = settings.ORANGE_PIN
_token_cache = {"access_token": None, "expires_at": 0}
_token_lock = threading.Lock()



def get_access_token() -> str:
    """Return a valid Bearer token, refreshing if expired. Thread-safe."""
    with _token_lock:
        if _token_cache["access_token"] and time.time() < _token_cache["expires_at"] - 60:
            return _token_cache["access_token"]

        credentials = f"{USERNAME}:{PASSWORD}"
        encoded = base64.b64encode(credentials.encode()).decode()

        response = requests.post(
            f"{API_URL}token",
            headers={
                "Authorization": f"Basic {encoded}",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data={"grant_type": "client_credentials"},
            timeout=15
        )
        response.raise_for_status()

        data = response.json()
        _token_cache["access_token"] = data["access_token"]
        _token_cache["expires_at"] = time.time() + data.get("expires_in", 3600)

        return _token_cache["access_token"]
