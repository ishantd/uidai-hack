from django.db import models
from django.contrib.auth.models import User

class MatchFace(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='faces_request')
    recorded_image = models.ImageField(upload_to='mf/', null=True, blank=True)
    accuracy = models.FloatField(null=True, blank=True)
    passed = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True, blank=True, null=True)

class EncryptedQRCode(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='qr')
    image = models.ImageField(upload_to='qr/', null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True, blank=True, null=True)

