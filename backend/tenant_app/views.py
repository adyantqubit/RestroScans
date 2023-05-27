from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from admin_app.models import *
from .serializers import *
from django.http import HttpResponse
# import os
# GTK_FOLDER = r'C:\Program Files\GTK3-Runtime Win64\bin'
# os.environ['PATH'] = GTK_FOLDER + os.pathsep + os.environ.get('PATH', '')
from weasyprint import HTML , CSS
import io
from django.template.loader import get_template
from admin_app.models import RestaurantRequest
import datetime
from django.utils.timezone import timedelta
# from django.utils.timezone import datetime
from backend.config import * 

"""
Added by - Ashish Dewangan on 08-02-2023
Reason - To get menu
"""

# Added by Om on 16-02-23
# Reason : Show the Tenant APIView
class TenantAPIView(APIView):
    def get(self,request,tenant):
        from admin_app.models import Tenant
        from admin_app.serializers import TenantListSerializer
        tenant=Tenant.objects.get(tenant_name=tenant)
        try:
            visitCount=VisitCount.objects.get(tenant_name=tenant)
        except visitCount.DoesNotExist:
               visitCount=visitCount()
        visitCount.count=visitCount.count+1
        visitCount.save()
        tenantListSerializer=TenantListSerializer(tenant)
        
        
        # Added by rohan - 18/4/23
        # reason - to save send all subscribe features
        provided_features=[]
        if tenantListSerializer.data['Subscribe_plan'] is not None:
          plan= Plans.objects.get(id=tenant.Subscribe_plan.id)
          features=PlannedFeatures.objects.filter(plan_selected=plan)
          for feature in features:
              provided_features.append(feature.feature_selected.feature_name)
              
        else:
            provided_features.append("menu view")   
           
        print("features----------------------------",provided_features) 
        
        # End of code - Rohan - 18/4/23  
        return Response({
            "msg":"success",
            "tenantDetails":tenantListSerializer.data,
            "features_provided":provided_features
            })
# End of addition


# added by rohan - 13/4/23
# reason- to get top 10 best product
# Modification and commented by Om Shrivastava on 19-05-23
# Reason : Show only bestseller checkbox option  
def getBestproduct():
    allItems = OrderItem.objects.all()
    tempSort = []
    # for sortItem in sort:
    #updated by rohan - 15/4/23
    #reason - We apllied try catch here if item not found and handling rating error also
    for item in allItems:
        try:
            itemObj = Item.objects.get(id=item.item_id.id)
            if {"item": itemObj} in tempSort:
                pass
            else:
                tempSort.append({
                    "item": itemObj
                })
        except:
            tempSort=[]   
            
    #Added by rohan-16/4/23
    # reason- To get all admin selected best seller first this will go then after rated item will append
    
    bestProducts=Item.objects.filter(best_seller=True)
    bests=[]
    for best in bestProducts:
        bests.append({
            "item":best.id,
            # "rating":5.0
        })
    
    sortedData = bests
    # end of code - 16/4/23
    # for item in tempSort:
    #     OneProductRating = OrderItem.objects.filter(item_id=item['item'])
    #     rating = []
    #     for orderItem in OneProductRating:
    #         if orderItem.rating is not None:
    #             rating.append(float(orderItem.rating))

        # added by rohan - 15/4/23
        # Reason - To solve rating devide by zero issue
        # if rating.__len__() !=0:
        #     sortedData.append(
        #         {
        #             "item": item['item'].id,
        #             "rating": sum(rating)/float(rating.__len__()),
        #             # "count":rating.__len__()
        #         }
        # )

    # list = sorted(sortedData, key=lambda k: k['rating'], reverse=True)
    # Modification and addition by Om Shrivastava on 19-05-23
    # Reason : Show only bestseller checkbox option 
    # return list[:10]
    return bests[:10]
    # End of modification and addition by Om shrivastava on 19-05-23
# End of modification and commented by Om Shrivastava on 19-05-23
# end of code 13/4/23


