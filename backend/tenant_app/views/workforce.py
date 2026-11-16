

# """Tenant-isolated restaurant workforce APIs. Owner-only; never public."""

# from calendar import monthrange

# from datetime import date, datetime, timedelta

# from decimal import Decimal, ROUND_HALF_UP

# from django.db import transaction, IntegrityError

# from django.db.models import Sum
# from django.db.models.functions import Replace
# from django.db.models import Value, CharField
# from django.utils import timezone
# from admin_app.models import Tenant
# from admin_app.plan_catalog import codes_for_tenant
# from tenant_app.models import StaffFlexibleOff
# from tenant_app.utils.encryption import hash_password

# from rest_framework.views import APIView

# from rest_framework.response import Response

# from admin_app.authentication import ROLE_OWNER, ROLE_WAITER, staff_identity_for_tenant

# from admin_app.middlewares import bearer_token

# from tenant_app.models import StaffEmployee, StaffAttendance, StaffLeave, StaffPayrollSettings, StaffPayroll, Waiter, StaffAttendanceRequest, Order, OrderItem, DiningTable, Setting

# def owner(request):

#     identity = staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name)

#     return identity is not None and identity.role == ROLE_OWNER

# def normalized_phone(value):
#     digits = ''.join(ch for ch in str(value or '') if ch.isdigit())
#     return digits[-10:] if len(digits) >= 10 else ''


# def logged_employee(request):
#     """Resolve a tenant-scoped, active waiter JWT to one active StaffEmployee."""
#     identity = staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name)
#     if not identity or identity.role != ROLE_WAITER:
#         return None
#     waiter = Waiter.objects.filter(pk=identity.user_id, is_active=True).first()
#     if not waiter:
#         return None
#     phone = normalized_phone(waiter.contact_number)
#     if not phone:
#         return None
#     matches = [employee for employee in StaffEmployee.objects.filter(is_active=True)
#                if normalized_phone(employee.phone) == phone]
#     return matches[0] if len(matches) == 1 else None

# def approver(request):
#     if owner(request):
#         return True
#     employee = logged_employee(request)
#     return bool(employee and employee.can_approve)

# def fail(message, code=400):

#     return Response({'error': message}, status=code)

# def parse_date(value):

#     return date.fromisoformat(value)

# def money(value):

#     return Decimal(str(value)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

# STAFF_PERMISSION_FEATURES = {'orders': 'order', 'tables': 'order', 'order_history': 'order', 'kitchen': 'order', 'items': 'order', 'billing': 'order', 'reservations': 'reservation', 'customers': 'order', 'reports': 'report', 'payments': 'payment', 'loyalty': 'loyalty', 'expenses': 'expense'}
# STAFF_PERMISSION_KEYS = tuple(STAFF_PERMISSION_FEATURES)

# def staff_plan_features(request):
#     tenant = Tenant.objects.filter(schema_name=request.tenant.schema_name).first()
#     return set(codes_for_tenant(tenant))

# def staff_permissions(employee, request):
#     allowed = employee.access_permissions if isinstance(employee.access_permissions, list) else []
#     features = staff_plan_features(request)
#     return [key for key in STAFF_PERMISSION_KEYS if key in allowed and STAFF_PERMISSION_FEATURES[key] in features]

# def validated_permissions(value):
#     if not isinstance(value, list) or any(not isinstance(x, str) or x not in STAFF_PERMISSION_KEYS for x in value):
#         raise ValueError('Invalid staff permissions')
#     return list(dict.fromkeys(value))

# def employee_data(e):

#     return {'id': e.id, 'name': e.name, 'phone': e.phone, 'gender': e.gender, 'role': e.role, 'monthly_salary': str(e.monthly_salary), 'joining_date': str(e.joining_date), 'is_active': e.is_active, 'can_approve': e.can_approve, 'access_permissions': e.access_permissions, 'staff_login_enabled': any(normalized_phone(w.contact_number) == normalized_phone(e.phone) for w in Waiter.objects.filter(is_active=True)) if normalized_phone(e.phone) else False}

# WEEKDAYS = ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')

# def eligible_start(employee, year):
#     return max(employee.joining_date, date(year, 1, 1))

# def accrued_offs(employee, settings, through):
#     if settings.week_off_mode != 'flexible' or through < employee.joining_date:
#         return 0
#     start = eligible_start(employee, through.year)
#     return max(0, (through.year - start.year) * 12 + through.month - start.month + 1) * settings.monthly_off_quota

# def off_balance(employee, settings, through):
#     if settings.week_off_mode != 'flexible':
#         return {'earned': 0, 'used': 0, 'remaining': 0}
#     through = min(through, timezone.localdate())
#     if through < employee.joining_date:
#         return {'earned': 0, 'used': 0, 'remaining': 0}
#     earned = accrued_offs(employee, settings, through)
#     used = StaffFlexibleOff.objects.filter(employee=employee, date__year=through.year, date__lte=through).count()
#     return {'earned': earned, 'used': used, 'remaining': max(0, earned - used)}

# LEAVE_QUOTAS = {
#     'Paid': 'paid_leaves_per_year',
#     'Casual': 'casual_leaves_per_year',
#     'Sick': 'sick_leaves_per_year',
#     'Medical': 'medical_leaves_per_year',
# }

# def yearly_leave_days(employee, kind, year, exclude_id=None):
#     """Unique approved dates in one calendar year for a leave category."""
#     qs = StaffLeave.objects.filter(employee=employee, leave_type=kind, status='Approved',
#         start_date__lte=date(year, 12, 31), end_date__gte=date(year, 1, 1))
#     if exclude_id is not None:
#         qs = qs.exclude(pk=exclude_id)
#     dates = set()
#     for item in qs:
#         start = max(item.start_date, date(year, 1, 1), employee.joining_date)
#         end = min(item.end_date, date(year, 12, 31))
#         for offset in range(max(0, (end - start).days + 1)):
#             dates.add(start + timedelta(days=offset))
#     return dates

# def leave_quota_error(employee, kind, start, end, settings, exclude_id=None):
#     if kind == 'Unpaid':
#         return None
#     quota = int(getattr(settings, LEAVE_QUOTAS[kind]))
#     if quota == 0:
#         return f'{kind} leave is disabled (annual allowance is 0)'
#     for year in range(start.year, end.year + 1):
#         begin = max(start, date(year, 1, 1), employee.joining_date)
#         finish = min(end, date(year, 12, 31))
#         if finish < begin:
#             continue
#         new_dates = {begin + timedelta(days=n) for n in range((finish - begin).days + 1)}
#         used = yearly_leave_days(employee, kind, year, exclude_id)
#         if len(used | new_dates) > quota:
#             return f'{kind} leave exceeds {quota} day(s) allowed in {year}; already used {len(used)}'
#     return None

# def leave_dates(employee, start, end):
#     paid, unpaid = set(), set()
#     for leave in StaffLeave.objects.filter(employee=employee, status='Approved', start_date__lte=end, end_date__gte=start):
#         day = max(start, leave.start_date)
#         while day <= min(end, leave.end_date):
#             (unpaid if leave.leave_type == 'Unpaid' else paid).add(day)
#             day += timedelta(days=1)
#     return paid, unpaid

# def off_dates(employee, settings, start, end):
#     if settings.week_off_mode == 'fixed':
#         weekdays = {WEEKDAYS.index(d) for d in settings.week_off_days if d in WEEKDAYS}
#         return {start + timedelta(days=n) for n in range((end - start).days + 1) if (start + timedelta(days=n)).weekday() in weekdays}
#     return set(StaffFlexibleOff.objects.filter(employee=employee, date__range=(start, end)).values_list('date', flat=True))

# def sync_staff_login(employee, data, previous_phone=None):
#     """Owner-only employee account provisioning using the existing waiter JWT login."""
#     enabled = data.get('enable_staff_login')
#     password = str(data.get('login_password') or '')
#     phone = (employee.phone or '').strip()
#     if enabled is not True and not password and previous_phone == phone:
#         return
#     if enabled is not True and not password and previous_phone is None:
#         return
#     if enabled is True or password:
#         if not phone:
#             raise ValueError('Mobile number required for Staff Login')
#         if password and len(password) < 8:
#             raise ValueError('Login password must contain at least 8 characters')
#         old = next((w for w in Waiter.objects.all() if normalized_phone(w.contact_number) == normalized_phone(previous_phone)), None) if previous_phone else None
#         existing = next((w for w in Waiter.objects.all() if normalized_phone(w.contact_number) == normalized_phone(phone)), None)
#         if old and old.contact_number != phone and existing and existing.pk != old.pk:
#             raise ValueError('New mobile number is already used by another login account')
#         if old and old.contact_number != phone and not existing:
#             old.contact_number = phone
#             old.save(update_fields=['contact_number'])
#             existing = old
#         if not existing:
#             if not password:
#                 raise ValueError('Set a login password for the new Staff account')
#             existing = Waiter(contact_number=phone)
#         if password:
#             existing.password = hash_password(password)
#         existing.name = employee.name
#         existing.is_active = employee.is_active
#         existing.save()
#     elif enabled is False:
#         existing = next((w for w in Waiter.objects.all() if normalized_phone(w.contact_number) == normalized_phone(previous_phone or phone)), None)
#         if existing:
#             existing.is_active = False
#             existing.save(update_fields=['is_active'])

# class WorkforceEmployees(APIView):

#     def get(self, request):

#         if owner(request) or approver(request):
#             qs = StaffEmployee.objects.order_by('id')
#         else:
#             me = logged_employee(request)
#             if not me: return fail('Staff login not linked to an active employee', 403)
#             qs = StaffEmployee.objects.filter(pk=me.pk)
#         return Response({'results': [employee_data(e) for e in qs]})

#     def post(self, request):

#         if not owner(request): return fail('Owner access required', 403)

#         try:

#             salary = money(request.data.get('monthly_salary', '0'))

#             if salary < 0: raise ValueError('Salary cannot be negative')

#             name = str(request.data.get('name', '')).strip()

#             if not name: return fail('Employee name required')

#             gender = request.data.get('gender', 'Other')

#             if gender not in ('Male', 'Female', 'Other'): return fail('Invalid gender')

#             with transaction.atomic():
#                 e = StaffEmployee.objects.create(name=name, phone=str(request.data.get('phone', '')).strip(), gender=gender, role=str(request.data.get('role', '')).strip(), monthly_salary=salary, joining_date=parse_date(request.data.get('joining_date') or str(date.today())), can_approve=request.data.get('can_approve') is True, access_permissions=validated_permissions(request.data.get('access_permissions', [])))
#                 sync_staff_login(e, request.data)
#             return Response(employee_data(e), status=201)

#         except (ValueError, TypeError, ArithmeticError, IntegrityError) as exc:

#             return fail(str(exc))

# class WorkforceEmployeeDetail(APIView):

#     def patch(self, request, pk):

#         if not owner(request): return fail('Owner access required', 403)

#         e = StaffEmployee.objects.filter(pk=pk).first()

#         if not e: return fail('Employee not found', 404)

#         try:
#             previous_phone = e.phone

#             for field in ('name', 'phone', 'role'):

#                 if field in request.data: setattr(e, field, str(request.data[field]).strip())

#             if 'gender' in request.data:

#                 if request.data['gender'] not in ('Male', 'Female', 'Other'): return fail('Invalid gender')

#                 e.gender = request.data['gender']

#             if 'monthly_salary' in request.data:

#                 e.monthly_salary = money(request.data['monthly_salary'])

#                 if e.monthly_salary < 0: return fail('Salary cannot be negative')

#             if 'is_active' in request.data: e.is_active = request.data['is_active'] is True

#             if 'can_approve' in request.data: e.can_approve = request.data['can_approve'] is True

#             if 'access_permissions' in request.data: e.access_permissions = validated_permissions(request.data['access_permissions'])

#             with transaction.atomic():
#                 e.full_clean(); e.save()
#                 sync_staff_login(e, request.data, previous_phone=previous_phone)
#             return Response(employee_data(e))

#         except (ValueError, TypeError, IntegrityError) as exc:

#             return fail(str(exc))

# class WorkforceAttendance(APIView):
#     def get(self, request):
#         if not owner(request): return fail('Owner access required', 403)
#         qs = StaffAttendance.objects.select_related('employee').order_by('-date', '-id')
#         off_qs = StaffFlexibleOff.objects.select_related('employee').order_by('-date', '-id')
#         employee_id = request.query_params.get('employee_id')
#         if employee_id:
#             qs = qs.filter(employee_id=employee_id)
#             off_qs = off_qs.filter(employee_id=employee_id)
#         month = request.query_params.get('month')
#         if month:
#             try:
#                 year, m = map(int, month.split('-'))
#                 if not 1 <= m <= 12: raise ValueError()
#                 qs = qs.filter(date__year=year, date__month=m)
#                 off_qs = off_qs.filter(date__year=year, date__month=m)
#             except (ValueError, TypeError): return fail('Month must be YYYY-MM')
#         rows = [{'id': a.id, 'employee_id': a.employee_id, 'employee': a.employee.name, 'date': str(a.date), 'check_in': a.check_in.strftime('%H:%M') if a.check_in else None, 'check_out': a.check_out.strftime('%H:%M') if a.check_out else None, 'status': 'Present', 'off_id': None} for a in qs[:1000]]
#         rows += [{'id': 'off-' + str(a.id), 'employee_id': a.employee_id, 'employee': a.employee.name, 'date': str(a.date), 'check_in': None, 'check_out': None, 'status': 'Week Off', 'off_id': a.id} for a in off_qs[:1000]]
#         rows.sort(key=lambda a: (a['date'], str(a['id'])), reverse=True)
#         settings, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
#         balances = {str(e.id): off_balance(e, settings, timezone.localdate()) for e in StaffEmployee.objects.all()}
#         return Response({'results': rows[:1000], 'off_balances': balances})

#     def post(self, request):
#         if not owner(request): return fail('Owner access required', 403)
#         try:
#             employee = StaffEmployee.objects.get(pk=int(request.data['employee_id']), is_active=True)
#             day = parse_date(request.data.get('date') or str(timezone.localdate()))
#             action = request.data.get('action')
#             if action not in ('in', 'out', 'off', 'remove_off'): return fail('Invalid attendance action')
#             if day < employee.joining_date: return fail('Date is before joining date')
#             if day > timezone.localdate(): return fail('Future attendance is not allowed')
#             settings, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
#             with transaction.atomic():
#                 if action in ('off', 'remove_off'):
#                     if settings.week_off_mode != 'flexible': return fail('Manual Week Off is only for Flexible Monthly Off')
#                     if action == 'remove_off':
#                         deleted, _ = StaffFlexibleOff.objects.filter(employee=employee, date=day).delete()
#                         if not deleted: return fail('No Week Off on this date')
#                     else:
#                         if StaffAttendance.objects.filter(employee=employee, date=day, check_in__isnull=False).exists(): return fail('Attendance already exists for this date')
#                         if StaffFlexibleOff.objects.filter(employee=employee, date=day).exists(): return fail('Week Off already marked')
#                         if StaffLeave.objects.filter(employee=employee, status='Approved', start_date__lte=day, end_date__gte=day).exists(): return fail('Approved leave already exists for this date')
#                         if off_balance(employee, settings, day)['remaining'] <= 0: return fail('No available flexible off balance')
#                         StaffFlexibleOff.objects.create(employee=employee, date=day)
#                     return Response({'status': 'saved'})
#                 if StaffFlexibleOff.objects.filter(employee=employee, date=day).exists(): return fail('Remove Week Off before marking attendance')
#                 if StaffLeave.objects.filter(employee=employee, status='Approved', start_date__lte=day, end_date__gte=day).exists(): return fail('Approved leave exists for this date')
#                 current_time = datetime.strptime(request.data.get('time') or timezone.localtime().strftime('%H:%M'), '%H:%M').time()
#                 record, _ = StaffAttendance.objects.select_for_update().get_or_create(employee=employee, date=day)
#                 if action == 'in':
#                     if record.check_in: return fail('Already checked in')
#                     record.check_in = current_time
#                 else:
#                     if not record.check_in: return fail('Check in first')
#                     if record.check_out: return fail('Already checked out')
#                     if current_time <= record.check_in: return fail('Checkout must be later than checkin on the same date')
#                     record.check_out = current_time
#                 record.save()
#             return Response({'id': record.id, 'status': 'saved'})
#         except (KeyError, ValueError, StaffEmployee.DoesNotExist) as exc:
#             return fail(str(exc))

# class WorkforceLeaves(APIView):

#     def get(self, request):

#         if not owner(request) and not logged_employee(request): return fail('Staff login required', 403)

