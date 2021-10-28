from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

class SendRequestToLandlord(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        mobileNumber = request.data.get('mobileNumber', False) 
        # take mobile as input
        if not(mobileNumber):
            return JsonResponse({"status":"not enough data"}, status=400)

        
        # check in database
        
        # create entry in db
        # if exists send notification
        # if not send sms
        
        return JsonResponse({"status": "ok"}, status=200)