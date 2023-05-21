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
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links = ("id","app_logo","adyant_logo","title","bottom_text","adyant_webite_link")
    # End of code addition

    # readonly_fields=("item","user_no")
    # ordering=("title",)
    # Commented and Modified by Om on 13-04-23
    # Reason : Change the method
    # search_fields=("title","id")
    search_fields=["title","id",]
    # End of comment and code modification by Om shrivastava on 13-04-23
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
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links = ("id","restaurant_name","tenant_name","created_at")
    # End of code addition
    #     
    # readonly_fields=("item","user_no")
    # ordering=("title",)
    # Commented and Modified by Om on 13-04-23
    # Reason : Change the method
    # search_fields=("restaurant_name","id","tenant_name")
    # Changes by Om on 24-04-23
    # Reason : Search by restaurant name is not working
    search_fields=["restaurant_name__restaurant_name","id","tenant_name",] 
    # End of addition
    # End of comment and code modification by Om shrivastava on 13-04-23
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
        form.base_fields['Subscribe_plan'].label_from_instance= lambda inst: "{}".format(inst.plan_name) 
        return form
    # End of addition
   

        
# @admin.register(Otp)
# class OtpAdmin(admin.ModelAdmin):
#     list_display=("id","otp")
#     # readonly_fields=("item","user_no")
#     # ordering=("title",)
#     # Commented and Modified by Om on 13-04-23
#     # Reason : Change the method
#     # search_fields=("tenant_name", "restaurant_name","id")
#     search_fields=["tenant_name", "restaurant_name","id"]
#     # End of comment and code modification by Om shrivastava on 13-04-23

#     list_per_page=10
#     def has_change_permission(self, request, obj=None) :
#         return True    
#     def has_delete_permission(self, request, obj=None) :
#         return True   
#     def has_module_permission(self, request,view=None):
#         if request.tenant.schema_name == get_public_schema_name():
#             return True
#         else:
#             return False 
        
@admin.register(RestaurantRequest)
class RestaurantRequestAdmin(admin.ModelAdmin):
    list_display=("id","restaurant_name", "owner_name", "mobile_number", "address", "created_at", "is_active")
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links = ("id","restaurant_name", "owner_name", "mobile_number", "address", "created_at", "is_active")
    # End of code addition

    # readonly_fields=("item","user_no")
    # ordering=("title",)
    # Commented and Modified by Om on 13-04-23
    # Reason : Change the method
    # search_fields=("restaurant_name","id","owner_name", "created_at")
    search_fields=["restaurant_name","id","owner_name", "created_at"]
    # End of comment and code modification by Om shrivastava on 13-04-23

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
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links = ("id","tenant_name","count")
    # End of code addition

    # readonly_fields=("item","user_no")
    # ordering=("title",)
    # Commented and Modified by Om on 13-04-23
    # Reason : Change the method
    # search_fields=("tenant_name","id")
    search_fields=["tenant_name","id"]
    # End of comment and code modification by Om shrivastava on 13-04-23


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

@admin.register(AppTheme)
class AppThemeAdmin(admin.ModelAdmin):
    list_display=("id","background_color", "heading_color", "subheading_color", "banner_heading_color", "heading_bgcolor", "subheading_bgcolor")
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links = ("id","background_color", "heading_color", "subheading_color", "banner_heading_color", "heading_bgcolor", "subheading_bgcolor")
    # End of code addition

    # readonly_fields=("item","user_no")
    # ordering=("title",)
    # search_fields=("background_color","heading_color","subheading_color")
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
        
#added by rohan - 18/4/23
#reason - to add plans and subscription functioin nality
@admin.register(Plans)
class PlanAdmin(admin.ModelAdmin):
    list_display=("plan_name",)
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links = ("plan_name",)
    # End of code addition

    def has_change_permission(self, request, obj=None) :
        return False    
    def has_delete_permission(self, request, obj=None) :
        return False  
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return True
        else:
            return False
    
@admin.register(Features)
class Feature(admin.ModelAdmin):
      list_display=("feature_name",)
      # Added by - Ashish Dewangan on 24-04-2023
      # Reason - To make columns clickable. So that the user can navigate to details of this row
      list_display_links = ("feature_name",)
      # End of code addition  
      def has_change_permission(self, request, obj=None) :
            return True    
      def has_delete_permission(self, request, obj=None) :
        return True  
      def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return True
        else:
            return False   
      
@admin.register(PlannedFeatures)
class PlannedFeatureAdmin(admin.ModelAdmin):
    list_display=("Plan_selected","Feature_selected",)        
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links = ("Plan_selected","Feature_selected",)
    # End of code addition 
    def Plan_selected(self,obj):
        return obj.plan_selected.plan_name
        
    def Feature_selected(self, obj):
        return obj.feature_selected.feature_name
    
    def has_change_permission(self, request, obj=None) :
        return True    
    def has_delete_permission(self, request, obj=None) :
        return True  
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return True
        else:
            return False
    
    def get_form(self, request, obj=None, **kwargs):
        form = super(PlannedFeatureAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['plan_selected'].label_from_instance = lambda inst: "{}".format(inst.plan_name)  
        form.base_fields['feature_selected'].label_from_instance = lambda inst: "{}".format(inst.feature_name)  
        
        return form  
        
        
         ##end of code - Rohan kansari-18/4/23

# Added by - Suman Sahu on 09/04/2023
# Reason - Create table for Show GallerySettings Details on home page


@admin.register(GallerySettings)
class GallerySettingAdmin(admin.ModelAdmin):
    list_per_page = 10

    def has_change_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        return True

    def has_module_permission(self, request, view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return True
        else:
            return False


# End of code addition 09/04/2023

# Added by - Suman Sahu on 09/04/2023
# Reason - Create table for Show GetRestroscansRequest Details

@admin.register(GetRestroscansRequest)
class GetRestroscansRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "owner_name",
        "email",
        "restaurant_name",
        "mobile_number",
    )
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links = ("id",
        "owner_name",
        "email",
        "restaurant_name",
        "mobile_number",)
    # End of code addition 
    search_fields = ("restaurant_name", "id", "owner_name")
    list_per_page = 10

    def has_change_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        return True

    def has_module_permission(self, request, view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return True
        else:
            return False


# End of code addition 09/04/2023

# Added by - Suman Sahu on 09/04/2023
# Reason - Create table for Show ContactUsRequest Details

@admin.register(ContactUsRequest)
class ContactUsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "email",
        "mobile_number",
        "query",
    )
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links = ( "id",
        "name",
        "email",
        "mobile_number",
        "query",)
    # End of code addition
    list_per_page = 10

    def has_change_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        return True

    def has_module_permission(self, request, view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return True
        else:
            return False


# End of code addition 09/04/2023

# Added by - Suman Sahu on 09/04/2023
# Reason - Create table for Show WebsiteSetting Details

@admin.register(WebsiteSetting)
class WebsiteSettingsAdmin(admin.ModelAdmin):

    list_per_page = 10

    def has_change_permission(self, request, obj=None):
        return True

    def has_delete_permission(self, request, obj=None):
        return True

    def has_module_permission(self, request, view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return True
        else:
            return False


# End of code addition 09/04/2023
