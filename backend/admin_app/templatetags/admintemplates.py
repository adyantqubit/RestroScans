#Created by Om Shrivastava on 07-01-2023
#Reason - To show Revenue, todays orders, pending orders on dashboard

from django import template
from tenant_app.models import *
from tenant_app.serializers import *
import datetime
from django.utils.timezone import timedelta
from django.db.models.functions import TruncMonth
from django.db.models import Sum
from backend.config import * 

register = template.Library()

@register.simple_tag(takes_context=True)
def getQRCodePath(context):
    from django.conf import settings
    from admin_app.models import Tenant,RestaurantRequest
    request=context['request']
    data = dict()
    host=request.headers['Host'].split(":")
    path= settings.HTTP_METHOD+request.headers['Host']+'/media/'+host[0] +'/images/qrcode/qr.svg'
    data["path"] = path
    if settings.DOMAIN_NAME != host[0].split(".")[0] :
        tenant=Tenant.objects.get(tenant_name = host[0].split(".")[0])
        restaurantName =  RestaurantRequest.objects.get(mobile_number=tenant.restaurant_phone_number)
        data["tenant"] = restaurantName.restaurant_name
    else :
        data["tenant"] = "restroscans"
    return data


# Added by Yuvraj Sahu on 30-3-2023
# Reason - to send link in profile dropdown
@register.simple_tag(takes_context=True)
def getActiveMenuList(context):
    setdata = dict()
    totalCategories = Menu.objects.all().count()
    totalSubCategories = Category.objects.all().count()
    totalItems = Item.objects.all().count()
    setdata['totalCategories']= totalCategories
    setdata['totalSubCategories']= totalSubCategories
    setdata['totalItems']= totalItems
    return setdata
# End of addition


# Added by Yuvraj Sahu on 30-3-2023
# Reason - to send link in profile dropdown
@register.simple_tag(takes_context=True)
def getProfileLink(context):
    from django.conf import settings
    request=context['request']
    data = dict()
    host=request.headers['Host'].split(":")
    if settings.DOMAIN_NAME != host[0].split(".")[0] :
        path= settings.HTTP_METHOD+request.headers['Host']+'/django-admin/tenant_app/setting/'
    else :
        path= settings.HTTP_METHOD+request.headers['Host']+'/django-admin/admin_app/appsetting/'
    data["setting"] = path
    return data
# End of addition


# Added by Yuvraj Sahu on 30-3-2023
# Reason - to send link in profile dropdown
@register.simple_tag(takes_context=True)
def getInActiveCategories(context):
    from django.conf import settings
    request=context['request']
    host=request.headers['Host'].split(":")
    if settings.DOMAIN_NAME != host[0].split(".")[0] :
        categoryUrl= settings.HTTP_METHOD+request.headers['Host']+'/django-admin/tenant_app/menu/'
        subCategoryUrl= settings.HTTP_METHOD+request.headers['Host']+'/django-admin/tenant_app/category/'
        itemUrl= settings.HTTP_METHOD+request.headers['Host']+'/django-admin/tenant_app/item/'
    else :
        categoryUrl= "#"
        subCategoryUrl="#"
        itemUrl= "#"
    # data["setting"] = path
    inActiveMenu = dict()

    categoryMenu = dict()
    subCategoryMenu = dict()
    itemMenu = dict()

    inActiveCategories = Menu.objects.filter(is_active=False)
    inActiveSubCategories = Category.objects.filter(is_active=False)
    inActiveItems = Item.objects.filter(is_active=False)

    categoryMenu["categoryUrl"] = categoryUrl
    categoryMenu["inActiveCategories"] = inActiveCategories

    subCategoryMenu["subCategoryUrl"] = subCategoryUrl
    subCategoryMenu["inActiveSubCategories"] = inActiveSubCategories
   
    itemMenu["itemUrl"] = itemUrl
    itemMenu["inActiveItems"] = inActiveItems

    inActiveMenu["categoryMenu"] = categoryMenu
    inActiveMenu["subCategoryMenu"] = subCategoryMenu
    inActiveMenu["itemMenu"] = itemMenu

    return inActiveMenu
# End of addition


