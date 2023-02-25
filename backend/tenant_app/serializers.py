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