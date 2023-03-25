from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.


"""-------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To store details of menu
"""
class Menu(models.Model):
    name=models.CharField(max_length=13,default='')
    icon=models.ImageField(upload_to='images/menu/')
    def __str__(self):
        return self.name  
"""
End of code addition
"""

"""-------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To store details of category
"""
class Category(models.Model):
    menu=models.ForeignKey(Menu,related_name="menu",on_delete=models.CASCADE,default='')
    name=models.CharField(max_length=30,default='')
    icon=models.ImageField(upload_to='images/category/')
    def __str__(self):
        return self.name
"""
End of code addition
"""

"""-------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To store details of category Items
"""
class Item(models.Model):
    category=models.ForeignKey(Category,related_name='category',on_delete=models.CASCADE,default='')
    name=models.CharField(max_length=30,default='')
    # Added by Om on 23-03-23
    # Reason : To show items image
    icon=models.ImageField(upload_to='images/item/',default='')
    # End of addition
    price_full=models.DecimalField(null=True,blank=True,max_digits=9,decimal_places=2)
    price_half=models.DecimalField(null=True,blank=True,max_digits=9,decimal_places=2)
    description=models.TextField()
    # Added by Yuvraj Sahu on 24-3-2023
    # Reason - add icon field
    icon=models.ImageField(upload_to='images/item/', null=True)
    # End of addition
    def __str__(self):
        return self.name 
"""
End of code addition
"""

"""-------------------------------------------------------
Added by - Om Shrivastava on 01-03-2023
Reason - To store offer for every Items
"""
class Offer(models.Model):
    id = models.AutoField(primary_key=True)
    offer_name=models.CharField(max_length=30)
    discount = models.IntegerField(validators=[MinValueValidator(0),
                                       MaxValueValidator(99)],verbose_name='Discount(%)')
    offer_image = models.ImageField(upload_to='images/offer/')
    description=models.TextField(null=True,blank=True)
    
    def __str__(self):
        return self.offer_name 

class OfferItem(models.Model):
    id = models.AutoField(primary_key=True)
    offer_name=models.ForeignKey(Offer,related_name='offer_id',on_delete=models.CASCADE)
    item_name=models.ForeignKey(Item,related_name='item_id',on_delete=models.CASCADE)
    
    def __str__(self):
        return "Offer for Items"  
 
"""
End of code addition
"""

"""-------------------------------------------------------
Added by - Om Shrivastava on 11-03-2023
Reason - To create footer and description table to show data in footer section
"""
class Footer(models.Model):
    id = models.AutoField(primary_key=True)
    content =models.CharField(max_length=40)
    
    def __str__(self):
        return self.content 

class Description(models.Model):
    id = models.AutoField(primary_key=True)
    content =models.TextField()
    
    def __str__(self):
        return self.content 
"""
End of code addition
"""

"""-------------------------------------------------------
Added by - Om Shrivastava on 15-03-2023
Reason - To create Theme 
"""
class Setting(models.Model):
    id = models.AutoField(primary_key=True)
    background_color =models.CharField(max_length=8,null=True,blank=True)
    heading_color =models.CharField(max_length=8,null=True,blank=True)
    subheading_color =models.CharField(max_length=8,null=True,blank=True)
    banner_heading_color =models.CharField(max_length=8,null=True,blank=True)
    
    def __str__(self):
        return "color changed"

"""
End of code addition
"""