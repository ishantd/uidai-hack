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


class VIDWrapperAPI:
    
    def __init__(self):
        self.generate_captcha_url = "https://stage1.uidai.gov.in/unifiedAppAuthService/api/v2/get/captcha"
        self.send_otp_url = "https://stage1.uidai.gov.in/unifiedAppAuthService/api/v2/generate/aadhaar/otp"
        self.generate_vid_url = "https://stage1.uidai.gov.in/vidwrapper/generate"
        self.retrieve_vid_url = "https://stage1.uidai.gov.in/vidwrapper/retrieve"
    
    def make_api_request(self, method, url, headers, data):
        response = requests.request(method, url, headers=headers, data=json.dumps(data))
        return response.json()

    def generate_captcha(self):
        method = "POST"
        headers = {'Content-Type':'application/json'}
        data = {
            "langCode": "en",
            "captchaLength": "3",
            "captchaType": "2"
        }
        response = self.make_api_request(method, self.generate_captcha_url, headers, data)
        return response


    def send_otp(self, uid, captchaTxnId, captchaValue):
        method = "POST"
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

        response = self.make_api_request(method, self.send_otp_url, headers, data)
        return response

    def generate_vid(self, uid, mobile, otp, otpTxnId):
        method = "POST"
        headers = {'Content-Type':'application/json'}
        data = {
            "uid": uid,
            "mobile": mobile,
            "otp": otp,
            "otpTxnId": otpTxnId
        }
        response = self.make_api_request(method, self.generate_vid_url, headers, data)
        
        return response


    def retrieve_vid(self, uid, mobile, otp, otpTxnId):
        method = "POST"
        headers = {'Content-Type':'application/json'}
        data = {
            "uid": uid,
            "mobile": mobile,
            "otp": otp,
            "otpTxnId": otpTxnId
        }
        response = self.make_api_request(method, self.retrieve_vid_url, headers, data)
        
        return response