from django.urls import path

from authentication import views

app_name = 'authentication'

urlpatterns = [
    path('vid/send-otp/', views.SendOTPUsingCaptchaAndUID.as_view(), name='vid-send-otp'),
]