class MenuAPIView(APIView):
    def get(self,request,tenant):
        print('gfagfgf', tenant)
        menuList=Menu.objects.all().order_by('name')
        var = menuList.filter(is_active = True) 
        menuData = MenuListSerializer(var, many =True)

        categoryList=Category.objects.filter(is_active=True, menu__is_active=True).order_by('name')
        categoryListSerializer=CategoryListSerializer(categoryList,many=True)

        # itemList=Item.objects.all().order_by('name')
        itemList=Item.objects.filter(is_active=True, category__menu__is_active=True,category__is_active=True).order_by('name')
        itemListSerializer=ItemListSerializer(itemList,many=True)

        # Commented by Om on 16-02-23
        # from admin_app.models import Tenant
        # from admin_app.serializers import TenantListSerializer
        # tenant=Tenant.objects.get(tenant_name=tenant)
        # tenantListSerializer=TenantListSerializer(tenant)
        # End of comment code

        # Added by rohan -13/4/23
        # reason- To send top product list
        list = getBestproduct()
        return Response({
            "msg":"success",
            # Commented by Om
            # "tenantDetails":tenantListSerializer.data,
            # End of commented code
            "menuList":menuData.data,
            # "menuList":menuListSerializer.data,
            "categoryList": categoryListSerializer.data,
            "itemList": itemListSerializer.data,
            "top_product": list

        })
    #end of code- rohan - 13/4/23
    # Added by Yuvraj Sahu on 23-3-2023
    # Reason - to save menu
    def post(self,request,tenant):
        print(request.data)
        serializedData = MenuListSerializer(data=request.data)
     
        if serializedData.is_valid():
            serializedData.save()
            return Response({"msg": "Saved Successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of addition

    # Added by Yuvraj Sahu on 6-4-2023
    # Reason - to update menu
    def put(self, request,tenant, pk):
        id = pk
        print("update method",request.data)
        # Added by Yuvraj Sahu on 7-4-2023
        # reason - to get updated menu category and item
        menuList=Menu.objects.all().order_by('name')
        menuData = MenuListSerializer(menuList, many =True)
        categoryList=Category.objects.all().order_by('name')
        categoryListSerializer=CategoryListSerializer(categoryList,many=True)
        itemList=Item.objects.all().order_by('name')
        itemListSerializer=ItemListSerializer(itemList,many=True)
        
        menuObj = Menu.objects.get(id = id)
        serializedData = MenuListSerializer(menuObj, data=request.data)
        if serializedData.is_valid(raise_exception=True):
            serializedData.save()
            # return Response({"msg":"Updated"}, status=status.HTTP_201_CREATED)
            return Response({
                "msg": "Updated Successfully",
                "menuList": menuData.data,
                "categoryList": categoryListSerializer.data,
                "itemList": itemListSerializer.data
            })
            # End of addition
        return Response({"error":serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of addition
    
    # Added by Om on 06-04-23
    # Reason - to delete the menu
    def delete(self, request,tenant, pk):
        id = pk
        menu = Menu.objects.get(id=id)
        if menu :
            menu.delete()
            return Response({"msg": "Deleted Successfully"}, 200)
        return Response({"error": "error"}, 404)
    # End of addition

"""
End of code addition
"""

class CategoryAPIView(APIView):
    # def get(self,request,tenant):
    #     categoryList=Category.objects.all()
    #     categoryListSerializer=CategoryListSerializer(categoryList,many=True)
    #     return Response({"msg":"success","categoryList":categoryListSerializer.data})

    # Added by Yuvraj Sahu on 23-3-2023
    # Reason - to save category
    def post(self,request,tenant):
        print(request.data)
        serializedData = CategorySaveSerializer(data=request.data)
        if serializedData.is_valid():
            serializedData.save()
            return Response({"msg": "Saved Successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of addition

    # Added by Yuvraj Sahu on 6-4-2023
    # Reason - to update category
    def put(self, request,tenant, pk):
        id = pk
        print("update method",request.data)
        # Added by Yuvraj Sahu on 7-4-2023
        # reason - to get updated menu category and item
        menuList=Menu.objects.all().order_by('name')
        menuData = MenuListSerializer(menuList, many =True)
        categoryList=Category.objects.all().order_by('name')
        categoryListSerializer=CategoryListSerializer(categoryList,many=True)
        itemList=Item.objects.all().order_by('name')
        itemListSerializer=ItemListSerializer(itemList,many=True)
        # End of addition
        categoryObj = Category.objects.get(id = id)
        serializedData = CategorySaveSerializer(categoryObj, data=request.data)
        if serializedData.is_valid(raise_exception=True):
            serializedData.save()
            return Response({
                "msg": "Updated Successfully",
                "menuList": menuData.data,
                "categoryList": categoryListSerializer.data,
                "itemList": itemListSerializer.data
            })
            # End of addition
        return Response({"error":serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of addition

    # Added by Om on 06-04-23
    # Reason - to delete the category
    def delete(self, request,tenant, pk):
        id = pk
        category = Category.objects.get(id=id)
        if category :
            category.delete()
            return Response({"msg": "Deleted Successfully"}, 200)
        return Response({"error": "error"}, 404)
    # End of addition
    
class ItemAPIView(APIView):
    def get(self,request,tenant):
        itemList=Item.objects.all()
        itemListSerializer=ItemListSerializer(itemList,many=True)
        return Response({"msg":"success","menuList":itemListSerializer.data})

    # Added by Yuvraj Sahu on 23-3-2023
    # Reason - to save item
    def post(self,request,tenant):
        print(request.data)
        serializedData = ItemSaveSerializer(data=request.data)
        if serializedData.is_valid():
            serializedData.save()
            return Response({"msg": "Saved Successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of addition

    # Added by Yuvraj Sahu on 6-4-2023
    # Reason - to update item
    def put(self, request,tenant, pk):
        id = pk
        print("update method",request.data)
        itemObj = Item.objects.get(id = id)
        serializedData = ItemSaveSerializer(itemObj, data=request.data)
        if serializedData.is_valid(raise_exception=True):
            serializedData.save()
            return Response({"msg": "Updated Successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of addition
    
    # Added by Om on 06-04-23
    # Reason - to delete the items
    def delete(self, request,tenant, pk):
        id = pk
        item = Item.objects.get(id=id)
        if item :
            item.delete()
            return Response({"msg": "Deleted Successfully"}, 200)
        return Response({"error": "error"}, 404)
    # End of addition

# Added by Om on 01-03-23
# Reason : Show the Offer details
class OfferAPIView(APIView):
    def get(self,request,tenant):
        print('gfagfgf', tenant)
        offerBanner=Offer.objects.all()
        offerbannerSerializer=OfferBannerSerializer(offerBanner,many=True)
        # offerItemList=OfferItem.objects.all()
        offerItemList=OfferItem.objects.filter(item_name__is_active=True, item_name__category__is_active=True,item_name__category__menu__is_active=True)
        offeritemsSerializer=OfferItemsSerializer(offerItemList,many=True)

        return Response({
            "msg":"success",
            "offerBanner":offerbannerSerializer.data,
            "offerItemList":offeritemsSerializer.data,
            })
    
    # Added by Om on 9-4-2023
    # Reason - to save banner details
    def post(self,request,tenant):
        print(request.data)
        serializedData = OfferBannerSerializer(data=request.data)
     
        if serializedData.is_valid():
            serializedData.save()
            return Response({"msg": "Banner/Offer Added Successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of addition

    # Added by Om on 6-4-2023
    # Reason - to update offer name
    def put(self, request,tenant, pk):
        id = pk
        print("update method",request.data)
        offerBanner=Offer.objects.all()
        offerbannerSerializer=OfferBannerSerializer(offerBanner,many=True)
        # offerItemList=OfferItem.objects.all()
        offerItemList=OfferItem.objects.filter(item_name__is_active=True, item_name__category__is_active=True,item_name__category__menu__is_active=True)
        offeritemsSerializer=OfferItemsSerializer(offerItemList,many=True)
        
        offerObj = Offer.objects.get(id = id)
        serializedData = OfferBannerSerializer(offerObj, data=request.data)
        if serializedData.is_valid(raise_exception=True):
            serializedData.save()
            return Response({
                "msg": "Updated Successfully",
                "offerBanner": offerbannerSerializer.data,
                "offerItemList": offeritemsSerializer.data,
            })
        return Response({"error": "Something Went Wrong"}, status=status.HTTP_400_BAD_REQUEST)
    # End of addition

    def delete(self, request,tenant, pk):
        id = pk
        category = Offer.objects.get(id=id)
        if category :
            category.delete()
            return Response({"msg": "Deleted Successfully"}, 200)
        return Response({"error": "error"}, 404)

# End of addition

# Added by Om on 08-04-23
# Reason : Show the Offer items details
class OfferItemsAPIView(APIView):
    def get(self,request,tenant):
        print('gfagfgf', tenant)
        offerItemList=OfferItem.objects.filter(item_name__is_active=True, item_name__category__is_active=True,item_name__category__menu__is_active=True)
        offeritemsSerializer=OfferItemsSerializer(offerItemList,many=True)

        return Response({
            "msg":"success",
            "offerItemList":offeritemsSerializer.data,
            })
    
    def post(self,request,tenant):
        print(request.data)
        serializedData = OfferallItemsSerializer(data=request.data)
     
        if serializedData.is_valid():
            serializedData.save()
            return Response({"msg": "Banner/Offer Item Added Successfully"}, status=status.HTTP_201_CREATED)
        # Modification by Om on 14-04-23
        # Reason : Chagne the error method
        # Added by Yuvraj Sahu on 07-05-2023
        # Reason - to remove bad request error 
        # return Response({"error":"Banner/Offer with this item name already exists"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error":"Banner/Offer with this item name already exists"}, status=status.HTTP_200_OK)
        # End of addition by Yuvraj Sahu on 07-05-2023
        # End of moodification
    # End of addition

    def put(self, request,tenant, pk):
        id = pk
        print("update method",request.data)
        itemObj = OfferItem.objects.get(id = id)
        serializedData = OfferallItemsSerializer(itemObj, data=request.data)
        if serializedData.is_valid(raise_exception=True):
            serializedData.save()
            return Response({"msg": "Updated Successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": "This item already exist with other offer"}, 400)

    def delete(self, request, tenant, pk):
        id = pk
        category = OfferItem.objects.get(id=id)
        if category :
            category.delete()
            return Response({"msg": "Deleted Successfully"}, 200)
        return Response({"error": "error"}, 404)
# End of addition

# Added by Om on 11-03-23
# Reason : Show the footer and description details
class FooterandDescriptionAPIView(APIView):
    def get(self,request,tenant):
        print('gfagfgf', tenant)
        # footer=Footer.objects.all()
        # footerSerializer=FooterSerializer(footer,many=True)
        descriptionList=Description.objects.all()
        descriptionSerializer=DescriptionSerializer(descriptionList,many=True)

        return Response({
            "msg":"success",
            # "footer":footerSerializer.data,
            "descriptionList":descriptionSerializer.data,
            })
    
# End of addition

# Added by Om on 11-03-23
# Reason : Show the footer and description details
class SettingAPIView(APIView):
    def get(self,request,tenant):
        setting=Setting.objects.last()
        if setting is not None:
           settingSerializer=SettingSerializer(setting)
           return Response({
            "msg":"success",
            "setting":settingSerializer.data,
            })
        else:
            settingSerializer={"data":0}
            return Response({
                "msg":"no data",
                "setting":{},
                })
    
    def post(self,request,tenant):
        if "id" in request.data :
            obj = Setting.objects.get(id=request.data["id"])
            serial = SettingSerializer(obj, data=request.data)
        else :
            serial = SettingSerializer(data=request.data)
        if serial.is_valid():
            serial.save()
            return Response({
                "msg": "Updated Successfully",
                "settingsetdata": serial.data,
            }, status=status.HTTP_201_CREATED)
        return Response({"error": serial.errors}, status=status.HTTP_400_BAD_REQUEST)
# End of addition


# Added by Yuvraj Sahu on 6-4-2023
# Reason - to get active and inactive menu,
# category and item for restaurant (tenant)
class getAllMenusAPI(APIView):
    def get(self,request,tenant):
        menuList=Menu.objects.all().order_by('name')
        menuData = MenuListSerializer(menuList, many =True)
        categoryList=Category.objects.all().order_by('name')
        categoryListSerializer=CategoryListSerializer(categoryList,many=True)
        itemList=Item.objects.all().order_by('name')
        itemListSerializer=ItemListSerializer(itemList,many=True)

        return Response({
            "msg":"success",
            "menuList":menuData.data,
            "categoryList":categoryListSerializer.data,
            "itemList":itemListSerializer.data
            })
# End of getting active and inactive

# Added by :- Parineeta Gedam
# Date :- 06-04-2023
# Reason : method for generate order no
def orderNoGeneration(tenant):
    order_number = tenant
    order_number_prefix = order_number[:3]
    value = 100001

    if  Order.objects.all().last() is not None:
        last_order_obj= Order.objects.all().last()
        lastOrderNum = last_order_obj.order_id
        increasedOrderNum = int(lastOrderNum[3:9])+1
        newOrderNum= order_number_prefix + str(increasedOrderNum)
        return newOrderNum
    else :
        orderNum = order_number_prefix+str(value)
        return orderNum
# End of added code 06-04-2023
    
# Added by :- Parineeta Gedam
# Date :- 06-04-2023
# Reason : method for save the cart item in order table


def orderCreation(tenant, request):

    # Save cart item in Order table
    order_no = orderNoGeneration(tenant)
    cartData = dict()

    # setting order id , customer id (foreing key), and table no
    cartData['order_id'] = order_no
    customer_id = CustomerDetail.objects.get(
        contact_number=request.data['contact_number'])
    cartData['customer_id'] = customer_id.id
    cartData['table_number'] = request.data['table_number']

    itemsPrice = []
    allOffer = OfferItem.objects.all()

    # loop to getting offered or non offered price to get subtotal
    for cart in request.data['cart']:
        item = Item.objects.get(id=cart['id'])
        discounted = 0
        if allOffer.filter(item_name=item).count() > 0:
            # Modified by Rohan Kansari - 11/5/23
            # Reason - If discount is none then do nothing
            if allOffer.get(item_name=item).offer_name.discount is not None:
               discounted = allOffer.get(item_name=item).offer_name.discount
        if (cart['serve_size'] == "Half Plate"):
            # Added by Rohan kansari -  1/5/23
            # Reason - becuase discount is throwing issue if discount is not in float
            price = float(item.price_half)*float(cart['quantity']) - float(
                item.price_half * cart['quantity']/100)* float(discounted)
        else:
            # Added by Rohan kansari -  1/5/23
            # Reason - becuase discount is throwing issue if discount is not in float
            price = float(item.price_full)*float(cart['quantity'])-float(
                item.price_full * cart['quantity']/100)*float(discounted)

        itemsPrice.append(price)

    # cartData['sub_total'] = float("{:.2f}".format(sum(itemsPrice)))
    cartData['sub_total'] =round(float("{:.2f}".format(sum(itemsPrice))),2)

    # Commented by :- Parineeta Gedam on 24-05-2023 
    # tax = Setting.objects.first()

    # if tax is not None:

    #     # Modified by :- Parineeta Gedam
    #     if tax.sgst is None:
    #         tax.sgst = 0
    #     if tax.cgst is None:
    #         tax.cgst = 0
    #     # End of modified code

    #     # added by rohan-14/4/23 to save tax on cgst and scgt
    #     # cartData['tax'] = (sum(itemsPrice)*(tax.tax))/100
    #     cartData['cgst'] =round(float("{:.2f}".format((sum(itemsPrice)*(tax.cgst))/100)),2)
    #     cartData['sgst'] = round(float("{:.2f}".format((sum(itemsPrice)*(tax.sgst))/100)),2)
    #     # end of addition
    #     gst = cartData['cgst']+cartData['sgst']
    #     cartData['total'] = round(float("{:.2f}".format((gst + sum(itemsPrice)))),2)

    # else:
    #     # cartData['tax'] = 0
    #     # added by rohan -14/4/23
    #     # reason- to remove tax field with cgst and sgst no.
    #     cartData['cgst'] = 0
    #     cartData['sgst'] = 0
    #     # end of code
    #     cartData['total'] =round( float("{:.2f}".format((sum(itemsPrice)))),2)
    # End of commented code 

    orderSerializer = OrderSerializer(data=cartData)
    order_obj = 0

    if orderSerializer.is_valid(raise_exception=True):
        order_obj = orderSerializer.save()

    return {"order_obj": order_obj, "orderSerializer": orderSerializer}
    # End of added code 06-04-2023 by :- Parineeta Gedam on 24-05-2023 

# Added by :- Parineeta Gedam
# Date :- 06-04-2023
# Reason : method for save the cart item in order Items table


def orderItemsCreation(request, order_obj):

    # save cart item in Order Item Table
    cartItem = []
    allOffer = OfferItem.objects.all()

    for cart in request.data['cart']:
        cartData = dict()

        item = Item.objects.get(id=cart['id'])
        discounted = 0
        if allOffer.filter(item_name=item).count() > 0:
            # Modified by Rohan Kansari - 11/5/23
            # Reason - If discount is none then do nothing
            if allOffer.get(item_name=item).offer_name.discount is not None:
               discounted = allOffer.get(item_name=item).offer_name.discount
        cartData["item_id"] = item.id
        cartData['order_id'] = order_obj.id
        cartData['item'] = cart['name']
        
        # Commented by :- Parineeta gedam on 22-04-2023
        # cartData['serving_size'] = cart['serve_size']
        # End of added code on 22-04-2023

        # Added by :- Parineeta Gedam on 22-04-2023
        if (cart['serve_size'] == "Half Plate"):
            cartData['serving_size'] = "Half"
        else :
            cartData['serving_size'] = "Full"
        # End of added code on 22-04-2023

        cartData['quantity'] = cart['quantity']

        # Commented by :- Parineeta gedam
        # if (cart['serve_size'] == "Half Plate"):
        #     cartData['price'] = float(
        #         item.price_half) - float(item.price_half/100)*discounted
        # else:
        #     cartData['price'] = float(
        #         item.price_full)-float(item.price_full/100)*discounted
        # End of added code
         
        # Modified by :- Parineeta Gedam on 21-04-2023
        if (cart['serve_size'] == "Half Plate"):
            # Added by Rohan kansari -  1/5/23
            # Reason - becuase discount is throwing issue if discount is not in float
            cartData['price'] = float(
                item.price_half * cart['quantity']) - float(item.price_half * cart['quantity']/100)* float(discounted)
        else:
            cartData['price'] = float(
                item.price_full * cart['quantity'])-float(item.price_full * cart['quantity']/100)*float(discounted)
            # End of code - ROhan kansari - 1/5/23
        # End of added code

        cartItem.append(cartData)

    orderItemSerializer = OrderItemSerializer(data=cartItem, many=True)
    if orderItemSerializer.is_valid(raise_exception=True):
        orderItemSerializer.save()

    return {"orderItemSerializer": orderItemSerializer}

# End of added code 06-04-2023

# Added by :- Parineeta Gedam
# Date :- 06-04-2023
# Reason : method for get data in frontend

# modified by :- Parineeta gedam on 15-04-2023


def responseDataCreation(order, orderItems, cutomer, setting):
    return {
        "customer": CustomerDetailSerializer(cutomer).data,
        "order_details": order,
        "order_items": orderItems,
        "setting_data" : setting,
    }
# End of added code 06-04-2023

# Added by :- Parineeta Gedam
# Date :- 06-04-2023
# Reason : API for save the customer Details in customerDetails Table, save the order in Order table and save the order Item in Order Item table.


class PostCustomerDetailsAPIView(APIView):
    def post(self, request, tenant):
        # Added by - Ashish Dewangan on 30-04-2023
        # Reason - To save phone number on FcmNotification table 
        try:
            fcmNotification=FcmNotification.objects.get(registration_id=request.data["fcmToken"])
            fcmNotification.phone_number=request.data["contact_number"]
            fcmNotification.save()
        except Exception as e:
            print("No token provided. Continue the flow")
        # End of code addition by Ashish Dewangan for phone number save to FcmNotification on 30-04-2023

        # try :
        try:
            # Commented by :- Parineeta Gedam
            # Date :- 14-04-2023
            # Reason :- multiple name and email should be save.

            # customerDetails = CustomerDetail.objects.get(contact_number = request.data['contact_number'])
            # print("contact")
            # if request.data["name"] in customerDetails.name.split(",") :
            #     pass
            # else :
            #     customerDetails.name = customerDetails.name + "," + request.data["name"]
            #     customerDetails.save()

            # End of commented code 14-04-2023

            # Added by :- Parineeta Gedam
            # Date :- 14-04-2023
            # Reason :- multiple email will be save.

            customerDetails = CustomerDetail.objects.get(
                contact_number=request.data['contact_number'])
            
            # Modified by :- Parineeta Gedam
            # Date :- 17-04-2023
            # Reason :- To save multiple name and email with comas.

            if request.data["name"] in customerDetails.name.split(","):
                pass
            else:
                if len(request.data["name"])>0:
                    if len(customerDetails.name) > 0 :
                        customerDetails.name = customerDetails.name + "," + request.data["name"]
                    else :
                        customerDetails.name = request.data["name"]
                    customerDetails.save()

            if request.data["email"] in customerDetails.email.split(","):
                pass
            else:
                if len(request.data["email"])>0:
                    if len(customerDetails.email) > 0 :
                        customerDetails.email = customerDetails.email + "," + request.data["email"]
                    else :
                        customerDetails.email = request.data["email"]
                    customerDetails.save()

            # Commented code :- Parineeta Gedam
            # Date :- 17-04-2023
            # Reason :- some changes in logic to save name and email

            # if request.data["name"] in customerDetails.name.split(","):
            #     if request.data["email"] in customerDetails.email.split(","):
            #         pass
            #     else:
            #         if len(request.data["email"])>0:
            #             customerDetails.email = customerDetails.email + "," + request.data["email"]
            #             customerDetails.save()

            # if request.data["email"] in customerDetails.email.split(","):
            #     if request.data["name"] in customerDetails.name.split(","):
            #         pass
            #     else:
            #         if len(request.data["name"])>0:
            #             customerDetails.name = customerDetails.name + "," + request.data["name"]
            #             customerDetails.save()

            # End of added code :- 14-04-2023

            # End of commented code on 17-04-2023

            # Modified by :- Parineeta Gedam
            customerDetails.last_customer_name = request.data['name']
            # Added by Yuvraj Sahu on 05-05-2023
            # Reason - to save latest email id of customer
            customerDetails.last_email = request.data['email']
            # End of addition by Yuvraj Sahu on 05-05-2023
            customerDetails.save()
            # End of added code 17-04-2023

        except:
            customerDetails = {
                # Added by :- Parineeta Gedam on 17-04-2023 
                # reason :- last customer name save.
                "last_customer_name" : request.data['name'],
                # End of added code on 17-04-2023
                "name": request.data['name'],
                "email": request.data['email'],
                "contact_number": request.data['contact_number'],
            }
            CustomerSerializer = CustomerDetailSerializer(data=customerDetails)
            if CustomerSerializer.is_valid():
                CustomerSerializer.save()

        orderValue = orderCreation(tenant, request)
        order_obj = orderValue['order_obj']
        orderSerializer = orderValue['orderSerializer']

        orderItem = orderItemsCreation(request, order_obj)
        orderItemSerializer = orderItem['orderItemSerializer']

        # Added by :- Parineeta Gedam on 17-05-2023 reason :- show cgst and sgst in ui
        settingSerializer = SettingSaveSerializer(Setting.objects.last())

        # Modified by :- Parineeta Gedam on 17-05-2023 
        # data = responseDataCreation(orderSerializer.data, orderItemSerializer.data, CustomerDetail.objects.get(
        #     contact_number=request.data['contact_number']) )
        data = responseDataCreation(orderSerializer.data, orderItemSerializer.data, CustomerDetail.objects.get(
            contact_number=request.data['contact_number']), settingSerializer.data )
        # End of Modified code by :- Parineeta Gedam on 17-05-2023

        return Response({"msg": "Saved Successfully", "data": data}, status=status.HTTP_201_CREATED)
    # except:
    #     return Response({"msg":"error"},status=status.HTTP_201_CREATED)
# End of added code 06-04-2023

# Added by :- Parineeta Gedam
# Date :- 10-04-2023
# Reason :- In order Item table update rating and review


class updateRatingAndReviewAPIView(APIView):

    def put(self, request, tenant):

        orderList = request.data['ItemRateReview']
        for order in orderList:
            orderObj = OrderItem.objects.get(id=order['id'])
            if 'rating' in order:
                orderObj.rating = order['rating']
            else:
                pass

            if order['review'] == "":
                orderObj.review = "-"
            else:
                orderObj.review = order['review']

            orderObj.save()

        # Added by ROhan kansari - 4/5/23
        # Reason -To save overall review also in order table 
        try: 
            order=Order.objects.get(order_id=request.data['order_id'])
            order.review=request.data['overallReview']
            order.save()
        except:
            pass    

        return Response({"msg": "success"}, status=status.HTTP_201_CREATED)
# End of added code 10-04-2023

# Added by :- Parineeta Gedam
# Date :- 10-04-2023
# Reason :- In order and order items table update cart data.

# Modified by :- Parineeta Gedam on 15-04-2023


class updateOrdersAPIView(APIView):

    def put(self, request, tenant):
        
        orderId = Order.objects.get(order_id=request.data['orders'])

        orderItem = orderItemsCreation(request, orderId)
        orderItemSerializer = orderItem['orderItemSerializer']

        orderItems = OrderItem.objects.filter(order_id=orderId)

        orderItemList = OrderItemSerializer(orderItems, many=True)

        itemsPrice = []
        allOffer = OfferItem.objects.all()

        # Modified by :- Parineeta Gedam on 24-05-2023 
        updatedOrderValues=dict()
        # loop to getting offered or non offered price to get subtotal
        for cart in orderItemList.data:
            if(cart['item_status'] != "Cancelled"):
                item = Item.objects.get(id=cart['item_id'])
                discounted = 0
                if allOffer.filter(item_name=item).count() > 0:
                    # Modified by Rohan Kansari - 11/5/23
                    # Reason - If discount is none then do nothing
                    if allOffer.get(item_name=item).offer_name.discount is not None:
                        discounted = allOffer.get(item_name=item).offer_name.discount
                    # Modified by:-  parineeta- 24/4/23
                    # Reason - We changed half plate to half string so, this if matching condition occurs  
                if (cart['serving_size'] == "Half"):
                    # Added by Rohan kansari -  1/5/23
                # Reason - becuase discount is throwing issue if discount is not in float
                    price = float(item.price_half)*float(cart['quantity']) - float(
                        item.price_half * cart['quantity']/100)*float(discounted)
                else:
                    # Added by Rohan kansari -  1/5/23
                # Reason - becuase discount is throwing issue if discount is not in float
                    price = float(item.price_full)*float(cart['quantity']) - float(
                        item.price_full * cart['quantity']/100)*float(discounted)

                itemsPrice.append(price)
        # orderId.sub_total = round(float("{:.2f}".format((sum(itemsPrice)))),2)
        updatedOrderValues['sub_total']=round(float("{:.2f}".format((sum(itemsPrice)))),2)
        # tax = Setting.objects.first()

        # if tax is not None:
        #     # commented by :- Parineeta Gedam on 16-04-2023
        #     # reason :- to save tax on cgst and scgt

        #     # orderId.tax= (sum(itemsPrice)*(tax.tax))/100
        #     # a = (sum(itemsPrice)*(tax.tax))/100
        #     # orderId.total = a + sum(itemsPrice)

        #     # End of commented code 16-04-2023

        #     # added by :- Parineeta Gedam on 16-04-2023
        #     # reason :- to save tax on cgst and scgt

        #     # Modified by :- Parineeta Gedam
        #     if tax.sgst is None:
        #         tax.sgst = 0
        #     if tax.cgst is None:
        #         tax.cgst = 0
        #     # End of modified code

        #     # modified by :- Parineeta Gedam
        #     cgst = (sum(itemsPrice)*(tax.cgst))/100
        #     sgst = (sum(itemsPrice)*(tax.sgst))/100
        #     a = (sum(itemsPrice)*(cgst))/100 + (sum(itemsPrice)*(sgst))/100

        #     # orderId.cgst = round(float("{:.2f}".format((sum(itemsPrice)*(tax.cgst))/100)),2)
        #     # orderId.sgst =round( float("{:.2f}".format((sum(itemsPrice)*(tax.sgst))/100)),2)
        #     # orderId.total = round(float("{:.2f}".format(orderId.sub_total+orderId.cgst+orderId.sgst)),2)

        #     # orderId.order_status = "Placed"

        #     updatedOrderValues['cgst'] = round(float("{:.2f}".format((sum(itemsPrice)*(tax.cgst))/100)),2)
        #     updatedOrderValues['sgst'] =round( float("{:.2f}".format((sum(itemsPrice)*(tax.sgst))/100)),2)
        #     updatedOrderValues['total'] = round(float("{:.2f}".format( updatedOrderValues['sub_total']+updatedOrderValues['cgst']+updatedOrderValues['sgst'])),2)
        #     updatedOrderValues['final_amount'] = round(float("{:.2f}".format( updatedOrderValues['sub_total']+updatedOrderValues['cgst']+updatedOrderValues['sgst'])),2)
        #     print("total===================",updatedOrderValues['total'])
        #     print("final_amount===================",updatedOrderValues['final_amount'])
        #     updatedOrderValues['order_status'] = "Placed"
        #     # End of commented code 16-04-2023

        # else:
        #     # commented by :- Parineeta Gedam on 16-04-2023
        #     # reason :- to save tax on cgst and scgt
        #     # orderId.tax = 0
        #     # orderId.total = sum(itemsPrice)
        #     # End of commented code 16-04-2023

        #     # added by :- Parineeta Gedam on 16-04-2023
        #     # reason :- to save tax on cgst and scgt

        #     # Modified by :- Parineeta Gedam
        #     # tax.cgst = 0
        #     # tax.sgst = 0
        #     # orderId.cgst = 0
        #     # orderId.sgst = 0
        #     # orderId.total =round( float("{:.2f}".format(sum(itemsPrice))),2)

        #     updatedOrderValues['cgst'] = 0
        #     updatedOrderValues['sgst'] = 0
        #     updatedOrderValues['total'] =round( float("{:.2f}".format(sum(itemsPrice))),2)
        #     updatedOrderValues['finl_amount'] =round( float("{:.2f}".format(sum(itemsPrice))),2)
        #     # End of commented code 16-04-2023

        # # commented by :- Parineeta Gedam on 19-05-2023
        # # orderId.save()
        updatedOrderValues['order_status'] = "Placed"
        orderserializer = OrderSerializer(orderId,data=updatedOrderValues,partial=True)
        try:
            if orderserializer.is_valid(raise_exception=True):
                orderserializer.save()
        except Exception as e:
            print("error----------------------------------------",e)
        # updatedOrder = Order.objects.filter(order_id=request.data['order']).update(sub_total=orderId.sub_total, cgst=orderId.cgst, sgst=orderId.sgst, total=orderId.total, final_amount=orderId.total)
        # orderserializer = Order.objects.filter(order_id=request.data['order']).values()[0]  
        # End of commented by :- Parineeta Gedam on 19-05-2023

        return Response({"orderItemSerializer": orderItemList.data, "order": orderserializer.data})
# End of added code 10-04-2023


"""
This method is created for getting 
all latest orders for app
"""
# Added by Yuvraj Sahu on 9-4-2023
# Reason - to get all orders


class getOrdersAPI(APIView):
    def get(self,request,tenant):
        allOrders = Order.objects.all().order_by("-date")
        # Modified by Yuvraj Sahu on 14-4-2023
        # Reason - to recieve customer name from serializers
        # ordersSerializer=OrderSerializer(allOrders, many=True)
        ordersSerializer=AllOrderSerializer(allOrders, many=True)
        # End of modification
        return Response ({"msg":"success", "allOrders": ordersSerializer.data})
# End of getting orders
"""
End of getting all orders
"""

"""
This method is created for getting 
all the items inside perticular order
note - this is for restaurant app
"""
# Added by Yuvraj Sahu on 9-4-2023
# Reason - to get all items inside the order
class getOrderItemsAPI(APIView):
    def get(self, request, tenant, pk):
        order = Order.objects.filter(id=pk).first()
        customerDetail =  CustomerDetail.objects.filter(id=order.customer_id.id).first()
        itemObjs = OrderItem.objects.filter(order_id=pk)
        orderItemsSerializer=OrderItemSerializer(itemObjs, many=True)
        customerSerializer=CustomerDetailSerializer(customerDetail)
        OrderSerializers = AllOrderSerializer(order)

        # Added by :- Parineeta Gedam on 25-05-2023 reason :- show cgst and sgst in ui
        settingSerializer = SettingSaveSerializer(Setting.objects.last())
        # End of Added code by :- Parineeta Gedam on 25-05-2023

        return Response ({
            "msg":"success",
            "orderItems": orderItemsSerializer.data,
            "customerDetail": customerSerializer.data,
            "orderDetail": OrderSerializers.data,
        # Added by :- Parineeta Gedam on 25-05-2023 reason :- show cgst and sgst in ui
            "settingData" : settingSerializer.data,
        # End of Added code by :- Parineeta Gedam on 25-05-2023
            })
# End of getting order items
"""
End of getting all orders
"""


# Added by Om shrivastava on 6-4-2023
# Reason - to get and post the app theme,
class AppThemeAPI(APIView):
    def get(self,request,tenant):
        # Modified by Yuvraj Sahu on 11-4-2023
        # Reason - to get and post valid data
        # theme=AppTheme.objects.all()
        # settingObj=Setting.objects.get(id=7)
        # themeSerializer=AppThemeSerializer(theme,many=True)
        # return Response({"msg":"success","themeData":themeSerializer.data})
        setting=Setting.objects.last()
        theme=AppTheme.objects.all()
        themeSerializer=AppThemeSerializer(theme,many=True)
        data=dict()
        
        if setting:
            settingSerializer=SettingSerializer(setting)
            data["setting"]=settingSerializer.data
        else:
            data["setting"]={}  

        if theme:
            themeSerializer=AppThemeSerializer(theme,many=True)
            data["themeOptions"]=themeSerializer.data
        else:
            data["themeOptions"]=[] 

        return Response({"msg":"success","setting":data["setting"],"themeOptions":data["themeOptions"]})
        # if setting or theme is not None:
        #    settingSerializer=SettingSerializer(setting)
        #    return Response({
        #     "msg":"success",
        #     "themeOptions": themeSerializer.data,
        #     "setting":settingSerializer.data,
        #     })
        # else:
        #     settingSerializer={"data":0}
        #     return Response({
        #         "msg":"no data",
        #         "themeOptions":[],
        #         "setting":{},
        #         })
    
    # def post(self,request,tenant):
    #     theme=AppTheme.objects.get(id=request.data["app_theme_id"])
    #     setting=Setting.objects.get(id=7)
    #     setting.app_theme=theme
    #     setting.save()
    #     return Response({"msg":"success"},200)
    def post(self,request,tenant):
        if "id" in request.data :
            obj = Setting.objects.get(id=request.data["id"])
            serial = SettingSaveSerializer(obj, data=request.data)
        else :
            serial = SettingSaveSerializer(data=request.data)
        if serial.is_valid():
            serial.save()
            return Response({
                "msg": "Saved Successfully",
                "settingsetdata": serial.data,
            }, status=status.HTTP_201_CREATED)
        return Response({"error": serial.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of modification
# End of addition

"""
Added by :- Parineeta Gedam 
Date - 11/04/2023
Reason - To add scanner
"""
# Added by yuvraj Sahu on 27-4-2023
# Reason - to save payment method from react native app
class getPaymentMethodAPIView(APIView):
    def get(self,request,tenant):
        content = PaymentMethod.objects.all()
        serializer = PaymentMethodSerializer(content, many=True)
        return Response(serializer.data)
    def post(self, request, tenant):
        print(request.data)
        if "id" in request.data:
            paymentMethod = PaymentMethod.objects.get(id=request.data["id"])
            serializedData = PaymentMethodSerializer(paymentMethod, data=request.data, partial=True)
            if serializedData.is_valid():
                serializedData.save()
                return Response({"msg": "Updated Successfully"}, status=status.HTTP_200_OK)
            return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializedData = PaymentMethodSerializer(data=request.data)
            if serializedData.is_valid():
                serializedData.save()
                return Response({"msg": "Saved Successfully"}, status=status.HTTP_201_CREATED)
            return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)


"""
End of added code
"""

# Added by :- Parineeta Gedam
# Date :- 10-04-2023
# Reason :- In order table update the payment mode['cash', 'scanner', 'card'].


class updatePaymentModeAPIView(APIView):

    def put(self, request, tenant):

        orderObj = Order.objects.filter(order_id=request.data['order_id'])
        # Modified by :- Parineeta Gedam on 24-05-2023
        # orderObj.payment_mode = request.data['payment_mode']
        paymentMode = request.data['payment_mode']
        paymentStatus = "Paid"
        orderObj.update(payment_mode = paymentMode, payment_status = paymentStatus)
        # End of modified code by :- Parineeta Gedam on 24-05-2023
        return Response({"msg": "success"}, 200)


# End of added code 10-04-2023

# Added by :- Parineeta Gedam
# Date :- 13-04-2023
# Reason : check payment status
class CheckPaymentStatusAPIView(APIView):
    def post(self, request, tenant):
        orderObj = Order.objects.get(order_id=request.data['order_id'])
        serializer = OrderSerializer(orderObj)
        # added by rohan- 14/4/23
        # reason to send all other detail of bill gstin number, fssai number, address from setting tabel and tenant tabel
        settingserailize = SettingSaveSerializer(Setting.objects.last())
        from admin_app.models import Tenant, RestaurantRequest
        tenant = Tenant.objects.get(tenant_name=tenant)
        tenant_detail = {
            "name": tenant.restaurant_name.restaurant_name,
            "address": tenant.restaurant_name.address
        }

        return Response({"order": serializer.data, "setting": settingserailize.data, "tenant": tenant_detail}, 200)
        # end of addition 14/4/23

# End of added code 13-04-2023

# Added by Rohan -13/4/23
# reason- Getting best seller top 10 item which is rated in orderItem as rating review


class BesttSellerAPI(APIView):
    def get(self, request, tenant):
        allItems = OrderItem.objects.all()
        tempSort = []
        # for sortItem in sort:
        for item in allItems:
            itemObj = Item.objects.get(id=item.item_id.id)
            if {"item": itemObj} in tempSort:
                pass
            else:
                tempSort.append({
                    "item": itemObj
                })

        sortedData = []
        for item in tempSort:
            OneProductRating = OrderItem.objects.filter(item_id=item['item'])
            rating = []
            for orderItem in OneProductRating:
                if orderItem.rating is not None:
                    rating.append(float(orderItem.rating))

            sortedData.append(
                {
                    "item": item['item'].id,
                    "rating": sum(rating)/float(rating.__len__()),
                    # "count":rating.__len__()
                }
            )

        list = sorted(sortedData, key=lambda k: k['rating'], reverse=True)

        return Response({"best_products": list[:10]})

    # sorting format
    #  sort=[
    #      {
    #          "item":"1",
    #          "list":[],
    #          "list_length":9
    #          },
    #      {
    #          "item":"3",
    #          "list":[],
    #          "list_length":5
    #      }
    #  ]

# End of code 13/4/23

# Added by - Ashish Dewangan on 09-04-2023
# Reason - to Dashboard data


class DashboardAPI(APIView):
    def get(self,request,tenant):
        from django.utils.timezone import timedelta
        from django.utils.timezone import datetime
        from django.db.models import Sum

        today=datetime.today().date()
        weekDay=today.weekday()
        startOfTheWeek=today - timedelta(days=weekDay)
        dayOfMonth=today.day
        startOfTheMonth=today - timedelta(days=(dayOfMonth-1))
        thisYear=today.year

        # Commented and modified by - Ashish Dewangan on 15-04-2023
        # Reason - To send data in a different way
        # data=[]
        
        # summary=[]
        # ordersCount=dict()
        # totalOrders = Order.objects.filter(date__gte=today).count()
        # ordersCount["title"]="Total orders of today"
        # ordersCount["value"]=totalOrders
        # summary.append(ordersCount)
        # totalRevenue=dict()
        # revenue = Order.objects.filter(date__gte=today,payment_status='Completed').aggregate(Sum("total"))
        # totalRevenue["title"]="Today's revenue"
        # totalRevenue["value"]=revenue["total__sum"]
        # summary.append(totalRevenue)
        # data.append(summary)

        # summary=[]
        # ordersCount=dict()
        # totalOrders = Order.objects.filter(date__gte=startOfTheWeek).count()
        # ordersCount["title"]="Total orders of this week"
        # ordersCount["value"]=totalOrders
        # summary.append(ordersCount)
        # totalRevenue=dict()
        # revenue = Order.objects.filter(date__gte=startOfTheWeek,payment_status='Completed').aggregate(Sum("total"))
        # totalRevenue["title"]="This week's revenue"
        # totalRevenue["value"]=revenue["total__sum"]
        # summary.append(totalRevenue)
        # data.append(summary)

        # summary=[]
        # ordersCount=dict()
        # totalOrders = Order.objects.filter(date__gte=startOfTheMonth).count()
        # ordersCount["title"]="Total orders of this month"
        # ordersCount["value"]=totalOrders
        # summary.append(ordersCount)
        # totalRevenue=dict()
        # revenue = Order.objects.filter(date__gte=startOfTheMonth,payment_status='Completed').aggregate(Sum("total"))
        # totalRevenue["title"]="This month's revenue"
        # totalRevenue["value"]=revenue["total__sum"]
        # summary.append(totalRevenue)
        # data.append(summary)

        # summary=[]
        # ordersCount=dict()
        # totalOrders = Order.objects.filter(date__year=thisYear).count()
        # ordersCount["title"]="Total orders of this year"
        # ordersCount["value"]=totalOrders
        # summary.append(ordersCount)
        # totalRevenue=dict()
        # revenue = Order.objects.filter(date__year=thisYear,payment_status='Completed').aggregate(Sum("total"))
        # totalRevenue["title"]="This year's revenue"
        # totalRevenue["value"]=revenue["total__sum"]
        # summary.append(totalRevenue)
        # data.append(summary)        

        data=dict()

        summary=dict()
        totalOrders = Order.objects.filter(date__gte=today).count()
        summary["order_count"]=totalOrders
        # Modified by :- Parineeta Gedam on 12-05-2023 reason :- for re-calculations after add discount
        # revenue = Order.objects.filter(date__gte=today,payment_status='Completed').aggregate(Sum("total"))
        # summary["total_revenue"]=revenue["total__sum"]
        revenue = Order.objects.filter(date__gte=today,payment_status='Completed').aggregate(Sum("final_amount"))
        summary["total_revenue"]=revenue["final_amount__sum"]
        # End of modified code by :- Parineeta Gedam on 12-05-2023
        data["todays_summary"]=summary

        summary=dict()
        totalOrders = Order.objects.filter(date__gte=startOfTheWeek).count()
        summary["order_count"]=totalOrders
        # Modified by :- Parineeta Gedam on 12-05-2023 reason :- for re-calculations after add discount
        # revenue = Order.objects.filter(date__gte=startOfTheWeek,payment_status='Completed').aggregate(Sum("total"))
        # summary["total_revenue"]=revenue["total__sum"]
        revenue = Order.objects.filter(date__gte=startOfTheWeek,payment_status='Completed').aggregate(Sum("final_amount"))
        summary["total_revenue"]=revenue["final_amount__sum"]
        # End of modified code by :- Parineeta Gedam on 12-05-2023
        data["this_weeks_summary"]=summary

        summary=dict()
        totalOrders = Order.objects.filter(date__gte=startOfTheMonth).count()
        summary["order_count"]=totalOrders
        # Modified by :- Parineeta Gedam on 12-05-2023 reason :- for re-calculations after add discount
        # revenue = Order.objects.filter(date__gte=startOfTheMonth,payment_status='Completed').aggregate(Sum("total"))
        # summary["total_revenue"]=revenue["total__sum"]
        revenue = Order.objects.filter(date__gte=startOfTheMonth,payment_status='Completed').aggregate(Sum("final_amount"))
        summary["total_revenue"]=revenue["final_amount__sum"]
        # End of modified code by :- Parineeta Gedam on 12-05-2023
        data["this_months_summary"]=summary


        summary=dict()
        totalOrders = Order.objects.filter(date__year=thisYear).count()
        summary["order_count"]=totalOrders
        # Modified by :- Parineeta Gedam on 12-05-2023 reason :- for re-calculations after add discount
        # revenue = Order.objects.filter(date__year=thisYear,payment_status='Completed').aggregate(Sum("total"))
        # summary["total_revenue"]=revenue["total__sum"]
        revenue = Order.objects.filter(date__year=thisYear,payment_status='Completed').aggregate(Sum("final_amount"))
        summary["total_revenue"]=revenue["final_amount__sum"]
        # End of modified code by :- Parineeta Gedam on 12-05-2023
        data["this_years_summary"]=summary

        #End of code modification on 15-04-2023

        # Added by - Ashish Dewangan on 19-04-2023
        # Reason - To show todays new placed orders
        todays_newly_placed_orders=Order.objects.filter(date__gte=today,order_status='Placed')
        todays_newly_placed_orders_serializer=OrderSerializer(todays_newly_placed_orders, many=True)
        # End of code addition by Ashish Dewangan on 19-04-2023

        # Commented and modified by - Ashish Dewangan on 19-04-2023
        # Reason - to not show placed orders on todays pending orders
        #todays_orders=Order.objects.filter(date__gte=today,payment_status='Pending')
        from django.db.models import Q
        todays_pending_orders=Order.objects.filter(~Q(order_status='Placed'),date__gte=today,payment_status='Pending')
        todays_pending_orders_serializer=OrderSerializer(todays_pending_orders, many=True)
        #End of code modification by Ashish Dewangan on 19-04-2023

        # Added by - Ashish Dewangan on 19-04-2023
        # Reason - To show todays completed orders
        todays_completed_orders=Order.objects.filter(date__gte=today,payment_status='Completed')
        todays_completed_orders_serializer=OrderSerializer(todays_completed_orders, many=True)
        # End of code addition by Ashish Dewangan on 19-04-2023

        # Added by Rohan kansari-  
        todays_order_item=OrderItem.objects.all().filter(date__gte=today)
        todays_order_item_serializer=OrderItemWithOrderIdSerializer(todays_order_item, many=True)

        settingserailize = SettingSaveSerializer(Setting.objects.last())
        from admin_app.models import Tenant, RestaurantRequest
        tenant = Tenant.objects.get(tenant_name=tenant)
        tenant_detail = {
            "name": tenant.restaurant_name.restaurant_name,
            "address": tenant.restaurant_name.address
        }


        # return Response({ "setting": settingserailize.data, "tenant": tenant_detail}, 200)

        return Response({
            "todays_pending_orders":todays_pending_orders_serializer.data,
            "revenue_details":data,
            "order_item":todays_order_item_serializer.data,
            # Added by - Ashish Dewangan on 19-04-2023
            # Reason - To show todays new orders
            "todays_newly_placed_orders":todays_newly_placed_orders_serializer.data,
            # End of code addition

            "setting": settingserailize.data, 
            "tenant": tenant_detail,

            # Added by - Ashish Dewangan on 19-04-2023
            # Reason - To show todays new orders
            "todays_completed_orders":todays_completed_orders_serializer.data
            # End of code addition
        })
    
# End of code addition for dashboard data


# Added by Yuvraj Sahu on 17-4-2023
# Reason - to update payment and order status
class UpdateOrderPaymentStatus(APIView):
    def put(self, request, tenant, orderID):
        orderObj = Order.objects.get(order_id = orderID)
        if request.data["order_status"] == "Confirm" :
            OrderItem.objects.filter(order_id__order_id=orderID, item_status="Pending").update(item_status="Confirm")
        serializedData = OrderSerializer(orderObj,request.data, partial=True)
        if serializedData.is_valid(raise_exception=True):
            serializedData.save()
            # Removed by RohanKAnsari - shifted below for latest order Item - 25/5/23
            # Added by - Rohan Kansari- 19/5/23 - 
            # To get updated information of updated order of todays order
            # orderItems= OrderItem.objects.filter(order_id__order_id=orderID)
            # orderItemSerializer=OrderItemWithOrderIdSerializer(orderItems, many=True)
            # # Added by Rohan kansari-  
            
    
            from django.utils.timezone import datetime
            today=datetime.today().date()
            
            todays_order_item=OrderItem.objects.filter(date__gte=today)
            todays_order_item_serializer=OrderItemWithOrderIdSerializer(todays_order_item, many=True)
            todays_newly_placed_orders=Order.objects.filter(date__gte=today,order_status='Placed')
            todays_newly_placed_orders_serializer=OrderSerializer(todays_newly_placed_orders, many=True)

            from django.db.models import Q
            todays_pending_orders=Order.objects.filter(~Q(order_status='Placed'),date__gte=today,payment_status='Pending')
            todays_pending_orders_serializer=OrderSerializer(todays_pending_orders, many=True)

            todays_completed_orders=Order.objects.filter(date__gte=today,payment_status='Completed')
            todays_completed_orders_serializer=OrderSerializer(todays_completed_orders, many=True)

            return Response({"success":"Updated status","order_items":todays_order_item_serializer.data 
                             ,"todays_newly_placed_orders":todays_newly_placed_orders_serializer.data
                             ,"todays_pending_orders":todays_pending_orders_serializer.data
                             ,"todays_completed_orders":todays_completed_orders_serializer.data},status=status.HTTP_201_CREATED)
            # End of code - Rohan Kansari - 19/5/23
        return Response({"error":serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
# End of addition


# Added by - Ashish Dewangan on 28-04-2023
# Reason - To create FCM notification API
class FcmNotificationAPI(APIView):
    def post(self, request, tenant):
        # Commented and modified by - Ashish Dewangan on 28-04-2023
        # Reason - No need to delete old token because refresh token is not coming
        # try:
        #     oldToken=FcmNotification.objects.get(registration_id=request.data["registration_id"])
        #     oldToken.delete()
        # except Exception as e:
        #     print(e)

        #     serializedData=FcmNotificationSerializer(data=request.data,partial=True)
        # try:
        #     if serializedData.is_valid(raise_exception=True):
        #         serializedData.save()
        #         return Response("token saved",200)
        # except Exception as e:
        #     return Response("some problem occured",200)
            
        try:
            #If token already exists the pass
            oldToken=FcmNotification.objects.get(registration_id=request.data["registration_id"])
            return Response("No need to create new token",200)
        except Exception as e:
            serializedData=FcmNotificationSerializer(data=request.data,partial=True)
            try:
                if serializedData.is_valid(raise_exception=True):
                    serializedData.save()
                    return Response("token saved",200)
            except Exception as e:
                return Response("some problem occured",200)
        # End of code modification by Ashish Dewangan on 30-04-2023    
# End of Code addition by Ashish Dewanan on 28-04-2023


"""
This method is created for getting 
all customers for mobile app
"""
# Added by Yuvraj Sahu on 01-05-2023
# Reason - to get all customers
class getCustomerList(APIView):
    def get(self,request,tenant):
        allCustomers = CustomerDetail.objects.all().order_by("-id")
        ordersSerializer=CustomerDetailSerializer(allCustomers, many=True)
        return Response ({"msg":"success", "allCustomers": ordersSerializer.data})
# End of getting customer list
"""
End of getting all customers
"""

# Added by Om Shrivastava on 03-05-23 
# Adding a generate_pdf button

def generate_pdf_view(request, pk):

    path = request.path     
    hostname = request.get_host()
    if "admin" in path:
        seperated = hostname.split(".")
        schemaName = settings.PUBLIC_SCHEMA_NAME
        if seperated[0] != settings.DOMAIN_NAME:
            schemaName = seperated[0]
    from admin_app.models import Tenant, RestaurantRequest
    tenant = Tenant.objects.get(tenant_name=schemaName)
    restaurant_details = {
        "name": tenant.restaurant_name.restaurant_name,
        "address": tenant.restaurant_name.address,
        # Added by Om on 07-05-23
        # Reason : Show the rupee sign which comes from config.py file
        "rupee_symbol":rupee_sign
        # End of the code by Om on 07-05-23
    }
    restaurant_settings = Setting.objects.all().values()
    
    order = Order.objects.get(id=pk)
    # Modification and addition by Om Shrivastava on 13-05-23
    # Reason : Show the order by their id
    # order_details = OrderItem.objects.filter(order_id = order)
    order_details = OrderItem.objects.filter(order_id = order).order_by('id')
    # End of commented and addition by Om Shrivastava on 13-05-23
    
    rate = [] 
    for items in order_details : 
        rate.append(int(items.price / items.quantity))
        
    subtotal = 0
    for items in order_details:
        subtotal = subtotal+items.price
    
    # cgst = 0
    # for gst_items in restaurant_settings:
    #     cgst = subtotal * (gst_items['cgst'])
        
    # sgst = 0
    # for gst_items in restaurant_settings:
    #     sgst = subtotal * (gst_items['sgst'])
        
    total_amount = order.total    

    # Added by ROhanKansari - 12/5/23 - To pass customer detail also
    customer=CustomerDetail.objects.get(id=order.customer_id.id)
    customerSearializer=CustomerDetailSerializer(customer)
    
    
    template = get_template('admin/receipt.html')
    html_string = template.render({'restaurant_settings': restaurant_settings,"customer":customerSearializer.data,'restaurant_details': restaurant_details, 'order': order, 'order_items': order_details,"sub_total" : subtotal,
                                #    'cgst' : cgst,'sgst':sgst,
                                    'total_amount': total_amount,"rate" : rate})
    # End of code - ROhankansari - 12/5/23
    html = HTML(string=html_string)
    result = io.BytesIO()
    html.write_pdf(result, stylesheets=[CSS(string='@page {  size: 3.5in 8in; margin: 0; }')])
    result.seek(0)

    response = HttpResponse(result, content_type='application/pdf')
    response['Content-Disposition'] = f'filename="{order.order_id}.pdf"'

    return response

def generate_pdf_kot_view(request, pk):

    path = request.path
    hostname = request.get_host()
    if "admin" in path:
        seperated = hostname.split(".")
        schemaName = settings.PUBLIC_SCHEMA_NAME
        if seperated[0] != settings.DOMAIN_NAME:
            schemaName = seperated[0]
    from admin_app.models import Tenant, RestaurantRequest
    tenant = Tenant.objects.get(tenant_name=schemaName)
    restaurant_details = {
        "name": tenant.restaurant_name.restaurant_name,
        "address": tenant.restaurant_name.address
    }
    restaurant_settings = Setting.objects.all().values()
    
    order = Order.objects.get(id=pk)
    order_details = OrderItem.objects.filter(order_id = order).order_by('id')
    
    rate = [] 
    for items in order_details : 
        rate.append(int(items.price / items.quantity))
        
    subtotal = 0
    for items in order_details:
        subtotal = subtotal+items.price
              
    total_amount = order.total    
    
    template = get_template('admin/order.html')
    html_string = template.render({'restaurant_settings': restaurant_settings,'restaurant_details': restaurant_details, 'order': order, 'order_items': order_details,"sub_total" : subtotal,
    'total_amount': total_amount,"rate" : rate})

    html = HTML(string=html_string)
    result = io.BytesIO()
    html.write_pdf(result, stylesheets=[CSS(string='@page {  size: 3.5in 8in; margin: 0; }')])
    result.seek(0)

    response = HttpResponse(result, content_type='application/pdf')
    response['Content-Disposition'] = f'filename="{order.order_id}.pdf"'

    return response


    # End of addition 

# Added by - Ashish Dewangan on 04-05-2023
# Reason - To show order report on admin panel
def order_report(request,report_period):
    from admin_app.models import Tenant, RestaurantRequest
    from django.db.models import Sum
    path = request.path
    hostname = request.get_host()

    if "admin" in path:
        seperated = hostname.split(".")
        schemaName = settings.PUBLIC_SCHEMA_NAME
        if seperated[0] != settings.DOMAIN_NAME:
            schemaName = seperated[0]

    
    tenant = Tenant.objects.get(tenant_name=schemaName)
    restaurant_details = {
        "name": tenant.restaurant_name.restaurant_name,
        "address": tenant.restaurant_name.address,
        # Added by Om on 07-05-23
        # Reason : Show the rupee sign which comes from config.py file
        "rupee_symbol":rupee_sign
        # End of the code by Om on 07-05-23
    }

    today=datetime.date.today()
    weekDay=today.weekday()
    startOfTheWeek=today - timedelta(days=weekDay)
    dayOfMonth=today.day
    startOfTheMonth=today - timedelta(days=(dayOfMonth-1))
    thisYear=today.year

    if(report_period=='this_year'):
        report_title="This Year's Order Report"
        orders = Order.objects.filter(date__year=thisYear,payment_status='Completed').order_by('date')
        # Modified by :- Parineeta Gedam on 12-05-2023 reason :- for re-calculations after add discount
        # total_revenue = Order.objects.filter(date__year=thisYear,payment_status='Completed').aggregate(Sum('total'))
        total_revenue = Order.objects.filter(date__year=thisYear,payment_status='Completed').aggregate(Sum('final_amount'))
        # End of modified code by :- Parineeta Gedam on 12-05-2023
        total_orders=Order.objects.filter(date__year=thisYear,payment_status='Completed').count()
    if(report_period=='this_month'):
        report_title="This Month's Order Report"
        orders = Order.objects.filter(date__gte=startOfTheMonth,payment_status='Completed').order_by('date')
        # Modified by :- Parineeta Gedam on 12-05-2023 reason :- for re-calculations after add discount
        # total_revenue = Order.objects.filter(date__gte=startOfTheMonth,payment_status='Completed').aggregate(Sum('total'))
        total_revenue = Order.objects.filter(date__gte=startOfTheMonth,payment_status='Completed').aggregate(Sum('final_amount'))
        # End of modified code by :- Parineeta Gedam on 12-05-2023
        total_orders=Order.objects.filter(date__gte=startOfTheMonth,payment_status='Completed').count()
    if(report_period=='this_week'):
        report_title="This Week's Order Report"
        orders = Order.objects.filter(date__gte=startOfTheWeek,payment_status='Completed').order_by('date')
        # Modified by :- Parineeta Gedam on 12-05-2023 reason :- for re-calculations after add discount
        # total_revenue = Order.objects.filter(date__gte=startOfTheWeek,payment_status='Completed').aggregate(Sum('total'))
        total_revenue = Order.objects.filter(date__gte=startOfTheWeek,payment_status='Completed').aggregate(Sum('final_amount'))
        # End of modified code by :- Parineeta Gedam on 12-05-2023
        total_orders=Order.objects.filter(date__gte=startOfTheWeek,payment_status='Completed').count()        
    if(report_period=='today'):
        report_title="Today's Order Report"
        orders = Order.objects.filter(date__gte=today,payment_status='Completed').order_by('date')
        # Modified by :- Parineeta Gedam on 12-05-2023 reason :- for re-calculations after add discount
        # total_revenue = Order.objects.filter(date__gte=today,payment_status='Completed').aggregate(Sum('total'))
        total_revenue = Order.objects.filter(date__gte=today,payment_status='Completed').aggregate(Sum('final_amount'))
        # End of modified code by :- Parineeta Gedam on 12-05-2023
        total_orders=Order.objects.filter(date__gte=today,payment_status='Completed').count() 
    template = get_template('admin/order_report.html')
    html_string = template.render({'restaurant_details':restaurant_details,
                                   'report_title':report_title,
                                   'date':datetime.date.today(),
                                   'total_orders':total_orders,
                                   'orders': orders,
                                   'total_revenue':total_revenue["final_amount__sum"],
                                   })
    
    html = HTML(string=html_string)
    result = io.BytesIO()
    html.write_pdf(result, stylesheets=[CSS(string='@page {    size: A4; margin: 2rem;  }')])
    result.seek(0)

    response = HttpResponse( result,content_type='application/pdf')
    response['Content-Disposition'] = f'filename="order_report.pdf"'

    return response
# End of code addition by Ashish Dewangan on 04-05-2023

# Added by - Ashish Dewangan on 04-05-2023
# Reason - To show item report on admin panel
def item_report(request,report_period):
    from admin_app.models import Tenant, RestaurantRequest
    from django.db.models import Count,Sum

    path = request.path
    hostname = request.get_host()

    if "admin" in path:
        seperated = hostname.split(".")
        schemaName = settings.PUBLIC_SCHEMA_NAME
        if seperated[0] != settings.DOMAIN_NAME:
            schemaName = seperated[0]

    
    tenant = Tenant.objects.get(tenant_name=schemaName)
    restaurant_details = {
        "name": tenant.restaurant_name.restaurant_name,
        "address": tenant.restaurant_name.address,
        # Added by Om on 07-05-23
        # Reason : Show the rupee sign which comes from config.py file
        "rupee_symbol":rupee_sign
        # End of the code by Om on 07-05-23
    }

    today=datetime.date.today()
    weekDay=today.weekday()
    startOfTheWeek=today - timedelta(days=weekDay)
    dayOfMonth=today.day
    startOfTheMonth=today - timedelta(days=(dayOfMonth-1))
    thisYear=today.year

    if(report_period=='this_year'):
        report_title="This Year's Item Report"
        order_items_half = OrderItem.objects.filter(date__year=thisYear,item_status='Confirm',serving_size='Half').values('item').order_by('item').annotate(count=Sum('quantity')).annotate(sum=Sum('price'))
        order_items_full = OrderItem.objects.filter(date__year=thisYear,item_status='Confirm',serving_size='Full').values('item').order_by('item').annotate(count=Sum('quantity')).annotate(sum=Sum('price'))
        # total_amount = OrderItem.objects.filter(date__year=thisYear,item_status='Confirm').values('item').order_by('item').annotate(Sum('price'))
    if(report_period=='this_month'):
        report_title="This Month's Item Report"
        order_items_half = OrderItem.objects.filter(date__gte=startOfTheMonth,item_status='Confirm',serving_size='Half').values('item').order_by('item').annotate(count=Sum('quantity')).annotate(sum=Sum('price'))
        order_items_full = OrderItem.objects.filter(date__gte=startOfTheMonth,item_status='Confirm',serving_size='Full').values('item').order_by('item').annotate(count=Sum('quantity')).annotate(sum=Sum('price'))
        # total_amount = OrderItem.objects.filter(date__year=thisYear,item_status='Confirm').values('item').order_by('item').annotate(Sum('price'))
    if(report_period=='this_week'):
        report_title="This Week's Item Report"
        order_items_half = OrderItem.objects.filter(date__gte=startOfTheWeek,item_status='Confirm',serving_size='Half').values('item').order_by('item').annotate(count=Sum('quantity')).annotate(sum=Sum('price'))
        order_items_full = OrderItem.objects.filter(date__gte=startOfTheWeek,item_status='Confirm',serving_size='Full').values('item').order_by('item').annotate(count=Sum('quantity')).annotate(sum=Sum('price'))
        # total_amount = OrderItem.objects.filter(date__year=thisYear,item_status='Confirm').values('item').order_by('item').annotate(Sum('price'))
    if(report_period=='today'):
        report_title="Today's Item Report"
        order_items_half = OrderItem.objects.filter(date__gte=today,item_status='Confirm',serving_size='Half').values('item').order_by('item').annotate(count=Sum('quantity')).annotate(sum=Sum('price'))
        order_items_full = OrderItem.objects.filter(date__gte=today,item_status='Confirm',serving_size='Full').values('item').order_by('item').annotate(count=Sum('quantity')).annotate(sum=Sum('price'))
        # total_amount = OrderItem.objects.filter(date__year=thisYear,item_status='Confirm').values('item').order_by('item').annotate(Sum('price'))
   
    template = get_template('admin/item_report.html')
    html_string = template.render({'restaurant_details':restaurant_details,
                                   'report_title':report_title,
                                   'date':datetime.date.today(),
                                   'order_items_half': order_items_half,
                                   'order_items_full':order_items_full
                                   })
    
    html = HTML(string=html_string)
    result = io.BytesIO()

    html.write_pdf(result, stylesheets=[CSS(string='@page {    size: A4; margin: 2rem;  }')])
    result.seek(0)

    response = HttpResponse( result,content_type='application/pdf')
    response['Content-Disposition'] = f'filename="item_report.pdf"'

    return response
# End of code addition by Ashish Dewangan on 04-05-2023


# Added by Rohan Kansari - 22/5/23
# Reason - To update item status 

class UpdateItemStatus(APIView):
    def put(self, request, tenant, orderID):
       orderObj = Order.objects.get(order_id = orderID)
       print(request.data)
    #    orderItem=OrderItem.objects.filter(order_id=orderObj.id)
       for i,data in enumerate(request.data):
            OrderItem.objects.filter(id=data["id"]).update(item_status=data['item_status'])
        #   print(orderItem[i].item_status,data['item_status'])
        #   orderItem[i].item_status=data['item_status']
        #   orderItem[i].save()
        #   print(orderItem[i].item_status)
       
       orderItem=OrderItem.objects.filter(order_id=orderObj.id)
       serializer=OrderItemSerializer(orderItem,many=True)
       return Response(serializer.data)                     


# End of code - Rohan Kansari - 22/5/23

# Added by Rohan Kansari - 25/5/23
# Reason - To update item status 

class UpdateAllOrderStatus(APIView):
    def post(self, request, tenant):
        allData=request.data["orders"]
       
        for data in allData:
            print(request.data["order_status"],request.data['payment_status'],data['order_status'],data["payment_status"])
            data['order_status']=request.data["order_status"]
            data["payment_status"]=request.data['payment_status']
            if request.data["order_status"] == "Confirm":
                OrderItem.objects.filter(order_id__order_id=data['order_id'], item_status="Pending").update(item_status="Confirm")
            
            Order.objects.filter(order_id = data['order_id']).update(order_status=data["order_status"],payment_status=data['payment_status'])
          


        from django.utils.timezone import datetime
        today=datetime.today().date()
        
        todays_order_item=OrderItem.objects.filter(date__gte=today)
        todays_order_item_serializer=OrderItemWithOrderIdSerializer(todays_order_item, many=True)
        todays_newly_placed_orders=Order.objects.filter(date__gte=today,order_status='Placed')
        todays_newly_placed_orders_serializer=OrderSerializer(todays_newly_placed_orders, many=True)

        from django.db.models import Q
        todays_pending_orders=Order.objects.filter(~Q(order_status='Placed'),date__gte=today,payment_status='Pending')
        todays_pending_orders_serializer=OrderSerializer(todays_pending_orders, many=True)

        todays_completed_orders=Order.objects.filter(date__gte=today,payment_status='Completed')
        todays_completed_orders_serializer=OrderSerializer(todays_completed_orders, many=True)

        return Response({"success":"Updated status","order_items":todays_order_item_serializer.data 
                            ,"todays_newly_placed_orders":todays_newly_placed_orders_serializer.data
                            ,"todays_pending_orders":todays_pending_orders_serializer.data
                            ,"todays_completed_orders":todays_completed_orders_serializer.data},status=status.HTTP_201_CREATED)
                
       
        return Response(request.data)                     


# End of code - Rohan Kansari - 25/5/23

# Added by :- Parineeta Gedam
# Date :- 17-04-2023
# Reason : check order confirm
class CheckOrderConfirmAPIView(APIView):
    def post(self, request, tenant):
        orderObj = Order.objects.get(order_id=request.data['order_id'])
        serializer = OrderSerializer(orderObj)
        return Response({"order": serializer.data}, 200)
# End of code addition by Parineeta Gedam on 17-04-2023

# Added by :- Parineeta Gedam
# Date :- 16-05-2023
# Reason : API for update the orders

class DeleteOrderItemsAPIView(APIView):
    def put(self, request, tenant):
        orderItemId  = OrderItem.objects.get(id = request.data['orderItem'])
        orderId = Order.objects.get(order_id=request.data['order'])
        orderItemId.item_status = "Cancelled"
        orderItemId.save()

        orderItemsObj = OrderItem.objects.filter(order_id=orderId.id)
        orderItemserializer = OrderItemSerializer(orderItemsObj, many=True)
       
        orderItemOrderId = OrderItem.objects.filter(order_id=orderId.id)

        itemsPrice = []
        for orderItem in orderItemOrderId :
            if(orderItem.item_status != "Cancelled"):
                price = orderItem.price
                itemsPrice.append(price)
        updatedOrderValues=dict()

        updatedOrderValues['sub_total'] = round(float("{:.2f}".format((sum(itemsPrice)))),2)
        orderSerializer=OrderSerializer(orderId,data=updatedOrderValues,partial=True)
        try:
            if orderSerializer.is_valid(raise_exception=True):
                orderSerializer.save()
        except Exception as e:
            print("Exception occured on deleteOrderAPI",e)               
        return Response({"orderItem":orderItemserializer.data, "order":orderSerializer.data})
        
# Added by :- Parineeta Gedam
# Date :- 17-05-2023
# Reason : API for update the orders

class PostUpdateOrderItemsAPIView(APIView):
    def put(self, request, tenant):
        orderId = Order.objects.get(order_id=request.data['orders'])
        orderItemId = OrderItem.objects.filter(order_id=orderId.id)
        order = request.data['order']

        cartItem = []
        if(order['order_status'] == "Placed") : 
            for cart in request.data['orderItems']:
                if(cart['item_status'] != "Cancelled") : 
                    print("cart", cart)
                    orderItem = OrderItem.objects.get(id=cart['id'])
                    orderItem.quantity=cart['quantity']
                    orderItem.price=cart['price']
                    orderItem.save()
                    cartItem.append(orderItem)
            orderItemSerializer = OrderItemSerializer(cartItem, many=True)

        orderData  = Order.objects.filter(order_id = request.data['orders']).update(
            sub_total=round( float("{:.2f}".format(order['sub_total'])),2), 
            cgst = round( float("{:.2f}".format(order['cgst'])),2), 
            sgst = round( float("{:.2f}".format(order['sgst'])),2), 
            total = round( float("{:.2f}".format(order['total'])),2),
            final_amount = round( float("{:.2f}".format(order['total'])),2),
            cancelled_by="Customer")
        
        orderObject = Order.objects.filter(order_id = request.data['orders']).values()[0]
        return Response({"orderItem":orderItemSerializer.data, "order":orderObject})

# End of added code by :- Parineeta Gedam on 17-05-2023

# Added by :- Parineeta Gedam
# Date :- 22-05-2023
# Reason : API for get the order items and order

class GetOrderItemsAndOrderAPIView(APIView):
    def post(self, request, tenant):
        orderId = Order.objects.get(order_id=request.data['order'])
        orderSerializer = OrderSerializer(orderId)
        orderItemId = OrderItem.objects.filter(order_id=orderId.id)
        orderItemsSerializer = OrderItemSerializer(orderItemId, many=True)
        return Response({"orderItem":orderItemsSerializer.data, "order": orderSerializer.data})
    
# End of added code by :- Parineeta Gedam on 22-05-2023


# Added by :- Parineeta Gedam
# Date :- 17-05-2023
# Reason : API for Add order items used in react native

class AddOrderItemsAPIView(APIView):
    def post(self, request, tenant):
        print("request", request.data)
        OrderItem(
            order_id = Order.objects.get(id = request.data["order_id"]),
            item = request.data["item"],
            item_id = Item.objects.get(id = request.data["item_id"]),
            serving_size = request.data["serving_size"],
            quantity = request.data["quantity"],
            item_status = request.data["item_status"]
        ).save()
        # orderId = Order.objects.get(order_id)
        return Response({"msg":"success"})
# End of added code by :- Parineeta Gedam on 17-05-2023


# Added by :- Parineeta Gedam
# Date :- 26-05-2023
# Reason : API for post the reservations data
class PostReservationsAPIView(APIView):
    def post(self, request, tenant):
        print("request", request.data)
        print(request.data)
        # ReservationsSerializedData = ReservationsSerializer(data=request.data)
        # if ReservationsSerializedData.is_valid():
        #     ReservationsSerializedData.save()
        return Response({"msg":"success"})
# End of added code by :- Parineeta Gedam on 17-05-2023


# Added by :- Suman sahu
# Date :- 27-05-2023
# Reason : API for get the order report
class RevenueOrderReport(APIView):
    def get(self,request, tenant):
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
            revenue = Order.objects.filter(date__gte=today,payment_status='Completed').aggregate(Sum("total"))
            summary["total_revenue"]=revenue["total__sum"]
            data["todays_summary"]=summary

            summary=dict()
            totalOrders = Order.objects.filter(date__gte=startOfTheWeek).count()
            summary["order_count"]=totalOrders
            revenue = Order.objects.filter(date__gte=startOfTheWeek,payment_status='Completed').aggregate(Sum("total"))
            summary["total_revenue"]=revenue["total__sum"]
            data["this_weeks_summary"]=summary

            summary=dict()
            totalOrders = Order.objects.filter(date__gte=startOfTheMonth).count()
            summary["order_count"]=totalOrders
            revenue = Order.objects.filter(date__gte=startOfTheMonth,payment_status='Completed').aggregate(Sum("total"))
            summary["total_revenue"]=revenue["total__sum"]
            data["this_months_summary"]=summary

            summary=dict()
            totalOrders = Order.objects.filter(date__year=thisYear).count()
            summary["order_count"]=totalOrders
            revenue = Order.objects.filter(date__year=thisYear,payment_status='Completed').aggregate(Sum("total"))
            summary["total_revenue"]=revenue["total__sum"]
            data["this_years_summary"]=summary
           
            return Response({
                "revenue_details":data,
                "date":today,
            })
# End of added code by :- Suman sahu on 27-05-2023

# Added by Suman Sahu on 28-5-2023
# Reason - create api for get total menu, item and category details
class GetTotalRevenueDetails(APIView):
    def get(self,request, tenant):
        setdata = dict()
        totalCategories = Menu.objects.all().count()
        totalSubCategories = Category.objects.all().count()
        totalItems = Item.objects.all().count()
        setdata['totalCategories']= totalCategories
        setdata['totalSubCategories']= totalSubCategories
        setdata['totalItems']= totalItems
        return Response({
                "revenue_details":setdata,
            })
# End of addition by Suman Sahu on 28-5-2023