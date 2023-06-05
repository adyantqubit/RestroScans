from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import ugettext_lazy as _
from admin_app.models import *
from django.db.models import Avg
from django.core.exceptions import ValidationError
from django.conf import settings
from django.core.validators import validate_image_file_extension
from django import forms
from django.db.models.signals import post_save
from django.dispatch import receiver
import math  

# Create your models here.

"""-------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To store details of menu
"""

 # added by rohan kansari - 20/4/23
# reason- To add validation on image , admin not able to add image more than 200kb
# Modiefied by rohan - 21/4/23 - to Handel image resave error
def validate_image(fieldfile_obj): 
# #    try:      
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
        # Changes by Rohan Kansari- 11/5/23 - Change validation message    
        raise ValidationError("Please upload image below %skb" % str(megabyte_limit))
      except:
        return     
    if filesize > megabyte_limit*1024:
            # Changes by Rohan Kansari- 11/5/23 - Change validation message
            raise ValidationError("Please upload image below %skb" % str(megabyte_limit))
   
    
#    except: 
#        import os # new
#        from pathlib import Path
#        filesize=os.path.getsize(fieldfile_obj.file.name)
#        print(filesize)
#        megabyte_limit = 200
#        if filesize > megabyte_limit*1024:
#         raise ValidationError("Max file size is %skb" % str(megabyte_limit)) 
# end of code - rohan - 20/4/23
    
    
class Menu(models.Model):
    # Commented and modified by - Ashish Dewangan on 03-05-2023
    # Reason - To change label of table
    # name=models.CharField(max_length=30,default='')
    name=models.CharField(max_length=30,default='',verbose_name='Menu name')
    # End of code modification
    
    # modifi by- Suman sahu  On 07/05/2023
    # reason- change django default image field character validation message
    icon=models.ImageField( verbose_name="image", upload_to='images/menu/', null=True, validators=[validate_image, validate_image_file_extension])
    # End of addition 07/05/2023

    # Added by Yuvraj Sahu on 27-3-2-23
    # Reason - to give active and inactive
    is_active=models.BooleanField(default=False)
    # End of code addition
    def __str__(self):
        return self.name 
    # Added by Yuvraj Sahu on 29-3-2023
    # Reason - to arrange the table
    class Meta:
        verbose_name_plural = 'c) Menu'
    # End of addition
    
            
    # def clean_icon(self):
    #     icon = self.cleaned_data.get("icon")
    #     print(icon.path)
    #     if icon.size>200*1024:
    #         raise ValidationError("max size 200kb")
    #     return icon
"""
End of code addition
"""

"""-------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To store details of category
"""
class Category(models.Model):
    # added by rohan kansari - 20/4/23
    # reason- To add validation on image , admin not able to add image more than 200kb
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
   
    # end of code - rohan - 20/4/23
    
    menu=models.ForeignKey(Menu,related_name="menu",on_delete=models.CASCADE,default='',verbose_name='Menu name')
    name=models.CharField(max_length=30,default='',verbose_name='Category name')

    # Modified by- Suman sahu  On 07/05/2023
    # reason - change field name & change image default validation message
    icon=models.ImageField( verbose_name="image",upload_to='images/category/',null=True,blank=True,validators=[validate_image, validate_image_file_extension])
    # end of modification 07/05/2023

    # Added by Yuvraj Sahu on 27-3-2-23
    # Reason - to give active and inactive
    is_active=models.BooleanField(default=False)
    # End of code addition
    def __str__(self):
        return self.name
    # Added by Yuvraj Sahu on 29-3-2023
    # Reason - to arrange the table
    class Meta:
        verbose_name_plural = 'd) Category'
    # End of addition
"""
End of code addition
"""

