# """Phase 1: owner/staff-only configuration and manual payment verification.
# Customer selection, claims, QR and invoice are implemented in later phases.
# """
# from decimal import Decimal, InvalidOperation
# from django.db import transaction
# from django.utils import timezone
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from admin_app.authentication import staff_identity_for_tenant
# from admin_app.middlewares import bearer_token
# from tenant_app.models import Order, OrderPaymentVerification, RestaurantUPISettings
# from tenant_app.views.workforce import owner, logged_employee, staff_permissions

# def authorized(request, feature):
#     if owner(request):
#         return True
#     employee = logged_employee(request)
#     return bool(employee and feature in staff_permissions(employee, request))

# def reject(message, code=400):
#     return Response({"error": message}, status=code)

# def valid_amount(order):
#     try:
#         amount = Decimal(str(order.final_amount if order.final_amount is not None else order.total))
#     except (TypeError, InvalidOperation):
#         return None
#     if not amount.is_finite() or amount <= 0:
#         return None
#     return amount.quantize(Decimal("0.01"))

# class RestaurantUPISettingsAPI(APIView):
#     """Restaurant owner controls the payee, never customer/staff."""
#     def get(self, request):
#         if not authorized(request, "billing"):
#             return reject("Billing permission required", 403)
#         settings = RestaurantUPISettings.objects.order_by("id").first()
#         return Response({
#             "upi_id": settings.upi_id if settings else "",
#             "payee_name": settings.payee_name if settings else "",
#             "is_enabled": bool(settings and settings.is_enabled),
#         })

#     def put(self, request):
#         if not owner(request):
#             return reject("Restaurant owner required", 403)
#         upi_id = str(request.data.get("upi_id", "")).strip()
#         payee_name = str(request.data.get("payee_name", "")).strip()
#         enabled = request.data.get("is_enabled", False)
#         if not isinstance(enabled, bool):
#             return reject("is_enabled must be boolean")
#         if enabled and (not upi_id or "@" not in upi_id or not payee_name):
#             return reject("Valid UPI ID and payee name are required")
#         if len(upi_id) > 255 or len(payee_name) > 255:
#             return reject("UPI details too long")
#         with transaction.atomic():
#             settings = RestaurantUPISettings.objects.select_for_update().order_by("id").first()
#             if not settings:
#                 settings = RestaurantUPISettings()
#             settings.upi_id, settings.payee_name, settings.is_enabled = upi_id, payee_name, enabled
#             settings.save()
#         return Response({"status": "saved"})

# class ManualPaymentVerificationAPI(APIView):
#     """Manual paid approval only; no customer endpoint can mark an order paid."""
#     def get(self, request):
#         if not authorized(request, "billing"):
#             return reject("Billing permission required", 403)
#         try:
#             order_id = int(request.query_params.get("order_id", ""))
#         except (TypeError, ValueError):
#             return reject("Valid order_id required")
#         order = Order.objects.filter(pk=order_id).first()
#         if not order:
#             return reject("Order not found", 404)
#         payment = OrderPaymentVerification.objects.filter(order=order).first()
#         return Response({
#             "order_id": order.pk, "payment_status": order.payment_status,
#             "order_status": order.order_status, "amount": str(valid_amount(order) or "0.00"),
#             "method": payment.method if payment else order.payment_mode,
#             "verification_state": payment.state if payment else "not_started",
#             "claimed_at": payment.claimed_at if payment else None,
#             "verified_at": payment.verified_at if payment else None,
#         })

