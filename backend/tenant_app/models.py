from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.


"""-------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To store details of menu
"""
class Menu(models.Model):
    name=models.CharField(max_length=30,default='')
    icon=models.ImageField(verbose_name="image", upload_to='images/menu/', null=True)
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
"""
End of code addition
"""

"""-------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To store details of category
"""
class Category(models.Model):
    menu=models.ForeignKey(Menu,related_name="menu",on_delete=models.CASCADE,default='',verbose_name='Menu name')
    name=models.CharField(max_length=30,default='',verbose_name='Category name')
    icon=models.ImageField(upload_to='images/category/',null=True,blank=True)
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
    ("Nonveg", "Nonveg")
)
# End of addition
class Item(models.Model):
    category=models.ForeignKey(Category,related_name='category',on_delete=models.CASCADE,default='',verbose_name="Category name")
    name=models.CharField(max_length=30,default='',verbose_name="Item name")
     # Added by Om on 28-03-2023
    # Reason - add item type veg or nonveg
    item_type=models.CharField(choices=IMAGE_CHOICE, max_length=50,default='')
    # End of addition
    # Added by Om on 23-03-23
    # Reason : To show items image
    # icon=models.ImageField(upload_to='images/item/',default='')
    # End of addition
    price_full=models.DecimalField(null=True,blank=True,max_digits=6,decimal_places=2)
    price_half=models.DecimalField(null=True,blank=True,max_digits=6,decimal_places=2)
    description=models.CharField(max_length=80,null=True,blank=True,)
	 # Added by Yuvraj Sahu on 24-3-2023
    # Reason - add icon field
    icon=models.ImageField(upload_to='images/item/', null=True)
    # End of addition
    # Added by Yuvraj Sahu on 27-3-2-23
    # Reason - to give active and inactive
    is_active=models.BooleanField(default=False)
    # End of code addition
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
    id = models.AutoField(primary_key=True)
    offer_name=models.CharField(max_length=30, verbose_name="Banner/Offer name")
    discount = models.IntegerField(validators=[MinValueValidator(0),
                                       MaxValueValidator(99)],verbose_name='Discount(%)')
    offer_image = models.ImageField(upload_to='images/offer/', verbose_name="Banner/Offer image")
    description=models.TextField(null=True,blank=True)
    
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
    background_color =models.CharField(max_length=20,null=True,blank=True)
    heading_color =models.CharField(max_length=20,null=True,blank=True)
    subheading_color =models.CharField(max_length=20,null=True,blank=True)
    banner_heading_color =models.CharField(max_length=20,null=True,blank=True)
    heading_bgcolor =models.CharField(max_length=20,null=True,blank=True)
    subheading_bgcolor =models.CharField(max_length=20,null=True,blank=True)

    
    def __str__(self):
        return "color changed"
    # Added by Yuvraj Sahu on 29-3-2023
    # Reason - to arrange the table
    class Meta:
        verbose_name_plural = 'f) Setting'
    # End of addition


"""
End of code addition
"""