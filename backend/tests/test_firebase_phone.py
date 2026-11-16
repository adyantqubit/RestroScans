"""Firebase phone sign-in becomes the order token. No database and no live Firebase call."""

import datetime
import os
import time
import unittest
from unittest import mock

import django
import jwt
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.x509.oid import NameOID

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import override_settings  # noqa: E402

from tenant_app.services.otp_service import order_token_is_valid, verify_firebase_order  # noqa: E402


PHONE_CLAIMS = {
    'phone_number': '+919876543210',
    'firebase': {'sign_in_provider': 'phone'},
}


class FirebaseOrderTokenTests(unittest.TestCase):
    def _verified(self, claims=None, token='firebase-id-token'):
        with override_settings(FIREBASE_PROJECT_ID='restroscans-test'), \
                mock.patch('tenant_app.services.otp_service.jwt.get_unverified_header', return_value={'kid': 'kid'}), \
                mock.patch('tenant_app.services.otp_service._firebase_certs', return_value={'kid': 'cert'}), \
                mock.patch('tenant_app.services.otp_service._firebase_public_key', side_effect=lambda cert: cert), \
                mock.patch('tenant_app.services.otp_service.jwt.decode', return_value=claims if claims is not None else PHONE_CLAIMS):
            return verify_firebase_order('9876543210', token, 'demo')

    def test_verified_phone_issues_an_order_token(self):
        ok, message, token = self._verified()
        self.assertTrue(ok)
        self.assertEqual(message, 'OTP verified.')
        self.assertTrue(order_token_is_valid(token, '9876543210', 'demo'))

    def test_a_different_phone_is_rejected(self):
        ok, message, token = self._verified()
        self.assertTrue(ok)
        self.assertFalse(order_token_is_valid(token, '9000000000', 'demo'))

    def test_claims_for_another_number_are_rejected(self):
        claims = {'phone_number': '+919000000000', 'firebase': {'sign_in_provider': 'phone'}}
        ok, message, token = self._verified(claims)
        self.assertFalse(ok)
        self.assertIsNone(token)
        self.assertIn('match', message)

    def test_a_non_phone_sign_in_is_rejected(self):
        claims = {'phone_number': '+919876543210', 'firebase': {'sign_in_provider': 'google.com'}}
        ok, _message, token = self._verified(claims)
        self.assertFalse(ok)
        self.assertIsNone(token)

    def test_a_bad_token_is_rejected(self):
        with mock.patch('tenant_app.services.otp_service.jwt.get_unverified_header', side_effect=Exception('bad')):
            ok, message, token = verify_firebase_order('9876543210', 'not-a-token', 'demo')
        self.assertFalse(ok)
        self.assertIsNone(token)
        self.assertIn('wrong', message)

    def test_an_x509_certificate_verifies_the_token(self):
        key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, 'test')])
        now = datetime.datetime.now(datetime.timezone.utc)
        cert = (
            x509.CertificateBuilder()
            .subject_name(name)
            .issuer_name(name)
            .public_key(key.public_key())
            .serial_number(1)
            .not_valid_before(now)
            .not_valid_after(now + datetime.timedelta(days=1))
            .sign(key, hashes.SHA256())
        )
        pem = cert.public_bytes(serialization.Encoding.PEM).decode('utf-8')
        issued = int(time.time())
        signed = jwt.encode(
            {
                'phone_number': '+919876543210',
                'firebase': {'sign_in_provider': 'phone'},
                'aud': 'restroscans-test',
                'iss': 'https://securetoken.google.com/restroscans-test',
                'iat': issued,
                'exp': issued + 3600,
            },
            key,
            algorithm='RS256',
            headers={'kid': 'abc'},
        )
        with override_settings(FIREBASE_PROJECT_ID='restroscans-test'), \
                mock.patch('tenant_app.services.otp_service._firebase_certs', return_value={'abc': pem}):
            ok, message, token = verify_firebase_order('9876543210', signed, 'demo')
        self.assertTrue(ok, message)
        self.assertTrue(order_token_is_valid(token, '9876543210', 'demo'))

    def test_missing_project_is_rejected(self):
        with override_settings(FIREBASE_PROJECT_ID=''):
            ok, message, token = verify_firebase_order('9876543210', 'firebase-id-token', 'demo')
        self.assertFalse(ok)
        self.assertIsNone(token)
        self.assertIn('not configured', message)
