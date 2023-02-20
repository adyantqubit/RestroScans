from django.contrib import admin
from django.urls import path,include,re_path

from django.conf.urls.static import static
from django.conf import settings
"""---------------------------------------------------------------
Commented and modified by - Ashish Dewangan on 08-02-2023
Reason - To specify urls
"""
# urlpatterns = [
#     path('admin/', admin.site.urls),
# ]
urlpatterns = [
    path('admin/', admin.site.urls),
    path('admin_app/',include('admin_app.urls')),
    path('api/v1/',include('tenant_app.urls')),
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
"""
End of code modification
"""