from django.contrib import admin
from accounts.models import *

admin.site.register(UserProfile)
admin.site.register(UserKYC)
admin.site.register(UserDevice)