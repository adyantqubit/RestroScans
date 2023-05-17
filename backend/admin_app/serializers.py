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
    restaurant_address = serializers.CharField(source = 'restaurant_name.address')

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

"""
Added by - Suman Sahu on 08/04/2023
Reason - To serialize WebsiteSetting models data
"""


class PricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteSetting
        fields = "__all__"


"""
End of code addition 08/04/2023
"""

"""
Added by - Suman Sahu on 09/04/2023
Reason - To serialize GallerySetting modals data
"""


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = GallerySettings
        fields = "__all__"


"""
End of code addition 09/04/2023
"""

"""
Added by - Suman Sahu on 13-04-2023
Reason - To serialize GetRestroscansRequest models data
"""


class GetRestroscansRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = GetRestroscansRequest
        fields = "__all__"


"""
End of code addition 13-04-2023
"""


"""
Added by - Suman Sahu on 14-04-2023
Reason - To serialize ContactUs models data
"""


class PostContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUsRequest
        fields = "__all__"


"""
End of code addition 14-04-2023
"""

"""
Added by - Suman Sahu on 19-04-2023
Reason - To serialize OurTopPatnersDetails models data
"""


class RestaurentPatnersSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantRequest
        fields = "__all__"


"""
End of code addition 19-04-2023
"""

"""
Added by - Suman Sahu on 17/05/2023
Reason - To serialize PricingPlans modals data
"""


class PricingPlansSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingPlans
        fields = "__all__"


"""
End of code addition by- Suman Sahu on 17/05/2023
"""