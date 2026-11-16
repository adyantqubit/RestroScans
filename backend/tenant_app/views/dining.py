# from django.db.models import ProtectedError
# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from common.listing import list_page
# from ..models import DiningTable, RestaurantFloor
# from ..serializers import DiningTableSerializer


# def floor_data(row):
#     return {'id': row.id, 'name': row.name, 'is_active': row.is_active, 'table_count': row.tables.count()}


# def table_data(row):
#     data = DiningTableSerializer(row).data
#     data['floor_name'] = row.floor.name if row.floor_id else None
#     data['location_label'] = f'{row.floor.name} · {row.name}' if row.floor_id else f'Direct · {row.name}'
#     return data


# def parse_floor(value):
#     if value in (None, '', 'null', 'direct'):
#         return None
#     try:
#         return RestaurantFloor.objects.get(pk=int(value))
#     except (ValueError, TypeError, RestaurantFloor.DoesNotExist):
#         raise ValueError('Selected floor does not exist.')


# def duplicate(name, floor, exclude=None):
#     rows = DiningTable.objects.filter(name__iexact=name, floor=floor)
#     return rows.exclude(pk=exclude).exists() if exclude else rows.exists()


# class RestaurantFloorAPI(APIView):
#     def get(self, request, tenant, pk=None):
#         rows = RestaurantFloor.objects.all().order_by('name')
#         return Response({'floors': [floor_data(row) for row in rows]})

#     def post(self, request, tenant, pk=None):
#         name = str(request.data.get('name') or '').strip()
#         if not name:
#             return Response({'message': 'Floor name is required.'}, status=400)
#         if RestaurantFloor.objects.filter(name__iexact=name).exists():
#             return Response({'message': 'Floor already exists.'}, status=400)
#         row = RestaurantFloor.objects.create(name=name)
#         return Response({'floor': floor_data(row)}, status=201)

#     def put(self, request, tenant, pk):
#         row = RestaurantFloor.objects.filter(pk=pk).first()
#         if not row:
#             return Response({'message': 'Floor not found.'}, status=404)
#         name = str(request.data.get('name', row.name) or '').strip()
#         if not name or RestaurantFloor.objects.filter(name__iexact=name).exclude(pk=pk).exists():
#             return Response({'message': 'Invalid or duplicate floor name.'}, status=400)
#         row.name = name
#         if 'is_active' in request.data:
#             row.is_active = request.data['is_active'] in (True, 'true', '1', 1)
#         row.save()
#         return Response({'floor': floor_data(row)})

#     def delete(self, request, tenant, pk):
#         row = RestaurantFloor.objects.filter(pk=pk).first()
#         if not row:
#             return Response({'message': 'Floor not found.'}, status=404)
#         try:
#             row.delete()
#         except ProtectedError:
#             return Response({'message': 'Move or remove tables before deleting this floor.'}, status=409)
#         return Response({'success': True})


# class DiningTablePageAPI(APIView):
#     def post(self, request, tenant):
#         rows, total = list_page(DiningTable.objects.select_related('floor'), request.data,
#             ('name', 'floor__name'), {'name': 'name', 'seats': 'seats', 'is_active': 'is_active'},
#             default_order='name', filter_fields={'is_active': 'is_active'})
#         return Response({'tables': [table_data(row) for row in rows], 'count': total})


# class DiningTableAPI(APIView):
#     def get(self, request, tenant, pk=None):
#         if pk is not None:
#             row = DiningTable.objects.select_related('floor').filter(pk=pk).first()
#             return Response({'table': table_data(row)}) if row else Response({'message': 'Table not found.'}, status=404)
#         rows = DiningTable.objects.select_related('floor').all().order_by('floor__name', 'name')
#         return Response({'tables': [table_data(row) for row in rows]})

#     def post(self, request, tenant, pk=None):
#         name = str(request.data.get('name') or '').strip()
#         if not name:
#             return Response({'message': 'Table name is required.'}, status=400)
#         try:
#             floor = parse_floor(request.data.get('floor'))
#         except ValueError as exc:
#             return Response({'message': str(exc)}, status=400)
#         if duplicate(name, floor):
#             return Response({'message': 'Table already exists at this location.'}, status=400)
#         try:
#             seats = max(1, int(request.data.get('seats') or 4))
#         except (ValueError, TypeError):
#             seats = 4
#         row = DiningTable.objects.create(name=name, floor=floor, seats=seats,
#             is_active=request.data.get('is_active', True) in (True, 'true', '1', 1))
#         return Response({'table': table_data(row)}, status=201)

