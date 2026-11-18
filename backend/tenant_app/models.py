from fcm_django.models import AbstractFCMDevice
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, MinLengthValidator, MaxLengthValidator
from django.utils.translation import ugettext_lazy as _
from admin_app.models import *
from django.core.exceptions import ValidationError
from django.core.validators import validate_image_file_extension
from django import forms
from .validators import validate_image, validate_discount_rupees, validate_discount_precentage, validate_qunatity, validate_mobile_number, validate_customer_mobile_number, validate_payment_mobile_number
from .services import catalog_availability, order_rules


class TrackedFieldsMixin:
    """Remember the values a row was loaded (or created) with, to detect changes on save."""

    tracked_fields = ()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Read from __dict__ so deferred fields are not fetched one query at a time.
        self._initial_values = {name: self.__dict__.get(name) for name in self.tracked_fields if name in self.__dict__}

    def initial(self, name):
        return self._initial_values.get(name, getattr(self, name))

    def has_changed(self, name):
        return name in self._initial_values and self._initial_values[name] != getattr(self, name)


'-------------------------------------------------------\nAdded by - Ashish Dewangan on 08-02-2023\nReason - To store details of menu\n'

class Menu(TrackedFieldsMixin, models.Model):
    name = models.CharField(max_length=30, default='', verbose_name='Menu name')
    icon = models.ImageField(verbose_name='image', upload_to='images/menu/', null=True, validators=[validate_image, validate_image_file_extension])
    is_active = models.BooleanField(default=False)

    tracked_fields = ('is_active',)

    class Meta:
        verbose_name_plural = 'c) Menu'

    def save(self, *args, **kwargs):
        catalog_availability.before_menu_save(self, self.initial('is_active'))
        super().save(*args, **kwargs)
'\nEnd of code addition\n'
'-------------------------------------------------------\nAdded by - Ashish Dewangan on 08-02-2023\nReason - To store details of category\n'

class Category(TrackedFieldsMixin, models.Model):
    menu = models.ForeignKey(Menu, related_name='menu', on_delete=models.CASCADE, default='', verbose_name='Menu name')
    name = models.CharField(max_length=30, default='', verbose_name='Category name')
    icon = models.ImageField(verbose_name='image', upload_to='images/category/', null=True, blank=True, validators=[validate_image, validate_image_file_extension])
    is_active = models.BooleanField(default=False)

    tracked_fields = ('is_active',)

    class Meta:
        verbose_name_plural = 'd) Category'

    def save(self, *args, **kwargs):
        catalog_availability.before_category_save(self, self.initial('is_active'))
        super().save(*args, **kwargs)
        catalog_availability.after_category_save(self)
'\nEnd of code addition\n'
'-------------------------------------------------------\nAdded by - Ashish Dewangan on 08-02-2023\nReason - To store details of category Items\n'
IMAGE_CHOICE = (('Veg', 'Veg'), ('Nonveg', 'Nonveg'), ('Other', 'Other'))

class Item(TrackedFieldsMixin, models.Model):
    category = models.ForeignKey(Category, related_name='category', on_delete=models.CASCADE, default='', verbose_name='Category name')
    name = models.CharField(max_length=30, default='', verbose_name='Item name')
    item_type = models.CharField(choices=IMAGE_CHOICE, max_length=50, default='Other')
    price_full = models.DecimalField(null=True, blank=True, max_digits=6, decimal_places=2)
    price_half = models.DecimalField(null=True, blank=True, max_digits=6, decimal_places=2)
    description = models.CharField(max_length=500, null=True, blank=True)
    icon = models.ImageField(verbose_name='image', upload_to='images/item/', null=True, validators=[validate_image, validate_image_file_extension])
    is_active = models.BooleanField(default=False)
    kitchen_available = models.BooleanField(default=True)
    best_seller = models.BooleanField(default=False)

    tracked_fields = ('is_active',)

    class Meta:
        verbose_name_plural = 'e) Item'

    def save(self, *args, **kwargs):
        catalog_availability.before_item_save(self, self.initial('is_active'))
        super().save(*args, **kwargs)
        catalog_availability.after_item_save(self)
'\nEnd of code addition\n'
'-------------------------------------------------------\nAdded by - Om Shrivastava on 01-03-2023\nReason - To store offer for every Items\n'

