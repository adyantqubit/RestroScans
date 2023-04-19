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
    # Commented and Modified by Om on 13-04-23
    # Reason : Change the method    
    # search_fields=("name","id")
    search_fields=["name","id",]
    # End of comment and code modification by Om shrivastava on 13-04-23

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
    # Commented and Modified by Om on 13-04-23
    # Reason : Change the method    
    # search_fields=("name","menu")
    search_fields=["name","menu",]
    # End of comment and code modification by Om shrivastava on 13-04-23

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
    # Commented and Modified by Om on 13-04-23
    # Reason : Change the method 
    # search_fields=("name","menu")
    search_fields=["name","menu",]
    # End of comment and code modification by Om shrivastava on 13-04-23

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
    # Commented and Modified by Om on 13-04-23
    # Reason : Change the method 
    # search_fields=("name","offer_name")
    search_fields=["name","offer_name",]
    # End of comment and code modification by Om shrivastava on 13-04-23

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
    # Commented and Modified by Om on 13-04-23
    # Reason : Change the method 
    # search_fields=("name","offer_name", "item_name",)
    search_fields=["name","offer_name", "item_name",]
    # End of comment and code modification by Om shrivastava on 13-04-23
    

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

        # Modified by :- Parineeta Gedam on :- 19-04-2023
        # form.base_fields['item_name'].widget.attrs['style'] = 'width: 20em;'
        form.base_fields['item_name'].widget.attrs['style'] = 'width: 30em;'
        # End of added code on :- 19-04-2023

        # added by :- Parineeta Gedam on :- 19-04-2023
        form.base_fields['item_name'].label_from_instance = lambda inst: "{} : {}: {}".format(inst.name,inst.category.name,inst.category.menu)   
        # End of added code
        return form
    # End of addition

@admin.register(Setting)
class SettingAdmin(admin.ModelAdmin):
    # Commented by Om on 11-04-23 on 10-04-23
    # Reason : Not need to use these fields
    # list_display=("id","background_color", "heading_color", "subheading_color", "banner_heading_color")
    # search_fields=("name","offer_name", "item_name")
    # End of commmented code

    # Added by Om on 11-04-23
    # Reason : Show the list display fields
    
    
    
    #added by rohan - 14/4/23
    #reson- to remove tax from setting and added cgst and sgst 
    list_display=("id","app_theme", "cgst","sgst","allow_half_price")
    # End of addition
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
    # Commented and Modified by Om on 13-04-23
    # Reason : Change the method 
    # search_fields=("content", "id")
    search_fields=["content", "id",]
    # End of comment and code modification by Om shrivastava on 13-04-23

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
    # updated by rohan - 14/4/23 to show cgst and sgt in columns not tax so removing tax field
    list_display = ['id','order_id','customer_id', 'table_number', 'sub_total',"cgst","sgst",
                    # 'tax',
                    'total','order_status','payment_status','payment_mode','date']
    # end of code

    # Added by :- Parineeta Gedam on 17-04-2023
    readonly_fields=['order_id','customer_id','sub_total','cgst','sgst','total']
    # End of added code on 17-04-2023

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
    list_display = ['id','order_id','item', 'serving_size','quantity','price','item_status','rating','review','date']

    # Added by :- Parineeta Gedam on 17-04-2023
    readonly_fields=['order_id','item']
    # End of added code on 17-04-2023

    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True
admin.site.register(OrderItem, OrderItemAdmin)

"""
End of added code 06-04-2023
"""
"""
Added by :- Parineeta Gedam Date - 06-04-2023
Reason- Register Order Item.
"""
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ['id','scanner','name','contact_number']
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True
admin.site.register(PaymentMethod, PaymentMethodAdmin)

"""
End of added code 06-04-2023
"""
