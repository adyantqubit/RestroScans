from typing import Dict, Optional
from django import forms
from django.contrib import admin
from django.http.request import HttpRequest
from .models import *
from django.apps import apps
from tenant_schemas.utils import get_public_schema_name
from django.urls import reverse
from django.utils.html import format_html
from django.template.loader import get_template
from django.urls import reverse
from weasyprint import HTML,CSS
from io import BytesIO
import subprocess
import os
from tenant_app.forms import *


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
    # Added by- Suman sahu On 07/05/2023
    # reason- change django default image field character validation message
    form = MenuForm
    # End of addition 07/05/2023
    # Modified and commented by Om on 06-05-23
    # Reason : Fix the alignment in menulist in admin panel
    # list_display=("id","categories_list","name",'is_active')
    list_display=("id","name","categories_list",'is_active')
    # End of addition by Om on 06-05-23
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
    # Modification and addition by Om Shrivastava on 14-05-23
    # Reason : Remove the delete field  
    # def has_delete_permission(self, request, obj=None) :
    #     return True 
    def has_delete_permission(self, request, obj=None) :
        return False 
    # End of modification and addition by Om Shrivastava on 14-05-23   
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
    # Added by- Suman sahu On 07/05/2023
    # reason- change django default image field character validation message
    form = CategoryForm
    # End of addition 07/05/2023

    # Modified and commented by Om Shrivastava on 10-05-23
    # Reason : Fix the alignment in categorylist in admin panel
    # list_display=("id","item_list","name", "menu",'is_active')
    list_display=("id","name", "menu","item_list",'is_active')
    # End of addition by Om Shrivastava on 10/05/2023

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
    # Modification and addition by Om Shrivastava on 14-05-23
    # Reason : Remove the delete field  
    # def has_delete_permission(self, request, obj=None) :
    #     return True 
    def has_delete_permission(self, request, obj=None) :
        return False 
    # End of modification and addition by Om Shrivastava on 14-05-23  
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
    # Added by- Suman sahu On 07/05/2023
    # reason- change django default image field character validation message
    form = ItemForm
    # End of addition 07/05/2023
    list_display=("id","name", "category", "price_full", "price_half",'is_active','best_seller',)
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
        # Modified by Rohan kansari - 10/5/23
        return False   
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
    # Added by- Suman sahu On 07/05/2023
    # reason- change django default image field character validation message
    form = OfferForm
    # End of addition 07/05/2023
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
 
    # Added by ROhan kansari - 11/5/23
    # Reason - To remove this column from table
    exclude=("description",)
    # ENd of code - 11/5/23

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
    # Modification and addition by Om Shrivastava on 14-05-23
    # Reason : Remove the delete field    
    # def has_delete_permission(self, request, obj=None) :
    #     return True  
    def has_delete_permission(self, request, obj=None) :
        return False 
    # End of modification and addition by Om Shrivastava on 14-05-23   
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
        # Added by Om Shrivastava on 14-05-23
        # Reason : To Remove the edit and add icon 
        field = form.base_fields["app_theme"]
        field.widget.can_add_related = False
        field.widget.can_change_related = False
        field.widget.can_delete_related = False
        # End of addition by Om Shrivastava on 14-05-23
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
        
# admin.site.register(User, MyUserAdmin)

# Commented by- Suman sahu On 03/05/2023
# Reason- for hide this model in admin pannel

# admin.site.register(Group, MyGroupAdmin)