class Offer(models.Model):
    id = models.AutoField(primary_key=True)
    offer_name = models.CharField(max_length=40, verbose_name='Banner/Offer name')
    discount = models.CharField(null=True, blank=True, max_length=20, verbose_name='Discount(%)')
    offer_image = models.ImageField(upload_to='images/offer/', verbose_name='Banner/Offer image', null=True, blank=True, validators=[validate_image, validate_image_file_extension])
    description = models.TextField(null=True, blank=True)
    video_link = models.CharField(max_length=500, blank=True, null=True)
    show_video_Hide_Image = models.BooleanField(verbose_name='Show Video', default=False)
    is_active = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True, verbose_name='Date & Time', null=True, blank=True)

    class Meta:
        verbose_name = 'Banner/Offer'
        verbose_name_plural = 'a) Banner/Offer'

    def clean(self):
        if self.video_link is None and self.show_video_Hide_Image is True:
            raise ValidationError({'show_video_Hide_Image': 'Please enter video link'})
        if self.video_link is None and not self.offer_image:
            raise ValidationError({'offer_image': 'This field is required if you are not entered video link'})

class OfferItem(models.Model):
    id = models.AutoField(primary_key=True)
    offer_name = models.ForeignKey(Offer, verbose_name='Banner/Offer Name', related_name='offer_id', on_delete=models.CASCADE)
    item_name = models.ForeignKey(Item, related_name='item_id', on_delete=models.CASCADE, unique=True, error_messages={'unique': 'This dish is already on another offer.'})

    class Meta:
        verbose_name = 'Banner/Offer Items'
        verbose_name_plural = 'b) Banner/Offer Items'
'\nEnd of code addition\n'
'-------------------------------------------------------\nAdded by - Om Shrivastava on 11-03-2023\nReason - To create footer and description table to show data in footer section\n'

class Description(models.Model):
    id = models.AutoField(primary_key=True)
    content = models.TextField(null=True, blank=True, default='')

    class Meta:
        verbose_name_plural = 'g) Footer Description'
'\nEnd of code addition\n'
'-------------------------------------------------------\nAdded by - Om Shrivastava on 15-03-2023\nReason - To create Theme \n'

class Setting(models.Model):
    id = models.AutoField(primary_key=True)
    login_background = models.ImageField(
        upload_to="restaurant_login_backgrounds/",
        null=True,
        blank=True
    )
    login_background_data = models.BinaryField(null=True, blank=True, editable=False)
    app_theme = models.ForeignKey(AppTheme, related_name='app_theme', on_delete=models.CASCADE, null=True, blank=True)
    allow_half_price = models.BooleanField(default=True)
    show_item_ratings_to_customers = models.BooleanField(default=False)
    cgst = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(99)], default=0.0, verbose_name='CGST(%)', null=True, blank=True)
    sgst = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(99)], default=0.0, verbose_name='SGST(%)', null=True, blank=True)
    gstin = models.CharField(max_length=50, default='', null=True, blank=True, verbose_name='GSTIN')
    fssaino = models.CharField(max_length=50, default='', null=True, blank=True, verbose_name='FSSAI NO')
    whatsapp_number = models.CharField(max_length=15, null=True, blank=True)
    allow_loyality_points = models.BooleanField(default=False)
    per_loyality_point_value = models.IntegerField(default=0, null=True, blank=True, verbose_name='Value of single loyality point(Rs.)')
    amount_for_single_loyality_point = models.IntegerField(default=0, null=True, blank=True, verbose_name='Loyality point calculation amount(Rs.)')
    DISCOUNT_CHOICES = [('Discount in (₹)', 'Discount in (₹)'), ('Discount in (%)', 'Discount in (%)')]
    discount_in = models.CharField(max_length=255, choices=DISCOUNT_CHOICES, default='Discount in (₹)')

    class Meta:
        verbose_name_plural = 'f) Setting'
'\nEnd of code addition\n'
'\nAdded by - Parineeta Gedam on 06-04-2023\nReason - To store customer detail\n'

