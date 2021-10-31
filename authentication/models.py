from django.db import models

class OTP(models.Model):
    txn_id = models.CharField(max_length=200, null=True, blank=True)
    verified = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    verified_timestamp = models.DateTimeField(null=True)