#         qs = StaffLeave.objects.select_related('employee').order_by('-id')
#         if not approver(request):
#             qs = qs.filter(employee=logged_employee(request))
#         month = request.query_params.get('month')
#         if month:
#             try:
#                 year, m = map(int, month.split('-'))
#                 start, end = date(year, m, 1), date(year, m, monthrange(year, m)[1])
#             except (ValueError, TypeError): return fail('Month must be YYYY-MM')
#             qs = qs.filter(start_date__lte=end, end_date__gte=start)
#         return Response({'results': [{'id': x.id, 'employee_id': x.employee_id, 'employee': x.employee.name, 'start_date': str(x.start_date), 'end_date': str(x.end_date), 'leave_type': x.leave_type, 'reason': x.reason, 'status': x.status} for x in qs[:1000]]})

#     def post(self, request):

#         if not owner(request) and not logged_employee(request): return fail('Staff login required', 403)

#         try:

#             employee = StaffEmployee.objects.get(pk=int(request.data['employee_id']), is_active=True)
#             if not owner(request) and employee.pk != logged_employee(request).pk:
#                 return fail('You can submit only your own leave', 403)

#             start, end = parse_date(request.data['start_date']), parse_date(request.data['end_date'])

#             if end < start: return fail('End date must not precede start date')

#             if (end - start).days > 365: return fail('Leave range too long')

#             kind = request.data.get('leave_type', 'Paid')

#             if kind not in (*LEAVE_QUOTAS, 'Unpaid'): return fail('Invalid leave type')

#             if StaffLeave.objects.filter(employee=employee, status__in=['Pending', 'Approved'], start_date__lte=end, end_date__gte=start).exists(): return fail('Overlapping leave exists')
#             settings, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
#             quota_error = leave_quota_error(employee, kind, start, end, settings)
#             if quota_error: return fail(quota_error)

#             leave = StaffLeave.objects.create(employee=employee, start_date=start, end_date=end, leave_type=kind, reason=str(request.data.get('reason', '')), status='Pending')

#             return Response({'id': leave.id, 'status': leave.status}, status=201)

#         except (KeyError, ValueError, StaffEmployee.DoesNotExist) as exc:

#             return fail(str(exc))

# class WorkforceLeaveDecision(APIView):

#     def post(self, request, pk):

#         if not approver(request): return fail('Approval access required', 403)

#         decision = request.data.get('status')

#         if decision not in ('Approved', 'Rejected'): return fail('Invalid decision')

#         with transaction.atomic():

#             leave = StaffLeave.objects.select_for_update().filter(pk=pk).first()

#             if not leave: return fail('Leave not found', 404)

#             me = logged_employee(request)
#             if me and leave.employee_id == me.pk: return fail('You cannot approve your own leave', 403)

#             if leave.status != 'Pending': return fail('Only pending leaves can be decided')
#             if decision == 'Approved':
#                 settings, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
#                 quota_error = leave_quota_error(leave.employee, leave.leave_type, leave.start_date, leave.end_date, settings, exclude_id=leave.pk)
#                 if quota_error: return fail(quota_error)

#             leave.status = decision

#             leave.save(update_fields=['status'])

#         return Response({'id': leave.id, 'status': leave.status})

# class WorkforceSettings(APIView):
#     def get(self, request):
#         if not owner(request): return fail('Owner access required', 403)
#         s, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
#         return Response({'male_hours': str(s.male_hours), 'female_hours': str(s.female_hours), 'other_hours': str(s.other_hours), 'salary_mode': s.salary_mode, 'paid_leaves_per_year': s.paid_leaves_per_year, 'casual_leaves_per_year': s.casual_leaves_per_year, 'sick_leaves_per_year': s.sick_leaves_per_year, 'medical_leaves_per_year': s.medical_leaves_per_year, 'week_off_mode': s.week_off_mode, 'monthly_off_quota': s.monthly_off_quota, 'week_off_days': s.week_off_days})

#     def put(self, request):
#         if not owner(request): return fail('Owner access required', 403)
#         try:
#             with transaction.atomic():
#                 s, _ = StaffPayrollSettings.objects.select_for_update().get_or_create(pk=1)
#                 for key in ('male_hours', 'female_hours', 'other_hours'):
#                     if key in request.data:
#                         value = Decimal(str(request.data[key]))
#                         if not Decimal('0') < value <= Decimal('24'): return fail('Working hours must be between 0 and 24')
#                         setattr(s, key, value)
#                 if 'salary_mode' in request.data:
#                     if request.data['salary_mode'] not in ('hour', 'day'): return fail('Invalid salary mode')
#                     s.salary_mode = request.data['salary_mode']
#                 if 'paid_leaves_per_year' in request.data:
#                     n = int(request.data['paid_leaves_per_year'])
#                     if not 0 <= n <= 365: return fail('Invalid leave allowance')
#                     s.paid_leaves_per_year = n
#                 for field in ('casual_leaves_per_year', 'sick_leaves_per_year', 'medical_leaves_per_year'):
#                     if field in request.data:
#                         quota = int(request.data[field])
#                         if not 0 <= quota <= 365: return fail(f'{field} must be between 0 and 365')
#                         setattr(s, field, quota)
#                 if 'week_off_mode' in request.data:
#                     if request.data['week_off_mode'] not in ('flexible', 'fixed'): return fail('Invalid Week Off mode')
#                     if s.week_off_mode != request.data['week_off_mode'] and StaffFlexibleOff.objects.exists():
#                         return fail('Week Off policy cannot be switched while flexible off records exist')
#                     s.week_off_mode = request.data['week_off_mode']
#                 if 'monthly_off_quota' in request.data:
#                     quota = int(request.data['monthly_off_quota'])
#                     if not 0 <= quota <= 31: return fail('Monthly Off quota must be 0 to 31')
#                     s.monthly_off_quota = quota
#                 if 'week_off_days' in request.data:
#                     days = request.data['week_off_days']
#                     if not isinstance(days, list) or any(d not in WEEKDAYS for d in days): return fail('Invalid weekdays')
#                     s.week_off_days = list(dict.fromkeys(days))
#                 s.save()
#             return self.get(request)
#         except (ValueError, ArithmeticError, TypeError) as exc:
#             return fail(str(exc))

# class WorkforcePayroll(APIView):
#     def get(self, request):
#         if not owner(request): return fail('Owner access required', 403)
#         rows = []
#         qs = StaffPayroll.objects.select_related('employee').order_by('-year', '-month', 'employee_id')
#         month = request.query_params.get('month')
#         if month:
#             try:
#                 year, m = map(int, month.split('-'))
#                 if not 1 <= m <= 12: raise ValueError()
#             except (ValueError, TypeError): return fail('Month must be YYYY-MM')
#             qs = qs.filter(year=year, month=m)
#         for p in qs[:1000]:
#             rows.append({'id': p.id, 'employee': p.employee.name, 'employee_id': p.employee_id, 'month': p.month, 'year': p.year, 'start_date': str(date(p.year, p.month, 1)), 'end_date': str(date(p.year, p.month, monthrange(p.year, p.month)[1])), 'present_days': p.present_days, 'worked_hours': str(p.worked_hours), 'paid_leave_days': p.paid_leave_days, 'calculated_salary': str(p.calculated_salary)})
#         return Response({'results': rows})

#     def post(self, request):
#         if not owner(request): return fail('Owner access required', 403)
#         try:
#             employee = StaffEmployee.objects.get(pk=int(request.data['employee_id']))
#             year, month = int(request.data['year']), int(request.data['month'])
#             if not 2000 <= year <= 2100 or not 1 <= month <= 12: return fail('Invalid month/year')
#             if (year, month) > (timezone.localdate().year, timezone.localdate().month): return fail('Cannot generate future payroll')
#             start, end = date(year, month, 1), date(year, month, monthrange(year, month)[1])
#             period_start = max(start, employee.joining_date)
#             period_end = min(end, timezone.localdate())
#             if period_start > period_end: return fail('No employed days in this period')
#             s, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
#             attendance = StaffAttendance.objects.filter(employee=employee, date__range=(period_start, period_end), check_in__isnull=False, check_out__isnull=False)
#             present_dates, hours = set(), Decimal('0')
#             for a in attendance:
#                 elapsed = datetime.combine(a.date, a.check_out) - datetime.combine(a.date, a.check_in)
#                 if elapsed.total_seconds() <= 0: continue
#                 present_dates.add(a.date)
#                 hours += Decimal(str(elapsed.total_seconds())) / Decimal('3600')
#             paid_leave, unpaid_leave = leave_dates(employee, period_start, period_end)
#             off = off_dates(employee, s, period_start, period_end)
#             # Do not pay for the same day twice; unpaid leave wins over off/paid leave.
#             payable_off = off - present_dates - unpaid_leave
#             eligible_paid_leave = paid_leave - present_dates - unpaid_leave - payable_off
#             # Approved paid leave is limited independently for each configured category.
#             # Older approved leave remains recorded; only configured annual allowance is payable.
#             paid = 0
#             for kind, field in LEAVE_QUOTAS.items():
#                 quota = int(getattr(s, field))
#                 if quota <= 0:
#                     continue
#                 year_dates = sorted(yearly_leave_days(employee, kind, year))
#                 payable_dates = set(year_dates[:quota]) & eligible_paid_leave
#                 paid += len(payable_dates)
#             days_in_period = (period_end - period_start).days + 1
#             days_in_month = (end - start).days + 1
#             monthly_salary = Decimal(employee.monthly_salary)
#             expected = Decimal({'Male': s.male_hours, 'Female': s.female_hours, 'Other': s.other_hours}[employee.gender])
#             if expected <= 0:
#                 return fail('Expected daily working hours must be greater than zero')
#             if s.week_off_mode == 'fixed':
#                 # Count actual configured weekdays in this calendar month, not a fixed 4-off quota.
#                 month_off = off_dates(employee, s, start, end)
#                 month_workdays = days_in_month - len(month_off)
#                 if month_workdays <= 0:
#                     return fail('Fixed weekly off settings leave no working days in this month')
#                 period_workdays = sum(1 for offset in range(days_in_period)
#                                       if period_start + timedelta(days=offset) not in month_off)
#                 daily = monthly_salary / Decimal(month_workdays)
#                 # A weekly off is already included in the working-day divisor; do not pay it again.
#                 # Work on a scheduled weekly off is not overtime by default.
#                 worked_dates = present_dates - month_off
#                 payable_leave = min(paid, len(eligible_paid_leave - month_off))
#                 paid_workdays = min(period_workdays, len(worked_dates) + payable_leave)
#                 salary_cap = daily * Decimal(period_workdays)
#                 if s.salary_mode == 'hour':
#                     # Attendance is stored as one in/out pair per date in the current backend.
#                     # Subtract hours logged on scheduled weekly offs to avoid accidental extra pay.
#                     regular_hours = Decimal('0')
#                     for a in attendance:
#                         if a.date in month_off: continue
#                         elapsed = datetime.combine(a.date, a.check_out) - datetime.combine(a.date, a.check_in)
#                         if elapsed.total_seconds() > 0:
#                             regular_hours += Decimal(str(elapsed.total_seconds())) / Decimal('3600')
#                     calculated = regular_hours * (daily / expected) + Decimal(payable_leave) * daily
#                 else:
#                     calculated = Decimal(paid_workdays) * daily
#             else:
#                 # Flexible monthly off: preserve calendar-day salary basis and carry-forward policy.
#                 daily = monthly_salary / Decimal(days_in_month)
#                 salary_cap = monthly_salary * Decimal(days_in_period) / Decimal(days_in_month)
#                 if s.salary_mode == 'hour':
#                     calculated = hours * (daily / expected) + (paid + len(payable_off)) * daily
#                 else:
#                     payable_days = min(days_in_period, len(present_dates) + paid + len(payable_off))
#                     calculated = Decimal(payable_days) * daily
#             # No overtime/unused-off cash-out; cap at the employed period's regular salary.
#             calculated = money(min(salary_cap, max(Decimal('0'), calculated)))
#             with transaction.atomic():
#                 payroll, _ = StaffPayroll.objects.update_or_create(employee=employee, month=month, year=year, defaults={'present_days': len(present_dates), 'worked_hours': money(hours), 'paid_leave_days': paid + len(payable_off), 'calculated_salary': calculated})
#             return Response({'id': payroll.id, 'calculated_salary': str(calculated), 'present_days': len(present_dates), 'worked_hours': str(money(hours)), 'paid_leave_days': paid + len(payable_off), 'week_off_days': len(payable_off), 'start_date': str(start), 'end_date': str(end)})
#         except (KeyError, ValueError, StaffEmployee.DoesNotExist, ArithmeticError, TypeError) as exc:
#             return fail(str(exc))


# class WorkforceStaffProfile(APIView):
#     def get(self, request):
#         me = logged_employee(request)
#         if not me:
#             return fail('Staff account is not linked to an active employee. Ask the restaurant admin to open Employees > Edit, confirm the same mobile number, enable Staff Login and save.', 403)
#         today = timezone.localdate()
#         a = StaffAttendance.objects.filter(employee=me, date=today).first()
#         return Response({'employee': {'id': me.pk, 'name': me.name, 'role': me.role,
#             'can_approve': bool(me.can_approve), 'permissions': staff_permissions(me, request)}, 'today': str(today),
#             'attendance': {'check_in': a.check_in.strftime('%H:%M') if a and a.check_in else None,
#                            'check_out': a.check_out.strftime('%H:%M') if a and a.check_out else None}})

#     def post(self, request):
#         me = logged_employee(request)
#         if not me:
#             return fail('Staff login required', 403)
#         action = request.data.get('action')
#         if action not in ('in', 'out'):
#             return fail('Invalid action')
#         day = timezone.localdate()
#         if day < me.joining_date:
#             return fail('Employee has not joined yet')
#         if StaffFlexibleOff.objects.filter(employee=me, date=day).exists():
#             return fail('Paid week off is already marked today')
#         if StaffLeave.objects.filter(employee=me, status='Approved', start_date__lte=day, end_date__gte=day).exists():
#             return fail('Approved leave exists for today')
#         now = timezone.localtime().time().replace(second=0, microsecond=0)
#         with transaction.atomic():
#             record, _ = StaffAttendance.objects.select_for_update().get_or_create(employee=me, date=day)
#             if action == 'in':
#                 if record.check_in:
#                     return fail('Already checked in today')
#                 record.check_in = now
#             else:
#                 if not record.check_in:
#                     return fail('Check in first')
#                 if record.check_out:
#                     return fail('Already checked out today')
#                 if now <= record.check_in:
#                     return fail('Check out must be after check in')
#                 record.check_out = now
#             record.save()
#         return Response({'status': 'saved'})


# class WorkforceStaffOperations(APIView):
#     """Tenant-scoped operational read/write APIs guarded by staff permissions."""
#     def get(self, request):
#         me = logged_employee(request)
#         if not me:
#             return fail('Active staff login required', 403)
#         section = request.query_params.get('section', '')
#         permissions = staff_permissions(me, request)
#         required = {'orders': 'orders', 'history': 'order_history', 'tables': 'tables', 'kitchen': 'kitchen', 'billing': 'billing'}
#         if section not in required or required[section] not in permissions:
#             return fail('This section is not enabled for your account or plan', 403)
#         if section == 'tables':
#             return Response({'results': list(DiningTable.objects.order_by('name').values('id', 'name', 'seats', 'is_active')[:200])})
#         qs = Order.objects.order_by('-date', '-id')
#         # Keep served orders in the staff list just as in the original admin list.
#         if section == 'kitchen':
#             qs = qs.exclude(order_status__in=['Completed', 'Cancelled', 'Delivered'])
#         selected = list(qs[:1000])
#         ids = [o.id for o in selected]
#         items = list(OrderItem.objects.filter(order_id_id__in=ids).values(
#             'id', 'order_id_id', 'item', 'quantity', 'serving_size', 'price', 'item_status', 'date'))
#         grouped = {}
#         all_items = []
#         for item in items:
#             item['order_id'] = next((o.order_id for o in selected if o.id == item['order_id_id']), '')
#             item['price'] = float(item['price'] or 0)
#             item['date'] = timezone.localtime(item['date']).strftime('%Y-%m-%dT%H:%M:%S')
#             grouped.setdefault(item['order_id_id'], []).append(item)
#             all_items.append(item)
#         rows = [{
#             'id': o.id, 'order_id': o.order_id, 'table_number': o.table_number,
#             'order_status': o.order_status, 'payment_status': o.payment_status,
#             'sub_total': float(o.sub_total or 0), 'total': float(o.total or 0),
#             'cgst': float(o.cgst or 0), 'sgst': float(o.sgst or 0),
#             'final_amount': float(o.final_amount or 0),
#             'discount_rupees': float(o.discount_rupees or 0),
#             'loyality_point_price': float(o.loyality_point_price or 0),
#             'customer_name': o.customer_name or '',
#             'payment_mode': o.payment_mode or 'Cash',
#             'cancelled_by': o.cancelled_by or '---',
#             'cancel_reason': o.cancel_reason or '',
#             'discount_percentage': float(o.discount_percentage or 0),
#             'discount_reason': o.discount_reason or '',
#             'apply_loyality_point': int(o.apply_loyality_point or 0),
#             'loyality_point_price': float(o.loyality_point_price or 0),
#             'loyality_point_status': o.loyality_point_status or 'not used',
#             'loyality_point_calculated': bool(o.loyality_point_calculated),
#             'customer_loyality_point': 0,
#             'rating': float(o.rating or 0),
#             'review': o.review or '',
#             'date': timezone.localtime(o.date).strftime('%Y-%m-%dT%H:%M:%S'),
#             'items': grouped.get(o.id, []),
#         } for o in selected]
#         setting = Setting.objects.first()
#         restaurant = {
#             'name': getattr(request.tenant, 'name', None) or request.tenant.schema_name,
#             'address': getattr(request.tenant, 'address', '') or '',
#         }
#         return Response({
#             'results': rows, 'order_items': all_items, 'restaurant': restaurant,
#             'settings': {'gstin': getattr(setting, 'gstin', '') or '',
#                          'fssaino': getattr(setting, 'fssaino', '') or ''},
#         })

