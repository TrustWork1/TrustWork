import os


class OrangeConfig:
    API_URL = os.getenv("API_URL", "https://api-s1.orange.cm/")
    USERNAME = os.getenv("ORANGE_USERNAME")
    PASSWORD = os.getenv("PASSWORD")
    CHANNEL_USER_MSISDN = os.getenv("CHANNEL_USER_MSISDN")
    PIN = os.getenv("PIN")
    X_AUTH_TOKEN = os.getenv("X_AUTH_TOKEN")
    TIMEOUT = int(os.getenv("ORANGE_TIMEOUT", "30"))
    CURRENCY = os.getenv("ORANGE_CURRENCY", "XAF")
