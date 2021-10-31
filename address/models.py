from django.db import models
from django.db.models.signals import post_save
from django.core.validators import RegexValidator

from accounts.models import UserProfile, UserKYC

from datetime import datetime, timedelta

class TenantRequestToLandlord(models.Model):
    phone_regex = RegexValidator(regex=r'^[6-9]\d{9}$', message ="Phone number must be entered in the format: '[6,7,8,9]xxxxxxxxx'. Approx 10 digits allowed.")
    
    request_from = models.ForeignKey(UserProfile, null=True, blank=True, on_delete=models.SET_NULL, related_name='requests_to')
    request_to = models.ForeignKey(UserProfile, null=True, blank=True, on_delete=models.SET_NULL, related_name='requests_from')
    request_to_mobile = models.CharField(validators=[phone_regex], max_length=10)
    
    request_approved = models.BooleanField(default=False)
    request_declined = models.BooleanField(default=False)
    request_completed_by_tenant = models.BooleanField(default=False)

    expired = models.BooleanField(default=False)
    expires_after = models.DateTimeField(null=True)
    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True, blank=True, null=True)
    request_declined_timestamp = models.DateTimeField(blank=True, null=True)
    request_approved_timestamp = models.DateTimeField(blank=True, null=True)
    request_completed_by_tenant_timestamp = models.DateTimeField(blank=True, null=True)
    
    request_modified_address = models.CharField(max_length=500, null=True, blank=True)
    
    kyc = models.ForeignKey(UserKYC, null=True, blank=True, on_delete=models.SET_NULL)
    active = models.BooleanField(default=True)

def create_expiry_for_request(sender, instance, created, **kwargs):
    if created:
        instance.expires_after = instance.created_on + timedelta(days=7)
        instance.save()

post_save.connect(create_expiry_for_request, sender=TenantRequestToLandlord)

class State(models.Model):
    unique_id = models.IntegerField(default=0)
    name = models.CharField(max_length=255, null=True, blank=True)

class District(models.Model):
    unique_id = models.IntegerField(default=0)
    name = models.CharField(max_length=255, null=True, blank=True)
    state = models.ForeignKey(State, on_delete=models.CASCADE, null=True, blank=True)
    active = models.BooleanField(default=False)

class Address(models.Model):
    house = models.TextField(null=True, blank=True)
    street = models.CharField(max_length=255, null=True, blank=True)
    landmark = models.TextField(max_length=255, null=True, blank=True)
    locality = models.CharField(max_length=255, null=True, blank=True)
    subDistrict = models.CharField(max_length=255, null=True, blank=True)
    district = models.CharField(max_length=255, null=True, blank=True)
    postOffice = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=255, null=True, blank=True)
    country = models.CharField(max_length=255, null=True, blank=True)
    pincode = models.CharField(max_length=6, null=True, blank=True)
    
    address_object = models.JSONField(null=True, blank=True)
    
    
    def __str__(self):
        return f'{self.line_1} {self.line_2}'

class UserRentedAddress(models.Model):
    rented_address = models.ForeignKey(Address, null=True, blank=True, on_delete=models.SET_NULL, related_name='rented')
    original_address = models.ForeignKey(Address, null=True, blank=True, on_delete=models.SET_NULL, related_name='original')
    request_id = models.ForeignKey(TenantRequestToLandlord, null=True, blank=True, on_delete=models.SET_NULL)
    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True, blank=True, null=True)