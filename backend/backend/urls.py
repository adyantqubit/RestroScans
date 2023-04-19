from django.contrib import admin
from django.urls import path, include, re_path

from django.conf.urls.static import static
from django.conf import settings
from admin_app.views import PricingImageAPI
from admin_app.views import GalleryDetailsAPI
from admin_app.views import GetRestroscansRequestAPI
from admin_app.views import ContactUsAPI
from admin_app.views import RestaurentPatnersDetailsAPI

"""---------------------------------------------------------------
Commented and modified by - Ashish Dewangan on 08-02-2023
Reason - To specify urls
"""
# urlpatterns = [
#     path('admin/', admin.site.urls),
# ]
urlpatterns = [
    #  Added by:- Suman sahu  On 08/04/2023
    #  Reason:- Created Url for get Pricing plans details
    path(
        "site/get-pricing-plans/",
        PricingImageAPI.as_view(),
    ),
    # End of added code 08/04/2023
    #  Added by:- Suman sahu  On 09/04/2023
    #  Reason:- Created Url for get Gallery details
    path(
        "site/get-gallery-details/",
        GalleryDetailsAPI.as_view(),
    ),
    # End of added code 09/04/2023
    #  Added by:- Suman sahu  On 13/04/2023
    #  Reason:- Created Url for for post GetRestroscans Requests
    path(
        "site/registration-request/",
        GetRestroscansRequestAPI.as_view(),
    ),
    # End of added code 13/04/2023
    #  Added by:- Suman sahu  On 14/04/2023
    #  Reason:- Created Url for for post ContactUs Requests
    path(
        "site/contact-us-request/",
        ContactUsAPI.as_view(),
    ),
    # End of added code 14/04/2023
    #  Added by:- Suman sahu  On 19/04/2023
    #  Reason:- Created Url for for Get top restaurent patners details
    path(
        "site/restaurent-patners-details/",
        RestaurentPatnersDetailsAPI.as_view(),
    ),
    # End of added code 19/04/2023
    path("admin/", admin.site.urls),
    path("admin_app/", include("admin_app.urls")),
    path("api/v1/", include("tenant_app.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
"""
End of code modification
"""
