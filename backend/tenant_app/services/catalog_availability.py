"""Keep menu / category / item availability consistent.

Rules (unchanged from the original model hooks):
- Menu turned off or on   -> all of its categories and items follow.
- Category turned off     -> its items turn off.
- Category turned on      -> its menu and its items turn on.
- Item turned on          -> its category and menu turn on.
- After a category or item is saved, a parent with no active children is
  turned off (a category without active items, a menu without active categories).
"""

from django.apps import apps


def _models():
    return (
        apps.get_model('tenant_app', 'Menu'),
        apps.get_model('tenant_app', 'Category'),
        apps.get_model('tenant_app', 'Item'),
    )


def before_menu_save(menu, was_active):
    if menu.pk is None or was_active == menu.is_active:
        return
    _, Category, Item = _models()
    Category.objects.filter(menu=menu.pk).update(is_active=menu.is_active)
    Item.objects.filter(category__menu=menu.pk).update(is_active=menu.is_active)


def before_category_save(category, was_active):
    if was_active == category.is_active:
        return
    Menu, _, Item = _models()
    if category.is_active:
        Menu.objects.filter(id=category.menu_id).update(is_active=True)
    if category.pk is not None:
        Item.objects.filter(category=category.pk).update(is_active=category.is_active)


def before_item_save(item, was_active):
    if was_active == item.is_active or not item.is_active:
        return
    Menu, Category, _ = _models()
    Category.objects.filter(id=item.category_id).update(is_active=True)
    menu_id = Category.objects.filter(id=item.category_id).values_list('menu_id', flat=True).first()
    Menu.objects.filter(id=menu_id).update(is_active=True)


def after_category_save(category):
    _deactivate_menu_without_active_categories(category.menu_id)


def after_item_save(item):
    Menu, Category, Item = _models()
    if not Item.objects.filter(category=item.category_id, is_active=True).exists():
        Category.objects.filter(id=item.category_id).update(is_active=False)
    menu_id = Category.objects.filter(id=item.category_id).values_list('menu_id', flat=True).first()
    _deactivate_menu_without_active_categories(menu_id)


def _deactivate_menu_without_active_categories(menu_id):
    if menu_id is None:
        return
    Menu, Category, _ = _models()
    if not Category.objects.filter(menu=menu_id, is_active=True).exists():
        Menu.objects.filter(id=menu_id).update(is_active=False)
