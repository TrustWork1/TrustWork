import os

import environ
import requests

env = environ.Env()
environ.Env.read_env(".env")
ESCROW_BASE_API = os.getenv('ESCROW_BASE_API')
TRUSTWORK_BASE_API = os.getenv('TRUSTWORK_BASE_API')


def normalize_mtn_cameroon_msisdn(phone_number):
    digits = "".join(ch for ch in str(phone_number or "") if ch.isdigit())
    if digits.startswith("00"):
        digits = digits[2:]
    if digits.startswith("237") and len(digits) > 9:
        digits = digits[3:]
    if len(digits) != 9 or not digits.startswith("6"):
        raise ValueError("Use a valid Cameroon MTN number, e.g. 2376XXXXXXXX.")
    return f"237{digits}"


def normalize_orange_cameroon_msisdn(phone_number):
    digits = "".join(ch for ch in str(phone_number or "") if ch.isdigit())
    if digits.startswith("00"):
        digits = digits[2:]
    if digits.startswith("237") and len(digits) > 9:
        digits = digits[3:]
    if digits.startswith("0") and len(digits) > 9:
        digits = digits[1:]
    if len(digits) != 9 or not digits.startswith("6"):
        raise ValueError("Use a valid Cameroon Orange Money number, e.g. 6XXXXXXXX or +2376XXXXXXXX.")
    return digits


