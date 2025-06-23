
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

class MtnMoMoCollection(MtnMoMo):
    def __init__(self):
        super().__init__(transaction_type="collection")
        self.callback_url = ESCROW_BASE_API + "/webhooks/mtn-collection"
        self.collections_primary_key = MTN_COLLECTION_PRIMARY_KEY

    def requestToPay(self, amount, phone_number, external_id, payernote="TRUSTWORK", payermessage="SENT PROJECT FEE"):
        xaf=self.xaf_currency
        amount = round(xaf * amount, 2)
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
            # 'X-Callback-Url': self.callback_url,
            'Ocp-Apim-Subscription-Key': self.collections_primary_key,
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + str(self.authToken()["access_token"])
        }
        response = requests.post(url, headers=headers, data=payload)
        context = {"status_code": response.status_code, "ref": uuidgen, "response_text": response.text}
        return context

    def getTransactionStatus(self, txn):
        url = f"{self.base_url}/collection/v1_0/requesttopay/{txn}"
        headers = {
            'Ocp-Apim-Subscription-Key': self.collections_primary_key,
            'Authorization': f"Bearer {self.authToken()['access_token']}",
            'X-Target-Environment': self.environment_mode,
        }
        response = requests.request("GET", url, headers=headers)
        json_respon = response.json()
        return json_respon

    # Check momo collections balance
    def getBalance(self):
        url = f"{self.base_url}/collection/v1_0/account/balance"
        payload = {}
        headers = {
            'Ocp-Apim-Subscription-Key': self.collections_primary_key,
            'Authorization':  f"Bearer {self.authToken()['access_token']}",
            'X-Target-Environment': self.environment_mode,
        }
        response = requests.request("GET", url, headers=headers, data=payload)
        json_respon = response.json()
        return json_respon
    
    # Check MTN Account is valid or not
    def getAccountStatus(self, account_number: str):
        url = f"{self.base_url}/collection/v1_0/accountholder/msisdn/{account_number}/active"
        headers = {
            'Ocp-Apim-Subscription-Key': self.collections_primary_key,
            'Authorization': f"Bearer {self.authToken()['access_token']}",
            'X-Target-Environment': self.environment_mode,
        }
        response = requests.request("GET", url, headers=headers)
        
        if not response.ok:
            return {"result":False}
        return response.json()


# def collection(amount,mobile_number):
#     coll = MtnMoMoCollection()
#     response = coll.requestToPay(amount=amount,phone_number=mobile_number,external_id="123")
#     status_resposne = coll.getTransactionStatus(response['ref'])
#     if status_resposne['status'] == "SUCCESS":
#         pass #Do something here
