"""Waiter password storage.

Passwords are stored as Django password hashes. Older versions stored them with
reversible Fernet encryption (key: ENCRYPT_KEY); those still verify and are
replaced by a hash on the next successful login.
"""

import base64
import hmac
import logging

from django.conf import settings
from django.contrib.auth.hashers import check_password, identify_hasher, make_password

logger = logging.getLogger('custom_logger')


def hash_password(raw):
    return make_password(str(raw))


def is_hashed(value):
    try:
        identify_hasher(value or '')
        return True
    except ValueError:
        return False


def _legacy_decrypt(value):
    if not settings.ENCRYPT_KEY:
        return None
    try:
        from cryptography.fernet import Fernet

        return Fernet(settings.ENCRYPT_KEY).decrypt(base64.urlsafe_b64decode(value)).decode('ascii')
    except Exception:
        logger.warning('legacy waiter password could not be decrypted')
        return None


def verify_password(raw, stored):
    """Return (is_valid, needs_upgrade)."""
    raw = str(raw or '')
    if is_hashed(stored):
        return check_password(raw, stored), False
    legacy = _legacy_decrypt(stored)
    if legacy is not None and hmac.compare_digest(legacy, raw):
        return True, True
    return False, False
