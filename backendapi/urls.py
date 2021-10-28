from django.contrib import admin
from django.urls import path
from django.urls.conf import include

import authentication

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('authentication.urls')),
    path('api/address/', include('address.urls'))
]
