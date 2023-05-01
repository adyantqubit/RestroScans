from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import ugettext_lazy as _
from admin_app.models import *
from django.db.models import Avg
from django.core.exceptions import ValidationError
from django.conf import settings

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
        raise ValidationError("Max file size is %skb" % str(megabyte_limit))
      except:
        return     
    if filesize > megabyte_limit*1024:
            raise ValidationError("Max file size is %skb" % str(megabyte_limit))
   
    
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

    name=models.CharField(max_length=30,default='')
    icon=models.ImageField( verbose_name="image", upload_to='images/menu/', null=True, validators=[validate_image])
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
    
    menu=models.ForeignKey(Menu,related_name="menu",on_delete=models.CASCADE,default='',verbose_name='Menu name')
    name=models.CharField(max_length=30,default='',verbose_name='Category name')
    icon=models.ImageField(upload_to='images/category/',null=True,blank=True,validators=[validate_image])
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
    icon=models.ImageField(upload_to='images/item/', null=True,validators=[validate_image])
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
    # Max Length changes by Om on 22-04-23
    # Offer name is not mandatory according to testing team, changes by Om on 22-04-23
    offer_name=models.CharField(max_length=40, verbose_name="Banner/Offer name") 
    # Commented and modified by Yuvraj Sahu on 30-4-2023
    # Reason - to save decimal value in discount
    # discount = models.IntegerField(validators=[MinValueValidator(0),
    #                                    MaxValueValidator(99)],verbose_name='Discount(%)',null=True,blank=True)
    discount = models.DecimalField(validators=[MinValueValidator(0),
                                       MaxValueValidator(99)],verbose_name='Discount(%)',null=True,blank=True, max_digits=4, decimal_places=1)
    # End of modification
    # Added (null = True) by Om on 13-04-23
    # Reason : For update the offer banner image
    offer_image = models.ImageField(upload_to='images/offer/', verbose_name="Banner/Offer image",null=True,validators=[validate_image])
    # End of addition
    description=models.TextField(null=True,blank=True)
    
    # Added by Rohan Kansari- 23/4/23
    # Reason - Adding video column for Banner and allow to give permission
    video_link=models.CharField(max_length=500,blank=True,null=True)
    show_video_Hide_Image=models.BooleanField(default=False)
    #End of code - RohanKansari - 23/4/23
    
    def __str__(self):
        return self.offer_name
    
    class Meta:
        verbose_name = "Banner/Offer"
        verbose_name_plural = 'a) Banner/Offer'

class OfferItem(models.Model):
    id = models.AutoField(primary_key=True)
    offer_name=models.ForeignKey(Offer,verbose_name="Banner/Offer Name",related_name='offer_id',on_delete=models.CASCADE)
    item_name=models.ForeignKey(Item,related_name='item_id',on_delete=models.CASCADE,unique=True)
    
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
        return self.content 
    
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
    gstin=models.CharField(max_length=50,default="",null=True,blank=True,verbose_name="GstIn")
    fssaino=models.CharField(max_length=50,default="",null=True,blank=True,verbose_name="FSSAI NO")
    #end of code modification by rohan kansari -on 16/4/23
    # End of added code 08-04-2023
    # end of addition 14/4/23 
    
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
    
    # End of Commented code 17-04-2023

    def __str__(self):
        return f"{self.name}"

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
)

PAYMENT_STATUS = (
    ("Pending", "Pending"),
    ("Completed", "Completed"),
)
# End of modified code on 17-04-2023

class Order(models.Model):
    id = models.AutoField(primary_key=True)
    order_id = models.CharField(max_length=255)
    customer_id = models.ForeignKey(CustomerDetail, on_delete=models.CASCADE)
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
    date = models.DateTimeField(auto_now_add=True)
    payment_mode = models.CharField(max_length=100,null=True,blank=True)

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
        super().save( *args, **kwargs)
    # End of addition


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
)

class OrderItem(models.Model):
    id = models.AutoField(primary_key=True)
    order_id = models.ForeignKey(Order,on_delete=models.CASCADE)
    item_id= models.ForeignKey(Item,blank=True,null=True,on_delete=models.CASCADE)
    item = models.CharField(max_length=255)
    serving_size = models.CharField(max_length=255)
    quantity = models.IntegerField(default=0)
    price = models.FloatField(default=0)
    rating = models.DecimalField(null=True, blank=True, max_digits=2,validators=[MinValueValidator(1),MaxValueValidator(5.0)],decimal_places=1)
    review = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    # Modified by :- Parineeta Gedam 17-04-2023
    item_status = models.CharField(max_length=100,choices=ITEM_STATUS,default="Pending")
    # End of modified code 17-04-2023

    # Commented and modified by - Ashish Dewangan on 24-04-2023
    # Reason - To show details of each order item properly 
    # def __str__(self):
    #     return f"{self.order_id, self.item, self.serving_size, self.quantity, self.price}"
    def __str__(self):
        return f"  order ID: {self.order_id} | Item Name : {self.item} | Size : {self.serving_size} | Quantity : {self.quantity} | Price : {self.price} "
    #End of code modification by Ashish Dewangan on 24-04-2023

    class Meta:
        verbose_name = "Order Item"
        verbose_name_plural = 'j) Order Item'

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
    def validate_image(fieldfile_obj):
       try: 
        filesize = fieldfile_obj.file.size
        megabyte_limit = 200
        if filesize > megabyte_limit*1024:
            raise ValidationError("Max file size is %skb" % str(megabyte_limit))
        else:
            return True
       except: 
           import os # new
           from pathlib import Path
           filesize=os.path.getsize(fieldfile_obj.file.name)
           print(filesize)
           megabyte_limit = 200
           if filesize > megabyte_limit*1024:
            raise ValidationError("Max file size is %skb" % str(megabyte_limit))
    # end of code - rohan - 20/4/23
    
    scanner = models.ImageField(upload_to='scanner/', null=True)

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
        verbose_name_plural = 'j) Payment Method'

    def __str__(self):
        return f"{self.scanner}"

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