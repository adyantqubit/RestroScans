# from django.shortcuts import render
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from ..models import *
# from admin_app.models import *
# from ..order_access import ensure_order_access
# from ..serializers import *
# from django.db.models import Q
# from django.core.paginator import Paginator

# class getPaymentMethodAPIView(APIView):
#     def get(self,request,tenant):
#         content = PaymentMethod.objects.all()
#         serializer = PaymentMethodSerializer(content, many=True)
#         return Response(serializer.data)
#     def post(self, request, tenant):
#         # print(request.data)
#         if "id" in request.data:
#             paymentMethod = PaymentMethod.objects.get(id=request.data["id"])
#             serializedData = PaymentMethodSerializer(paymentMethod, data=request.data, partial=True)
#             if serializedData.is_valid():
#                 serializedData.save()
#                 return Response({"msg": "Updated Successfully"}, status=status.HTTP_200_OK)
#             return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
#         else:
#             serializedData = PaymentMethodSerializer(data=request.data)
#             if serializedData.is_valid():
#                 serializedData.save()
#                 return Response({"msg": "Saved Successfully"}, status=status.HTTP_201_CREATED)
#             return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)

# class updatePaymentModeAPIView(APIView):

#     def put(self, request, tenant):

#         order = Order.objects.select_related('customer_id').filter(order_id=request.data['order_id']).first()
#         if order is not None:
#             ensure_order_access(request, tenant, order)
#         Order.objects.filter(order_id=request.data['order_id']).update(
#             payment_mode=request.data['payment_mode'], payment_status="Paid")
#         return Response({"msg": "success"}, 200)

# class CheckPaymentStatusAPIView(APIView):
#     def post(self, request, tenant):
#         orderObj = Order.objects.select_related('customer_id').get(order_id=request.data['order_id'])
#         ensure_order_access(request, tenant, orderObj)
#         serializer = OrderSerializer(orderObj)
#         # added by rohan- 14/4/23
#         # reason to send all other detail of bill gstin number, fssai number, address from setting tabel and tenant tabel
#         settingserailize = SettingSaveSerializer(Setting.objects.last())
#         from admin_app.models import Tenant, RestaurantRequest
#         tenant = Tenant.objects.get(tenant_name=tenant)
#         tenant_detail = {
#             "name": tenant.restaurant_name.restaurant_name,
#             "address": tenant.restaurant_name.address
#         }

#         return Response({"order": serializer.data, "setting": settingserailize.data, "tenant": tenant_detail}, 200)

# class UpdatePaymentStatus(APIView):
#     def post(self,request,tenant):
#         # Commeted and added by Yuvraj Sahu on 26-07-2023
#         # Reason - to the payment status using save method
#         # Order.objects.filter(order_id = request.data["order_id"]).update(payment_status = request.data["payment_status"])
#         # return Response({
#         #     "msg":"Payment status Updated"
#         # })
#         orderObj = Order.objects.get(order_id=request.data["order_id"])
#         orderSerializer = OrderSerializer(orderObj, data=request.data, partial=True)
#         if orderSerializer.is_valid() :
#             orderSerializer.save()
#             return Response({
#                 "msg":"Payment status Updated"
#             })
#         return Response({
#             "msg":"error"
#         })

# class PaymentModeAPIView(APIView):
#     def get(self,request,tenant,id):
#         mode=Order.objects.get(id=id).payment_mode
#         return Response({"msg":"success","paymentMode":mode})




# # Phase 2: customer payment selection and amount-specific UPI QR.
# # Add these classes at the END of the existing tenant_app/views/payments.py.
# # Existing payment views and shared infrastructure remain unchanged.
# from decimal import Decimal, InvalidOperation
# from urllib.parse import urlencode
# from io import BytesIO
# import base64
# from django.db import transaction
# from django.utils import timezone
# from rest_framework.exceptions import ValidationError
# from ..order_access import ensure_order_access
# from ..models import OrderPaymentVerification, RestaurantUPISettings

# def _payment_amount(order):
#     try:
#         value = Decimal(str(order.final_amount if order.final_amount is not None else order.total))
#     except (InvalidOperation, TypeError, ValueError):
#         raise ValidationError({"message": "Order amount is unavailable"})
#     if not value.is_finite() or value <= 0:
#         raise ValidationError({"message": "Order amount must be greater than zero"})
#     return value.quantize(Decimal("0.01"))

# def _payment_order(request, tenant):
#     order_id = request.query_params.get("order_id") if request.method == "GET" else request.data.get("order_id")
#     if not order_id:
#         raise ValidationError({"message": "order_id is required"})
#     order = Order.objects.select_related("customer_id").filter(order_id=order_id).first()
#     if not order:
#         from rest_framework.exceptions import NotFound
#         raise NotFound("Order not found")
#     ensure_order_access(request, tenant, order)
#     return order

