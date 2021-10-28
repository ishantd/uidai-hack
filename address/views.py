from django.contrib.auth.models import User
from django.http import JsonResponse
from django.forms import model_to_dict

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from accounts.models import UserProfile
from address.models import TenantRequestToLandlord


class SendRequestToLandlord(APIView):
    permission_classes = [AllowAny]
    
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