from django.db import models
from tenant_schemas.models import TenantMixin
from django.core.exceptions import ValidationError

#Added by Rohan Kansari- 16/4/23
# Reason - To add plan Subcribtion feature where all feature is allow according to plan

# In this model, we 
class Plans(models.Model):
    plan_name=models.CharField(max_length=50,default="")
    
    class Meta:
        verbose_name_plural = "Plans"

    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To show title when we open row details   
    def __str__(self):
        return self.plan_name
    # End of code addition    
    
class Features(models.Model):
    feature_name=models.CharField(max_length=50,default="")   
    
    class Meta:
        verbose_name_plural = "Features"

    # Added by - Ashish Dewangan on 24-04-2023
    # Reason - To show title when we open row details   
    def __str__(self):
        return self.feature_name
    # End of code addition      
    
class PlannedFeatures(models.Model):
      plan_selected=models.ForeignKey(Plans,on_delete=models.CASCADE,blank=True,null=True)
      feature_selected=models.ForeignKey(Features,on_delete=models.CASCADE,blank=True,null=True)
      
      class Meta:
            verbose_name_plural = "Planned Features"
      
      # Added by - Ashish Dewangan on 24-04-2023
      # Reason - To show title when we open row details   
      def __str__(self):
          return "Edit feature of this plan"
      # End of code addition  
     
         
# end of code - Rohan Kansari - 16/4/23 


"""-------------------------------------------------------------------
Added by - Yuvraj Sahu on 15-02-2023
Reason - To store tenant requests
"""
class RestaurantRequest(models.Model):
     # added by rohan kansari - 20/4/23
    # reason- To add validation on image , admin not able to add image more than 200kb
    # Modiefied - 21/4/23 - to Handel image resave error
    def validate_image(fieldfile_obj):
      try:
        filesize = fieldfile_obj.file.size
        megabyte_limit = 200
      except:
        try:  
            import os # new
            from pathlib import Path
            filesize=os.path.getsize(fieldfile_obj.file.name)
            print(filesize)
            megabyte_limit = 200
            if filesize > megabyte_limit*1024:
                raise ValidationError("Max file size is %skb" % str(megabyte_limit))
        except:
                return     
      if filesize > megabyte_limit*1024:
            raise ValidationError("Max file size is %skb" % str(megabyte_limit))
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
    created_at = models.DateField(auto_now=True)
    updated_at = models.DateField(auto_now=True)

    # Added by:- Suman sahu On 20/04/2023
    # Reason:- Show patners details on the home page
    is_partner = models.BooleanField(default=False)
    # End of added code 20/04/2023

    def __str__(self):
            return self.restaurant_name
    
    # Added by Yuvraj Sahu on 29-3-2023
    # reason - to save password hash formate
    def save(self, *args, **kwargs ):
        try:
            rr=RestaurantRequest.objects.get(password=self.password)
            if(self.password!=rr.password):
                from django.contrib.auth.hashers import make_password, check_password
                self.password = make_password(self.password)
                self.confirm_password = make_password(self.confirm_password)
                super().save( *args, **kwargs)
            else:
                super().save( *args, **kwargs)     
        except Exception as e:
            from django.contrib.auth.hashers import make_password, check_password
            self.password = make_password(self.password)
            self.confirm_password = make_password(self.confirm_password)
            super().save( *args, **kwargs)
    # End of code addition
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
    Subscribe_plan=models.ForeignKey(Plans,on_delete=models.SET_NULL,blank=True,null=True)
    def __str__(self):
            return self.tenant_name
    # Added by Yuvraj Sahu on 28-3-2023
    # reason - to save tenant barcode svg
    def save(self, *args, **kwargs ):
        import os
        import pyqrcode
        from django.conf import settings

        # Added by Om on 03-04-23
        # Reason: Add visit count functionality
        try:
            visitCount=VisitCount.objects.get(tenant_name=self.tenant_name)
        except Exception as e:
             visitCount=VisitCount(count=0,tenant_name=self.tenant_name)
             visitCount.save()

        # End of addition 

        if self.restaurant_name:
            self.restaurant_phone_number=self.restaurant_name.mobile_number
        else:
            self.restaurant_phone_number=""    
        # Added by Yuvraj Sahu on 29-3-2023
        # Reason - to make active when tenant create
        if self.restaurant_name:
            restroObj = RestaurantRequest.objects.get(id=self.restaurant_name.id)
            restroObj.is_active = True
            restroObj.save()
        # End of addition
        url = pyqrcode.create(settings.HTTP_METHOD+self.domain_url+'/'+self.tenant_name+'/home')
        isExist = os.path.exists(os.path.join(settings.BASE_DIR, 'media/'+self.domain_url)+'/images/qrcode')
        if not isExist:
             os.makedirs(os.path.join(settings.BASE_DIR, 'media/'+self.domain_url)+'/images/qrcode')
        url.svg(os.path.join(settings.BASE_DIR, 'media/'+self.domain_url)+'/images/qrcode/qr.svg', scale=10 )
        super().save( *args, **kwargs)
        # End of code addition
