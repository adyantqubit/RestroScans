#Created by Om Shrivastava on 07-01-2023
#Reason - To show Revenue, todays orders, pending orders on dashboard

from django import template
from tenant_app.models import *
from tenant_app.serializers import *
import datetime
from django.utils.timezone import timedelta
from django.db.models.functions import TruncMonth
from django.db.models import Sum

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
        path= settings.HTTP_METHOD+request.headers['Host']+'/admin/tenant_app/setting/'
    else :
        path= settings.HTTP_METHOD+request.headers['Host']+'/admin/admin_app/appsetting/'
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
        categoryUrl= settings.HTTP_METHOD+request.headers['Host']+'/admin/tenant_app/menu/'
        subCategoryUrl= settings.HTTP_METHOD+request.headers['Host']+'/admin/tenant_app/category/'
        itemUrl= settings.HTTP_METHOD+request.headers['Host']+'/admin/tenant_app/item/'
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