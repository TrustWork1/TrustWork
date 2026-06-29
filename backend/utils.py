import json
import os

import environ
import requests

env = environ.Env()
environ.Env.read_env(".env")

def token_otp_sms():
    jwt_url = "https://auth.sms.to/oauth/token"
    apikey = os.getenv('SMS_API_KEY')
    client_secret_key = os.getenv('SMS_SECRET_KEY')
    client_id = os.getenv('SMS_CLIENT_ID')

    jwt_headers = {
        'Authorization': f'Bearer {apikey}',
        'Content-Type': 'application/json'
    }
    jwt_body = {
        "client_id": client_id,
        "secret": client_secret_key,
        "expires_in": 60    # Expire minute(optional)
    }
    response = requests.post(jwt_url, headers=jwt_headers, json=jwt_body)

    # print("Status Code:", response.status_code)
    # print("Response JSON:", response.json())
    # print("JWT Token:", response.json().get("jwt"))
    jwt_token = response.json().get("jwt")
    return jwt_token


def _send_sms_payload(payload):
    import http.client

    jwt_token = token_otp_sms()
    if not jwt_token:
        raise RuntimeError("SMS authentication failed.")

    conn = http.client.HTTPSConnection("api.sms.to")
    headers = {
        'Authorization': f'Bearer {jwt_token}',
        'Content-Type': 'application/json'
    }

    conn.request("POST", "/sms/send", json.dumps(payload), headers)
    res = conn.getresponse()
    raw_data = res.read().decode("utf-8")
    print("PRINTING SMS: ", raw_data)

    try:
        response_data = json.loads(raw_data) if raw_data else {}
    except json.JSONDecodeError as exc:
        raise RuntimeError("SMS provider returned an invalid response.") from exc

    status_code = res.status if isinstance(getattr(res, "status", None), int) else 200
    if status_code >= 400 or response_data.get("success") is False:
        message = response_data.get("message") or "SMS provider rejected the message."
        raise RuntimeError(message)

    return response_data


def send_otp_sms(phone_number, otp):
    payload = {
        "message": f"Thank you for connecting with TrustWork. Your OTP is {otp}.",
        "to": phone_number,
        "bypass_optout": True,
        "sender_id": "Trustwork",
        "callback_url": ""
    }
    return _send_sms_payload(payload)


def send_subscription_sms(phone_number, code):
    payload = {
        "message": f"Thank you for connecting with TrustWork. Your subscription code is {code}. Kindly use this code to complete your subscription.",
        "to": phone_number,
        "bypass_optout": True,
        "sender_id": "Trustwork",
        "callback_url": ""
    }
    return _send_sms_payload(payload)

# send_otp_sms("+237675708549", "1234")
# send_otp_sms("+237694041826", "9876")
