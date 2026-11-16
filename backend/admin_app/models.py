from django.db import models
from django.utils import timezone
from django.dispatch import receiver
from tenant_schemas.models import TenantMixin
from tenant_schemas.utils import get_public_schema_name
from django.core.exceptions import ValidationError
from ckeditor.fields import RichTextField
from tenant_schemas.signals import post_schema_sync
from django.db import connection
# Added by pratap sahu on 18-09-2023
# Reason:To create a default theme option for new Tenant
from django.db.models.signals import post_delete, post_save
from django.core.cache import cache
from common.tenant_resolution import tenant_cache_key
from admin_app.plan_catalog import PLAN_CHOICES, FEATURE_CHOICES
# End of Addition by pratap sahu on 18-09-2023
# Reason:To create a default theme option for new Tenant

#Added by Rohan Kansari- 16/4/23
# Reason - To add plan Subcribtion feature where all feature is allow according to plan

# Added by Rohan Kansari - 11/5/23
# Reason - To set global image validate function
def validate_image(fieldfile_obj):
    """Reject images larger than 200 KB."""
    import os

    limit_kb = 2200
    try:
        filesize = fieldfile_obj.file.size
    except Exception:
        try:
            filesize = os.path.getsize(fieldfile_obj.file.name)
        except Exception:
            return
    if filesize > limit_kb * 1024:
        raise ValidationError("Please upload image below %skb" % str(limit_kb))


# In this model, we 
class PlanFeature(models.Model):
    """A default feature of a plan. Every restaurant on that plan includes it."""
    plan=models.CharField(max_length=50, choices=PLAN_CHOICES)
    feature=models.CharField(max_length=50, choices=FEATURE_CHOICES)

    class Meta:
        verbose_name = "Plan feature"
        verbose_name_plural = "Plan features"
        unique_together = (("plan", "feature"),)

    def __str__(self):
        return "%s: %s" % (self.get_plan_display(), self.get_feature_display())


class TenantExtraFeature(models.Model):
    """A feature added for one restaurant, on top of its plan."""
    tenant=models.ForeignKey('Tenant', on_delete=models.CASCADE, related_name='extra_features')
    feature=models.CharField(max_length=50, choices=FEATURE_CHOICES)

    class Meta:
        verbose_name = "Extra feature"
        verbose_name_plural = "Extra features"
        unique_together = (("tenant", "feature"),)

    def __str__(self):
        return "%s: %s" % (self.tenant_id, self.get_feature_display())


# end of code - Rohan Kansari - 16/4/23 

# Added by pratap on 21-11-2023 to add default datetime
from datetime import datetime    
# End of code  by pratap on 21-11-2023 

