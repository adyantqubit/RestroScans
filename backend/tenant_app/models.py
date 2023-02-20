from django.db import models

# Create your models here.


"""-------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To store details of menu
"""
class Menu(models.Model):
    name=models.CharField(max_length=255,default='')
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
    menu=models.ForeignKey(Menu,related_name="menu",null=True,blank=True,on_delete=models.CASCADE)
    name=models.CharField(max_length=255,default='')
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
    category=models.ForeignKey(Category,related_name='category',null=True,blank=True,on_delete=models.CASCADE)
    name=models.CharField(max_length=255,default='')
    price_full=models.DecimalField(null=True,blank=True,max_digits=9,decimal_places=2)
    price_half=models.DecimalField(null=True,blank=True,max_digits=9,decimal_places=2)
    description=models.TextField()
    def __str__(self):
        return self.name 
"""
End of code addition
"""
     