"""-------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To store details of category Items
"""
# Added by Om on 28-03-2023
# Reason - add item type veg or nonveg
IMAGE_CHOICE = (
    ("Veg", "Veg"),
    ("Nonveg", "Nonveg"),
    ("Other", "Other"),
)
# End of addition
class Item(models.Model):
    
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
        
    category=models.ForeignKey(Category,related_name='category',on_delete=models.CASCADE,default='',verbose_name="Category name")
    name=models.CharField(max_length=30,default='',verbose_name="Item name")
     # Added by Om on 28-03-2023
    # Reason - add item type veg or nonveg
    item_type=models.CharField(choices=IMAGE_CHOICE, max_length=50,default='Other')
    # End of addition
    # Added by Om on 23-03-23
    # Reason : To show items image
    # icon=models.ImageField(upload_to='images/item/',default='')
    # End of addition
    price_full=models.DecimalField(null=True,blank=True,max_digits=6,decimal_places=2)
    price_half=models.DecimalField(null=True,blank=True,max_digits=6,decimal_places=2)
    #commented and Modified by Rohan kansari-16/4/23
    #reason- to increase description max length limitation
    # description=models.CharField(max_length=80,null=True,blank=True,)
    description=models.CharField(max_length=500,null=True,blank=True,)
	# end of code modification- by Rohan kansari - on 16/4/23
	 # Added by Yuvraj Sahu on 24-3-2023
    # Reason - add icon field

    # modified by- Suman sahu  On 07/05/2023
    # reason - change field name & change django image default validation message
    icon=models.ImageField( verbose_name="image", upload_to='images/item/', null=True,validators=[validate_image, validate_image_file_extension])
    # End of modification 07/05/2023

    # End of addition
    # Added by Yuvraj Sahu on 27-3-2-23
    # Reason - to give active and inactive
    is_active=models.BooleanField(default=False)
    # End of code addition
    
    # addede by rohan -13/4/23
    # reason- for calculating average rating from oorder item tabel
    #removed average rating because no more need of this field 
    best_seller=models.BooleanField(default=False)
    
    
    
    # end of code
    
    # Added by rohan kansari -20/4/23
    # reason - to add image validation ,admin not able to enter more then 200kb
    
    # def clean_icon(self):
    #     image = self.cleaned_data.get('image', False)
    #     if image:
    #         if image._size > 200*1024:
    #             raise ValidationError("Image file too large ( > 200kb )")
    #         return image
    #     else:
    #         raise ValidationError("Couldn't read uploaded image")
    
    def __str__(self):
        return self.name 
    # Added by Yuvraj Sahu on 29-3-2023
    # Reason - to arrange the table
    class Meta:
        verbose_name_plural = 'e) Item'
    # End of addition

    # AAdded by Om Shrivastava on 19-05-23
    # Reason : When best seller number is greater than zero than through a error

    def clean(self):
        obj = Item.objects.filter(best_seller = True)
        if (obj.count() >= 10):
           if self.best_seller is True:
                raise ValidationError({
            'best_seller': ValidationError("You have already selected 10 best seller"),
            }) 

    # End of addition by Om Shrivastava on 19-05-23
"""
End of code addition
"""

"""-------------------------------------------------------
Added by - Om Shrivastava on 01-03-2023
Reason - To store offer for every Items
"""
class Offer(models.Model):
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
    # Max Length changes by Om on 22-04-23
    # Offer name is not mandatory according to testing team, changes by Om on 22-04-23
    offer_name=models.CharField(max_length=40, verbose_name="Banner/Offer name") 
    # Commented and modified by Yuvraj Sahu on 30-4-2023
    # Reason - to save decimal value in discount

    # Commented and modified by Suman Sahu on 10-05-2023
    # Reason - to remove decimal value in discount

    # Modification and addition by Om Shrivastava on 24-05-23
    # Reason : Fix the discount value
    # discount = models.IntegerField(validators=[MinValueValidator(0),
    #                                    MaxValueValidator(99)],verbose_name='Discount(%)',null=True,blank=True)
    discount = models.IntegerField(validators=[MinValueValidator(1),
                                       MaxValueValidator(99)],verbose_name='Discount(%)',null=True,blank=True)
    # End of addition by Om Shrivastava on 24-05-23

    # discount = models.DecimalField(validators=[MinValueValidator(0),
    #                                    MaxValueValidator(99)],verbose_name='Discount(%)',null=True,blank=True, max_digits=4, decimal_places=1)
    # End of modification by Suman sahu 10/05/2023
    
    # End of modification
    # Added (null = True) by Om on 13-04-23
    # Reason : For update the offer banner image
    
    # modifi by- Suman sahu  On 07/05/2023
    # reason- change django default image field character validation message
    # Modified Rohan Kansari - 13/5/23 - TO allow blank true
    offer_image = models.ImageField(upload_to='images/offer/', verbose_name="Banner/Offer image",null=True,blank=True,validators=[validate_image, validate_image_file_extension])
    # End of modification 07/05/2023
    
    # End of addition
    description=models.TextField(null=True,blank=True)
    
    # Added by Rohan Kansari- 23/4/23
    # Reason - Adding video column for Banner and allow to give permission
    video_link=models.CharField(max_length=500,blank=True,null=True)

    # modified by - Suman sahu On 07/05/2023
    show_video_Hide_Image=models.BooleanField( verbose_name="Show Video",default=False)
     #End of modification - 07/05/2023

    #End of code - RohanKansari - 23/4/23
    
    def __str__(self):
        return self.offer_name
    
    class Meta:
        verbose_name = "Banner/Offer"
        verbose_name_plural = 'a) Banner/Offer'

    # Added by ROhan kansari - 11/5/23
    #  Reason - To validate video showing if video link field is blank then dont allow to check show video 
    def clean(self):
        if self.video_link is None:
           if self.show_video_Hide_Image is True:
                raise ValidationError({
            'show_video_Hide_Image': ValidationError("Please enter video link"),
            }) 
        # Modified Rohan Kansari - 13/5/23 - To allow img blank true and if video and image both null then raise error message  
        if self.video_link is None and bool(self.offer_image) is False:   
           raise ValidationError({
            'offer_image': ValidationError("This field is required if you are not entered video link"),
            }) 
    #End of code - Rohan kansari - 11/5/23    
          

