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

    list_display=("id","categories_list","name",'is_active')
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links = ("id","name",'is_active')
    # End of code addition

    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To show categories inside the menu
    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    def categories_list(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/tenant_app/category/?menu_id__id__exact="+str(obj.id)+"'>View Categories</>")
    categories_list.allow_tags = True
    # End of code addition by Ashish Dewangan on 24-04-2023

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
    
    list_display=("id","item_list","name", "menu",'is_active')
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links=("id","name", "menu",'is_active')
    # End of code addition

    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To show items inside the category
    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    def item_list(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/tenant_app/item/?category_id__id__exact="+str(obj.id)+"'>View Items</>")
    item_list.allow_tags = True
    # End of code addition by Ashish Dewangan on 24-04-2023

    # readonly_fields=("item","user_no")
    # ordering=("title",)
    # Commented and Modified by Om on 13-04-23
    # Reason : Change the method    
    # search_fields=("name","menu")
    # Modified by Om on 24-04-23 for search proper this admin site
    search_fields=["name","menu__name",]
    # End of addition
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
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links=("id","name", "category", "price_full", "price_half",'is_active')
    # End of code addition

    # readonly_fields=("item","user_no")
    # ordering=("title",)
    # Commented and Modified by Om on 13-04-23
    # Reason : Change the method 
    # search_fields=("name","menu")
    # Modified by Om on 24-04-23 for search proper this admin site
    search_fields=["name","category__name",]
    # End of addition
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
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links=("id","offer_name", "discount")
    # End of code addition

    # Commented and Modified by Om on 13-04-23
    # Reason : Change the method 
    # search_fields=("name","offer_name")
    search_fields=["offer_name",]
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
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links=("id","offer_name", "item_name")
    # End of code addition

    # Commented and Modified by Om on 13-04-23
    # Reason : Change the method 
    # search_fields=("name","offer_name", "item_name",)
    search_fields=["offer_name__offer_name", "item_name__name",]
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
        form.base_fields['item_name'].label_from_instance = lambda inst: "{} : {} : {}".format(inst.name,inst.category.name,inst.category.menu)   
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
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links=("id","app_theme", "cgst","sgst","allow_half_price")
    # End of code addition 

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

    # Added by :-  Parineeta Gedam on :- 24-04-2023
    # Reason - to design form
    def get_form(self, request, obj=None, **kwargs):
        form = super(SettingAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['cgst'].widget.attrs['style'] = 'width: 13em;'
        form.base_fields['sgst'].widget.attrs['style'] = 'width: 13em;'
        return form
    # End of addition on :- 24-04-2023

@admin.register(Description)
class DescriptionAdmin(admin.ModelAdmin):
    list_display=("id","content")
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links=("id","content")
    # End of code addition

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
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links=("id","username", "email")
    # End of code addition
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
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links=('id','name','email','contact_number')
    # End of code addition

    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True
        
    # Modified by :- Parineeta Gedam on 20-04-2023
    def has_delete_permission(self, request, obj=None) :
        return False
    # End of modified code on 20-04-2023

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
    list_display = ['id','order_items','order_id','customer_id', 'table_number', 'sub_total',
                    # 'tax',
                    'total','order_status','payment_status','date']
    # end of code

    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links=('id','order_id','customer_id', 'table_number', 'sub_total',
                    'total','order_status','payment_status','date')
    # End of code addition

    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To show order items inside order page
    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    def order_items(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/tenant_app/orderitem/?order_id__id__exact="+str(obj.id)+"'>View Order Items</>")
    order_items.allow_tags = True
    # End of code addition by Ashish Dewangan on 24-04-2023

    # Added by :- Parineeta Gedam on 17-04-2023
    readonly_fields=['order_id','customer_id','sub_total',
                    #  Commented by ROhankansari - 29/4/23
                    # Reason - Not needed yet
                    #  'pax','dshr','capt','sess'
                    # End of code- 29/4/23
                     'cgst','sgst','total']
    # End of added code on 17-04-2023

   
    
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True
        
    # Modified by :- Parineeta Gedam on 20-04-2023
    def has_delete_permission(self, request, obj=None) :
        return False
    # End of modified code on 20-04-2023

    # Added by :- Ashish Dewangan on 26-04-2023
    # Reason - To disallow admin to create an order
    def has_add_permission(self, request, obj=None) :
        return False
    # End of code addition by Ashish Dewangan on 26-04-2023

    # Added by :-  Parineeta Gedam on :- 24-04-2023
    # Reason - to design form
    def get_form(self, request, obj=None, **kwargs):
        form = super(OrderAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields['table_number'].widget.attrs['style'] = 'width: 15em;'
        form.base_fields['order_status'].widget.attrs['style'] = 'width: 15em;'
        form.base_fields['payment_status'].widget.attrs['style'] = 'width: 15em;'
        form.base_fields['payment_mode'].widget.attrs['style'] = 'width: 15em;'
        # Commented by - Ashish Dewangan on 24-04-2023
        # reason - not used anymore
        # form.base_fields['dshr'].widget.attrs['style'] = 'width: 15em;'
        # form.base_fields['capt'].widget.attrs['style'] = 'width: 15em;'
        # form.base_fields['pax'].widget.attrs['style'] = 'width: 15em;'
        # form.base_fields['sess'].widget.attrs['style'] = 'width: 15em;'
        # End of comment
        return form
    # End of addition on :- 24-04-2023

admin.site.register(Order, OrderAdmin)

"""
End of added code 06-04-2023
"""

"""
Added by :- Parineeta Gedam Date - 06-04-2023
Reason- Register Order Item.
"""
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id','item_id','order_id','item', 'serving_size','quantity','price','item_status','rating','review','date']
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links=('id','item_id','order_id','item', 'serving_size','quantity','price','item_status','rating','review','date')
    # End of code addition

    # Commented and modified by - Ashish Dewangan on 24-04-2023
    # Reason - To diallow editing of below fields
    # Added by :- Parineeta Gedam on 17-04-2023
    # readonly_fields=['order_id','item']
    # End of added code on 17-04-2023
    readonly_fields=['item_id','order_id','item', 'serving_size','quantity','price','date']
    #End of code modification by Ashish Dewagnan on 24-04-2023

    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True
        
    # Modified by :- Parineeta Gedam on 20-04-2023
    def has_delete_permission(self, request, obj=None) :
        return False
    # End of modified code on 20-04-2023

    # Added by :- Ashish Dewangan on 26-04-2023
    # Reason - To disallow admin to create OrderItems
    def has_add_permission(self, request, obj=None) :
        return False
    # End of code addition by Ashish Dewangan on 26-04-2023

    # Added by :-  Parineeta Gedam on :- 24-04-2023
    # Reason - to design form
    def get_form(self, request, obj=None, **kwargs):
        form = super(OrderItemAdmin, self).get_form(request, obj, **kwargs)
        # Commented by - Ashish Dewangan on 24-04-2023
        # Reason - Not required because we cant change their value
        # form.base_fields['item_id'].widget.attrs['style'] = 'width: 15em;'
        # form.base_fields['quantity'].widget.attrs['style'] = 'width: 15em;'
        # form.base_fields['serving_size'].widget.attrs['style'] = 'width: 15em;'
        # form.base_fields['price'].widget.attrs['style'] = 'width: 15em;'
        # End of comment by Ashish Dewangan on 24-04-2023
        form.base_fields['rating'].widget.attrs['style'] = 'width: 15em;'
        form.base_fields['review'].widget.attrs['style'] = 'width: 20em;  height:5em;'
        form.base_fields['item_status'].widget.attrs['style'] = 'width: 15em;'
        return form
    # End of addition on :- 24-04-2023
    
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
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links=('id','scanner','name','contact_number')
    # End of code addition
    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True
admin.site.register(PaymentMethod, PaymentMethodAdmin)

"""
End of added code 06-04-2023
"""

# Added by - Ashish Dewangan on 29-04-2023
# Reason - To register notification model on admin panel
# ( ***********For testing only. please comment it on deployment time. We dont want to show restaurant owner about user token*************)
# @admin.register(FcmNotification)
# class FcmNotificationAdmin(admin.ModelAdmin):
#     list_display = ("id",)
# End of code addition    