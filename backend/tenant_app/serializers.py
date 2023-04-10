from rest_framework import serializers
from .models import *

class MenuListSerializer(serializers.ModelSerializer):
    class Meta:
        model=Menu
        fields='__all__'

class CategoryListSerializer(serializers.ModelSerializer):
    menu_name = serializers.CharField(source='menu.name')
    # Added by Yuvraj Sahu on 8-4-2023
    # Reason - to get menu id
    menu_id = serializers.CharField(source='menu.id')
    # End of addition
    class Meta:
        model=Category
        fields='__all__'

# Added by Yuvraj Sahu on 23-3-2023
# Reason : serialize items for save
class CategorySaveSerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields='__all__'
# End of addition

class ItemListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name')
    # Added by Yuvraj Sahu on 7-4-2023
    # Reason - to get category id
    category_id = serializers.CharField(source='category.id')
    # End of addition
    category_img = serializers.ImageField(source='category.icon')
    menu_name = serializers.CharField(source='category.menu.name')
    # Added by Yuvraj Sahu on 4-4-2023
    # Reason - to get menu id in item list
    menu_id = serializers.CharField(source='category.menu.id')
    # End of addition
    menu_img = serializers.ImageField(source='category.menu.icon')

    class Meta:
        model=Item
        fields='__all__'   

# Added by Yuvraj Sahu on 23-3-2023
# Reason : serialize items for save
class ItemSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model=Item
        fields='__all__'
# End of addition

# Added by Om on 01-03-23
# Reason : Show the Offer details
class OfferBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = '__all__' 
  
class OfferItemsSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item_name.name')
    offer_name = serializers.CharField(source = 'offer_name.offer_name')
    item_discount = serializers.IntegerField(source='offer_name.discount')
    item_fullprice = serializers.CharField(source='item_name.price_full')
    item_halfprice = serializers.CharField(source='item_name.price_half')
    item_image = serializers.ImageField(source='item_name.icon')
    item_description = serializers.CharField(source='item_name.description')
    item_type = serializers.CharField(source='item_name.item_type')

    class Meta:
        model = OfferItem
        fields = '__all__'

# End of addition

# Added by Om on 11-03-23
# Reason : Show footer and description details
# class FooterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Footer
#         fields = '__all__'

class DescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Description
        fields = '__all__'
        
# End of addition

# Added by Om on 15-03-23
# Reason : Show the theme 
class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = '__all__'

# End of addition

# Added by Om on 09-04-23
# Reason : serialize offer items for save
class OfferallItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferItem
        fields = '__all__'

# End of addition