#     def put(self, request, tenant, pk):
#         row = DiningTable.objects.filter(pk=pk).first()
#         if not row:
#             return Response({'message': 'Table not found.'}, status=404)
#         name = str(request.data.get('name', row.name) or '').strip()
#         try:
#             floor = parse_floor(request.data.get('floor', row.floor_id))
#         except ValueError as exc:
#             return Response({'message': str(exc)}, status=400)
#         if not name or duplicate(name, floor, pk):
#             return Response({'message': 'Invalid or duplicate table at this location.'}, status=400)
#         row.name, row.floor = name, floor
#         if 'seats' in request.data:
#             try:
#                 row.seats = max(1, int(request.data['seats']))
#             except (ValueError, TypeError):
#                 return Response({'message': 'Invalid seat count.'}, status=400)
#         if 'is_active' in request.data:
#             row.is_active = request.data['is_active'] in (True, 'true', '1', 1)
#         row.save()
#         return Response({'table': table_data(row)})

#     def delete(self, request, tenant, pk):
#         row = DiningTable.objects.filter(pk=pk).first()
#         if not row:
#             return Response({'message': 'Table not found.'}, status=404)
#         row.delete()
#         return Response({'success': True})


# class PublicTableResolveAPI(APIView):
#     authentication_classes = []
#     permission_classes = []

#     def get(self, request, tenant, pk):
#         row = DiningTable.objects.select_related('floor').filter(pk=pk, is_active=True).first()
#         if not row or (row.floor_id and not row.floor.is_active):
#             return Response({'message': 'This QR code is no longer active.'}, status=404)
#         return Response({'table': table_data(row)})



from django.db.models import ProtectedError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from common.listing import list_page
from ..models import DiningTable, RestaurantFloor
from ..serializers import DiningTableSerializer


def floor_data(row):
    return {'id': row.id, 'name': row.name, 'is_active': row.is_active, 'table_count': row.tables.count()}


def table_data(row):
    data = DiningTableSerializer(row).data
    data['floor_name'] = row.floor.name if row.floor_id else None
    data['location_label'] = f'{row.floor.name} · {row.name}' if row.floor_id else f'Direct · {row.name}'
    return data


def parse_floor(value):
    if value in (None, '', 'null', 'direct'):
        return None
    try:
        return RestaurantFloor.objects.get(pk=int(value))
    except (ValueError, TypeError, RestaurantFloor.DoesNotExist):
        raise ValueError('Selected floor does not exist.')


def duplicate(name, floor, exclude=None):
    rows = DiningTable.objects.filter(name__iexact=name, floor=floor)
    return rows.exclude(pk=exclude).exists() if exclude else rows.exists()


class RestaurantFloorAPI(APIView):
    def get(self, request, tenant, pk=None):
        rows = RestaurantFloor.objects.all().order_by('name')
        return Response({'floors': [floor_data(row) for row in rows]})

    def post(self, request, tenant, pk=None):
        name = str(request.data.get('name') or '').strip()
        if not name:
            return Response({'message': 'Floor name is required.'}, status=400)
        if RestaurantFloor.objects.filter(name__iexact=name).exists():
            return Response({'message': 'Floor already exists.'}, status=400)
        row = RestaurantFloor.objects.create(name=name)
        return Response({'floor': floor_data(row)}, status=201)

    def put(self, request, tenant, pk):
        row = RestaurantFloor.objects.filter(pk=pk).first()
        if not row:
            return Response({'message': 'Floor not found.'}, status=404)
        name = str(request.data.get('name', row.name) or '').strip()
        if not name or RestaurantFloor.objects.filter(name__iexact=name).exclude(pk=pk).exists():
            return Response({'message': 'Invalid or duplicate floor name.'}, status=400)
        row.name = name
        if 'is_active' in request.data:
            row.is_active = request.data['is_active'] in (True, 'true', '1', 1)
        row.save()
        return Response({'floor': floor_data(row)})

    def delete(self, request, tenant, pk):
        row = RestaurantFloor.objects.filter(pk=pk).first()
        if not row:
            return Response({'message': 'Floor not found.'}, status=404)
        try:
            row.delete()
        except ProtectedError:
            return Response({'message': 'Move or remove tables before deleting this floor.'}, status=409)
        return Response({'success': True})


class DiningTablePageAPI(APIView):
    def post(self, request, tenant):
        rows, total = list_page(DiningTable.objects.select_related('floor'), request.data,
            ('name', 'floor__name'), {'name': 'name', 'seats': 'seats', 'is_active': 'is_active'},
            default_order='name', filter_fields={'is_active': 'is_active'})
        return Response({'tables': [table_data(row) for row in rows], 'count': total})