class CustomerDetail(models.Model):
    validate_mobile_number = staticmethod(validate_customer_mobile_number)
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(_('email address'), null=True, blank=True)
    loyality_points = models.IntegerField(default=0, null=True, blank=True)
    contact_number = models.CharField(max_length=10, validators=[validate_customer_mobile_number])
    last_customer_name = models.CharField(max_length=255, null=True, blank=True)
    last_email = models.EmailField(_('Last email address'), null=True, blank=True)

    class Meta:
        verbose_name = 'Customer Detail'
        verbose_name_plural = 'h) Customer Detail'
        indexes = [models.Index(fields=['contact_number'], name='customer_contact_idx')]
'\nEnd of added code 06-04-2023\n'
'\nAdded by - Parineeta Gedam on 06-04-2023\nReason - To store Order\n'
ORDER_STATUS = (('Placed', 'Placed'), ('Confirm', 'Confirm'), ('Cooked', 'Cooked'), ('Served', 'Served'), ('Cancelled', 'Cancelled'))
PAYMENT_STATUS = (('Pending', 'Pending'), ('Completed', 'Completed'), ('Paid', 'Paid'))
CANCELLED_BY = (('Admin', 'Admin'), ('Customer', 'Customer'))
LOYALITY_STATUS = (('is used', 'is used'), ('not used', 'not used'))

class Order(TrackedFieldsMixin, models.Model):
    id = models.AutoField(primary_key=True)
    order_id = models.CharField(max_length=255)
    last_acknowledged_item_id = models.PositiveIntegerField(default=0)
    customer_id = models.ForeignKey(CustomerDetail, on_delete=models.CASCADE, verbose_name='Customer')
    table_number = models.CharField(max_length=255)
    
    dining_table = models.ForeignKey(
        'DiningTable',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )

    sub_total = models.FloatField(default=0.0)
    total = models.FloatField(default=0.0)
    cgst = models.FloatField(default=0.0)
    sgst = models.FloatField(default=0.0)
    order_status = models.CharField(max_length=100, choices=ORDER_STATUS, default='Placed')
    payment_status = models.CharField(max_length=100, choices=PAYMENT_STATUS, default='Pending')
    date = models.DateTimeField(auto_now_add=True, verbose_name='Date & Time')
    payment_mode = models.CharField(default='Cash', max_length=100, null=True, blank=True)
    discount_rupees = models.FloatField(default=0.0, blank=True, verbose_name='Discount in (₹)', validators=[validate_discount_rupees])
    discount_percentage = models.FloatField(default=0.0, blank=True, verbose_name='Discount in (%)', validators=[validate_discount_precentage])
    discount_reason = models.TextField(default='', blank=True)
    final_amount = models.FloatField(default=0.0, null=True, blank=True)
    review = models.TextField(null=True, blank=True)
    rating = models.DecimalField(null=True, blank=True, max_digits=2, validators=[MinValueValidator(1), MaxValueValidator(5.0)], decimal_places=1)
    payment_confirmation_date_time = models.CharField(max_length=50, null=True, blank=True)
    cancelled_by = models.CharField(max_length=100, default='---')
    cancel_reason = models.TextField(default='', blank=True)
    apply_loyality_point = models.IntegerField(default=0, blank=True, validators=[MinValueValidator(0)])
    loyality_point_price = models.FloatField(default=0.0, null=True, blank=True)
    loyality_point_status = models.CharField(max_length=100, choices=LOYALITY_STATUS, default='not used', null=True, blank=True)
    loyality_point_calculated = models.BooleanField(default=False)
    send_notifications_on_order_update = models.BooleanField(default=False)
    send_notifications_on_payment_update = models.BooleanField(default=False)
    send_notifications_on_amount_update = models.BooleanField(default=False)
    send_notification_on_tableNum_update = models.BooleanField(default=True)
    customer_name = models.CharField(max_length=50, null=True, blank=True)
    customer_email = models.CharField(max_length=50, null=True, blank=True)
    order_created_by = models.CharField(max_length=50, null=True, blank=True)
    waiter_contact_number = models.CharField(max_length=15, blank=True, null=True, default='')
    waiter_name = models.CharField(max_length=100, blank=True, null=True, default='')

    tracked_fields = ('order_status', 'payment_status', 'apply_loyality_point', 'final_amount', 'table_number')

    class Meta:
        verbose_name = 'Order'
        verbose_name_plural = 'i) Order'
        indexes = [
            models.Index(fields=['order_id'], name='order_number_idx'),
            models.Index(fields=['date'], name='order_date_idx'),
            models.Index(fields=['payment_status', 'order_status'], name='order_status_idx'),
        ]

    def __str__(self):
        return self.order_id

    def clean(self):
        order_rules.validate_order(self)

    def save(self, *args, **kwargs):
        order_rules.before_order_save(self)
        super().save(*args, **kwargs)