class OfferItem(models.Model):
    id = models.AutoField(primary_key=True)
    offer_name=models.ForeignKey(Offer,verbose_name="Banner/Offer Name",related_name='offer_id',on_delete=models.CASCADE)
    item_name=models.ForeignKey(Item,related_name='item_id',on_delete=models.CASCADE,unique=True ,
                                # Added by Rohan Kansari - 11/5/23 - To correct validation message
                                error_messages ={"unique":"This item is already exists."})
    
    def __str__(self):
        return "Offer for Items"
    class Meta:
        verbose_name = "Banner/Offer Items"
        verbose_name_plural = 'b) Banner/Offer Items' 
 
"""
End of code addition
"""

"""-------------------------------------------------------
Added by - Om Shrivastava on 11-03-2023
Reason - To create footer and description table to show data in footer section
"""

# Commented by Om on 27-01-23
# Date : 27-03-23
# Reason : Not comes from backend
# class Footer(models.Model):
#     id = models.AutoField(primary_key=True)
#     content =models.CharField(max_length=40)
    
#     def __str__(self):
#         return self.content 
# End of commented code

class Description(models.Model):
    id = models.AutoField(primary_key=True)
    content =models.TextField()
    
    def __str__(self):
        # Commented and modified by Ashish Dewangan on 03-05-2023
        # Reason - To hide footer content as a label when we open footer model
        # return self.content 
        return '' 
        # End of code modification by Ashish Dewangan on 03-05-2023
    class Meta:
        verbose_name_plural = 'g) Footer Description'
"""
End of code addition
"""

"""-------------------------------------------------------
Added by - Om Shrivastava on 15-03-2023
Reason - To create Theme 
"""
class Setting(models.Model):
    id = models.AutoField(primary_key=True)
    # Commented by Om on 10-04-23
    # Reason : Not need to use these fields
    # background_color =models.CharField(max_length=20,null=True,blank=True)
    # heading_color =models.CharField(max_length=20,null=True,blank=True)
    # subheading_color =models.CharField(max_length=20,null=True,blank=True)
    # banner_heading_color =models.CharField(max_length=20,null=True,blank=True)
    # heading_bgcolor =models.CharField(max_length=20,null=True,blank=True)
    # subheading_bgcolor =models.CharField(max_length=20,null=True,blank=True)
    # End of commented code

    # Added by Om on 10-04-23
    # Reason : Need to implement admin color, whatever the admin add.
    app_theme = models.ForeignKey(AppTheme,related_name='app_theme',on_delete=models.CASCADE,null=True,blank=True)
    # End of addition
    # added by rohan- 6/4/23 Reason- to allow show half price 
    # removing null true blank true field beacuse of it is showing unknown in admin panel -14/4/23
    # cancel_btn=models.CharField(max_length=20,null=True,blank=True)
    allow_half_price=models.BooleanField(default=True)
    # Added by :- Parineeta Gedam
    # Date :- 08-04-2023
    # Reason :- for tax

    # Added by rohan -14/4/23
    # reason- To add cgst and scgt no. and remove tax
    # tax = models.FloatField(validators=[MinValueValidator(0),
    #                                    MaxValueValidator(99)],default=1.0,verbose_name='Tax(%)', null=True, blank=True)
    cgst=models.FloatField(validators=[MinValueValidator(0),
                                       MaxValueValidator(99)],default=0.0,verbose_name='CGST(%)', null=True, blank=True)
    sgst=models.FloatField(validators=[MinValueValidator(0),
                                       MaxValueValidator(99)],default=0.0,verbose_name='SGST(%)', null=True, blank=True)
    #commented and modified by rohankansari - on 16/4/23
    #reason - not wsetting gst and fssai no mandatory
    #gstin=models.CharField(max_length=50,default="",verbose_name="GstIn")
    #fssaino=models.CharField(max_length=50,default="",verbose_name="FSSAI NO")
    # Modified and added by Om Shrivastava on 15-05-23
    # Reason : Captiliase the verbose name of GstIn
    # gstin=models.CharField(max_length=50,default="",null=True,blank=True,verbose_name="GstIn")
    gstin=models.CharField(max_length=50,default="",null=True,blank=True,verbose_name="GSTIN")
    # End of modification and addition by Om Shrivastava on 15-05-23
    fssaino=models.CharField(max_length=50,default="",null=True,blank=True,verbose_name="FSSAI NO")
    #end of code modification by rohan kansari -on 16/4/23
    # End of added code 08-04-2023
    # end of addition 14/4/23 

    # Added by - Suman sahu  On 05/05/2023
    # Reason - for add whatsapp chatbot
    whatsapp_number = models.CharField(max_length=15,null= True, blank=True)
    # End of addition 05/05/2023
    
    # Added by - Om shrivastava On 26/05/2023
    # Reason - Check the loyality point is apply or not
    allow_loyality_points=models.BooleanField(default=False)
    per_loyality_point_value=models.IntegerField(null=True,blank=True,verbose_name='Per loyality point value (in ?)')
    amount_for_single_loyality_point=models.IntegerField(null=True,blank=True)
    # End of addition 26-05-23

    def __str__(self):
        return "Setting"
    # Added by Yuvraj Sahu on 29-3-2023
    # Reason - to arrange the table
    class Meta:
        verbose_name_plural = 'f) Setting'
    # End of addition


