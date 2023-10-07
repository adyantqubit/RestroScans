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
    # Modification and addition by Om shrivastava on 30-09-23
    # Reason : Need to set the allow null true and required false
    # item_name = serializers.CharField(source='item_name.name')
    # offer_name = serializers.CharField(source = 'offer_name.offer_name')
    # item_discount = serializers.IntegerField(source='offer_name.discount')
    # item_fullprice = serializers.CharField(source='item_name.price_full')
    # item_halfprice = serializers.CharField(source='item_name.price_half')
    # item_image = serializers.ImageField(source='item_name.icon')
    # item_description = serializers.CharField(source='item_name.description')
    # item_type = serializers.CharField(source='item_name.item_type')
    # # Added by Om 
    # item_id = serializers.CharField(source='item_name.id') 
    # # End of addition
    item_name = serializers.CharField(source='item_name.name',allow_null=True,required=False)
    offer_name = serializers.CharField(source = 'offer_name.offer_name',allow_null=True,required=False)

    offer_id = serializers.CharField(source = 'offer_name.id',allow_null=True,required=False)

    item_discount = serializers.IntegerField(source='offer_name.discount',allow_null=True,required=False)
    item_fullprice = serializers.CharField(source='item_name.price_full',allow_null=True,required=False)
    item_halfprice = serializers.CharField(source='item_name.price_half',allow_null=True,required=False)
    item_image = serializers.ImageField(source='item_name.icon',allow_null=True,required=False)
    item_description = serializers.CharField(source='item_name.description',allow_null=True,required=False)
    item_type = serializers.CharField(source='item_name.item_type',allow_null=True,required=False)
    # Added by Om 
    item_id = serializers.CharField(source='item_name.id',allow_null=True,required=False) 
    # End of addition
    # End of modification and addition by Om shrivastava on 30-09-23
    # Reason : Need to set the allow null true and required false
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
	# Added by Yuvraj Sahu on 12-4-2023
	# Reason - to serialize foreignkey field fields
    background_color = serializers.CharField(source="app_theme.background_color",allow_null=True)
    heading_color = serializers.CharField(source="app_theme.heading_color",allow_null=True)
    subheading_color = serializers.CharField(source="app_theme.subheading_color",allow_null=True)
    
    # Added by rohan kansari - 20/4/23
    # reason- To get all other color
    banner_heading_color= serializers.CharField(source="app_theme.banner_heading_color",allow_null=True)
    heading_bgcolor= serializers.CharField(source="app_theme.heading_bgcolor",allow_null=True)
    subheading_bgcolor=serializers.CharField(source="app_theme.subheading_bgcolor",allow_null=True)
    #Added by rohan- 20/4/23
    
    # Added by ROhan kansari -28/4/23
    # Reason - Sending card color also 
    card_color=serializers.CharField(source="app_theme.card_color",allow_null=True)
    class Meta:
        model = Setting
        fields = '__all__'
# End of addition

# Added by Yuvraj Sahu on 11-4-23
# Reason : To serialize the setting table data
class SettingSaveSerializer(serializers.ModelSerializer):
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

# Added by Parineeta Gedam on 06-04-2023
# Reason : show the Customer Detail
class CustomerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerDetail
        fields = '__all__'

# End of added code 06-04-2023