'\nEnd of added code 06-04-2023\n'
'\nAdded by - Parineeta Gedam on 06-04-2023\nReason - To store Order Item\n'
ITEM_STATUS = (('Pending', 'Pending'), ('Confirm', 'Confirm'), ('Cancelled', 'Cancelled'))
SERVING_SIZE = (('Half', 'Half'), ('Full', 'Full'))

class OrderItem(models.Model):
    id = models.AutoField(primary_key=True)
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    item_id = models.ForeignKey(Item, blank=True, null=True, on_delete=models.CASCADE)
    item = models.CharField(max_length=255, verbose_name='Item name')
    serving_size = models.CharField(max_length=255, choices=SERVING_SIZE)
    quantity = models.IntegerField(default=0, validators=[validate_qunatity])
    price = models.FloatField(default=0)
    rating = models.DecimalField(null=True, blank=True, max_digits=2, validators=[MinValueValidator(1), MaxValueValidator(5.0)], decimal_places=1)
    review = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True, verbose_name='Date & Time')
    item_status = models.CharField(max_length=100, choices=ITEM_STATUS, default='Pending')
    kot_print_status = models.BooleanField(default=False)
    cancel_reason = models.TextField(null=True, blank=True)
    send_notifications_on_item_update = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Order Item'
        verbose_name_plural = 'j) Order Item'
        indexes = [models.Index(fields=['date'], name='orderitem_date_idx')]

    def clean(self):
        order_rules.validate_order_item(self)

    def save(self, *args, **kwargs):
        order_rules.before_order_item_save(self)
        super().save(*args, **kwargs)
'\nEnd of added code 06-04-2023\n'
'\nAdded by - Parineeta Gedam on 11-04-2023\nReason - To store scanner\n'

class PaymentMethod(models.Model):
    validate_mobile_number = staticmethod(validate_payment_mobile_number)
    scanner = models.ImageField(upload_to='scanner/', null=True, validators=[validate_image_file_extension])
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    contact_number = models.CharField(max_length=10, validators=[validate_payment_mobile_number], null=True, blank=True)

    class Meta:
        verbose_name = 'Payment Method'
        verbose_name_plural = 'k) Payment Method'
'\nEnd of added code 11-04-2023\n'
from fcm_django.models import AbstractFCMDevice

class FcmNotification(AbstractFCMDevice):
    name = models.CharField(max_length=20, default='')
    phone_number = models.CharField(max_length=10, default='')
'\nAdded by Yuvraj Sahu on 25-05-2023\nReason - to save social links\n'

class SocialLinks(models.Model):
    social_media_name = models.CharField(max_length=255, blank=True, null=True)
    social_media_link = models.TextField(default='')
    social_media_icon = models.ImageField(upload_to='social/', default='', validators=[validate_image_file_extension])

    class Meta:
        verbose_name = 'Social Link'
        verbose_name_plural = 'M) Social Links'
'\nEnd of addition by yuvraj Sahu on 25-05-2023\n'
'\nAdded by - Parineeta Gedam on 01-06-2023\nReason - To store reservations request \n'
RESERVATION_STATUS = (('Pending', 'Pending'), ('Confirm', 'Confirm'))