class DiningTableAPI(APIView):
    def get(self, request, tenant, pk=None):
        if pk is not None:
            row = DiningTable.objects.select_related('floor').filter(pk=pk).first()
            return Response({'table': table_data(row)}) if row else Response({'message': 'Table not found.'}, status=404)
        rows = DiningTable.objects.select_related('floor').all().order_by('floor__name', 'name')
        return Response({'tables': [table_data(row) for row in rows]})

    def post(self, request, tenant, pk=None):
        name = str(request.data.get('name') or '').strip()
        if not name:
            return Response({'message': 'Table name is required.'}, status=400)
        try:
            floor = parse_floor(request.data.get('floor'))
        except ValueError as exc:
            return Response({'message': str(exc)}, status=400)
        if duplicate(name, floor):
            return Response({'message': 'Table already exists at this location.'}, status=400)
        try:
            seats = max(1, int(request.data.get('seats') or 4))
        except (ValueError, TypeError):
            seats = 4
        row = DiningTable.objects.create(name=name, floor=floor, seats=seats,
            is_active=request.data.get('is_active', True) in (True, 'true', '1', 1))
        return Response({'table': table_data(row)}, status=201)

    def put(self, request, tenant, pk):
        row = DiningTable.objects.filter(pk=pk).first()
        if not row:
            return Response({'message': 'Table not found.'}, status=404)
        name = str(request.data.get('name', row.name) or '').strip()
        try:
            floor = parse_floor(request.data.get('floor', row.floor_id))
        except ValueError as exc:
            return Response({'message': str(exc)}, status=400)
        if not name or duplicate(name, floor, pk):
            return Response({'message': 'Invalid or duplicate table at this location.'}, status=400)
        row.name, row.floor = name, floor
        if 'seats' in request.data:
            try:
                row.seats = max(1, int(request.data['seats']))
            except (ValueError, TypeError):
                return Response({'message': 'Invalid seat count.'}, status=400)
        if 'is_active' in request.data:
            row.is_active = request.data['is_active'] in (True, 'true', '1', 1)
        row.save()
        return Response({'table': table_data(row)})

    def delete(self, request, tenant, pk):
        row = DiningTable.objects.filter(pk=pk).first()
        if not row:
            return Response({'message': 'Table not found.'}, status=404)
        row.delete()
        return Response({'success': True})


class PublicTableResolveAPI(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, tenant, pk):
        row = DiningTable.objects.select_related('floor').filter(pk=pk, is_active=True).first()
        if not row or (row.floor_id and not row.floor.is_active):
            return Response({'message': 'This QR code is no longer active.'}, status=404)
        return Response({'table': table_data(row)})


class PublicTableLocationAPI(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, tenant, table_number, floor_number=None):
        import re
        from django.db.models import Q

        if table_number < 1 or (floor_number is not None and floor_number < 1):
            return Response({'message': 'Invalid floor or table number.'}, status=400)

        floors = RestaurantFloor.objects.filter(is_active=True)
        if floor_number is None:
            # Ground-floor tables may be stored without a floor or under Ground Floor.
            ground_ids = [f.id for f in floors if re.sub(r'[^a-z0-9]', '', f.name.lower()) in ('ground', 'groundfloor')]
            candidates = DiningTable.objects.select_related('floor').filter(is_active=True).filter(
                Q(floor__isnull=True) | Q(floor_id__in=ground_ids))
        else:
            # URL floor number is the displayed storey (First=1), never a DB primary key.
            names = {1: ('first', 'firstfloor', '1', 'floor1', '1stfloor'),
                     2: ('second', 'secondfloor', '2', 'floor2', '2ndfloor'),
                     3: ('third', 'thirdfloor', '3', 'floor3', '3rdfloor')}
            valid = names.get(floor_number, (str(floor_number), f'floor{floor_number}'))
            floor_ids = [f.id for f in floors if re.sub(r'[^a-z0-9]', '', f.name.lower()) in valid]
            candidates = DiningTable.objects.select_related('floor').filter(is_active=True, floor_id__in=floor_ids)

        # Table number is the visible table label, not DiningTable.id.
        expected = {str(table_number), f't{table_number}', f'table{table_number}'}
        matches = [row for row in candidates if re.sub(r'[^a-z0-9]', '', row.name.lower()) in expected]
        if len(matches) != 1:
            return Response({'message': 'Table not found or table number is ambiguous at this location.'}, status=404)
        return Response({'table': table_data(matches[0])})