# class CustomerManualPaymentAPIView(APIView):
#     """Uses the existing X-Order-Token, X-Tenant, Order, and payment models."""
#     def get(self, request, tenant):
#         order = _payment_order(request, tenant)
#         amount = _payment_amount(order)
#         claim = OrderPaymentVerification.objects.filter(order=order).first()
#         config = RestaurantUPISettings.objects.filter(is_enabled=True).order_by("-updated_at").first()
#         result = {
#             "order_id": order.order_id, "amount": str(amount),
#             "order_status": order.order_status, "payment_status": order.payment_status,
#             "method": claim.method if claim else None,
#             "verification_state": claim.state if claim else "not_started",
#             "upi_available": bool(config),
#         }
#         if config and order.order_status == "Served" and order.payment_status not in ("Paid", "Completed"):
#             result["payee_name"] = config.payee_name
#             # No UPI ID is returned unless UPI has been configured by the owner.
#         return Response(result)

#     def post(self, request, tenant):
#         action = request.data.get("action")
#         if action not in ("select", "claim"):
#             raise ValidationError({"message": "Invalid action"})
#         method = request.data.get("method")
#         if method not in ("Cash", "UPI"):
#             raise ValidationError({"message": "Choose Cash or UPI"})
#         order = _payment_order(request, tenant)
#         with transaction.atomic():
#             order = Order.objects.select_for_update().get(pk=order.pk)
#             if order.order_status != "Served":
#                 return Response({"message": "Payment is available after order is served"}, status=409)
#             if order.payment_status in ("Paid", "Completed"):
#                 return Response({"message": "Payment is already confirmed"}, status=409)
#             amount = _payment_amount(order)
#             if method == "UPI" and not RestaurantUPISettings.objects.filter(is_enabled=True).exists():
#                 return Response({"message": "UPI payment is not configured for this restaurant"}, status=409)
#             claim, created = OrderPaymentVerification.objects.select_for_update().get_or_create(
#                 order=order, defaults={"method": method, "amount_snapshot": amount}
#             )
#             if claim.state == "verified":
#                 return Response({"message": "Payment is already verified"}, status=409)
#             if claim.state == "awaiting_verification" and (claim.method != method or claim.amount_snapshot != amount):
#                 return Response({"message": "Payment already submitted for verification"}, status=409)
#             if action == "claim":
#                 claim.state = "awaiting_verification"
#                 claim.claimed_at = timezone.now()
#             else:
#                 if claim.state == "awaiting_verification":
#                     return Response({"message": "Payment is awaiting restaurant confirmation"}, status=409)
#                 claim.state = "not_started"
#                 claim.claimed_at = None
#             claim.method = method
#             claim.amount_snapshot = amount
#             claim.save()
#             # IMPORTANT: Do not update Order.payment_status here.
#             # Phase 3 will connect original Admin Paid action to verification.
#         return Response({
#             "order_id": order.order_id, "amount": str(amount), "method": method,
#             "verification_state": claim.state, "payment_status": order.payment_status
#         })

# class CustomerAmountQRAPIView(APIView):
#     """Dynamic QR image generated from existing per-tenant UPI settings."""
#     def get(self, request, tenant):
#         order = _payment_order(request, tenant)
#         if order.order_status != "Served":
#             return Response({"message": "Order has not been served"}, status=409)
#         if order.payment_status in ("Paid", "Completed"):
#             return Response({"message": "Payment is already confirmed"}, status=409)
#         config = RestaurantUPISettings.objects.filter(is_enabled=True).order_by("-updated_at").first()
#         if not config or not config.upi_id or not config.payee_name:
#             return Response({"message": "Restaurant UPI is not configured"}, status=409)
#         amount = _payment_amount(order)
#         # Avoid logging bank/payment identifiers; use a URL-encoded UPI intent.
#         uri = "upi://pay?" + urlencode({
#             "pa": config.upi_id, "pn": config.payee_name, "am": str(amount),
#             "cu": "INR", "tr": str(order.order_id)[:35],
#         })
#         try:
#             import qrcode
#         except ImportError:
#             return Response({"message": "Server QR dependency missing: pip install qrcode[pil]"}, status=503)
#         qr = qrcode.QRCode(box_size=8, border=3, error_correction=qrcode.constants.ERROR_CORRECT_M)
#         qr.add_data(uri)
#         qr.make(fit=True)
#         output = BytesIO()
#         qr.make_image(fill_color="black", back_color="white").save(output, format="PNG")
#         return Response({
#             "order_id": order.order_id, "amount": str(amount),
#             "payee_name": config.payee_name,
#             "qr_image": "data:image/png;base64," + base64.b64encode(output.getvalue()).decode("ascii"),
#         })


# from django.shortcuts import render
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from ..models import *
# from admin_app.models import *
# from ..order_access import ensure_order_access
# from ..serializers import *
# from django.db.models import Q
# from django.core.paginator import Paginator

# class getPaymentMethodAPIView(APIView):
#     def get(self,request,tenant):
#         content = PaymentMethod.objects.all()
#         serializer = PaymentMethodSerializer(content, many=True)
#         return Response(serializer.data)
#     def post(self, request, tenant):
#         # print(request.data)
#         if "id" in request.data:
#             paymentMethod = PaymentMethod.objects.get(id=request.data["id"])
#             serializedData = PaymentMethodSerializer(paymentMethod, data=request.data, partial=True)
#             if serializedData.is_valid():
#                 serializedData.save()
#                 return Response({"msg": "Updated Successfully"}, status=status.HTTP_200_OK)
#             return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
#         else:
#             serializedData = PaymentMethodSerializer(data=request.data)
#             if serializedData.is_valid():
#                 serializedData.save()
#                 return Response({"msg": "Saved Successfully"}, status=status.HTTP_201_CREATED)
#             return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)

