from django import forms
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
        
        
class TenantAdminForm(forms.ModelForm):
    """The plan and any extra features are saved for this restaurant only."""

    extra_features = forms.MultipleChoiceField(
        choices=[],
        widget=forms.CheckboxSelectMultiple,
        required=False,
        label='Extra features',
    )

    class Meta:
        model = Tenant
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from admin_app.plan_catalog import FEATURE_CHOICES, codes_for_plan, extra_codes

        if getattr(self.instance, 'schema_name', None) == 'public':
            self.fields.pop('extra_features', None)
            return
        self.fields['extra_features'].choices = FEATURE_CHOICES
        current = extra_codes(self.instance.pk) if self.instance.pk else []
        self.fields['extra_features'].initial = current
        self.initial['extra_features'] = current
        included = codes_for_plan(getattr(self.instance, 'Subscribe_plan', ''))
        self.fields['extra_features'].help_text = (
            'On top of this plan, for this restaurant only. The plan already includes: %s.'
            % (', '.join(included) or 'nothing')
        )

    def clean(self):
        from admin_app.plan_catalog import codes_for_plan, combine_features, missing_requirements

        cleaned = super().clean()
        if 'extra_features' not in self.fields:
            return cleaned
        gaps = missing_requirements(combine_features(
            codes_for_plan(cleaned.get('Subscribe_plan')),
            cleaned.get('extra_features'),
        ))
        if gaps:
            self.add_error('extra_features', '; '.join(gaps))
        return cleaned


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    form = TenantAdminForm
    list_display=("id","restaurant_name","tenant_name","Subscribe_plan","created_at")
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
        return form

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if obj.schema_name == 'public' or 'extra_features' not in form.cleaned_data:
            return
        from admin_app.plan_catalog import codes_for_plan, extras_to_store, replace_extra_features

        extras = extras_to_store(codes_for_plan(obj.Subscribe_plan), form.cleaned_data.get('extra_features'))
        replace_extra_features(obj, extras)
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
        
@admin.register(PlanFeature)
class PlanFeatureAdmin(admin.ModelAdmin):
    """Edit the default features of each plan. This does not assign a plan to a restaurant."""

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_module_permission(self, request):
        tenant = getattr(request, 'tenant', None)
        return tenant is not None and tenant.schema_name == get_public_schema_name()

    def changelist_view(self, request, extra_context=None):
        from django.contrib import messages
        from django.core.exceptions import PermissionDenied
        from django.shortcuts import redirect, render

        from admin_app.plan_catalog import (
            FEATURES, KNOWN_CODES, PLAN_CHOICES, codes_for_plan, missing_requirements, replace_plan_features,
        )

        if not self.has_view_permission(request):
            raise PermissionDenied
        if request.method == 'POST':
            if not self.has_change_permission(request):
                raise PermissionDenied
            chosen = {}
            problems = []
            for name, label in PLAN_CHOICES:
                picked = [code for code in request.POST.getlist(name) if code in KNOWN_CODES]
                gaps = missing_requirements(picked)
                if gaps:
                    problems.append('%s: %s.' % (label, '; '.join(gaps)))
                chosen[name] = picked
            if problems:
                messages.error(request, ' '.join(problems))
            else:
                replace_plan_features(chosen)
                messages.success(request, 'Plan defaults saved. Restaurants keep the plan they were given.')
                return redirect(request.path)

        plans = []
        for name, label in PLAN_CHOICES:
            ticked = set(codes_for_plan(name))
            plans.append({
                'name': name,
                'label': label,
                'features': [{'code': code, 'label': text, 'on': code in ticked} for code, text in FEATURES],
            })
        context = dict(
            self.admin_site.each_context(request),
            plans=plans,
            title='Plan features',
            opts=self.model._meta,
        )
        return render(request, 'admin/plan_features.html', context)


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
        # Added by Pratap sahu on 21-11-2023 to have created dateTime column
         "created_at",
        # End of code by Pratap sahu on 21-11-2023 to have created dateTime column
    )
    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To make columns clickable. So that the user can navigate to details of this row
    list_display_links = ("id",
        "owner_name",
        "email",
        "restaurant_name",
        "mobile_number",
          # Added by Pratap sahu on 21-11-2023 to have created dateTime column
        "created_at",
        # End of code by Pratap sahu on 21-11-2023 to have created dateTime column
        )
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

# Added by - Suman Sahu on 17/05/2023
# Reason - Create table for Show Pricing Plans Details

@admin.register(PricingPlans)
class PricingPlansAdmin(admin.ModelAdmin):

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


# End of code addition by- Suman sahu On 17/05/2023

# Added by - Suman Sahu on 18/05/2023
# Reason - Create table for Show Customer Feedback Details

@admin.register(CustomerFeedback)
class CustomerFeedbackAdmin(admin.ModelAdmin):

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


# End of code addition by- Suman sahu On 18/05/2023