"""
End of code addition
"""

"""
Added by - Parineeta Gedam on 06-04-2023
Reason - To store customer detail
"""

# def validate_contact_number(value):
#     if value:
#         if(contact_number<10):
#             raise ValidationError("Expiry date can't be current or previous date") 
#         else:
#             return value

class CustomerDetail(models.Model):
    id = models.AutoField(primary_key=True)

    # Commented by :- Parineeta Gedam
    # Date :- 14-04-2023
    # Reason :- remove the name required validations

    # name = models.CharField(max_length=255)
    
    # End of Commented code 14-04-2023

    # Added by :- Parineeta Gedam
    # Date :- 14-04-2023
    # Reason :- remove the name required validations

    name = models.CharField(max_length=255, null=True, blank=True)
    
    # End of Commented code 14-04-2023

    email = models.EmailField(_('email address'), null=True, blank=True) 

    # Added by Om Shrivastava on 26-05-23
    # Reason : Need to show the Loyality points
    loyality_points = models.IntegerField(default=0, null=True,blank=True) 
    # End of addition by Om Shrivastava on 26-05-23

    # Commented by :- Parineeta Gedam
    # Date :- 14-04-2023
    # Reason :- remove the cantact_number validations unique = True 

    # contact_number = models.BigIntegerField(unique=True, 
    #             validators=[validate_contact_number]
    #                                         )
    # End of Commented code 14-04-2023

    # Added by :- Parineeta Gedam
    # Date :- 14-04-2023
    # Reason :- remove the cantact_number validations unique = True 

    # check contact number length validations
    def validate_mobile_number(contact_number):
        if len(contact_number) > 10:
            raise ValidationError("Contact number cannot be more than 10 digits")

    contact_number = models.CharField(max_length=10,validators=[validate_mobile_number])

    # End of Commented code 14-04-2023

    # Added by :- Parineeta Gedam
    # Date :- 17-04-2023
    # Reason :- latest name show 

    last_customer_name = models.CharField(max_length=255, null=True, blank=True)
    # Added by Yuvraj Sahu on 05-05-2023
    # Reason - to save latest email id of customer
    # Modified and added by Om Shrivastava on 15-05-23
    # Reason : Change the verbose name of email to last email
    # last_email = models.EmailField(_('email address'), null=True, blank=True)
    last_email = models.EmailField(_('Last email address'), null=True, blank=True)
    # End of modification and addition by Om Shrivastava on 15-05-23
    # End of addition by Yuvraj Sahu on 05-05-2023
    
    # End of Commented code 17-04-2023

    def __str__(self):
        return f"{self.last_customer_name}"

    class Meta:
        verbose_name = "Customer Detail"
        verbose_name_plural = 'h) Customer Detail'

"""
End of added code 06-04-2023
"""

"""
Added by - Parineeta Gedam on 06-04-2023
Reason - To store Order
"""
# Modified by :- Parineeta Gedam on 17-04-2023
ORDER_STATUS = (
    ("Placed", "Placed"),
    ("Confirm", "Confirm"),
    ("Cooked", "Cooked"),
    ("Served", "Served"),
    # Added by :- Parineeta Gedam on 13-05-2023
    ("Cancelled", "Cancelled"),
    # End of Added code by :- Parineeta Gedam on 13-05-2023
)

PAYMENT_STATUS = (
    ("Pending", "Pending"),
    ("Completed", "Completed"),
    # Added by :- Parineeta Gedam on 21-05-2023
    ("Paid", "Paid"),
    # End of Added code by :- Parineeta Gedam on 21-05-2023
)
# End of modified code on 17-04-2023

# Added by :- Parineeta Gedam on 13-05-2023
CANCELLED_BY = (
    ("Customer", "Customer"),
    ("Admin", "Admin"),
)
# End of added code by :- Parineeta Gedam on 13-05-2023

# Added by :- Parineeta Gedam on 13-05-2023
LOYALITY_STATUS = (
    ("is used", "is used"),
    ("not used", "not used"),
)
# End of added code by :- Parineeta Gedam on 13-05-2023

