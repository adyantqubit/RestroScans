from django.contrib import admin
from .models import *
from django.apps import apps
from tenant_schemas.utils import get_public_schema_name

"""----------------------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To register apps on admin panel and specify what rights public admin(product owner admin) and tenant admin(client) will have.
"""
# class TenantAdmin(admin.ModelAdmin):
#     def has_view_permission(self, request,view=None) :
#         if request.tenant.schema_name == get_public_schema_name():
#             return True
#         else:
#             return False
        
#     def has_view_or_change_permission(self, request, view=None):
#         if request.tenant.schema_name == get_public_schema_name():
#             return True
#         else:
#             return False    
        
# app = apps.get_app_config('admin_app')

# for model_name, model in app.models.items():     
#     admin.site.register(model,TenantAdmin) 

@admin.register(AppSetting)
class AppSettingAdmin(admin.ModelAdmin):
    list_display=("id","app_logo","adyant_logo","title","bottom_text","adyant_webite_link")
    # readonly_fields=("item","user_no")
    # ordering=("title",)
    search_fields=("title","id")
    list_per_page=10
    def has_add_permission(self, request):
        count = AppSetting.objects.count()
        if count>0:
            return False
        else:
            return True
    def has_change_permission(self, request, obj=None) :
        return True    
    def has_delete_permission(self, request, obj=None) :
        return True   
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return True
        else:
            return False
        
        
@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display=("id","restaurant_name","tenant_name","created_at")
    # readonly_fields=("item","user_no")
    # ordering=("title",)
    search_fields=("restaurant_name","id","tenant_name")
    list_per_page=10
    def has_change_permission(self, request, obj=None) :
        return True    
    def has_delete_permission(self, request, obj=None) :
        return False  
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return True
        else:
            return False
    # Added by Yuvraj sahu on 31-3-2023
    # Reason - to design form
    def get_form(self, request, obj=None, **kwargs):
        form = super(TenantAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['restaurant_name'].widget.attrs['style'] = 'width: 20em;'
        return form
    # End of addition

        
@admin.register(Otp)
class OtpAdmin(admin.ModelAdmin):
    list_display=("id","otp")
    # readonly_fields=("item","user_no")
    # ordering=("title",)
    search_fields=("tenant_name", "restaurant_name","id")
    list_per_page=10
    def has_change_permission(self, request, obj=None) :
        return True    
    def has_delete_permission(self, request, obj=None) :
        return True   
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return True
        else:
            return False 
        
@admin.register(RestaurantRequest)
class RestaurantRequestAdmin(admin.ModelAdmin):
    list_display=("id","restaurant_name", "owner_name", "mobile_number", "address", "created_at", "is_active")
    # readonly_fields=("item","user_no")
    # ordering=("title",)
    search_fields=("restaurant_name","id","owner_name", "created_at")
    list_per_page=10
    def has_change_permission(self, request, obj=None) :
        return True    
    def has_delete_permission(self, request, obj=None) :
        return False   
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return True
        else:
            return False 
        
# Added by Om on 03-04-23
# Reason: 03-04-23

@admin.register(VisitCount)
class VisitCountAdmin(admin.ModelAdmin):
    list_display=("id","tenant_name","count")
    # readonly_fields=("item","user_no")
    # ordering=("title",)
    search_fields=("tenant_name","id")
    list_per_page=10
    def has_change_permission(self, request, obj=None) :
        return False    
    def has_delete_permission(self, request, obj=None) :
        return False  
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return True
        else:
            return False
# End of addition

"""
End of code addition
"""