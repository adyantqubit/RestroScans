from django.contrib import admin
from .models import *
from django.apps import apps
from tenant_schemas.utils import get_public_schema_name
# Register your models here.
# admin.site.register(Student)

"""----------------------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To register apps on admin panel and specify what rights public admin(product owner admin) and tenant admin(client) will have.
"""
# class TenantAdmin(admin.ModelAdmin):
#     def has_view_permission(self, request,view=None) :
#         if request.tenant.schema_name == get_public_schema_name():
#             return False
#         else:
#             return True
        
#     def has_view_or_change_permission(self, request, view=None):
#         if request.tenant.schema_name == get_public_schema_name():
#             return False
#         else:
#             return True    
        
# app = apps.get_app_config('tenant_app')
# for model_name, model in app.models.items():     
#     admin.site.register(model,TenantAdmin)        

@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display=("id","name")
    # readonly_fields=("item","user_no")
    # ordering=("title",)
    search_fields=("name","id")
    list_per_page=10
    def has_change_permission(self, request, obj=None) :
        return True    
    def has_delete_permission(self, request, obj=None) :
        return True   
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True 

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display=("id","name", "menu")
    # readonly_fields=("item","user_no")
    # ordering=("title",)
    search_fields=("name","menu")
    list_per_page=10
    def has_change_permission(self, request, obj=None) :
        return True    
    def has_delete_permission(self, request, obj=None) :
        return True   
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True
        
@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display=("id","name", "category", "price_full", "price_half")
    # readonly_fields=("item","user_no")
    # ordering=("title",)
    search_fields=("name","menu")
    list_per_page=10
    def has_change_permission(self, request, obj=None) :
        return True    
    def has_delete_permission(self, request, obj=None) :
        return True   
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True 

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display=("id","offer_name", "discount")
    search_fields=("name","offer_name")
    list_per_page=10
    def has_change_permission(self, request, obj=None) :
        return True    
    def has_delete_permission(self, request, obj=None) :
        return True   
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True 

@admin.register(OfferItem)
class OfferItemAdmin(admin.ModelAdmin):
    list_display=("id","offer_name", "item_name")
    search_fields=("name","offer_name", "item_name")
    list_per_page=10
    def has_change_permission(self, request, obj=None) :
        return True    
    def has_delete_permission(self, request, obj=None) :
        return True   
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True 
        
@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    list_display=("id","background_color", "heading_color", "subheading_color", "banner_heading_color")
    search_fields=("name","offer_name", "item_name")
    list_per_page=10
    def has_change_permission(self, request, obj=None) :
        return True    
    def has_delete_permission(self, request, obj=None) :
        return True   
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True 
        
# @admin.register(Footer)
# class FooterAdmin(admin.ModelAdmin):
#     list_display=("id","content")
#     search_fields=("content", "id")
#     list_per_page=10
#     def has_change_permission(self, request, obj=None) :
#         return True    
#     def has_delete_permission(self, request, obj=None) :
#         return True   
#     def has_module_permission(self, request,view=None):
#         if request.tenant.schema_name == get_public_schema_name():
#             return False
#         else:
#             return True 
        
@admin.register(Description)
class DescriptionAdmin(admin.ModelAdmin):
    list_display=("id","content")
    search_fields=("content", "id")
    list_per_page=10
    def has_change_permission(self, request, obj=None) :
        return True    
    def has_delete_permission(self, request, obj=None) :
        return True   
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True 