class Order(models.Model):
    id = models.AutoField(primary_key=True)
    order_id = models.CharField(max_length=255)

    # Commented and modified by - Ashish Dewangan on 03-05-2023
    # Reason - To add verbose name
    # customer_id = models.ForeignKey(CustomerDetail, on_delete=models.CASCADE)
    customer_id = models.ForeignKey(CustomerDetail, on_delete=models.CASCADE,verbose_name='Customer')
    # End of code modification by Ashish Dewangan on 03-05-2023

    table_number = models.CharField(max_length=255)
    sub_total = models.FloatField(default=0.0)
    total = models.FloatField(default=0.0)
    # Added by rohan -14/4/23
    # reason- removing tax field and adding other cgst,scgt and other option also
    # tax = models.FloatField(default=0)
    cgst=models.FloatField(default=0.0)
    sgst=models.FloatField(default=0.0)
    # Commented by ROhan Kansari - 29/4/23
    # Reason - Not needed yet 
    # pax=models.IntegerField(default=0)
    # sess=models.IntegerField(default=1)
    # dshr=models.CharField(max_length=100,null=True,blank=True)
    # capt=models.CharField(max_length=100,null=True,blank=True)
    # end of commeting - 29/4/23
    # end of code 14/4/23
    order_status = models.CharField(max_length=100,choices=ORDER_STATUS,default="Placed")
    payment_status = models.CharField(max_length=100,choices=PAYMENT_STATUS,default="Pending")
    # Modified and commented by Om Shrivastava on 11-05-23
    # Reason : Change the name of date field in this modal
    # date = models.DateTimeField(auto_now_add=True)
    date = models.DateTimeField(auto_now_add=True,verbose_name='Date & Time')
    # End of modified and commented by Om Shrivastava on 11-05-23
    payment_mode = models.CharField(max_length=100,null=True,blank=True)

    # Added By :- Parineeta Gedam Date :- 06-05-2023
    # Reason - to add discount type manual discount and final amount
    CHOICES = [('Discount in (?)','Discount in (?)'),('Discount in (%)','Discount in (%)')]
    discount_type=models.CharField(max_length=255, choices=CHOICES, default="Discount in (?)")
    manual_discount = models.FloatField(default=0.0, null=True, blank=True, verbose_name='Discount')
    final_amount = models.FloatField(default=0.0, null=True, blank=True)
    # End of added code date :- 06-05-2023

    # Added By Rohan Kansari - 4/5/23
    # Reason - To save overall review
    review=models.TextField(null=True,blank=True)

    # Added by Rohan kansari - 10/5/23
    # Reason - To save payment confirmation date and time 
    payment_confirmation_date_time=models.CharField(max_length=50,null=True,blank=True)

    # Added by :- Parineeta Gedam on 13-05-2023 
    # Reason :- for order cancel
    cancelled_by = models.CharField(max_length=100,choices=CANCELLED_BY,default="Admin",null=True,blank=True)
    cancel_reason = models.TextField(null=True,blank=True)
    # End of added code by :- Parineeta Gedam on 13-05-2023

    # Added by :- Om shrivastava on 26-05-23 
    # Reason :- for apply the loyality points
    apply_loyality_point = models.IntegerField(default=0,null=True,blank=True,)
    loyality_point_price = models.IntegerField(null=True,blank=True)
    # End of added code by :- Om shrivastava on 26-05-23

    # Added by :- Om shrivastava on 29-05-23 
    # Reason :- for check the loyality points status
    loyality_point_status = models.CharField(max_length=100,choices=LOYALITY_STATUS,default="not used",null=True,blank=True)
    # End of added code by :- Om shrivastava on 26-05-23

    # Added by :- Parineeta Gedam on 10-05-2023
    # Reason :- to check if discount type in (%) is should not be more then 100
    def clean(self) : 
        if self.discount_type == "Discount in (%)" and self.manual_discount > 100 :
            raise ValidationError({"manual_discount" : "Discount should not be more than 100"})
        
        # Added by :- Parineeta Gedam on 13-05-2023
        # reason :- if order status = cancelled then show the validations msg in cancel reason. 
        if self.order_status == "Cancelled" :
            raise ValidationError({"cancel_reason" : "Please give the cancel reason"})
        # End of added code on 13-05-2023

        # # Added by Om Shrivastava on 28-05-23
        # # Reason : Need to apply some condition for calculation the loyality point
        if int(self.customer_id.loyality_points) < int(self.apply_loyality_point) :
            raise ValidationError({'apply_loyality_point': "Please enter below the customer loyality point."})
        # End of addition by Om shrivastava on 28-05-23
        
    # End of added code on 10-05-2023

    def __str__(self):
        return f"{self.order_id}"

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = 'i) Order'

    # Added by Yuvraj Sahu on 24-4-2023
    # Reason - to update order item status based on order status
    def save(self, *args, **kwargs ):
        if self.order_status == "Confirm" :
           OrderItem.objects.filter(order_id__order_id=self.order_id, item_status="Pending").update(item_status="Confirm")
        # Added by Rohan kansari- 10/5/23
        if self.payment_status=="Completed" and self.payment_confirmation_date_time is None:
            from datetime import datetime
            self.payment_confirmation_date_time=datetime.now().strftime('%d/%m/%Y %H:%M') 
        #super().save( *args, **kwargs)


        # # Added by Om Shrivastava on 28-05-23
        # # Reason : Need to apply some condition for calculation the loyality point

        setting_data=Setting.objects.first()
        if setting_data.allow_loyality_points is True :
            if self.payment_status == 'Pending':
                if self.apply_loyality_point == 0:
                    pass
                else:
                    if self.loyality_point_status=='is used':
                        oldLoyality=Order.objects.get(order_id=self.order_id)
                        self.apply_loyality_point=oldLoyality.apply_loyality_point

                    else:
                        self.loyality_point_price = setting_data.per_loyality_point_value * self.apply_loyality_point
                        user_contact = self.customer_id.contact_number
                        CustomerDetail.objects.filter(contact_number=user_contact).update(loyality_points=self.customer_id.loyality_points-self.apply_loyality_point)
                        self.loyality_point_status='is used'
            
            if self.payment_status=='Paid':
                oldLoyalityPoint=Order.objects.get(order_id=self.order_id)
                self.apply_loyality_point=oldLoyalityPoint.apply_loyality_point 

            if self.payment_status == 'Completed':
                oldPoint=Order.objects.get(order_id=self.order_id)
                self.apply_loyality_point=oldPoint.apply_loyality_point
                get_loyality= math.floor(self.final_amount/setting_data.amount_for_single_loyality_point)
                print('loyality_point-------------------------->',get_loyality)
                user_no= self.customer_id.contact_number
                CustomerDetail.objects.filter(contact_number=user_no).update(loyality_points= self.customer_id.loyality_points + get_loyality)
        #  End of addition by Om Shrivastava on 28-05-23 
        
        # Added by :- Parineeta Gedam on 06-05-2023
        # Reason :- to update payment status, manual discont and final amount
        try :
            orderUpdate = Order.objects.get(order_id=self.order_id)
            orderUpdate.sub_total = self.sub_total
            orderUpdate.cgst=self.cgst
            orderUpdate.sgst = self.sgst
            orderUpdate.total = self.sub_total + self.cgst + self.sgst
            print("manual_discount ===========",self.manual_discount)

            if self.manual_discount:
                total = 0
                if self.discount_type == "Discount in (?)" :
                    # Modification and addition by Om Shrivastava on 30-05-23
                    # Reason : Show the loyality point calculation
                    # total =  self.sub_total - self.manual_discount
                    total =  self.sub_total - self.manual_discount - self.loyality_point_price
                    # End of addition and modification by Om Shrivastava on 30-05-23

                else :
                    total = self.sub_total - (self.sub_total * self.manual_discount / 100)
                print("total=====", total)
                orderUpdate.total = float("{:.2f}".format(total))
                print("orderUpdate.total ", orderUpdate.total )
                
                tax = Setting.objects.first()
                if tax is not None:
                    if tax.sgst is None:
                        tax.sgst = 0
                    if tax.cgst is None:
                        tax.cgst = 0
                    cgst = ( orderUpdate.total*(tax.cgst)/100)
                    self.cgst = round(float("{:.2f}".format(cgst)),2)
                    sgst = ( orderUpdate.total*(tax.sgst)/100)
                    self.sgst = round(float("{:.2f}".format(sgst)),2)
                    self.total= round(float("{:.2f}".format( orderUpdate.total)),2)
                    self.final_amount = round(float("{:.2f}".format( orderUpdate.total + cgst + sgst)),2)
                    print("cgst", self.cgst)
                    print("sgst", self.sgst)
                    print("total", orderUpdate.total)
                    print("self.final_amount",self.final_amount)
            else:
                tax = Setting.objects.first()
                if tax is not None:
                    if tax.sgst is None:
                        tax.sgst = 0
                    if tax.cgst is None:
                        tax.cgst = 0
                    
                    cgst = ( orderUpdate.sub_total*(tax.cgst)/100)
                    self.cgst = round(float("{:.2f}".format(cgst)),2)
                    sgst = ( orderUpdate.sub_total*(tax.sgst)/100)
                    self.sgst = round(float("{:.2f}".format(sgst)),2)
                    self.total= round(float("{:.2f}".format( orderUpdate.sub_total + cgst + sgst)),2)
                    self.final_amount = round(float("{:.2f}".format( orderUpdate.sub_total + cgst + sgst)),2)
                    print("save method -------- cgst", self.cgst)
                    print("sgst", self.sgst)
                    print("total", self.total)

                    # # Added by Om Shrivastava on 28-05-23
                    # # Reason : Need to apply some condition for calculation the loyality point
                    if self.payment_status == 'Completed' and self.loyality_point_status=='is used':
                        # print(self.sub_total,'22222222')
                        self.total = self.sub_total - self.loyality_point_price
                        # print(round(float("{:.2f}".format(self.total)),2))
                        cgst = ( self.total*(tax.cgst)/100)
                        self.cgst = round(float("{:.2f}".format(cgst)),2)
                        sgst = ( self.total*(tax.sgst)/100)
                        self.sgst = round(float("{:.2f}".format(sgst)),2)
                        self.final_amount = round(float("{:.2f}".format( self.total + cgst + sgst)),2)
                    #  End of addition by Om Shrivastava on 28-05-23 


        except Exception as e:
            print("Exception in save method of order - ",e)
        # End of added code on 06-05-2023

        super().save( *args, **kwargs)
    # End of addition

    # Removed BY rohan kansari - 11/5/23 
    # Reason - directly assigning string date in organize way
    # def __unicode__(self):
    #     return "%s" % (self.payment_confirmation_date_time.strftime('%m/%d/%Y %H:%M %p'))

    


