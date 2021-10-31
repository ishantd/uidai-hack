from django.urls import path

from accounts import views

app_name = 'accounts'

urlpatterns = [
    path('ekyc/generate-captcha/', views.GenerateCaptchaforEkyc.as_view(), name='ekyc-generate-captcha'),
    path('ekyc/send-otp/', views.SendOTPforEkyc.as_view(), name='ekyc-send-otp'),
    path('ekyc/get-ekyc/', views.GetEKYC.as_view(), name='ekyc-get-data'),
    path('new-ekyc/send-otp/', views.FastKYCSendOtp.as_view(), name='newekyc-send-otp'),
    path('new-ekyc/verify-otp/', views.FastKYCVerifyOtp.as_view(), name='newekyc-verify-otp'),
    path('new-ekyc/get-ekyc/', views.FastKYCEKyc.as_view(), name='newekyc-getekyc'),
    path('profile/', views.UserProfileCRUD.as_view(), name='user-profile'),
    path('linked/', views.LinkedAccounts.as_view(), name='linked-accounts')
]