"""Create the local demo restaurant, its Indian menu, and the demo logins.

Safe to run again for users and floors. Pass --refresh-menu to rebuild the
catalog with the food photos in backend/seed_images/.
"""
import argparse
import os
from datetime import date
from io import BytesIO
from pathlib import Path

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.db import connection
from PIL import Image
from tenant_schemas.utils import schema_context

from admin_app.models import AppTheme, RestaurantRequest, Tenant
from admin_app.theme_catalog import ensure_default_themes
from tenant_app.models import (
    Category,
    Description,
    DiningTable,
    Item,
    Menu,
    Offer,
    OfferItem,
    RestaurantFloor,
    Setting,
    StaffEmployee,
    Waiter,
)
from tenant_app.utils.encryption import hash_password

PASSWORD = '12345aA@'
TODAY = date.today()
SEED_IMAGES = Path(__file__).resolve().parent / 'seed_images'


def load_jpeg(filename, size=(800, 600)):
    path = SEED_IMAGES / filename
    if not path.exists():
        raise FileNotFoundError('Missing seed image: %s' % path)
    with Image.open(path) as source:
        image = source.convert('RGB')
        image.thumbnail(size, Image.Resampling.LANCZOS)
        canvas = Image.new('RGB', size, (18, 14, 12))
        canvas.paste(image, ((size[0] - image.width) // 2, (size[1] - image.height) // 2))
    buffer = BytesIO()
    canvas.save(buffer, format='JPEG', quality=88, optimize=True)
    return buffer.getvalue()


def attach_photo(instance, field, filename, seed_file, size=(800, 600)):
    getattr(instance, field).save(filename, ContentFile(load_jpeg(seed_file, size)), save=False)


def ensure_superuser():
    User = get_user_model()
    user = User.objects.filter(username='admin@gmail.com').first()
    if user is None:
        user = User.objects.create(username='admin@gmail.com', email='admin@gmail.com', is_staff=True, is_superuser=True)
    user.email = 'admin@gmail.com'
    user.is_staff = True
    user.is_superuser = True
    user.set_password(PASSWORD)
    user.save()


def ensure_theme():
    """Ensure the five built-in AppTheme rows exist (same as migrate)."""
    return ensure_default_themes(AppTheme)


def ensure_public():
    if Tenant.objects.filter(schema_name='public').exists():
        return
    public = Tenant(
        schema_name='public',
        tenant_name='public',
        domain_url='restroscans.com',
    )
    public.auto_create_schema = False
    public.save()


def ensure_tenant():
    request = RestaurantRequest.objects.filter(email__iexact='demo@gmail.com').first()
    if request is None:
        request = RestaurantRequest(
            restaurant_name='Demo Spice Kitchen',
            tag_line='Authentic North Indian kitchen',
            owner_name='Demo Owner',
            email='demo@gmail.com',
            mobile_number='9876543210',
            address='21 MG Road, Bengaluru',
            is_active=False,
        )
    request.restaurant_name = 'Demo Spice Kitchen'
    request.tag_line = 'Authentic North Indian kitchen'
    request.owner_name = 'Demo Owner'
    request.password = PASSWORD
    request.confirm_password = PASSWORD
    request.address = '21 MG Road, Bengaluru'
    attach_photo(
        request,
        'restaurant_background_img',
        'demo-restaurant-cover.jpg',
        'restaurant-cover.jpg',
        (1600, 900),
    )
    attach_photo(
        request,
        'restaurant_logo',
        'demo-restaurant-logo.jpg',
        'restaurant-logo.jpg',
        (400, 400),
    )
    request.save()

    tenant = Tenant.objects.filter(schema_name='demo').first()
    if tenant is None:
        tenant = Tenant(
            schema_name='demo',
            tenant_name='demo',
            domain_url='demo.restroscans.com',
            restaurant_name=request,
            Subscribe_plan='delicious',
        )
        tenant.save()
    else:
        tenant.tenant_name = 'demo'
        tenant.domain_url = 'demo.restroscans.com'
        tenant.restaurant_name = request
        tenant.Subscribe_plan = 'delicious'
        tenant.save()
    return tenant


def ensure_setting(theme):
    setting = Setting.objects.order_by('id').first()
    if setting is None:
        setting = Setting(app_theme=theme)
    setting.app_theme = theme
    setting.allow_half_price = True
    setting.show_item_ratings_to_customers = True
    setting.cgst = 2.5
    setting.sgst = 2.5
    setting.gstin = '29ABCDE1234F1Z5'
    setting.fssaino = '11223344556677'
    setting.whatsapp_number = '9876543210'
    setting.allow_loyality_points = True
    setting.per_loyality_point_value = 1
    setting.amount_for_single_loyality_point = 100
    setting.discount_in = 'Discount in (%)'
    setting.save()


def clear_catalog():
    OfferItem.objects.all().delete()
    Offer.objects.all().delete()
    Item.objects.all().delete()
    Category.objects.all().delete()
    Menu.objects.all().delete()


def build_menu():
    menu = Menu(name='All Day Menu', is_active=True)
    attach_photo(menu, 'icon', 'all-day-menu.jpg', 'menu-cover.jpg', (900, 600))
    menu.save()

    groups = [
        (
            'Veg Starters',
            'paneer-tikka.jpg',
            [
                ('Paneer Tikka', 'paneer-tikka.jpg', 'Veg', 280, 160, 'Cottage cheese tikka with peppers, onion and mint chutney.', True),
                ('Hara Bhara Kebab', 'hara-bhara-kebab.jpg', 'Veg', 240, None, 'Spinach, peas and potato kebabs, pan-seared.', False),
                ('Veg Spring Roll', 'veg-spring-roll.jpg', 'Veg', 180, None, 'Crisp rolls stuffed with cabbage, carrot and noodles.', False),
            ],
        ),
        (
            'Non-Veg Starters',
            'chicken-tikka.jpg',
            [
                ('Chicken Tikka', 'chicken-tikka.jpg', 'Nonveg', 340, 190, 'Yogurt-marinated chicken from the clay tandoor.', True),
                ('Mutton Seekh Kebab', 'mutton-seekh.jpg', 'Nonveg', 420, None, 'Minced mutton with green chilli, ginger and coriander.', False),
                ('Fish Amritsari', 'fish-amritsari.jpg', 'Nonveg', 390, None, 'Ajwain-spiced gram-flour fried river fish.', False),
            ],
        ),
        (
            'Veg Curries',
            'paneer-butter-masala.jpg',
            [
                ('Paneer Butter Masala', 'paneer-butter-masala.jpg', 'Veg', 320, 180, 'Soft paneer in a tomato-butter gravy with kasuri methi.', True),
                ('Dal Tadka', 'dal-tadka.jpg', 'Veg', 220, 130, 'Yellow lentils finished with garlic-chilli tadka.', False),
                ('Palak Paneer', 'palak-paneer.jpg', 'Veg', 300, 170, 'Spinach gravy with fresh cottage cheese cubes.', False),
                ('Malai Kofta', 'malai-kofta.jpg', 'Veg', 340, None, 'Vegetable dumplings in a rich cashew gravy.', False),
            ],
        ),
        (
            'Non-Veg Curries',
            'butter-chicken.jpg',
            [
                ('Butter Chicken', 'butter-chicken.jpg', 'Nonveg', 380, 220, 'Tandoori chicken simmered in tomato-butter makhani gravy.', True),
                ('Chicken Chettinad', 'chicken-chettinad.jpg', 'Nonveg', 360, 210, 'Black pepper and fennel chicken curry from Chettinad.', False),
                ('Mutton Rogan Josh', 'mutton-rogan-josh.jpg', 'Nonveg', 480, None, 'Slow Kashmiri mutton with fennel and dry ginger.', True),
                ('Fish Curry', 'fish-curry.jpg', 'Nonveg', 400, None, 'Coastal fish curry with coconut, curry leaf and tamarind.', False),
            ],
        ),
        (
            'Breads',
            'garlic-naan.jpg',
            [
                ('Butter Naan', 'butter-naan.jpg', 'Veg', 60, None, 'Soft tandoor naan brushed with melted butter.', False),
                ('Garlic Naan', 'garlic-naan.jpg', 'Veg', 70, None, 'Naan topped with garlic and fresh coriander.', True),
                ('Tandoori Roti', 'tandoori-roti.jpg', 'Veg', 40, None, 'Whole-wheat roti from the tandoor.', False),
                ('Laccha Paratha', 'laccha-paratha.jpg', 'Veg', 70, None, 'Flaky layered whole-wheat paratha.', False),
            ],
        ),
        (
            'Rice & Biryani',
            'chicken-biryani.jpg',
            [
                ('Jeera Rice', 'jeera-rice.jpg', 'Veg', 160, None, 'Fragrant basmati tempered with cumin.', False),
                ('Steamed Rice', 'steamed-rice.jpg', 'Veg', 140, None, 'Plain steamed basmati rice.', False),
                ('Veg Biryani', 'veg-biryani.jpg', 'Veg', 280, None, 'Dum biryani with seasonal vegetables and saffron.', True),
                ('Chicken Biryani', 'chicken-biryani.jpg', 'Nonveg', 360, None, 'Hyderabadi chicken dum biryani with fried onion.', True),
                ('Mutton Biryani', 'mutton-biryani.jpg', 'Nonveg', 460, None, 'Slow-cooked mutton dum biryani.', False),
            ],
        ),
        (
            'Desserts',
            'gulab-jamun.jpg',
            [
                ('Gulab Jamun', 'gulab-jamun.jpg', 'Veg', 120, None, 'Two soft milk dumplings in saffron sugar syrup.', True),
                ('Rasmalai', 'rasmalai.jpg', 'Veg', 140, None, 'Chenna discs soaked in cardamom milk.', False),
                ('Kulfi', 'kulfi.jpg', 'Veg', 110, None, 'Traditional pistachio and saffron kulfi.', False),
            ],
        ),
        (
            'Beverages',
            'mango-lassi.jpg',
            [
                ('Masala Chai', 'masala-chai.jpg', 'Veg', 40, None, 'Ginger and cardamom tea, served hot.', False),
                ('Sweet Lassi', 'sweet-lassi.jpg', 'Veg', 90, None, 'Chilled sweet yogurt drink.', False),
                ('Mango Lassi', 'mango-lassi.jpg', 'Veg', 120, None, 'Alphonso mango blended with yogurt.', True),
                ('Fresh Lime Soda', 'lime-soda.jpg', 'Veg', 80, None, 'Sweet, salted or mixed lime soda.', False),
            ],
        ),
    ]

    butter_chicken = None
    for index, (category_name, category_photo, dishes) in enumerate(groups):
        category = Category(menu=menu, name=category_name, is_active=True)
        attach_photo(category, 'icon', 'category-%s.jpg' % index, category_photo, (800, 600))
        category.save()
        print('  category:', category_name)
        for dish_index, (name, photo, kind, full, half, description, best) in enumerate(dishes):
            item = Item(
                category=category,
                name=name,
                item_type=kind,
                price_full=full,
                price_half=half,
                description=description,
                is_active=True,
                kitchen_available=True,
                best_seller=best,
            )
            attach_photo(item, 'icon', 'item-%s-%s.jpg' % (index, dish_index), photo, (800, 600))
            item.save()
            print('    item:', name)
            if name == 'Butter Chicken':
                butter_chicken = item

    offer = Offer(
        offer_name='Chef Special · Butter Chicken',
        discount='10',
        description='House favourite butter chicken at 10% off. Served with butter naan on request.',
        is_active=True,
    )
    attach_photo(offer, 'offer_image', 'chef-special-banner.jpg', 'banner-chef-special.jpg', (1200, 700))
    offer.save()
    if butter_chicken is not None:
        OfferItem.objects.create(offer_name=offer, item_name=butter_chicken)
    print('  banner: Chef Special')


def ensure_menu(refresh=False):
    if refresh or not Menu.objects.filter(name='All Day Menu').exists():
        print('Building demo menu with food photos...')
        clear_catalog()
        build_menu()
        return
    print('Menu already present. Re-run with --refresh-menu to replace photos.')


def ensure_floor():
    if RestaurantFloor.objects.exists():
        return
    ground = RestaurantFloor.objects.create(name='Ground Floor', is_active=True)
    first = RestaurantFloor.objects.create(name='First Floor', is_active=True)
    for floor, count, seats in ((ground, 8, 4), (first, 4, 6)):
        for number in range(1, count + 1):
            DiningTable.objects.create(name='T%s' % number, floor=floor, seats=seats, is_active=True)


def ensure_staff():
    people = [
        ('Ravi Kumar', 'waiter1.demo@gmail.com', 'Waiter', ['orders', 'tables', 'billing', 'customers', 'order_history']),
        ('Anita Sharma', 'chef1.demo@gmail.com', 'Chef', ['kitchen', 'orders', 'items']),
    ]
    for name, email, role, permissions in people:
        employee = StaffEmployee.objects.filter(phone__iexact=email).first()
        if employee is None:
            employee = StaffEmployee(
                name=name,
                phone=email,
                gender='Male' if role == 'Waiter' else 'Female',
                role=role,
                monthly_salary=18000 if role == 'Waiter' else 25000,
                joining_date=TODAY,
                is_active=True,
                can_approve=False,
                access_permissions=permissions,
            )
            employee.save()
        waiter = Waiter.objects.filter(contact_number__iexact=email).first()
        if waiter is None:
            waiter = Waiter(name=name, contact_number=email, is_active=True, password=hash_password(PASSWORD))
            waiter.save()


def ensure_footer():
    text = (
        'Demo Spice Kitchen · 21 MG Road, Bengaluru. '
        'North Indian tandoor, curries, biryani and fresh breads. Call 9876543210.'
    )
    row = Description.objects.order_by('id').first()
    if row is None:
        Description.objects.create(content=text)
    else:
        row.content = text
        row.save(update_fields=['content'])


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--refresh-menu', action='store_true', help='Rebuild menu, categories, items and banner photos.')
    args = parser.parse_args()

    connection.set_schema_to_public()
    ensure_superuser()
    theme = ensure_theme()
    ensure_public()
    ensure_tenant()
    with schema_context('demo'):
        ensure_setting(theme)
        ensure_menu(refresh=args.refresh_menu)
        ensure_floor()
        ensure_staff()
        ensure_footer()
    print('Demo restaurant is ready.')
    print('Django admin: admin@gmail.com')
    print('Restaurant admin: demo@gmail.com')
    print('Waiter: waiter1.demo@gmail.com')
    print('Chef: chef1.demo@gmail.com')


if __name__ == '__main__':
    main()
