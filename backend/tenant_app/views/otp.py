import logging

from rest_framework.views import APIView

from common.responses import api_response
from ..services.otp_service import send_order_otp, verify_firebase_order

logger = logging.getLogger('custom_logger')


class SendOtpAPI(APIView):
    def post(self, request, tenant):
        phone = request.data.get('contact_number') or request.data.get('phone')
        try:
            ok, message, _code = send_order_otp(phone, tenant)
        except Exception:
            logger.exception('otp send failed')
            return api_response(False, 'OTP could not be sent. Try again.', status_code=502)
        if not ok:
            return api_response(False, message, status_code=429)
        logger.info('otp sent tenant=%s', tenant)
        return api_response(True, message)


class VerifyOtpAPI(APIView):
    def post(self, request, tenant):
        phone = request.data.get('contact_number') or request.data.get('phone')
        id_token = request.data.get('id_token') or ''
        ok, message, token = verify_firebase_order(phone, id_token, tenant)
        if not ok:
            return api_response(False, message, status_code=400)
        return api_response(True, message, {'order_token': token})
