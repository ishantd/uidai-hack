from django.urls import path

from address import views

app_name = 'address'

urlpatterns = [
    path('send-request-to-landlord/', views.RequestToLandlord.as_view(), name='send-request-to-landlord')
]