#     def post(self, request):
#         me = logged_employee(request)
#         if not me:
#             return fail('Active staff login required', 403)
#         section = request.data.get('section')
#         action = request.data.get('action')
#         permissions = staff_permissions(me, request)
#         required = {'orders': 'orders', 'kitchen': 'kitchen', 'billing': 'billing', 'tables': 'tables'}
#         if section not in required or required[section] not in permissions:
#             return fail('Permission or subscription plan does not allow this action', 403)
#         if section == 'tables':
#             if action not in ('create_table', 'update_table', 'delete_table'):
#                 return fail('Unsupported table action')
#             with transaction.atomic():
#                 row = None
#                 if action != 'create_table':
#                     try:
#                         table_id = int(request.data.get('table_id'))
#                     except (ValueError, TypeError):
#                         return fail('Valid table_id is required')
#                     row = DiningTable.objects.select_for_update().filter(pk=table_id).first()
#                     if not row:
#                         return fail('Table not found', 404)
#                 if action == 'delete_table':
#                     row.delete()
#                     return Response({'status': 'deleted'})
#                 name = str(request.data.get('name', row.name if row else '') or '').strip()
#                 if not name or len(name) > 50:
#                     return fail('Table name must contain 1 to 50 characters')
#                 if DiningTable.objects.filter(name__iexact=name).exclude(pk=row.pk if row else None).exists():
#                     return fail('This table already exists')
#                 try:
#                     seats = int(request.data.get('seats', row.seats if row else 4))
#                 except (ValueError, TypeError):
#                     return fail('Seats must be a number')
#                 if not 1 <= seats <= 10000:
#                     return fail('Seats must be between 1 and 10000')
#                 is_active = request.data.get('is_active', row.is_active if row else True)
#                 if not isinstance(is_active, bool):
#                     return fail('is_active must be a boolean')
#                 if row is None:
#                     row = DiningTable.objects.create(name=name, seats=seats, is_active=is_active)
#                 else:
#                     row.name, row.seats, row.is_active = name, seats, is_active
#                     row.save(update_fields=['name', 'seats', 'is_active'])
#                 return Response({'status': 'updated', 'table': {'id': row.pk, 'name': row.name, 'seats': row.seats, 'is_active': row.is_active}})
#         try:
#             order_id = int(request.data.get('order_id'))
#         except (TypeError, ValueError):
#             return fail('Valid order_id is required')
#         with transaction.atomic():
#             order = Order.objects.select_for_update().filter(pk=order_id).first()
#             if not order:
#                 return fail('Order not found', 404)
#             if section == 'orders' and action == 'add_item':
#                 # Reuse the owner's existing item pricing, offer, GST, totals and
#                 # order-status recalculation. Never duplicate that business logic.
#                 if str(request.data.get('order_order_id', '')) != str(order.order_id):
#                     return fail('Order number mismatch')
#                 if str(request.data.get('order_id', '')) != str(order.pk):
#                     return fail('Order ID mismatch')
#                 try:
#                     item_id = int(request.data.get('item_id'))
#                     quantity = int(request.data.get('quantity'))
#                 except (TypeError, ValueError):
#                     return fail('Valid item and quantity are required')
#                 if quantity < 1 or quantity > 1000:
#                     return fail('Quantity must be between 1 and 1000')
#                 if request.data.get('serving_size') not in ('Half', 'Full'):
#                     return fail('Invalid serving size')
#                 if request.data.get('item_status') != 'Pending':
#                     return fail('New items must be pending')
#                 from tenant_app.models import Item
#                 item = Item.objects.filter(pk=item_id).first()
#                 if not item or str(request.data.get('item', '')).strip() != str(item.name).strip():
#                     return fail('Invalid menu item')
#                 from tenant_app.views.orders import AddOrderItemsAPIView
#                 # This endpoint uses the same tenant-scoped JWT identity and
#                 # original owner add-item logic; the staff permission is checked above.
#                 return AddOrderItemsAPIView().post(request, tenant=request.tenant.schema_name)
#             elif section == 'orders' and action == 'edit':
#                 changes = request.data.get('changes')
#                 if not isinstance(changes, dict):
#                     return fail('Invalid order changes')
#                 allowed = {
#                     'table_number', 'order_status', 'payment_status', 'payment_mode',
#                     'cancelled_by', 'cancel_reason', 'discount_reason',
#                     'discount_rupees', 'discount_percentage', 'apply_loyality_point',
#                 }
#                 if not changes or set(changes) - (allowed | {'id'}):
#                     return fail('Unsupported order edit fields')
#                 if 'id' in changes and str(changes['id']) != str(order.pk):
#                     return fail('Order ID mismatch')
#                 statuses = {'Placed', 'Confirm', 'Cooked', 'Served', 'Cancelled'}
#                 payments = {'Pending', 'Completed', 'Paid'}
#                 if 'order_status' in changes and changes['order_status'] not in statuses:
#                     return fail('Invalid order status')
#                 if 'payment_status' in changes and changes['payment_status'] not in payments:
#                     return fail('Invalid payment status')
#                 if 'table_number' in changes and not str(changes['table_number']).strip():
#                     return fail('Table number cannot be empty')
#                 if 'order_status' in changes and changes['order_status'] == 'Cancelled' and not str(changes.get('cancel_reason', order.cancel_reason)).strip():
#                     return fail('Cancel reason is required')
#                 numeric = {}
#                 for field in ('discount_rupees', 'discount_percentage', 'apply_loyality_point'):
#                     if field in changes:
#                         try:
#                             value = Decimal(str(changes[field]))
#                         except Exception:
#                             return fail(f'Invalid {field}')
#                         if not value.is_finite() or value < 0:
#                             return fail(f'Invalid {field}')
#                         numeric[field] = value
#                 if 'discount_percentage' in numeric and numeric['discount_percentage'] > 100:
#                     return fail('Discount percentage cannot exceed 100')
#                 if 'apply_loyality_point' in numeric and numeric['apply_loyality_point'] != numeric['apply_loyality_point'].to_integral_value():
#                     return fail('Loyalty points must be a whole number')
#                 if 'discount_rupees' in numeric and numeric['discount_rupees'] > Decimal(str(order.sub_total or 0)):
#                     return fail('Discount exceeds subtotal')
#                 if 'discount_rupees' in numeric or 'discount_percentage' in numeric or 'apply_loyality_point' in numeric:
#                     # Monetary edits need the original owner's recalculation/loyalty rules.
#                     # Reject rather than silently save incorrect totals or loyalty balances.
#                     return fail('Discount and loyalty changes require owner billing rules; staff may edit order status, table and payment details.', 403)
#                 for field in allowed - {'discount_rupees', 'discount_percentage', 'apply_loyality_point'}:
#                     if field in changes:
#                         setattr(order, field, str(changes[field]))
#                 try:
#                     order.full_clean()
#                     order.save()
#                 except Exception as exc:
#                     return fail(f'Order validation failed: {exc}')
#             elif section == 'orders' and action == 'confirm':
#                 if order.order_status != 'Placed':
#                     return fail('Only placed orders can be confirmed')
#                 order.order_status = 'Confirm'
#                 order.save(update_fields=['order_status'])
#             elif section == 'orders' and action == 'serve':
#                 if order.order_status != 'Cooked':
#                     return fail('Order must be cooked before serving')
#                 order.order_status = 'Served'
#                 order.save(update_fields=['order_status'])
#             elif section in ('orders', 'kitchen') and action == 'cooked':
#                 if order.order_status != 'Confirm':
#                     return fail('Only confirmed orders can be marked cooked')
#                 order.order_status = 'Cooked'
#                 order.save(update_fields=['order_status'])
#             elif section == 'kitchen' and action == 'confirm_item':
#                 try:
#                     item_id = int(request.data.get('item_id'))
#                 except (TypeError, ValueError):
#                     return fail('Valid item_id is required')
#                 item = OrderItem.objects.select_for_update().filter(pk=item_id, order_id=order).first()
#                 if not item:
#                     return fail('Order item not found', 404)
#                 if item.item_status != 'Pending':
#                     return fail('Only pending items can be confirmed')
#                 item.item_status = 'Confirm'
#                 item.save(update_fields=['item_status'])
#             elif section == 'billing' and action == 'payment_completed':
#                 if order.order_status == 'Cancelled':
#                     return fail('Cancelled orders cannot be paid')
#                 if order.payment_status != 'Pending':
#                     return fail('Payment is already processed')
#                 order.payment_status = 'Completed'
#                 order.save(update_fields=['payment_status'])
#             else:
#                 return fail('Unsupported action for this section')
#         return Response({'status': 'updated', 'order_id': order.pk})






































# """Tenant-isolated restaurant workforce APIs. Owner-only; never public."""

# from calendar import monthrange

# from datetime import date, datetime, timedelta

# from decimal import Decimal, ROUND_HALF_UP

# from django.db import transaction, IntegrityError

# from django.db.models import Sum
# from django.db.models.functions import Replace
# from django.db.models import Value, CharField
# from django.utils import timezone
# from admin_app.models import Tenant
# from admin_app.plan_catalog import codes_for_tenant
# from tenant_app.models import StaffFlexibleOff
# from tenant_app.utils.encryption import hash_password

# from rest_framework.views import APIView

# from rest_framework.response import Response

# from admin_app.authentication import ROLE_OWNER, ROLE_WAITER, staff_identity_for_tenant

# from admin_app.middlewares import bearer_token

# from tenant_app.models import StaffEmployee, StaffAttendance, StaffLeave, StaffPayrollSettings, StaffPayroll, Waiter, StaffAttendanceRequest, Order, OrderItem, DiningTable, Setting

# def owner(request):

#     identity = staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name)

#     return identity is not None and identity.role == ROLE_OWNER

# def normalized_phone(value):
#     digits = ''.join(ch for ch in str(value or '') if ch.isdigit())
#     return digits[-10:] if len(digits) >= 10 else ''


# def logged_employee(request):
#     """Resolve a tenant-scoped, active waiter JWT to one active StaffEmployee."""
#     identity = staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name)
#     if not identity or identity.role != ROLE_WAITER:
#         return None
#     waiter = Waiter.objects.filter(pk=identity.user_id, is_active=True).first()
#     if not waiter:
#         return None
#     phone = normalized_phone(waiter.contact_number)
#     if not phone:
#         return None
#     matches = [employee for employee in StaffEmployee.objects.filter(is_active=True)
#                if normalized_phone(employee.phone) == phone]
#     return matches[0] if len(matches) == 1 else None

# def approver(request):
#     if owner(request):
#         return True
#     employee = logged_employee(request)
#     return bool(employee and employee.can_approve)

# def fail(message, code=400):

#     return Response({'error': message}, status=code)

# def parse_date(value):

#     return date.fromisoformat(value)

# def money(value):

#     return Decimal(str(value)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

# STAFF_PERMISSION_FEATURES = {'orders': 'order', 'tables': 'order', 'order_history': 'order', 'kitchen': 'order', 'items': 'order', 'billing': 'order', 'reservations': 'reservation', 'customers': 'order', 'reports': 'report', 'payments': 'payment', 'loyalty': 'loyalty', 'expenses': 'expense'}
# STAFF_PERMISSION_KEYS = tuple(STAFF_PERMISSION_FEATURES)

# def staff_plan_features(request):
#     tenant = Tenant.objects.filter(schema_name=request.tenant.schema_name).first()
#     return set(codes_for_tenant(tenant))

# def staff_permissions(employee, request):
#     allowed = employee.access_permissions if isinstance(employee.access_permissions, list) else []
#     features = staff_plan_features(request)
#     return [key for key in STAFF_PERMISSION_KEYS if key in allowed and STAFF_PERMISSION_FEATURES[key] in features]

# def validated_permissions(value):
#     if not isinstance(value, list) or any(not isinstance(x, str) or x not in STAFF_PERMISSION_KEYS for x in value):
#         raise ValueError('Invalid staff permissions')
#     return list(dict.fromkeys(value))

# def employee_data(e):

#     return {'id': e.id, 'name': e.name, 'phone': e.phone, 'gender': e.gender, 'role': e.role, 'monthly_salary': str(e.monthly_salary), 'joining_date': str(e.joining_date), 'is_active': e.is_active, 'can_approve': e.can_approve, 'access_permissions': e.access_permissions, 'staff_login_enabled': any(normalized_phone(w.contact_number) == normalized_phone(e.phone) for w in Waiter.objects.filter(is_active=True)) if normalized_phone(e.phone) else False}

# WEEKDAYS = ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')

# def eligible_start(employee, year):
#     return max(employee.joining_date, date(year, 1, 1))

# def accrued_offs(employee, settings, through):
#     if settings.week_off_mode != 'flexible' or through < employee.joining_date:
#         return 0
#     start = eligible_start(employee, through.year)
#     return max(0, (through.year - start.year) * 12 + through.month - start.month + 1) * settings.monthly_off_quota

# def off_balance(employee, settings, through):
#     if settings.week_off_mode != 'flexible':
#         return {'earned': 0, 'used': 0, 'remaining': 0}
#     through = min(through, timezone.localdate())
#     if through < employee.joining_date:
#         return {'earned': 0, 'used': 0, 'remaining': 0}
#     earned = accrued_offs(employee, settings, through)
#     used = StaffFlexibleOff.objects.filter(employee=employee, date__year=through.year, date__lte=through).count()
#     return {'earned': earned, 'used': used, 'remaining': max(0, earned - used)}

# LEAVE_QUOTAS = {
#     'Paid': 'paid_leaves_per_year',
#     'Casual': 'casual_leaves_per_year',
#     'Sick': 'sick_leaves_per_year',
#     'Medical': 'medical_leaves_per_year',
# }

# def yearly_leave_days(employee, kind, year, exclude_id=None):
#     """Unique approved dates in one calendar year for a leave category."""
#     qs = StaffLeave.objects.filter(employee=employee, leave_type=kind, status='Approved',
#         start_date__lte=date(year, 12, 31), end_date__gte=date(year, 1, 1))
#     if exclude_id is not None:
#         qs = qs.exclude(pk=exclude_id)
#     dates = set()
#     for item in qs:
#         start = max(item.start_date, date(year, 1, 1), employee.joining_date)
#         end = min(item.end_date, date(year, 12, 31))
#         for offset in range(max(0, (end - start).days + 1)):
#             dates.add(start + timedelta(days=offset))
#     return dates

# def leave_quota_error(employee, kind, start, end, settings, exclude_id=None):
#     if kind == 'Unpaid':
#         return None
#     quota = int(getattr(settings, LEAVE_QUOTAS[kind]))
#     if quota == 0:
#         return f'{kind} leave is disabled (annual allowance is 0)'
#     for year in range(start.year, end.year + 1):
#         begin = max(start, date(year, 1, 1), employee.joining_date)
#         finish = min(end, date(year, 12, 31))
#         if finish < begin:
#             continue
#         new_dates = {begin + timedelta(days=n) for n in range((finish - begin).days + 1)}
#         used = yearly_leave_days(employee, kind, year, exclude_id)
#         if len(used | new_dates) > quota:
#             return f'{kind} leave exceeds {quota} day(s) allowed in {year}; already used {len(used)}'
#     return None

# def leave_dates(employee, start, end):
#     paid, unpaid = set(), set()
#     for leave in StaffLeave.objects.filter(employee=employee, status='Approved', start_date__lte=end, end_date__gte=start):
#         day = max(start, leave.start_date)
#         while day <= min(end, leave.end_date):
#             (unpaid if leave.leave_type == 'Unpaid' else paid).add(day)
#             day += timedelta(days=1)
#     return paid, unpaid

# def off_dates(employee, settings, start, end):
#     if settings.week_off_mode == 'fixed':
#         weekdays = {WEEKDAYS.index(d) for d in settings.week_off_days if d in WEEKDAYS}
#         return {start + timedelta(days=n) for n in range((end - start).days + 1) if (start + timedelta(days=n)).weekday() in weekdays}
#     return set(StaffFlexibleOff.objects.filter(employee=employee, date__range=(start, end)).values_list('date', flat=True))

