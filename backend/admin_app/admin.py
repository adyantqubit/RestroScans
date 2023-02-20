from django.contrib import admin
from .models import *
from django.apps import apps
from tenant_schemas.utils import get_public_schema_name

"""----------------------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To register apps on admin panel and specify what rights public admin(product owner admin) and tenant admin(client) will have.
"""
class TenantAdmin(admin.ModelAdmin):
    def has_view_permission(self, request,view=None) :
        if request.tenant.schema_name == get_public_schema_name():
            return True
        else:
            return False
        
    def has_view_or_change_permission(self, request, view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return True
        else:
            return False    
        
app = apps.get_app_config('admin_app')

for model_name, model in app.models.items():     
    admin.site.register(model,TenantAdmin)  

"""
End of code addition
"""