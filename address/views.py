from django.contrib.auth.models import User
from django.http import JsonResponse
from django.forms import model_to_dict

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from accounts.models import UserProfile
from address.models import TenantRequestToLandlord

from datetime import datetime


class RequestToLandlord(APIView):
    permission_classes = [AllowAny]
    
    # Use otp on web to check for requests
    
    # Use token on mobile app to check for requests
    
    def get(self, request, *args, **kwargs):
        platform = request.query_params.get('platform', False)
        
        if platform == 'mobile':
            user = request.user
            
        requests_sent = list(TenantRequestToLandlord.objects.filter(request_from=user.profile).values())
        requests_recieved = list(TenantRequestToLandlord.objects.filter(request_to=user.profile).values())
        
        return JsonResponse({"status": "ok", "data": {
            "requests_sent": requests_sent, "requests_recieved": requests_recieved}}, status=200)
    
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
        tenant_request = TenantRequestToLandlord.objects.get_or_create(
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
        requestStatus = True if request.data.get('requestStatus', False) == 'Confirmed' else False
        # take as input
        if not(requestId and requestStatus):
            return JsonResponse({"status":"not enough data"}, status=400)

        
        # create entry in db
        tenant_request = TenantRequestToLandlord.objects.get(id=requestId)
        tenant_request.request_approved = requestStatus
        tenant_request.request_approved_timestamp = datetime.now()
        tenant_request.save()


        if requestStatus == 'Confirmed':
            return JsonResponse({"status": "Request Confirmed"}, status=200)

        if requestStatus == 'Declined':
            return JsonResponse({"status": "Request Declined"}, status=200)

        return JsonResponse({"status": "ok", "data": model_to_dict(tenant_request)}, status=200)