# def sync_staff_login(employee, data, previous_phone=None):
#     """Owner-only employee account provisioning using the existing waiter JWT login."""
#     enabled = data.get('enable_staff_login')
#     password = str(data.get('login_password') or '')
#     phone = (employee.phone or '').strip()
#     if enabled is not True and not password and previous_phone == phone:
#         return
#     if enabled is not True and not password and previous_phone is None:
#         return
#     if enabled is True or password:
#         if not phone:
#             raise ValueError('Mobile number required for Staff Login')
#         if password and len(password) < 8:
#             raise ValueError('Login password must contain at least 8 characters')
#         old = next((w for w in Waiter.objects.all() if normalized_phone(w.contact_number) == normalized_phone(previous_phone)), None) if previous_phone else None
#         existing = next((w for w in Waiter.objects.all() if normalized_phone(w.contact_number) == normalized_phone(phone)), None)
#         if old and old.contact_number != phone and existing and existing.pk != old.pk:
#             raise ValueError('New mobile number is already used by another login account')
#         if old and old.contact_number != phone and not existing:
#             old.contact_number = phone
#             old.save(update_fields=['contact_number'])
#             existing = old
#         if not existing:
#             if not password:
#                 raise ValueError('Set a login password for the new Staff account')
#             existing = Waiter(contact_number=phone)
#         if password:
#             existing.password = hash_password(password)
#         existing.name = employee.name
#         existing.is_active = employee.is_active
#         existing.save()
#     elif enabled is False:
#         existing = next((w for w in Waiter.objects.all() if normalized_phone(w.contact_number) == normalized_phone(previous_phone or phone)), None)
#         if existing:
#             existing.is_active = False
#             existing.save(update_fields=['is_active'])

# class WorkforceEmployees(APIView):

#     def get(self, request):

#         if owner(request) or approver(request):
#             qs = StaffEmployee.objects.order_by('id')
#         else:
#             me = logged_employee(request)
#             if not me: return fail('Staff login not linked to an active employee', 403)
#             qs = StaffEmployee.objects.filter(pk=me.pk)
#         return Response({'results': [employee_data(e) for e in qs]})

#     def post(self, request):

#         if not owner(request): return fail('Owner access required', 403)

#         try:

#             salary = money(request.data.get('monthly_salary', '0'))

#             if salary < 0: raise ValueError('Salary cannot be negative')

#             name = str(request.data.get('name', '')).strip()

#             if not name: return fail('Employee name required')

#             gender = request.data.get('gender', 'Other')

#             if gender not in ('Male', 'Female', 'Other'): return fail('Invalid gender')

#             with transaction.atomic():
#                 e = StaffEmployee.objects.create(name=name, phone=str(request.data.get('phone', '')).strip(), gender=gender, role=str(request.data.get('role', '')).strip(), monthly_salary=salary, joining_date=parse_date(request.data.get('joining_date') or str(date.today())), can_approve=request.data.get('can_approve') is True, access_permissions=validated_permissions(request.data.get('access_permissions', [])))
#                 sync_staff_login(e, request.data)
#             return Response(employee_data(e), status=201)

#         except (ValueError, TypeError, ArithmeticError, IntegrityError) as exc:

#             return fail(str(exc))

# class WorkforceEmployeeDetail(APIView):

#     def patch(self, request, pk):

#         if not owner(request): return fail('Owner access required', 403)

#         e = StaffEmployee.objects.filter(pk=pk).first()

#         if not e: return fail('Employee not found', 404)

#         try:
#             previous_phone = e.phone

#             for field in ('name', 'phone', 'role'):

#                 if field in request.data: setattr(e, field, str(request.data[field]).strip())

#             if 'gender' in request.data:

#                 if request.data['gender'] not in ('Male', 'Female', 'Other'): return fail('Invalid gender')

#                 e.gender = request.data['gender']

#             if 'monthly_salary' in request.data:

#                 e.monthly_salary = money(request.data['monthly_salary'])

#                 if e.monthly_salary < 0: return fail('Salary cannot be negative')

#             if 'is_active' in request.data: e.is_active = request.data['is_active'] is True

#             if 'can_approve' in request.data: e.can_approve = request.data['can_approve'] is True

#             if 'access_permissions' in request.data: e.access_permissions = validated_permissions(request.data['access_permissions'])

#             with transaction.atomic():
#                 e.full_clean(); e.save()
#                 sync_staff_login(e, request.data, previous_phone=previous_phone)
#             return Response(employee_data(e))

#         except (ValueError, TypeError, IntegrityError) as exc:

#             return fail(str(exc))

# class WorkforceAttendance(APIView):
#     def get(self, request):
#         if not owner(request): return fail('Owner access required', 403)
#         qs = StaffAttendance.objects.select_related('employee').order_by('-date', '-id')
#         off_qs = StaffFlexibleOff.objects.select_related('employee').order_by('-date', '-id')
#         employee_id = request.query_params.get('employee_id')
#         if employee_id:
#             qs = qs.filter(employee_id=employee_id)
#             off_qs = off_qs.filter(employee_id=employee_id)
#         month = request.query_params.get('month')
#         if month:
#             try:
#                 year, m = map(int, month.split('-'))
#                 if not 1 <= m <= 12: raise ValueError()
#                 qs = qs.filter(date__year=year, date__month=m)
#                 off_qs = off_qs.filter(date__year=year, date__month=m)
#             except (ValueError, TypeError): return fail('Month must be YYYY-MM')
#         rows = [{'id': a.id, 'employee_id': a.employee_id, 'employee': a.employee.name, 'date': str(a.date), 'check_in': a.check_in.strftime('%H:%M') if a.check_in else None, 'check_out': a.check_out.strftime('%H:%M') if a.check_out else None, 'status': 'Present', 'off_id': None} for a in qs[:1000]]
#         rows += [{'id': 'off-' + str(a.id), 'employee_id': a.employee_id, 'employee': a.employee.name, 'date': str(a.date), 'check_in': None, 'check_out': None, 'status': 'Week Off', 'off_id': a.id} for a in off_qs[:1000]]
#         rows.sort(key=lambda a: (a['date'], str(a['id'])), reverse=True)
#         settings, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
#         balances = {str(e.id): off_balance(e, settings, timezone.localdate()) for e in StaffEmployee.objects.all()}
#         return Response({'results': rows[:1000], 'off_balances': balances})

#     def post(self, request):
#         if not owner(request): return fail('Owner access required', 403)
#         try:
#             employee = StaffEmployee.objects.get(pk=int(request.data['employee_id']), is_active=True)
#             day = parse_date(request.data.get('date') or str(timezone.localdate()))
#             action = request.data.get('action')
#             if action not in ('in', 'out', 'off', 'remove_off'): return fail('Invalid attendance action')
#             if day < employee.joining_date: return fail('Date is before joining date')
#             if day > timezone.localdate(): return fail('Future attendance is not allowed')
#             settings, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
#             with transaction.atomic():
#                 if action in ('off', 'remove_off'):
#                     if settings.week_off_mode != 'flexible': return fail('Manual Week Off is only for Flexible Monthly Off')
#                     if action == 'remove_off':
#                         deleted, _ = StaffFlexibleOff.objects.filter(employee=employee, date=day).delete()
#                         if not deleted: return fail('No Week Off on this date')
#                     else:
#                         if StaffAttendance.objects.filter(employee=employee, date=day, check_in__isnull=False).exists(): return fail('Attendance already exists for this date')
#                         if StaffFlexibleOff.objects.filter(employee=employee, date=day).exists(): return fail('Week Off already marked')
#                         if StaffLeave.objects.filter(employee=employee, status='Approved', start_date__lte=day, end_date__gte=day).exists(): return fail('Approved leave already exists for this date')
#                         if off_balance(employee, settings, day)['remaining'] <= 0: return fail('No available flexible off balance')
#                         StaffFlexibleOff.objects.create(employee=employee, date=day)
#                     return Response({'status': 'saved'})
#                 if StaffFlexibleOff.objects.filter(employee=employee, date=day).exists(): return fail('Remove Week Off before marking attendance')
#                 if StaffLeave.objects.filter(employee=employee, status='Approved', start_date__lte=day, end_date__gte=day).exists(): return fail('Approved leave exists for this date')
#                 current_time = datetime.strptime(request.data.get('time') or timezone.localtime().strftime('%H:%M'), '%H:%M').time()
#                 record, _ = StaffAttendance.objects.select_for_update().get_or_create(employee=employee, date=day)
#                 if action == 'in':
#                     if record.check_in: return fail('Already checked in')
#                     record.check_in = current_time
#                 else:
#                     if not record.check_in: return fail('Check in first')
#                     if record.check_out: return fail('Already checked out')
#                     if current_time <= record.check_in: return fail('Checkout must be later than checkin on the same date')
#                     record.check_out = current_time
#                 record.save()
#             return Response({'id': record.id, 'status': 'saved'})
#         except (KeyError, ValueError, StaffEmployee.DoesNotExist) as exc:
#             return fail(str(exc))

# class WorkforceLeaves(APIView):

#     def get(self, request):

#         if not owner(request) and not logged_employee(request): return fail('Staff login required', 403)

#         qs = StaffLeave.objects.select_related('employee').order_by('-id')
#         if not approver(request):
#             qs = qs.filter(employee=logged_employee(request))
#         month = request.query_params.get('month')
#         if month:
#             try:
#                 year, m = map(int, month.split('-'))
#                 start, end = date(year, m, 1), date(year, m, monthrange(year, m)[1])
#             except (ValueError, TypeError): return fail('Month must be YYYY-MM')
#             qs = qs.filter(start_date__lte=end, end_date__gte=start)
#         return Response({'results': [{'id': x.id, 'employee_id': x.employee_id, 'employee': x.employee.name, 'start_date': str(x.start_date), 'end_date': str(x.end_date), 'leave_type': x.leave_type, 'reason': x.reason, 'status': x.status} for x in qs[:1000]]})

#     def post(self, request):

#         if not owner(request) and not logged_employee(request): return fail('Staff login required', 403)

#         try:

#             employee = StaffEmployee.objects.get(pk=int(request.data['employee_id']), is_active=True)
#             if not owner(request) and employee.pk != logged_employee(request).pk:
#                 return fail('You can submit only your own leave', 403)

#             start, end = parse_date(request.data['start_date']), parse_date(request.data['end_date'])

#             if end < start: return fail('End date must not precede start date')

#             if (end - start).days > 365: return fail('Leave range too long')

#             kind = request.data.get('leave_type', 'Paid')

#             if kind not in (*LEAVE_QUOTAS, 'Unpaid'): return fail('Invalid leave type')

#             if StaffLeave.objects.filter(employee=employee, status__in=['Pending', 'Approved'], start_date__lte=end, end_date__gte=start).exists(): return fail('Overlapping leave exists')
#             settings, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
#             quota_error = leave_quota_error(employee, kind, start, end, settings)
#             if quota_error: return fail(quota_error)

#             leave = StaffLeave.objects.create(employee=employee, start_date=start, end_date=end, leave_type=kind, reason=str(request.data.get('reason', '')), status='Pending')

#             return Response({'id': leave.id, 'status': leave.status}, status=201)

#         except (KeyError, ValueError, StaffEmployee.DoesNotExist) as exc:

#             return fail(str(exc))

# class WorkforceLeaveDecision(APIView):

#     def post(self, request, pk):

#         if not approver(request): return fail('Approval access required', 403)

#         decision = request.data.get('status')

#         if decision not in ('Approved', 'Rejected'): return fail('Invalid decision')

#         with transaction.atomic():

#             leave = StaffLeave.objects.select_for_update().filter(pk=pk).first()

#             if not leave: return fail('Leave not found', 404)

#             me = logged_employee(request)
#             if me and leave.employee_id == me.pk: return fail('You cannot approve your own leave', 403)

#             if leave.status != 'Pending': return fail('Only pending leaves can be decided')
#             if decision == 'Approved':
#                 settings, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
#                 quota_error = leave_quota_error(leave.employee, leave.leave_type, leave.start_date, leave.end_date, settings, exclude_id=leave.pk)
#                 if quota_error: return fail(quota_error)

#             leave.status = decision

#             leave.save(update_fields=['status'])

#         return Response({'id': leave.id, 'status': leave.status})

# class WorkforceSettings(APIView):
#     def get(self, request):
#         if not owner(request): return fail('Owner access required', 403)
#         s, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
#         return Response({'male_hours': str(s.male_hours), 'female_hours': str(s.female_hours), 'other_hours': str(s.other_hours), 'salary_mode': s.salary_mode, 'paid_leaves_per_year': s.paid_leaves_per_year, 'casual_leaves_per_year': s.casual_leaves_per_year, 'sick_leaves_per_year': s.sick_leaves_per_year, 'medical_leaves_per_year': s.medical_leaves_per_year, 'week_off_mode': s.week_off_mode, 'monthly_off_quota': s.monthly_off_quota, 'week_off_days': s.week_off_days})

#     def put(self, request):
#         if not owner(request): return fail('Owner access required', 403)
#         try:
#             with transaction.atomic():
#                 s, _ = StaffPayrollSettings.objects.select_for_update().get_or_create(pk=1)
#                 for key in ('male_hours', 'female_hours', 'other_hours'):
#                     if key in request.data:
#                         value = Decimal(str(request.data[key]))
#                         if not Decimal('0') < value <= Decimal('24'): return fail('Working hours must be between 0 and 24')
#                         setattr(s, key, value)
#                 if 'salary_mode' in request.data:
#                     if request.data['salary_mode'] not in ('hour', 'day'): return fail('Invalid salary mode')
#                     s.salary_mode = request.data['salary_mode']
#                 if 'paid_leaves_per_year' in request.data:
#                     n = int(request.data['paid_leaves_per_year'])
#                     if not 0 <= n <= 365: return fail('Invalid leave allowance')
#                     s.paid_leaves_per_year = n
#                 for field in ('casual_leaves_per_year', 'sick_leaves_per_year', 'medical_leaves_per_year'):
#                     if field in request.data:
#                         quota = int(request.data[field])
#                         if not 0 <= quota <= 365: return fail(f'{field} must be between 0 and 365')
#                         setattr(s, field, quota)
#                 if 'week_off_mode' in request.data:
#                     if request.data['week_off_mode'] not in ('flexible', 'fixed'): return fail('Invalid Week Off mode')
#                     if s.week_off_mode != request.data['week_off_mode'] and StaffFlexibleOff.objects.exists():
#                         return fail('Week Off policy cannot be switched while flexible off records exist')
#                     s.week_off_mode = request.data['week_off_mode']
#                 if 'monthly_off_quota' in request.data:
#                     quota = int(request.data['monthly_off_quota'])
#                     if not 0 <= quota <= 31: return fail('Monthly Off quota must be 0 to 31')
#                     s.monthly_off_quota = quota
#                 if 'week_off_days' in request.data:
#                     days = request.data['week_off_days']
#                     if not isinstance(days, list) or any(d not in WEEKDAYS for d in days): return fail('Invalid weekdays')
#                     s.week_off_days = list(dict.fromkeys(days))
#                 s.save()
#             return self.get(request)
#         except (ValueError, ArithmeticError, TypeError) as exc:
#             return fail(str(exc))

# class WorkforcePayroll(APIView):
#     def get(self, request):
#         if not owner(request): return fail('Owner access required', 403)
#         rows = []
#         qs = StaffPayroll.objects.select_related('employee').order_by('-year', '-month', 'employee_id')
#         month = request.query_params.get('month')
#         if month:
#             try:
#                 year, m = map(int, month.split('-'))
#                 if not 1 <= m <= 12: raise ValueError()
#             except (ValueError, TypeError): return fail('Month must be YYYY-MM')
#             qs = qs.filter(year=year, month=m)
#         for p in qs[:1000]:
#             rows.append({'id': p.id, 'employee': p.employee.name, 'employee_id': p.employee_id, 'month': p.month, 'year': p.year, 'start_date': str(date(p.year, p.month, 1)), 'end_date': str(date(p.year, p.month, monthrange(p.year, p.month)[1])), 'present_days': p.present_days, 'worked_hours': str(p.worked_hours), 'paid_leave_days': p.paid_leave_days, 'calculated_salary': str(p.calculated_salary)})
#         return Response({'results': rows})

