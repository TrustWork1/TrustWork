import requests
import base64
from django.conf import settings


class OrangeMoneyService:
    def get_access_token(self):
        try:
            url = settings.ORANGE_MONEY['PAYMENT_API_URL']
            client_id = settings.ORANGE_MONEY['CLIENT_ID']
            client_secret = settings.ORANGE_MONEY['CLIENT_SECRET']

            credentials = f"{client_id}:{client_secret}"
            encoded_credentials = base64.b64encode(credentials.encode()).decode()

            headers = {
                'Authorization': f'Basic {encoded_credentials}',
                'Content-Type': 'application/x-www-form-urlencoded'
            }

            data = {'grant_type': 'client_credentials'}

            response = requests.post(url, headers=headers, data=data)

            if response.status_code == 200:
                return response.json().get('access_token')
            else:
                raise Exception(f"Failed to obtain access token: {response.content.decode()}")
        except Exception as e:
            print(f"Error obtaining token: {str(e)}")
            return None
    
    def initiate_payment(self, amount, currency, order_id, customer_msisdn):
        access_token = self.get_access_token()

        if not access_token:
            raise Exception("Failed to get access token")

        url = settings.ORANGE_MONEY['PAYMENT_API_URL']
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        data = {
            'amount': amount,
            'currency': currency,
            'order_id': order_id,
            'customer_msisdn': customer_msisdn,
            'return_url': settings.ORANGE_MONEY['CALLBACK_URL']
        }

        response = requests.post(url, headers=headers, json=data)

        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to initiate payment: {response.content.decode()}")
