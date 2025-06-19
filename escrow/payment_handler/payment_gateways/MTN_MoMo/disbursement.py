
import os
import requests
import json
from uuid import uuid4
from basicauth import encode
from .mtn_momo import MtnMoMo
from django.conf import settings

MTN_DISBURSEMENT_PRIMARY_KEY=settings.MTN_DISBURSEMENT_PRIMARY_KEY
TRUSTWORK_BASE_API=settings.TRUSTWORK_BASE_API
ESCROW_BASE_API=settings.ESCROW_BASE_API

class MtnMoMoDisbursement(MtnMoMo):
    def __init__(self):
        super().__init__(transaction_type="disbursement")
        self.callback_url = ESCROW_BASE_API + "/webhooks/mtn-disbursement"
        self.disbursement_primary_key = MTN_DISBURSEMENT_PRIMARY_KEY

    def disburse(self, amount, phone_number, external_id, payernote="MTN_Momo", payermessage="Disbursement"):
        uuidgen = str(uuid4())
        url = f"{self.base_url}/disbursement/v1_0/transfer"
        payload = json.dumps({
            "amount": amount,
            "currency": "EUR",
            # "currency": "USD",
            "externalId": external_id,
            "payee": {
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
            'Ocp-Apim-Subscription-Key': self.disbursement_primary_key,
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + str(self.authToken()["access_token"])
        }
        response = requests.post(url, headers=headers, data=payload)
        context = {"status_code": response.status_code, "ref": uuidgen, "response_text": response.text}
        return context

    def getTransactionStatus(self, txn):
        url = f"{self.base_url}/disbursement/v1_0/transfer/{txn}"
        headers = {
            'Ocp-Apim-Subscription-Key': self.disbursement_primary_key,
            'Authorization': f"Bearer {self.authToken()['access_token']}",
            'X-Target-Environment': self.environment_mode,
        }
        response = requests.request("GET", url, headers=headers)
        json_respon = response.json()
        return json_respon
    
    # check disbursement account is active or not
    def getAccountStatus(self, account_number: str):
        url = f"{self.base_url}/disbursement/v1_0/accountholder/msisdn/{account_number}/active"
        headers = {
            'Ocp-Apim-Subscription-Key': self.disbursement_primary_key,
            'Authorization': f"Bearer {self.authToken()['access_token']}",
            'X-Target-Environment': self.environment_mode,
        }
        response = requests.request("GET", url, headers=headers)
        
        if not response.ok:
            return {"result":False}
        return response.json()


def collection(amount,mobile_number):
    coll = MtnMoMoDisbursement()
    response = coll.disburse(amount=amount,phone_number=mobile_number,external_id="123")
    status_resposne = coll.getTransactionStatus(response['ref'])
    print(status_resposne)
    if status_resposne['status'] == "SUCCESS":
        pass #Do something here

# collection(123,"46733123453")