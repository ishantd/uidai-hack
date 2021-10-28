from base64 import decode
import urllib.parse
import uuid
from datetime import datetime
from django.conf import settings
from lxml import etree
import os
import requests
import json
import uuid

# This api is working
def generate_captcha():
    url = "https://stage1.uidai.gov.in/unifiedAppAuthService/api/v2/get/captcha"
    method = "POST"
    headers = {'Content-Type':'application/json'}
    data = {
        "langCode": "en",
        "captchaLength": "3",
        "captchaType": "2"
    }
    response = requests.request(method, url, headers=headers, data=json.dumps(data))
    
    return response.json()



# Done : 1. Captca Verify and Send OTP with aadhar data api
# TODO : 2. OTP Verify and generate vid api

def generate_otp(uid, captchaTxnId, captchaValue):
    url = "https://stage1.uidai.gov.in/unifiedAppAuthService/api/v2/generate/aadhaar/otp"
    method = "POST"
    unique_id = str(uuid.uuid4())
    headers = {
        'x-request-id': f'{str(uuid.uuid4())}',
        'appid':'MYAADHAAR',
        'Accept-Language':'en_in',
        'Content-Type':'application/json'
    }
    data = {
        "uidNumber": uid,
        "captchaTxnId": captchaTxnId,
        "captchaValue": captchaValue,
        "transactionId": f"MYAADHAAR:{str(uuid.uuid4())}"
    }

    response = requests.request(method, url, headers=headers, data=json.dumps(data))
    print(response.status_code)
    return response.json()


    
# needs to be worked upon

def generate_vid(uid, mobile, otp, otpTxnId):
    url =  "https://stage1.uidai.gov.in/vidwrapper/generate"
    method = "POST"
    headers = {'Content-Type':'application/json'}
    data = {
        "uid": uid,
        "mobile": mobile,
        "otp": otp,
        "otpTxnId": otpTxnId
    }
    response = requests.request(method, url, headers=headers, data=json.dumps(data))
    
    return response.json()


def retrieve_vid(uid, mobile, otp, otpTxnId):
    url =  "https://stage1.uidai.gov.in/vidwrapper/retrieve"
    method = "POST"
    headers = {'Content-Type':'application/json'}
    data = {
        "uid": uid,
        "mobile": mobile,
        "otp": otp,
        "otpTxnId": otpTxnId
    }
    response = requests.request(method, url, headers=headers, data=json.dumps(data))
    
    return response.json()