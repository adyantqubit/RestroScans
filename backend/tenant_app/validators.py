from django.core.exceptions import ValidationError

def validate_image(fieldfile_obj):
    """Image sizes are enforced after optimization, just before saving."""
    if not fieldfile_obj:
        return
    file_obj = getattr(fieldfile_obj, "file", fieldfile_obj)
    if getattr(file_obj, "size", 0) > 40 * 1024 * 1024:
        raise ValidationError("Image must be smaller than 40 MB before compression.")

def validate_customer_mobile_number(contact_number):
    if len(contact_number) > 10:
        raise ValidationError("Contact number cannot be more than 10 digits")

def validate_payment_mobile_number(contact_number):
    if len(contact_number) > 10:
        raise ValidationError("Contact number cannot be more than 10 digits")

def validate_mobile_number(contact_number):
    if len(contact_number) > 10:
        raise ValidationError("Contact number cannot be more than 10 digits")

def validate_discount_rupees(value):
    if value < 0:
        raise ValidationError("Discount should not be less than 0")

def validate_discount_precentage(value):
    if value < 0 or value > 100:
        raise ValidationError("Discount percentage should be between 0 and 100")

def validate_qunatity(value):
    if value <= 0:
        raise ValidationError("Quantity should be greater than 0")

# Keep historical migration import paths stable while implementations live here.
validate_image.__module__ = "tenant_app.models"
validate_customer_mobile_number.__module__ = "tenant_app.models"
validate_customer_mobile_number.__qualname__ = "CustomerDetail.validate_mobile_number"
validate_payment_mobile_number.__module__ = "tenant_app.models"
validate_payment_mobile_number.__qualname__ = "PaymentMethod.validate_mobile_number"
validate_mobile_number.__module__ = "tenant_app.models"
validate_discount_rupees.__module__ = "tenant_app.models"
validate_discount_precentage.__module__ = "tenant_app.models"
validate_qunatity.__module__ = "tenant_app.models"