#     def post(self, request):
#         if not owner(request): return fail('Owner access required', 403)
#         try:
#             employee = StaffEmployee.objects.get(pk=int(request.data['employee_id']))
#             year, month = int(request.data['year']), int(request.data['month'])
#             if not 2000 <= year <= 2100 or not 1 <= month <= 12: return fail('Invalid month/year')
#             if (year, month) > (timezone.localdate().year, timezone.localdate().month): return fail('Cannot generate future payroll')
#             start, end = date(year, month, 1), date(year, month, monthrange(year, month)[1])
#             period_start = max(start, employee.joining_date)
#             period_end = min(end, timezone.localdate())
#             if period_start > period_end: return fail('No employed days in this period')
#             s, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
#             attendance = StaffAttendance.objects.filter(employee=employee, date__range=(period_start, period_end), check_in__isnull=False, check_out__isnull=False)
#             present_dates, hours = set(), Decimal('0')
#             for a in attendance:
#                 elapsed = datetime.combine(a.date, a.check_out) - datetime.combine(a.date, a.check_in)
#                 if elapsed.total_seconds() <= 0: continue
#                 present_dates.add(a.date)
#                 hours += Decimal(str(elapsed.total_seconds())) / Decimal('3600')
#             paid_leave, unpaid_leave = leave_dates(employee, period_start, period_end)
#             off = off_dates(employee, s, period_start, period_end)
#             # Do not pay for the same day twice; unpaid leave wins over off/paid leave.
#             payable_off = off - present_dates - unpaid_leave
#             eligible_paid_leave = paid_leave - present_dates - unpaid_leave - payable_off
#             # Approved paid leave is limited independently for each configured category.
#             # Older approved leave remains recorded; only configured annual allowance is payable.
#             paid = 0
#             for kind, field in LEAVE_QUOTAS.items():
#                 quota = int(getattr(s, field))
#                 if quota <= 0:
#                     continue
#                 year_dates = sorted(yearly_leave_days(employee, kind, year))
#                 payable_dates = set(year_dates[:quota]) & eligible_paid_leave
#                 paid += len(payable_dates)
#             days_in_period = (period_end - period_start).days + 1
#             days_in_month = (end - start).days + 1
#             monthly_salary = Decimal(employee.monthly_salary)
#             expected = Decimal({'Male': s.male_hours, 'Female': s.female_hours, 'Other': s.other_hours}[employee.gender])
#             if expected <= 0:
#                 return fail('Expected daily working hours must be greater than zero')
#             if s.week_off_mode == 'fixed':
#                 # Count actual configured weekdays in this calendar month, not a fixed 4-off quota.
#                 month_off = off_dates(employee, s, start, end)
#                 month_workdays = days_in_month - len(month_off)
#                 if month_workdays <= 0:
#                     return fail('Fixed weekly off settings leave no working days in this month')
#                 period_workdays = sum(1 for offset in range(days_in_period)
#                                       if period_start + timedelta(days=offset) not in month_off)
#                 daily = monthly_salary / Decimal(month_workdays)
#                 # A weekly off is already included in the working-day divisor; do not pay it again.
#                 # Work on a scheduled weekly off is not overtime by default.
#                 worked_dates = present_dates - month_off
#                 payable_leave = min(paid, len(eligible_paid_leave - month_off))
#                 paid_workdays = min(period_workdays, len(worked_dates) + payable_leave)
#                 salary_cap = daily * Decimal(period_workdays)
#                 if s.salary_mode == 'hour':
#                     # Attendance is stored as one in/out pair per date in the current backend.
#                     # Subtract hours logged on scheduled weekly offs to avoid accidental extra pay.
#                     regular_hours = Decimal('0')
#                     for a in attendance:
#                         if a.date in month_off: continue
#                         elapsed = datetime.combine(a.date, a.check_out) - datetime.combine(a.date, a.check_in)
#                         if elapsed.total_seconds() > 0:
#                             regular_hours += Decimal(str(elapsed.total_seconds())) / Decimal('3600')
#                     calculated = regular_hours * (daily / expected) + Decimal(payable_leave) * daily
#                 else:
#                     calculated = Decimal(paid_workdays) * daily
#             else:
#                 # Flexible monthly off: preserve calendar-day salary basis and carry-forward policy.
#                 daily = monthly_salary / Decimal(days_in_month)
#                 salary_cap = monthly_salary * Decimal(days_in_period) / Decimal(days_in_month)
#                 if s.salary_mode == 'hour':
#                     calculated = hours * (daily / expected) + (paid + len(payable_off)) * daily
#                 else:
#                     payable_days = min(days_in_period, len(present_dates) + paid + len(payable_off))
#                     calculated = Decimal(payable_days) * daily
#             # No overtime/unused-off cash-out; cap at the employed period's regular salary.
#             calculated = money(min(salary_cap, max(Decimal('0'), calculated)))
#             with transaction.atomic():
#                 payroll, _ = StaffPayroll.objects.update_or_create(employee=employee, month=month, year=year, defaults={'present_days': len(present_dates), 'worked_hours': money(hours), 'paid_leave_days': paid + len(payable_off), 'calculated_salary': calculated})
#             return Response({'id': payroll.id, 'calculated_salary': str(calculated), 'present_days': len(present_dates), 'worked_hours': str(money(hours)), 'paid_leave_days': paid + len(payable_off), 'week_off_days': len(payable_off), 'start_date': str(start), 'end_date': str(end)})
#         except (KeyError, ValueError, StaffEmployee.DoesNotExist, ArithmeticError, TypeError) as exc:
#             return fail(str(exc))


# class WorkforceStaffProfile(APIView):
#     def get(self, request):
#         me = logged_employee(request)
#         if not me:
#             return fail('Staff account is not linked to an active employee. Ask the restaurant admin to open Employees > Edit, confirm the same mobile number, enable Staff Login and save.', 403)
#         today = timezone.localdate()
#         a = StaffAttendance.objects.filter(employee=me, date=today).first()
#         return Response({'employee': {'id': me.pk, 'name': me.name, 'role': me.role,
#             'can_approve': bool(me.can_approve), 'permissions': staff_permissions(me, request)}, 'today': str(today),
#             'attendance': {'check_in': a.check_in.strftime('%H:%M') if a and a.check_in else None,
#                            'check_out': a.check_out.strftime('%H:%M') if a and a.check_out else None}})

#     def post(self, request):
#         me = logged_employee(request)
#         if not me:
#             return fail('Staff login required', 403)
#         action = request.data.get('action')
#         if action not in ('in', 'out'):
#             return fail('Invalid action')
#         day = timezone.localdate()
#         if day < me.joining_date:
#             return fail('Employee has not joined yet')
#         if StaffFlexibleOff.objects.filter(employee=me, date=day).exists():
#             return fail('Paid week off is already marked today')
#         if StaffLeave.objects.filter(employee=me, status='Approved', start_date__lte=day, end_date__gte=day).exists():
#             return fail('Approved leave exists for today')
#         now = timezone.localtime().time().replace(second=0, microsecond=0)
#         with transaction.atomic():
#             record, _ = StaffAttendance.objects.select_for_update().get_or_create(employee=me, date=day)
#             if action == 'in':
#                 if record.check_in:
#                     return fail('Already checked in today')
#                 record.check_in = now
#             else:
#                 if not record.check_in:
#                     return fail('Check in first')
#                 if record.check_out:
#                     return fail('Already checked out today')
#                 if now <= record.check_in:
#                     return fail('Check out must be after check in')
#                 record.check_out = now
#             record.save()
#         return Response({'status': 'saved'})


# class WorkforceStaffOperations(APIView):
#     """Tenant-scoped operational read/write APIs guarded by staff permissions."""
#     def get(self, request):
#         me = logged_employee(request)
#         if not me:
#             return fail('Active staff login required', 403)
#         section = request.query_params.get('section', '')
#         permissions = staff_permissions(me, request)
#         required = {'orders': 'orders', 'history': 'order_history', 'tables': 'tables', 'kitchen': 'kitchen', 'billing': 'billing'}
#         if section not in required or required[section] not in permissions:
#             return fail('This section is not enabled for your account or plan', 403)
#         if section == 'tables':
#             return Response({'results': list(DiningTable.objects.order_by('name').values('id', 'name', 'seats', 'is_active')[:200])})
#         qs = Order.objects.order_by('-date', '-id')
#         # Keep served orders in the staff list just as in the original admin list.
#         if section == 'kitchen':
#             qs = qs.exclude(order_status__in=['Completed', 'Cancelled', 'Delivered'])
#         selected = list(qs[:1000])
#         ids = [o.id for o in selected]
#         items = list(OrderItem.objects.filter(order_id_id__in=ids).values(
#             'id', 'order_id_id', 'item', 'quantity', 'serving_size', 'price', 'item_status', 'date'))
#         grouped = {}
#         all_items = []
#         for item in items:
#             item['order_id'] = next((o.order_id for o in selected if o.id == item['order_id_id']), '')
#             item['price'] = float(item['price'] or 0)
#             item['date'] = timezone.localtime(item['date']).strftime('%Y-%m-%dT%H:%M:%S')
#             grouped.setdefault(item['order_id_id'], []).append(item)
#             all_items.append(item)
#         rows = [{
#             'id': o.id, 'order_id': o.order_id, 'table_number': o.table_number,
#             'order_status': o.order_status, 'payment_status': o.payment_status,
#             'sub_total': float(o.sub_total or 0), 'total': float(o.total or 0),
#             'cgst': float(o.cgst or 0), 'sgst': float(o.sgst or 0),
#             'final_amount': float(o.final_amount or 0),
#             'discount_rupees': float(o.discount_rupees or 0),
#             'loyality_point_price': float(o.loyality_point_price or 0),
#             'customer_name': o.customer_name or '',
#             'payment_mode': o.payment_mode or 'Cash',
#             'cancelled_by': o.cancelled_by or '---',
#             'cancel_reason': o.cancel_reason or '',
#             'discount_percentage': float(o.discount_percentage or 0),
#             'discount_reason': o.discount_reason or '',
#             'apply_loyality_point': int(o.apply_loyality_point or 0),
#             'loyality_point_price': float(o.loyality_point_price or 0),
#             'loyality_point_status': o.loyality_point_status or 'not used',
#             'loyality_point_calculated': bool(o.loyality_point_calculated),
#             'customer_loyality_point': 0,
#             'rating': float(o.rating or 0),
#             'review': o.review or '',
#             'date': timezone.localtime(o.date).strftime('%Y-%m-%dT%H:%M:%S'),
#             'items': grouped.get(o.id, []),
#         } for o in selected]
#         setting = Setting.objects.first()
#         restaurant = {
#             'name': getattr(request.tenant, 'name', None) or request.tenant.schema_name,
#             'address': getattr(request.tenant, 'address', '') or '',
#         }
#         return Response({
#             'results': rows, 'order_items': all_items, 'restaurant': restaurant,
#             'settings': {'gstin': getattr(setting, 'gstin', '') or '',
#                          'fssaino': getattr(setting, 'fssaino', '') or ''},
#         })

#     def post(self, request):
#         me = logged_employee(request)
#         if not me:
#             return fail('Active staff login required', 403)
#         section = request.data.get('section')
#         action = request.data.get('action')
#         permissions = staff_permissions(me, request)
#         required = {'orders': 'orders', 'kitchen': 'kitchen', 'billing': 'billing'}
#         if section not in required or required[section] not in permissions:
#             return fail('Permission or subscription plan does not allow this action', 403)
#         try:
#             order_id = int(request.data.get('order_id'))
#         except (TypeError, ValueError):
#             return fail('Valid order_id is required')
#         with transaction.atomic():
#             order = Order.objects.select_for_update().filter(pk=order_id).first()
#             if not order:
#                 return fail('Order not found', 404)
#             if section == 'orders' and action == 'add_item':
#                 # Reuse the owner's existing item pricing, offer, GST, totals and
#                 # order-status recalculation. Never duplicate that business logic.
#                 if str(request.data.get('order_order_id', '')) != str(order.order_id):
#                     return fail('Order number mismatch')
#                 if str(request.data.get('order_id', '')) != str(order.pk):
#                     return fail('Order ID mismatch')
#                 try:
#                     item_id = int(request.data.get('item_id'))
#                     quantity = int(request.data.get('quantity'))
#                 except (TypeError, ValueError):
#                     return fail('Valid item and quantity are required')
#                 if quantity < 1 or quantity > 1000:
#                     return fail('Quantity must be between 1 and 1000')
#                 if request.data.get('serving_size') not in ('Half', 'Full'):
#                     return fail('Invalid serving size')
#                 if request.data.get('item_status') != 'Pending':
#                     return fail('New items must be pending')
#                 from tenant_app.models import Item
#                 item = Item.objects.filter(pk=item_id).first()
#                 if not item or str(request.data.get('item', '')).strip() != str(item.name).strip():
#                     return fail('Invalid menu item')
#                 from tenant_app.views.orders import AddOrderItemsAPIView
#                 # This endpoint uses the same tenant-scoped JWT identity and
#                 # original owner add-item logic; the staff permission is checked above.
#                 return AddOrderItemsAPIView().post(request, tenant=request.tenant.schema_name)
#             elif section == 'orders' and action == 'edit':
#                 changes = request.data.get('changes')
#                 if not isinstance(changes, dict):
#                     return fail('Invalid order changes')
#                 allowed = {
#                     'table_number', 'order_status', 'payment_status', 'payment_mode',
#                     'cancelled_by', 'cancel_reason', 'discount_reason',
#                     'discount_rupees', 'discount_percentage', 'apply_loyality_point',
#                 }
#                 if not changes or set(changes) - (allowed | {'id'}):
#                     return fail('Unsupported order edit fields')
#                 if 'id' in changes and str(changes['id']) != str(order.pk):
#                     return fail('Order ID mismatch')
#                 statuses = {'Placed', 'Confirm', 'Cooked', 'Served', 'Cancelled'}
#                 payments = {'Pending', 'Completed', 'Paid'}
#                 if 'order_status' in changes and changes['order_status'] not in statuses:
#                     return fail('Invalid order status')
#                 if 'payment_status' in changes and changes['payment_status'] not in payments:
#                     return fail('Invalid payment status')
#                 if 'table_number' in changes and not str(changes['table_number']).strip():
#                     return fail('Table number cannot be empty')
#                 if 'order_status' in changes and changes['order_status'] == 'Cancelled' and not str(changes.get('cancel_reason', order.cancel_reason)).strip():
#                     return fail('Cancel reason is required')
#                 numeric = {}
#                 for field in ('discount_rupees', 'discount_percentage', 'apply_loyality_point'):
#                     if field in changes:
#                         try:
#                             value = Decimal(str(changes[field]))
#                         except Exception:
#                             return fail(f'Invalid {field}')
#                         if not value.is_finite() or value < 0:
#                             return fail(f'Invalid {field}')
#                         numeric[field] = value
#                 if 'discount_percentage' in numeric and numeric['discount_percentage'] > 100:
#                     return fail('Discount percentage cannot exceed 100')
#                 if 'apply_loyality_point' in numeric and numeric['apply_loyality_point'] != numeric['apply_loyality_point'].to_integral_value():
#                     return fail('Loyalty points must be a whole number')
#                 if 'discount_rupees' in numeric and numeric['discount_rupees'] > Decimal(str(order.sub_total or 0)):
#                     return fail('Discount exceeds subtotal')
#                 if 'discount_rupees' in numeric or 'discount_percentage' in numeric or 'apply_loyality_point' in numeric:
#                     # Monetary edits need the original owner's recalculation/loyalty rules.
#                     # Reject rather than silently save incorrect totals or loyalty balances.
#                     return fail('Discount and loyalty changes require owner billing rules; staff may edit order status, table and payment details.', 403)
#                 for field in allowed - {'discount_rupees', 'discount_percentage', 'apply_loyality_point'}:
#                     if field in changes:
#                         setattr(order, field, str(changes[field]))
#                 try:
#                     order.full_clean()
#                     order.save()
#                 except Exception as exc:
#                     return fail(f'Order validation failed: {exc}')
#             elif section == 'orders' and action == 'confirm':
#                 if order.order_status != 'Placed':
#                     return fail('Only placed orders can be confirmed')
#                 order.order_status = 'Confirm'
#                 order.save(update_fields=['order_status'])
#             elif section == 'orders' and action == 'serve':
#                 if order.order_status != 'Cooked':
#                     return fail('Order must be cooked before serving')
#                 order.order_status = 'Served'
#                 order.save(update_fields=['order_status'])
#             elif section in ('orders', 'kitchen') and action == 'cooked':
#                 if order.order_status != 'Confirm':
#                     return fail('Only confirmed orders can be marked cooked')
#                 order.order_status = 'Cooked'
#                 order.save(update_fields=['order_status'])
#             elif section == 'kitchen' and action == 'confirm_item':
#                 try:
#                     item_id = int(request.data.get('item_id'))
#                 except (TypeError, ValueError):
#                     return fail('Valid item_id is required')
#                 item = OrderItem.objects.select_for_update().filter(pk=item_id, order_id=order).first()
#                 if not item:
#                     return fail('Order item not found', 404)
#                 if item.item_status != 'Pending':
#                     return fail('Only pending items can be confirmed')
#                 item.item_status = 'Confirm'
#                 item.save(update_fields=['item_status'])
#             elif section == 'billing' and action == 'payment_completed':
#                 if order.order_status == 'Cancelled':
#                     return fail('Cancelled orders cannot be paid')
#                 if order.payment_status != 'Pending':
#                     return fail('Payment is already processed')
#                 order.payment_status = 'Completed'
#                 order.save(update_fields=['payment_status'])
#             else:
#                 return fail('Unsupported action for this section')
#         return Response({'status': 'updated', 'order_id': order.pk})






















"""Tenant-isolated restaurant workforce APIs. Owner-only; never public."""