"""-------------------------------------------------------------------
Added by - Yuvraj Sahu on 15-02-2023
Reason - To store tenant requests
"""
class RestaurantRequest(models.Model):
     # added by rohan kansari - 20/4/23
    # reason- To add validation on image , admin not able to add image more than 200kb
    # Modiefied - 21/4/23 - to Handel image resave error
    # Commented by Rohan kansari- 11/5/23 - define it globally
    # def validate_image(fieldfile_obj):
    #   try:
    #     filesize = fieldfile_obj.file.size
    #     megabyte_limit = 200
    #   except:
    #     try:  
    #         import os # new
    #         from pathlib import Path
    #         filesize=os.path.getsize(fieldfile_obj.file.name)
    #         print(filesize)
    #         megabyte_limit = 200
    #         if filesize > megabyte_limit*1024:
    #             raise ValidationError("Max file size is %skb" % str(megabyte_limit))
    #     except:
    #             return     
    #   if filesize > megabyte_limit*1024:
    #         raise ValidationError("Max file size is %skb" % str(megabyte_limit))
    # End of commentation - Rohan kansari - 11/5/23
    # end of code - rohan - 20/4/23
    
    id = models.AutoField(primary_key=True)
    restaurant_name =models.CharField(max_length=255, default='')
    # Modified by Yuvraj sahu on 29-3-2023
    # Reason - remove mandatory field from tag line
    tag_line = models.CharField(max_length=255, null=True, blank=True)
    # End of code modification
    restaurant_logo=models.ImageField(upload_to='images/tenantRequest/',blank=True,null=True,validators=[validate_image])
     # Added by Om on 24-03-23
    # Reason: Show a restaurant background image
    restaurant_background_img = models.ImageField(upload_to='images/tenantBackgroundImage/',blank=True,null=True,validators=[validate_image])
    # End of addition
    owner_name = models.CharField(max_length=255, default='')
    email =models.EmailField(unique=True)
    mobile_number =models.CharField(max_length=15, default='',unique=True)
    # Modified by Yuvraj Sahu on 29-3-2023
    # Reason - to remove mandatory field
    telephone_number =models.CharField(max_length=15, null=True, blank=True)
    # End of modification
    password = models.CharField(max_length=500, null=True)
    confirm_password = models.CharField(max_length=500, null=True)
    address =models.TextField()
    is_active = models.BooleanField(default=False)
    # Modified by Pratap sahu on 21-11-2023 Reason: To have dateTime column 
    # created_at = models.DateField(auto_now=True)
    # updated_at = models.DateField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # End of code by Pratap sahu
    
    # Added by:- Suman sahu On 20/04/2023
    # Reason:- Show patners details on the home page
    is_partner = models.BooleanField(default=False)
    # End of added code 20/04/2023

    def __str__(self):
            return self.restaurant_name
    
    def save(self, *args, **kwargs):
        # Passwords may be assigned in plain text (registration, reset, Django admin); never store them that way.
        self.password = _hashed(self.password)
        self.confirm_password = _hashed(self.confirm_password)
        super().save(*args, **kwargs)


def _hashed(value):
    from django.contrib.auth.hashers import identify_hasher, make_password

    if not value:
        return value
    try:
        identify_hasher(value)
        return value
    except ValueError:
        return make_password(value)
"""
End of code addition
"""

"""-------------------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To have tenant table where tenant's information will be stored
"""
class Tenant(TenantMixin):
    tenant_name=models.CharField(max_length=255,default='',unique=True)
    # Commented by Yuvraj Sahu on 13-4-2023
    # Reason - to remove tenant logo from restaurant
    # tenant_logo=models.ImageField(upload_to='images/tenant/',blank=True,null=True)
    # End of comment
     # Added by Om on 24-03-23
    # Reason: Show a restaurant name in tenant models
    restaurant_name = models.ForeignKey(RestaurantRequest,related_name='restaurant_id',null=True,on_delete=models.DO_NOTHING)
    # End of addition
    # Commented by Yuvraj Sahu on 29-3-2023
    # Reason - to remove active from tenant
    # active=models.BooleanField(default=False)
    # End of removal
    created_at=models.DateField(auto_now=True)
    updated_at=models.DateField(auto_now=True)
    restaurant_phone_number=models.CharField(max_length=15,null=True,blank=True)
    # Added by rohankansari - 17/4/23
    # Reason - to Add function of Subscription
    # A plan name from the catalog. Blank means the Starter feature set.
    Subscribe_plan=models.CharField(max_length=50, choices=PLAN_CHOICES, blank=True, default="", help_text="This restaurant only. Saving a plan here does not change any other restaurant.")
    def __str__(self):
            return self.tenant_name
    # Added by Yuvraj Sahu on 28-3-2023
    # reason - to save tenant barcode svg
    def save(self, *args, **kwargs):
        """Provision a restaurant: visit counter, phone copy, approval and QR code."""
        if self.schema_name == 'public':
            super().save(*args, **kwargs)
            return

        VisitCount.objects.get_or_create(tenant_name=self.tenant_name, defaults={'count': 0})
        if self.restaurant_name_id:
            self.restaurant_phone_number = self.restaurant_name.mobile_number
            RestaurantRequest.objects.filter(id=self.restaurant_name_id).update(is_active=True, updated_at=timezone.now())
        else:
            self.restaurant_phone_number = ''
        self._write_qr_code()
        super().save(*args, **kwargs)

    def _write_qr_code(self):
        import os
        import pyqrcode
        from django.conf import settings

        folder = os.path.join(settings.MEDIA_ROOT, self.domain_url, 'images', 'qrcode')
        os.makedirs(folder, exist_ok=True)
        site_url = settings.TENANT_SITE_URL_TEMPLATE.format(tenant=self.tenant_name)
        pyqrcode.create(site_url).svg(os.path.join(folder, 'qr.svg'), scale=10)
