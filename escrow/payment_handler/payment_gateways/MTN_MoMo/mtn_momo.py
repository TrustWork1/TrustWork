
import base64

import requests
from django.conf import settings

MTN_BASE_URL=settings.MTN_BASE_URL
MTN_COLLECTION_API_USER_ID=settings.MTN_COLLECTION_API_USER_ID
MTN_COLLECTION_API_KEY=settings.MTN_COLLECTION_API_KEY

MTN_DISBURSEMENT_API_USER_ID=settings.MTN_DISBURSEMENT_API_USER_ID
MTN_DISBURSEMENT_API_KEY=settings.MTN_DISBURSEMENT_API_KEY

MTN_COLLECTION_PRIMARY_KEY=settings.MTN_COLLECTION_PRIMARY_KEY
MTN_DISBURSEMENT_PRIMARY_KEY=settings.MTN_DISBURSEMENT_PRIMARY_KEY

TRUSTWORK_BASE_API=settings.TRUSTWORK_BASE_API
ESCROW_BASE_API=settings.ESCROW_BASE_API


class MtnMoMo:
    def __init__(self, transaction_type):
        self.transaction_type = transaction_type
        self.environment_mode = 'mtncameroon'
        self.base_url = "https://proxy.momoapi.mtn.com"

        if self.transaction_type == 'collection':
            self.primary_key = MTN_COLLECTION_PRIMARY_KEY
            self.api_user = MTN_COLLECTION_API_USER_ID
            self.api_key = MTN_COLLECTION_API_KEY
        else:
            self.primary_key = MTN_DISBURSEMENT_PRIMARY_KEY
            self.api_user = MTN_DISBURSEMENT_API_USER_ID
            self.api_key = MTN_DISBURSEMENT_API_KEY

        # response = requests.get("https://open.er-api.com/v6/latest/USD")
        # self.xaf_currency = 570.730798      # Per USD
        # if response.status_code == 200:
        #     currency = response.json()
        #     if currency.get("result") == "success":
        #         self.xaf_currency = currency["rates"]["XAF"]

    def authToken(self):
        token = f"{self.api_user}:{self.api_key}"
        basic_auth = "Basic " + base64.b64encode(token.encode()).decode()
        url = f"{self.base_url}/{self.transaction_type}/token/"
        headers = {
            'Ocp-Apim-Subscription-Key': self.primary_key,
            'Authorization': basic_auth
        }
        response = requests.post(url, headers=headers)
        # print(response.json())
        return response.json()
