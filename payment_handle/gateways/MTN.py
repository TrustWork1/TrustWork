# import requests
# import json
# import base64
# import uuid

# class MTNMomoPayment:
#     def __init__(self, api_key, client_secret, shortcode, subscriber_id, environment='sandbox'):
#         # Initialization with credentials and environment setup
#         self.api_key = api_key
#         self.client_secret = client_secret
#         self.shortcode = shortcode
#         self.subscriber_id = subscriber_id
#         self.environment = environment
#         self.base_url = 'https://momodeveloper.mtn.com/collection/v1_0'
#         self.auth_url = 'https://momodeveloper.mtn.com/collection/token'
#         self.token = None

#     def _generate_auth_token(self):
#         """Generate the OAuth token using API key and client secret."""
#         headers = {
            
#             'Authorization': 'Basic ' + base64.b64encode(
#                 f'{self.api_key}:{self.client_secret}'.encode('utf-8')).decode('utf-8'),
#             'Content-Type': 'application/x-www-form-urlencoded'
#         }

#         data = {
#             'grant_type': 'client_credentials'
#         }
#         self.token= base64.b64encode(
#                 f'{self.api_key}:{self.client_secret}'.encode('utf-8')).decode('utf-8')
        
#         return
#         response = requests.post(self.auth_url, headers=headers, data=data)

#         if response.status_code == 200:
#             response_data = response.json()
#             self.token = response_data['access_token']
#             print(f"Auth token: {self.token}")
#         else:
#             print(f"Failed to get token: {response.text}")

#     def _create_payment_request(self, amount, currency, external_id, payer_message, payee_message):
#         """Create the payment request body."""
#         return {
#             "amount": amount,
#             "currency": currency,
#             "externalId": external_id,
#             "payerMessage": payer_message,
#             "payeeMessage": payee_message,
#             "shortcode": self.shortcode,
#             "subscriberId": self.subscriber_id,
#             "transactionId": str(uuid.uuid4()),  # Generate a unique transaction ID
#             "paymentType": "PAYMENT",
#             "payer": {
#                 "partyIdType": "MSISDN",
#                 "partyId": self.subscriber_id
#             }
#         }

#     def create_payment(self, amount, currency, external_id, payer_message, payee_message):
#         """Create a payment request."""
#         if not self.token:
#             self._generate_auth_token()  # Ensure we have a valid token

#         payment_url = f"{self.base_url}/payments"
        
#         headers = {
#             'Authorization': f'Bearer {self.token}',
#             'Content-Type': 'application/json',
#             'X-Reference-Id': str(uuid.uuid4()),
#             'X-Target-Environment': self.environment  # Can be 'sandbox' or 'production'
#         }

#         # Create payment request data
#         payment_data = self._create_payment_request(amount, currency, external_id, payer_message, payee_message)
        
#         response = requests.post(payment_url, headers=headers, json=payment_data)

#         if response.status_code == 202:
#             print(f"Payment created successfully: {response.json()}")
#         else:
#             print(f"Failed to create payment: {response.text}")


# # Example usage:
# if __name__ == "__main__":
#     # Replace with your actual credentials from the MTN MoMo Developer Portal
#     api_key = 'fbef3e85b9c74e9e944ade2684c04623'  #      in your app's credentials
#     client_secret = '00ead76e-1b1f-499a-9f3c-eeefd7a407bc'  # Found in your app's credentials
#     shortcode = '12311'  # Found in your app's credentials
#     subscriber_id = '60415d3ac1b24cf69b97e81b0ed920d7'  # Usually, this is the MSISDN or a unique identifier

#     # Create an instance of the payment class
#     momo_payment = MTNMomoPayment(api_key, client_secret, shortcode, subscriber_id)

#     # Example: Create a payment of $10 USD with a message
#     momo_payment.create_payment(
#         amount=1000,  # Amount in the smallest currency unit (e.g., cents for USD)
#         currency="USD",  # Currency type
#         external_id="12345",  # External ID for the transaction
#         payer_message="Payment for goods",  # Message to the payer
#         payee_message="Payment received"  # Message to the payee
#     )


