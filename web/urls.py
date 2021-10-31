from django.urls import path

from web import views

app_name = 'web'

urlpatterns = [
    path('address-request/<uidb64>/', views.address_request, name='address-request'),
    path('check-in-user/', views.qr_code, name='check-in')
]
