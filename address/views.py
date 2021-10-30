from django.conf import settings
from django.http import JsonResponse
from django.forms import model_to_dict
from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from accounts.models import UserProfile
from accounts.utils import xml_to_dict
from address.models import Address, TenantRequestToLandlord, UserRentedAddress

from zipfile import ZipFile
from datetime import datetime
import os


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
        tenant_request, tenant_request_created = TenantRequestToLandlord.objects.get_or_create(
            request_from=request.user.profile,
            request_to=user,
            request_to_mobile=mobileNumber
        )
        
        # if exists send notification - pending
        # if not send sms - pending
        
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
            tenant_request.request_approved_timestamp = datetime.now()
        elif requestStatus and requestStatus == 'decline':
            tenant_request.request_declined = True
            tenant_request.request_declined_timestamp = datetime.now()
        tenant_request.save()

        return JsonResponse({"status": "ok", "data": model_to_dict(tenant_request)}, status=200)

class EnterPincodeAndGetAddress(APIView):
    
    def post(self, request, *args, **kwargs):
        code = request.data.get('code', False)
        request_id = request.data.get('requestId', False)
        
        tenant_request = TenantRequestToLandlord.objects.get(id=request_id)
        
        user_kyc = tenant_request.kyc
        zip_file_url = user_kyc.datafile.path
        with ZipFile(zip_file_url) as zf:
            zf.extractall(pwd=bytes(code, 'utf-8'))
        xml_filename = user_kyc.file_name.replace('zip', 'xml')
        with open(xml_filename, 'r') as f:
            xml_string_data = f.read()
        
        xml_data_dict = xml_to_dict(xml_string_data)
        uid_data = xml_data_dict["OfflinePaperlessKyc"]["UidData"]
        poa_data = uid_data["Poa"]
        
        original_address, original_address_created = Address.objects.get_or_create(address_object=poa_data)
        
        user_rented_address, user_rented_address_created = UserRentedAddress.objects.get_or_create(
            request_id=tenant_request
        )
        
        user_rented_address.original_address = original_address
        user_rented_address.save()

        if os.path.exists(xml_filename):
            os.remove(xml_filename)
        
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
        tenant_request.request_completed_by_tenant_timestamp = datetime.now()
        tenant_request.save()
        
        new_address_obj = Address.objects.create(address_object=addressData)
        user_rented_address = UserRentedAddress.objects.get(request_id=requestId)
        user_rented_address.rented_address = new_address_obj
        user_rented_address.save()
        
        return JsonResponse({"status": "success: request "}, status=200)
