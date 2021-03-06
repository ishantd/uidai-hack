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
        self.generate_otp_url = "https://stage1.uidai.gov.in/onlineekyc/getOtp/"
        self.verify_otp_url = "https://stage1.uidai.gov.in/onlineekyc/getAuth/"
        self.get_ekyc_url = "https://stage1.uidai.gov.in/onlineekyc/getEkyc/"
        self.headers = {
            'Content-Type':'application/json',
            'X-Request-ID':'123456',
            'appID':'PORTAL',
            'transactionId':'123456'
        }
        
    
    def make_api_request(self, method, url, headers, data):
        response = requests.request(method, url, headers=headers, data=json.dumps(data))
        return response.json()

    def generate_otp(self, uid, txnId):
        method = "POST"
        headers = {
            'Content-Type':'application/json'
        }
        data = {
            "uid": uid,
            "txnId": txnId
        }

        response = self.make_api_request(method, self.generate_otp_url, self.headers, data)
        return response

    def verify_otp(self, uid, txnId, otp):
        method = "POST"
        
        data = {
            "uid": uid,
            "txnId": txnId,
            "otp": otp
        }

        response = self.make_api_request(method, self.verify_otp_url, self.headers, data)
        return response

    def get_ekyc(self,uid,txnId,otp):
        method = "POST"
        headers = {'Content-Type':'application/json'}
        data = {
            "uid": uid,
            "txnId": txnId,
            "otp": otp
        }

        response = self.make_api_request(method, self.get_ekyc_url, self.headers, data)
        return response
