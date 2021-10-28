from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from authentication.otp import VIDWrapperAPI


class GenerateCaptcha(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        
        vid = VIDWrapperAPI()
        data_from_api = vid.generate_captcha()
        
        if data_from_api['status'] == 'Success':
            return JsonResponse({"status": "okay", "data": data_from_api}, status=200)

        if data_from_api['status'] == 'Failed':
            return JsonResponse({"status": "Failed", "data": data_from_api}, status = data_from_api['ErrorCode'])
        
        return JsonResponse({"status": "unknow error"}, status=422)

class SendOTPUsingCaptchaAndUID(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        uid = request.data.get('uid', False)
        captchaTxnId = request.data.get('captchaTxnId', False) 
        captchaValue = request.data.get('captchaValue', False)
        
        if not (uid and captchaTxnId and captchaValue):
            return JsonResponse({"status": "not enough data"}, status=400)
        
        
        vid = VIDWrapperAPI()
        
        data_from_api = vid.send_otp(uid, captchaTxnId, captchaValue)
        
        if data_from_api['status'] == 'Failed':
            return JsonResponse({"status": "Failed", "data": data_from_api}, status = data_from_api['ErrorCode'])
        
        if data_from_api['status'] == 'Success':
            return JsonResponse({"status": "okay", "data": data_from_api}, status=200)

        
        
        return JsonResponse({"status": "unknown error"}, status=422)


class GenerateVID(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        uid = request.data.get('uid', False)
        mobileNumber = request.data.get('mobileNumber', False) 
        txnId = request.data.get('txnId', False)
        otp = request.data.get('otp', False)
        
        if not (uid and mobileNumber and txnId and otp):
            return JsonResponse({"status": "not enough data"}, status=400)
        
        
        vid = VIDWrapperAPI()
        
        data_from_api = vid.generate_vid(uid, mobileNumber, otp, txnId)
        
        if data_from_api['status'] == 'Success':
            return JsonResponse({"status": "okay", "data": data_from_api}, status=200)

        if data_from_api['status'] == 'Failed':
            return JsonResponse({"status": "Failed", "data": data_from_api}, status = data_from_api['ErrorCode'])
        
        return JsonResponse({"status": "unknow error"}, status=422)

class RetrieveVID(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        uid = request.data.get('uid', False)
        mobileNumber = request.data.get('mobileNumber', False) 
        txnId = request.data.get('txnId', False)
        otp = request.data.get('otp', False)
        
        if not (uid and mobileNumber and txnId and otp):
            return JsonResponse({"status": "not enough data"}, status=400)
        
        
        vid = VIDWrapperAPI()
        
        data_from_api = vid.retrieve_vid(uid, mobileNumber, otp, txnId)
        
        if data_from_api['status'] == 'Success':
            return JsonResponse({"status": "okay", "data": data_from_api}, status=200)

        if data_from_api['status'] == 'Failed':
            return JsonResponse({"status": "Failed", "data": data_from_api}, status = data_from_api['ErrorCode'])
        
        return JsonResponse({"status": "unknow error"}, status=422)
        