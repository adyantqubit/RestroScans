from django.conf import settings
from django.contrib.auth.hashers import check_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from . import password_reset
from .authentication import ROLE_OWNER, decode_refresh_token, issue_tokens
from .models import (
    AppSetting,
    CustomerFeedback,
    GallerySettings,
    PricingPlans,
    RestaurantRequest,
    Tenant,
    WebsiteSetting,
)
from .serializers import (
    CustomerFeedbackSerializer,
    GallerySerializer,
    GetRestroscansRequestSerializer,
    PostContactUsSerializer,
    PricingPlansSerializer,
    PricingSerializer,
    PublicTenantSerializer,
    RestaurantRequestSerializer,
    RestaurentPatnersSerializer,
)

SENSITIVE_RESTAURANT_FIELDS = ('password', 'confirm_password')


def _first_error(errors):
    for value in errors.values():
        if isinstance(value, (list, tuple)) and value:
            return str(value[0])
        if value:
            return str(value)
    return 'Please check the details and try again.'


def tenant_media_url(domain_url, relative_path):
    base = settings.TENANT_API_URL_TEMPLATE.format(domain=domain_url).rstrip('/')
    return f"{base}/{settings.MEDIA_URL.strip('/')}/{domain_url}/{relative_path}"


class TenantAPIView(APIView):
    """Public directory of restaurants. A single restaurant's details are served by the tenant's own API."""

    def get(self, request):
        queryset = Tenant.objects.select_related('restaurant_name').exclude(schema_name='public').order_by('id')
        return Response({'msg': 'success', 'tenantList': PublicTenantSerializer(queryset, many=True).data})


class RestaurantRegistartionView(APIView):
    def post(self, request, format=None):
        serializer = RestaurantRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'duplicate': _first_error(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({'msg': 'Registered Successfully'}, status=status.HTTP_201_CREATED)


class RestaurantLoginView(APIView):
    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        restaurant = RestaurantRequest.objects.filter(email__iexact=email).first()
        if not restaurant or not check_password(request.data.get('password') or '', restaurant.password):
            return Response({'invalid': 'Invalid Email or Password'}, status=status.HTTP_401_UNAUTHORIZED)

        tenant = Tenant.objects.filter(restaurant_name=restaurant.id).values().first()
        if not restaurant.is_active or tenant is None:
            return Response({'notAproved': 'Please wait for approval'}, status=status.HTTP_403_FORBIDDEN)

        access_token, refresh_token = issue_tokens(restaurant.id, ROLE_OWNER, tenant['schema_name'])
        user_data = RestaurantRequest.objects.filter(id=restaurant.id).values().first()
        for field in SENSITIVE_RESTAURANT_FIELDS:
            user_data.pop(field, None)

        from admin_app.plan_catalog import codes_for_tenant
        tenant_obj = Tenant.objects.filter(pk=tenant['id']).first()

        return Response({
            'token': access_token,
            'refreshToken': refresh_token,
            'userData': [user_data],
            'tenantInfo': tenant,
            'features': codes_for_tenant(tenant_obj),
            'qrCodeTenant': tenant_media_url(tenant['domain_url'], 'images/qrcode/qr.svg'),
        })


class OtpAPI(APIView):
    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        if not RestaurantRequest.objects.filter(email__iexact=email).exists():
            return Response({'error': 'Entered email is not registered'}, status=status.HTTP_404_NOT_FOUND)
        error = password_reset.send_code(email)
        if error:
            return Response({'error': error}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        return Response({'msg': 'OTP is sent successfully. Please check your email', 'mail': email})


class UpdatePassword(APIView):
    def post(self, request):
        email = (request.data.get('email') or '').strip().lower()
        new_password = request.data.get('password') or ''
        if len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        error = password_reset.verify_code(email, request.data.get('otp'))
        if error:
            return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)

        restaurant = RestaurantRequest.objects.filter(email__iexact=email).first()
        if restaurant is None:
            return Response({'error': 'Entered email is not registered'}, status=status.HTTP_404_NOT_FOUND)
        restaurant.password = new_password
        restaurant.confirm_password = new_password
        restaurant.save()
        return Response({'msg': 'Password successfully changed'})

    put = post


class AppSettingAPI(APIView):
    FIELDS = ('app_logo', 'adyant_logo', 'title', 'bottom_text', 'adyant_webite_link', 'adyant_support_link')

    def get(self, request):
        app_settings = AppSetting.objects.values(*self.FIELDS).first() or {field: '' for field in self.FIELDS}
        return Response(app_settings)


class PricingImageAPI(APIView):
    def get(self, request):
        return Response({'pricingData': PricingSerializer(WebsiteSetting.objects.all(), many=True).data})


class GalleryDetailsAPI(APIView):
    def get(self, request):
        return Response({'galleryData': GallerySerializer(GallerySettings.objects.all(), many=True).data})


class _PublicFormAPI(APIView):
    serializer_class = None

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response({'err': _first_error(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({'success': 'Successfully Submitted'})


class GetRestroscansRequestAPI(_PublicFormAPI):
    serializer_class = GetRestroscansRequestSerializer


class ContactUsAPI(_PublicFormAPI):
    serializer_class = PostContactUsSerializer


class RestaurentPatnersDetailsAPI(APIView):
    def get(self, request):
        partners = RestaurantRequest.objects.filter(is_partner=True)
        return Response({'restaurentsData': RestaurentPatnersSerializer(partners, many=True).data})


class PricingPlansAPI(APIView):
    def get(self, request):
        return Response({'pricingPlansData': PricingPlansSerializer(PricingPlans.objects.all(), many=True).data})


class CustomerFeedbackAPI(APIView):
    def get(self, request):
        return Response({'customerFeedback': CustomerFeedbackSerializer(CustomerFeedback.objects.all(), many=True).data})


class ValidateToken(APIView):
    """Exchange a refresh token for a new access/refresh pair."""

    def post(self, request):
        try:
            identity = decode_refresh_token(request.data.get('refresh') or '')
        except Exception:
            return Response(
                {'success': False, 'message': 'Your session has expired. Please sign in again.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        access, refresh = issue_tokens(identity.user_id, identity.role, identity.tenant)
        return Response({'access_token': access, 'refresh_token': refresh})
