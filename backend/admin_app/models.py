from django.db import models
from tenant_schemas.models import TenantMixin


"""-------------------------------------------------------------------
Added by - Yuvraj Sahu on 15-02-2023
Reason - To store tenant requests
"""
class RestaurantRequest(models.Model):
    id = models.AutoField(primary_key=True)
    restaurant_name =models.CharField(max_length=255, default='')
    # Modified by Yuvraj sahu on 29-3-2023
    # Reason - remove mandatory field from tag line
    tag_line = models.CharField(max_length=255, null=True, blank=True)
    # End of code modification
    restaurant_logo=models.ImageField(upload_to='images/tenantRequest/',blank=True,null=True)
     # Added by Om on 24-03-23
    # Reason: Show a restaurant background image
    restaurant_background_img = models.ImageField(upload_to='images/tenantBackgroundImage/',blank=True,null=True)
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
    tenant_name=models.CharField(max_length=255,default='')
    tenant_logo=models.ImageField(upload_to='images/tenant/',blank=True,null=True)
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

        self.restaurant_phone_number=self.restaurant_name.mobile_number
        # Added by Yuvraj Sahu on 29-3-2023
        # Reason - to make active when tenant create
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
     app_logo=models.ImageField(upload_to='images/app_setting/',blank=True,null=True)
     adyant_logo=models.ImageField(upload_to='images/app_setting/',blank=True,null=True)
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