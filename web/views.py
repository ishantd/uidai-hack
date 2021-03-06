from django.http.response import HttpResponse
from django.shortcuts import render
from django.utils.http import urlsafe_base64_decode

from address.models import TenantRequestToLandlord

import pytz
from datetime import datetime

tz = pytz.timezone('Asia/Kolkata')

def address_request(request):
    uidb64 = request.GET.get('uid', False)
    print(uidb64)
    if uidb64:
        uidb64 = uidb64.replace("/", "")
        uid_data = urlsafe_base64_decode(uidb64).decode()
        mobile, pk = uid_data.split('-')
        try:
            request_obj = TenantRequestToLandlord.objects.get(id=pk)
            if request_obj.expires_after < datetime.now(tz):
                request_obj.expired = True
                request_obj.save()
                return HttpResponse("Request Expired")
            context = {"id": pk,"request_from_name": request_obj.request_from.name,
                       "masked_aadhaar":request_obj.request_from.masked_aadhaar,
                       "image": request_obj.request_from.photo.url,
                       "mobile": request_obj.request_from.mobile_number}
        except:
            context = {}
    else:
        context = {}
    return render(request, 'web/request.html', context)

def qr_code(request):
    
    return render(request, 'web/scan_auth.html')