from calendar import monthrange

from datetime import date, datetime, timedelta

from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction, IntegrityError

from django.db.models import Sum
from django.db.models.functions import Replace
from django.db.models import Value, CharField
from django.utils import timezone
from admin_app.models import Tenant
from admin_app.plan_catalog import codes_for_tenant
from tenant_app.models import StaffFlexibleOff
from tenant_app.utils.encryption import hash_password

from rest_framework.views import APIView

from rest_framework.response import Response

from admin_app.authentication import ROLE_OWNER, ROLE_WAITER, staff_identity_for_tenant

from admin_app.middlewares import bearer_token

from tenant_app.models import StaffEmployee, StaffAttendance, StaffLeave, StaffPayrollSettings, StaffPayroll, StaffSalaryAdvance, StaffSalaryPayment, Waiter, StaffAttendanceRequest, Order, OrderItem, DiningTable, Setting

def owner(request):

    identity = staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name)

    return identity is not None and identity.role == ROLE_OWNER

def normalized_phone(value):
    digits = ''.join(ch for ch in str(value or '') if ch.isdigit())
    return digits[-10:] if len(digits) >= 10 else ''


def logged_employee(request):
    """Resolve a tenant-scoped, active waiter JWT to one active StaffEmployee."""
    identity = staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name)
    if not identity or identity.role != ROLE_WAITER:
        return None
    waiter = Waiter.objects.filter(pk=identity.user_id, is_active=True).first()
    if not waiter:
        return None
    phone = normalized_phone(waiter.contact_number)
    if not phone:
        return None
    matches = [employee for employee in StaffEmployee.objects.filter(is_active=True)
               if normalized_phone(employee.phone) == phone]
    return matches[0] if len(matches) == 1 else None

def approver(request):
    if owner(request):
        return True
    employee = logged_employee(request)
    return bool(employee and employee.can_approve)

def fail(message, code=400):

    return Response({'error': message}, status=code)

def parse_date(value):

    return date.fromisoformat(value)

