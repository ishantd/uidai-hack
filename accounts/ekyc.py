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


class EkycOffline:
    
    def __init__(self):
        self.generate_captcha_url = "https://stage1.uidai.gov.in/unifiedAppAuthService/api/v2/get/captcha"
        self.generate_otp_url = "https://stage1.uidai.gov.in/unifiedAppAuthService/api/v2/generate/aadhaar/otp"
        self.get_ekyc_url = "https://stage1.uidai.gov.in/eAadhaarService/api/downloadOfflineEkyc"
        
    
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

    def generate_otp(self, uid, captchaTxnId, captchaValue):
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

        response = self.make_api_request(method, self.generate_otp_url, headers, data)
        return response

    def get_ekyc(self,uid,otp,txnId,share_code):
        method = "POST"
        headers = {'Content-Type':'application/json'}
        data = {
            "txnNumber": txnId,
            "otp": otp,
            "shareCode": share_code,
            "uid": uid
        }

        response = self.make_api_request(method, self.get_ekyc_url, headers, data)
        return response
