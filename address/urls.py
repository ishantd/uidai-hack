from django.urls import path

from address import views

app_name = 'address'

urlpatterns = [
    path('send-request-to-landlord/', views.RequestToLandlord.as_view(), name='send-request-to-landlord'),
    path('landlord-approves-request/', views.ChangeAddressRequestStatus.as_view(), name='landlord-approves-request'),
    path('cancel-request/', views.CancelRequest.as_view(), name='cancel-request'),
    path('enter-passcode-and-get-address/', views.EnterPincodeAndGetAddress.as_view(), name='enter-passcode-and-get-address')
]
