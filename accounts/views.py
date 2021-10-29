from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.core.files.base import ContentFile

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from accounts.ekyc import EkycOffline
from accounts.models import UserKYC
from address.models import TenantRequestToLandlord

import datetime
import base64


class GenerateCaptchaforEkyc(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        
        ekyc = EkycOffline()
        data_from_api = ekyc.generate_captcha()
        
        if data_from_api['status'] == 'Success':
            return JsonResponse({"status": "okay", "data": data_from_api}, status=200)

        if data_from_api['status'] == 'Failed':
            return JsonResponse({"status": "Failed", "data": data_from_api}, status = data_from_api['ErrorCode'])
        
        return JsonResponse({"status": "unknow error"}, status=422)


class SendOTPforEkyc(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        uid = request.data.get('uid', False)
        captchaTxnId = request.data.get('captchaTxnId', False) 
        captchaValue = request.data.get('captchaValue', False)
        
        if not (uid and captchaTxnId and captchaValue):
            return JsonResponse({"status": "not enough data"}, status=400)
        
        
        ekyc = EkycOffline()
        
        data_from_api = ekyc.generate_otp(uid, captchaTxnId, captchaValue)
        
        if data_from_api['status'] == 'Failed':
            return JsonResponse({"status": "Failed", "data": data_from_api}, status = data_from_api['ErrorCode'])
        
        if data_from_api['status'] == 'Success':
            return JsonResponse({"status": "okay", "data": data_from_api}, status=200)

        
        
        return JsonResponse({"status": "unknown error"}, status=422)



class GetEKYC(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        request_id = request.data.get('request_id', False)
        uid = request.data.get('uid', False) 
        otp = request.data.get('otp', False)
        txnId = request.data.get('txnId', False)
        share_code = request.data.get('shareCode', False)
        
        if not (uid and txnId and otp and share_code):
            return JsonResponse({"status": "not enough data"}, status=400)
        
        
        ekyc = EkycOffline()
        
        data_from_api = ekyc.get_ekyc(uid, otp, txnId, share_code)
        
        if data_from_api['status'] == 'Success':
            #b64 data to file object
            b64_string = data_from_api['eKycXML']
            b64_file = ContentFile(base64.b64decode(b64_string), name=data_from_api["fileName"])
            
            # save file to either localstorage or s3
            request_obj = TenantRequestToLandlord.objects.get(id=request_id)
            request_obj.request_approved_timestamp = datetime.now()
            request_obj.request_approved = True
            request_obj.save()
            # record ekyc transaction and file location
            
            user_kyc, user_kyc_created = UserKYC.objects.get_or_create(
                filename=data_from_api["fileName"],
                xml_file=b64_file
            )                  
            
            return JsonResponse({"status": "okay", "data": data_from_api, "user_kyc": model_to_dict(user_kyc)}, status=200)

        if data_from_api['status'] == 'Failed':
            return JsonResponse({"status": "Failed", "data": data_from_api}, status = data_from_api['ErrorCode'])
        
        return JsonResponse({"status": "unknown error"}, status=422)


class ChangeAddress(APIView):
    
    def post(self, request, *args, **kwargs):
        
        return JsonResponse({""})