from django.http.response import HttpResponse
from django.shortcuts import render
from django.utils.http import urlsafe_base64_decode

from address.models import TenantRequestToLandlord

import pytz
from datetime import datetime

tz = pytz.timezone('Asia/Kolkata')

def address_request(request, uidb64):
    uid_data = urlsafe_base64_decode(uidb64).decode()
    mobile, pk = uid_data.split('-')
    request_obj = TenantRequestToLandlord.objects.get(id=pk)
    if request_obj.expires_after < datetime.now(tz):
        request_obj.expired = True
        request_obj.save()
        return HttpResponse("Request Expired")
    context = {"id": pk,"request_from_name": request_obj.request_from.name, "masked_aadhaar":request_obj.request_from.masked_aadhaar, "image": request_obj.request_from.photo.url}
    print(context)
    return render(request, 'web/request.html', context)

def qr_code(request):
    
    return render(request, 'web/scan_auth.html')