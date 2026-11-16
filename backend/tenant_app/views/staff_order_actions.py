"""Staff order details and kitchen availability. Uses existing Order/OrderItem models and pricing."""
from django.db import transaction
from django.db.models import Avg
from django.core.exceptions import ValidationError
from decimal import Decimal, InvalidOperation
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from tenant_app.models import Order, OrderItem, Item, Category
from tenant_app.serializers import OrderSerializer, OrderItemSerializer
from tenant_app.services.order_service import cart_line_price
from tenant_app.views.workforce import logged_employee, staff_permissions, owner


class StaffOrderActions(APIView):
    def _employee(self, request):
        employee = logged_employee(request)
        if not employee:
            return None
        permissions = {'orders', 'kitchen', 'items'} if owner(request) else staff_permissions(employee, request)
        return employee if any(p in permissions for p in ('orders', 'kitchen', 'items')) else None

    def _order(self, order_id):
        return Order.objects.filter(pk=order_id).first()

    def _details(self, order):
        lines = OrderItem.objects.filter(order_id=order).order_by('date', 'id')
        return {'order': OrderSerializer(order).data, 'items': OrderItemSerializer(lines, many=True).data}

    @staticmethod
    def _categories():
        return list(Category.objects.all().values('id', 'name').order_by('name'))

    @staticmethod
    def _item_data(item):
        return {
            'id': item.pk, 'name': item.name, 'category': item.category_id,
            'category_name': item.category.name if item.category_id else '',
            'price_full': str(item.price_full) if item.price_full is not None else None,
            'price_half': str(item.price_half) if item.price_half is not None else None,
            'item_type': item.item_type, 'description': item.description or '',
            'icon': item.icon.url if item.icon else None,
            'is_active': item.is_active, 'kitchen_available': item.kitchen_available,
            'best_seller': item.best_seller,
            'average_rating': round(float(item.average_rating_value), 1) if getattr(item, 'average_rating_value', None) is not None else None,
        }

    def get(self, request):
        employee = self._employee(request)
        if not employee and not owner(request):
            return Response({'error': 'Owner or authorized staff access required.'}, status=403)
        if request.query_params.get('catalog') == '1':
            if not owner(request) and not any(p in staff_permissions(employee, request) for p in ('orders', 'kitchen', 'items')):
                return Response({'error': 'Catalog permission required.'}, status=403)
            return Response({'items': list(Item.objects.filter(is_active=True, category__is_active=True, category__menu__is_active=True).values('id', 'name', 'price_full', 'price_half', 'kitchen_available', 'category__name').order_by('name'))})
        permissions = {'orders', 'kitchen', 'items'} if owner(request) else staff_permissions(employee, request)
        if request.query_params.get('items') == '1':
            if 'items' not in permissions:
                return Response({'error': 'Items permission required.'}, status=403)
            rows = []
            for item in Item.objects.select_related('category').annotate(average_rating_value=Avg('orderitem__rating')).all().order_by('name'):
                rows.append(self._item_data(item))
            return Response({'items': rows})
        if request.query_params.get('item_detail'):
            if 'items' not in permissions:
                return Response({'error': 'Items permission required.'}, status=403)
            item = Item.objects.annotate(average_rating_value=Avg('orderitem__rating')).filter(pk=request.query_params['item_detail']).first()
            if not item:
                return Response({'error': 'Item not found.'}, status=404)
            return Response({'item': self._item_data(item), 'categories': self._categories()})
        if request.query_params.get('item_categories') == '1':
            if 'items' not in permissions:
                return Response({'error': 'Items permission required.'}, status=403)
            return Response({'categories': self._categories()})
        order = self._order(request.query_params.get('order_id'))
        if not order:
            return Response({'error': 'Order not found.'}, status=404)
        return Response(self._details(order))

    def post(self, request):
        employee = self._employee(request)
        if not employee and not owner(request):
            return Response({'error': 'Owner or authorized staff access required.'}, status=403)
        action = request.data.get('action')
        permissions = {'orders', 'kitchen', 'items'} if owner(request) else staff_permissions(employee, request)
        if action == 'item_save':
            if 'items' not in permissions:
                return Response({'error': 'Items permission required.'}, status=403)
            item_id = request.data.get('id')
            item = Item.objects.filter(pk=item_id).first() if item_id else Item()
            if item_id and not item:
                return Response({'error': 'Item not found.'}, status=404)
            category = Category.objects.filter(pk=request.data.get('category')).first()
            if not category:
                return Response({'error': 'Select a valid category.'}, status=400)
            name = str(request.data.get('name') or '').strip()
            if not name or len(name) > 30:
                return Response({'error': 'Item name must be 1-30 characters.'}, status=400)
            try:
                full = Decimal(str(request.data.get('price_full') or '0'))
                half_raw = request.data.get('price_half')
                half = Decimal(str(half_raw)) if half_raw not in (None, '') else None
                if full < 0 or full >= 10000 or (half is not None and (half < 0 or half >= 10000)):
                    raise InvalidOperation()
            except (InvalidOperation, ValueError):
                return Response({'error': 'Enter valid nonnegative item prices.'}, status=400)
            item.category = category
            item.name = name
            item.price_full = full
            item.price_half = half
            item.item_type = request.data.get('item_type') if request.data.get('item_type') in ('Veg', 'Nonveg', 'Other') else 'Other'
            item.description = str(request.data.get('description') or '')[:500]
            item.is_active = str(request.data.get('is_active', 'true')).lower() == 'true'
            item.best_seller = str(request.data.get('best_seller', 'false')).lower() == 'true'
            if 'kitchen_available' in request.data:
                item.kitchen_available = str(request.data['kitchen_available']).lower() == 'true'
            if request.FILES.get('icon'):
                item.icon = request.FILES['icon']
            try:
                # Django's ImageField validators open the stored image during full_clean().
                # An existing image can be missing from disk even when its DB path exists.
                # When the user did not upload a new image, validate every other field
                # without trying to reopen that old file.
                if request.FILES.get('icon'):
                    item.full_clean()
                else:
                    item.full_clean(exclude=['icon'])
                item.save()
            except ValidationError as exc:
                return Response({'error': getattr(exc, 'message_dict', None) or exc.messages}, status=400)
            except (FileNotFoundError, OSError) as exc:
                return Response({'error': 'The item image could not be accessed. Please upload a new image or ask the administrator to restore the missing media file.'}, status=400)
            return Response({'success': True, 'item': self._item_data(item)})
        if action == 'item_active':
            if 'items' not in permissions:
                return Response({'error': 'Items permission required.'}, status=403)
            if not isinstance(request.data.get('active'), bool):
                return Response({'error': 'active must be true or false.'}, status=400)
            item = Item.objects.filter(pk=request.data.get('item_id')).first()
            if not item:
                return Response({'error': 'Item not found.'}, status=404)
            item.is_active = request.data['active']
            item.save(update_fields=['is_active'])
            return Response({'success': True, 'item_id': item.pk, 'active': item.is_active})
        if action == 'availability':
            if 'kitchen' not in permissions and 'items' not in permissions:
                return Response({'error': 'Kitchen permission required.'}, status=403)
            if not isinstance(request.data.get('available'), bool):
                return Response({'error': 'available must be true or false.'}, status=400)
            item = Item.objects.filter(pk=request.data.get('item_id')).first()
            if not item:
                return Response({'error': 'Menu item not found.'}, status=404)
            item.kitchen_available = request.data['available']
            item.save(update_fields=['kitchen_available'])
            return Response({'success': True, 'item_id': item.pk, 'available': item.kitchen_available})
        if 'orders' not in permissions:
            return Response({'error': 'Order editing permission required.'}, status=403)
        order = self._order(request.data.get('order_id'))
        if not order:
            return Response({'error': 'Order not found.'}, status=404)
        if order.order_status in ('Cancelled', 'Completed', 'Delivered') or order.payment_status == 'Completed':
            return Response({'error': 'This order is closed and cannot be edited.'}, status=409)
        with transaction.atomic():
            order = Order.objects.select_for_update().get(pk=order.pk)
            if action == 'add':
                item = Item.objects.filter(pk=request.data.get('item_id'), is_active=True, kitchen_available=True, category__is_active=True, category__menu__is_active=True).first()
                if not item:
                    return Response({'error': 'This menu item is unavailable.'}, status=409)
                size = request.data.get('size', 'Full')
                if size not in ('Full', 'Half'):
                    return Response({'error': 'Invalid serving size.'}, status=400)
                try:
                    qty = int(request.data.get('quantity', 1))
                except (TypeError, ValueError):
                    qty = 0
                if not 1 <= qty <= 50:
                    return Response({'error': 'Quantity must be between 1 and 50.'}, status=400)
                line = OrderItem.objects.filter(order_id=order, item_id=item, serving_size=size, item_status='Pending').first()
                if line:
                    line.quantity += qty
                    line.price = cart_line_price(item, size, line.quantity)
                    line.save(update_fields=['quantity', 'price'])
                else:
                    OrderItem.objects.create(order_id=order, item_id=item, item=item.name, serving_size=size, quantity=qty, price=cart_line_price(item, size, qty), item_status='Pending')
            elif action in ('quantity', 'remove'):
                line = OrderItem.objects.select_for_update().filter(pk=request.data.get('line_id'), order_id=order).first()
                if not line:
                    return Response({'error': 'Order item not found.'}, status=404)
                if line.item_status != 'Pending':
                    return Response({'error': 'Only pending items can be edited. Ask the kitchen to handle prepared items.'}, status=409)
                if action == 'remove':
                    line.item_status = 'Cancelled'
                    line.save(update_fields=['item_status'])
                else:
                    try:
                        qty = int(request.data.get('quantity'))
                    except (TypeError, ValueError):
                        qty = 0
                    if not 1 <= qty <= 50:
                        return Response({'error': 'Quantity must be between 1 and 50.'}, status=400)
                    if not line.item_id or not line.item_id.is_active or not line.item_id.kitchen_available:
                        return Response({'error': 'Item is unavailable; remove it instead.'}, status=409)
                    line.quantity = qty
                    line.price = cart_line_price(line.item_id, line.serving_size, qty)
                    line.save(update_fields=['quantity', 'price'])
            else:
                return Response({'error': 'Invalid action.'}, status=400)
            active = OrderItem.objects.filter(order_id=order).exclude(item_status='Cancelled')
            order.sub_total = sum(float(line.price) for line in active)
            if not active.exists():
                order.order_status = 'Cancelled'
            else:
                order.order_status = 'Placed'
            order.save(update_fields=['sub_total', 'order_status'])
        return Response(self._details(order))