"""
End of code addition
"""


@receiver([post_save, post_delete], sender=PlanFeature)
def forget_cached_plan(sender, instance, **kwargs):
    from admin_app.plan_catalog import forget_plan_features
    forget_plan_features()


@receiver([post_save, post_delete], sender=TenantExtraFeature)
def forget_cached_extra(sender, instance, **kwargs):
    from admin_app.plan_catalog import forget_tenant_extras
    forget_tenant_extras(instance.tenant_id)


@receiver([post_save, post_delete], sender=Tenant)
def forget_cached_tenant(sender, instance, **kwargs):
    """Tenant lookups are cached per request path (see MutitenantMiddleware)."""
    cache.delete_many([tenant_cache_key(instance.schema_name), tenant_cache_key(instance.tenant_name)])


# Added by pratap sahu on 22-09-2023
# Reason to set default theme option when new tenant created
def set_default_theme(sender, tenant, **kwargs):
    if tenant.schema_name == get_public_schema_name():
        return  # tenant_app tables only exist inside restaurant schemas
    app_theme=AppTheme.objects.first()
    if(app_theme):
        with connection.cursor() as cursor:
            # Modified by pratap sahu on 27-09-2023 to set default values on fields
            # cursor.execute("INSERT into "+tenant.tenant_name+
            #                ".tenant_app_setting(app_theme_id,allow_half_price,allow_loyality_points,discount_in) values("+str(app_theme.id)+",true,true,'Discount in (%)')")
            schema = tenant.schema_name
            if schema and schema.replace('_', '').isalnum():
                cursor.execute(
                    'INSERT INTO "%s".tenant_app_setting '
                    '(app_theme_id,allow_half_price,allow_loyality_points,discount_in,'
                    'per_loyality_point_value,amount_for_single_loyality_point,cgst,sgst,gstin,fssaino,whatsapp_number) '
                    'VALUES (%%s, true, true, %%s, 0, 0, 0.0, 0.0, \'\', \'\', \'\')' % schema,
                    [app_theme.id, 'Discount in (%)'],
                )
            #End of Code by pratap sahu on 27-09-2023 to set default values on fields
post_schema_sync.connect(set_default_theme, sender=TenantMixin)
# End of Addition by pratap sahu on 22-09-2023
# Reason to set default theme option when new tenant created

"""-------------------------------------------------------------------
Added by - Yuvraj Sahu on 18-02-2023
Reason - To store otp for forget password
"""
class Otp(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6, default='')
    otptime = models.DateTimeField(auto_now_add=True,null=True, blank=True)
    created_at = models.DateField(auto_now_add=True,blank=True)

    def __str__(self):
        return self.email
        
    class Meta:
        verbose_name_plural = 'OTP Time'
"""
End of code addition
""" 

"""-------------------------------------------------------------------
Added by - Yuvraj Sahu on 24-03-2023
Reason - To store settings of react native app
"""
class AppSetting(models.Model):
    # added by rohan kansari - 20/4/23
    # reason- To add validation on image , admin not able to add image more than 200kb
    # Modiefied - 21/4/23 - to Handel image resave error
     # Commented by Rohan kansari- 11/5/23 - define it globally
    # def validate_image(fieldfile_obj):
    #   try:
    #     filesize = fieldfile_obj.file.size
    #     megabyte_limit = 200
    #   except:
    #     try:  
    #         import os # new
    #         from pathlib import Path
    #         filesize=os.path.getsize(fieldfile_obj.file.name)
    #         print(filesize)
    #         megabyte_limit = 200
    #         if filesize > megabyte_limit*1024:
    #             raise ValidationError("Max file size is %skb" % str(megabyte_limit))
    #     except:
    #             return     
    #   if filesize > megabyte_limit*1024:
    #         raise ValidationError("Max file size is %skb" % str(megabyte_limit))
    # End of commentation - Rohan kansari - 11/5/23
     # end of code - rohan - 20/4/23
     app_logo=models.ImageField(upload_to='images/app_setting/',blank=True,null=True,validators=[validate_image])
     adyant_logo=models.ImageField(upload_to='images/app_setting/',blank=True,null=True,validators=[validate_image])
     title=models.CharField(max_length=30, default='')
     bottom_text=models.CharField(max_length=30, default='')
     adyant_webite_link=models.CharField(max_length=255, default='')
    # Added by Rohan kansari - 7/9/23 
    # Reason - To make support link editable
     adyant_support_link=models.CharField(max_length=255,default='',blank=True,null=True)  
     def __str__(self):
         return self.title