#     def post(self, request):
#         if not authorized(request, "billing"):
#             return reject("Billing permission required", 403)
#         try:
#             order_id = int(request.data.get("order_id"))
#         except (TypeError, ValueError):
#             return reject("Valid order_id required")
#         action = request.data.get("action")
#         if action not in ("confirm_paid", "reject"):
#             return reject("Invalid verification action")
#         with transaction.atomic():
#             order = Order.objects.select_for_update().filter(pk=order_id).first()
#             if not order:
#                 return reject("Order not found", 404)
#             if order.order_status != "Served":
#                 return reject("Only served orders can be verified")
#             payment = OrderPaymentVerification.objects.select_for_update().filter(order=order).first()
#             if not payment:
#                 return reject("Customer payment method/claim not submitted yet", 409)
#             amount = valid_amount(order)
#             if amount is None or payment.amount_snapshot != amount:
#                 return reject("Order total changed; customer must confirm the updated amount", 409)
#             if order.payment_status in ("Paid", "Completed") or payment.state == "verified":
#                 return reject("Order is already paid", 409)
#             if payment.state != "awaiting_verification":
#                 return reject("Customer payment claim is not awaiting verification", 409)
#             if action == "confirm_paid":
#                 payment.state = "verified"
#                 payment.verified_at = timezone.now()
#                 identity = staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name)
#                 payment.verified_by = str(getattr(identity, "user_id", "owner"))[:100]
#                 order.payment_status = "Paid"
#                 order.payment_mode = payment.method
#                 order.payment_confirmation_date_time = timezone.localtime().strftime("%Y-%m-%d %H:%M:%S")
#                 order.save(update_fields=["payment_status", "payment_mode", "payment_confirmation_date_time"])
#             else:
#                 payment.state = "rejected"
#                 payment.note = str(request.data.get("note", ""))[:500]
#             payment.save()
#         return Response({"status": "updated", "payment_status": order.payment_status, "verification_state": payment.state})


"""Restaurant UPI settings and manual payment verification.

Restaurant owner controls UPI configuration.
Authorized owner or billing staff verifies customer payment claims.
Customer payment submission never directly marks an order paid.
"""

from decimal import Decimal, InvalidOperation

from django.db import transaction
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response

from admin_app.authentication import staff_identity_for_tenant
from admin_app.middlewares import bearer_token

from tenant_app.models import (
    OrderItem,
    Order,
    OrderPaymentVerification,
    RestaurantUPISettings,
)

from tenant_app.views.workforce import (
    owner,
    logged_employee,
    staff_permissions,
)


def authorized(request, feature):
    if owner(request):
        return True

    employee = logged_employee(request)

    return bool(
        employee
        and feature in staff_permissions(employee, request)
    )


def reject(message, code=400):
    return Response(
        {"error": message},
        status=code
    )


def valid_amount(order):
    try:
        amount = Decimal(
            str(
                order.final_amount
                if order.final_amount is not None
                else order.total
            )
        )
    except (TypeError, ValueError, InvalidOperation):
        return None

    if not amount.is_finite() or amount <= 0:
        return None

    return amount.quantize(Decimal("0.01"))


class RestaurantUPISettingsAPI(APIView):
    """Restaurant owner controls UPI configuration."""

    def get(self, request):
        if not authorized(request, "billing"):
            return reject(
                "Billing permission required",
                403
            )

        settings = (
            RestaurantUPISettings.objects
            .order_by("id")
            .first()
        )

        return Response({
            "upi_id": settings.upi_id if settings else "",
            "payee_name": settings.payee_name if settings else "",
            "is_enabled": bool(
                settings and settings.is_enabled
            ),
        })

    def put(self, request):
        if not owner(request):
            return reject(
                "Restaurant owner required",
                403
            )

        upi_id = str(
            request.data.get("upi_id", "")
        ).strip()

        payee_name = str(
            request.data.get("payee_name", "")
        ).strip()

        enabled = request.data.get(
            "is_enabled",
            False
        )

        if not isinstance(enabled, bool):
            return reject(
                "is_enabled must be boolean"
            )

        if enabled and (
            not upi_id
            or "@" not in upi_id
            or not payee_name
        ):
            return reject(
                "Valid UPI ID and payee name are required"
            )

        if len(upi_id) > 255 or len(payee_name) > 255:
            return reject(
                "UPI details too long"
            )

        with transaction.atomic():
            settings = (
                RestaurantUPISettings.objects
                .select_for_update()
                .order_by("id")
                .first()
            )

            if not settings:
                settings = RestaurantUPISettings()

            settings.upi_id = upi_id
            settings.payee_name = payee_name
            settings.is_enabled = enabled

            settings.save()

        return Response({
            "status": "saved"
        })


