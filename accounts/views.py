from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from accounts.ekyc import EkycOffline


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