class Reservation(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(_('email address'), null=True, blank=True)
    contact_number = models.CharField(max_length=10, validators=[validate_mobile_number])
    number_of_person = models.CharField(max_length=255, null=True, blank=True)
    special_instructions = models.TextField(null=True, blank=True)
    date = models.DateField(auto_now_add=False, blank=True, null=True, verbose_name='Date')
    time = models.TimeField(auto_now_add=False, blank=True, null=True)
    table_number = models.CharField(max_length=255, null=True, blank=True)
    reservation_status = models.CharField(max_length=100, choices=RESERVATION_STATUS, default='Pending')

    class Meta:
        verbose_name = 'Reservation'
        verbose_name_plural = 'L) Reservation'
'\nEnd of added code by - Parineeta Gedam on 01-06-2023\n'

class RatingReview(models.Model):
    rating = models.DecimalField(null=True, blank=True, max_digits=2, validators=[MinValueValidator(0), MaxValueValidator(5.0)], decimal_places=1)
    review = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name = 'Rating and Review'
        verbose_name_plural = 'n) Rating and Review'

class Waiter(models.Model):
    name = models.CharField(max_length=50)
    contact_number = models.CharField(max_length=254, unique=True)
    is_active = models.BooleanField(default=True)
    password = models.CharField(max_length=255)


class PhoneOtp(models.Model):
    phone = models.CharField(max_length=15)
    code_hash = models.CharField(max_length=64)
    attempts = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    consumed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['phone', 'created_at'], name='tenant_app_phone_phone_idx'),
        ]



class RestaurantFloor(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Restaurant Floor'
        verbose_name_plural = 'Restaurant Floors'

    def __str__(self):
        return self.name



class DiningTable(models.Model):
    name = models.CharField(max_length=50)
    floor = models.ForeignKey(
        RestaurantFloor,
        on_delete=models.PROTECT,
        related_name='tables',
        null=True,
        blank=True
    )
    seats = models.PositiveIntegerField(default=4)
    is_active = models.BooleanField(default=True)
    staff_status = models.CharField(
        max_length=12,
        choices=[
            ('available', 'Available'),
            ('occupied', 'Occupied'),
            ('unavailable', 'Unavailable'),
        ],
        default='available',
    )

    class Meta:
        ordering = ['floor__name', 'name']
        verbose_name = 'Table'
        verbose_name_plural = 'Tables'
        constraints = [
            models.UniqueConstraint(
                fields=['floor', 'name'],
                name='unique_floor_table_name'
            ),
            models.UniqueConstraint(
                fields=['name'],
                condition=models.Q(floor__isnull=True),
                name='unique_direct_table_name'
            )
        ]

    def __str__(self):
        if self.floor_id:
            return f'{self.floor.name} - {self.name}'
        return f'Direct - {self.name}'



class OrderEvent(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=50)
    order_status = models.CharField(max_length=100, blank=True, default='')
    payment_status = models.CharField(max_length=100, blank=True, default='')
    actor = models.CharField(max_length=80, blank=True, default='')
    summary = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']



from django.db import models as workforce_models
from django.core.validators import MinValueValidator as workforce_min


class StaffEmployee(workforce_models.Model):
    GENDERS = [
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    ]

    employment_type = workforce_models.CharField(
        max_length=12,
        choices=[
            ("Permanent", "Permanent"),
            ("Temporary", "Temporary"),
        ],
        default="Permanent",
    )

    name = workforce_models.CharField(max_length=150)
    phone = workforce_models.CharField(max_length=254, blank=True)
    gender = workforce_models.CharField(max_length=10, choices=GENDERS, default="Other")
    role = workforce_models.CharField(max_length=100, blank=True)
    can_approve = models.BooleanField(default=False)
    access_permissions = models.JSONField(default=list, blank=True)
    monthly_salary = workforce_models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[workforce_min(0)],
    )
    joining_date = workforce_models.DateField()
    is_active = workforce_models.BooleanField(default=True)

    def __str__(self):
        return self.name


class StaffAttendance(workforce_models.Model):
    employee = workforce_models.ForeignKey(
        StaffEmployee,
        on_delete=workforce_models.CASCADE,
        related_name="attendance",
    )
    date = workforce_models.DateField()
    check_in = workforce_models.TimeField(null=True, blank=True)
    check_out = workforce_models.TimeField(null=True, blank=True)
    day_fraction = workforce_models.CharField(
        max_length=4,
        choices=[
            ("Full", "Full Day"),
            ("Half", "Half Day"),
        ],
        default="Full",
    )
    
    check_in_latitude = workforce_models.FloatField(
        null=True,
        blank=True
    )
    check_in_longitude = workforce_models.FloatField(
        null=True,
        blank=True
    )
    check_out_latitude = workforce_models.FloatField(
        null=True,
        blank=True
    )
    check_out_longitude = workforce_models.FloatField(
        null=True,
        blank=True
    )


    class Meta:
        constraints = [
            workforce_models.UniqueConstraint(
                fields=["employee", "date"],
                name="unique_staff_attendance_date",
            )
        ]