"""
End of added code 06-04-2023
"""

"""
Added by - Parineeta Gedam on 06-04-2023
Reason - To store Order Item
"""

# Modified by :- Parineeta Gedam on 17-04-2023
ITEM_STATUS = (
    ("Pending", "Pending"),
    # Commented and modified by - Ashish Dewangan on 19-04-2023
    # Reason - To have confirm status instead of completed for order item
    # ("Completed", "Completed"),
    ("Confirm", "Confirm"),
    # End of code modification by Ashish Dewangan on 19-04-2023 

    # Added by :- Parineeta Gedam on 13-05-2023
    ("Cancelled", "Cancelled"),
    # End of added code by :- Parineeta Gedam 
)

# Added by :- Parineeta Gedam on 19-05-2023
SERVING_SIZE = (
    ("Half", "Half"),
    ("Full", "Full"),
)

class OrderItem(models.Model):
    id = models.AutoField(primary_key=True)
    order_id = models.ForeignKey(Order,on_delete=models.CASCADE)
    item_id= models.ForeignKey(Item,blank=True,null=True,on_delete=models.CASCADE)

    # Commented and modified by - Ashish Dewangan on 03-05-2023
    # Reason - To add verbose name
    # item = models.CharField(max_length=255)
    item = models.CharField(max_length=255,verbose_name='Item name')
    # End of code modification by Ashish Dewangan on 03-05-2023

    # Modified by :- Parineeta Gedam on 19-05-2023 
    # Reason :- add choice field 
    # serving_size = models.CharField(max_length=255,)
    serving_size = models.CharField(max_length=255,choices=SERVING_SIZE)
    # End of modified code on 19-05-2023

    quantity = models.IntegerField(default=0)
    price = models.FloatField(default=0)
    rating = models.DecimalField(null=True, blank=True, max_digits=2,validators=[MinValueValidator(1),MaxValueValidator(5.0)],decimal_places=1)
    review = models.TextField(null=True, blank=True)
    # Modified and commented by Om Shrivastava on 11-05-23
    # Reason : Change the name of date field in this modal
    # date = models.DateTimeField(auto_now_add=True)
    date = models.DateTimeField(auto_now_add=True,verbose_name='Date & Time')
    # End of modification and addition by Om Shrivastava on 11-05-23

    # Modified by :- Parineeta Gedam 17-04-2023
    item_status = models.CharField(max_length=100,choices=ITEM_STATUS,default="Pending")
    # End of modified code 17-04-2023

    # Added by :- Parineeta Gedam on 18-05-2023 
    # Reason :- for order cancel
    cancel_reason = models.TextField(null=True,blank=True)
    # End of added code by :- Parineeta Gedam on 18-05-2023

    # Commented and modified by - Ashish Dewangan on 24-04-2023
    # Reason - To show details of each order item properly 
    # def __str__(self):
    #     return f"{self.order_id, self.item, self.serving_size, self.quantity, self.price}"
    def __str__(self):
        # Commented and modified by Om shrivastava on 06-05-23
        # Reason : To change the return statement inside the orderitem table
        # return f"  order ID: {self.order_id} | Item Name : {self.item} | Size : {self.serving_size} | Quantity : {self.quantity} | Price : {self.price} "
        return 'Order item' 
        #End of code modification by Om shrivastava on 06-05-23
    #End of code modification by Ashish Dewangan on 24-04-2023

    class Meta:
        verbose_name = "Order Item"
        verbose_name_plural = 'j) Order Item'

    # Added by Suman Sahu on 07-05-2023
    # Reason - to update order status based on item status
    def save(self, *args, **kwargs ):
        if self.item_status == "Confirm" :
            orderItemObj = OrderItem.objects.filter(order_id = self.order_id)
            obj = orderItemObj.filter(item_status = "Pending").count()
            if obj == 1:
                orderObj = Order.objects.get(order_id = self.order_id)
                orderObj.order_status="Confirm"
                orderObj.save()

        # Added by :- Parineeta Gedam on 18-05-2023
        # Reason :- If admin increase or decrese the qunatity of any item then again re-calculations for price and in order table for sub_total, cgst, sgst, total, final amount. 

        allOffer = OfferItem.objects.all()
        discounted = 0
        if allOffer.filter(item_name=self.item_id).count() > 0:
            if allOffer.get(item_name=self.item_id).offer_name.discount is not None:
               discounted = allOffer.get(item_name=self.item_id).offer_name.discount
        if (self.serving_size == "Half"):
            price = float(self.item_id.price_half)*float(self.quantity) - float(
                float(self.item_id.price_half) * float(self.quantity) /100)* float(discounted)
        else:
            price = float(self.item_id.price_full)*float(self.quantity)-float(
                float(self.item_id.price_full) * float(self.quantity) /100)*float(discounted)
            
        self.price = price
        # super().save( *args, **kwargs)

        # End of added code by :- Parineeta Gedam on 18-05-2023
        super().save( *args, **kwargs)
    # End of addition 07/05/2023

    # Added by :- Parineeta Gedam on 18-05-2023
    # reason :- if item status = cancelled then show the validations msg in cancel reason.
    def clean(self) : 
        if self.item_status == "Cancelled" and self.cancel_reason is None :
            raise ValidationError({"cancel_reason" : "Please give the cancel reason"})
    # End of added code on 18-05-2023

