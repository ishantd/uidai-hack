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
from accounts.utils import xml_to_dict
from address.models import TenantRequestToLandlord, Address, State, District, UserRentedAddress

from datetime import datetime
import base64
import json
import uuid


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
            user_kyc, user_kyc_created = UserKYC.objects.get_or_create(
                user=request.user,
                file_name=data_from_api["fileName"],
                datafile=b64_file
            )
            
            # save file to either localstorage or s3
            request_obj = TenantRequestToLandlord.objects.get(id=request_id)
            request_obj.request_approved_timestamp = datetime.now()
            request_obj.request_approved = True
            request_obj.kyc = user_kyc
            request_obj.save()
            # record ekyc transaction and file location
     
            
            return JsonResponse({"status": "okay"}, status=200)

        if data_from_api['status'] == 'Failed':
            return JsonResponse({"status": "Failed", "data": data_from_api}, status = data_from_api['ErrorCode'])
        
        return JsonResponse({"status": "unknown error"}, status=422)

class FastKYCSendOtp(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        uid = request.data.get('uid', False)
        
        ekyc = FastKyc()
        txnId = str(uuid.uuid4())
        otp_response = ekyc.generate_otp(uid, txnId)
        
        if otp_response['status'] == 'y' or 'Y':           
            return JsonResponse({"status": "okay", "data": otp_response, "txnId": txnId}, status=200)

        if otp_response['status'] == 'n' or 'N':
            return JsonResponse({"status": "Failed", "data":otp_response, "txnId": txnId}, status =400)
        return JsonResponse({"status": "Unknown Error", "data":otp_response, "txnId": txnId}, status =422)

class FastKYCVerifyOtp(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        uid = request.data.get('uid', False)
        mobileNumber = request.data.get('mobileNumber', False)
        txnId = request.data.get('txnId', False)
        otp = request.data.get('otp', False)
        
        if not (uid and txnId and mobileNumber):
            return JsonResponse({"status": "not enough data"}, status=400)
        
        ekyc = FastKyc()
        otp_response = ekyc.verify_otp(uid, txnId, otp)
        
        if otp_response['status'] == 'y' or 'Y':
            masked_aadhaar = uid[-4:]
            username = f'{mobileNumber}x{masked_aadhaar}'
            user, user_created = User.objects.get_or_create(username=username)
            
            user_token, user_token_created = Token.objects.get_or_create(user=user)
            
            return JsonResponse({"status": "okay", "data": otp_response, "token": user_token.key}, status=200)

        if otp_response['status'] == 'n' or 'N':
            return JsonResponse({"status": "Failed", "data":otp_response}, status =400)
        return JsonResponse({"status": "Unknown Error", "data":otp_response}, status =422)

class FastKYCEKyc(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        uid = request.data.get('uid', False)
        txnId = request.data.get('txnId', False)
        otp = request.data.get('otp', False)
        
        if not (uid and txnId and otp):
            return JsonResponse({"status": "not enough data"}, status=400)
        
        ekyc = FastKyc()
        otp_response = ekyc.get_ekyc(uid, txnId, otp)
        
        if otp_response['status'] == 'y' or otp_response['status'] == 'Y':
                      
            
            xml_data_dict = xml_to_dict(otp_response["eKycString"])
            
            uid_data = xml_data_dict["KycRes"]["UidData"]
            poi_data = uid_data["Poi"]
            photo_b64_string = uid_data["Pht"]
            
            name = poi_data["@name"]
            phone = poi_data["@phone"]
            
            
            masked_aadhaar = uid[-4:]
            username = f'{phone}x{masked_aadhaar}'
            image_data = ContentFile(base64.b64decode(photo_b64_string), name=f'{username}.jpg')
            user, user_created = User.objects.get_or_create(username=username)
            if user_created:
                user_profile, user_profile_created = UserProfile.objects.get_or_create(user=user, name=name, mobile_number=phone, masked_aadhaar=masked_aadhaar, photo=image_data)
                requests = TenantRequestToLandlord.objects.filter(request_to_mobile=phone).update(request_to=user_profile)
            else:
                user_profile = UserProfile.objects.get(user=user)
            user_token, user_token_created = Token.objects.get_or_create(user=user)
            kyc, kyc_created = UserKYC.objects.get_or_create(user=user, xml_raw_data=otp_response["eKycString"])

            return JsonResponse({"status": "okay", "token": user_token.key}, status=200)

        if otp_response['errCode']:
            return JsonResponse({"status": "Failed", "data":otp_response}, status=400)
        return JsonResponse({"status": "Unknown Error", "data":otp_response}, status=422)

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

class UserProfileCRUD(APIView):
    
    def get(self, request, *args, **kwargs):
        user = request.user
        
        user_profile = UserProfile.objects.get(user=user)
        user_data = {
            "name": user_profile.name,
            "mobile_number": user_profile.mobile_number,
            "masked_aadhaar": user_profile.masked_aadhaar,
            "img_url": user_profile.photo.url
        }
        
        return JsonResponse({"status": "okay", "profile_data": user_data}, status=200)