"""
Created by - Ashish Dewangan on 08-02-2023
Reason - To specify all serializers of admmin_app
"""

from rest_framework import serializers
from .models import *

"""
Added by - Ashish Dewangan on 08-02-2023
Reason - To serialize Tenant model's data
"""
class TenantListSerializer(serializers.ModelSerializer):
    # added by Om on 25-03-23
    # Reason : show the restaurant logo in UI site
    restaurant = serializers.CharField(source='restaurant_name.restaurant_name')
    restaurant_logo = serializers.ImageField(source = 'restaurant_name.restaurant_logo')
    restaurant_background_image = serializers.ImageField(source = 'restaurant_name.restaurant_background_img')
    # End of additionn
    class Meta:
        model=Tenant
        fields='__all__'


"""
Added by - Yuvraj Sahu on 15-2-2023
Reason - To serialize User Registartion model's data
"""
class RestaurantRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model=RestaurantRequest
        fields='__all__'
"""
End of code addition
""" 


"""
Added by - Yuvraj Sahu on 18-2-2023
Reason - To serialize Otp model's data
"""
class OtpSerializer(serializers.ModelSerializer):
    class Meta:
        model=Otp
        fields=["email"]
"""
End of code addition
""" 