# Added by:- Parineeta Gedam on :- 21-05-2023
# reason :- If admin increase or decrese the qunatity of any item then again re-calculations for price and in order table for sub_total, cgst, sgst, total, final amount.  

@receiver(post_save, sender=OrderItem)
def my_handler(sender,instance, **kwargs, ):
    orderItemObject = OrderItem.objects.filter(order_id = instance.order_id)
    itemsPrice = []
    for cart in orderItemObject:
        if(cart.item_status != "Cancelled") :
            price = cart.price
            itemsPrice.append(price)
    order = Order.objects.get(order_id = instance.order_id)
    subTotal = round(float("{:.2f}".format(sum(itemsPrice))),2)
    order.sub_total=subTotal
    order.save()
    # tax = Setting.objects.first()
    # if tax is not None:
    #     if tax.sgst is None:
    #         tax.sgst = 0
    #     if tax.cgst is None:
    #         tax.cgst = 0
    #     cgst = round(float("{:.2f}".format(subTotal*(tax.cgst)/100)),2)
    #     sgst = round(float("{:.2f}".format(subTotal*(tax.sgst)/100)),2)
    #     total = round(float("{:.2f}".format(subTotal + cgst + sgst)),2)
    #     finalAmount = round(float("{:.2f}".format(subTotal + cgst + sgst)),2)
    # orderId.update(sub_total = subTotal, cgst = cgst, sgst=sgst, total = total, final_amount = finalAmount)
