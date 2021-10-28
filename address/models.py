from django.db import models
from django.core.validators import RegexValidator

from accounts.models import UserProfile

class TenantRequestToLandlord(models.Model):
    phone_regex = RegexValidator(regex=r'^[6-9]\d{9}$', message ="Phone number must be entered in the format: '[6,7,8,9]xxxxxxxxx'. Approx 10 digits allowed.")
    
    request_from = models.ForeignKey(UserProfile, null=True, blank=True, on_delete=models.SET_NULL, related_name='requests_to')
    request_to = models.ForeignKey(UserProfile, null=True, blank=True, on_delete=models.SET_NULL, related_name='requests_from')
    request_to_mobile = models.CharField(validators=[phone_regex], max_length=10)
    
    request_approved = models.BooleanField(default=True)

    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True, blank=True, null=True)
    request_approved_timestamp = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    
    request_modified_address = models.CharField(max_length=500, null=True, blank=True)
    