from django.conf import settings
from django.http import JsonResponse
from django.forms import model_to_dict
from django.contrib.auth.models import User
from django.contrib.sites.shortcuts import get_current_site

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from accounts.utils import trigger_single_notification, xml_to_dict
from accounts.models import UserDevice, UserProfile
from address.utils import create_request_sms, send_message_using_sns
from address.models import Address, TenantRequestToLandlord, UserRentedAddress

import os
import json
import pytz
from zipfile import ZipFile
from datetime import datetime

tz = pytz.timezone('Asia/Kolkata')


class RequestToLandlord(APIView):
    permission_classes = [AllowAny]
    
    # Use otp on web to check for requests
    
    # Use token on mobile app to check for requests
    
    def get(self, request, *args, **kwargs):
        platform = request.query_params.get('platform', False)
        
        if platform == 'mobile':
            user = request.user
            
        requests_sent = TenantRequestToLandlord.objects.filter(request_from=user.profile, request_declined=False, active=True)
        requests_recieved = TenantRequestToLandlord.objects.filter(request_to=user.profile, request_declined=False, active=True)
        
        requests_sent_data = []
        requests_recieved_data = []
        
        for r in requests_sent:
            data = {
                "id": r.id,
                "name": r.request_to.name if r.request_to else None,
                "photo": r.request_to.photo.url if r.request_to else None,
                "phone": r.request_to_mobile,
                "created_on": r.created_on,
                "last_updated": r.last_updated,
                "request_approved": r.request_approved,
                "request_declined": r.request_declined,
                "request_completed_by_tenant": r.request_completed_by_tenant
            }
            requests_sent_data.append(data)
            
        for r in requests_recieved:
            data = {
                "id": r.id,
                "name": r.request_from.name if r.request_to else None,
                "photo": r.request_from.photo.url if r.request_to else None,
                "phone": r.request_from.mobile_number,
                "created_on": r.created_on,
                "request_declined": r.request_declined,
                "last_updated": r.last_updated,
                "request_approved": r.request_approved,
                "request_completed_by_tenant": r.request_completed_by_tenant
            }
            requests_recieved_data.append(data)
        
        return JsonResponse({"status": "ok", "data": {
            "requests_sent": requests_sent_data, "requests_recieved": requests_recieved_data}}, status=200)
    
    def post(self, request, *args, **kwargs):
        mobileNumber = request.data.get('mobileNumber', False) 
        # take mobile as input
        if not(mobileNumber):
            return JsonResponse({"status":"not enough data"}, status=400)

        # check in database
        try:
            user = UserProfile.objects.get(mobile_number=mobileNumber)
        except:
            user = None
        
        # create entry in db
        tenant_request = TenantRequestToLandlord.objects.create(
            request_from=request.user.profile,
            request_to=user,
            request_to_mobile=mobileNumber
        )
        
        # if exists send notification - pending
        # if not send sms - pending
        if user == None:
            current_site = get_current_site(request)
            request_sms = create_request_sms(tenant_request.request_from.name, mobileNumber, tenant_request.id, current_site, tenant_request.expires_after)
            send_sms = send_message_using_sns(mobileNumber, request_sms)
        
        if user:
            user_device = UserDevice.objects.filter(user=user.user).last()
            current_site = get_current_site(request)
            request_sms = create_request_sms(tenant_request.request_from.name, mobileNumber, tenant_request.id, current_site, tenant_request.expires_after)
            send_sms = send_message_using_sns(mobileNumber, request_sms)
            print(user_device)
            try:
                t = trigger_single_notification(user_device.arn, "Request Received", f'{tenant_request.request_from.name} has sent you a request for address approval. Please respond.')
            except:
                print("HE")
        return JsonResponse({"status": "ok", "data": model_to_dict(tenant_request)}, status=200)

