"""Restaurant-specific login photo stored in tenant database, not ephemeral media."""
import base64
from io import BytesIO

from django.db import transaction
from PIL import Image, UnidentifiedImageError
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from admin_app.authentication import ROLE_OWNER, staff_identity_for_tenant
from admin_app.middlewares import bearer_token
from tenant_app.models import Setting


def current_setting():
    return Setting.objects.order_by("-id").first()


def owner_allowed(request):
    tenant = getattr(request, "tenant", None)
    identity = staff_identity_for_tenant(bearer_token(request), getattr(tenant, "schema_name", None))
    return identity is not None and identity.role == ROLE_OWNER


def serialize_image(setting):
    data = bytes(setting.login_background_data or b"") if setting else b""
    if not data:
        return {"image_url": None, "configured": False, "reason": "no_image_saved"}
    return {
        "image_url": "data:image/jpeg;base64," + base64.b64encode(data).decode("ascii"),
        "configured": True,
    }


class LoginBackgroundAPI(APIView):
    authentication_classes = []
    permission_classes = []
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, *args, **kwargs):
        return Response(serialize_image(current_setting()))

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        if not owner_allowed(request):
            return Response({"error": "Restaurant owner access required."}, status=403)
        upload = request.FILES.get("image")
        if not upload:
            return Response({"error": "Please select an image."}, status=400)
        if upload.size > 5 * 1024 * 1024:
            return Response({"error": "Image must be 5 MB or smaller."}, status=400)
        try:
            raw = upload.read()
            with Image.open(BytesIO(raw)) as image:
                image.verify()
            with Image.open(BytesIO(raw)) as image:
                if image.format not in ("JPEG", "PNG", "WEBP"):
                    raise ValueError("Only JPG, PNG and WEBP are allowed.")
                if image.width < 500 or image.height < 300 or image.width * image.height > 24000000:
                    raise ValueError("Image must be at least 500x300 and at most 24 megapixels.")
                image = image.convert("RGB")
                image.thumbnail((1920, 1920))
                output = BytesIO()
                image.save(output, "JPEG", quality=83, optimize=True)
                data = output.getvalue()
        except (UnidentifiedImageError, ValueError, OSError, Image.DecompressionBombError) as exc:
            return Response({"error": str(exc) or "Invalid image."}, status=400)

        setting = current_setting()
        if setting is None:
            setting = Setting.objects.create()
        setting.login_background_data = data
        setting.save(update_fields=["login_background_data"])
        setting.refresh_from_db(fields=["login_background_data"])
        result = serialize_image(setting)
        if not result["configured"]:
            return Response({"error": "Image could not be saved. Please retry."}, status=500)
        return Response({**result, "message": "Login background saved successfully."})

    @transaction.atomic
    def delete(self, request, *args, **kwargs):
        if not owner_allowed(request):
            return Response({"error": "Restaurant owner access required."}, status=403)
        setting = current_setting()
        if setting is not None:
            setting.login_background_data = None
            setting.save(update_fields=["login_background_data"])
        return Response({"image_url": None, "configured": False, "message": "Login background removed."})
