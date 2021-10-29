from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.core.files.base import ContentFile

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token

from accounts.ekyc import EkycOffline
from django.contrib.auth.models import User
from accounts.models import UserKYC, UserProfile
from accounts.new_ekyc import EkycOffline as FastKyc
from address.models import TenantRequestToLandlord, Address, State, District, UserRentedAddress

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

class FastKYCSendOtp(APIView):
    
    def post(self, request, *args, **kwargs):
        uid = request.data.get('uid', False)
        mobileNumber = request.data.get('mobileNumber', False)
        
        ekyc = FastKyc()
        otp_response = ekyc.generate_otp(uid)
        
        if otp_response['status'] == 'y':
            masked_aadhaar = uid[-4:]
            username = f'{mobileNumber}x{masked_aadhaar}'
            user, user_created = User.objects.get_or_create(username=username)
            
            user_profile, user_profile_created = UserProfile.objects.get_or_create(user=user)
            user_profile.mobile_number = mobileNumber
            user_profile.masked_aadhaar = masked_aadhaar
            user_profile.save()
            
            
            return JsonResponse({"status": "okay", "data": otp_response}, status=200)

        if otp_response['status'] == 'n':
            return JsonResponse({"status": "Failed", "data":otp_response}, status =400)
        return JsonResponse({"status": "Unknown Error", "data":otp_response}, status =422)

class FastKYCVerifyOtp(APIView):
    
    def post(self, request, *args, **kwargs):
        uid = request.data.get('uid', False)
        mobileNumber = request.data.get('mobileNumber', False)
        txnId = request.data.get('txnId', False)
        otp = request.data.get('otp', False)
        
        if not (uid and txnId and mobileNumber):
            return JsonResponse({"status": "not enough data"}, status=400)
        
        ekyc = FastKyc()
        otp_response = ekyc.verify_otp(uid, txnId, otp)
        
        if otp_response['status'] == 'y':
            masked_aadhaar = uid[-4:]
            username = f'{mobileNumber}x{masked_aadhaar}'
            user, user_created = User.objects.get_or_create(username=username)
            
            user_token, user_token_created = Token.objects.get_or_create(user=user)
            
            return JsonResponse({"status": "okay", "data": otp_response, "token": user_token.key}, status=200)

        if otp_response['status'] == 'n':
            return JsonResponse({"status": "Failed", "data":otp_response}, status =400)
        return JsonResponse({"status": "Unknown Error", "data":otp_response}, status =422)

class FastKYCEKyc(APIView):
    
    def post(self, request, *args, **kwargs):
        uid = request.data.get('uid', False)
        mobileNumber = request.data.get('mobileNumber', False)
        txnId = request.data.get('txnId', False)
        otp = request.data.get('otp', False)
        
        if not (uid and txnId and mobileNumber and otp):
            return JsonResponse({"status": "not enough data"}, status=400)
        
        ekyc = FastKyc()
        otp_response = ekyc.get_ekyc(uid, txnId, otp)
        
        if otp_response['status'] == 'y':
            masked_aadhaar = uid[-4:]
            username = f'{mobileNumber}x{masked_aadhaar}'
            user, user_created = User.objects.get_or_create(username=username)
            
            user_token, user_token_created = Token.objects.get_or_create(user=user)
            
            return JsonResponse({"status": "okay", "data": otp_response, "token": user_token.key}, status=200)

        if otp_response['errCode']:
            return JsonResponse({"status": "Failed", "data":otp_response}, status =400)
        return JsonResponse({"status": "Unknown Error", "data":otp_response}, status =422)

class AddressActions(APIView):
        
    def post(self, request, *args, **kwargs):
        request_id = request.data.get('request_id', False)
        address_data = request.data.get('address_data', False)
        
        request_obj = TenantRequestToLandlord.objects.get(id=request_id)
        
        user_rented_address = UserRentedAddress.objects.get(request_id=request_obj)

        temp_add = Address.objects.create(address_object=address_data)
        user_rented_address.rented_address = temp_add
        user_rented_address.save()

        return JsonResponse({"status": "success", "user_rented_address": model_to_dict(user_rented_address)}, status=200)