"""
End of code addition
"""      
"""-------------------------------------------------------------------
Added by - Om on 24-03-2023
Reason - To store settings of react native app
"""
class VisitCount(models.Model):
    id = models.AutoField(primary_key=True)
    tenant_name=models.CharField(max_length=255,default='')
    count =models.BigIntegerField(default=0)
"""
End of code addition
"""

"""-------------------------------------------------------------------
Added by - Om shrivastava on 10-04-2023
Reason - To store App theme on react native app
"""


class AppTheme(models.Model):
    id = models.AutoField(primary_key=True)
    background_color =models.CharField(max_length=20,null=True,blank=True)
    # Added by Om shrivastava on 15-05-23
    # Reason : show the name of background color
    background_color_label =models.CharField(max_length=20,default='')
    # End of addition by Om Shrivastava on 15-05-23
    heading_color =models.CharField(max_length=20,null=True,blank=True)
    # Added by Om shrivastava on 15-05-23
    # Reason : show the name of background color
    heading_color_label =models.CharField(max_length=20,default='')
    # End of addition by Om Shrivastava on 15-05-23
    subheading_color =models.CharField(max_length=20,null=True,blank=True)
    banner_heading_color =models.CharField(max_length=20,null=True,blank=True)
    heading_bgcolor =models.CharField(max_length=20,null=True,blank=True)
    subheading_bgcolor =models.CharField(max_length=20,null=True,blank=True)
    # Added by ROhan kansari - 28/4/23
    # Reason - To add one more card color
    card_color=models.CharField(max_length=20,null=True,blank=True)
    
    def __str__(self):
        return "Background Color: "+self.background_color_label+" | Heading Color: "+self.heading_color_label

"""
End of code addition
"""
"""
Added by - Suman Sahu on 24-03-2023
Reason - Create for Show pricing plans on home page 
"""


class WebsiteSetting(models.Model):

    # commented & modified by- Suman sahu  On 19/05/2023
    # reason- to make field mendatory
    
    # pricing_plan1 = models.ImageField(
    #     upload_to="images/app_setting/", blank=True, null=True
    # )

    pricing_plan1 = models.ImageField(
        upload_to="images/app_setting/", default=""
    )

    # pricing_plan2 = models.ImageField(
    #     upload_to="images/app_setting/", blank=True, null=True
    # )
    # pricing_plan3 = models.ImageField(
    #     upload_to="images/app_setting/", blank=True, null=True
    # )
    # pricing_plan4 = models.ImageField(
    #     upload_to="images/app_setting/", blank=True, null=True
    # )

    # title = models.CharField(max_length=30, default="")

    # commented by- Suman sahu On 20/05/2023
    # title = models.CharField(max_length=30, null=True, blank=True)
    # end of commented code by suman sahu on 20/05/2023

    # end of modification by- Suman sahu  On 19/05/2023

    # def __str__(self):
    #     return self.pricing_plan1


"""
End of code addition by- Suman sahu On 24/03/2023
"""


"""-------------------------------------------------------------------
Added by - Suman Sahu on 24-03-2023
Reason - Create for Show Gallery Details on home page 
"""


