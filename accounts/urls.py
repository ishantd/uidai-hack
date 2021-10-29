from django.urls import path

from accounts import views

app_name = 'accounts'

urlpatterns = [
    path('ekyc/generate-captcha/', views.GenerateCaptchaforEkyc.as_view(), name='ekyc-generate-captcha'),
    path('ekyc/send-otp/', views.SendOTPforEkyc.as_view(), name='ekyc-send-otp'),
    path('ekyc/get-ekyc/', views.GetEKYC.as_view(), name='ekyc-get-data')
    
]