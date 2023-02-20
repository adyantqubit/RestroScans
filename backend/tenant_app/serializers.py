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
    class Meta:
        model=Item
        fields='__all__'        