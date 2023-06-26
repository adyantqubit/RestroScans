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

    # Added by Yuvraj Sahu on 01-05-23
    # Reason : get all customer list. This is access for restaurant
    path('<str:tenant>/all-customers/',getCustomerList.as_view()),
    # End of addition
    
    #Added by Om on 03-05-23 
    # #Adding a generate_pdf button
    path('admin/tenant_app/order/<int:pk>/generate-pdf/', generate_pdf_view, name='order_generate_bill'),
    # End of Code Addition

    #Added by Om on 03-05-23 
    # #Adding a generate_pdf button for kitchen
    path('admin/tenant_app/order/<int:pk>/generate-kot-pdf/', generate_pdf_kot_view, name='order_kot_generate_bill'),
    # End of Code Addition
    
    # Added by - Ashish Dewangan on 04-05-2023
    # Reason - To generate order report from admin panel
    path('admin/tenant_app/order_report/<report_period>', order_report, name='order_report'),
    # End of code addition by Ashish Dewangan on 04-05-2023

    # Added by - Ashish Dewangan on 04-05-2023
    # Reason - To generate item report from admin panel
    path('admin/tenant_app/item_report/<report_period>', item_report, name='item_report'),
    # End of code addition by Ashish Dewangan on 04-05-2023

    # Added by Rohan Kansari on 22-5-23
    # Reason : update order and payment status
    path('<str:tenant>/order-item-status/<str:orderID>/',UpdateItemStatus.as_view()),
    # End of addition - ROhan Kansari  22-5-23

     # Added by Rohan Kansari on 22-5-23
    # Reason : update order and payment status
    path('<str:tenant>/all-order-status-update/',UpdateAllOrderStatus.as_view()),
    # End of addition - ROhan Kansari  22-5-23
    # Added by :- Parineeta Gedam on 17-05-2023
    # Reason :- check order confirm
    path('<str:tenant>/check-order-confirm/',CheckOrderConfirmAPIView.as_view()),
    # End of added code  by :- Parineeta Gedam on 17-05-2023

    # Added by :- Parineeta Gedam on 16-05-2023
    # Reason : post operation perform for update orders
    path('<str:tenant>/delete_order_items/',DeleteOrderItemsAPIView.as_view()),
    # End of added code  by :- Parineeta Gedam on 16-05-2023

    # Added by :- Parineeta Gedam on 14-05-2023
    # Reason : post operation perform for update orders
    path('<str:tenant>/update_order_items/',PostUpdateOrderItemsAPIView.as_view()),
    # End of added code  by :- Parineeta Gedam on 14-05-2023

    # Added by :- Parineeta Gedam on 22-05-2023
    # Reason : get order items and orders 
    path('<str:tenant>/get_order_items_and_order/',GetOrderItemsAndOrderAPIView.as_view()),
    # End of added code  by :- Parineeta Gedam on 22-05-2023

    # Added by :- Parineeta Gedam on 24-05-2023
    # Reason : post(add) order items used in react native
    path('<str:tenant>/add_order_items/',AddOrderItemsAPIView.as_view()),
    # End of added code  by :- Parineeta Gedam on 24-04-2023

    # Added by :- Parineeta Gedam on 01-06-2023
    # Reason : post api for reservations data
    path('<str:tenant>/post_reservations/',PostReservationAPIView.as_view()),
    # End of added code by :- Parineeta Gedam on 01-06-2023

    
    # Added by :- Suman sahu on 27-05-2023
    # Reason : get api for get order report data
    path('<str:tenant>/revenue-order-report/',RevenueOrderReport.as_view()),
    # End of added code by :- Suman sahu on 27-05-2023

    # Added by :- Suman sahu on 28-05-2023
    # Reason : get api for get total menu, item and category details
    path('<str:tenant>/total-revenue-details/',GetTotalRevenueDetails.as_view()),
    # End of added code by :- Suman sahu on 28-05-2023

    # Added by Yuvraj Sahu on 25-05-23
    # Reason : get social media name and links
    path('<str:tenant>/social-links/',SocialLinksAPIView.as_view()),
    # End of getting social links

    # Added by Yuvraj Sahu on 27-05-23
    # Reason : update social media name and links
    path('<str:tenant>/social-links/<int:id>',SocialLinksAPIView.as_view()),
    # End of updating social links
    
      # Added by :- Rohan Kansari on 28-05-2023
    # Reason : post api for order report query data
    path('<str:tenant>/all-order-report-query/',OrderFilterAPIView.as_view()),
    # End of added code by :- Rohan Kansari on 28-05-2023

     # Added by :- Rohan Kansari on 28-05-2023
    # Reason : post api for reservations data
    path('<str:tenant>/all-order-item-report-query/',OrderItemFilterAPIView.as_view()),
    # End of added code by :- Rohan Kansari on 28-05-2023

    # Commented by - Ashish Dewagnan on 04-06-2023
    # Reason - No need to get setting  by Id
    # Added by - Ashish Dewangan on 02-06-2023
    # Reason - To get Setting details by id
    # path('<str:tenant>/app-theme-by-id/<int:settingId>',AppThemeByIdAPI.as_view()),
    # End of code addition by Ashish Dewangan. reason - To get Setting details by id
    # End of comment by - Ashish Dewangan

    # Added by Dewangan on 05-06-23
    # Reason : To get count of customers.
    path('<str:tenant>/customers-count/',CustomerAPI.as_view()),
    # End of code addition by - Ashish Dewangan on 05-06-2023
    # Reason : To get count of customers. 

    # Added by Dewangan on 05-06-23
    # Reason : To get list of customers.
    path('<str:tenant>/customer-list/',CustomerAPI.as_view()),
    # End of code addition by - Ashish Dewangan on 05-06-2023
    # Reason : To get list of customers. 

    # Added by :- Parineeta Gedam on 26-05-2023
    # Reason : get api for reservations data
    path('<str:tenant>/get_reservations_list/',GetReservationsAPIView.as_view()),
    # End of added code by :- Parineeta Gedam on 26-05-2023

    # Added by :- Parineeta Gedam on 26-05-2023
    # Reason : get api for reservations list
    path('<str:tenant>/get_billing_data/',GetBillingDataAPIView.as_view()),
    # End of added code by :- Parineeta Gedam on 26-05-2023

    # Added by Parineeta Gedam on 04-06-23
    # Reason : update the reservation data used in react native
    path('<str:tenant>/update-reservation/',UpdateReservationAPI.as_view()),
    # End of addition

    # Added by Dewangan on 12-06-23
    # Reason : To get count of menu.
    path('<str:tenant>/menu-count/',MenuAPI.as_view()),
    # End of code addition by - Ashish Dewangan on 12-06-2023
    # Reason : To get count of menu. 

    # Added by Dewangan on 12-06-23
    # Reason : To get list of menu.
    path('<str:tenant>/menu-list-v2/',MenuAPI.as_view()),
    # End of code addition by - Ashish Dewangan on 12-06-2023
    # Reason : To get list of menu. 

    # Added by - Ashish Dewangan on 15-06-2023
    # Reason - To get menu details by id
    path('<str:tenant>/menu-details/<int:menuId>',MenuDetailsAPI.as_view()),
    # End of code addition by Ashish Dewangan. reason - To get menu details by id

    # Added by - Ashish Dewangan on 16-06-2023
    # Reason - To save menu details
    path('<str:tenant>/menu-details/',MenuDetailsAPI.as_view()),
    # End of code addition by Ashish Dewangan. reason - To save menu details
    
    # Added by Yuvraj Sahu on 16-06-23
    # Reason : To get count of category.
    path('<str:tenant>/category-count/',CategoryAPI.as_view()),
    # End of code addition by - Yuvraj Sahu on 16-06-2023
    # Reason : To get count of category.  

    # Added by Yuvraj Sahu on 16-06-23
    # Reason : To get list of category.
    path('<str:tenant>/category-list-v2/',CategoryAPI.as_view()),
    # End of code addition by - Yuvraj Sahu on 16-06-2023
    # Reason : To get list of category.

    # Added by - Yuvraj Sahu on 17-06-2023
    # Reason - To get category details by id
    path('<str:tenant>/category-details/<int:categoryId>',CategoryDetailsAPI.as_view()),
    # End of code addition by Yuvraj sahu. reason - To get category details by id

    # Added by - Yuvraj Sahu on 17-06-2023
    # Reason - To save category details
    path('<str:tenant>/category-details/',CategoryDetailsAPI.as_view()),
    # End of code addition by Yuvraj Sahu. reason - To save category details

    # Added by Yuvraj Sahu on 17-06-23
    # Reason : get menus details
    path('<str:tenant>/get-menus/',GetMenusAPI.as_view()),
    # End of getting menus

    # Added by Yuvraj Sahu on 23-06-23
    # Reason : To get count of items.
    path('<str:tenant>/item-count/',ItemAPI.as_view()),
    # End of code addition by - Yuvraj Sahu on 23-06-2023
    # Reason : To get count of item.  

    # Added by Yuvraj Sahu on 23-06-23
    # Reason : To get list of item.
    path('<str:tenant>/item-list-v2/',ItemAPI.as_view()),
    # End of code addition by - Yuvraj Sahu on 23-06-2023
    # Reason : To get list of item.

    # Added by - Yuvraj Sahu on 23-06-2023
    # Reason - To get item details by id
    path('<str:tenant>/item-details/<int:itemId>',ItemDetailsAPI.as_view()),
    # End of code addition by Yuvraj sahu. reason - To get item details by id

    # Added by - Yuvraj Sahu on 23-06-2023
    # Reason - To save item details
    path('<str:tenant>/item-details/',ItemDetailsAPI.as_view()),
    # End of code addition by Yuvraj Sahu. reason - To save item details

    # Added by Yuvraj Sahu on 23-06-23
    # Reason : get categories details
    path('<str:tenant>/get-categories/',GetCategoryAPI.as_view()),
    # End of getting categories
    

    # Added by Om Shrivastava on 14-06-23
    # Reason: When user apply rating than show rating and review
    path('<str:tenant>/rating-review/',RatingReviewAPI.as_view()),
    # End of addition by Om Shrivastava on 14-06-23

    # Added by Om Shrivastava on 15-06-23
    # Reason : To get count of order 
    path('<str:tenant>/order-count/',OrderAPI.as_view()),
    # End of code addition by - Om Shrivastava on 15-06-23
    # Reason : To get count of order 

    # Added by Om Shrivastava on 15-06-23
    # Reason : To get list of order.
    path('<str:tenant>/order-list-v2/',OrderAPI.as_view()),
    # End of code addition by - Om Shrivastava on 15-06-23
    # Reason : To get list of order.

    # Added by Om Shrivastava on 16-06-23
    # Reason : get order details
    path('<str:tenant>/order-details/',OrderDetailAPIView.as_view()),
    # End of getting social links

    # Added by Om Shrivastava on 16-06-23
    # Reason : update order details
    path('<str:tenant>/order-details/<int:id>',OrderDetailAPIView.as_view()),
    # End of updating social links

    # Added by Om Shrivastava on 26-06-23
    # Reason : get order item details
    path('<str:tenant>/order-item-details/',GetAllOrderItemAPI.as_view()),
    # End of get order item details

    # Added by Om Shrivastava on 26-06-23
    # Reason : get order item details for searching, sorting, pagination
    path('<str:tenant>/order-item-list-v2/',GetAllOrderItemAPI.as_view()),
    # End of code addition by - Om shrivastava 26-06-2023
    # Reason : To get order item details for searching, sorting, pagination
]   