# class updatePaymentModeAPIView(APIView):
#     def put(self, request, tenant):
#         # Legacy customer endpoint must never mark payment paid.
#         return Response({"error": "Use customer-manual-payment to submit a payment claim."}, status=403)


# class CheckPaymentStatusAPIView(APIView):
#     def post(self, request, tenant):
#         from django.db import connection
#         from rest_framework.exceptions import NotFound, ValidationError

#         order_id = request.data.get("order_id")

#         if not order_id:
#             raise ValidationError({
#                 "order_id": "Order ID is required."
#             })

#         order_obj = Order.objects.select_related(
#             "customer_id"
#         ).filter(order_id=order_id).first()

#         if order_obj is None:
#             raise NotFound("Order not found.")

#         # Reuse existing customer order-token verification.
#         ensure_order_access(request, tenant, order_obj)

#         # Existing invoice order data.
#         order_serializer = OrderSerializer(order_obj)

#         # Existing restaurant billing settings.
#         setting_obj = Setting.objects.last()
#         setting_data = (
#             SettingSaveSerializer(setting_obj).data
#             if setting_obj is not None
#             else {}
#         )

#         # Reuse the tenant already resolved by django-tenants.
#         current_tenant = getattr(connection, "tenant", None)

#         tenant_detail = {
#             "name": "",
#             "address": ""
#         }

#         if current_tenant is not None:
#             restaurant = getattr(
#                 current_tenant,
#                 "restaurant_name",
#                 None
#             )

#             if restaurant is not None:
#                 tenant_detail = {
#                     "name": getattr(
#                         restaurant,
#                         "restaurant_name",
#                         ""
#                     ) or "",
#                     "address": getattr(
#                         restaurant,
#                         "address",
#                         ""
#                     ) or ""
#                 }

#         return Response({
#             "order": order_serializer.data,
#             "setting": setting_data,
#             "tenant": tenant_detail
#         }, status=200)


# class UpdatePaymentStatus(APIView):
#     def post(self, request, tenant):
#         # Disable unsafe legacy serializer payment-status writes.
#         return Response({"error": "Payment must be confirmed by authorized restaurant billing verification."}, status=403)

# class PaymentModeAPIView(APIView):
#     def get(self,request,tenant,id):
#         mode=Order.objects.get(id=id).payment_mode
#         return Response({"msg":"success","paymentMode":mode})




# # Phase 2: customer payment selection and amount-specific UPI QR.
# # Add these classes at the END of the existing tenant_app/views/payments.py.
# # Existing payment views and shared infrastructure remain unchanged.
# from decimal import Decimal, InvalidOperation
# from urllib.parse import urlencode
# from io import BytesIO
# import base64
# from django.db import transaction
# from django.utils import timezone
# from rest_framework.exceptions import ValidationError
# from ..order_access import ensure_order_access
# from ..models import OrderPaymentVerification, RestaurantUPISettings

# def _payment_amount(order):
#     try:
#         value = Decimal(str(order.final_amount if order.final_amount is not None else order.total))
#     except (InvalidOperation, TypeError, ValueError):
#         raise ValidationError({"message": "Order amount is unavailable"})
#     if not value.is_finite() or value <= 0:
#         raise ValidationError({"message": "Order amount must be greater than zero"})
#     return value.quantize(Decimal("0.01"))

# def _payment_order(request, tenant):
#     order_id = request.query_params.get("order_id") if request.method == "GET" else request.data.get("order_id")
#     if not order_id:
#         raise ValidationError({"message": "order_id is required"})
#     order = Order.objects.select_related("customer_id").filter(order_id=order_id).first()
#     if not order:
#         from rest_framework.exceptions import NotFound
#         raise NotFound("Order not found")
#     ensure_order_access(request, tenant, order)
#     return order

# class CustomerManualPaymentAPIView(APIView):
#     """Uses the existing X-Order-Token, X-Tenant, Order, and payment models."""
#     def get(self, request, tenant):
#         order = _payment_order(request, tenant)
#         amount = _payment_amount(order)
#         claim = OrderPaymentVerification.objects.filter(order=order).first()
#         config = RestaurantUPISettings.objects.filter(is_enabled=True).order_by("-updated_at").first()
#         setting = Setting.objects.first()
#         available = int(order.customer_id.loyality_points or 0)
#         result = {
#             "loyalty_enabled": bool(setting and setting.allow_loyality_points),
#             "loyalty_points": available,
#             "loyalty_used": int(order.apply_loyality_point or 0),
#             "loyalty_value": float(setting.per_loyality_point_value or 0) if setting else 0,
#             "order_id": order.order_id, "amount": str(amount),
#             "order_status": order.order_status, "payment_status": order.payment_status,
#             "method": claim.method if claim else None,
#             "verification_state": claim.state if claim else "not_started",
#             "upi_available": bool(config),
#         }
#         if config and order.order_status == "Served" and order.payment_status not in ("Paid", "Completed"):
#             result["payee_name"] = config.payee_name
#             # No UPI ID is returned unless UPI has been configured by the owner.
#         return Response(result)