class ManualPaymentVerificationAPI(APIView):
    """Manual verification by authorized restaurant billing users."""

    def get(self, request):
        if request.query_params.get("activity") == "1":
            if not (authorized(request, "orders") or authorized(request, "billing")):
                return reject("Orders permission required", 403)
        elif not authorized(request, "billing"):
            return reject("Billing permission required", 403)

        # Existing endpoint: batch activity for the Orders list.
        # Never expose this information without billing permission.
        if request.query_params.get("activity") == "1":
            raw_ids = request.query_params.get("order_ids", "")
            try:
                ids = list(dict.fromkeys(int(part) for part in raw_ids.split(",") if part.strip()))
            except (ValueError, TypeError):
                return reject("Invalid order IDs")
            if not ids or len(ids) > 100 or any(value <= 0 for value in ids):
                return reject("Provide 1 to 100 valid order IDs")
            payments = OrderPaymentVerification.objects.filter(order_id__in=ids).values(
                "order_id", "state", "method", "amount_snapshot", "claimed_at"
            )
            payment_by_order = {row["order_id"]: row for row in payments}
            acknowledged_by_order = dict(Order.objects.filter(
                pk__in=ids
            ).values_list("id", "last_acknowledged_item_id"))
            from django.db.models import Max, Min, Count
            item_activity = OrderItem.objects.filter(order_id_id__in=ids).values(
                "order_id_id"
            ).annotate(latest_item_id=Max("id"), first_item_at=Min("date"),
                       last_item_at=Max("date"), item_count=Count("id"))
            items_by_order = {row["order_id_id"]: row for row in item_activity}
            return Response({
                "orders": {
                    str(order_id): {
                        "verification_state": payment_by_order.get(order_id, {}).get("state", "not_started"),
                        "method": payment_by_order.get(order_id, {}).get("method", ""),
                        "amount": str(payment_by_order.get(order_id, {}).get("amount_snapshot", "")),
                        "claimed_at": payment_by_order.get(order_id, {}).get("claimed_at"),
                        "latest_item_id": items_by_order.get(order_id, {}).get("latest_item_id"),
                        "acknowledged_item_id": acknowledged_by_order.get(order_id, 0),
                        "first_item_at": items_by_order.get(order_id, {}).get("first_item_at"),
                        "last_item_at": items_by_order.get(order_id, {}).get("last_item_at"),
                        "item_count": items_by_order.get(order_id, {}).get("item_count", 0),
                    } for order_id in ids
                }
            })

        try:
            order_id = int(
                request.query_params.get(
                    "order_id",
                    ""
                )
            )
        except (TypeError, ValueError):
            return reject(
                "Valid order_id required"
            )

        order = (
            Order.objects
            .filter(pk=order_id)
            .first()
        )

        if not order:
            return reject(
                "Order not found",
                404
            )

        payment = (
            OrderPaymentVerification.objects
            .filter(order=order)
            .first()
        )

        return Response({
            "order_id": order.pk,
            "payment_status": order.payment_status,
            "order_status": order.order_status,
            "amount": str(
                valid_amount(order) or "0.00"
            ),
            "method": (
                payment.method
                if payment
                else order.payment_mode
            ),
            "verification_state": (
                payment.state
                if payment
                else "not_started"
            ),
            "claimed_at": (
                payment.claimed_at
                if payment
                else None
            ),
            "verified_at": (
                payment.verified_at
                if payment
                else None
            ),
        })

    def post(self, request):
        if request.data.get("action") == "acknowledge_items":
            if not authorized(request, "orders"):
                return reject("Orders permission required", 403)
            try:
                order_id = int(request.data.get("order_id"))
                latest_item_id = int(request.data.get("latest_item_id"))
            except (TypeError, ValueError):
                return reject("Valid order and item IDs required")
            if order_id <= 0 or latest_item_id <= 0:
                return reject("Valid order and item IDs required")
            with transaction.atomic():
                order = Order.objects.select_for_update().filter(pk=order_id).first()
                if not order:
                    return reject("Order not found", 404)
                if not OrderItem.objects.filter(order_id=order, pk=latest_item_id).exists():
                    return reject("Item does not belong to this order", 400)
                order.last_acknowledged_item_id = max(
                    order.last_acknowledged_item_id or 0, latest_item_id
                )
                order.save(update_fields=["last_acknowledged_item_id"])
            return Response({"status": "acknowledged", "latest_item_id": order.last_acknowledged_item_id})
        if request.data.get("action") == "staff_received":
            # Waiter-collected payment uses the same verification record as
            # customer-submitted claims; no separate payment state is created.
            if not (authorized(request, "orders") or authorized(request, "billing")):
                return reject("Orders or billing permission required", 403)
            try:
                order_id = int(request.data.get("order_id"))
            except (TypeError, ValueError):
                return reject("Valid order_id required")
            method = str(request.data.get("method", "")).strip()
            if method not in ("Cash", "UPI"):
                return reject("Select Cash or UPI")
            with transaction.atomic():
                order = Order.objects.select_for_update().filter(pk=order_id).first()
                if not order:
                    return reject("Order not found", 404)
                # Only waiter-origin orders can use direct staff collection.
                # Customer QR orders must retain I Have Paid -> admin verification.
                origin = str(order.order_created_by or "").strip().lower()
                if origin != "waiter" and not (owner(request) and origin in ("admin", "owner")):
                    return reject("Customer QR orders require the existing I Have Paid and admin verification flow", 403)
                if order.order_status != "Served":
                    return reject("Only served orders can be paid", 409)
                if order.payment_status in ("Paid", "Completed"):
                    return reject("Payment already completed", 409)
                # Staff-origin orders only: redeem points using the existing
                # Order pricing/settlement rules, inside the payment transaction.
                from tenant_app.models import Setting, CustomerDetail
                setting = Setting.objects.first()
                enabled = bool(setting and setting.allow_loyality_points)
                try:
                    points = int(request.data.get("loyalty_points", 0) or 0)
                except (TypeError, ValueError):
                    return reject("Loyalty points must be a whole number")
                if points < 0:
                    return reject("Loyalty points cannot be negative")
                if points and not enabled:
                    return reject("Loyalty is disabled for this restaurant", 409)
                customer = CustomerDetail.objects.select_for_update().get(pk=order.customer_id_id)
                if points > int(customer.loyality_points or 0):
                    return reject("Not enough customer loyalty points", 409)
                point_discount = Decimal(points) * Decimal(str(setting.per_loyality_point_value or 0)) if enabled else Decimal(0)
                taxable_before_loyalty = Decimal(str(order.sub_total or 0)) - Decimal(str(order.discount_rupees or 0))
                if point_discount > taxable_before_loyalty:
                    return reject("Loyalty discount exceeds the payable amount", 409)
                if order.loyality_point_calculated:
                    return reject("Loyalty already settled for this order", 409)
                amount = valid_amount(order)
                if amount is None:
                    return reject("Invalid order amount", 409)
                payment = OrderPaymentVerification.objects.select_for_update().filter(order=order).first()
                if payment and payment.state == "verified":
                    return reject("Payment already verified", 409)
                if payment and payment.state == "awaiting_verification" and (payment.method != method or payment.amount_snapshot != amount):
                    return reject("Customer has a different pending payment claim. Resolve it before confirming another payment.", 409)
                if payment is None:
                    payment = OrderPaymentVerification(order=order)
                # Recalculate GST and final amount using the original Order.save()
                # loyalty rules, then settle points exactly once on payment.
                order.apply_loyality_point = points if enabled else 0
                order.payment_status = "Completed"
                order.payment_mode = method
                order.payment_confirmation_date_time = timezone.localtime().strftime("%Y-%m-%d %H:%M:%S")
                order.save()
                amount = valid_amount(order)
                if amount is None:
                    return reject("Invalid recalculated payment amount", 409)
                payment.method = method
                payment.amount_snapshot = amount
                payment.state = "verified"
                payment.verified_at = timezone.now()
                payment.claimed_at = payment.claimed_at or timezone.now()
                identity = staff_identity_for_tenant(bearer_token(request), request.tenant.schema_name)
                payment.verified_by = "owner" if owner(request) else str(getattr(identity, "user_id", "staff"))[:100]
                payment.note = "Payment received and confirmed by restaurant staff"
                payment.save()
                # Order was already saved with updated totals and loyalty.
                # Release the table after successful payment, unless another
                # unpaid order still occupies it.
                if order.dining_table_id:
                    from tenant_app.models import DiningTable
                    has_open = Order.objects.filter(dining_table_id=order.dining_table_id).exclude(pk=order.pk).exclude(order_status__in=["Completed", "Cancelled", "Delivered"]).exclude(payment_status__in=["Completed", "Paid"]).exists()
                    if not has_open:
                        DiningTable.objects.filter(pk=order.dining_table_id, staff_status="occupied").update(staff_status="available")
            return Response({"status": "updated", "payment_status": "Completed", "verification_state": "verified"})
        if not authorized(request, "billing"):
            return reject("Billing permission required", 403)

        try:
            order_id = int(
                request.data.get("order_id")
            )
        except (TypeError, ValueError):
            return reject(
                "Valid order_id required"
            )

        action = request.data.get("action")

        if action not in (
            "confirm_paid",
            "reject"
        ):
            return reject(
                "Invalid verification action"
            )

        with transaction.atomic():
            order = (
                Order.objects
                .select_for_update()
                .filter(pk=order_id)
                .first()
            )

            if not order:
                return reject(
                    "Order not found",
                    404
                )

            if order.order_status != "Served":
                return reject(
                    "Only served orders can be verified"
                )

            payment = (
                OrderPaymentVerification.objects
                .select_for_update()
                .filter(order=order)
                .first()
            )

            if not payment:
                return reject(
                    "Customer payment method/claim not submitted yet",
                    409
                )

            amount = valid_amount(order)

            if (
                amount is None
                or payment.amount_snapshot != amount
            ):
                return reject(
                    "Order total changed; customer must confirm the updated amount",
                    409
                )

            # Do not allow an already verified payment
            # to be confirmed or rejected again.
            if payment.state == "verified":
                return reject(
                    "Payment is already verified",
                    409
                )

            # Only customer-submitted claims can be verified.
            if payment.state != "awaiting_verification":
                return reject(
                    "Customer payment claim is not awaiting verification",
                    409
                )

            # FIX:
            # Older Admin Paid actions may already have
            # changed the order to Completed without
            # updating OrderPaymentVerification.
            #
            # Authorized billing users can reconcile
            # that state after independently verifying
            # the actual payment receipt.
            if order.payment_status not in (
                "Pending",
                "Paid",
                "Completed"
            ):
                return reject(
                    "Order has an unsupported payment status",
                    409
                )

            if action == "confirm_paid":
                # Record verification before marking
                # the order as completed.
                payment.state = "verified"
                payment.verified_at = timezone.now()

                identity = staff_identity_for_tenant(
                    bearer_token(request),
                    request.tenant.schema_name
                )

                payment.verified_by = str(
                    getattr(
                        identity,
                        "user_id",
                        "owner"
                    )
                )[:100]

                # Update existing order payment fields.
                order.payment_status = "Completed"
                order.payment_mode = payment.method

                order.payment_confirmation_date_time = (
                    timezone.localtime().strftime(
                        "%Y-%m-%d %H:%M:%S"
                    )
                )

                # Lock customer balance while the payment is finalized.
                from tenant_app.models import CustomerDetail
                CustomerDetail.objects.select_for_update().get(pk=order.customer_id_id)
                order.save(update_fields=[
                    "payment_status", "payment_mode", "payment_confirmation_date_time",
                    "loyality_point_calculated", "loyality_point_price", "loyality_point_status",
                ])

            else:
                # Rejecting a claim must never leave
                # an already-paid order in an inconsistent
                # completed state.
                if order.payment_status in (
                    "Paid",
                    "Completed"
                ):
                    return reject(
                        "Cannot reject a claim on an already completed order. Review the payment before taking action.",
                        409
                    )

                payment.state = "rejected"
                payment.note = str(
                    request.data.get(
                        "note",
                        ""
                    )
                )[:500]

            payment.save()

        return Response({
            "status": "updated",
            "payment_status": order.payment_status,
            "verification_state": payment.state,
        })
