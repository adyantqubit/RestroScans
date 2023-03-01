from rest_framework import serializers
from .models import *

class MenuListSerializer(serializers.ModelSerializer):
    class Meta:
        model=Menu
        fields='__all__'

class CategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields='__all__'

class ItemListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name')
    category_img = serializers.ImageField(source='category.icon')
    menu_name = serializers.CharField(source='category.menu.name')
    menu_img = serializers.ImageField(source='category.menu.icon')

    class Meta:
        model=Item
        fields='__all__'   

# Added by Om on 01-03-23
# Reason : Show the Offer details
class OfferBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = '__all__' 
  
class OfferItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferItem
        fields = '__all__' 

# End of addition