#     def post(self, request, tenant):
#         action = request.data.get("action")
#         if action not in ("select", "claim"):
#             raise ValidationError({"message": "Invalid action"})
#         method = request.data.get("method")
#         if method not in ("Cash", "UPI"):
#             raise ValidationError({"message": "Choose Cash or UPI"})
#         order = _payment_order(request, tenant)
#         with transaction.atomic():
#             order = Order.objects.select_for_update().get(pk=order.pk)
#             if order.order_status != "Served":
#                 return Response({"message": "Payment is available after order is served"}, status=409)
#             if order.payment_status in ("Paid", "Completed"):
#                 return Response({"message": "Payment is already confirmed"}, status=409)
#             setting = Setting.objects.first()
#             try:
#                 requested = int(request.data.get("loyalty_points", order.apply_loyality_point or 0))
#             except (ValueError, TypeError):
#                 return Response({"message": "Invalid loyalty points"}, status=400)
#             customer = CustomerDetail.objects.select_for_update().get(pk=order.customer_id_id)
#             balance = int(customer.loyality_points or 0)
#             if requested < 0 or requested > balance:
#                 return Response({"message": "Insufficient loyalty points"}, status=409)
#             if requested and not (setting and setting.allow_loyality_points):
#                 return Response({"message": "Loyalty is disabled"}, status=409)
#             if requested != int(order.apply_loyality_point or 0):
#                 if OrderPaymentVerification.objects.filter(order=order, state="awaiting_verification").exists():
#                     return Response({"message": "Payment already awaiting verification"}, status=409)
#                 order.apply_loyality_point = requested
#                 order.save()
#             amount = _payment_amount(order)
#             if method == "UPI" and not RestaurantUPISettings.objects.filter(is_enabled=True).exists():
#                 return Response({"message": "UPI payment is not configured for this restaurant"}, status=409)
#             claim, created = OrderPaymentVerification.objects.select_for_update().get_or_create(
#                 order=order, defaults={"method": method, "amount_snapshot": amount}
#             )
#             if claim.state == "verified":
#                 return Response({"message": "Payment is already verified"}, status=409)
#             if claim.state == "awaiting_verification" and (claim.method != method or claim.amount_snapshot != amount):
#                 return Response({"message": "Payment already submitted for verification"}, status=409)
#             if action == "claim":
#                 claim.state = "awaiting_verification"
#                 claim.claimed_at = timezone.now()
#             else:
#                 if claim.state == "awaiting_verification":
#                     return Response({"message": "Payment is awaiting restaurant confirmation"}, status=409)
#                 claim.state = "not_started"
#                 claim.claimed_at = None
#             claim.method = method
#             claim.amount_snapshot = amount
#             claim.save()
#             # IMPORTANT: Do not update Order.payment_status here.
#             # Phase 3 will connect original Admin Paid action to verification.
#         return Response({
#             "order_id": order.order_id, "amount": str(amount), "method": method,
#             "verification_state": claim.state, "payment_status": order.payment_status
#         })

# class CustomerAmountQRAPIView(APIView):
#     """Dynamic QR image generated from existing per-tenant UPI settings."""
#     def get(self, request, tenant):
#         order = _payment_order(request, tenant)
#         if order.order_status != "Served":
#             return Response({"message": "Order has not been served"}, status=409)
#         if order.payment_status in ("Paid", "Completed"):
#             return Response({"message": "Payment is already confirmed"}, status=409)
#         config = RestaurantUPISettings.objects.filter(is_enabled=True).order_by("-updated_at").first()
#         if not config or not config.upi_id or not config.payee_name:
#             return Response({"message": "Restaurant UPI is not configured"}, status=409)
#         amount = _payment_amount(order)
#         # Avoid logging bank/payment identifiers; use a URL-encoded UPI intent.
#         uri = "upi://pay?" + urlencode({
#             "pa": config.upi_id, "pn": config.payee_name, "am": str(amount),
#             "cu": "INR", "tr": str(order.order_id)[:35],
#         })
#         try:
#             import qrcode
#         except ImportError:
#             return Response({"message": "Server QR dependency missing: pip install qrcode[pil]"}, status=503)
#         qr = qrcode.QRCode(box_size=8, border=3, error_correction=qrcode.constants.ERROR_CORRECT_M)
#         qr.add_data(uri)
#         qr.make(fit=True)
#         output = BytesIO()
#         qr.make_image(fill_color="black", back_color="white").save(output, format="PNG")
#         return Response({
#             "order_id": order.order_id, "amount": str(amount),
#             "payee_name": config.payee_name,
#             "qr_image": "data:image/png;base64," + base64.b64encode(output.getvalue()).decode("ascii"),
#         })


# from django.shortcuts import render
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from ..models import *
# from admin_app.models import *
# from ..order_access import ensure_order_access
# from ..serializers import *
# from django.db.models import Q
# from django.core.paginator import Paginator

