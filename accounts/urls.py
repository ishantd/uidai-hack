from django.urls import path

from accounts import views

app_name = 'accounts'

urlpatterns = [
    path('ekyc/generate-captcha/', views.GenerateCaptchaforEkyc.as_view(), name='ekyc-generate-captcha'),
    
]