from django.urls import path

from authentication import views

app_name = 'authentication'

urlpatterns = [
    path('vid/generate-captcha/', views.GenerateCaptcha.as_view(), name='vid-generate-captcha'),
    path('vid/send-otp/', views.SendOTPUsingCaptchaAndUID.as_view(), name='vid-send-otp'),
    path('vid/generate/', views.GenerateVID.as_view(), name='vid-generate'),
    path('vid/retrieve/', views.RetrieveVID.as_view(), name='vid-retrieve'),
]