# class getPaymentMethodAPIView(APIView):
#     def get(self,request,tenant):
#         content = PaymentMethod.objects.all()
#         serializer = PaymentMethodSerializer(content, many=True)
#         return Response(serializer.data)
#     def post(self, request, tenant):
#         # print(request.data)
#         if "id" in request.data:
#             paymentMethod = PaymentMethod.objects.get(id=request.data["id"])
#             serializedData = PaymentMethodSerializer(paymentMethod, data=request.data, partial=True)
#             if serializedData.is_valid():
#                 serializedData.save()
#                 return Response({"msg": "Updated Successfully"}, status=status.HTTP_200_OK)
#             return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
#         else:
#             serializedData = PaymentMethodSerializer(data=request.data)
#             if serializedData.is_valid():
#                 serializedData.save()
#                 return Response({"msg": "Saved Successfully"}, status=status.HTTP_201_CREATED)
#             return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)

# class updatePaymentModeAPIView(APIView):

#     def put(self, request, tenant):

#         order = Order.objects.select_related('customer_id').filter(order_id=request.data['order_id']).first()
#         if order is not None:
#             ensure_order_access(request, tenant, order)
#         Order.objects.filter(order_id=request.data['order_id']).update(
#             payment_mode=request.data['payment_mode'], payment_status="Paid")
#         return Response({"msg": "success"}, 200)

# class CheckPaymentStatusAPIView(APIView):
#     def post(self, request, tenant):
#         orderObj = Order.objects.select_related('customer_id').get(order_id=request.data['order_id'])
#         ensure_order_access(request, tenant, orderObj)
#         serializer = OrderSerializer(orderObj)
#         # added by rohan- 14/4/23
#         # reason to send all other detail of bill gstin number, fssai number, address from setting tabel and tenant tabel
#         settingserailize = SettingSaveSerializer(Setting.objects.last())
#         from admin_app.models import Tenant, RestaurantRequest
#         tenant = Tenant.objects.get(tenant_name=tenant)
#         tenant_detail = {
#             "name": tenant.restaurant_name.restaurant_name,
#             "address": tenant.restaurant_name.address
#         }

#         return Response({"order": serializer.data, "setting": settingserailize.data, "tenant": tenant_detail}, 200)

# class UpdatePaymentStatus(APIView):
#     def post(self,request,tenant):
#         # Commeted and added by Yuvraj Sahu on 26-07-2023
#         # Reason - to the payment status using save method
#         # Order.objects.filter(order_id = request.data["order_id"]).update(payment_status = request.data["payment_status"])
#         # return Response({
#         #     "msg":"Payment status Updated"
#         # })
#         orderObj = Order.objects.get(order_id=request.data["order_id"])
#         orderSerializer = OrderSerializer(orderObj, data=request.data, partial=True)
#         if orderSerializer.is_valid() :
#             orderSerializer.save()
#             return Response({
#                 "msg":"Payment status Updated"
#             })
#         return Response({
#             "msg":"error"
#         })

# class PaymentModeAPIView(APIView):
#     def get(self,request,tenant,id):
#         mode=Order.objects.get(id=id).payment_mode
#         return Response({"msg":"success","paymentMode":mode})




# # Phase 2: customer payment selection and amount-specific UPI QR.
# # Add these classes at the END of the existing tenant_app/views/payments.py.
# # Existing payment views and shared infrastructure remain unchanged.
# from decimal import Decimal, InvalidOperation
# from urllib.parse import urlencode
# from io import BytesIO
# import base64
# from django.db import transaction
# from django.utils import timezone
# from rest_framework.exceptions import ValidationError
# from ..order_access import ensure_order_access
# from ..models import OrderPaymentVerification, RestaurantUPISettings

# def _payment_amount(order):
#     try:
#         value = Decimal(str(order.final_amount if order.final_amount is not None else order.total))
#     except (InvalidOperation, TypeError, ValueError):
#         raise ValidationError({"message": "Order amount is unavailable"})
#     if not value.is_finite() or value <= 0:
#         raise ValidationError({"message": "Order amount must be greater than zero"})
#     return value.quantize(Decimal("0.01"))

# def _payment_order(request, tenant):
#     order_id = request.query_params.get("order_id") if request.method == "GET" else request.data.get("order_id")
#     if not order_id:
#         raise ValidationError({"message": "order_id is required"})
#     order = Order.objects.select_related("customer_id").filter(order_id=order_id).first()
#     if not order:
#         from rest_framework.exceptions import NotFound
#         raise NotFound("Order not found")
#     ensure_order_access(request, tenant, order)
#     return order

# class CustomerManualPaymentAPIView(APIView):
#     """Uses the existing X-Order-Token, X-Tenant, Order, and payment models."""
#     def get(self, request, tenant):
#         order = _payment_order(request, tenant)
#         amount = _payment_amount(order)
#         claim = OrderPaymentVerification.objects.filter(order=order).first()
#         config = RestaurantUPISettings.objects.filter(is_enabled=True).order_by("-updated_at").first()
#         result = {
#             "order_id": order.order_id, "amount": str(amount),
#             "order_status": order.order_status, "payment_status": order.payment_status,
#             "method": claim.method if claim else None,
#             "verification_state": claim.state if claim else "not_started",
#             "upi_available": bool(config),
#         }
#         if config and order.order_status == "Served" and order.payment_status not in ("Paid", "Completed"):
#             result["payee_name"] = config.payee_name
#             # No UPI ID is returned unless UPI has been configured by the owner.
#         return Response(result)