"""
End of code addition
"""


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
     def validate_image(fieldfile_obj):
      try:
        filesize = fieldfile_obj.file.size
        megabyte_limit = 200
      except:
        try:  
            import os # new
            from pathlib import Path
            filesize=os.path.getsize(fieldfile_obj.file.name)
            print(filesize)
            megabyte_limit = 200
            if filesize > megabyte_limit*1024:
                raise ValidationError("Max file size is %skb" % str(megabyte_limit))
        except:
                return     
      if filesize > megabyte_limit*1024:
            raise ValidationError("Max file size is %skb" % str(megabyte_limit))
     # end of code - rohan - 20/4/23
     app_logo=models.ImageField(upload_to='images/app_setting/',blank=True,null=True,validators=[validate_image])
     adyant_logo=models.ImageField(upload_to='images/app_setting/',blank=True,null=True,validators=[validate_image])
     title=models.CharField(max_length=30, default='')
     bottom_text=models.CharField(max_length=30, default='')
     adyant_webite_link=models.CharField(max_length=255, default='')
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
    heading_color =models.CharField(max_length=20,null=True,blank=True)
    subheading_color =models.CharField(max_length=20,null=True,blank=True)
    banner_heading_color =models.CharField(max_length=20,null=True,blank=True)
    heading_bgcolor =models.CharField(max_length=20,null=True,blank=True)
    subheading_bgcolor =models.CharField(max_length=20,null=True,blank=True)
    
    def __str__(self):
        return "Background Color: "+self.background_color+" | Heading Color: "+self.heading_color

"""
End of code addition
"""
"""
Added by - Suman Sahu on 24-03-2023
Reason - Create for Show pricing plans on home page 
"""


class WebsiteSetting(models.Model):
    content = RichTextField(blank=True, null=True)
    pricing_plan1 = models.ImageField(
        upload_to="images/app_setting/", blank=True, null=True
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
    title = models.CharField(max_length=30, default="")
    bottom_text = models.CharField(max_length=30, default="")

    def __str__(self):
        return self.title


"""
End of code addition
"""


"""-------------------------------------------------------------------
Added by - Suman Sahu on 24-03-2023
Reason - Create for Show Gallery Details on home page 
"""


class GallerySettings(models.Model):
    
     # Modiefied by rohan - 21/4/23 - to Handel image resave error
    def validate_image(fieldfile_obj):
      try:
        filesize = fieldfile_obj.file.size
        megabyte_limit = 200
      except:
        try:  
            import os # new
            from pathlib import Path
            filesize=os.path.getsize(fieldfile_obj.file.name)
            print(filesize)
            megabyte_limit = 200
            if filesize > megabyte_limit*1024:
                raise ValidationError("Max file size is %skb" % str(megabyte_limit))
        except:
                return     
      if filesize > megabyte_limit*1024:
            raise ValidationError("Max file size is %skb" % str(megabyte_limit))
        
        
    gallery = models.ImageField(
        upload_to="images/app_setting/", blank=True, null=True,validators=[validate_image])
    title = models.CharField(max_length=30, default="")

    def __str__(self):
        return self.title


"""
End of code addition
"""

"""-------------------------------------------------------------------
Added by - Suman Sahu on 13-04-2023
Reason - To store Restroscans requests 
"""


class GetRestroscansRequest(models.Model):
    id = models.AutoField(primary_key=True)
    restaurant_name = models.CharField(max_length=255, default="")
    owner_name = models.CharField(max_length=255, default="")
    email = models.EmailField()
    mobile_number = models.CharField(max_length=15, default="", unique=True)

    def __str__(self):
        return self.restaurant_name


"""
End of code addition 13-04-2023
"""

"""-------------------------------------------------------------------
Added by - Suman Sahu on 14-04-2023
Reason - To store Contact Us form 
"""


class ContactUsRequest(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20, default="")
    email = models.EmailField()
    mobile_number = models.CharField(max_length=15, default="", unique=True)
    query = models.TextField()

    def __str__(self):
        return self.name


"""
End of code addition 13-04-2023
"""
