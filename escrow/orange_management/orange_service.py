import base64
import uuid

import requests

from orange_management.orange_config import OrangeConfig


class OrangeService:

    def __init__(self):

        self.base_url = OrangeConfig.API_URL

        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-AUTH-TOKEN": OrangeConfig.X_AUTH_TOKEN,
            "Authorization": self.get_auth()
        }

    def get_auth(self):

        creds = f"{OrangeConfig.USERNAME}:{OrangeConfig.PASSWORD}"

        encoded = base64.b64encode(creds.encode()).decode()

        return f"Basic {encoded}"


    def initiate_payment(self, mobile, amount):

        order_id = str(uuid.uuid4())

        payload = {

            "subscriberMsisdn": mobile,

            "channelUserMsisdn": OrangeConfig.CHANNEL_USER_MSISDN,

            "pin": OrangeConfig.PIN,

            "amount": str(amount),

            "currency": OrangeConfig.CURRENCY,

            "orderId": order_id,

            "description": "Test Payment"
        }
        print(self.base_url)
        url = f"{self.base_url}"

        response = requests.post(url, json=payload, headers=self.headers)
        print("Status Code:", response.status_code)
        print("Response Text:", response.text)
        print("Response Headers:", response.headers)

        try:
            return response.json()
        except Exception:
            return {"error": "Invalid JSON response", "raw": response.text, "status_code": response.status_code}



    def check_status(self, order_id):

        url = f"{self.base_url}/webpayment/{order_id}"

        response = requests.get(url, headers=self.headers)

        return response.json()
