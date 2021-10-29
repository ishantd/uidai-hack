from django.db import models
from django.core.validators import RegexValidator

from accounts.models import UserProfile, UserKYC

class TenantRequestToLandlord(models.Model):
    phone_regex = RegexValidator(regex=r'^[6-9]\d{9}$', message ="Phone number must be entered in the format: '[6,7,8,9]xxxxxxxxx'. Approx 10 digits allowed.")
    
    request_from = models.ForeignKey(UserProfile, null=True, blank=True, on_delete=models.SET_NULL, related_name='requests_to')
    request_to = models.ForeignKey(UserProfile, null=True, blank=True, on_delete=models.SET_NULL, related_name='requests_from')
    request_to_mobile = models.CharField(validators=[phone_regex], max_length=10)
    
    request_approved = models.BooleanField(default=False)
    request_completed_by_tenant = models.BooleanField(default=False)

    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True, blank=True, null=True)
    request_approved_timestamp = models.DateTimeField(blank=True, null=True)
    
    request_modified_address = models.CharField(max_length=500, null=True, blank=True)
    
    kyc = models.ForeignKey(UserKYC, null=True, blank=True, on_delete=models.SET_NULL) 


class State(models.Model):
    unique_id = models.IntegerField(default=0)
    name = models.CharField(max_length=255, null=True, blank=True)

class District(models.Model):
    unique_id = models.IntegerField(default=0)
    name = models.CharField(max_length=255, null=True, blank=True)
    state = models.ForeignKey(State, on_delete=models.CASCADE, null=True, blank=True)
    active = models.BooleanField(default=False)

class Address(models.Model):
    line_1 = models.TextField(null=True, blank=True)
    line_2 = models.TextField(null=True, blank=True)
    locality = models.CharField(max_length=255, null=True, blank=True)
    pincode = models.CharField(max_length=6, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=255, null=True, blank=True)
    country = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return f'{self.line_1} {self.line_2}'

class UserRentedAddress(models.Model):
    address = models.ForeignKey(Address, null=True, blank=True, on_delete=models.SET_NULL)
    request_id = models.ForeignKey(TenantRequestToLandlord, null=True, blank=True, on_delete=models.SET_NULL)
    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True, blank=True, null=True)