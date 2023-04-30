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

    # Added by :- Parineeta Gedam on 06-04-2023
    # Reason : post operation perform for customer details, order table, orderItems table.
    path('<str:tenant>/customer-details/',PostCustomerDetailsAPIView.as_view()),
    # End of added code 06-04-2023

    # Added by :- Parineeta Gedam on 06-04-2023
    # Reason : In order table update the payment mode.
    path('<str:tenant>/update-orders/',updateOrdersAPIView.as_view()),
    # End of added code 06-04-2023

    # Added by :- Parineeta Gedam on 06-04-2023
    # Reason : In order table update the payment mode.
    path('<str:tenant>/update-rating-review/',updateRatingAndReviewAPIView.as_view()),
    # End of added code 06-04-2023
    
    # Added by Yuvraj Sahu on 9-4-23
    # Reason : get all orders / this is access for restaurant
    path('<str:tenant>/all-orders/',getOrdersAPI.as_view()),
    # End of addition

    # Added by Yuvraj Sahu on 9-4-23
    # Reason : get all orders / this is access for reastaurant
    path('<str:tenant>/order-items/<int:pk>/',getOrderItemsAPI.as_view()),
    # End of addition

    # Added by Om on 11-4-23
    # Reason : get all theme colors from admin_app
    path('<str:tenant>/app-theme/',AppThemeAPI.as_view()),
    # End of addition

    # Added by :- Parineeta Gedam on 06-04-2023
    # Reason : get scanner
    path('<str:tenant>/get-scanner/',getPaymentMethodAPIView.as_view()),
    # End of added code 06-04-2023

    # Added by :- Parineeta Gedam on 06-04-2023
    # Reason : In order table update the payment mode.
    path('<str:tenant>/update-payment-mode/',updatePaymentModeAPIView.as_view()),
    # End of added code 06-04-2023

    # Added by :- Parineeta Gedam on 13-04-2023
    # Reason :- check payment status
    path('<str:tenant>/check-payment-status/',CheckPaymentStatusAPIView.as_view()),
    # End of added code 06-04-2023

    # Added by - Ashish Dewangan on 09-04-23
    # Reason - to get dashboard data
    path('<str:tenant>/dashboard-data/',DashboardAPI.as_view()),
    # End of code addition for dashboard data
    
    
    # #Added by :- Rohan Kansari on 13/4/23
    # # reason : To get all top 10 best product and also admin ticked best seller 
    # path('<str:tenant>/get-top-products/',BesttSellerAPI.as_view()),
    # # End of added code 13-04-23

    # Added by Yuvraj on 17-4-23
    # Reason : update order and payment status
    path('<str:tenant>/order-payment-status/<str:orderID>/',UpdateOrderPaymentStatus.as_view()),
    # End of addition

    # Added by Ashish Dewangan on 28-04-2023
    # Reason : To store customer's FCM token on backend
    path('<str:tenant>/store-fcm-token/',FcmNotificationAPI.as_view()),
    # End of code addition by Ashish Dewangan on 28-04-2023

]   