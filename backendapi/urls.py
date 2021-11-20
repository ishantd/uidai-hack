from django.urls import path
from django.contrib import admin
from django.conf import settings
from django.urls.conf import include
from django.conf.urls.static import static
from django.contrib import admin

admin.site.site_header = 'AadhaarMitr Adminsitration'
admin.site.index_title = 'AadhaarMitr Database'
admin.site.site_title = 'AadhaarMitr Admin Panel'


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('authentication.urls')),
    path('api/address/', include('address.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('web/', include('web.urls')),
    path('api/checkin/', include('checkin.urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
