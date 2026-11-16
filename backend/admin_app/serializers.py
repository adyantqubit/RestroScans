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


class PublicTenantSerializer(TenantListSerializer):
    """The all-restaurants directory is public, so it leaves out internals (schema, plan, owner id)."""

    class Meta:
        model = Tenant
        fields = (
            'id', 'tenant_name', 'domain_url', 'restaurant_phone_number',
            'restaurant', 'restaurant_logo', 'restaurant_background_image', 'restaurant_address',
        )


"""
Added by - Yuvraj Sahu on 15-2-2023
Reason - To serialize User Registartion model's data
"""
class RestaurantRequestSerializer(serializers.ModelSerializer):
    """Self-registration: approval and partner flags are set by the platform admin only."""

    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)

    class Meta:
        model=RestaurantRequest
        fields='__all__'
        read_only_fields = ('is_active', 'is_partner', 'created_at', 'updated_at')

    def validate_email(self, value):
        return value.strip().lower()

    def validate(self, attrs):
        confirm = attrs.get('confirm_password') or self.initial_data.get('Confirm')
        if confirm and confirm != attrs.get('password'):
            raise serializers.ValidationError({'confirm_password': 'Password and Confirm Password should be same'})
        attrs['confirm_password'] = attrs.get('password')
        return attrs
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
End of code addition by- Suman sahu on 08/04/2023
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
End of code addition by- Suman sahu on 09/04/2023
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
End of code addition by- Suman sahu on 13-04-2023
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
End of code addition by- Suman sahu on 14-04-2023
"""

"""
Added by - Suman Sahu on 19-04-2023
Reason - To serialize OurTopPatnersDetails models data
"""


class RestaurentPatnersSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantRequest
        exclude = ('password', 'confirm_password')


"""
End of code addition by- Suman sahu on 19-04-2023
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

"""
Added by - Suman Sahu on 18/05/2023
Reason - To serialize CustomerFeedback modals data
"""


class CustomerFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerFeedback
        fields = "__all__"


"""
End of code addition by- Suman Sahu on 18/05/2023
"""