#     def post(self, request, tenant):
#         action = request.data.get("action")
#         if action not in ("select", "claim"):
#             raise ValidationError({"message": "Invalid action"})
#         method = request.data.get("method")
#         if method not in ("Cash", "UPI"):
#             raise ValidationError({"message": "Choose Cash or UPI"})
#         order = _payment_order(request, tenant)
#         with transaction.atomic():
#             order = Order.objects.select_for_update().get(pk=order.pk)
#             if order.order_status != "Served":
#                 return Response({"message": "Payment is available after order is served"}, status=409)
#             if order.payment_status in ("Paid", "Completed"):
#                 return Response({"message": "Payment is already confirmed"}, status=409)
#             amount = _payment_amount(order)
#             if method == "UPI" and not RestaurantUPISettings.objects.filter(is_enabled=True).exists():
#                 return Response({"message": "UPI payment is not configured for this restaurant"}, status=409)
#             claim, created = OrderPaymentVerification.objects.select_for_update().get_or_create(
#                 order=order, defaults={"method": method, "amount_snapshot": amount}
#             )
#             if claim.state == "verified":
#                 return Response({"message": "Payment is already verified"}, status=409)
#             if claim.state == "awaiting_verification" and (claim.method != method or claim.amount_snapshot != amount):
#                 return Response({"message": "Payment already submitted for verification"}, status=409)
#             if action == "claim":
#                 claim.state = "awaiting_verification"
#                 claim.claimed_at = timezone.now()
#             else:
#                 if claim.state == "awaiting_verification":
#                     return Response({"message": "Payment is awaiting restaurant confirmation"}, status=409)
#                 claim.state = "not_started"
#                 claim.claimed_at = None
#             claim.method = method
#             claim.amount_snapshot = amount
#             claim.save()
#             # IMPORTANT: Do not update Order.payment_status here.
#             # Phase 3 will connect original Admin Paid action to verification.
#         return Response({
#             "order_id": order.order_id, "amount": str(amount), "method": method,
#             "verification_state": claim.state, "payment_status": order.payment_status
#         })

# class CustomerAmountQRAPIView(APIView):
#     """Dynamic QR image generated from existing per-tenant UPI settings."""
#     def get(self, request, tenant):
#         order = _payment_order(request, tenant)
#         if order.order_status != "Served":
#             return Response({"message": "Order has not been served"}, status=409)
#         if order.payment_status in ("Paid", "Completed"):
#             return Response({"message": "Payment is already confirmed"}, status=409)
#         config = RestaurantUPISettings.objects.filter(is_enabled=True).order_by("-updated_at").first()
#         if not config or not config.upi_id or not config.payee_name:
#             return Response({"message": "Restaurant UPI is not configured"}, status=409)
#         amount = _payment_amount(order)
#         # Avoid logging bank/payment identifiers; use a URL-encoded UPI intent.
#         uri = "upi://pay?" + urlencode({
#             "pa": config.upi_id, "pn": config.payee_name, "am": str(amount),
#             "cu": "INR", "tr": str(order.order_id)[:35],
#         })
#         try:
#             import qrcode
#         except ImportError:
#             return Response({"message": "Server QR dependency missing: pip install qrcode[pil]"}, status=503)
#         qr = qrcode.QRCode(box_size=8, border=3, error_correction=qrcode.constants.ERROR_CORRECT_M)
#         qr.add_data(uri)
#         qr.make(fit=True)
#         output = BytesIO()
#         qr.make_image(fill_color="black", back_color="white").save(output, format="PNG")
#         return Response({
#             "order_id": order.order_id, "amount": str(amount),
#             "payee_name": config.payee_name,
#             "qr_image": "data:image/png;base64," + base64.b64encode(output.getvalue()).decode("ascii"),
#         })


from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import *
from admin_app.models import *
from ..order_access import ensure_order_access
from ..serializers import *
from django.db.models import Q
from django.core.paginator import Paginator

class getPaymentMethodAPIView(APIView):
    def get(self,request,tenant):
        content = PaymentMethod.objects.all()
        serializer = PaymentMethodSerializer(content, many=True)
        return Response(serializer.data)
    def post(self, request, tenant):
        # print(request.data)
        if "id" in request.data:
            paymentMethod = PaymentMethod.objects.get(id=request.data["id"])
            serializedData = PaymentMethodSerializer(paymentMethod, data=request.data, partial=True)
            if serializedData.is_valid():
                serializedData.save()
                return Response({"msg": "Updated Successfully"}, status=status.HTTP_200_OK)
            return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializedData = PaymentMethodSerializer(data=request.data)
            if serializedData.is_valid():
                serializedData.save()
                return Response({"msg": "Saved Successfully"}, status=status.HTTP_201_CREATED)
            return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)

class updatePaymentModeAPIView(APIView):
    def put(self, request, tenant):
        # Legacy customer endpoint must never mark payment paid.
        return Response({"error": "Use customer-manual-payment to submit a payment claim."}, status=403)


