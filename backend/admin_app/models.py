from django.db import models
from tenant_schemas.models import TenantMixin

"""-------------------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To have tenant table where tenant's information will be stored
"""
class Tenant(TenantMixin):
    tenant_name=models.CharField(max_length=255,default='')
    tenant_logo=models.ImageField(upload_to='images/tenant/',blank=True,null=True)
    active=models.BooleanField(default=False)
    created_at=models.DateField(auto_now=True)
    updated_at=models.DateField(auto_now=True)
    
    def __str__(self):
            return self.tenant_name
"""
End of code addition
"""


"""-------------------------------------------------------------------
Added by - Yuvraj Sahu on 15-02-2023
Reason - To store tenant requests
"""
class RestaurantRequest(models.Model):
    id = models.AutoField(primary_key=True)
    restaurant_name =models.CharField(max_length=255, default='')
    tag_line = models.CharField(max_length=255, default='')
    restaurant_logo=models.ImageField(upload_to='images/tenantRequest/',blank=True,null=True)
    owner_name = models.CharField(max_length=255, default='')
    email =models.EmailField()
    mobile_number =models.CharField(max_length=15, default='')
    telephone_number =models.CharField(max_length=15, default='')
    password = models.CharField(max_length=500, null=True)
    confirm_password = models.CharField(max_length=500, null=True)
    address =models.TextField()
    is_active = models.BooleanField(default=False)
    created_at = models.DateField(auto_now=True)
    updated_at = models.DateField(auto_now=True)
    
    def __str__(self):
            return self.restaurant_name
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