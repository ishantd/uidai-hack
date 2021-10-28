from django.urls import path

from address import views

app_name = 'address'

urlpatterns = [
    path('send-request-to-landlord/', views.SendRequestToLandlord.as_view(), name='send-request-to-landlord')
]
