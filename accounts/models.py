from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.core.validators import RegexValidator


    
class UserProfile(models.Model):
    phone_regex = RegexValidator(regex=r'^[6-9]\d{9}$', message ="Phone number must be entered in the format: '[6,7,8,9]xxxxxxxxx'. Approx 10 digits allowed.")
    
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE, related_name='profile')
    mobile_number = models.CharField(validators=[phone_regex], max_length=10)
    masked_aadhaar = models.CharField(max_length=4, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True, blank=True, null=True)
    def __str__(self):
            return self.user.username

class UserVID(models.Model):
    profile = models.ForeignKey(UserProfile, null=True, blank=True, on_delete=models.SET_NULL)
    vid = models.CharField(max_length=16, null=True, blank=True)
    txnId = models.CharField(max_length=50, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True, blank=True, null=True)


class UserKYC(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='kyc')
    file_name = models.CharField(max_length=500, null=True, blank=True)
    xml_file = models.FileField(upload_to='kyc/', null=True, blank=True)
    xml_raw_data = models.TextField(null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True, blank=True, null=True)