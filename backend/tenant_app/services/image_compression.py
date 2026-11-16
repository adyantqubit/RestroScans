"""Shared compression for tenant catalog images (Admin and REST API uploads)."""
from io import BytesIO
from pathlib import Path

from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from PIL import Image, ImageOps, UnidentifiedImageError

MAX_UPLOAD_BYTES = 40 * 1024 * 1024
MAX_PIXELS = 50_000_000
LIMITS_KB = {"menu": 300, "category": 300, "item": 300, "offer": 400}


def optimize_image(upload, category):
    """Return a JPEG ContentFile with a strict encoded-size limit."""
    limit = LIMITS_KB[category] * 1024
    original = getattr(upload, "file", upload)
    try:
        original.seek(0)
        if getattr(original, "size", 0) > MAX_UPLOAD_BYTES:
            raise ValidationError("Image must be smaller than 40 MB before compression.")
        with Image.open(original) as source:
            if source.width * source.height > MAX_PIXELS:
                raise ValidationError("Image dimensions are too large (maximum 50 megapixels).")
            image = ImageOps.exif_transpose(source)
            image.load()
            if image.mode in ("RGBA", "LA") or ("transparency" in image.info):
                rgba = image.convert("RGBA")
                background = Image.new("RGB", rgba.size, (255, 255, 255))
                background.paste(rgba, mask=rgba.getchannel("A"))
                image = background
            else:
                image = image.convert("RGB")
    except ValidationError:
        raise
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError) as exc:
        raise ValidationError("Please upload a valid supported image.") from exc
    finally:
        try:
            original.seek(0)
        except (OSError, ValueError):
            pass

    # Preserve proportions; reduce resolution only as much as needed.
    max_side = 2000
    for _ in range(12):
        if max(image.size) > max_side:
            scaled = tuple(max(1, round(dim * max_side / max(image.size))) for dim in image.size)
            image = image.resize(scaled, Image.Resampling.LANCZOS)
        for quality in (86, 78, 68, 58, 46, 34, 22):
            buffer = BytesIO()
            image.save(buffer, format="JPEG", quality=quality, optimize=True, progressive=True)
            if buffer.tell() <= limit:
                name = Path(getattr(upload, "name", "image")).stem or "image"
                return ContentFile(buffer.getvalue(), name=f"{name}.jpg")
        if max(image.size) <= 64:
            break
        max_side = max(64, int(max(image.size) * 0.75))
    raise ValidationError(f"Could not compress image below {LIMITS_KB[category]} KB.")
