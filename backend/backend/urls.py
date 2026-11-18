from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

from admin_app.views import (
    ContactUsAPI,
    CustomerFeedbackAPI,
    GalleryDetailsAPI,
    GetRestroscansRequestAPI,
    PricingImageAPI,
    PricingPlansAPI,
    RestaurentPatnersDetailsAPI,
)

urlpatterns = [
    # Public marketing site (restroscans.com)
    path('site/get-pricing-plans/', PricingImageAPI.as_view()),
    path('site/get-gallery-details/', GalleryDetailsAPI.as_view()),
    path('site/registration-request/', GetRestroscansRequestAPI.as_view()),
    path('site/contact-us-request/', ContactUsAPI.as_view()),
    path('site/restaurent-patners-details/', RestaurentPatnersDetailsAPI.as_view()),
    path('site/get-pricing-plans-details/', PricingPlansAPI.as_view()),
    path('site/get-cutomer-feedback/', CustomerFeedbackAPI.as_view()),

    path('django-admin/', admin.site.urls),
    path('admin_app/', include('admin_app.urls')),
    path('api/v1/', include('tenant_app.urls')),
]

if settings.SERVE_MEDIA_FILES:
    media_prefix = settings.MEDIA_URL.strip('/')
    urlpatterns += [
        re_path(rf'^{media_prefix}/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]

# Daphne does not serve STATIC_ROOT the way `runserver` does. Serve it in DEBUG so Django admin CSS loads locally.
if settings.DEBUG:
    static_prefix = settings.STATIC_URL.strip('/')
    urlpatterns += [
        re_path(rf'^{static_prefix}/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    ]