def money(value):

    return Decimal(str(value)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

STAFF_PERMISSION_FEATURES = {'orders': 'order', 'tables': 'order', 'order_history': 'order', 'kitchen': 'order', 'items': 'order', 'billing': 'order', 'reservations': 'reservation', 'customers': 'order', 'reports': 'report', 'payments': 'payment', 'loyalty': 'loyalty', 'expenses': 'expense'}
STAFF_PERMISSION_KEYS = tuple(STAFF_PERMISSION_FEATURES)

def staff_plan_features(request):
    tenant = Tenant.objects.filter(schema_name=request.tenant.schema_name).first()
    return set(codes_for_tenant(tenant))

def staff_permissions(employee, request):
    allowed = employee.access_permissions if isinstance(employee.access_permissions, list) else []
    features = staff_plan_features(request)
    return [key for key in STAFF_PERMISSION_KEYS if key in allowed and STAFF_PERMISSION_FEATURES[key] in features]

def validated_permissions(value):
    if not isinstance(value, list) or any(not isinstance(x, str) or x not in STAFF_PERMISSION_KEYS for x in value):
        raise ValueError('Invalid staff permissions')
    return list(dict.fromkeys(value))

def employee_data(e):

    return {'id': e.id, 'name': e.name, 'phone': e.phone, 'gender': e.gender, 'role': e.role, 'monthly_salary': str(e.monthly_salary), 'employment_type': e.employment_type, 'joining_date': str(e.joining_date), 'is_active': e.is_active, 'can_approve': e.can_approve, 'access_permissions': e.access_permissions, 'staff_login_enabled': any(normalized_phone(w.contact_number) == normalized_phone(e.phone) for w in Waiter.objects.filter(is_active=True)) if normalized_phone(e.phone) else False}

WEEKDAYS = ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')

def eligible_start(employee, year):
    return max(employee.joining_date, date(year, 1, 1))

def accrued_offs(employee, settings, through):
    if settings.week_off_mode != 'flexible' or through < employee.joining_date:
        return 0
    start = eligible_start(employee, through.year)
    return max(0, (through.year - start.year) * 12 + through.month - start.month + 1) * settings.monthly_off_quota

def off_balance(employee, settings, through):
    if settings.week_off_mode != 'flexible':
        return {'earned': 0, 'used': 0, 'remaining': 0}
    through = min(through, timezone.localdate())
    if through < employee.joining_date:
        return {'earned': 0, 'used': 0, 'remaining': 0}
    earned = accrued_offs(employee, settings, through)
    used = StaffFlexibleOff.objects.filter(employee=employee, date__year=through.year, date__lte=through).count()
    return {'earned': earned, 'used': used, 'remaining': max(0, earned - used)}

LEAVE_QUOTAS = {
    'Paid': 'paid_leaves_per_year',
    'Casual': 'casual_leaves_per_year',
    'Sick': 'sick_leaves_per_year',
    'Medical': 'medical_leaves_per_year',
}

def yearly_leave_days(employee, kind, year, exclude_id=None):
    """Unique approved dates in one calendar year for a leave category."""
    qs = StaffLeave.objects.filter(employee=employee, leave_type=kind, status='Approved',
        start_date__lte=date(year, 12, 31), end_date__gte=date(year, 1, 1))
    if exclude_id is not None:
        qs = qs.exclude(pk=exclude_id)
    dates = set()
    for item in qs:
        start = max(item.start_date, date(year, 1, 1), employee.joining_date)
        end = min(item.end_date, date(year, 12, 31))
        for offset in range(max(0, (end - start).days + 1)):
            dates.add(start + timedelta(days=offset))
    return dates

def leave_quota_error(employee, kind, start, end, settings, exclude_id=None):
    if kind == 'Unpaid':
        return None
    quota = int(getattr(settings, LEAVE_QUOTAS[kind]))
    if quota == 0:
        return f'{kind} leave is disabled (annual allowance is 0)'
    for year in range(start.year, end.year + 1):
        begin = max(start, date(year, 1, 1), employee.joining_date)
        finish = min(end, date(year, 12, 31))
        if finish < begin:
            continue
        new_dates = {begin + timedelta(days=n) for n in range((finish - begin).days + 1)}
        used = yearly_leave_days(employee, kind, year, exclude_id)
        if len(used | new_dates) > quota:
            return f'{kind} leave exceeds {quota} day(s) allowed in {year}; already used {len(used)}'
    return None

def leave_dates(employee, start, end):
    paid, unpaid = set(), set()
    for leave in StaffLeave.objects.filter(employee=employee, status='Approved', start_date__lte=end, end_date__gte=start):
        day = max(start, leave.start_date)
        while day <= min(end, leave.end_date):
            (unpaid if leave.leave_type == 'Unpaid' else paid).add(day)
            day += timedelta(days=1)
    return paid, unpaid

def off_dates(employee, settings, start, end):
    if settings.week_off_mode == 'fixed':
        weekdays = {WEEKDAYS.index(d) for d in settings.week_off_days if d in WEEKDAYS}
        return {start + timedelta(days=n) for n in range((end - start).days + 1) if (start + timedelta(days=n)).weekday() in weekdays}
    return set(StaffFlexibleOff.objects.filter(employee=employee, date__range=(start, end)).values_list('date', flat=True))

def sync_staff_login(employee, data, previous_phone=None):
    """Owner-only employee account provisioning using the existing waiter JWT login."""
    enabled = data.get('enable_staff_login')
    password = str(data.get('login_password') or '')
    phone = (employee.phone or '').strip()
    if enabled is not True and not password and previous_phone == phone:
        return
    if enabled is not True and not password and previous_phone is None:
        return
    if enabled is True or password:
        if not phone:
            raise ValueError('Mobile number required for Staff Login')
        if password and len(password) < 8:
            raise ValueError('Login password must contain at least 8 characters')
        old = next((w for w in Waiter.objects.all() if normalized_phone(w.contact_number) == normalized_phone(previous_phone)), None) if previous_phone else None
        existing = next((w for w in Waiter.objects.all() if normalized_phone(w.contact_number) == normalized_phone(phone)), None)
        if old and old.contact_number != phone and existing and existing.pk != old.pk:
            raise ValueError('New mobile number is already used by another login account')
        if old and old.contact_number != phone and not existing:
            old.contact_number = phone
            old.save(update_fields=['contact_number'])
            existing = old
        if not existing:
            if not password:
                raise ValueError('Set a login password for the new Staff account')
            existing = Waiter(contact_number=phone)
        if password:
            existing.password = hash_password(password)
        existing.name = employee.name
        existing.is_active = employee.is_active
        existing.save()
    elif enabled is False:
        existing = next((w for w in Waiter.objects.all() if normalized_phone(w.contact_number) == normalized_phone(previous_phone or phone)), None)
        if existing:
            existing.is_active = False
            existing.save(update_fields=['is_active'])

class WorkforceEmployees(APIView):

    def get(self, request):

        if owner(request) or approver(request):
            qs = StaffEmployee.objects.order_by('id')
        else:
            me = logged_employee(request)
            if not me: return fail('Staff login not linked to an active employee', 403)
            qs = StaffEmployee.objects.filter(pk=me.pk)
        return Response({'results': [employee_data(e) for e in qs]})

    def post(self, request):

        if not owner(request): return fail('Owner access required', 403)

        try:

            salary = money(request.data.get('monthly_salary', '0'))

            if salary < 0: raise ValueError('Salary cannot be negative')

            name = str(request.data.get('name', '')).strip()

            if not name: return fail('Employee name required')

            gender = request.data.get('gender', 'Other')

            if gender not in ('Male', 'Female', 'Other'): return fail('Invalid gender')
            employment_type = request.data.get('employment_type', 'Permanent')
            if employment_type not in ('Permanent', 'Temporary'): return fail('Invalid employment type')

            with transaction.atomic():
                e = StaffEmployee.objects.create(name=name, phone=str(request.data.get('phone', '')).strip(), gender=gender, role=str(request.data.get('role', '')).strip(), monthly_salary=salary, employment_type=employment_type, joining_date=parse_date(request.data.get('joining_date') or str(date.today())), can_approve=request.data.get('can_approve') is True, access_permissions=validated_permissions(request.data.get('access_permissions', [])))
                sync_staff_login(e, request.data)
            return Response(employee_data(e), status=201)

        except (ValueError, TypeError, ArithmeticError, IntegrityError) as exc:

            return fail(str(exc))

class WorkforceEmployeeDetail(APIView):

    def patch(self, request, pk):

        if not owner(request): return fail('Owner access required', 403)

        e = StaffEmployee.objects.filter(pk=pk).first()

        if not e: return fail('Employee not found', 404)

        try:
            previous_phone = e.phone

            for field in ('name', 'phone', 'role'):

                if field in request.data: setattr(e, field, str(request.data[field]).strip())

            if 'gender' in request.data:

                if request.data['gender'] not in ('Male', 'Female', 'Other'): return fail('Invalid gender')

                e.gender = request.data['gender']

            if 'employment_type' in request.data:
                if request.data['employment_type'] not in ('Permanent', 'Temporary'): return fail('Invalid employment type')
                e.employment_type = request.data['employment_type']

            if 'monthly_salary' in request.data:

                e.monthly_salary = money(request.data['monthly_salary'])

                if e.monthly_salary < 0: return fail('Salary cannot be negative')

            if 'is_active' in request.data: e.is_active = request.data['is_active'] is True

            if 'can_approve' in request.data: e.can_approve = request.data['can_approve'] is True

            if 'access_permissions' in request.data: e.access_permissions = validated_permissions(request.data['access_permissions'])

            with transaction.atomic():
                e.full_clean(); e.save()
                sync_staff_login(e, request.data, previous_phone=previous_phone)
            return Response(employee_data(e))

        except (ValueError, TypeError, IntegrityError) as exc:

            return fail(str(exc))


def attendance_gps(data):
    """Optional GPS coordinates; missing/invalid data never blocks attendance."""
    try:
        lat = float(data.get('latitude'))
        lon = float(data.get('longitude'))
        if -90 <= lat <= 90 and -180 <= lon <= 180:
            return lat, lon
    except (TypeError, ValueError, OverflowError):
        pass
    return None, None

class WorkforceAttendance(APIView):
    def get(self, request):
        if not owner(request): return fail('Owner access required', 403)
        qs = StaffAttendance.objects.select_related('employee').order_by('-date', '-id')
        off_qs = StaffFlexibleOff.objects.select_related('employee').order_by('-date', '-id')
        employee_id = request.query_params.get('employee_id')
        if employee_id:
            qs = qs.filter(employee_id=employee_id)
            off_qs = off_qs.filter(employee_id=employee_id)
        month = request.query_params.get('month')
        if month:
            try:
                year, m = map(int, month.split('-'))
                if not 1 <= m <= 12: raise ValueError()
                qs = qs.filter(date__year=year, date__month=m)
                off_qs = off_qs.filter(date__year=year, date__month=m)
            except (ValueError, TypeError): return fail('Month must be YYYY-MM')
        rows = [{'id': a.id, 'employee_id': a.employee_id, 'employee': a.employee.name, 'date': str(a.date), 'check_in': a.check_in.strftime('%H:%M') if a.check_in else None, 'check_out': a.check_out.strftime('%H:%M') if a.check_out else None, 'status': 'Present', 'day_fraction': a.day_fraction, 'off_id': None, 'check_in_latitude': a.check_in_latitude, 'check_in_longitude': a.check_in_longitude, 'check_out_latitude': a.check_out_latitude, 'check_out_longitude': a.check_out_longitude} for a in qs[:1000]]
        rows += [{'id': 'off-' + str(a.id), 'employee_id': a.employee_id, 'employee': a.employee.name, 'date': str(a.date), 'check_in': None, 'check_out': None, 'status': 'Week Off', 'off_id': a.id} for a in off_qs[:1000]]
        rows.sort(key=lambda a: (a['date'], str(a['id'])), reverse=True)
        settings, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
        balances = {str(e.id): off_balance(e, settings, timezone.localdate()) for e in StaffEmployee.objects.all()}
        return Response({'results': rows[:1000], 'off_balances': balances})

    def post(self, request):
        if not owner(request): return fail('Owner access required', 403)
        try:
            employee = StaffEmployee.objects.get(pk=int(request.data['employee_id']), is_active=True)
            day = parse_date(request.data.get('date') or str(timezone.localdate()))
            action = request.data.get('action')
            if action not in ('in', 'out', 'off', 'remove_off'): return fail('Invalid attendance action')
            day_fraction = request.data.get('day_fraction', 'Full')
            if day_fraction not in ('Full', 'Half'): return fail('Invalid attendance day type')
            if day < employee.joining_date: return fail('Date is before joining date')
            if day > timezone.localdate(): return fail('Future attendance is not allowed')
            settings, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
            with transaction.atomic():
                if action in ('off', 'remove_off'):
                    if settings.week_off_mode != 'flexible': return fail('Manual Week Off is only for Flexible Monthly Off')
                    if action == 'remove_off':
                        deleted, _ = StaffFlexibleOff.objects.filter(employee=employee, date=day).delete()
                        if not deleted: return fail('No Week Off on this date')
                    else:
                        if StaffAttendance.objects.filter(employee=employee, date=day, check_in__isnull=False).exists(): return fail('Attendance already exists for this date')
                        if StaffFlexibleOff.objects.filter(employee=employee, date=day).exists(): return fail('Week Off already marked')
                        if StaffLeave.objects.filter(employee=employee, status='Approved', start_date__lte=day, end_date__gte=day).exists(): return fail('Approved leave already exists for this date')
                        if off_balance(employee, settings, day)['remaining'] <= 0: return fail('No available flexible off balance')
                        StaffFlexibleOff.objects.create(employee=employee, date=day)
                    return Response({'status': 'saved'})
                if StaffFlexibleOff.objects.filter(employee=employee, date=day).exists(): return fail('Remove Week Off before marking attendance')
                if StaffLeave.objects.filter(employee=employee, status='Approved', start_date__lte=day, end_date__gte=day).exists(): return fail('Approved leave exists for this date')
                current_time = datetime.strptime(request.data.get('time') or timezone.localtime().strftime('%H:%M'), '%H:%M').time()
                record, _ = StaffAttendance.objects.select_for_update().get_or_create(employee=employee, date=day)
                if action == 'in':
                    if record.check_in: return fail('Already checked in')
                    record.check_in = current_time
                    record.day_fraction = day_fraction
                    record.check_in_latitude, record.check_in_longitude = attendance_gps(request.data)
                else:
                    if not record.check_in: return fail('Check in first')
                    if record.check_out: return fail('Already checked out')
                    if current_time <= record.check_in: return fail('Checkout must be later than checkin on the same date')
                    record.check_out = current_time
                    if 'day_fraction' in request.data: record.day_fraction = day_fraction
                    record.check_out_latitude, record.check_out_longitude = attendance_gps(request.data)
                record.save()
            return Response({'id': record.id, 'status': 'saved'})
        except (KeyError, ValueError, StaffEmployee.DoesNotExist) as exc:
            return fail(str(exc))

class WorkforceLeaves(APIView):

    def get(self, request):

        if not owner(request) and not logged_employee(request): return fail('Staff login required', 403)

        qs = StaffLeave.objects.select_related('employee').order_by('-id')
        if not approver(request):
            qs = qs.filter(employee=logged_employee(request))
        month = request.query_params.get('month')
        if month:
            try:
                year, m = map(int, month.split('-'))
                start, end = date(year, m, 1), date(year, m, monthrange(year, m)[1])
            except (ValueError, TypeError): return fail('Month must be YYYY-MM')
            qs = qs.filter(start_date__lte=end, end_date__gte=start)
        return Response({'results': [{'id': x.id, 'employee_id': x.employee_id, 'employee': x.employee.name, 'start_date': str(x.start_date), 'end_date': str(x.end_date), 'leave_type': x.leave_type, 'reason': x.reason, 'status': x.status} for x in qs[:1000]]})

    def post(self, request):

        if not owner(request) and not logged_employee(request): return fail('Staff login required', 403)

        try:

            employee = StaffEmployee.objects.get(pk=int(request.data['employee_id']), is_active=True)
            if not owner(request) and employee.pk != logged_employee(request).pk:
                return fail('You can submit only your own leave', 403)

            start, end = parse_date(request.data['start_date']), parse_date(request.data['end_date'])

            if end < start: return fail('End date must not precede start date')

            if (end - start).days > 365: return fail('Leave range too long')

            kind = request.data.get('leave_type', 'Paid')

            if kind not in (*LEAVE_QUOTAS, 'Unpaid'): return fail('Invalid leave type')

            if StaffLeave.objects.filter(employee=employee, status__in=['Pending', 'Approved'], start_date__lte=end, end_date__gte=start).exists(): return fail('Overlapping leave exists')
            settings, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
            quota_error = leave_quota_error(employee, kind, start, end, settings)
            if quota_error: return fail(quota_error)

            leave = StaffLeave.objects.create(employee=employee, start_date=start, end_date=end, leave_type=kind, reason=str(request.data.get('reason', '')), status='Pending')

            return Response({'id': leave.id, 'status': leave.status}, status=201)

        except (KeyError, ValueError, StaffEmployee.DoesNotExist) as exc:

            return fail(str(exc))

class WorkforceLeaveDecision(APIView):

    def post(self, request, pk):

        if not approver(request): return fail('Approval access required', 403)

        decision = request.data.get('status')

        if decision not in ('Approved', 'Rejected'): return fail('Invalid decision')

        with transaction.atomic():

            leave = StaffLeave.objects.select_for_update().filter(pk=pk).first()

            if not leave: return fail('Leave not found', 404)

            me = logged_employee(request)
            if me and leave.employee_id == me.pk: return fail('You cannot approve your own leave', 403)

            if leave.status != 'Pending': return fail('Only pending leaves can be decided')
            if decision == 'Approved':
                settings, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
                quota_error = leave_quota_error(leave.employee, leave.leave_type, leave.start_date, leave.end_date, settings, exclude_id=leave.pk)
                if quota_error: return fail(quota_error)

            leave.status = decision

            leave.save(update_fields=['status'])

        return Response({'id': leave.id, 'status': leave.status})

class WorkforceSettings(APIView):
    def get(self, request):
        if not owner(request): return fail('Owner access required', 403)
        s, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
        return Response({'male_hours': str(s.male_hours), 'female_hours': str(s.female_hours), 'other_hours': str(s.other_hours), 'salary_mode': s.salary_mode, 'paid_leaves_per_year': s.paid_leaves_per_year, 'casual_leaves_per_year': s.casual_leaves_per_year, 'sick_leaves_per_year': s.sick_leaves_per_year, 'medical_leaves_per_year': s.medical_leaves_per_year, 'week_off_mode': s.week_off_mode, 'monthly_off_quota': s.monthly_off_quota, 'week_off_days': s.week_off_days})

    def put(self, request):
        if not owner(request): return fail('Owner access required', 403)
        try:
            with transaction.atomic():
                s, _ = StaffPayrollSettings.objects.select_for_update().get_or_create(pk=1)
                for key in ('male_hours', 'female_hours', 'other_hours'):
                    if key in request.data:
                        value = Decimal(str(request.data[key]))
                        if not Decimal('0') < value <= Decimal('24'): return fail('Working hours must be between 0 and 24')
                        setattr(s, key, value)
                if 'salary_mode' in request.data:
                    if request.data['salary_mode'] not in ('hour', 'day'): return fail('Invalid salary mode')
                    s.salary_mode = request.data['salary_mode']
                if 'paid_leaves_per_year' in request.data:
                    n = int(request.data['paid_leaves_per_year'])
                    if not 0 <= n <= 365: return fail('Invalid leave allowance')
                    s.paid_leaves_per_year = n
                for field in ('casual_leaves_per_year', 'sick_leaves_per_year', 'medical_leaves_per_year'):
                    if field in request.data:
                        quota = int(request.data[field])
                        if not 0 <= quota <= 365: return fail(f'{field} must be between 0 and 365')
                        setattr(s, field, quota)
                if 'week_off_mode' in request.data:
                    if request.data['week_off_mode'] not in ('flexible', 'fixed'): return fail('Invalid Week Off mode')
                    if s.week_off_mode != request.data['week_off_mode'] and StaffFlexibleOff.objects.exists():
                        return fail('Week Off policy cannot be switched while flexible off records exist')
                    s.week_off_mode = request.data['week_off_mode']
                if 'monthly_off_quota' in request.data:
                    quota = int(request.data['monthly_off_quota'])
                    if not 0 <= quota <= 31: return fail('Monthly Off quota must be 0 to 31')
                    s.monthly_off_quota = quota
                if 'week_off_days' in request.data:
                    days = request.data['week_off_days']
                    if not isinstance(days, list) or any(d not in WEEKDAYS for d in days): return fail('Invalid weekdays')
                    s.week_off_days = list(dict.fromkeys(days))
                s.save()
            return self.get(request)
        except (ValueError, ArithmeticError, TypeError) as exc:
            return fail(str(exc))

class WorkforcePayroll(APIView):
    def get(self, request):
        if not owner(request): return fail('Owner access required', 403)
        rows = []
        qs = StaffPayroll.objects.select_related('employee').order_by('-year', '-month', 'employee_id')
        month = request.query_params.get('month')
        if month:
            try:
                year, m = map(int, month.split('-'))
                if not 1 <= m <= 12: raise ValueError()
            except (ValueError, TypeError): return fail('Month must be YYYY-MM')
            qs = qs.filter(year=year, month=m)
        for p in qs[:1000]:
            rows.append({'id': p.id, 'employee': p.employee.name, 'employee_id': p.employee_id, 'month': p.month, 'year': p.year, 'start_date': str(date(p.year, p.month, 1)), 'end_date': str(date(p.year, p.month, monthrange(p.year, p.month)[1])), 'present_days': p.present_days, 'worked_hours': str(p.worked_hours), 'paid_leave_days': p.paid_leave_days, 'calculated_salary': str(p.calculated_salary), 'advance_deduction': str(p.advance_deduction), 'gross_salary': str(p.gross_salary), 'half_days': str(p.half_days)})
        payments = StaffSalaryPayment.objects.select_related('payroll__employee').order_by('-payment_date', '-id')
        if month:
            payments = payments.filter(payroll__year=year, payroll__month=m)
        payment_rows = [{'id': x.id, 'payroll_id': x.payroll_id, 'employee_id': x.payroll.employee_id,
                         'employee': x.payroll.employee.name, 'month': x.payroll.month, 'year': x.payroll.year,
                         'amount': str(x.amount), 'payment_date': str(x.payment_date),
                         'payment_mode': x.payment_mode, 'reference': x.reference, 'remark': x.remark}
                        for x in payments[:1000]]
        payroll_ids = [row['id'] for row in rows]
        totals = {
            entry['payroll_id']: entry['total']
            for entry in StaffSalaryPayment.objects.filter(payroll_id__in=payroll_ids)
            .values('payroll_id').annotate(total=Sum('amount'))
        }
        for row in rows:
            paid = totals.get(row['id'], Decimal('0'))
            row['paid_amount'] = str(money(paid))
            row['remaining_amount'] = str(money(max(Decimal('0'), Decimal(row['calculated_salary']) - paid)))
            row['payment_status'] = 'Paid' if paid >= Decimal(row['calculated_salary']) else ('Partially Paid' if paid else 'Unpaid')
        advances = StaffSalaryAdvance.objects.select_related('employee').order_by('-date', '-id')
        if month:
            advances = advances.filter(date__year=year, date__month=m)
        return Response({'results': rows, 'payments': payment_rows, 'advances': [{'id': a.id, 'employee_id': a.employee_id, 'employee': a.employee.name, 'amount': str(a.amount), 'date': str(a.date), 'remark': a.remark} for a in advances[:1000]]})

    def post(self, request):
        if not owner(request): return fail('Owner access required', 403)
        if request.data.get('action') == 'pay_salary':
            try:
                payroll_id = int(request.data['payroll_id'])
                amount = money(request.data['amount'])
                payment_day = parse_date(request.data.get('payment_date') or str(timezone.localdate()))
                mode = str(request.data.get('payment_mode') or 'Cash')
                if mode not in ('Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Other'):
                    return fail('Invalid payment mode')
                if amount <= 0: return fail('Payment amount must be positive')
                if payment_day > timezone.localdate(): return fail('Future payment date is not allowed')
                with transaction.atomic():
                    payroll = StaffPayroll.objects.select_for_update().get(pk=payroll_id)
                    already_paid = StaffSalaryPayment.objects.filter(payroll=payroll).aggregate(total=Sum('amount'))['total'] or Decimal('0')
                    outstanding = money(Decimal(payroll.calculated_salary) - already_paid)
                    if outstanding <= 0: return fail('Salary is already fully paid')
                    if amount > outstanding: return fail(f'Payment exceeds remaining salary of {outstanding}')
                    payment = StaffSalaryPayment.objects.create(
                        payroll=payroll, amount=amount, payment_date=payment_day,
                        payment_mode=mode, reference=str(request.data.get('reference') or '').strip()[:120],
                        remark=str(request.data.get('remark') or '').strip()[:500])
                return Response({'id': payment.id, 'status': 'saved', 'remaining': str(money(outstanding - amount))}, status=201)
            except (KeyError, ValueError, TypeError, ArithmeticError, StaffPayroll.DoesNotExist) as exc:
                return fail(str(exc))
        if request.data.get('action') == 'advance':
            try:
                employee = StaffEmployee.objects.get(pk=int(request.data['employee_id']), is_active=True)
                amount = money(request.data['amount'])
                day = parse_date(request.data.get('date') or str(timezone.localdate()))
                if amount <= 0: return fail('Advance amount must be positive')
                if day > timezone.localdate() or day < employee.joining_date: return fail('Invalid advance date')
                with transaction.atomic():
                    paid_payroll = StaffPayroll.objects.filter(employee=employee, year=day.year, month=day.month, salary_payments__isnull=False).exists()
                    if paid_payroll: return fail('Monthly salary payment already started for this month; advance cannot be added retroactively')
                    advance = StaffSalaryAdvance.objects.create(employee=employee, amount=amount, date=day, remark=str(request.data.get('remark', '')).strip()[:500])
                return Response({'id': advance.id, 'status': 'saved'}, status=201)
            except (KeyError, ValueError, TypeError, ArithmeticError, StaffEmployee.DoesNotExist) as exc:
                return fail(str(exc))
        try:
            employee = StaffEmployee.objects.get(pk=int(request.data['employee_id']))
            year, month = int(request.data['year']), int(request.data['month'])
            if not 2000 <= year <= 2100 or not 1 <= month <= 12: return fail('Invalid month/year')
            if (year, month) > (timezone.localdate().year, timezone.localdate().month): return fail('Cannot generate future payroll')
            start, end = date(year, month, 1), date(year, month, monthrange(year, month)[1])
            period_start = max(start, employee.joining_date)
            period_end = min(end, timezone.localdate())
            if period_start > period_end: return fail('No employed days in this period')
            s, _ = StaffPayrollSettings.objects.get_or_create(pk=1)
            attendance = StaffAttendance.objects.filter(employee=employee, date__range=(period_start, period_end), check_in__isnull=False, check_out__isnull=False)
            present_dates, hours = set(), Decimal('0')
            half_dates = set()
            for a in attendance:
                elapsed = datetime.combine(a.date, a.check_out) - datetime.combine(a.date, a.check_in)
                if elapsed.total_seconds() <= 0: continue
                present_dates.add(a.date)
                if a.day_fraction == 'Half': half_dates.add(a.date)
                hours += Decimal(str(elapsed.total_seconds())) / Decimal('3600')
            paid_leave, unpaid_leave = leave_dates(employee, period_start, period_end)
            off = off_dates(employee, s, period_start, period_end)
            # Do not pay for the same day twice; unpaid leave wins over off/paid leave.
            payable_off = off - present_dates - unpaid_leave
            eligible_paid_leave = paid_leave - present_dates - unpaid_leave - payable_off
            # Approved paid leave is limited independently for each configured category.
            # Older approved leave remains recorded; only configured annual allowance is payable.
            paid = 0
            for kind, field in LEAVE_QUOTAS.items():
                quota = int(getattr(s, field))
                if quota <= 0:
                    continue
                year_dates = sorted(yearly_leave_days(employee, kind, year))
                payable_dates = set(year_dates[:quota]) & eligible_paid_leave
                paid += len(payable_dates)
            days_in_period = (period_end - period_start).days + 1
            days_in_month = (end - start).days + 1
            monthly_salary = Decimal(employee.monthly_salary)
            expected = Decimal({'Male': s.male_hours, 'Female': s.female_hours, 'Other': s.other_hours}[employee.gender])
            if expected <= 0:
                return fail('Expected daily working hours must be greater than zero')
            if s.week_off_mode == 'fixed':
                # Count actual configured weekdays in this calendar month, not a fixed 4-off quota.
                month_off = off_dates(employee, s, start, end)
                month_workdays = days_in_month - len(month_off)
                if month_workdays <= 0:
                    return fail('Fixed weekly off settings leave no working days in this month')
                period_workdays = sum(1 for offset in range(days_in_period)
                                      if period_start + timedelta(days=offset) not in month_off)
                daily = monthly_salary / Decimal(month_workdays)
                # A weekly off is already included in the working-day divisor; do not pay it again.
                # Work on a scheduled weekly off is not overtime by default.
                worked_dates = present_dates - month_off
                payable_leave = min(paid, len(eligible_paid_leave - month_off))
                paid_workdays = min(Decimal(period_workdays), Decimal(len(worked_dates)) - Decimal('0.5') * Decimal(len(half_dates & worked_dates)) + Decimal(payable_leave))
                salary_cap = daily * Decimal(period_workdays)
                if s.salary_mode == 'hour':
                    # Attendance is stored as one in/out pair per date in the current backend.
                    # Subtract hours logged on scheduled weekly offs to avoid accidental extra pay.
                    regular_hours = Decimal('0')
                    for a in attendance:
                        if a.date in month_off: continue
                        elapsed = datetime.combine(a.date, a.check_out) - datetime.combine(a.date, a.check_in)
                        if elapsed.total_seconds() > 0:
                            regular_hours += min(Decimal(str(elapsed.total_seconds())) / Decimal('3600'), expected / Decimal('2')) if a.day_fraction == 'Half' else Decimal(str(elapsed.total_seconds())) / Decimal('3600')
                    calculated = regular_hours * (daily / expected) + Decimal(payable_leave) * daily
                else:
                    calculated = Decimal(paid_workdays) * daily
            else:
                # Flexible monthly off: preserve calendar-day salary basis and carry-forward policy.
                daily = monthly_salary / Decimal(days_in_month)
                salary_cap = monthly_salary * Decimal(days_in_period) / Decimal(days_in_month)
                if s.salary_mode == 'hour':
                    effective_hours = Decimal('0')
                    for a in attendance:
                        elapsed_hours = Decimal(str((datetime.combine(a.date, a.check_out) - datetime.combine(a.date, a.check_in)).total_seconds())) / Decimal('3600')
                        if elapsed_hours > 0:
                            effective_hours += min(elapsed_hours, expected / Decimal('2')) if a.day_fraction == 'Half' else elapsed_hours
                    calculated = effective_hours * (daily / expected) + (paid + len(payable_off)) * daily
                else:
                    payable_days = min(Decimal(days_in_period), Decimal(len(present_dates)) - Decimal('0.5') * Decimal(len(half_dates)) + Decimal(paid + len(payable_off)))
                    calculated = Decimal(payable_days) * daily
            # No overtime/unused-off cash-out; cap at the employed period's regular salary.
            calculated = money(min(salary_cap, max(Decimal('0'), calculated)))
            with transaction.atomic():
                existing_payroll = StaffPayroll.objects.select_for_update().filter(employee=employee, month=month, year=year).first()
                if existing_payroll and StaffSalaryPayment.objects.filter(payroll=existing_payroll).exists():
                    return fail('Salary payments already exist for this month. Payroll cannot be recalculated after payment.')
                advances = StaffSalaryAdvance.objects.select_for_update().filter(employee=employee, date__year=year, date__month=month)
                advance_total = sum((a.amount for a in advances), Decimal('0'))
                net_salary = money(max(Decimal('0'), calculated - advance_total))
                payroll, _ = StaffPayroll.objects.update_or_create(employee=employee, month=month, year=year, defaults={'present_days': len(present_dates), 'worked_hours': money(hours), 'paid_leave_days': paid + len(payable_off), 'half_days': Decimal(len(half_dates)), 'gross_salary': calculated, 'advance_deduction': money(advance_total), 'calculated_salary': net_salary})
            return Response({'id': payroll.id, 'calculated_salary': str(net_salary), 'gross_salary': str(calculated), 'advance_deduction': str(money(advance_total)), 'half_days': str(len(half_dates)), 'present_days': len(present_dates), 'worked_hours': str(money(hours)), 'paid_leave_days': paid + len(payable_off), 'week_off_days': len(payable_off), 'start_date': str(start), 'end_date': str(end)})
        except (KeyError, ValueError, StaffEmployee.DoesNotExist, ArithmeticError, TypeError) as exc:
            return fail(str(exc))


class WorkforceStaffProfile(APIView):
    def get(self, request):
        me = logged_employee(request)
        if not me:
            return fail('Staff account is not linked to an active employee. Ask the restaurant admin to open Employees > Edit, confirm the same mobile number, enable Staff Login and save.', 403)
        today = timezone.localdate()
        a = StaffAttendance.objects.filter(employee=me, date=today).first()
        return Response({'employee': {'id': me.pk, 'name': me.name, 'role': me.role,
            'can_approve': bool(me.can_approve), 'permissions': staff_permissions(me, request)}, 'today': str(today),
            'attendance': {'check_in': a.check_in.strftime('%H:%M') if a and a.check_in else None,
                           'check_out': a.check_out.strftime('%H:%M') if a and a.check_out else None,
                           'check_in_latitude': a.check_in_latitude if a else None,
                           'check_in_longitude': a.check_in_longitude if a else None,
                           'check_out_latitude': a.check_out_latitude if a else None,
                           'check_out_longitude': a.check_out_longitude if a else None}})

    def post(self, request):
        me = logged_employee(request)
        if not me:
            return fail('Staff login required', 403)
        action = request.data.get('action')
        if action not in ('in', 'out'):
            return fail('Invalid action')
        day = timezone.localdate()
        if day < me.joining_date:
            return fail('Employee has not joined yet')
        if StaffFlexibleOff.objects.filter(employee=me, date=day).exists():
            return fail('Paid week off is already marked today')
        if StaffLeave.objects.filter(employee=me, status='Approved', start_date__lte=day, end_date__gte=day).exists():
            return fail('Approved leave exists for today')
        now = timezone.localtime().time().replace(second=0, microsecond=0)
        with transaction.atomic():
            record, _ = StaffAttendance.objects.select_for_update().get_or_create(employee=me, date=day)
            if action == 'in':
                if record.check_in:
                    return fail('Already checked in today')
                record.check_in = now
                record.check_in_latitude, record.check_in_longitude = attendance_gps(request.data)
            else:
                if not record.check_in:
                    return fail('Check in first')
                if record.check_out:
                    return fail('Already checked out today')
                if now <= record.check_in:
                    return fail('Check out must be after check in')
                record.check_out = now
                record.check_out_latitude, record.check_out_longitude = attendance_gps(request.data)
            record.save()
        return Response({'status': 'saved'})


class WorkforceStaffOperations(APIView):
    """Tenant-scoped operational read/write APIs guarded by staff permissions."""
    def get(self, request):
        me = logged_employee(request)
        if not me:
            return fail('Active staff login required', 403)
        section = request.query_params.get('section', '')
        permissions = staff_permissions(me, request)
        required = {'orders': 'orders', 'history': 'order_history', 'tables': 'tables', 'kitchen': 'kitchen', 'billing': 'billing'}
        if section not in required or required[section] not in permissions:
            return fail('This section is not enabled for your account or plan', 403)
        if section == 'tables':
            return Response({'results': list(DiningTable.objects.order_by('name').values('id', 'name', 'seats', 'is_active')[:200])})
        qs = Order.objects.order_by('-date', '-id')
        # Keep served orders in the staff list just as in the original admin list.
        if section == 'kitchen':
            qs = qs.exclude(order_status__in=['Completed', 'Cancelled', 'Delivered'])
        selected = list(qs[:1000])
        ids = [o.id for o in selected]
        items = list(OrderItem.objects.filter(order_id_id__in=ids).values(
            'id', 'order_id_id', 'item', 'quantity', 'serving_size', 'price', 'item_status', 'date'))
        grouped = {}
        all_items = []
        for item in items:
            item['order_id'] = next((o.order_id for o in selected if o.id == item['order_id_id']), '')
            item['price'] = float(item['price'] or 0)
            item['date'] = timezone.localtime(item['date']).strftime('%Y-%m-%dT%H:%M:%S')
            grouped.setdefault(item['order_id_id'], []).append(item)
            all_items.append(item)
        rows = [{
            'id': o.id, 'order_id': o.order_id, 'table_number': o.table_number,
            'order_status': o.order_status, 'payment_status': o.payment_status,
            'sub_total': float(o.sub_total or 0), 'total': float(o.total or 0),
            'cgst': float(o.cgst or 0), 'sgst': float(o.sgst or 0),
            'final_amount': float(o.final_amount or 0),
            'discount_rupees': float(o.discount_rupees or 0),
            'loyality_point_price': float(o.loyality_point_price or 0),
            'customer_name': o.customer_name or '',
            'payment_mode': o.payment_mode or 'Cash',
            'cancelled_by': o.cancelled_by or '---',
            'cancel_reason': o.cancel_reason or '',
            'discount_percentage': float(o.discount_percentage or 0),
            'discount_reason': o.discount_reason or '',
            'apply_loyality_point': int(o.apply_loyality_point or 0),
            'loyality_point_price': float(o.loyality_point_price or 0),
            'loyality_point_status': o.loyality_point_status or 'not used',
            'loyality_point_calculated': bool(o.loyality_point_calculated),
            'customer_loyality_point': 0,
            'rating': float(o.rating or 0),
            'review': o.review or '',
            'date': timezone.localtime(o.date).strftime('%Y-%m-%dT%H:%M:%S'),
            'items': grouped.get(o.id, []),
        } for o in selected]
        setting = Setting.objects.first()
        restaurant = {
            'name': getattr(request.tenant, 'name', None) or request.tenant.schema_name,
            'address': getattr(request.tenant, 'address', '') or '',
        }
        return Response({
            'results': rows, 'order_items': all_items, 'restaurant': restaurant,
            'settings': {'gstin': getattr(setting, 'gstin', '') or '',
                         'fssaino': getattr(setting, 'fssaino', '') or '',
                         'allow_loyality_points': bool(getattr(setting, 'allow_loyality_points', False)),
                         'per_loyality_point_value': getattr(setting, 'per_loyality_point_value', 0) or 0,
                         'cgst': getattr(setting, 'cgst', 0) or 0,
                         'sgst': getattr(setting, 'sgst', 0) or 0},
        })

    def post(self, request):
        me = logged_employee(request)
        if not me:
            return fail('Active staff login required', 403)
        section = request.data.get('section')
        action = request.data.get('action')
        permissions = staff_permissions(me, request)
        required = {'orders': 'orders', 'kitchen': 'kitchen', 'billing': 'billing', 'tables': 'tables'}
        if section not in required or required[section] not in permissions:
            return fail('Permission or subscription plan does not allow this action', 403)
        if section == 'tables':
            if action not in ('create_table', 'update_table', 'delete_table'):
                return fail('Unsupported table action')
            with transaction.atomic():
                row = None
                if action != 'create_table':
                    try:
                        table_id = int(request.data.get('table_id'))
                    except (ValueError, TypeError):
                        return fail('Valid table_id is required')
                    row = DiningTable.objects.select_for_update().filter(pk=table_id).first()
                    if not row:
                        return fail('Table not found', 404)
                if action == 'delete_table':
                    row.delete()
                    return Response({'status': 'deleted'})
                name = str(request.data.get('name', row.name if row else '') or '').strip()
                if not name or len(name) > 50:
                    return fail('Table name must contain 1 to 50 characters')
                if DiningTable.objects.filter(name__iexact=name).exclude(pk=row.pk if row else None).exists():
                    return fail('This table already exists')
                try:
                    seats = int(request.data.get('seats', row.seats if row else 4))
                except (ValueError, TypeError):
                    return fail('Seats must be a number')
                if not 1 <= seats <= 10000:
                    return fail('Seats must be between 1 and 10000')
                is_active = request.data.get('is_active', row.is_active if row else True)
                if not isinstance(is_active, bool):
                    return fail('is_active must be a boolean')
                if row is None:
                    row = DiningTable.objects.create(name=name, seats=seats, is_active=is_active)
                else:
                    row.name, row.seats, row.is_active = name, seats, is_active
                    row.save(update_fields=['name', 'seats', 'is_active'])
                return Response({'status': 'updated', 'table': {'id': row.pk, 'name': row.name, 'seats': row.seats, 'is_active': row.is_active}})
        try:
            order_id = int(request.data.get('order_id'))
        except (TypeError, ValueError):
            return fail('Valid order_id is required')
        with transaction.atomic():
            order = Order.objects.select_for_update().filter(pk=order_id).first()
            if not order:
                return fail('Order not found', 404)
            if section == 'orders' and action == 'add_item':
                # Reuse the owner's existing item pricing, offer, GST, totals and
                # order-status recalculation. Never duplicate that business logic.
                if str(request.data.get('order_order_id', '')) != str(order.order_id):
                    return fail('Order number mismatch')
                if str(request.data.get('order_id', '')) != str(order.pk):
                    return fail('Order ID mismatch')
                try:
                    item_id = int(request.data.get('item_id'))
                    quantity = int(request.data.get('quantity'))
                except (TypeError, ValueError):
                    return fail('Valid item and quantity are required')
                if quantity < 1 or quantity > 1000:
                    return fail('Quantity must be between 1 and 1000')
                if request.data.get('serving_size') not in ('Half', 'Full'):
                    return fail('Invalid serving size')
                if request.data.get('item_status') != 'Pending':
                    return fail('New items must be pending')
                from tenant_app.models import Item
                item = Item.objects.filter(pk=item_id).first()
                if not item or str(request.data.get('item', '')).strip() != str(item.name).strip():
                    return fail('Invalid menu item')
                from tenant_app.views.orders import AddOrderItemsAPIView
                # This endpoint uses the same tenant-scoped JWT identity and
                # original owner add-item logic; the staff permission is checked above.
                return AddOrderItemsAPIView().post(request, tenant=request.tenant.schema_name)
            elif section == 'orders' and action == 'edit':
                changes = request.data.get('changes')
                if not isinstance(changes, dict):
                    return fail('Invalid order changes')
                allowed = {
                    'table_number', 'order_status', 'payment_status', 'payment_mode',
                    'cancelled_by', 'cancel_reason', 'discount_reason',
                    'discount_rupees', 'discount_percentage', 'apply_loyality_point',
                }
                if not changes or set(changes) - (allowed | {'id'}):
                    return fail('Unsupported order edit fields')
                if 'id' in changes and str(changes['id']) != str(order.pk):
                    return fail('Order ID mismatch')
                statuses = {'Placed', 'Confirm', 'Cooked', 'Served', 'Cancelled'}
                payments = {'Pending', 'Completed', 'Paid'}
                if 'order_status' in changes and changes['order_status'] not in statuses:
                    return fail('Invalid order status')
                if 'payment_status' in changes and changes['payment_status'] not in payments:
                    return fail('Invalid payment status')
                if 'payment_status' in changes and changes['payment_status'] in ('Paid', 'Completed'):
                    return fail('Confirm payment through the existing manual payment verification endpoint', 409)
                if 'table_number' in changes and not str(changes['table_number']).strip():
                    return fail('Table number cannot be empty')
                if 'order_status' in changes and changes['order_status'] == 'Cancelled' and not str(changes.get('cancel_reason', order.cancel_reason)).strip():
                    return fail('Cancel reason is required')
                numeric = {}
                for field in ('discount_rupees', 'discount_percentage', 'apply_loyality_point'):
                    if field in changes:
                        try:
                            value = Decimal(str(changes[field]))
                        except Exception:
                            return fail(f'Invalid {field}')
                        if not value.is_finite() or value < 0:
                            return fail(f'Invalid {field}')
                        numeric[field] = value
                if 'discount_percentage' in numeric and numeric['discount_percentage'] > 100:
                    return fail('Discount percentage cannot exceed 100')
                if 'apply_loyality_point' in numeric and numeric['apply_loyality_point'] != numeric['apply_loyality_point'].to_integral_value():
                    return fail('Loyalty points must be a whole number')
                if 'discount_rupees' in numeric and numeric['discount_rupees'] > Decimal(str(order.sub_total or 0)):
                    return fail('Discount exceeds subtotal')
                # Preserve the owner's model-level price/tax/loyalty calculations.
                # Financial edits must never change an already settled/cancelled bill.
                financial = {'discount_rupees', 'discount_percentage', 'apply_loyality_point'}
                changed_financial = {key for key in financial if key in numeric and numeric[key] != Decimal(str(getattr(order, key) or 0))}
                if changed_financial:
                    if order.payment_status in ('Paid', 'Completed') or order.order_status == 'Cancelled':
                        return fail('Financial details cannot be edited after payment or cancellation', 409)
                    if changes.get('order_status') == 'Cancelled':
                        return fail('Cannot change discounts or loyalty while cancelling an order', 409)
                    from tenant_app.models import Setting
                    setting = Setting.objects.first()
                    if not setting:
                        return fail('Restaurant billing settings are missing', 409)
                    if 'apply_loyality_point' in changed_financial:
                        if not setting.allow_loyality_points or 'loyalty' not in permissions:
                            return fail('Loyalty points permission or subscription is required', 403)
                        available = int(order.customer_id.loyality_points or 0)
                        if numeric['apply_loyality_point'] > available:
                            return fail('Insufficient customer loyalty points', 400)
                    if {'discount_rupees', 'discount_percentage'} & changed_financial:
                        if 'discount' not in staff_plan_features(request):
                            return fail('Discount is unavailable on this subscription', 403)
                    discount = numeric.get('discount_rupees', Decimal(str(order.discount_rupees or 0)))
                    points = numeric.get('apply_loyality_point', Decimal(str(order.apply_loyality_point or 0)))
                    rate = Decimal(str(setting.per_loyality_point_value or 0)) if setting.allow_loyality_points else Decimal('0')
                    if discount + points * rate > Decimal(str(order.sub_total or 0)):
                        return fail('Discount and loyalty redemption exceed the subtotal', 400)
                for field in allowed - financial:
                    if field in changes:
                        setattr(order, field, str(changes[field]))
                for field in financial:
                    if field in numeric:
                        setattr(order, field, int(numeric[field]) if field == 'apply_loyality_point' else float(numeric[field]))
                try:
                    order.full_clean()
                    order.save()
                except Exception as exc:
                    return fail(f'Order validation failed: {exc}')
            elif section == 'orders' and action == 'confirm':
                if order.order_status != 'Placed':
                    return fail('Only placed orders can be confirmed')
                order.order_status = 'Confirm'
                order.save(update_fields=['order_status'])
            elif section == 'orders' and action == 'serve':
                if order.order_status != 'Cooked':
                    return fail('Order must be cooked before serving')
                order.order_status = 'Served'
                order.save(update_fields=['order_status'])
            elif section in ('orders', 'kitchen') and action == 'cooked':
                if order.order_status != 'Confirm':
                    return fail('Only confirmed orders can be marked cooked')
                order.order_status = 'Cooked'
                order.save(update_fields=['order_status'])
            elif section == 'kitchen' and action == 'confirm_item':
                try:
                    item_id = int(request.data.get('item_id'))
                except (TypeError, ValueError):
                    return fail('Valid item_id is required')
                item = OrderItem.objects.select_for_update().filter(pk=item_id, order_id=order).first()
                if not item:
                    return fail('Order item not found', 404)
                if item.item_status != 'Pending':
                    return fail('Only pending items can be confirmed')
                item.item_status = 'Confirm'
                item.save(update_fields=['item_status'])
            elif section == 'billing' and action == 'payment_completed':
                if order.order_status == 'Cancelled':
                    return fail('Cancelled orders cannot be paid')
                if order.payment_status != 'Pending':
                    return fail('Payment is already processed')
                order.payment_status = 'Completed'
                order.save(update_fields=['payment_status'])
            else:
                return fail('Unsupported action for this section')
        return Response({'status': 'updated', 'order_id': order.pk})
