from django.contrib import admin
from django.urls import path
from django.urls.conf import include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('authentication.urls')),
    path('api/address/', include('address.urls')),
    path('api/accounts/', include('accounts.urls'))
]