class CheckPaymentStatusAPIView(APIView):
    def post(self, request, tenant):
        from django.db import connection
        from rest_framework.exceptions import NotFound, ValidationError

        order_id = request.data.get("order_id")

        if not order_id:
            raise ValidationError({
                "order_id": "Order ID is required."
            })

        order_obj = Order.objects.select_related(
            "customer_id"
        ).filter(order_id=order_id).first()

        if order_obj is None:
            raise NotFound("Order not found.")

        # Reuse existing customer order-token verification.
        ensure_order_access(request, tenant, order_obj)

        # Existing invoice order data.
        order_serializer = OrderSerializer(order_obj)

        # Existing restaurant billing settings.
        setting_obj = Setting.objects.last()
        setting_data = (
            SettingSaveSerializer(setting_obj).data
            if setting_obj is not None
            else {}
        )

        # Reuse the tenant already resolved by django-tenants.
        current_tenant = getattr(connection, "tenant", None)

        tenant_detail = {
            "name": "",
            "address": ""
        }

        if current_tenant is not None:
            restaurant = getattr(
                current_tenant,
                "restaurant_name",
                None
            )

            if restaurant is not None:
                tenant_detail = {
                    "name": getattr(
                        restaurant,
                        "restaurant_name",
                        ""
                    ) or "",
                    "address": getattr(
                        restaurant,
                        "address",
                        ""
                    ) or ""
                }

        return Response({
            "order": order_serializer.data,
            "setting": setting_data,
            "tenant": tenant_detail
        }, status=200)


class UpdatePaymentStatus(APIView):
    def post(self, request, tenant):
        # Disable unsafe legacy serializer payment-status writes.
        return Response({"error": "Payment must be confirmed by authorized restaurant billing verification."}, status=403)

class PaymentModeAPIView(APIView):
    def get(self,request,tenant,id):
        mode=Order.objects.get(id=id).payment_mode
        return Response({"msg":"success","paymentMode":mode})




# Phase 2: customer payment selection and amount-specific UPI QR.
# Add these classes at the END of the existing tenant_app/views/payments.py.
# Existing payment views and shared infrastructure remain unchanged.
from decimal import Decimal, InvalidOperation
from urllib.parse import urlencode
from io import BytesIO
import base64
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from ..order_access import ensure_order_access
from ..models import OrderPaymentVerification, RestaurantUPISettings

def _payment_amount(order):
    try:
        value = Decimal(str(order.final_amount if order.final_amount is not None else order.total))
    except (InvalidOperation, TypeError, ValueError):
        raise ValidationError({"message": "Order amount is unavailable"})
    if not value.is_finite() or value <= 0:
        raise ValidationError({"message": "Order amount must be greater than zero"})
    return value.quantize(Decimal("0.01"))

def _payment_order(request, tenant):
    order_id = request.query_params.get("order_id") if request.method == "GET" else request.data.get("order_id")
    if not order_id:
        raise ValidationError({"message": "order_id is required"})
    order = Order.objects.select_related("customer_id").filter(order_id=order_id).first()
    if not order:
        from rest_framework.exceptions import NotFound
        raise NotFound("Order not found")
    ensure_order_access(request, tenant, order)
    return order