# Added by - Ashish Dewangan on 26-04-2023
# Reason - To show todays orders on dashboard
@register.simple_tag(takes_context=True)
def getTodaysOrders(context):
    from django.utils.timezone import timedelta
    from django.utils.timezone import datetime
    from django.db.models import Sum

    today=datetime.today().date()
    weekDay=today.weekday()
    startOfTheWeek=today - timedelta(days=weekDay)
    dayOfMonth=today.day
    startOfTheMonth=today - timedelta(days=(dayOfMonth-1))
    thisYear=today.year

    data=dict()

    summary=dict()
    totalOrders = Order.objects.filter(date__gte=today).count()
    summary["order_count"]=totalOrders
    # Modified by :- Parineeta Gedam on 12-05-2023 reason :- for re-calculations after add discount
    # revenue = Order.objects.filter(date__gte=today,payment_status='Completed').aggregate(Sum("total"))
    revenue = Order.objects.filter(date__gte=today,payment_status='Completed').aggregate(Sum("final_amount"))
    summary["total_revenue"]=revenue["final_amount__sum"]
    # End of modified code by :- Parineeta Gedam on 12-05-2023
    data["todays_summary"]=summary

    summary=dict()
    totalOrders = Order.objects.filter(date__gte=startOfTheWeek).count()
    summary["order_count"]=totalOrders
    # Modified by :- Parineeta Gedam on 12-05-2023 reason :- for re-calculations after add discount
    # revenue = Order.objects.filter(date__gte=startOfTheWeek,payment_status='Completed').aggregate(Sum("total"))
    revenue = Order.objects.filter(date__gte=startOfTheWeek,payment_status='Completed').aggregate(Sum("final_amount"))
    summary["total_revenue"]=revenue["final_amount__sum"]
    # End of modified code by :- Parineeta Gedam on 12-05-2023
    data["this_weeks_summary"]=summary

    summary=dict()
    totalOrders = Order.objects.filter(date__gte=startOfTheMonth).count()
    summary["order_count"]=totalOrders
    # Modified by :- Parineeta Gedam on 12-05-2023 reason :- for re-calculations after add discount
    # revenue = Order.objects.filter(date__gte=startOfTheMonth,payment_status='Completed').aggregate(Sum("total"))
    revenue = Order.objects.filter(date__gte=startOfTheMonth,payment_status='Completed').aggregate(Sum("final_amount"))
    summary["total_revenue"]=revenue["final_amount__sum"]
    # End of modified code by :- Parineeta Gedam on 12-05-2023
    data["this_months_summary"]=summary


    summary=dict()
    totalOrders = Order.objects.filter(date__year=thisYear).count()
    summary["order_count"]=totalOrders
    # Modified by :- Parineeta Gedam on 12-05-2023 reason :- for re-calculations after add discount
    # revenue = Order.objects.filter(date__year=thisYear,payment_status='Completed').aggregate(Sum("total"))
    revenue = Order.objects.filter(date__year=thisYear,payment_status='Completed').aggregate(Sum("final_amount"))
    summary["total_revenue"]=revenue["final_amount__sum"]
    # End of modified code by :- Parineeta Gedam on 12-05-2023

    data["this_years_summary"]=summary
    # Modified and added by Om on 06-05-23
    # Reason : Arrange the date than show in descending order
    # todays_newly_placed_orders=Order.objects.filter(date__gte=today,order_status='Placed')
    todays_newly_placed_orders=Order.objects.filter(date__gte=today,order_status='Placed').order_by('-date')
    # End of addition by Om on 06-05-23
    todays_newly_placed_orders_serializer=OrderSerializer(todays_newly_placed_orders, many=True)

    from django.db.models import Q
    # Modified and added by Om on 06-05-23
    # Reason : Arrange the date than show in descending order
    # todays_pending_orders=Order.objects.filter(~Q(order_status='Placed'),date__gte=today,payment_status='Pending')
    todays_pending_orders=Order.objects.filter(~Q(order_status='Placed'),date__gte=today,payment_status='Pending').order_by('-date')
    # End of addition by Om on 06-05-23
    todays_pending_orders_serializer=OrderSerializer(todays_pending_orders, many=True)

    # Modified and added by Om on 06-05-23
    # Reason : Arrange the date than show in descending order
    # todays_completed_orders=Order.objects.filter(date__gte=today,payment_status='Completed')
    todays_completed_orders=Order.objects.filter(date__gte=today,payment_status='Completed').order_by('-date')
    # End of addition by Om on 06-05-23
    todays_completed_orders_serializer=OrderSerializer(todays_completed_orders, many=True)

    from django.conf import settings
    http_method=settings.HTTP_METHOD
    request=context['request']
   
    return {
        "todays_pending_orders":todays_pending_orders,
        "revenue_details":data,
        "todays_newly_placed_orders":todays_newly_placed_orders,
        "todays_completed_orders":todays_completed_orders,
        "request":request,
        "http_method":http_method,
        # Added by Om Shrivastava on 07-05-23
        # Reason : Show the rupees sign from using another file
        'rupee_symbol':rupee_sign,
        # End of addition
    }

# End of code addition by Ashish Dewangan on 26-04-2023

# Added by - Om on 03-05-2023
# Reason - To divide total amount by quantity in receipt

@register.filter
def divide(value, arg):
    try:
        return float(value) / float(arg)
    except (ValueError, ZeroDivisionError):
        return None
# End of addition

# Added by - Om Shrivastava on 11-05-2023
# Reason - Create multiply method than use in receipt.html file.
   
@register.filter
def multiply(qty, unit_price, *args, **kwargs):
    # you would need to do any localization of the result here
    return qty * unit_price
# End of addition by Om Shrivastava 


# Added by ROhankansari -12/5/23
# Reason - TO split string
@register.filter(name='split')
def split(value, key):
    """
        Returns the value turned into a list.
    """
    return value.split(key)

# End of code Rohan kansari- 12/5/23