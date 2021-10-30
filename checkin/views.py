from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from django.forms import model_to_dict
from django.http import JsonResponse
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from accounts.models import UserProfile
from checkin.models import MatchFace
from checkin.utils import compare_faces_for_checkin

import base64
import os

class MatchFaces(APIView):
    
    def post(self, request, *args, **kwargs):
        user = request.user
        
        image = request.data.get('image_b64', False)
        target_image_bytes = image.encode('ascii')
        if not image:
            return JsonResponse({"status": "Please send image"}, status=400)
        
        user_profile = UserProfile.objects.get(user=user)
        user_profile_image = user_profile.photo.url
        
        with open(os.path.join(settings.BASE_DIR, user_profile_image), "rb") as image_file:
            source_image_bytes = base64.b64encode(image_file.read())
        input_image_file = ContentFile(base64.b64decode(image), name=f'{user.username}.jpg')
        match_face_obj = MatchFace.objects.create(user=user, recorded_image=input_image_file)
        face_result = compare_faces_for_checkin(target_image_bytes, source_image_bytes)
        
        if face_result:
            return JsonResponse({"status": "success"}, status=200)
        return JsonResponse({"status": "not match"}, status=400)

class GenerateEncryptedQRCode(APIView):
    
    def post(self, request, *args, **kwargs):
        
        user = request.user
        
        return JsonResponse({"status": "success"}, status=200)