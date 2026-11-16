"""Email one-time codes for restaurant owners who forgot their password."""

import hmac
import logging
import secrets
from datetime import timedelta

from django.conf import settings
from django.core.cache import cache
from django.core.mail import send_mail
from django.utils import timezone

from .models import Otp

logger = logging.getLogger('custom_logger')

CODE_LENGTH = 6
EXPIRY = timedelta(minutes=5)
RESEND_SECONDS = 60
MAX_ATTEMPTS = 5


def _attempts_key(email):
    return f'password-reset-attempts:{email}'


def send_code(email):
    """Create and email a new code. Returns an error message, or None on success."""
    resend_key = f'password-reset-sent:{email}'
    if cache.get(resend_key):
        return 'Please wait a minute before requesting another OTP.'

    code = ''.join(secrets.choice('0123456789') for _ in range(CODE_LENGTH))
    Otp.objects.filter(email=email).delete()
    Otp.objects.create(email=email, otp=code)
    cache.delete(_attempts_key(email))
    cache.set(resend_key, True, RESEND_SECONDS)

    try:
        send_mail(
            'Your account verification email',
            f'Hello, Please use following verification code, to update your password.\n {code} \n Thanks..!!',
            settings.DEFAULT_FROM_EMAIL,
            [email],
        )
    except Exception:
        logger.exception('password reset email failed for %s', email)
        return 'We could not send the email right now. Please try again later.'
    return None


def verify_code(email, code):
    """Consume the code when it matches. Returns an error message, or None on success."""
    otp = Otp.objects.filter(email=email).order_by('-id').first()
    if otp is None:
        return 'Entered OTP is wrong'
    if otp.otptime and timezone.now() > otp.otptime + EXPIRY:
        otp.delete()
        return 'OTP Expired'

    if not hmac.compare_digest(str(otp.otp), str(code or '').strip()):
        attempts = cache.get(_attempts_key(email), 0) + 1
        cache.set(_attempts_key(email), attempts, int(EXPIRY.total_seconds()))
        if attempts >= MAX_ATTEMPTS:
            otp.delete()
            return 'Too many wrong attempts. Please request a new OTP.'
        return 'Entered OTP is wrong'

    otp.delete()
    cache.delete(_attempts_key(email))
    return None
