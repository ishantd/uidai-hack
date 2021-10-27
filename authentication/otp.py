from base64 import decode
import urllib.parse
import uuid
from datetime import datetime
from django.conf import settings
import pytz
from lxml import etree
from signxml import XMLSigner, XMLVerifier
from xml.etree.cElementTree import Element, ElementTree
import xml.etree.ElementTree as ET 
import os
import requests

base_url = "https://otp-stage.uidai.gov.in/uidotpserver"
version = "2.5"
ac = "public"
sa = "public"
tz = pytz.timezone(settings.TIME_ZONE)
cert_path = os.path.join(settings.BASE_DIR, "cert")
asalk = urllib.parse.quote_plus("MEY2cG1nhC02dzj6hnqyKN2A1u6U0LcLAYaPBaLI-3qE-FtthtweGuk")
aualk = urllib.parse.quote_plus("MAElpSz56NccNf11_wSM_RrXwa7n8_CaoWRrjYYWouA1r8IoJjuaGYg")
uid = "999979102430"

def otp_request_xml_data(test, otp_type):
    # t = otp_request_xml_data("1234123", "A", "0")  request to aadhar via sms and email
    # xml_data = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Otp xmlns:ns2="http://www.uidai.gov.in/authentication/otp/1.0" uid="{uid}" ac="{ac}" sa="{sa}" ver="{version}" txn="{str(uuid.uuid4())}" ts="{datetime.now(tz).strftime("%Y-%m-%dT%H:%M:%S")}" lk="{aualk}" type="{type}"><Opts ch="{otp_type}"/></Otp>"""
    # data_to_sign = bytes(xml_data, encoding='utf-8')
    # cert = open(os.path.join(cert_path, "cer.pem")).read()
    # key = open(os.path.join(cert_path, "key.key")).read()
    # root = etree.fromstring(data_to_sign)
    # signed_root = XMLSigner().sign(root, key=key, cert=cert)
    # verified_data = XMLVerifier().verify(signed_root, ca_pem_file=os.path.join(cert_path, "cer.pem")).signed_xml
    # print(signed_root)
    
    xml_data = open(os.path.join(cert_path, "test.xml")).read()
    print(type(xml_data))
    
    print(os.getcwd())
    
    return xml_data

def otp_request_post(data):
    url = f'{base_url}/{version}/{ac}/{uid[0]}/{uid[1]}/{asalk}'
    headers = {'Content-Type':'text/xml'}
    print(url)

    response = requests.post(url, data=data, headers=headers)
    return response.text

def test():
    t = otp_request_xml_data("A", "0")
    # xml_string = ET.tostring(t).decode('utf-8')
    # xml_string = xml_string.replace("\n", "")
    # print(xml_string)
    ti = datetime.now(tz).strftime("%Y-%m-%dT%H:%M:%S")
    print(ti)
    t = t.replace("timestamp", ti)
    t = t.replace("uuid", str(uuid.uuid4()))
    result = otp_request_post(t)
    
    print(result)