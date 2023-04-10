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

    # Added by Yuvraj on 6-4-2023
    # Reason : to update menu
    path('<str:tenant>/menu-list/<int:pk>/',MenuAPIView.as_view()),
    # End of addition

    # Added by Om on 16-02-23
    # Reason : Show the Tenant details
    path('<str:tenant>/tenant-details/',TenantAPIView.as_view()),
    # End of addition

    # Added by Om on 01-03-23
    # Reason : Show the Offer details
    path('<str:tenant>/offer-details/',OfferAPIView.as_view()),
    # End of addition

    # Added by Om on 9-4-2023
    # Reason : to update offer name
    path('<str:tenant>/offer-details/<int:pk>/',OfferAPIView.as_view()),
    # End of addition

    # Added by Om on 08-04-23
    # Reason : Show the Offer details
    path('<str:tenant>/offer-items-details/',OfferItemsAPIView.as_view()),
    path('<str:tenant>/offer-items-details/<int:pk>/',OfferItemsAPIView.as_view()),

    # End of addition

    # Added by Om on 11-03-23
    # Reason : Show the Footer & Description details
    path('<str:tenant>/footer-description/',FooterandDescriptionAPIView.as_view()),
    # End of addition

    # Added by Om on 15-03-23
    # Reason : Show the Footer & Description details
    # path('setting-changes/color/',SettingAPIView.as_view()),
    path('<str:tenant>/setting-changes/color/',SettingAPIView.as_view()),
    # End of addition

    # Added by Yuvraj on 23-3-23
    # Reason : update category
    path('<str:tenant>/category/<int:pk>/',CategoryAPIView.as_view()),
    # End of addition

    # Added by Yuvraj on 6-4-23
    # Reason : crud operation perform for category
    path('<str:tenant>/category/',CategoryAPIView.as_view()),
    # End of addition

    # Added by Yuvraj on 23-3-23
    # Reason : crud operation perform for item
    path('<str:tenant>/item/',ItemAPIView.as_view()),
    # End of addition

    # Added by Yuvraj on 6-4-23
    # Reason : update item
    path('<str:tenant>/item/<int:pk>/',ItemAPIView.as_view()),
    # End of addition

    # Added by Yuvraj on 6-4-23
    # Reason : get all menu, category and items
    path('<str:tenant>/all-menus/',getAllMenusAPI.as_view()),
    # End of addition

]   