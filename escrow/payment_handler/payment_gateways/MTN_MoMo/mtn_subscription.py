import os
from uuid import uuid4
import requests
import json
from uuid import uuid4
from basicauth import encode
from .mtn_momo import MtnMoMo
from django.conf import settings
MTN_COLLECTION_PRIMARY_KEY=settings.MTN_COLLECTION_PRIMARY_KEY
TRUSTWORK_BASE_API=settings.TRUSTWORK_BASE_API
ESCROW_BASE_API=settings.ESCROW_BASE_API


class MtnMoMoSubscription(MtnMoMo):
    def __init__(self):
        super().__init__(transaction_type="collection")
        self.callback_url = ESCROW_BASE_API + "/webhooks/mtn-collection"
        self.collections_primary_key = MTN_COLLECTION_PRIMARY_KEY

    def requestToPay(self, amount, phone_number, external_id, payernote="SUBSCRIPTION", payermessage="SUBSCRIPTION PAYMENT"):
        uuidgen = str(uuid4())
        url = f"{self.base_url}/collection/v1_0/requesttopay"
        payload = json.dumps({
            "amount": amount,
            "currency": "XAF",
            "externalId": external_id,
            "payer": {
                "partyIdType": "MSISDN",
                "partyId": phone_number
            },
            "payerMessage": payermessage,
            "payeeNote": payernote
        })
        headers = {
            'X-Reference-Id': uuidgen,
            'X-Target-Environment': self.environment_mode,
            'X-Callback-Url': self.callback_url,
            'Ocp-Apim-Subscription-Key': self.collections_primary_key,
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + str(self.authToken()["access_token"])
        }
        response = requests.post(url, headers=headers, data=payload)
        context = {"status_code": response.status_code, "ref_id": uuidgen, "response_text": response.text}
        return context
    
    def getTransactionStatus(self, txn):
        url = f"{self.base_url}/collection/v1_0/requesttopay/{txn}"
        headers = {
            'Ocp-Apim-Subscription-Key': self.collections_primary_key,
            'Authorization': f"Bearer {self.authToken()['access_token']}",
            'X-Target-Environment': self.environment_mode,
        }
        response = requests.request("GET", url, headers=headers)
        return response.json()