class StaffLeave(workforce_models.Model):
    employee = workforce_models.ForeignKey(
        StaffEmployee,
        on_delete=workforce_models.CASCADE,
        related_name="leaves",
    )
    leave_type = workforce_models.CharField(
        max_length=20,
        choices=[
            ('Paid', 'Paid'),
            ('Casual', 'Casual Leave'),
            ('Sick', 'Sick Leave'),
            ('Medical', 'Medical Leave'),
            ('Unpaid', 'Unpaid'),
        ],
        default="Paid",
    )
    start_date = workforce_models.DateField()
    end_date = workforce_models.DateField()
    reason = workforce_models.TextField(blank=True)
    status = workforce_models.CharField(
        max_length=20,
        choices=[
            ("Pending", "Pending"),
            ("Approved", "Approved"),
            ("Rejected", "Rejected"),
        ],
        default="Pending",
    )


class StaffPayrollSettings(workforce_models.Model):
    male_hours = workforce_models.DecimalField(
        max_digits=4,
        decimal_places=1,
        default=10,
    )
    female_hours = workforce_models.DecimalField(
        max_digits=4,
        decimal_places=1,
        default=8,
    )
    other_hours = workforce_models.DecimalField(
        max_digits=4,
        decimal_places=1,
        default=8,
    )
    salary_mode = workforce_models.CharField(
        max_length=10,
        choices=[
            ("day", "Day Based"),
            ("hour", "Hour Based"),
        ],
        default="day",
    )
    paid_leaves_per_year = workforce_models.PositiveSmallIntegerField(default=12)
    casual_leaves_per_year = workforce_models.PositiveSmallIntegerField(default=0)
    sick_leaves_per_year = workforce_models.PositiveSmallIntegerField(default=0)
    medical_leaves_per_year = workforce_models.PositiveSmallIntegerField(default=0)

    
    WEEK_OFF_MODES = [
        ("flexible", "Flexible Monthly Off"),
        ("fixed", "Fixed Weekly Off"),
    ]

    week_off_mode = workforce_models.CharField(
        max_length=10,
        choices=WEEK_OFF_MODES,
        default="flexible",
    )
    monthly_off_quota = workforce_models.PositiveSmallIntegerField(default=4)
    week_off_days = workforce_models.JSONField(default=list, blank=True)



class StaffPayroll(workforce_models.Model):
    employee = workforce_models.ForeignKey(
        StaffEmployee,
        on_delete=workforce_models.CASCADE,
        related_name="payroll",
    )
    month = workforce_models.PositiveSmallIntegerField()
    year = workforce_models.PositiveSmallIntegerField()
    present_days = workforce_models.PositiveSmallIntegerField(default=0)
    worked_hours = workforce_models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )
    paid_leave_days = workforce_models.PositiveSmallIntegerField(default=0)
    calculated_salary = workforce_models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )
    
    half_days = workforce_models.DecimalField(
        max_digits=5,
        decimal_places=1,
        default=0,
    )

    gross_salary = workforce_models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    advance_deduction = workforce_models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )


    class Meta:
        constraints = [
            workforce_models.UniqueConstraint(
                fields=["employee", "month", "year"],
                name="unique_staff_payroll_month",
            )
        ]


class StaffSalaryPayment(workforce_models.Model):
    payroll = workforce_models.ForeignKey(
        StaffPayroll,
        on_delete=workforce_models.PROTECT,
        related_name="salary_payments",
    )
    amount = workforce_models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    payment_date = workforce_models.DateField()
    payment_mode = workforce_models.CharField(
        max_length=20,
        default="Cash",
    )
    reference = workforce_models.CharField(
        max_length=120,
        blank=True,
    )
    remark = workforce_models.CharField(
        max_length=500,
        blank=True,
    )
    created_at = workforce_models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-payment_date", "-id"]

class StaffSalaryAdvance(workforce_models.Model):
    employee = workforce_models.ForeignKey(
        StaffEmployee,
        on_delete=workforce_models.CASCADE,
        related_name="salary_advances",
    )
    amount = workforce_models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    date = workforce_models.DateField()
    remark = workforce_models.CharField(
        max_length=500,
        blank=True,
    )
    created_at = workforce_models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-date", "-id"]

