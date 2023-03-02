"""
Created by - Ashish Dewangan on 08-02-2023
Reason - To specify all urls of admin_app
"""

from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import *

urlpatterns = [
    path('tenant-list/',TenantAPIView.as_view()),
    path('tenant-details/<str:tenantId>',TenantAPIView.as_view()),
    # Added by Yuvraj Sahu on 15-2-2023
    # Reason - to save user data
    path('moreshop/registration-request/',RestaurantRegistartionView.as_view()),
    # End of user data save

    # Added by Yuvraj Sahu on 17-2-2023
    # Reason - to restaurant login
    path('moreshop/login/', RestaurantLoginView.as_view()),
    # End of user data save

    # Added by Yuvraj Sahu on 18-2-2023
    # Reason - to send otp in mail for change passowrd
    path('moreshop/save-otp/', OtpAPI.as_view()),
    # End of sending otp

    # Added by Yuvraj Sahu on 18-2-2023
    # Reason - to send update passowrd
    path('moreshop/update-password/', UpdatePassword.as_view()),
    # End of sending otp

]  