# End of addition 03/04/2023
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

    # Added by - Ashish Dewangan on 01-05-2023
    # Reason - To add pagination
    list_per_page=10
    # End of code addition

    # Added by :- Parineeta Gedam on 12-05-2023
    # Reason :- all field should be read only.
    readonly_fields=['id','name','email', 'contact_number','last_customer_name','last_email']
    # End of added code by :- Parineeta Gedam on 12-05-2023 

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

    # Added by - Ashish Dewangan on 03-05-2023
    # Reason - To Redirect to dashboard after any action
    def response_add(self, request, obj, post_url_continue="../%s/"):
        from django.http import HttpResponseRedirect
        if '_continue' not in request.POST:
            return HttpResponseRedirect("/admin")
        else:
            return super(OrderAdmin, self).response_add(request, obj, post_url_continue)

    def response_change(self, request, obj):
        from django.http import HttpResponseRedirect
        if '_continue' not in request.POST:
            return HttpResponseRedirect("/admin")
        else:
            return super(OrderAdmin, self).response_change(request, obj)
    # End of code addition by Ashish Dewangan 03-05-2023

    # updated by rohan - 14/4/23 to show cgst and sgt in columns not tax so removing tax field
    # Mofified by ROhankansari - 30/4/23
    # Reason - TO show number instead of name if not entered
    
    # Commented and modified by - Ashish Dewangan on 03-05-2023
    # Reason - To add view button 
    # list_display = ['id','order_items','order_id','get_customer', 'table_number', 'sub_total',
    #             # 'tax',
    #             'total','order_status','payment_status','date']
    list_display = ['view_order','order_items','order_id','customer_detail', 'table_number', 'sub_total',
                    # 'tax',
                      
                    #Added by:- Parineeta Gedam on 07-05-23 
                    # 'total',
                    "manual_discount",
                    'total',
                    "final_amount",
                    # End of Code Addition
                    
                    'order_status','payment_status','date' ,
                    #Added by Om on 30-05-23 
                    #Adding a generate_pdf button
                    # 'generate_order',
                    "get_bill",
                    "get_kitchen_bill"
                    # End of Code Addition
                    ]
    # end of code
    # End of code modification by - Ashish Dewangan on 03-05-2023
    
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    # Mofified by ROhankansari - 30/4/23
    # Reason - TO show number instead of name if not entered

    # Commented and modified by - Ashish Dewangan on 03-05-2023
    # Reason - To add view button
    # list_display_links=('id','order_id','get_customer', 'table_number', 'sub_total',
    #                 'total','order_status','payment_status','date')
    list_display_links=('view_order','order_id','customer_detail', 'table_number', 'sub_total',
                    'total','order_status','payment_status','date')
    # End of code modification by Ashish Dewangan on 03-05-2023
    # End of code addition

    # Added by Om on 03-05-23
    # For generate_pdf button
    def get_bill(self, obj):
        
        if obj.order_status == "Served" and obj.payment_status == "Completed":
            return format_html('<a style = "background-color : green; color: white; padding: 5px 10px;border-radius : 50px"class="button" href="{}" target = "_blank">Get Bill</a>',reverse('order_generate_bill', args=[obj.pk]))
        return ''
    
    # Use for generate the kitchen bill section pdf
    def get_kitchen_bill(self, obj):
        
        if obj.order_status == "Confirm" :
            return format_html('<a style = "background-color : green; color: white; padding: 5px 10px;border-radius : 50px"class="button" href="{}" target = "_blank">Print KOT</a>',reverse('order_kot_generate_bill', args=[obj.pk]))
        return ''
	# End of code addition
	
    # Added by - Ashish Dewangan on 01-05-2023
    # Reason - To add pagination and date filter
    list_per_page=10
    list_filter=('date',)
    # End of code addition
    
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To show order items inside order page
    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    
    # Created by ROhankansari - 30/4/23
    # Reason - TO show number if name is not entered
    def customer_detail(self, obj):
        # Commented and modified by - Ashish Dewangan on 03-05-2023
        # Reason - To handle exception because length cant be checked if name is null
        # def get_customer(self, obj):
        # if len(obj.customer_id.name)>0:    
        if obj.customer_id.last_customer_name:
            return obj.customer_id.last_customer_name
        # End of code modification by - Ashish Dewangan on 03-05-2023
        else:
            return obj.customer_id.contact_number
        # End of code - ROhan kansari - 30/4/23
        
    def order_items(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        # Commented and modified by - Ashish Dewangan on 03-05-2023
        # Reason - To style link tag as button
        # return format_html("<a href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/tenant_app/orderitem/?order_id__id__exact="+str(obj.id)+"'>View Order Items</>")
        return format_html("<a style='background-color: #004376;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/tenant_app/orderitem/?order_id__id__exact="+str(obj.id)+"'>View Order Items</>")
        # End of code modification
    order_items.allow_tags = True
    # End of code addition by Ashish Dewangan on 24-04-2023

    # Added by - Ashish Dewangan on 03-05-2023
    # Reason - To add view button
    def view_order(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color: #92d050;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/tenant_app/order/"+str(obj.id)+"/change/'>View Details</>")
    view_order.allow_tags = True
    # End of code addition by - Ashish Dewangan on 03-05-2023

    # Added by :- Parineeta Gedam on 17-04-2023
    readonly_fields=['order_id','customer_id','sub_total',
                    #  Commented by ROhankansari - 29/4/23
                    # Reason - Not needed yet
                    #  'pax','dshr','capt','sess'
                    # End of code- 29/4/23
                     'cgst','sgst','total',

                    #Added by:- Parineeta Gedam on 12-05-23 for read only field
                    'review',
                    # 'final_amount',
                    # End of Code Addition
                    ]
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

        # Added by :- Parineeta Gedam on 06-05-2023
        # Reason :- to design form
        form.base_fields['manual_discount'].widget.attrs['style'] = 'width: 15em;'
        form.base_fields['final_amount'].widget.attrs['style'] = 'width: 15em;'
        # End of added code on 06-05-2023

        # Added by :- Parineeta Gedam on 13-05-2023
        # Reason :- to design form
        form.base_fields['cancelled_by'].widget.attrs['style'] = 'width: 15em;'
        form.base_fields['cancel_reason'].widget.attrs['style'] = 'width: 15em;'

        # End of added code on 06-05-2023

        # Commented by - Ashish Dewangan on 24-04-2023
        # reason - not used anymore
        # form.base_fields['dshr'].widget.attrs['style'] = 'width: 15em;'
        # form.base_fields['capt'].widget.attrs['style'] = 'width: 15em;'
        # form.base_fields['pax'].widget.attrs['style'] = 'width: 15em;'
        # form.base_fields['sess'].widget.attrs['style'] = 'width: 15em;'
        # End of comment
        return form
    # End of addition on :- 24-04-2023

    # Added by :- Parineeta Gedam on 10-05-2023
    # Reason :- to design radio options for discount type
    radio_fields = {'discount_type': admin.VERTICAL}
    # End of addition on :- 10-05-2023


admin.site.register(Order, OrderAdmin)

"""
End of added code 06-04-2023
"""

"""
Added by :- Parineeta Gedam Date - 06-04-2023
Reason- Register Order Item.
"""
class OrderItemAdmin(admin.ModelAdmin):
    # Added by - Ashish Dewangan on 03-05-2023
    # Reason - To Redirect to dashboard after any action
    def response_add(self, request, obj, post_url_continue="../%s/"):
        from django.http import HttpResponseRedirect
        if '_continue' not in request.POST:
            return HttpResponseRedirect("/admin")
        else:
            return super(OrderItemAdmin, self).response_add(request, obj, post_url_continue)

    def response_change(self, request, obj):
        from django.http import HttpResponseRedirect
        if '_continue' not in request.POST:
            return HttpResponseRedirect("/admin")
        else:
            return super(OrderItemAdmin, self).response_change(request, obj)
    # End of code addition by Ashish Dewangan 03-05-2023
    # list_display = ['view_order_item','order_id','item', 'serving_size','quantity','price','item_status','rating','review','date']
    list_display = ['view_order_item','order_id','item', 'serving_size','quantity','price','item_status','rating','review','date']

    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    # Commented and modified by - Ashish Dewangan on 30-05-2023
    # Reason - To add button
    # list_display_links=('id','item_id','order_id','item', 'serving_size','quantity','price','item_status','rating','review','date')
    # list_display_links=('view_order_item','order_id','item', 'serving_size','quantity','price','item_status','rating','review','date')
    list_display_links=('view_order_item','order_id','item', 'serving_size','quantity','price','item_status','rating','review','date')

    # End of code modification by Ashish Dewangan on 03-05-2023
    # End of code addition

    # Added by - Ashish Dewangan on 01-05-2023
    # Reason - To add pagination
    list_per_page=10
    # End of code addition

    # Commented and modified by - Ashish Dewangan on 24-04-2023
    # Reason - To diallow editing of below fields
    # Added by :- Parineeta Gedam on 17-04-2023
    # readonly_fields=['order_id','item']
    # End of added code on 17-04-2023
    # Remove by ROhankansari - 11/5/23
    # Reason - requirement is to hide this field if already we have name so dont show id
    # readonly_fields=['item_id','order_id','item', 'serving_size','quantity','price','date']

    # Modified by :- Parineeta Gedam on 18-05-2023
    # readonly_fields=['order_id','item', 'serving_size','quantity','price','date']
    readonly_fields=['price','date']
    # End of modified code by :- Parineeta Gedam on 18-05-2023

    # End of code- ROhankansari -11/5/23
    #End of code modification by Ashish Dewagnan on 24-04-2023

    # Added by ROhan kansari - 11/5/23
    # Reason - To remove this column from table
    # commented by :- Parineeta Gedam on 19-05-2023
    # reason :- to show item_id 
    # exclude=("item_id",)
    # ENd of code - 11/5/23

    #Added by Rohan Kansari - 11/5/23
    # Reason -To solve ordering issue of table
    # fields=('order_id','item', 'serving_size','quantity','price','item_status','rating','review','date', 'cancel_reason')
    # Modified by :- Parineeta Gedam on 21-05-2023
    fields=('order_id','item','item_id','serving_size','quantity','price','item_status','rating','review','date', 'cancel_reason')
    # End of modified code by :- Parineeta Gedam on 21-05-2023

    # End of code - 11/5/23 -Rohan Kansari

    def has_module_permission(self, request,view=None):
        if request.tenant.schema_name == get_public_schema_name():
            return False
        else:
            return True

    # Added by - Ashish Dewangan on 03-05-2023
    # Reason - To show order items inside order page
    def get_queryset(self, request):
        self.request = request      
        return super().get_queryset(request)
    # End of code addition by Ashish Dewangan on 03-05-2023

    # Added by - Ashish Dewangan on 03-05-2023
    # Reason - To add view button
    def view_order_item(self,obj):
        from django.utils.html import format_html
        from django.conf import settings
        return format_html("<a style='background-color: #92d050;color:#fff;padding:3px;border-radius: 4px;' href='"+settings.HTTP_METHOD+self.request.get_host()+"/admin/tenant_app/orderitem/"+str(obj.id)+"/change/'>View Details</>")
    view_order_item.allow_tags = True
    # End of code addition by - Ashish Dewangan on 03-05-2023

    # Modified by :- Parineeta Gedam on 20-04-2023
    def has_delete_permission(self, request, obj=None) :
        return False
    # End of modified code on 20-04-2023

    # Added by :- Ashish Dewangan on 26-04-2023
    # Reason - To disallow admin to create OrderItems
    def has_add_permission(self, request, obj=None) :
        # return False
        return True

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

        # Added by :- Parineeta Gedam on 19-05-2023
        form.base_fields['order_id'].widget.attrs['style'] = 'width: 15em;'
        form.base_fields['item'].widget.attrs['style'] = 'width: 15em;'
        form.base_fields['item_id'].widget.attrs['style'] = 'width: 15em;'
        form.base_fields['serving_size'].widget.attrs['style'] = 'width: 15em;'
        form.base_fields['cancel_reason'].widget.attrs['style'] = 'width: 20em;  height:5em;'
        # End of added code by :- Parineeta Gedam on 19-05-2023

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
    # Added by- Suman sahu On 07/05/2023
    # reason- change django default image field character validation message
    form = PaymentMethodForm
    # End of addition 07/05/2023
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
        
    # Added by :- Parineeta Gedam on 12-05-2023
    # Reason - to add only one time
    def has_add_permission(self, request):
        return not PaymentMethod.objects.exists()
    # End of eddition

    # Added by :- Parineeta Gedam on 12-05-2023
    # Reason - can not delete
    def has_delete_permission(self, request, obj=None) :
        return False
    # End of Added code on 20-04-2023

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