# Added by Parineeta Gedam on 06-04-2023
# Reason : show the Order
class OrderSerializer(serializers.ModelSerializer):
    # Added by Rohan Kansari - 25/5/23
    # Reason - Creating other serialzer becuase it is conflicting with current other
    customer_number = serializers.CharField(source="customer_id.contact_number",allow_null=True,required=False)
    # Commented by ROhan kansari - 16/8/23 - because we created this field field in order table so no need 
    # to extract from customer detail
    # customer_name = serializers.CharField(source="customer_id.last_customer_name",allow_null=True,required=False)
    # Added by Rohan kansari - 28/7/23
    # Reason - To add last customer name column in response
    last_customer_name = serializers.CharField(source="customer_id.last_customer_name",allow_null=True,required=False)
    # End of code - Rohan kansari - 28/7/23 

    # Added by ROhan kansari - 16/7/23 - to send email also in data 
    # Commented by ROhan kansari - 16/8/23 - because we created this field field in order table so no need 
    # to extract from customer detail
    # customer_email = serializers.CharField(source="customer_id.email",allow_null=True,required=False)
    # ENd of code - Rohan kansari - 16/7/23
     # Added by ROhan kansari - 21/7/23 - to send customer laylity point also in data 
    customer_loyality_point = serializers.IntegerField(source="customer_id.loyality_points",allow_null=True,required=False)
    # end of code- Rohan kansari - 21/7/23 - to send customer laylity point also in data 
    class Meta:
        model = Order
        fields = '__all__'

# End of added code 06-04-2023

# Added by Yuvraj Sahu on 11-04-2023
# Reason : to serializer orders
class AllOrderSerializer(serializers.ModelSerializer):
     # Commented by ROhan kansari - 16/8/23 - because we created this field field in order table so no need 
    # to extract from customer detail
    # customer_name = serializers.CharField(source="customer_id.name")
    # Added by Om Shrivastava on 29-07-23
    # Reason - to get updated customer number and email id
    customer_number = serializers.CharField(source="customer_id.contact_number",allow_null=True,required=False)
     # Commented by ROhan kansari - 16/8/23 - because we created this field field in order table so no need 
    # to extract from customer detail
    # customer_email = serializers.CharField(source="customer_id.email",allow_null=True,required=False)

    # End of addition by Om Shrivastava on 29-07-23
    # Reason - to get updated customer number and email id

    # Added by yuvraj Sahu on 04-05-2023
    # Reason - to get updated customer name
    # Modified by Rohan kansari - 19/9/23 
    # Reason - To send and update null last customer detail if it is not present
    last_customer_name = serializers.CharField(source="customer_id.last_customer_name",allow_null=True,required=False)
    # End of code by Rohan kansari - 19/9/23 
    # Reason - To send and update null last customer detail if it is not present
    # End of addition by yuvraj Sahu on 04-05-2023
    # Added by Om Shrivastava on 18-06-23
    # Reason - to get loyality points of customer
    customer_loyality_point = serializers.IntegerField(source="customer_id.loyality_points")
    # End of addition by Om Shrivastava on 18-06-23
    class Meta:
        model = Order
        fields = '__all__'
# End of added code 06-04-2023

# Added by Parineeta Gedam on 06-04-2023
# Reason : show the Order Item
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

# Added by Rohan Kansari - 25/5/23
# Reason - Creating other serialzer becuase it is conflicting with current other
class OrderItemWithOrderIdSerializer(serializers.ModelSerializer):
    order_id = serializers.CharField(source="order_id.order_id",allow_null=True,required=False)
    class Meta:
        model = OrderItem
        fields = '__all__'
#End of code - ROhanKAnsari - 25/5/23 
# End of added code 06-04-2023


# Added by Om on 10-04-23
# Reason : serialize App theme for save
class AppThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppTheme
        fields = '__all__'

# End of addition
# Added by Parineeta Gedam on 06-04-2023
# Reason : show the payment method
class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = '__all__'
# End of added code 06-04-2023

# Added by - Ashish Dewangan on 28-04-2023
# Reason : To have serializer for FCM Devices token
class FcmNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FcmNotification
        fields = '__all__'
# End of added code 06-04-2023


# Added by Yuvraj Sahu on 25-05-23
# Reason : To serialize the social links table data
class SocialLinksSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLinks
        fields = '__all__'
# End of addition

# Added by :- Parineeta Gedam Date - 01-06-2023
# Reason : To have serializer for Reservation
class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
# End of added code by :- Parineeta Gedam Date 14-06-2023

# Added by Om Shrivastava on 14-06-23
# Reason: When user apply rating than show rating and review
class RatingReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model=RatingReview
        fields='__all__'
# End of addition by Om Shrivastava on 14-06-23


