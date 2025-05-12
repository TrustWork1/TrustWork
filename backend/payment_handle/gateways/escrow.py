import requests
import json

class PaymentGatewayAPI:
    def __init__(self, base_url: str = "https://trustwork-escrow.dedicateddevelopers.us"):
    #def __init__(self, base_url: str = "http://127.0.0.1:8000"):
        
        self.base_url = base_url

    def initialize_collection(self, amount: int, currency: str, payer: dict, payee: dict, external_resource_id: str):
        url = f"{self.base_url}/mtn-momo/initialize_collection/"
        headers = {"Content-Type": "application/json"}
        data = {
            "amount": amount,
            "currency": currency,
            "payer": payer,
            "payee": payee,
            "external_resource_id": external_resource_id,
            "callback_url":"http://trustwork-api.dedicateddevelopers.us/api/webhooks/escrow_collection/"
        }

        try:
            response = requests.post(url, json=data, headers=headers)
            print(response.text)
            return response.json()  # Return JSON response
        except requests.exceptions.RequestException as e:
            print(f"Error during collection initialization: {e}")
            return None

    def initialize_disbursement(self, escrow_id: str):
        url = f"{self.base_url}/mtn-momo/initialize_disbursement/"
        headers = {"Content-Type": "application/json"}
        data = {
            "escrow_id": str(escrow_id),
            "callback_url":"http://trustwork-api.dedicateddevelopers.us/api/webhooks/escrow_disbursement/"

        }

        try:
            response = requests.post(url, json=data, headers=headers)
            return response.json()  # Return JSON response
        except requests.exceptions.RequestException as e:
            print(f"Error during disbursement initialization: {e}")
            return None

    def get_collection_status(self, collection_id: str):
        url = f"{self.base_url}/mtn-momo/get_collection_status/{collection_id}"
        
        try:
            response = requests.get(url)
            return response.json()  # Return JSON response
        except requests.exceptions.RequestException as e:
            print(f"Error retrieving collection status: {e}")
            return None

    def get_disbursement_status(self, disbursement_id: str):
        url = f"{self.base_url}/mtn-momo/get_collection_status/{disbursement_id}"
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()  # Return JSON response
        except requests.exceptions.RequestException as e:
            print(f"Error retrieving disbursement status: {e}")
            return None
    def initialize_stripe_payment(self,amount,currency,payer,payee,external_resource_id):
        url = f"{self.base_url}/stripe/initiate_stripe_payment/"
        headers = {"Content-Type": "application/json"}
        data = {
            "amount": amount,
            "currency": currency,
            "payer": payer,
            "payee": payee,
            "external_resource_id": external_resource_id,
            "callback_url":"http://trustwork-api.dedicateddevelopers.us/api/webhooks/escrow_collection/"
        }
        print(data)
        try:
            response = requests.post(url, json=data, headers=headers)
            print(response.json())
            return response.json()  # Return JSON response
        except requests.exceptions.RequestException as e:
            print(f"Error during collection initialization: {e}")
            return None
# Example Usage
if __name__ == "__main__":
    api = PaymentGatewayAPI(base_url="http://127.0.0.1:8000")
    
    # Example data for collection initialization
    payer = {
        "mobile_number": "46733123452",
        "email": "swapnil.chopra@webskitters.in"
    }
    
    payee = {
        "mobile_number": "46733123452",
        "email": "46546545"
    }

    # Initialize collection
    collection_response = api.initialize_collection(100, "EUR", payer, payee, "1")
    print("Collection Response:", collection_response)

    # Example data for disbursement
    disbursement_response = api.initialize_disbursement("ff8f1ea4-8d10-48c5-b7e8-fd552ed1a402")
    print("Disbursement Response:", disbursement_response)

    # Example collection ID to check status
    collection_status = api.get_collection_status("623eaeac-82e2-4ba2-925b-85d5d360b88a")
    print("Collection Status:", collection_status)

    # Example disbursement ID to check status
    disbursement_status = api.get_disbursement_status("623eaeac-82e2-4ba2-925b-85d5d360b88a")
    print("Disbursement Status:", disbursement_status)
