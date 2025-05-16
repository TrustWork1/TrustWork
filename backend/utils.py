from twilio.rest import Client
from django.conf import settings
import random
import requests
import os
import environ
env = environ.Env()
environ.Env.read_env(".env")
LIVEURlTALKING = os.getenv('LIVEURL')

def send_otp_twilio(phone_number,otp):
    # Generate a random OTP (6 digits)
    
    # Create a Twilio client
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    
    # Send the OTP message via Twilio
    message = client.messages.create(
        body=f"Your OTP is {otp}",
        from_=settings.TWILIO_PHONE_NUMBER,
        to=phone_number
    )
    
    # Return OTP for saving in session or database

    
    return otp



# send_otp("+919304871446","1234")

#develpoed by saswata
def send_otp(phone_number,otp):
    try:
        MyAppApiKey = settings.TWILIO_ACCOUNT_AFRICA_API

        # API Endpoint
        #url = "https://api.sandbox.africastalking.com/version1/messaging"
        #url = (LIVEURlTALKING, "https://content.africastalking.com/version1/messaging") # Live
        url = "https://content.africastalking.com/version1/messaging"      # LIVE URL

        # Headers
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            "apiKey": MyAppApiKey,  
        }

        # Request Payload Customise ShortCode also possible
        payload = {
            #"username": "sandbox",  
            "username": "TrustWork",
            "to": phone_number,  
            "message": f"Your OTP is {otp}",
            "from" : "268952"
        }


        # Send the POST request
        response = requests.post(url, headers=headers, data=payload)
        response.raise_for_status()  # Raises exception for HTTP errors

        # Parse the response
        response_data = response.json()

        # Check if response contains 'SMSMessageData' and 'Recipients'
        if "SMSMessageData" in response_data and "Recipients" in response_data["SMSMessageData"]:
            recipients = response_data["SMSMessageData"]["Recipients"]

            # Check if all recipients have statusCode 101 (Success)
            success = all(recipient.get("statusCode") == 101 for recipient in recipients)

            # print(response_data)
            if success:
                return otp
                # Return OTP for saving in session or database
            else:
                return None

        return None 

    except requests.exceptions.RequestException as e:
        print(f"Error while sending request: {e}")
        return None  # Return None in case of failure


def send_otp_sms(phone_number, otp):
    import http.client
    import json

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

# send_otp_sms("+237675708549", "6371")