class StaffFlexibleOff(workforce_models.Model):
    employee = workforce_models.ForeignKey(
        StaffEmployee,
        on_delete=workforce_models.CASCADE,
        related_name="flexible_offs",
    )
    date = workforce_models.DateField()
    created_at = workforce_models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            workforce_models.UniqueConstraint(
                fields=["employee", "date"],
                name="unique_staff_flexible_off_date",
            ),
        ]
        ordering = ["-date", "-id"]

    def __str__(self):
        return f"{self.employee.name} - {self.date}"


class StaffAttendanceRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    employee = models.ForeignKey(
        'StaffEmployee',
        on_delete=models.CASCADE,
        related_name='attendance_requests'
    )
    date = models.DateField()
    check_in = models.TimeField(null=True, blank=True)
    check_out = models.TimeField(null=True, blank=True)
    reason = models.TextField()
    status = models.CharField(
        max_length=12,
        choices=STATUS_CHOICES,
        default='Pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.name} - {self.date} - {self.status}"




class ExpenseCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class ExpenseSubType(models.Model):
    category = models.ForeignKey(
        ExpenseCategory,
        on_delete=models.PROTECT,
        related_name='subtypes'
    )
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(
                fields=['category', 'name'],
                name='unique_expense_subtype_category'
            )
        ]

    def __str__(self):
        return f'{self.category.name} / {self.name}'


class RestaurantExpense(models.Model):
    
    sub_type = models.ForeignKey(
        ExpenseSubType,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='expenses'
    )
    party_name = models.CharField(
        max_length=180,
        blank=True,
        default=''
    )
    invoice_number = models.CharField(
        max_length=100,
        blank=True,
        default=''
    )
    invoice_date = models.DateField(
        null=True,
        blank=True
    )
    invoice_file = models.FileField(
        upload_to='expense_invoices/%Y/%m/',
        null=True,
        blank=True
    )

    expense_nature = models.CharField(
        max_length=10,
        choices=[
            ('Direct', 'Direct Expense'),
            ('Indirect', 'Indirect Expense')
        ],
        default='Direct'
    )

    category = models.ForeignKey(
        ExpenseCategory,
        on_delete=models.PROTECT,
        related_name='expenses'
    )
    name = models.CharField(max_length=180)
    expense_date = models.DateField()
    expense_time = models.TimeField()
    quantity = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_by = models.CharField(max_length=120, default='Admin')
    paid_by = models.CharField(max_length=120)
    payment_type = models.CharField(
        max_length=20,
        choices=[
            ('Cash', 'Cash'),
            ('UPI', 'UPI'),
            ('Bank', 'Bank Transfer'),
            ('Card', 'Card'),
            ('Other', 'Other')
        ]
    )
    remark = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-expense_date', '-expense_time', '-id']
        indexes = [
            models.Index(
                fields=['expense_date'],
                name='expense_date_idx'
            )
        ]

    def __str__(self):
        return self.name





# PHASE 1: Manual payment verification / UPI settings.
# Paste at the END of backend/tenant_app/models.py.
class RestaurantUPISettings(models.Model):
    upi_id = models.CharField(max_length=255, blank=True, default='')
    payee_name = models.CharField(max_length=255, blank=True, default='')
    is_enabled = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Restaurant UPI Settings'

class OrderPaymentVerification(models.Model):
    METHOD_CHOICES = (('Cash', 'Cash'), ('UPI', 'UPI'))
    STATE_CHOICES = (
        ('not_started', 'Not started'),
        ('awaiting_verification', 'Awaiting verification'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    )
    order = models.OneToOneField('Order', on_delete=models.CASCADE, related_name='manual_payment')
    method = models.CharField(max_length=10, choices=METHOD_CHOICES)
    state = models.CharField(max_length=30, choices=STATE_CHOICES, default='not_started')
    amount_snapshot = models.DecimalField(max_digits=12, decimal_places=2)
    claimed_at = models.DateTimeField(null=True, blank=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.CharField(max_length=100, blank=True, default='')
    note = models.CharField(max_length=500, blank=True, default='')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Order Payment Verification'
