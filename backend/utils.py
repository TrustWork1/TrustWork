from twilio.rest import Client
from django.conf import settings
import random
import requests
import os
import environ
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

def send_otp_sms(phone_number, otp):
    import http.client
    import json
    
    jwt_token = token_otp_sms()

    conn = http.client.HTTPSConnection("api.sms.to")
    payload = json.dumps({
        "message": f"Thank you for connecting with TrustWork. Your OTP is {otp}.",
        "to": phone_number,
        "bypass_optout": True,
        "sender_id": "Trustwork",
        "callback_url": ""
    })
    headers = {
    'Authorization': f'Bearer {jwt_token}',
    'Content-Type': 'application/json'
    }
    
    conn.request("POST", "/sms/send", payload, headers)
    res = conn.getresponse()
    data = res.read()
    print("PRINTING SMS: ",data.decode("utf-8"))

def send_subscription_sms(phone_number, code):
    import http.client
    import json
    
    jwt_token = token_otp_sms()

    conn = http.client.HTTPSConnection("api.sms.to")
    payload = json.dumps({
        "message": f"Thank you for connecting with TrustWork. Your subscription code is {code}. Kindly use this code to complete your subscription.",
        "to": phone_number,
        "bypass_optout": True,
        "sender_id": "Trustwork",
        "callback_url": ""
    })
    headers = {
    'Authorization': f'Bearer {jwt_token}',
    'Content-Type': 'application/json'
    }
    
    conn.request("POST", "/sms/send", payload, headers)
    res = conn.getresponse()
    data = res.read()
    # print("PRINTING SMS: ",data.decode("utf-8"))

# send_otp_sms("+237675708549", "1234")
# send_otp_sms("+237694041826", "9876")