# Added by Rohan kansari - 9/9/23
# Reason - To serialize waiter table data
class WaiterSerializer(serializers.ModelSerializer):
    class Meta:
        model=Waiter
        fields='__all__'
# End of addition by Rohan kansari - 9/9/23
# Reason - To serialize waiter table data

# Added by Om Shrivastava on 29-09-23
# Reason : Set the Menu data, category and item data

class MenuSerializer(serializers.ModelSerializer):
    # Addition by Om Shrivastava on 05-10-23
    # Reason : Set the label and value for the dropdown
    label = serializers.CharField(source='name',allow_null=True,required=False)
    value = serializers.CharField(source='id',allow_null=True,required=False)
    # Addition by Om Shrivastava on 05-10-23
    # Reason : Set the label and value for the dropdown
    class Meta:
        model=Menu
        fields='__all__'

class CategorySerializer(serializers.ModelSerializer):
    # Addition by Om Shrivastava on 05-10-23
    # Reason : Set the label and value for the dropdown
    # Commented by Om Shrivastava on 06-10-23
    # Reason : Show the dropdown value with category and menu name
    label = serializers.CharField(source='name',allow_null=True,required=False)
    # End of commented code by Om Shrivastava on 06-10-23
    # Reason : Show the dropdown value with category and menu name
    value = serializers.CharField(source='id',allow_null=True,required=False)
    # Addition by Om Shrivastava on 05-10-23
    # Reason : Set the label and value for the dropdown
    menu_name = serializers.CharField(source='menu.name',allow_null=True,required=False)
    menu_id = serializers.CharField(source='menu.id',allow_null=True,required=False)
    # Addition by Om Shrivastava on 06-10-23
    # Reason : Set the category and related to menu name
    # label = serializers.SerializerMethodField(allow_null=True,required=False)

    # def get_label(self, obj):
    #     return '{} | {}'.format(obj.menu.name, obj.name) 
    # End of addition by Om Shrivastava on 06-10-23
    # Reason : Set the category and related to menu name
    
    class Meta:
        model=Category
        fields='__all__'

# class UserSerializer(serializers.ModelSerializer):
#     full_name = serializers.SerializerMethodField()

#     def get_full_name(self, obj):
#         return '{} {}'.format(obj.first_name, obj.last_name) 

class ItemSerializer(serializers.ModelSerializer):
    # Addition by Om Shrivastava on 05-10-23
    # Reason : Set the label and value for the dropdown
    # Commented by Om Shrivastava on 06-10-23
    # Reason : Show the dropdown value with category and menu name
    label = serializers.CharField(source='name',allow_null=True,required=False)
    # End of commented by Om Shrivastava on 06-10-23
    # Reason : Show the dropdown value with category and menu name
    value = serializers.CharField(source='id',allow_null=True,required=False)
    # Addition by Om Shrivastava on 05-10-23
    # Reason : Set the label and value for the dropdown
    category_name = serializers.CharField(source='category.name',allow_null=True,required=False)
    category_id = serializers.CharField(source='category.id',allow_null=True,required=False)
    category_img = serializers.ImageField(source='category.icon',allow_null=True,required=False)
    menu_name = serializers.CharField(source='category.menu.name',allow_null=True,required=False)
    menu_id = serializers.CharField(source='category.menu.id',allow_null=True,required=False)
    menu_img = serializers.ImageField(source='category.menu.icon',allow_null=True,required=False)
    # # Addition by Om Shrivastava on 06-10-23
    # # Reason : Set the category and related to menu name
    # label = serializers.SerializerMethodField(allow_null=True,required=False)

    # def get_label(self, obj):
    #     return '{} | {}| {}'.format(obj.category.menu.name,obj.category.name,obj.name) 
    # # End of addition by Om Shrivastava on 06-10-23
    # # Reason : Set the category and related to menu name

    class Meta:
        model=Item
        fields='__all__'   

# End of addition and modification by Om Shrivastava on 29-09-23
# Reason: Set the menu, category and item data

