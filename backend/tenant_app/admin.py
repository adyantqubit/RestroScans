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
    list_display=("id","name",'is_active')
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
    # Added by Yuvraj sahu on 31-3-2023
    # Reason - to design form
    def get_form(self, request, obj=None, **kwargs):
        form = super(MenuAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['name'].widget.attrs['style'] = 'width: 20em;'
        return form
    # End of addition

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display=("id","name", "menu",'is_active')
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
    # Added by Yuvraj sahu on 31-3-2023
    # Reason - to design form
    def get_form(self, request, obj=None, **kwargs):
        form = super(CategoryAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['menu'].widget.attrs['style'] = 'width: 20em;'
        form.base_fields['name'].widget.attrs['style'] = 'width: 20em;'
        # form.base_fields['icon'].widget.attrs['style'] = 'width: 20em;'
        return form
    # End of addition
        
@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display=("id","name", "category", "price_full", "price_half",'is_active')
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
    # Added by Yuvraj sahu on 31-3-2023
    # Reason - to design form
    def get_form(self, request, obj=None, **kwargs):
        form = super(ItemAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['item_type'].widget.attrs['style'] = 'width: 20em;'
        form.base_fields['category'].widget.attrs['style'] = 'width: 20em;'
        form.base_fields['price_full'].widget.attrs['style'] = 'width: 20em;'
        form.base_fields['price_half'].widget.attrs['style'] = 'width: 20em;'
        # form.base_fields['icon'].widget.attrs['style'] = 'width: 20em;'
        return form
    # End of addition

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
    # Added by Yuvraj sahu on 31-3-2023
    # Reason - to design form
    def get_form(self, request, obj=None, **kwargs):
        form = super(OfferAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['offer_name'].widget.attrs['style'] = 'width: 20em;'
        form.base_fields['discount'].widget.attrs['style'] = 'width: 20em;'
        # form.base_fields['description'].widget.attrs['style'] = 'width: 20em;'
        return form
    # End of addition

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
    # Added by Yuvraj sahu on 31-3-2023
    # Reason - to design form
    def get_form(self, request, obj=None, **kwargs):
        form = super(OfferItemAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['offer_name'].widget.attrs['style'] = 'width: 20em;'
        form.base_fields['item_name'].widget.attrs['style'] = 'width: 20em;'
        return form
    # End of addition
        
@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    list_display=("id","background_color", "heading_color", "subheading_color", "banner_heading_color","tax")
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
    # Added by Yuvraj Sahu on 29-3-2023
    # Reason - to add only one time
    def has_add_permission(self, request):
        return not Setting.objects.exists()
    # End of eddition
    
        
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
    # Added by Yuvraj Sahu on 29-3-2023
    # Reason - to add only one time
    def has_add_permission(self, request):
        return not Description.objects.exists()
    # End of eddition

# Added by Yuvraj sahu on 30-2-2023
# Reason - to remove add user button for tenant
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User, Group

admin.site.unregister(User)
admin.site.unregister(Group)
class MyUserAdmin(admin.ModelAdmin):
    from django.conf import settings
    list_display=("id","username", "email")
    def has_add_permission(self, request):
        if request.tenant.schema_name != get_public_schema_name() :
            return not User.objects.exists()
        else:
            return True
    # Added by Yuvraj Sahu on 1-4-2023
    # Reason - to change fields for tenant not change for public 
    def has_change_permission(self, request, obj=None):
        if request.tenant.schema_name != get_public_schema_name() :
            return False
        else:
            return True
    # End of addition

class MyGroupAdmin(admin.ModelAdmin):
    # list_display=["name"]
    def has_add_permission(self, request):
        if request.tenant.schema_name != get_public_schema_name():
            return False
        else:
            return True
    # Added by Yuvraj Sahu on 1-4-2023
    # Reason - to change fields for tenant not change for public
    def has_change_permission(self, request, obj=None):
        if request.tenant.schema_name != get_public_schema_name() :
            return False
        else:
            return True
    # End of addition
        
admin.site.register(User, MyUserAdmin)
admin.site.register(Group, MyGroupAdmin)
# End of addition

"""
Added by :-  Parineeta Gedam Date - 06-04-2023
Reason- Register Customer Detail table.
"""
class CustomerDetailAdmin(admin.ModelAdmin):
    list_display = ['id','name','email','contact_number']
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True
admin.site.register(CustomerDetail, CustomerDetailAdmin)

"""
End of added code 06-04-2023
"""

"""
Added by :- Parineeta Gedam Date - 06-04-2023
Reason- Register Order table.
"""
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id','order_id','customer_id', 'table_number', 'sub_total','tax','total','order_status','payment_status','payment_mode','date']
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True
admin.site.register(Order, OrderAdmin)

"""
End of added code 06-04-2023
"""

"""
Added by :- Parineeta Gedam Date - 06-04-2023
Reason- Register Order Item.
"""
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id','order_id','item', 'serving_size', 'quantity','price','rating','review','date']
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True
admin.site.register(OrderItem, OrderItemAdmin)

"""
End of added code 06-04-2023
"""
