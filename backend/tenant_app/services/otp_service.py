"""Phone OTP for order confirmation.

The customer site sends the SMS through Firebase phone sign-in. Django checks
that Firebase ID token, then issues the short-lived order token the rest of
the order APIs already expect. The SMS provider below is unused by that flow.
"""

import hashlib
import hmac
import logging
import random
import string
import time
from datetime import timedelta

import jwt
import requests
from cryptography.x509 import load_pem_x509_certificate
from django.conf import settings
from django.utils import timezone

from ..models import PhoneOtp

logger = logging.getLogger('custom_logger')


def send_order_otp(phone, tenant_slug):
    phone = _clean_phone(phone)
    if not phone:
        return False, 'Enter a valid phone number.', None

    window_start = timezone.now() - timedelta(minutes=15)
    recent = PhoneOtp.objects.filter(phone=phone, created_at__gte=window_start).count()
    if recent >= int(getattr(settings, 'OTP_MAX_SENDS', 5)):
        return False, 'Too many OTP requests. Try again later.', None

    latest = PhoneOtp.objects.filter(phone=phone).order_by('-id').first()
    if latest and latest.created_at > timezone.now() - timedelta(seconds=int(getattr(settings, 'OTP_RESEND_SECONDS', 30))):
        return False, 'Please wait before requesting another OTP.', None

    length = int(getattr(settings, 'OTP_LENGTH', 6))
    code = ''.join(random.SystemRandom().choice(string.digits) for _ in range(length))
    PhoneOtp.objects.filter(phone=phone, consumed_at__isnull=True).update(consumed_at=timezone.now())
    PhoneOtp.objects.create(
        phone=phone,
        code_hash=_hash(phone, code),
        expires_at=timezone.now() + timedelta(minutes=int(getattr(settings, 'OTP_EXPIRY_MINUTES', 5))),
    )
    message = f'Your RestroScans code is {code}'
    provider_name = getattr(settings, 'SMS_PROVIDER', 'console')
    provider = _providers().get(provider_name, ConsoleSmsProvider)()
    provider.send(phone, message)
    return True, 'OTP sent.', None


def verify_order_otp(phone, code, tenant_slug):
    phone = _clean_phone(phone)
    otp = PhoneOtp.objects.filter(phone=phone, consumed_at__isnull=True).order_by('-id').first()
    if otp is None:
        return False, 'Request a new OTP.', None
    if otp.expires_at < timezone.now():
        return False, 'OTP expired. Request a new one.', None
    if otp.attempts >= int(getattr(settings, 'OTP_MAX_ATTEMPTS', 5)):
        return False, 'Too many attempts. Request a new OTP.', None

    otp.attempts += 1
    if not hmac.compare_digest(otp.code_hash, _hash(phone, str(code).strip())):
        otp.save(update_fields=['attempts'])
        return False, 'OTP is wrong. Please try again.', None

    otp.consumed_at = timezone.now()
    otp.save(update_fields=['attempts', 'consumed_at'])
    token = jwt.encode(
        {
            'purpose': 'order_otp',
            'phone': phone,
            'tenant': tenant_slug,
            'exp': timezone.now() + timedelta(minutes=int(getattr(settings, 'OTP_TOKEN_MINUTES', 20))),
        },
        settings.SECRET_KEY,
        algorithm='HS256',
    )
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return True, 'OTP verified.', token


_FIREBASE_CERTS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
_firebase_cert_cache = {'expires': 0, 'keys': {}}


def _firebase_certs():
    now = time.time()
    if _firebase_cert_cache['keys'] and _firebase_cert_cache['expires'] > now:
        return _firebase_cert_cache['keys']
    response = requests.get(_FIREBASE_CERTS_URL, timeout=10)
    response.raise_for_status()
    max_age = 3600
    for part in response.headers.get('Cache-Control', '').split(','):
        part = part.strip()
        if part.startswith('max-age='):
            try:
                max_age = int(part.split('=', 1)[1])
            except ValueError:
                max_age = 3600
    _firebase_cert_cache['keys'] = response.json()
    _firebase_cert_cache['expires'] = now + max(60, max_age)
    return _firebase_cert_cache['keys']


def _firebase_public_key(cert_pem):
    """Google publishes an X.509 certificate. PyJWT 2.4 only accepts a public key."""
    data = cert_pem.encode('utf-8') if isinstance(cert_pem, str) else cert_pem
    return load_pem_x509_certificate(data).public_key()


def verify_firebase_order(phone, id_token, tenant_slug):
    """Issue an order token when Firebase has verified this phone."""
    phone = _clean_phone(phone)
    project_id = (getattr(settings, 'FIREBASE_PROJECT_ID', '') or '').strip()
    if not phone:
        return False, 'Enter a valid phone number.', None
    if not project_id or not id_token:
        return False, 'Phone verification is not configured.', None
    try:
        header = jwt.get_unverified_header(id_token)
        cert = _firebase_certs().get(header.get('kid'))
        if not cert:
            return False, 'OTP could not be checked. Try again.', None
        payload = jwt.decode(
            id_token,
            _firebase_public_key(cert),
            algorithms=['RS256'],
            audience=project_id,
            issuer='https://securetoken.google.com/' + project_id,
            leeway=10,
        )
    except Exception as exc:
        logger.warning('firebase phone token rejected: %s', exc)
        return False, 'OTP is wrong. Please try again.', None
    provider = (payload.get('firebase') or {}).get('sign_in_provider')
    if provider != 'phone' or _clean_phone(payload.get('phone_number')) != phone:
        return False, 'OTP does not match this phone number.', None
    token = jwt.encode(
        {
            'purpose': 'order_otp',
            'phone': phone,
            'tenant': tenant_slug,
            'exp': timezone.now() + timedelta(minutes=int(getattr(settings, 'OTP_TOKEN_MINUTES', 20))),
        },
        settings.SECRET_KEY,
        algorithm='HS256',
    )
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return True, 'OTP verified.', token


def order_token_is_valid(token, phone, tenant_slug, leeway_seconds=0):
    """True for an unexpired OTP token for ``phone``; ``leeway_seconds`` keeps it usable a while longer."""
    if not token:
        return False
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'], leeway=leeway_seconds)
    except Exception:
        return False
    return (
        payload.get('purpose') == 'order_otp'
        and payload.get('phone') == _clean_phone(phone)
        and payload.get('tenant') == tenant_slug
    )


def _clean_phone(phone):
    digits = ''.join(ch for ch in str(phone or '') if ch.isdigit())
    if len(digits) < 10:
        return ''
    return digits[-10:]


def _hash(phone, code):
    raw = f'{settings.SECRET_KEY}:{phone}:{code}'.encode('utf-8')
    return hashlib.sha256(raw).hexdigest()


class ConsoleSmsProvider:
    """Development provider. The code is returned to the client only when DEBUG is on."""

    def send(self, phone, message):
        return True


class HttpSmsProvider:
    """POST {phone, message} to SMS_API_URL. Swap vendors by changing that URL."""

    def send(self, phone, message):
        url = getattr(settings, 'SMS_API_URL', '')
        if not url:
            raise RuntimeError('SMS_API_URL is not configured.')
        headers = {'Content-Type': 'application/json'}
        api_key = getattr(settings, 'SMS_API_KEY', '')
        if api_key:
            headers['Authorization'] = f'Bearer {api_key}'
        response = requests.post(url, json={'phone': phone, 'message': message}, headers=headers, timeout=10)
        response.raise_for_status()


def _providers():
    return {
        'console': ConsoleSmsProvider,
        'http': HttpSmsProvider,
    }