def _auto_apply_loyalty(order, lock_customer=False):
    """Set the maximum eligible redemption before a payment is claimed.

    Keep the amount frozen while a claim awaits verification. Never let the
    customer choose a different amount from the server's computed balance.
    """
    setting = Setting.objects.first()
    enabled = bool(setting and setting.allow_loyality_points)
    customer_query = CustomerDetail.objects
    if lock_customer:
        customer_query = customer_query.select_for_update()
    customer = customer_query.get(pk=order.customer_id_id)
    balance = max(0, int(customer.loyality_points or 0))
    point_value = Decimal(str(setting.per_loyality_point_value or 0)) if enabled else Decimal('0')
    subtotal = Decimal(str(order.sub_total or 0))
    other_discount = Decimal(str(order.discount_rupees or 0))
    if setting and getattr(setting, 'discount_in', None) == 'Discount in (%)':
        other_discount = subtotal * Decimal(str(order.discount_percentage or 0)) / 100
    # Keep at least one paisa payable; the existing manual-payment API requires > 0.
    eligible = max(Decimal('0'), subtotal - other_discount - Decimal('0.01'))
    cap = int(eligible // point_value) if point_value > 0 else 0
    points = min(balance, max(0, cap)) if enabled else 0
    current = int(order.apply_loyality_point or 0)
    claim = OrderPaymentVerification.objects.filter(order=order).first()
    if claim and claim.state in ('awaiting_verification', 'verified'):
        return enabled, balance, point_value
    if order.payment_status not in ('Paid', 'Completed') and current != points:
        order.apply_loyality_point = points
        order.save()
    return enabled, balance, point_value


def _payment_breakdown(order, setting):
    return {
        'subtotal': str(Decimal(str(order.sub_total or 0)).quantize(Decimal('0.01'))),
        'loyalty_discount': str(Decimal(str(order.loyality_point_price or 0)).quantize(Decimal('0.01'))),
        'taxable_amount': str(Decimal(str(order.total or 0)).quantize(Decimal('0.01'))),
        'cgst': str(Decimal(str(order.cgst or 0)).quantize(Decimal('0.01'))),
        'sgst': str(Decimal(str(order.sgst or 0)).quantize(Decimal('0.01'))),
        'cgst_rate': str(getattr(setting, 'cgst', 0) or 0),
        'sgst_rate': str(getattr(setting, 'sgst', 0) or 0),
        'loyalty_used': int(order.apply_loyality_point or 0),
    }


class CustomerManualPaymentAPIView(APIView):
    """Uses the existing X-Order-Token, X-Tenant, Order, and payment models."""
    def get(self, request, tenant):
        order = _payment_order(request, tenant)
        with transaction.atomic():
            order = Order.objects.select_for_update().get(pk=order.pk)
            enabled, available, point_value = _auto_apply_loyalty(order, lock_customer=True)
            amount = _payment_amount(order)
            claim = OrderPaymentVerification.objects.filter(order=order).first()
            config = RestaurantUPISettings.objects.filter(is_enabled=True).order_by('-updated_at').first()
            setting = Setting.objects.first()
            result = {
                'loyalty_enabled': enabled,
                'loyalty_points': available,
                'loyalty_value': str(point_value),
                'order_id': order.order_id,
                'amount': str(amount),
                'order_status': order.order_status,
                'payment_status': order.payment_status,
                'method': claim.method if claim else None,
                'verification_state': claim.state if claim else 'not_started',
                'upi_available': bool(config),
                **_payment_breakdown(order, setting),
            }
            if config and order.order_status == 'Served' and order.payment_status not in ('Paid', 'Completed'):
                result['payee_name'] = config.payee_name
            return Response(result)

    def post(self, request, tenant):
        action = request.data.get("action")
        if action not in ("select", "claim"):
            raise ValidationError({"message": "Invalid action"})
        method = request.data.get("method")
        if method not in ("Cash", "UPI"):
            raise ValidationError({"message": "Choose Cash or UPI"})
        order = _payment_order(request, tenant)
        with transaction.atomic():
            order = Order.objects.select_for_update().get(pk=order.pk)
            if order.order_status != "Served":
                return Response({"message": "Payment is available after order is served"}, status=409)
            if order.payment_status in ("Paid", "Completed"):
                return Response({"message": "Payment is already confirmed"}, status=409)
            # Always apply the full eligible balance on the server. Ignore any
            # stale loyalty_points field sent by older customer frontends.
            _auto_apply_loyalty(order, lock_customer=True)
            amount = _payment_amount(order)
            if method == "UPI" and not RestaurantUPISettings.objects.filter(is_enabled=True).exists():
                return Response({"message": "UPI payment is not configured for this restaurant"}, status=409)
            claim, created = OrderPaymentVerification.objects.select_for_update().get_or_create(
                order=order, defaults={"method": method, "amount_snapshot": amount}
            )
            if claim.state == "verified":
                return Response({"message": "Payment is already verified"}, status=409)
            if claim.state == "awaiting_verification" and (claim.method != method or claim.amount_snapshot != amount):
                return Response({"message": "Payment already submitted for verification"}, status=409)
            if action == "claim":
                claim.state = "awaiting_verification"
                claim.claimed_at = timezone.now()
            else:
                if claim.state == "awaiting_verification":
                    return Response({"message": "Payment is awaiting restaurant confirmation"}, status=409)
                claim.state = "not_started"
                claim.claimed_at = None
            claim.method = method
            claim.amount_snapshot = amount
            claim.save()
            # IMPORTANT: Do not update Order.payment_status here.
            # Phase 3 will connect original Admin Paid action to verification.
        return Response({
            "order_id": order.order_id, "amount": str(amount), "method": method,
            "verification_state": claim.state, "payment_status": order.payment_status
        })

class CustomerAmountQRAPIView(APIView):
    """Dynamic QR image generated from existing per-tenant UPI settings."""
    def get(self, request, tenant):
        order = _payment_order(request, tenant)
        if order.order_status != "Served":
            return Response({"message": "Order has not been served"}, status=409)
        if order.payment_status in ("Paid", "Completed"):
            return Response({"message": "Payment is already confirmed"}, status=409)
        config = RestaurantUPISettings.objects.filter(is_enabled=True).order_by("-updated_at").first()
        if not config or not config.upi_id or not config.payee_name:
            return Response({"message": "Restaurant UPI is not configured"}, status=409)
        with transaction.atomic():
            order = Order.objects.select_for_update().get(pk=order.pk)
            _auto_apply_loyalty(order, lock_customer=True)
            amount = _payment_amount(order)
        # Avoid logging bank/payment identifiers; use a URL-encoded UPI intent.
        uri = "upi://pay?" + urlencode({
            "pa": config.upi_id, "pn": config.payee_name, "am": str(amount),
            "cu": "INR", "tr": str(order.order_id)[:35],
        })
        try:
            import qrcode
        except ImportError:
            return Response({"message": "Server QR dependency missing: pip install qrcode[pil]"}, status=503)
        qr = qrcode.QRCode(box_size=8, border=3, error_correction=qrcode.constants.ERROR_CORRECT_M)
        qr.add_data(uri)
        qr.make(fit=True)
        output = BytesIO()
        qr.make_image(fill_color="black", back_color="white").save(output, format="PNG")
        return Response({
            "order_id": order.order_id, "amount": str(amount),
            "payee_name": config.payee_name,
            "qr_image": "data:image/png;base64," + base64.b64encode(output.getvalue()).decode("ascii"),
        })