class ChangeAddressRequestStatus(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        requestId = request.data.get('requestId', False) 
        requestStatus = request.data.get('requestStatus', False)
        # take as input
        if not(requestId and requestStatus):
            return JsonResponse({"status":"not enough data"}, status=400)

        # create entry in db
        tenant_request = TenantRequestToLandlord.objects.get(id=requestId)
        if requestStatus and requestStatus == 'accept':
            tenant_request.request_approved = True
            tenant_request.request_approved_timestamp = datetime.now(tz)
            user_device = UserDevice.objects.filter(user=tenant_request.request_from.user).last()
            trigger_single_notification(user_device.arn, "Request Approved", f'{tenant_request.request_to.name if tenant_request.request_to else "User"} has approved your request for address share. Please verify.')
        elif requestStatus and requestStatus == 'decline':
            tenant_request.request_declined = True
            tenant_request.request_declined_timestamp = datetime.now(tz)
            user_device = UserDevice.objects.filter(user=tenant_request.request_from.user).last()
            if user_device:
                trigger_single_notification(user_device.arn, "Request Declined", f'{tenant_request.request_to.name if tenant_request.request_to else "User"} has declined your request for address share')
        
        tenant_request.save()

        return JsonResponse({"status": "ok", "data": model_to_dict(tenant_request)}, status=200)

class EnterPincodeAndGetAddress(APIView):
    
    def post(self, request, *args, **kwargs):
        code = request.data.get('code', False)
        request_id = request.data.get('requestId', False)
        
        tenant_request = TenantRequestToLandlord.objects.get(id=request_id)
        
        user_kyc = tenant_request.kyc
        zip_file_url = user_kyc.datafile
        if zip_file_url:
            zip_file_url = zip_file_url.path
            with ZipFile(zip_file_url) as zf:
                zf.extractall(pwd=bytes(code, 'utf-8'))
            xml_filename = user_kyc.file_name.replace('zip', 'xml')
            with open(xml_filename, 'r') as f:
                xml_string_data = f.read()
            xml_data_dict = xml_to_dict(xml_string_data)
            uid_data = xml_data_dict["OfflinePaperlessKyc"]["UidData"]
            poa_data = uid_data["Poa"]
            if os.path.exists(xml_filename):
                os.remove(xml_filename)
        else:
            xml_string_data = user_kyc.xml_raw_data
            xml_data_dict = xml_to_dict(xml_string_data)
            uid_data = xml_data_dict["KycRes"]["UidData"]
            poa_data = uid_data["Poa"]
        
        original_address, original_address_created = Address.objects.get_or_create(address_object=poa_data)
        
        user_rented_address, user_rented_address_created = UserRentedAddress.objects.get_or_create(
            request_id=tenant_request
        )
        
        user_rented_address.original_address = original_address
        user_rented_address.save()
        
        return JsonResponse({"status": "success", "data": poa_data}, status=200)

class CancelRequest(APIView):

    def post(self, request, *args, **kwargs):
        requestId = request.data.get('requestId', False)

        if not(requestId):
            return JsonResponse({"status":"not enough data"}, status=400)
        
        tenant_request = TenantRequestToLandlord.objects.get(id=requestId)
        tenant_request.active = False
        tenant_request.save()     
                    
        return JsonResponse({"status": "success: request deleted"}, status=200)


class RequestApprovedAndSaveAddress(APIView):

    def post(self, request, *args, **kwargs):

        requestId = request.data.get('requestId', False)
        addressData = request.data.get('addressData', False)

        if not(requestId):
            return JsonResponse({"status":"not enough data"}, status=400)

        tenant_request = TenantRequestToLandlord.objects.get(id=requestId)

        tenant_request.request_completed_by_tenant = True
        tenant_request.request_completed_by_tenant_timestamp = datetime.now(tz)
        tenant_request.save()
        
        new_address_obj = Address.objects.create(address_object=addressData)
        user_rented_address = UserRentedAddress.objects.get(request_id=requestId)
        user_rented_address.rented_address = new_address_obj
        user_rented_address.save()
        
        if tenant_request.request_to:
            user_device = UserDevice.objects.filter(user=tenant_request.request_to.user).last()
            if user_device:
                trigger_single_notification(user_device.arn, "Address Share Completed", f'{tenant_request.request_from.name} has completed the procedure for address share')
        
        return JsonResponse({"status": "success: request "}, status=200)
