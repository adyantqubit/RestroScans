"""
Created by - Ashish Dewangan on 08-02-2023
Reason - To specify all ulrs of shared_app
"""

from django.conf import settings
from django.conf.urls.static import static
from django.urls import path,re_path
from .views import *

urlpatterns = [
    path('<str:tenant>/menu-list/',MenuAPIView.as_view()),

    # Added by Om on 16-02-23
    # Reason : Show the Tenant details
    path('<str:tenant>/tenant-details/',TenantAPIView.as_view()),
    # End of addition

    # Added by Om on 01-03-23
    # Reason : Show the Offer details
    path('<str:tenant>/offer-details/',OfferAPIView.as_view()),
    # End of addition

]   