import os
from uuid import uuid4
import requests
import json
from uuid import uuid4
from basicauth import encode


class Collection:
    def __init__(self):
        self.collections_primary_key = os.getenv('MTN_SECRET_KEY', '60415d3ac1b24cf69b97e81b0ed920d7')
        self.api_key_collections = os.getenv('MTN_SECONDARY_KEY', 'fbef3e85b9c74e9e944ade2684c04623')
        self.collections_apiuser = os.environ.get('COLLECTION_USER_ID')
        self.environment_mode = 'sandbox'
        self.callback_url = os.environ.get('CALLBACK_URL')
        self.base_url = os.environ.get('BASE_URL')
        
        if self.environment_mode == "sandbox":
            self.base_url = "https://sandbox.momodeveloper.mtn.com"

        # Generate Basic authorization key when in test mode
        if self.environment_mode == "sandbox":
            self.collections_apiuser = str(uuid4())

        # Create API user
        self.url = f"{self.base_url}/v1_0/apiuser"
        payload = json.dumps({
            "providerCallbackHost": "http://localhost:8000"
        })
        self.headers = {
            'X-Reference-Id': self.collections_apiuser,
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': self.collections_primary_key
        }
        response = requests.post(self.url, headers=self.headers, data=payload)




        self.url = f"{self.base_url}/v1_0/apiuser/{self.collections_apiuser}/apikey"
        payload = json.dumps({
            "providerCallbackHost": "http://localhost:8000"
        })
        self.headers = {
            # 'X-Reference-Id': self.collections_apiuser,
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': self.collections_primary_key
        }
        response = requests.post(self.url, headers=self.headers, data=payload)





        # Auto-generate when in test mode
        if self.environment_mode == "sandbox":
            self.api_key_collections = str(response.json()["apiKey"])

        # Create basic key for Collections
        self.username, self.password = self.collections_apiuser, self.api_key_collections
        self.basic_authorisation_collections = str(encode(self.username, self.password))

    def authToken(self):
        url = f"{self.base_url}/collection/token/"
        payload = {}
        headers = {
            'Ocp-Apim-Subscription-Key': self.collections_primary_key,
            'Authorization': self.basic_authorisation_collections
        }
        response = requests.post(url, headers=headers, data=payload).json()
        return response

    def requestToPay(self, amount, phone_number, external_id,payernote="SPARCO", payermessage="SPARCOPAY"):
        uuidgen = str(uuid4())
        url = f"{self.base_url}/collection/v1_0/requesttopay"
        payload = json.dumps({
            "amount": amount,
            "currency": "EUR",
            "externalId": '123456789',
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

        context = {"status_code": response.status_code,"ref": uuidgen}
        return context

    def getTransactionStatus(self, txn):
        url = f"{self.base_url}/collection/v1_0/requesttopay/{txn}"
        payload = {}
        headers = {
            'Ocp-Apim-Subscription-Key': self.collections_primary_key,
        'Authorization': f"Bearer {self.authToken()['access_token']}",
            'X-Target-Environment': self.environment_mode,
        }
        response = requests.request("GET", url, headers=headers, data=payload)
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
    


def collection(amount,mobile_number):
    coll = Collection()
    response = coll.requestToPay(amount=amount,phone_number=mobile_number,external_id="123")
    status_resposne = coll.getTransactionStatus(response['ref'])
    if status_resposne['status'] == "SUCCESS":
        pass #Do something here

    return status_resposne['status']

# collection(100,mobile_number="swapnil.chopra@webskitters.in")



import os
from uuid import uuid4
import requests
import json
from uuid import uuid4
from basicauth import encode
from django.conf import settings
WEBHOOK_HOST='https://w.com'

class MtnMoMo:
    def __init__(self):
        self.collections_primary_key = os.getenv('MTN_SECRET_KEY','60415d3ac1b24cf69b97e81b0ed920d7')
        self.disbursement_primary_key = os.getenv('MTN_SECONDARY_KEY','450a7e7df0b64cd0b8408fe5231fa333')
        
        self.api_key_collections = 'fbef3e85b9c74e9e944ade2684c04623'
        self.collections_apiuser = os.environ.get('COLLECTION_USER_ID')
        self.environment_mode = 'sandbox'
        self.callback_url = f'http://{WEBHOOK_HOST}/webhooks/mtn-{self.transaction_type}'
        self.base_url = os.environ.get('BASE_URL')
        
        if self.environment_mode == "sandbox":
            self.base_url = "https://sandbox.momodeveloper.mtn.com"

        if self.environment_mode == "sandbox":
            self.collections_apiuser = str(uuid4())
        self._generate_api_key()
        if self.transaction_type=='collection':
            self.primary_key=self.collections_primary_key
        else:
            self.primary_key=self.disbursement_primary_key
    def _generate_api_key(self):
        self.url = f"{self.base_url}/v1_0/apiuser"
        payload = json.dumps({
                        "providerCallbackHost": WEBHOOK_HOST,
        })
        self.headers = {
                    # "providerCallbackHost": WEBHOOK_HOST,

            'X-Reference-Id': self.collections_apiuser,
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': self.collections_primary_key
        }
        response = requests.post(self.url, headers=self.headers, data=payload)

        self.url = f"{self.base_url}/v1_0/apiuser/{self.collections_apiuser}/apikey"

        self.headers = {
                                # "providerCallbackHost": WEBHOOK_HOST,

            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': self.collections_primary_key
        }
        response = requests.post(self.url, headers=self.headers, data=payload)
        print(response.json())
        if self.environment_mode == "sandbox":
            self.api_key_collections = str(response.json()["apiKey"])

        self.username, self.password = self.collections_apiuser, self.api_key_collections
        self.basic_authorisation_collections = str(encode(self.username, self.password))

    def authToken(self):
        url = f"{self.base_url}/collection/token/"
        payload = {}
        headers = {
            'Ocp-Apim-Subscription-Key': self.collections_primary_key,
            'Authorization': self.basic_authorisation_collections
        }
        response = requests.post(url, headers=headers, data=payload).json()
        return response

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
    

import os
from uuid import uuid4
import requests
import json
from uuid import uuid4
from basicauth import encode
from django.conf import settings
class MtnMoMoDisbursement(MtnMoMo):
    def __init__(self):
        self.transaction_type="disbursement"
        
        return super().__init__()

    def disburse(self, amount, phone_number, external_id,payernote="", payermessage=""):
        uuidgen = str(uuid4())
        url = f"{self.base_url}/disbursement/v1_0/transfer"
        payload = json.dumps({

            "amount": amount,
            "currency": "EUR",
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
            # 'X-Callback-Url': self.callback_url,
            'Ocp-Apim-Subscription-Key': self.disbursement_primary_key,
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + str(self.authToken()["access_token"])
        }
        response = requests.post(url, headers=headers, data=payload)

        context = {"status_code": response.status_code,"ref": uuidgen}
        return context

    def getTransactionStatus(self, txn):
        url = f"{self.base_url}/disbursement/v1_0/transfer/{txn}"
        payload = {}
        headers = {
            'Ocp-Apim-Subscription-Key': self.disbursement_primary_key,
        'Authorization': f"Bearer {self.authToken()['access_token']}",
            'X-Target-Environment': self.environment_mode,
        }
        response = requests.request("GET", url, headers=headers, data=payload)
        json_respon = response.json()
        return json_respon

    # Check momo collections balance
    def getBalance(self):
        url = f"{self.base_url}/collection/v1_0/account/balance"
        payload = {}
        headers = {
            'Ocp-Apim-Subscription-Key': self.disbursement_primary_key,
            'Authorization':  f"Bearer {self.authToken()['access_token']}",
            'X-Target-Environment': self.environment_mode,
        }
        response = requests.request("GET", url, headers=headers, data=payload)
        json_respon = response.json()
        return json_respon
    


def disbursement(amount,mobile_number):
    coll = MtnMoMoDisbursement()
    response = coll.disburse(amount=amount,phone_number=mobile_number,external_id="123")
    status_resposne = coll.getTransactionStatus(response['ref'])
    print(status_resposne)
    return status_resposne
    if status_resposne['status'] == "SUCCESS":
        pass #Do something here

# collection(123,"46733123453")