# End of added code by :- Parineeta Gedam on 21-05-2023
   
"""
End of added code 06-04-2023
"""
"""
Added by - Parineeta Gedam on 11-04-2023
Reason - To store scanner
"""
class PaymentMethod(models.Model):
     # added by rohan kansari - 20/4/23
    # reason- To add validation on image , admin not able to add image more than 200kb
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
    
    # modifi by- Suman sahu  On 07/05/2023
    # reason- change django default image field character validation message
    scanner = models.ImageField(upload_to='scanner/', null=True,
              validators=[validate_image_file_extension])
    # End of modification 07/05/2023

    # Added by :- Parineeta Gedam
    # Date :- 15-04-2023
    # Reason :- show the name and contact number

    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=255, null=True, blank=True)

    # check contact number length validations
    def validate_mobile_number(contact_number):
        if len(contact_number) > 10:
            raise ValidationError("Contact number cannot be more than 10 digits")

    contact_number = models.CharField(max_length=10,validators=[validate_mobile_number],null=True,blank=True)

    # End of added code 15-04-2023


    class Meta:
        verbose_name = "Payment Method"
        # Modified and added by Om Shrivastava on 10-05-23
        # Reason : Correct the arrangement in payment method 
        # verbose_name_plural = 'j) Payment Method'
        verbose_name_plural = 'k) Payment Method'
        # End of addition by Om Shrivastava on 10-05-23

    def __str__(self):
        # Modified and added by Om on 06-06-23
        # Reason : Show the appropriate return in payment method modal
        # return f"{self.scanner}"
        return 'Payment details' 
        # End of addition by Om on 06-05-23

"""
End of added code 11-04-2023
"""

# Added by - Ashish Dewangan on 28-04-2023
# Reason - To have notification model
from fcm_django.models import AbstractFCMDevice
class FcmNotification(AbstractFCMDevice):
    name=models.CharField(max_length=20,default='')
    phone_number=models.CharField(max_length=10,default='')
# End of code addition by Ashish Dewangan on 28-04-2023


"""
Added by Yuvraj Sahu on 25-05-2023
Reason - to save social links
"""
class SocialLinks(models.Model):
    social_media_name = models.CharField(max_length=255, blank=True, null=True)
    # Modified by Yuvraj Sahu on 04-06-2023
    # Reason - to make mandatory
    social_media_link = models.TextField(default="")
    social_media_icon = models.ImageField(upload_to='social/', default="",
    # End of addition by Yuvraj Sahu on 04-06-2023
              validators=[validate_image_file_extension])
    class Meta:
        verbose_name = "Social Link"
        verbose_name_plural = 'M) Social Links'
    def __str__(self):
        return 'Social Link'
"""
End of addition by yuvraj Sahu on 25-05-2023
"""