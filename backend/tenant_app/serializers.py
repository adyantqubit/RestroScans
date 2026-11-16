"""DRF serializers for tenant-scoped restaurant data."""

from rest_framework import serializers
from django.db.models import Avg, Count, Q

from .models import (
    AppTheme,
    Category,
    CustomerDetail,
    Description,
    FcmNotification,
    Item,
    Menu,
    Offer,
    OfferItem,
    Order,
    OrderItem,
    PaymentMethod,
    RatingReview,
    Reservation,
    Setting,
    SocialLinks,
    Waiter,
    DiningTable,
)


class DiningTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiningTable
        fields = '__all__'


class MenuListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = "__all__"


class CategoryListSerializer(serializers.ModelSerializer):
    menu_name = serializers.CharField(source="menu.name")
    menu_id = serializers.CharField(source="menu.id")

    class Meta:
        model = Category
        fields = "__all__"


class CategorySaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ItemListSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()

    def get_average_rating(self, obj):
        value = getattr(obj, "average_rating_value", None)
        return round(float(value), 1) if value is not None else None

    category_name = serializers.CharField(source="category.name")
    category_id = serializers.CharField(source="category.id")
    category_img = serializers.ImageField(source="category.icon")
    menu_name = serializers.CharField(source="category.menu.name")
    menu_id = serializers.CharField(source="category.menu.id")
    menu_img = serializers.ImageField(source="category.menu.icon")

    class Meta:
        model = Item
        fields = "__all__"


class ItemSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"


class OfferBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = "__all__"


class OfferItemsSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="item_name.name", allow_null=True, required=False)
    offer_name = serializers.CharField(source="offer_name.offer_name", allow_null=True, required=False)
    offer_id = serializers.CharField(source="offer_name.id", allow_null=True, required=False)
    item_discount = serializers.IntegerField(source="offer_name.discount", allow_null=True, required=False)
    item_fullprice = serializers.CharField(source="item_name.price_full", allow_null=True, required=False)
    item_halfprice = serializers.CharField(source="item_name.price_half", allow_null=True, required=False)
    item_image = serializers.ImageField(source="item_name.icon", allow_null=True, required=False)
    item_description = serializers.CharField(source="item_name.description", allow_null=True, required=False)
    item_type = serializers.CharField(source="item_name.item_type", allow_null=True, required=False)
    item_id = serializers.CharField(source="item_name.id", allow_null=True, required=False)

    class Meta:
        model = OfferItem
        fields = "__all__"


class DescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Description
        fields = "__all__"


class SettingSerializer(serializers.ModelSerializer):
    background_color = serializers.CharField(source="app_theme.background_color", allow_null=True)
    heading_color = serializers.CharField(source="app_theme.heading_color", allow_null=True)
    subheading_color = serializers.CharField(source="app_theme.subheading_color", allow_null=True)
    banner_heading_color = serializers.CharField(source="app_theme.banner_heading_color", allow_null=True)
    heading_bgcolor = serializers.CharField(source="app_theme.heading_bgcolor", allow_null=True)
    subheading_bgcolor = serializers.CharField(source="app_theme.subheading_bgcolor", allow_null=True)
    card_color = serializers.CharField(source="app_theme.card_color", allow_null=True)

    class Meta:
        model = Setting
        fields = "__all__"


class SettingSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = "__all__"


class OfferallItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferItem
        fields = "__all__"


class CustomerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerDetail
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    customer_number = serializers.CharField(
        source="customer_id.contact_number", allow_null=True, required=False
    )
    last_customer_name = serializers.CharField(
        source="customer_id.last_customer_name", allow_null=True, required=False
    )
    customer_loyality_point = serializers.IntegerField(
        source="customer_id.loyality_points", allow_null=True, required=False
    )

    class Meta:
        model = Order
        fields = "__all__"


class AllOrderSerializer(serializers.ModelSerializer):
    table_location = serializers.SerializerMethodField()

    def get_table_location(self, obj):
        if obj.dining_table_id:
            table = obj.dining_table
            return f"{table.floor.name} · {table.name}" if table.floor_id else f"Direct · {table.name}"
        return obj.table_number or "No Table Assigned"

    customer_number = serializers.CharField(
        source="customer_id.contact_number", allow_null=True, required=False
    )
    last_customer_name = serializers.CharField(
        source="customer_id.last_customer_name", allow_null=True, required=False
    )
    customer_loyality_point = serializers.IntegerField(source="customer_id.loyality_points")

    class Meta:
        model = Order
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = "__all__"


class OrderItemWithOrderIdSerializer(serializers.ModelSerializer):
    order_id = serializers.CharField(source="order_id.order_id", allow_null=True, required=False)

    class Meta:
        model = OrderItem
        fields = "__all__"


class AppThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppTheme
        fields = "__all__"


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = "__all__"


class FcmNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FcmNotification
        fields = "__all__"


class SocialLinksSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLinks
        fields = "__all__"


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = "__all__"


class RatingReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingReview
        fields = "__all__"


class WaiterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waiter
        fields = "__all__"
        extra_kwargs = {"password": {"write_only": True}}


class MenuSerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="name", allow_null=True, required=False)
    value = serializers.CharField(source="id", allow_null=True, required=False)

    class Meta:
        model = Menu
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="name", allow_null=True, required=False)
    value = serializers.CharField(source="id", allow_null=True, required=False)
    menu_name = serializers.CharField(source="menu.name", allow_null=True, required=False)
    menu_id = serializers.CharField(source="menu.id", allow_null=True, required=False)

    class Meta:
        model = Category
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()

    def get_average_rating(self, obj):
        value = getattr(obj, "average_rating_value", None)
        return round(float(value), 1) if value is not None else None

    label = serializers.CharField(source="name", allow_null=True, required=False)
    value = serializers.CharField(source="id", allow_null=True, required=False)
    category_name = serializers.CharField(source="category.name", allow_null=True, required=False)
    category_id = serializers.CharField(source="category.id", allow_null=True, required=False)
    category_img = serializers.ImageField(source="category.icon", allow_null=True, required=False)
    menu_name = serializers.CharField(source="category.menu.name", allow_null=True, required=False)
    menu_id = serializers.CharField(source="category.menu.id", allow_null=True, required=False)
    menu_img = serializers.ImageField(source="category.menu.icon", allow_null=True, required=False)

    class Meta:
        model = Item
        fields = "__all__"