class PaymentGatewayAPI:
    def __init__(self, base_url: str = None):
        if base_url is None:
            base_url = ESCROW_BASE_API

        self.base_url = base_url

    def initialize_collection(self, amount: str, phone_number: str, payer: dict, payee: dict, external_resource_id: str):
        try:
            phone_number = normalize_mtn_cameroon_msisdn(phone_number)
        except ValueError as exc:
            return {"status": "failed", "message": str(exc), "error": str(exc)}

        url = f"{self.base_url}/mtn-momo/initialize_collection/"
        headers = {"Content-Type": "application/json"}
        data = {
            "amount": amount,
            "phone_number":phone_number,
            "payer": payer,
            "payee": payee,
            "external_resource_id": external_resource_id,
            "callback_url":f"{TRUSTWORK_BASE_API}/api/webhooks/escrow_collection/"
        }

        try:
            response = requests.post(url, json=data, headers=headers)
            return response.json()  # Return JSON response
        except requests.exceptions.RequestException as e:
            print(f"Error during collection initialization: {e}")
            return None

    def initialize_disbursement(self, escrow_id: str, phone_number: str, amount: str):
        try:
            phone_number = normalize_mtn_cameroon_msisdn(phone_number)
        except ValueError as exc:
            return {"status": "failed", "message": str(exc), "error": str(exc)}

        url = f"{self.base_url}/mtn-momo/initialize_disbursement/"
        headers = {"Content-Type": "application/json"}
        data = {
            "escrow_id": str(escrow_id),
            "callback_url":f"{TRUSTWORK_BASE_API}/api/webhooks/escrow_disbursement/",
            "phone_number": phone_number,
            "amount": amount,
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
            "callback_url":f"{TRUSTWORK_BASE_API}/api/webhooks/escrow_collection/"
        }
        print(data)
        try:
            response = requests.post(url, json=data, headers=headers)
            print(response.json())
            return response.json()  # Return JSON response
        except requests.exceptions.RequestException as e:
            print(f"Error during collection initialization: {e}")
            return None

    def disbursement_stripe_payment(self, escrow_id, stripe_account_id, amount):
        url = f"{self.base_url}/stripe/initialize_disbursement/"
        headers = {"Content-Type": "application/json"}
        data = {
            "escrow_id": str(escrow_id),
            "stripe_account_id": stripe_account_id,
            "callback_url":f"{ESCROW_BASE_API}/stripe/webhooks/stripe_escrow_disbursement/",
            "amount": amount,
        }
        try:
            response = requests.post(url, json=data, headers=headers)
            print(response.json())
            return response.json()  # Return JSON response
        except requests.exceptions.RequestException as e:
            print(f"Error during disbursement initialization: {e}")
            return None

    def mtn_account_status(self, account_number):
        try:
            account_number = normalize_mtn_cameroon_msisdn(account_number)
        except ValueError as exc:
            return {"result": False, "message": str(exc), "error": str(exc)}

        url = f"{self.base_url}/mtn-momo/mtn_account_add_status/"
        headers = {"Content-Type": "application/json"}
        data = {
            "account_number": account_number
        }
        try:
            response = requests.get(url, json=data, headers=headers)
            return response.json()  # Return JSON response
        except requests.exceptions.RequestException as e:
            print(f"Error during account status: {e}")
            return None

    def initialize_subscription(self, data):
        try:
            data = {
                **data,
                "phone_number": normalize_mtn_cameroon_msisdn(data.get("phone_number")),
            }
        except ValueError as exc:
            return {"status": "failed", "message": str(exc), "error": str(exc)}

        url = f"{self.base_url}/mtn-momo/initialize_subscription/"
        headers = {"Content-Type": "application/json"}
        try:
            response = requests.post(url, json=data, headers=headers)
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error during initialize subscription: {e}")
            return None

    def get_mtn_subscription_preapproval_status(self, reference_id):
        url = f"{self.base_url}/mtn-momo/preapproval-status/{reference_id}"
        headers = {"Content-Type": "application/json"}
        try:
            response = requests.get(url, headers=headers, timeout=20)
            return response.json()
        except (requests.exceptions.RequestException, ValueError) as e:
            print(f"Error fetching MTN subscription preapproval status: {e}")
            return None

    def initialize_orange_subscription(self, data):
        return self.initialize_orange_payment({
            **data,
            "payment_type": "orange_subscription",
        })

    def initialize_orange_website_subscription(self, data):
        return self.initialize_orange_payment({
            **data,
            "payment_type": "orange_website_subscription",
        })

    def mtn_subscription_code(self, code):
        url = f"{self.base_url}/mtn-momo/check_subscription_code/"
        headers = {"Content-Type": "application/json"}
        data = {
            "code": code
        }
        try:
            response = requests.post(url, json=data, headers=headers)
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error during initialize subscription: {e}")
            return None

    def orange_subscription_code(self, code):
        url = f"{self.base_url}/orange/check_subscription_code/"
        headers = {"Content-Type": "application/json"}
        data = {
            "code": code
        }
        try:
            response = requests.post(url, json=data, headers=headers)
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error during Orange subscription code check: {e}")
            return None

    def get_orange_subscription_status(self, reference_id):
        url = f"{self.base_url}/orange/subscription/status/{reference_id}/"
        headers = {"Content-Type": "application/json"}
        try:
            response = requests.get(url, headers=headers, timeout=20)
            return response.json()
        except (requests.exceptions.RequestException, ValueError) as e:
            print(f"Error fetching Orange subscription status: {e}")
            return None



    def initialize_orange_payment(self, data):
        url = f"{self.base_url}/orange/pay/"
        headers = {"Content-Type": "application/json"}
        try:
            subscriber_msisdn = (
                data.get("subscriberMsisdn")
                or data.get("phone_number")
                or data.get("phone_no")
            )
            data = {
                **data,
                "subscriberMsisdn": normalize_orange_cameroon_msisdn(subscriber_msisdn),
                "payment_type": data.get("payment_type", "orange"),
            }
        except ValueError as exc:
            return {"success": False, "message": str(exc), "error": str(exc)}

        try:
            response = requests.post(url, json=data, headers=headers, timeout=30)
            return response.json()
        except (requests.exceptions.RequestException, ValueError) as e:
            print(f"Error during Orange payment initialization: {e}")
            return None

    def get_orange_payment_status(self, txn_id):
        url = f"{self.base_url}/orange/status/{txn_id}/"
        headers = {
            "Content-Type": "application/json"
        }
        try:
            response = requests.get(url, headers=headers, timeout=20)

            # Optional: check status code
            if response.status_code == 200:
                return response.json()
            else:
                print("Error:", response.text)
                return None

        except (requests.exceptions.RequestException, ValueError) as e:
            print(f"Error fetching Orange payment status: {e}")
        return None

    def get_apiorange_payment_status(self, pay_token):
        url = f"{self.base_url}/orange/paymentstatus/{pay_token}/"
        headers = {
            "Content-Type": "application/json"
        }
        try:
            response = requests.get(url, headers=headers, timeout=20)

            # Optional: check status code
            if response.status_code == 200:
                return response.json()
            else:
                print("Error:", response.text)
                return None

        except (requests.exceptions.RequestException, ValueError) as e:
            print(f"Error fetching Orange payment status: {e}")
        return None






# Example Usage
# if __name__ == "__main__":
#     api = PaymentGatewayAPI(base_url="http://127.0.0.1:8000")

#     # Example data for collection initialization
#     payer = {
#         "mobile_number": "46733123452",
#         "email": "swapnil.chopra@webskitters.in"
#     }

#     payee = {
#         "mobile_number": "46733123452",
#         "email": "46546545"
#     }

#     # Initialize collection
#     collection_response = api.initialize_collection(100, "EUR", payer, payee, "1")
#     print("Collection Response:", collection_response)

#     # Example data for disbursement
#     disbursement_response = api.initialize_disbursement("ff8f1ea4-8d10-48c5-b7e8-fd552ed1a402")
#     print("Disbursement Response:", disbursement_response)

#     # Example collection ID to check status
#     collection_status = api.get_collection_status("623eaeac-82e2-4ba2-925b-85d5d360b88a")
#     print("Collection Status:", collection_status)

#     # Example disbursement ID to check status
#     disbursement_status = api.get_disbursement_status("623eaeac-82e2-4ba2-925b-85d5d360b88a")
#     print("Disbursement Status:", disbursement_status)