class GallerySettings(models.Model):
    
     # Modiefied by rohan - 21/4/23 - to Handel image resave error
    # Commented by Rohan kansari- 11/5/23 - define it globally
    # def validate_image(fieldfile_obj):
    #   try:
    #     filesize = fieldfile_obj.file.size
    #     megabyte_limit = 200
    #   except:
    #     try:  
    #         import os # new
    #         from pathlib import Path
    #         filesize=os.path.getsize(fieldfile_obj.file.name)
    #         print(filesize)
    #         megabyte_limit = 200
    #         if filesize > megabyte_limit*1024:
    #             raise ValidationError("Max file size is %skb" % str(megabyte_limit))
    #     except:
    #             return     
    #   if filesize > megabyte_limit*1024:
    #         raise ValidationError("Max file size is %skb" % str(megabyte_limit))
    # End of commentation - Rohan kansari - 11/5/23
        
        
    # Commented and modified by Suman sahu On 19/05/2023
    # reason- for make mendatory image field

    # gallery = models.ImageField(
    #     upload_to="images/app_setting/", blank=True, null=True,validators=[validate_image])

    gallery = models.ImageField(
        upload_to="images/app_setting/", default="",validators=[validate_image])
    title = models.CharField(max_length=30, default="")

    # End of code by Suman sahu On 19/05/2023

    def __str__(self):
        return self.title
    
    # Added by Om shrivastava on 25-05-23
    # Reason : Need to correct the spelling

    class Meta:
        verbose_name = "Gallery settings"
        verbose_name_plural = 'Gallery settings'

    # End of addition by Om Shrivastava on 25-05-23

"""
End of code addition by- Suman sahu On 24/03/2023
"""

"""-------------------------------------------------------------------
Added by - Suman Sahu on 13-04-2023
Reason - To store Restroscans requests 
"""


class GetRestroscansRequest(models.Model):
    id = models.AutoField(primary_key=True)
    restaurant_name = models.CharField(max_length=255, default="")
    owner_name = models.CharField(max_length=50, default="")
    email = models.EmailField()
    # mobile_number = models.CharField(max_length=15, default="", unique=True)
    mobile_number = models.CharField(max_length=15, default="")
    # Added  by pratap sahu on 21-11-2023 Reason :to add date time column for restaurant request
    created_at=models.DateTimeField(auto_now_add=True)
    # End of code by Pratap sahu on 21-11-2023 Reason :to add date time column

    def __str__(self):
        return self.restaurant_name


"""
End of code addition by- Suman sahu On 13-04-2023
"""

"""-------------------------------------------------------------------
Added by - Suman Sahu on 14-04-2023
Reason - To store Contact Us form 
"""


class ContactUsRequest(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default="")
    email = models.EmailField()
    # mobile_number = models.CharField(max_length=15, default="", unique=True)
    mobile_number = models.CharField(max_length=15, default="")
    query = models.TextField(max_length=255)

    def __str__(self):
        return self.name


"""
End of code addition by- Suman sahu On 14-04-2023
"""

"""
Added by - Suman Sahu on 17-05-2023
Reason - Create for Show pricing plans on home page 
"""


class PricingPlans(models.Model):

    # commented & modified by- Suman sahu  On 19/05/2023
    # reason- to make field mendatory

    # pricing_logo = models.ImageField(upload_to="images/app_setting/", blank=True, null=True)
    # pricing_title = models.CharField(max_length=50,null=True, blank=True)
    # content = RichTextField(blank=True, null=True)

    pricing_logo = models.ImageField(upload_to="images/app_setting/", default="")
    pricing_title = models.CharField(max_length=50,default="")
    
    # commented and modified by - Suman sahu On 22/05/2023
    # content = RichTextField(default="")
    content = RichTextField(default="<div></div>")
    # end of modification by suman sahu On 22/05/2023

    # end of modification by- Suman sahu  On 19/05/2023

    def __str__(self):
        return self.pricing_title

    # Added by Om shrivastava on 25-05-23
    # Reason : Need to correct the spelling

    class Meta:
        verbose_name_plural = 'Pricing plans'

    # End of addtion by Om Shrivastava on 25-05-23

"""
End of code addition by- Suman sahu On 17-05-2023
"""

"""-------------------------------------------------------------------
Added by - Suman Sahu on 18-05-2023
Reason - Create for Show Customer Feedback Details
"""


class CustomerFeedback(models.Model):     
    date = models.DateField(auto_now_add=True,blank=True)
    title = models.CharField(max_length=30, default="")
    description =models.TextField()

    def __str__(self):
        return self.title


"""
End of code addition by- Suman sahu On 18/05/2023
"""