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

from django.db.models import Q
import logging
from django.core.paginator import Paginator

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
        tenant_obj=Tenant.objects.get(tenant_name=tenant)
        try:
            visitCount=VisitCount.objects.get(tenant_name=tenant)
        except VisitCount.DoesNotExist:
            visitCount = VisitCount()
            visitCount.tenant_name = tenant
        visitCount.count=visitCount.count+1
        visitCount.save()
        tenantListSerializer=TenantListSerializer(tenant_obj)
        
        # Added by rohan - 18/4/23
        # reason - to save send all subscribe features
        provided_features=[]
        if tenantListSerializer.data['Subscribe_plan'] is not None:
          #Modified by Rohan kansari - 1/7/23
          #Reason - To point tenant obj of tabel not tenant name only
          plan= Plans.objects.get(id=tenant_obj.Subscribe_plan.id)
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
    # Added and modified by Yuvraj Sahu on 16-06-2023
    # Reason - to show all best seller items and remove best 10 item
    return bests
    # return bests[:10]
    # End of addition by Yuvraj Sahu on 16-06-2023
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
        # Added and modified by Yuvraj Sahu on 18-08-2023
        # Reason - to sort of banner list
        # offerBanner=Offer.objects.all()
        offerBanner=Offer.objects.all().order_by("offer_name")
        # End of modification by Yuvraj Sahu on 18-08-2023
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
# modified by- Pratap Sahu on 14-08-2013
# Reason : get the footer and description details
# ---------------------------------------------------------------------------------
class FooterandDescriptionAPIView(APIView):
    def get(self,request,tenant):
        # print('gfagfgf', tenant)
        # footer=Footer.objects.all()
        # footerSerializer=FooterSerializer(footer,many=True)
        descriptionList=Description.objects.all()
        # print("++++++++++++++++++++++++++",descriptionList)
        descriptionSerializedObj=DescriptionSerializer(descriptionList,many=True)

        return Response({
            "msg":"success",
            "descriptionList":descriptionSerializedObj.data,
            })
        
#Added By - Pratap Sahu on 13-08-2023
# Reason : save & update the footer description details
    def post(self,request,tenant):
        if "id" in request.data :
            obj = Description.objects.get(id=request.data["id"])
            serializedObj = DescriptionSerializer(obj, data=request.data,partial=True)
        else :
            serializedObj = DescriptionSerializer(data=request.data)
        if serializedObj.is_valid():
            serializedObj.save()
            return Response({
                "msg": "Updated Successfully",
                "serilizedData": serializedObj.data,
            }, status=status.HTTP_201_CREATED)
        return Response({"error": serializedObj.errors}, status=status.HTTP_400_BAD_REQUEST)
# End of addition
# End of addition by pratap sahu on 13-08-2023
# Reason: to save And Update the Footer Description Details

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
        # Added by Om shrivastava on 26-06-23
        # Reason : Show item name by id 
        itemListbyId=Item.objects.all().order_by('id')
        # Modification and addition by Om Shrivastava on 07-07-23
        # Reason : If item is active, than its show in dropdown, anotherwise its not show 
        # Modification and addition by Om Shrivastava on 12-07-23 
        # Reason : When category and menu is is_active then show the item name anotherwise not show
        # filteredData = itemListbyId.filter(is_active = True)
        filteredData = itemListbyId.filter(is_active = True,category__menu__is_active=True,category__is_active=True)
        # End of addition and modification by Om Shrivastava on 12-07-23
        # itemListSerializerbyId=ItemListSerializer(itemListbyId,many=True)
        itemListSerializerbyId=ItemListSerializer(filteredData,many=True)
        # End of addition by Om Shrivastava on 07-07-23 Reason : If item is active, than its show in dropdown, anotherwise its not show 
        # End of the code by Om shrivastava on 26-06-23

        return Response({
            "msg":"success",
            "menuList":menuData.data,
            "categoryList":categoryListSerializer.data,
            "itemList":itemListSerializer.data,
            # Added by Om shrivastava on 26-06-23
            # Reason : Show item name by id 
            "itemListbyId":itemListSerializerbyId.data
            # End of the code by Om shrivastava on 26-06-23
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

    # Added by :- Parineeta gedam on 25-06-2023 reason :- if new item added by customer then order status will be placed.
    cartData['order_status'] = "Placed"
    # End of Added by :- Parineeta gedam on 25-06-2023 reason :- if new item added by customer then order status will be placed.
    
    # Added by Rohan kansari - 9/8/23
    # Reason - To set payment mode if key is present
    if request.data.get("payment_mode")!=None:
        cartData['payment_mode']=request.data.get("payment_mode")
    else :
        pass    
    # End of code - Rohan kansari - 9/8/23 -To set payment mode if key is present
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


    # Added by ROhan kansari - 16/8/23
    # Reason - To add entered customer name and email
    cartData["customer_name"]=request.data["name"]
    cartData["customer_email"]=request.data["email"]
    # End of code - Rohan kansari - 16/8/23 - 
    
    # Added by Rohan kansari - 4/9/23
    # Reason - To save order created by
    cartData["order_created_by"]=request.data["order_created_by"]
   

    orderSerializer = OrderSerializer(data=cartData)
    order_obj = 0

    if orderSerializer.is_valid(raise_exception=True):
        order_obj = orderSerializer.save()

    return {"order_obj": order_obj, "orderSerializer": orderSerializer}
    # End of added code 06-04-2023 by :- Parineeta Gedam on 24-05-2023 

# # Added by :- Parineeta Gedam
# # Date :- 06-04-2023
# # Reason : method for save the cart item in order Items table

# def orderItemsCreation(request, order_obj):

#     # save cart item in Order Item Table
#     cartItem = []
#     allOffer = OfferItem.objects.all()

#     for cart in request.data['cart']:
#         cartData = dict()

#         item = Item.objects.get(id=cart['id'])
#         discounted = 0
#         if allOffer.filter(item_name=item).count() > 0:
#             # Modified by Rohan Kansari - 11/5/23
#             # Reason - If discount is none then do nothing
#             if allOffer.get(item_name=item).offer_name.discount is not None:
#                discounted = allOffer.get(item_name=item).offer_name.discount
#         cartData["item_id"] = item.id
#         cartData['order_id'] = order_obj.id
#         cartData['item'] = cart['name']
        
#         # Commented by :- Parineeta gedam on 22-04-2023
#         # cartData['serving_size'] = cart['serve_size']
#         # End of added code on 22-04-2023

#         # Added by :- Parineeta Gedam on 22-04-2023
#         if (cart['serve_size'] == "Half Plate"):
#             cartData['serving_size'] = "Half"
#         else :
#             cartData['serving_size'] = "Full"
#         # End of added code on 22-04-2023

#         cartData['quantity'] = cart['quantity']

#         # Commented by :- Parineeta gedam
#         # if (cart['serve_size'] == "Half Plate"):
#         #     cartData['price'] = float(
#         #         item.price_half) - float(item.price_half/100)*discounted
#         # else:
#         #     cartData['price'] = float(
#         #         item.price_full)-float(item.price_full/100)*discounted
#         # End of added code
         
#         # Modified by :- Parineeta Gedam on 21-04-2023
#         if (cart['serve_size'] == "Half Plate"):
#             # Added by Rohan kansari -  1/5/23
#             # Reason - becuase discount is throwing issue if discount is not in float
#             cartData['price'] = float(
#                 item.price_half * cart['quantity']) - float(item.price_half * cart['quantity']/100)* float(discounted)
#         else:
#             cartData['price'] = float(
#                 item.price_full * cart['quantity'])-float(item.price_full * cart['quantity']/100)*float(discounted)
#             # End of code - ROhan kansari - 1/5/23
#         # End of added code

#         # Added by :- Parineeta Gedam on 25-06-2023 reason :- newly added item status will be pending
#         cartData['item_status'] = "Pending"
#         # End of added code by :- Parineeta Gedam on 25-06-2023 reason :- newly added item status will be pending

#         cartItem.append(cartData)

#     orderItemSerializer = OrderItemSerializer(data=cartItem, many=True)
#     if orderItemSerializer.is_valid(raise_exception=True):
#         orderItemSerializer.save()

#     return {"orderItemSerializer": orderItemSerializer}

# # End of added code 06-04-2023
# ===================================================================================================================================

# Added by :- Parineeta Gedam
# Date :- 10-07-2023 
# Reason : Implement Order Item update functionality.

def orderItemsCreation(request, order_obj):

    cartItem = []
    allOffer = OfferItem.objects.all()

    try : 
        orderItemsList = OrderItem.objects.filter(order_id__order_id = request.data["orders"])
        orderItemsListSerializer = list()
        for cart in request.data['cart']:

            if cart['serve_size'] == "Full Plate":
                cart['serving_size'] = "Full"
            elif cart['serve_size'] == "Half Plate" :
                cart['serving_size'] = "Half"

            # Modified by :- Parineeta Gedam on 15-07-2023 reason :- Implement Order Item update functionality >> When admin confirm the order & user again order same item then in UI panel again a new row is generate for same item.
            # filteredItems = orderItemsList.filter(item_id__id = cart['id'], serving_size = cart['serving_size'])
            filteredItems = orderItemsList.filter(item_id__id = cart['id'], serving_size = cart['serving_size'], item_status = "Pending")
            # End of Modified by :- Parineeta Gedam on 15-07-2023 reason :- Implement Order Item update functionality >> When admin confirm the order & user again order same item then in UI panel again a new row is generate for same item.

            if filteredItems.count() > 0 :
                oldOrderItemObject = filteredItems.first()
                if oldOrderItemObject.item_status != "Confirm" and oldOrderItemObject.item_status != "Cancelled" :
                    item = Item.objects.get(id=cart['id'])
                    discounted = 0
                    if allOffer.filter(item_name=item).count() > 0:
                        if allOffer.get(item_name=item).offer_name.discount is not None:
                            discounted = allOffer.get(item_name=item).offer_name.discount

                    cart['quantity'] = cart['quantity'] + oldOrderItemObject.quantity
                    cart['price'] = float(item.price_full * cart['quantity'])-float(item.price_full * cart['quantity']/100)*float(discounted)
                    # cart['item_status'] = "Pending"
                            
                    orderItemSerializer = OrderItemSerializer(oldOrderItemObject, data=cart, partial=True)
                   
                    try:
                        if orderItemSerializer.is_valid(raise_exception=True):
                            orderItemSerializer.save()
                        orderItemsListSerializer.append(orderItemSerializer)
                    except Exception as e:
                        return {"error": e}
                    
                else :
                    cartData = dict()
                    item = Item.objects.get(id=cart['id'])
                    discounted = 0
                    if allOffer.filter(item_name=item).count() > 0:
                        if allOffer.get(item_name=item).offer_name.discount is not None:
                            discounted = allOffer.get(item_name=item).offer_name.discount
                    cartData["item_id"] = item.id
                    cartData['order_id'] = order_obj.id
                    cartData['item'] = cart['name']

                    if (cart['serving_size'] == "Half"):
                        cartData['serving_size'] = "Half"
                    elif (cart['serving_size'] == "Full"):
                        cartData['serving_size'] = "Full"

                    cartData['quantity'] = cart['quantity']
                    if (cart['serving_size'] == "Half"):
                        cartData['price'] = float(
                            item.price_half * cart['quantity']) - float(item.price_half * cart['quantity']/100)* float(discounted)
                    else:
                        cartData['price'] = float(
                            item.price_full * cart['quantity'])-float(item.price_full * cart['quantity']/100)*float(discounted)
                    cartData['item_status'] = "Pending"
                    cartItem.append(cartData) 
                  
            else:
                cartData = dict()
                item = Item.objects.get(id=cart['id'])
                discounted = 0
                if allOffer.filter(item_name=item).count() > 0:
                    if allOffer.get(item_name=item).offer_name.discount is not None:
                        discounted = allOffer.get(item_name=item).offer_name.discount
                cartData["item_id"] = item.id
                cartData['order_id'] = order_obj.id
                cartData['item'] = cart['name']

                if (cart['serving_size'] == "Half"):
                    cartData['serving_size'] = "Half"
                elif (cart['serving_size'] == "Full"):
                    cartData['serving_size'] = "Full"

                cartData['quantity'] = cart['quantity']
                if (cart['serving_size'] == "Half"):
                    cartData['price'] = float(
                        item.price_half * cart['quantity']) - float(item.price_half * cart['quantity']/100)* float(discounted)
                else:
                    cartData['price'] = float(
                        item.price_full * cart['quantity'])-float(item.price_full * cart['quantity']/100)*float(discounted)
                cartData['item_status'] = "Pending"
                cartItem.append(cartData) 
              
        orderItemSerializer = OrderItemSerializer(data=cartItem, many=True)
        if orderItemSerializer.is_valid(raise_exception=True):
            orderItemSerializer.save()
        orderItemsListSerializer.append(orderItemSerializer)
        return{"orderItemSerializer":orderItemsListSerializer}
    except Exception as ee :
        for cart in request.data['cart']:
            cartData = dict()
            item = Item.objects.get(id=cart['id'])
            discounted = 0
            if allOffer.filter(item_name=item).count() > 0:
                if allOffer.get(item_name=item).offer_name.discount is not None:
                    discounted = allOffer.get(item_name=item).offer_name.discount
            cartData["item_id"] = item.id
            cartData['order_id'] = order_obj.id
            cartData['item'] = cart['name']
            if (cart['serve_size'] == "Half Plate"):
                cartData['serving_size'] = "Half"
            else :
                cartData['serving_size'] = "Full"
            cartData['quantity'] = cart['quantity']
            if (cart['serve_size'] == "Half Plate"):
                cartData['price'] = float(
                    item.price_half * cart['quantity']) - float(item.price_half * cart['quantity']/100)* float(discounted)
            else:
                cartData['price'] = float(
                    item.price_full * cart['quantity'])-float(item.price_full * cart['quantity']/100)*float(discounted)
            cartData['item_status'] = "Pending"
            cartItem.append(cartData) 
        orderItemSerializer = OrderItemSerializer(data=cartItem, many=True)
        if orderItemSerializer.is_valid(raise_exception=True):
            orderItemSerializer.save()
        return {"orderItemSerializer": orderItemSerializer}

# End of added code 10-07-2023 # Reason : Implement Order Item update functionality.
# ==================================================================================================================================


# Added by ROahn kansari - 9/8/23
# Reason - to validate today order 
def validateTable(tabelNumber):
    from django.utils.timezone import datetime
    from django.db.models import Q
    today=datetime.today().date()
    # Modified by Rohan kansari - 17/8/23
    # Reason - To dont get data of cancelled orders
    totalOrders = Order.objects.filter(~Q(order_status="Cancelled"),date__gte=today,payment_status="Pending").values("table_number")
    # ENd of code - Rohan kansari - 17/8/23
    for obj in totalOrders:
        if(tabelNumber==obj["table_number"]):
           return False
    return True

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
        # Added by Rohan kansari - 9/8/23
        # Reason - To validate tabel number if validate_table key is present
        try:
            if request.data.get("validate_table")==True:
              if validateTable(request.data.get("table_number")) == True:
                 pass
              else:
                 return Response({"tabel_error":"Tabel number is already running"})   
            else:
              pass
        except Exception as e:
               pass
        # End of code - Rohan kansari - 9/8/23-To validate tabel number if validate_table key is present
        
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
            # Added by Yuvraj Sahu on 15-06-2023
            # Reason - to save rating in order table
            if 'rating' in order:
                orderObj.rating = order['rating']
            else:
                pass
            # End of addition by Yuvraj Sahu on 15-06-2023

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
            # Added by Yuvraj Sahu on 15-06-2023
            # Reason - to save overall rating
            order.rating=request.data['overallRating']
            # End of addition by Yuvraj Sahu on 15-06-2023
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

        orderItems = OrderItem.objects.filter(order_id=orderId).order_by('-id')

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

        # Commented and modified by :- Parineeta Gedam on 23-06-2023 reason :- latest item show in top
        # itemObjs = OrderItem.objects.filter(order_id=pk)
        itemObjs = OrderItem.objects.filter(order_id=pk).order_by('-id')
        # End of Commented and modified code by :- Parineeta Gedam on 23-06-2023 reason :- latest item show in top

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

# Commented by - Ashish Dewangan on 04-06-2023
# Reason - No need to get setting by Id    
# Added by - Ashish Dewangan on 02-06-2023
# Reason - API to get setting by id
# class AppThemeByIdAPI(APIView):
#     def get(self,request,tenant,settingId):
#         setting=Setting.objects.get(id=settingId)
#         theme=AppTheme.objects.all()
#         themeSerializer=AppThemeSerializer(theme,many=True)
#         data=dict()
        
#         if setting:
#             settingSerializer=SettingSerializer(setting)
#             data["setting"]=settingSerializer.data
#         else:
#             data["setting"]={}  
#         if theme:
#             themeSerializer=AppThemeSerializer(theme,many=True)
#             data["themeOptions"]=themeSerializer.data
#         else:
#             data["themeOptions"]=[] 
#         return Response({"msg":"success","setting":data["setting"],"themeOptions":data["themeOptions"]})
# End of code addition by - Ashish Dewangan on 02-06-2023. Reason - to get setting data by id    
# End of comment by Ashish Dewangan on 04-06-2023

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
        
        # Added by Rohan Kansari - 7/9/23 
        # Reason - To send tenant contact number for order creation
        from admin_app.models import Tenant, RestaurantRequest
        tenantObj = Tenant.objects.get(tenant_name=tenant)

        restaurantObj={
            "contact_number":tenantObj.restaurant_name.mobile_number
        }

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

        return Response({"msg":"success","setting":data["setting"],"themeOptions":data["themeOptions"],"restaurant":restaurantObj})
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

            # Commented and modified by - Ashish Dewangan on 02-06-2023
            # Reason - exception was not being handled when empty id was coming
            # obj = Setting.objects.get(id=request.data["id"])
            # serial = SettingSaveSerializer(obj, data=request.data)
            try:
                obj = Setting.objects.get(id=request.data["id"])
                serial = SettingSaveSerializer(obj, data=request.data)
            except Exception as e:
                serial = SettingSaveSerializer(data=request.data)
            # End of code modification by - Ashish Dewangan. Reason - exception handling        
        else :
            serial = SettingSaveSerializer(data=request.data)
        if serial.is_valid():
            serial.save()

            # Added by - Ashish Dewangan on 05-06-2023
            # Reason - To send latest response
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

            return Response({"msg":"Updated successfully","setting":data["setting"],"themeOptions":data["themeOptions"]})
            # End of code addition by - Ashish Dewangan on 05-06-2023
            # Reason - To send latest response

            # return Response({
            #     "msg": "Saved Successfully",
            #     "settingsetdata": serial.data,
            # }, status=status.HTTP_201_CREATED)
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
        # print(request.data)
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
        todays_newly_placed_orders=Order.objects.filter(date__gte=today,order_status='Placed').order_by("-id")
        todays_newly_placed_orders_serializer=OrderSerializer(todays_newly_placed_orders, many=True)
        # End of code addition by Ashish Dewangan on 19-04-2023

        # Commented and modified by - Ashish Dewangan on 19-04-2023
        # Reason - to not show placed orders on todays pending orders
        #todays_orders=Order.objects.filter(date__gte=today,payment_status='Pending')
        from django.db.models import Q
        # Modified by Rohan Kansari- 30/5/23
        # Reason - To get paid payment also in pending list 
        # todays_pending_orders=Order.objects.filter(~Q(order_status='Placed') ,date__gte=today, payment_status='Pending')
        todays_pending_orders=Order.objects.filter(~Q(order_status='Placed'),Q(payment_status='Pending')|Q(payment_status='Paid') ,date__gte=today).order_by("-id")
        # End of code addition - Rohan Kansari - 30/5/23
        todays_pending_orders_serializer=OrderSerializer(todays_pending_orders, many=True)
        #End of code modification by Ashish Dewangan on 19-04-2023

        # Added by - Ashish Dewangan on 19-04-2023
        # Reason - To show todays completed orders
        todays_completed_orders=Order.objects.filter(date__gte=today,payment_status='Completed').order_by("-id")
        todays_completed_orders_serializer=OrderSerializer(todays_completed_orders, many=True)
        # End of code addition by Ashish Dewangan on 19-04-2023

        # Added by Rohan kansari-24/6/23
        # Reason - To get order item in fixed organize manner  
        todays_order_item=OrderItem.objects.all().filter(date__gte=today).order_by("-id")
        # End of code - Rohan kansari- 24/6/23
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

# Modified code by :- PArineeta Gedam on 30-06-2023 reason :- some change for proper calculations 
# Added by Yuvraj Sahu on 17-4-2023
# Reason - to update payment and order status
class UpdateOrderPaymentStatus(APIView):
    def put(self, request, tenant, orderID):
        orderObj = Order.objects.get(order_id = orderID)
        if request.data["order_status"] == "Confirm" :
            # Added by Yuvraj Sahu on 21-06-2023
            # Reason - to update kot print status when we confirm order
            # OrderItem.objects.filter(order_id__order_id=orderID, item_status="Pending").update(item_status="Confirm")
            OrderItem.objects.filter(order_id__order_id=orderID, item_status="Pending").update(item_status="Confirm", kot_print_status=True)
            # end of updating kot print status by Yuvraj Sahu on 21-06-2023
		 # Added by :- Parineeta Gedam on 17-06-2023
        # Reason :- if order cancel by admin then in cancelled by field save the Admin
        if request.data["order_status"] == "Cancelled":
            orderObj.cancelled_by = "Admin"
        # End of added code by :- Parineeta Gedam on 17-06-2023

        # Modified code by :- [parineeta Gedam on 30-06-2023 reason :- some change for proper calculations
        orderSerializedData = OrderSerializer(orderObj,request.data, partial=True)

        try:
            validated_data = orderSerializedData.is_valid()
            if validated_data and orderSerializedData.is_valid(raise_exception=True):
                orderSerializedData.save()

        # End of Modified code by :- parineeta Gedam on 30-06-2023 reason :- some change for proper calculations
            
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
                todays_newly_placed_orders=Order.objects.filter(date__gte=today,order_status='Placed').order_by("-id")
                todays_newly_placed_orders_serializer=OrderSerializer(todays_newly_placed_orders, many=True)

                from django.db.models import Q
                # Modified by Rohan Kansari- 30/5/23
                # Reason - To get paid payment also in pending list 
                # todays_pending_orders=Order.objects.filter(~Q(order_status='Placed'),date__gte=today,payment_status='Pending')
                todays_pending_orders=Order.objects.filter(~Q(order_status='Placed'),Q(payment_status='Pending')|Q(payment_status='Paid') ,date__gte=today).order_by("-id")
                # End of code addition - Rohan Kansari - 30/5/23
                todays_pending_orders_serializer=OrderSerializer(todays_pending_orders, many=True)

                todays_completed_orders=Order.objects.filter(date__gte=today,payment_status='Completed').order_by("-id")
                todays_completed_orders_serializer=OrderSerializer(todays_completed_orders, many=True)

                return Response({"success":"Updated status","order_items":todays_order_item_serializer.data 
                                ,"todays_newly_placed_orders":todays_newly_placed_orders_serializer.data
                                ,"todays_pending_orders":todays_pending_orders_serializer.data
                                ,"todays_completed_orders":todays_completed_orders_serializer.data,
                                # Modified code by :- [parineeta Gedam on 30-06-2023 reason :- some change for proper calculations
                                "order":orderSerializedData.data
                                # End of Modified code by :- parineeta Gedam on 30-06-2023 reason :- some change for proper calculations
                                
                                },status=status.HTTP_201_CREATED)
                # End of code - Rohan Kansari - 19/5/23
            return Response({"error":orderSerializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error":"error"})
# End of addition
# End of Modified code by :- Parineeta Gedam on 30-06-2023 reason :- some change for proper calculations 


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
        # print(request.data)
        #    orderItem=OrderItem.objects.filter(order_id=orderObj.id)
        # Modofied by ROhan kansari - 14/7/23
        # To add cancellation feature
        cartItem = []
        itemsPrice = []
        for i,data in enumerate(request.data):
                # Modified By Rohan Kansari - 24/6/23
                # Reason - To update item status from save method Not from update method becuase many thing happening on 
                # Model save middlware
                # OrderItem.objects.filter(id=data["id"]).update(item_status=data['item_status'])
                
                if(data['item_status'] != "Cancelled") : 
                    
                    # orderItemObj=OrderItem.objects.get(id=data["id"])
                    # orderItemObj.item_status=data['item_status']
                    # orderItemObj.save()
                    
                    orderItem = OrderItem.objects.get(id=data['id'])
                    orderItem.quantity=data['quantity']
                    orderItem.price=data['price']
                    orderItem.item_status = data['item_status']
                    #Added by ROhan kansari - 29/7/23
                    #Reason - to set confirm kot true
                    # commenting by Rohan kansari - 4/8/23
                    # Reason - handeling it in order save method
                    # if(data['item_status']=="Confirm"):
                    #     orderItem.kot_print_status=True 
                    #End of code additon - Rohan kansari - 29/7/23    
                    orderItem.save()
                    cartItem.append(orderItem)
                    itemsPrice.append(orderItem.price)

                else:
                    orderItemId  = OrderItem.objects.get(id = data["id"])
                    orderId = Order.objects.get(order_id=orderID)
                    orderItemId.item_status = "Cancelled"
                    orderItemId.save()

                    # commented and modified by :- Parineeta Gedam on 23-06-2023 reason :- latest data show on the top
                    # orderItemsObj = OrderItem.objects.filter(order_id=orderId.id)
                    # orderItemsObj = OrderItem.objects.filter(order_id=orderId.id)
                    # End of commented and modified by :- Parineeta Gedam on 23-06-2023 reason :- latest data show on the top 
                    orderItemOrderId = OrderItem.objects.filter(order_id=orderId.id).order_by('-id')

                    orderItemserializer = OrderItemSerializer(orderItemOrderId, many=True)
                

                    updatedOrderValues=dict()

                    flag=False
                    for orderItem in orderItemOrderId :
                        if(orderItem.item_status != "Cancelled"):
                            flag=True
                            break

                    if flag == False :
                        updatedOrderValues['cancelled_by'] = "Admin"
                        updatedOrderValues['order_status'] = "Cancelled"        
                    
                    # End of added code by :- Parineeta Gedam on 28-06-2023 reason :- if all item is cancel then order status is cancelled

                    orderSerializer=OrderSerializer(orderId,data=updatedOrderValues,partial=True)
                    try:
                        if orderSerializer.is_valid(raise_exception=True):
                            orderSerializer.save()
                    except Exception as e:
                        print("Exception occured on deleteOrderAPI",e)    

                
                # orderItemSerializer = OrderItemSerializer(cartItem, many=True)

        order = Order.objects.get(order_id=orderID)
        subTotal = round(float("{:.2f}".format(sum(itemsPrice))),2)
        order.sub_total=subTotal
        order.save()
                # OrderSerializers = AllOrderSerializer(order)
                
        
        orderItem=OrderItem.objects.filter(order_id=orderObj.id).order_by("-id")
        serializer=OrderItemWithOrderIdSerializer(orderItem,many=True)
        # ENd of code - ROhan kansari - 14/7/23 - To add cancellation feature

    #    Added by Rohan Kansari -25/6/23
    #    Reason - to get Updated order in order item update also
        from django.utils.timezone import datetime
        today=datetime.today().date()
        
        todays_newly_placed_orders=Order.objects.filter(date__gte=today,order_status='Placed').order_by("-id")
        todays_newly_placed_orders_serializer=OrderSerializer(todays_newly_placed_orders, many=True)

        from django.db.models import Q
        todays_pending_orders=Order.objects.filter(~Q(order_status='Placed'),Q(payment_status='Pending')|Q(payment_status='Paid') ,date__gte=today).order_by("-id")
        todays_pending_orders_serializer=OrderSerializer(todays_pending_orders, many=True)

        todays_completed_orders=Order.objects.filter(date__gte=today,payment_status='Completed').order_by("-id")
        todays_completed_orders_serializer=OrderSerializer(todays_completed_orders, many=True)

        return Response({"success":"Updated status","order_items":serializer.data 
                            ,"todays_newly_placed_orders":todays_newly_placed_orders_serializer.data
                            ,"todays_pending_orders":todays_pending_orders_serializer.data
                            ,"todays_completed_orders":todays_completed_orders_serializer.data},status=status.HTTP_201_CREATED)
                

    # ENd of code - Rohan kansari - 25/6/23
    #    return Response(serializer.data)                     


# End of code - Rohan Kansari - 22/5/23

# Added by Rohan Kansari - 25/5/23
# Reason - To update item status 

class UpdateAllOrderStatus(APIView):
    def post(self, request, tenant):
        allData=request.data["orders"]
       
        for data in allData:
            # print(request.data["order_status"],request.data['payment_status'],data['order_status'],data["payment_status"])
            # Added by yuvraj Sahu on 29-06-2023
            # Reason - to update data when order and payment status is comming from front end
            orderObj = Order.objects.get(order_id=data["order_id"])
            if "order_status" in request.data :
                # Added by Yuvraj Sahu on 14-08-2023
                # Reason - to update the order status
                # data['order_status']=request.data["order_status"]
                updateOrder = {"order_status" : request.data['order_status']}
                serializedData = OrderSerializer(orderObj, data=updateOrder, partial=True)
                if serializedData.is_valid() :
                    serializedData.save()
            if "payment_status" in request.data :
                # Added by Yuvraj Sahu on 14-08-2023
                # Reason - to update the order status
                # data["payment_status"]=request.data['payment_status']
                updateOrder = {"payment_status" : request.data['payment_status']}
                serializedData = OrderSerializer(orderObj, data=updateOrder, partial=True)
                if serializedData.is_valid(raise_exception=True) :
                    serializedData.save()
            # if "order_status" in request.data :
            # End of addition by yuvraj sahu on 29-06-2023
                # if request.data["order_status"] == "Confirm":
                #     OrderItem.objects.filter(order_id__order_id=data['order_id'], item_status="Pending").update(item_status="Confirm")
                # Added by Yuvraj Sahu on 07-08-2023
                # Reason - to update the cancel the order items
                # if request.data["order_status"] == "Cancelled":
                #     OrderItem.objects.filter(order_id__order_id=data['order_id']).update(item_status="Cancelled")
                # End of addition by Yuvraj Sahu on 07-08-2023
            # Order.objects.filter(order_id = data['order_id']).update(order_status=data["order_status"],payment_status=data['payment_status'])
          


        from django.utils.timezone import datetime
        today=datetime.today().date()
        
        todays_order_item=OrderItem.objects.filter(date__gte=today)
        todays_order_item_serializer=OrderItemWithOrderIdSerializer(todays_order_item, many=True)
        todays_newly_placed_orders=Order.objects.filter(date__gte=today,order_status='Placed').order_by("-id")
        todays_newly_placed_orders_serializer=OrderSerializer(todays_newly_placed_orders, many=True)

        from django.db.models import Q
        # Modified by Rohan Kansari- 30/5/23
        # Reason - To get paid payment also in pending list 
        # todays_pending_orders=Order.objects.filter(~Q(order_status='Placed'),date__gte=today,payment_status='Pending')
        todays_pending_orders=Order.objects.filter(~Q(order_status='Placed'),Q(payment_status='Pending')|Q(payment_status='Paid') ,date__gte=today).order_by("-id")
        # End of code addition - Rohan Kansari - 30/5/23
        todays_pending_orders_serializer=OrderSerializer(todays_pending_orders, many=True)

        todays_completed_orders=Order.objects.filter(date__gte=today,payment_status='Completed').order_by("-id")
        todays_completed_orders_serializer=OrderSerializer(todays_completed_orders, many=True)

        return Response({"success":"Updated status","order_items":todays_order_item_serializer.data 
                            ,"todays_newly_placed_orders":todays_newly_placed_orders_serializer.data
                            ,"todays_pending_orders":todays_pending_orders_serializer.data
                            ,"todays_completed_orders":todays_completed_orders_serializer.data},status=status.HTTP_201_CREATED)
                
       
        # return Response(request.data)                     


# End of code - Rohan Kansari - 25/5/23

# Added by :- Parineeta Gedam
# Date :- 17-04-2023
# Reason : check order confirm used in react js
class CheckOrderConfirmAPIView(APIView):
    def post(self, request, tenant):
        orderObj = Order.objects.get(order_id=request.data['order_id'])
        serializer = OrderSerializer(orderObj)
       
        return Response({"order": serializer.data}, 200)
# End of code addition by Parineeta Gedam on 17-04-2023

# Added by :- Parineeta Gedam
# Date :- 16-05-2023
# Reason : API for update the orders used in react js and native

class DeleteOrderItemsAPIView(APIView):
    def put(self, request, tenant):
        orderItemId  = OrderItem.objects.get(id = request.data['orderItem'])
        orderId = Order.objects.get(order_id=request.data['order'])
        orderItemId.item_status = "Cancelled"
        orderItemId.save()

        # commented and modified by :- Parineeta Gedam on 23-06-2023 reason :- latest data show on the top
        # orderItemsObj = OrderItem.objects.filter(order_id=orderId.id)
        orderItemsObj = OrderItem.objects.filter(order_id=orderId.id).order_by('-id')
        # End of commented and modified by :- Parineeta Gedam on 23-06-2023 reason :- latest data show on the top 

        orderItemserializer = OrderItemSerializer(orderItemsObj, many=True)
       
        orderItemOrderId = OrderItem.objects.filter(order_id=orderId.id)

        #  Modified by :- Parineeta Gedam on 23-06-2023  
        updatedOrderValues=dict()
        itemsPrice = []
        for orderItem in orderItemOrderId :
            if(orderItem.item_status != "Cancelled"):
                price = orderItem.price
                itemsPrice.append(price)
        # End of modified code by :- Parineeta Gedam on 23-06-2023

        # Commented by :- Parineeta Gedam on 28-06-2023 reason :- change the conditions for cancel
        # Added by :- Parineeta Gedam on 24-06-2023 reason :- if customer cancel the order then cancelled by save as a customer and if admin cancel the order then cancelled by save as a admin and also order status will be cancelled
        # if "cancelled_by" in request.data :
        #     updatedOrderValues['cancelled_by'] = request.data['cancelled_by']
        #     updatedOrderValues['order_status'] = "Cancelled"
        # End of added code by :- Parineeta Gedam on 24-06-2023.
        # End of Commented by :- Parineeta Gedam on 28-06-2023 reason :- change the conditions for cancel

        # Added by :- Parineeta Gedam on 28-06-2023 reason :- if all item is cancel then order status is cancelled
        flag=False
        for orderItem in orderItemOrderId :
            if(orderItem.item_status != "Cancelled"):
                flag=True
                break

        if flag == False :
            updatedOrderValues['cancelled_by'] = request.data['cancelled_by']
            updatedOrderValues['order_status'] = "Cancelled"        
           
        # End of added code by :- Parineeta Gedam on 28-06-2023 reason :- if all item is cancel then order status is cancelled

        updatedOrderValues['sub_total'] = round(float("{:.2f}".format((sum(itemsPrice)))),2)
        orderSerializer=OrderSerializer(orderId,data=updatedOrderValues,partial=True)
        try:
            if orderSerializer.is_valid(raise_exception=True):
                orderSerializer.save()
        except Exception as e:
            print("Exception occured on deleteOrderAPI",e)               
        return Response({"orderItem":orderItemserializer.data, "order":orderSerializer.data})
        

# Modified by :- Parineeta Gedam on 30-06-2023 
# reason :- for re-calculations 

# Added by :- Parineeta Gedam
# Date :- 17-05-2023
# Reason : API for update the orders

class PostUpdateOrderItemsAPIView(APIView):
    def put(self, request, tenant):

        # Commented by :- Parineeta Gedam on 30-06-2023 
        # orderId = Order.objects.get(order_id=request.data['orders'])
        # orderItemId = OrderItem.objects.filter(order_id=orderId.id)
        # End of Commented code by :- Parineeta Gedam on 30-06-2023 

        order = request.data['order']
        cartItem = []
        itemsPrice = []

        # Modified by :- Parineeta Gedam on 10-06-2023 
        # Ticket no :- 298
        # reason :- In native side, in order details page,  if we click on update button then show the value error for solving this modified that code. 
        
        # if(order['order_status'] == "Placed") : 
        for cart in request.data['orderItems']:
            if(cart['item_status'] != "Cancelled") : 
                orderItem = OrderItem.objects.get(id=cart['id'])
                orderItem.quantity=cart['quantity']
                orderItem.price=cart['price']
                orderItem.item_status = cart['item_status']
                orderItem.save()
                cartItem.append(orderItem)
                itemsPrice.append(orderItem.price)

        orderItemSerializer = OrderItemSerializer(cartItem, many=True)

        order = Order.objects.get(order_id = request.data["orders"])
        subTotal = round(float("{:.2f}".format(sum(itemsPrice))),2)
        order.sub_total=subTotal
        order.save()
        OrderSerializers = AllOrderSerializer(order)
       
        # End of Modified code by Parineeta Gedam on 10-06-2023

        # Added and modified code by :- Parineea Gedam on 25-06-2023 
        # reason :- changes in calculations 
        # if order['discount_rupees'] > 0:
        #     orderData  = Order.objects.filter(order_id = request.data['orders']).update(
        #     sub_total=round( float("{:.2f}".format(order['sub_total'])),2), 
        #     cgst = round( float("{:.2f}".format(order['cgst'])),2), 
        #     sgst = round( float("{:.2f}".format(order['sgst'])),2), 
        #     total = round( float("{:.2f}".format(order['total'])),2),
        #     final_amount = round( float("{:.2f}".format(order['final_amount'])),2),)
        # else :
        #     orderData  = Order.objects.filter(order_id = request.data['orders']).update(
        #         sub_total=round( float("{:.2f}".format(order['sub_total'])),2), 
        #         cgst = round( float("{:.2f}".format(order['cgst'])),2), 
        #         sgst = round( float("{:.2f}".format(order['sgst'])),2), 
        #         total = round( float("{:.2f}".format(order['final_amount'])),2),
        #         # final_amount = round( float("{:.2f}".format(order['total'])),2),
        #         final_amount = round( float("{:.2f}".format(order['final_amount'])),2),
        #    )
        # End of Added and modified code by :- Parineea Gedam on 25-06-2023 reason :- changes in calculations 
        # orderObject = Order.objects.filter(order_id = request.data['orders']).values()[0]
        return Response({"orderItem":orderItemSerializer.data, "order":OrderSerializers.data})
# End of added code by :- Parineeta Gedam on 17-05-2023
# End of Modified code by :- Parineeta Gedam on 30-06-2023 reason :- for re-calculations

# Added by :- Parineeta Gedam
# Date :- 22-05-2023
# Reason : API for get the order items and order used in react js

class GetOrderItemsAndOrderAPIView(APIView):
    def post(self, request, tenant):
        orderId = Order.objects.get(order_id=request.data['order'])
        orderSerializer = OrderSerializer(orderId)

        # Modified by :- Parineeta GEdam on 22-06-2023 reason :- show latest item on the top
        # orderItemId = OrderItem.objects.filter(order_id=orderId.id)
        orderItemId = OrderItem.objects.filter(order_id=orderId.id).order_by('-id')
        # End of Modified code by :- Parineeta GEdam on 22-06-2023 reason :- show latest item on the top

        orderItemsSerializer = OrderItemSerializer(orderItemId, many=True)
        return Response({"orderItem":orderItemsSerializer.data, "order": orderSerializer.data})
    
# End of added code by :- Parineeta Gedam on 22-05-2023

# Commented by :- Parineeta Gedam on 10-07-2023 
# reason :-Implement Order Item update functionality.

# # Added by :- Parineeta Gedam new
# # Date :- 17-05-2023
# # Reason : API for Add order items used in react native
# class AddOrderItemsAPIView(APIView):
#     def post(self, request, tenant):
#         OrderItem(
#             order_id = Order.objects.get(id = request.data["order_id"]),
#             item = request.data["item"],
#             item_id = Item.objects.get(id = request.data["item_id"]),
#             serving_size = request.data["serving_size"],
#             quantity = request.data["quantity"],
#             item_status = request.data["item_status"]
#         ).save()

#         # Commented and modified code by :- Parineeta Gedam on 23-06-2023 reason :- show latest item on top
#         # orderItemsObj = OrderItem.objects.filter(order_id__order_id = request.data["order_order_id"])
#         orderItemsObj = OrderItem.objects.filter(order_id__order_id = request.data["order_order_id"]).order_by('-id')
#         # End of Commented and modified code by :- Parineeta Gedam on 23-06-2023 reason :- show latest item on top
#         orderItemsSerializer=OrderItemSerializer(orderItemsObj, many=True)

#         # Modified by :- Parineeta Gedam on 28-06-2023
#         # reason :- re calculations
#         itemsPrice = []
#         for cart in orderItemsObj:
#             if(cart.item_status != "Cancelled") :
#                 price = cart.price
#                 itemsPrice.append(price)
#         order = Order.objects.get(order_id = request.data["order_order_id"])
#         subTotal = round(float("{:.2f}".format(sum(itemsPrice))),2)
#         order.sub_total=subTotal
#         order.order_status="Placed"
#         order.save()
#         OrderSerializers = AllOrderSerializer(order)
#         # End of added code by Parineeta Gedam on 28-06-2023
#         return Response({"msg":"success", "orderItems":orderItemsSerializer.data,"order":OrderSerializers.data})

# # # End of added code by :- Parineeta Gedam on 17-05-2023 
# End of commented code by :- Parineeta Gedam on 10-07-2023 reason :- Implement Order Item update functionality.

# Added by :- Parineeta Gedam 
# date :- 10-07-2023
# reason :- Implement Order Item update functionality.
class AddOrderItemsAPIView(APIView):
    def post(self, request, tenant):

        allOffer = OfferItem.objects.all()

        orderItemsList = OrderItem.objects.filter(order_id__order_id = request.data["order_order_id"]).order_by('-id')
        
        # Modified by :- Parineeta Gedam on :- 15-07-2023 reason :- Implement Order Item update functionality >> When admin confirm the order & user again order same item then in UI panel again a new row is generate for same item.
        # filteredItems = orderItemsList.filter(item_id=request.data["item_id"],serving_size = request.data["serving_size"])
        filteredItems = orderItemsList.filter(item_id=request.data["item_id"],serving_size = request.data["serving_size"], item_status = "Pending")
        # End of Modified by :- Parineeta Gedam on :- 15-07-2023 reason :- Implement Order Item update functionality >> When admin confirm the order & user again order same item then in UI panel again a new row is generate for same item.


        if filteredItems.count() > 0 :
            originalOldOrderItemObject = filteredItems.first()
            oldOrderItemObject = filteredItems.first()
            if oldOrderItemObject.item_status != "Confirm" and oldOrderItemObject.item_status != "Cancelled" :
                cartData = dict()
                item = Item.objects.get(id=request.data['item_id'])
                discounted = 0
                if allOffer.filter(item_name=item).count() > 0:
                    if allOffer.get(item_name=item).offer_name.discount is not None:
                        discounted = allOffer.get(item_name=item).offer_name.discount
                cartData["quantity"]=  int(request.data['quantity']) + oldOrderItemObject.quantity
                cartData["price"] = float(item.price_full * cartData["quantity"])-float(item.price_full * cartData["quantity"]/100)*float(discounted)
                cartData["item_status"] = "Pending"
                orderItemsSerializer = OrderItemSerializer(originalOldOrderItemObject, data=cartData, partial=True)
                try:
                    if orderItemsSerializer.is_valid(raise_exception=True):
                        orderItemsSerializer.save()
                except Exception as e:
                    return {"error": e}
                     
            else :
                OrderItem(
                    order_id = Order.objects.get(id = request.data["order_id"]),
                    item = request.data["item"],
                    item_id = Item.objects.get(id = request.data["item_id"]),
                    serving_size = request.data["serving_size"],
                    quantity = request.data["quantity"],
                    item_status = request.data["item_status"]
                ).save()

        else :
            OrderItem(
                order_id = Order.objects.get(id = request.data["order_id"]),
                item = request.data["item"],
                item_id = Item.objects.get(id = request.data["item_id"]),
                serving_size = request.data["serving_size"],
                quantity = request.data["quantity"],
                item_status = request.data["item_status"]
            ).save()

        orderItemsSerializer=OrderItemSerializer(orderItemsList, many=True)

        itemsPrice = []
        for cart in orderItemsList:
            if(cart.item_status != "Cancelled") :
                price = cart.price
                itemsPrice.append(price)
        order = Order.objects.get(order_id = request.data["order_order_id"])
        subTotal = round(float("{:.2f}".format(sum(itemsPrice))),2)
        order.sub_total=subTotal
        order.order_status="Placed"
        order.save()

        OrderSerializers = AllOrderSerializer(order)

        return Response({"msg":"success", "orderItems":orderItemsSerializer.data,"order":OrderSerializers.data})

# End of added code by :- Parineeta Gedam on 10-07-2023 reason :- Implement Order Item update functionality


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


"""
Added by Yuvraj Sahu on 25-05-2023
Reason - to get social links
"""
"""
This method is used for get social media name and links
"""
class SocialLinksAPIView(APIView) :
    def get(self, request, tenant):
        socialObjs = SocialLinks.objects.all()
        serialized=SocialLinksSerializer(socialObjs, many=True)
        return Response({
            "msg":"success",
            "social":serialized.data,
            })
    
    def post(self,request,tenant):
    # Added by Yuvraj Sahu on 07-06-2023
    # Reason - to update and also save social media in same api
        if "id" in request.data :
            obj = SocialLinks.objects.get(id=request.data["id"])
            serializedData = SocialLinksSerializer(obj, data=request.data)
        else :
            serializedData = SocialLinksSerializer(data=request.data)
    # End of addition by Yuvraj Sahu on 07-06-2023
        socialObjs = SocialLinks.objects.all()
        serialized=SocialLinksSerializer(socialObjs, many=True)
        if serializedData.is_valid():
            serializedData.save()
            return Response({"msg": "Saved Successfully", "SocialLinkObjs" : serialized.data}, status=status.HTTP_201_CREATED)
        return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    # Added by Yuvraj Sahu on 27-05-2023
    # Reason - to update and delete social media
    def put(self, request, tenant, id):
        socialLinkObj = SocialLinks.objects.get(id=id)
        serializedData = SocialLinksSerializer(socialLinkObj, request.data)
        if serializedData.is_valid(raise_exception=True) :
            serializedData.save()
            return Response ({"message":"Updated Successfully", "data":serializedData.data}, status=status.HTTP_201_CREATED)
        return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request,tenant, id):
        socialLinkObj = SocialLinks.objects.get(id=id)
        if socialLinkObj :
            socialLinkObj.delete()
            socialObjs = SocialLinks.objects.all()
            serialized=SocialLinksSerializer(socialObjs, many=True)
            return Response({"msg": "Deleted Successfully", "socialData" : serialized.data}, status=status.HTTP_201_CREATED)
        return Response({"error": "error"}, status=404)
    # End of addition by Yuvraj Sahu on 27-05-2023
"""
End of addition by Yuvraj Sahu on 25-05-2023
"""



# Added by :- Rohan Kansari
# Date :- 28-05-2023
# Reason : API for post for filter query in order report
import datetime
from django.utils.timezone import datetime

class OrderFilterAPIView(APIView):
    def post(self, request, tenant):

        # Commented by :- Parineeta Gedam on 04-08-2023 reason :- chnages in logic
        # print("request", request.data)
        # object = Order.objects.filter(
        #     date__range=[request.data['dateFrom'], request.data['dateTo']])
        # if (request.data["amountSort"]):
        #     object = object.order_by("-total")
        # print("object", object)
        # serialize = OrderSerializer(object, many=True)
        # return Response(serialize.data)
        # Commented by :- Parineeta Gedam on 04-08-2023 reason :- chnages in logic

        # Added by :- Parineeta Gedam on 04-08-2023 reason :- chnages in logic
        # print("request", request.data)

        # Modified by Rohan kansari - 19/8/23
        # Reason To apply multiple filter functionality
        paginationDetails=request.data['paginationDetails']
        columnToSort=request.data['columnToSort']
        columnSortingOrder=request.data['columnSortingOrder']
        currentPage=paginationDetails['currentPage']
        listPerPage=paginationDetails['listPerPage']
        paymentStatus=request.data['paymentStatus'] 
        orderStatus=request.data['orderStatus'] 
        quickSelect = request.data['quickSelect']
        # print("orderStatus",orderStatus)
        orderList = Order.objects.none().filter()
        # print("---------------------",request.data)

        if columnToSort == "":
            orderList = Order.objects.all()  
        # if request.data['dateFrom'] :
        #     orderList = Order.objects.filter(date__range=[request.data['dateFrom'], request.data['dateTo']])
    
        # print("--------------------- after column sort",request.data)

        if quickSelect['today'] == True :
            todayDate = datetime.today().date()
            print("todayDate",todayDate)
            orderList = Order.objects.filter(date__gte=todayDate)
            print("orderList today", orderList)

        # print("--------------------- after today",request.data)
        
        if quickSelect['week'] == True :
            one_week_ago = datetime.today() - timedelta(days=7)
            orderList = Order.objects.filter(date__gte=one_week_ago)
            # print("===============================", datetime.date.today().week)
            # orderList = Order.objects.filter(date__range=[request.data['startDate'], request.data['endDate']])
        if quickSelect['month'] == True :
            # print("===============================", datetime.date.today().month)
            orderList = Order.objects.filter(date__month=datetime.now().month) 
        if quickSelect['year'] == True :
            # # print("===============================",datetime.date.today().year)
            # Order.objects.filter(created_at__year=today.year)
            orderList = Order.objects.filter(date__year=datetime.now().year)
            # print("try''''''''''''''''''''''''''''' ",orderList)    

        # print("--------------------- after week",orderList)

        print(request.data['startDate'], request.data['endDate'])

        if request.data['startDate'] :
            orderList = Order.objects.filter(date__gte=request.data['startDate'],date__lt=request.data['endDate'])
        # else :
        #     orderList = Order.objects.all()
        # print("====================",orderList)

        # here is some issue
        if columnToSort == "order_id" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('order_id')
        elif columnToSort == "order_id" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-order_id')
        #Added by Rohan kansari - 4/9/23 - To arrange other selected column  
        elif columnToSort == "table_number" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('table_number')    
        elif columnToSort == "table_number" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-table_number')   
        elif columnToSort == "date" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('date')    
        elif columnToSort == "date" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-date')  
        elif columnToSort == "subtotal" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('sub_total')    
        elif columnToSort == "subtotal" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-sub_total')    
        elif columnToSort == "discount" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('discount_rupees')    
        elif columnToSort == "discount" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-discount_rupees')
        elif columnToSort == "loyalty" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('loyality_point_price')    
        elif columnToSort == "loyalty" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-loyality_point_price')     
        elif columnToSort == "total" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('total')    
        elif columnToSort == "total" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-total')      
        elif columnToSort == "cgst" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('cgst')    
        elif columnToSort == "cgst" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-cgst')      
        elif columnToSort == "sgst" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('sgst')    
        elif columnToSort == "sgst" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-sgst') 
        elif columnToSort == "final_amount" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('final_amount')    
        elif columnToSort == "final_amount" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-final_amount')                        
        #End of code by Rohan kansari - 4/9/23 - To arrange other selected column  
        # print("------------second k",orderList)    

        pendingOrder = []
        completedOrder = []
        placedOrder = []
        confirmOrder = []
        cookedOrder = []
        servedOrder = []
        cancelledOrder = []

        orderPaymentList=[]

        # print("------------declaration",orderList) 
       
        if paymentStatus['pending'] == False and paymentStatus['completed'] == True :
           orderPaymentList= orderList.filter(payment_status = "Completed")
        elif paymentStatus['pending'] == True and paymentStatus['completed'] == False :
            orderPaymentList = orderList.filter(payment_status = "Pending")
        else :
            orderPaymentList = orderList

        
     
        if orderStatus['placed'] == True :
            placedOrder = orderPaymentList.filter(order_status = "Placed")
           
        if orderStatus['confirm'] == True :
            confirmOrder = orderPaymentList.filter(order_status = "Confirm")

        if orderStatus['cooked'] == True :
            cookedOrder = orderPaymentList.filter(order_status = "Cooked")

        if orderStatus['served'] == True :
            servedOrder = orderPaymentList.filter(order_status = "Served")

        if orderStatus['cancelled'] == True :
            cancelledOrder = orderPaymentList.filter(order_status = "Cancelled")
      
        # print("------------initialize",orderList) 
        
        orderStatusList=Order.objects.none()

        if len(placedOrder):
            orderStatusList=orderStatusList | placedOrder
        if len(confirmOrder):
            orderStatusList=orderStatusList | confirmOrder    
        if len(cookedOrder):
            orderStatusList=orderStatusList | cookedOrder    
        if len(servedOrder):
            orderStatusList=orderStatusList | servedOrder
        if len(cancelledOrder):
            orderStatusList=orderStatusList | cancelledOrder
        #Modified by Rohan kansari - 21/8/23
        #Reason - To dont set default value if any one is selected    
        if  (orderStatus['placed'] | orderStatus['confirm'] 
                                        | orderStatus['cooked'] | orderStatus['served'] 
                                        | orderStatus['cancelled']):
           pass
        else:
        #End of modification by Rohan kansari - 21/8/23
        #Reason - To dont set default value if any one is selected    
           orderStatusList=orderPaymentList
        
        
       
        # print("orderlist", orderList1)
        orderListCount = len(orderStatusList)
        paginator = Paginator(orderStatusList, listPerPage)
        filteredOrderList = paginator.page(currentPage)
        orderListSerializer = OrderSerializer(filteredOrderList, many=True)
        allOrderListSerializer= OrderSerializer(orderStatusList, many=True)
        # End of modification by Rohan kansari - 19/8/23
        # Reason To apply multiple filter functionality
        return Response({
            "msg":"success",
            "orderList":orderListSerializer.data,
            "orderListCount":orderListCount,
            "allReportList":allOrderListSerializer.data
        })
    #  End of Added code by :- Parineeta Gedam on 04-08-2023 reason :- chnages in logic
# End of added code by :- Rohan Kansari on 28-05-2023


# Added by :- Rohan Kansari
# Date :- 28-05-2023
# Reason : API for post for filter query in order report
class OrderItemFilterAPIView(APIView):
    def post(self, request, tenant):
        from django.db.models import OuterRef, Subquery, Count, Sum, Q, Avg
        from django.contrib.postgres.search import TrigramSimilarity

        # order_items_half = OrderItem.objects.filter(date__year=thisYear,item_status='Confirm',serving_size='Half').values('item').order_by('item').annotate(count=Sum('quantity')).annotate(sum=Sum('price'))
        # order_items_full = OrderItem.objects.filter(date__year=thisYear,item_status='Confirm',serving_size='Full').values('item').order_by('item').annotate(count=Sum('quantity')).annotate(sum=Sum('price'))

        duplicate_orderHalf = OrderItem.objects.filter(serving_size='Half').values('item', 'serving_size').annotate(
            item_count=(Sum('quantity')-Count('item_status', filter=Q(item_status='Cancelled')))).annotate(
            cancellation_count=Count('item_status', filter=Q(item_status='Cancelled'))).annotate(
            sum_price=Sum('price', filter=~Q(item_status='Cancelled'), field='price  * quantity')).annotate(
            average_rating=Avg('rating')
        )

        duplicate_orderFull = OrderItem.objects.filter(serving_size='Full').values('item', 'serving_size').annotate(
            item_count=(Sum('quantity')-Count('item_status', filter=Q(item_status='Cancelled')))).annotate(
            cancellation_count=Count('item_status', filter=Q(item_status='Cancelled'))).annotate(
            sum_price=Sum('price', filter=~Q(item_status='Cancelled'), field='price  * quantity')).annotate(
            average_rating=Avg('rating')
        )

        duplicate_orders = duplicate_orderHalf | duplicate_orderFull

        if request.data['itemSort']:
            duplicate_orders = duplicate_orders.order_by("item")

        if request.data['orderSort']:
            duplicate_orders = duplicate_orders.order_by("-item_count")

        if request.data['ratingSort']:
            duplicate_orders = duplicate_orders.order_by("-average_rating")

        if request.data['cancellationSort']:
            duplicate_orders = duplicate_orders.order_by("-cancellation_count")

        if len(request.data['search']) > 0:
            duplicate_orders = duplicate_orders.filter(
                Q(item__icontains=request.data['search']))
            print(duplicate_orders)

        # if(len(request.data['search'])>0):
        #    duplicate_orders=duplicate_orders.annotate(similarity=TrigramSimilarity("item", request.data['search']),).filter(similarity__gt=0.3).order_by("-similarity")
        #    print(duplicate_orders)

        return Response({"item": duplicate_orders})
# End of added code by :- Rohan Kansari on 28-05-2023


# Added by Ashish Dewangan on 05-06-2023
# Reason - API for CRUD operation on customer
class CustomerAPI(APIView):
    
    # Added by Ashish Dewangan on 05-06-2023
    # Reason - To get count of cutomers
    def get(self,request,tenant):
         cutomersCount=CustomerDetail.objects.all().count() 
         return Response({
            "msg":"success",
            "cutomersCount":cutomersCount,
        })
    # End of code addition by - Ashish Dewangan on 05-06-2023
    # Reason - To get count of customers
    
    # Added by - Ashish Dewangan on 05-06-2023
    # Reason - To get list of customers using backend pagination.
    def post(self,request,tenant):
        paginationDetails=request.data['paginationDetails']
        columnToSort=request.data['columnToSort']
        columnSortingOrder=request.data['columnSortingOrder']
        currentPage=paginationDetails['currentPage']
        listPerPage=paginationDetails['listPerPage']

        # Commented and modified by - Ashish Dewangan on 14-06-2023
        # Reason - To enhance and add basic search functionality
        searchText=request.data['searchText']

        customerList=[]

        if columnToSort == "":
            customerList = CustomerDetail.objects.all()

        if searchText:
            customerList=CustomerDetail.objects.filter(Q(last_customer_name__icontains=searchText) | 
                                                    #    Q(last_email__icontains=searchText) |
                                                       Q(contact_number__icontains=searchText) |
                                                       Q(loyality_points__icontains=searchText))
        else:
            customerList = CustomerDetail.objects.all()    

        # if columnToSort == "last_customer_name" and columnSortingOrder=="ascending":
        #     if len(customerList) > 0:
        #         customerList = customerList.order_by('last_customer_name')
        #     else:    
        #         customerList = CustomerDetail.objects.all().order_by('last_customer_name')
        # if columnToSort == "last_customer_name" and columnSortingOrder=="descending":
        #     if len(customerList) > 0:
        #         customerList = customerList.order_by('-last_customer_name')
        #     else:    
        #         customerList = CustomerDetail.objects.all().order_by('-last_customer_name')
        # if columnToSort == "last_customer_name" and columnSortingOrder=="":
        #     customerList = CustomerDetail.objects.all()
        

        # if columnToSort == "last_email" and columnSortingOrder=="ascending":
        #     if len(customerList) > 0:
        #         customerList = customerList.order_by('last_email')
        #     else:    
        #         customerList=CustomerDetail.objects.all().order_by('last_email')
        # if columnToSort == "last_email" and columnSortingOrder=="descending":
        #     if len(customerList) > 0:
        #         customerList = customerList.order_by('-last_email')
        #     else:    
        #         customerList = CustomerDetail.objects.all().order_by('-last_email')
        # if columnToSort == "last_email" and columnSortingOrder=="":
        #     customerList=CustomerDetail.objects.all()


        # if columnToSort == "contact_number" and columnSortingOrder=="ascending":
        #     if len(customerList) > 0:
        #         customerList = customerList.order_by('contact_number')
        #     else:    
        #         customerList=CustomerDetail.objects.all().order_by('contact_number')
        # if columnToSort == "contact_number" and columnSortingOrder=="descending":
        #     if len(customerList) > 0:
        #         customerList = customerList.order_by('-contact_number')
        #     else:    
        #         customerList=CustomerDetail.objects.all().order_by('-contact_number')
        # if columnToSort == "contact_number" and columnSortingOrder=="":
        #     customerList=CustomerDetail.objects.all()


        # if columnToSort == "loyality_points" and columnSortingOrder=="ascending":
        #     if len(customerList) > 0:
        #         customerList = customerList.order_by('loyality_points')
        #     else:    
        #         customerList=CustomerDetail.objects.all().order_by('loyality_points')
        # if columnToSort == "loyality_points" and columnSortingOrder=="descending":
        #     if len(customerList) > 0:
        #         customerList = customerList.order_by('-loyality_points')
        #     else:    
        #         customerList=CustomerDetail.objects.all().order_by('-loyality_points')
        # if columnToSort == "loyality_points" and columnSortingOrder=="":
        #     customerList=CustomerDetail.objects.all()
        
        if columnToSort == "last_customer_name" and columnSortingOrder=="ascending":
            customerList = customerList.order_by('last_customer_name')
        if columnToSort == "last_customer_name" and columnSortingOrder=="descending":
            customerList = customerList.order_by('-last_customer_name')

        # if columnToSort == "last_email" and columnSortingOrder=="ascending":
        #     customerList = customerList.order_by('last_email')
        # if columnToSort == "last_email" and columnSortingOrder=="descending":
        #     customerList = customerList.order_by('-last_email')

        if columnToSort == "contact_number" and columnSortingOrder=="ascending":
            customerList = customerList.order_by('contact_number')
        if columnToSort == "contact_number" and columnSortingOrder=="descending":
            customerList = customerList.order_by('-contact_number')

        if columnToSort == "loyality_points" and columnSortingOrder=="ascending":
            customerList = customerList.order_by('loyality_points')
        if columnToSort == "loyality_points" and columnSortingOrder=="descending":
            customerList = customerList.order_by('-loyality_points')

        customerListCount=customerList.count()

        # from django.core.paginator import Paginator

        paginator = Paginator(customerList, listPerPage)
        filteredCutomerList = paginator.page(currentPage)

        customerDetailSerializer = CustomerDetailSerializer(filteredCutomerList, many =True)
        return Response({
            "msg":"success",
            "customerList":customerDetailSerializer.data,
            "customerListCount":customerListCount,
        })
        # End of code modification by - Ashish Dewangan on 14-06-2023
        # Reason - To enhance and add basic search functionality


    # End of code addition by - Ashish Dewangan on 05-06-2023
    # Reason - To get list of customers using backend pagination
    
# End of code addition by - Ashish Dewangan on 05-06-2023
# Reason - API to get list of customers 


# Added by :- Parineeta Gedam
# Date :- 01-06-2023
# Reason : API for post the reservations data for react js (Customer ui)
class PostReservationAPIView(APIView):
    def post(self, request, tenant, *args,**kwargs):
# Commented by pratap sahu on 07-09-2023
    # Reason: to add sorting,searching and pagination functionality on Reservation page in jS       
        # ReservationsSerializedData = ReservationSerializer(data=request.data)
        # if ReservationsSerializedData.is_valid():
        #     ReservationsSerializedData.save()
        # return Response({"msg": "success","reservation":ReservationsSerializedData.data})
    # End of added code by :- Parineeta Gedam on 01-06-2023
# End of Comment by pratap sahu on 07-09-2023

# Added By pratap sahu on 07-09-2023
# Reason: to add sorting,searching and pagination functionality on Reservation page in jS       
# ------------------------------------------------------------------------
        paginationDetails=request.data['paginationDetails']
        columnToSort=request.data['columnToSort']
        columnSortingOrder=request.data['columnSortingOrder']
        currentPage=paginationDetails['currentPage']
        listPerPage=paginationDetails['listPerPage']

        # Added by - pratap sahu on 07-09-2023
        # Reason - To add search functionality
        searchText=request.data['searchText']

        reservationList=[]

        if columnToSort == "":
            reservationList = Reservation.objects.all()

        if searchText:
            reservationList=Reservation.objects.filter(Q(name__icontains=searchText) | 
                                                       Q(table_number__icontains=searchText) |
                                                       Q(contact_number__icontains=searchText) 
                                                        )
        else:
            reservationList = Reservation.objects.all()    
        # End of Addition by - pratap sahu on 07-09-2023
        # Reason - To add search functionality
        
        # Added by - pratap sahu on 07-09-2023
        # Reason - To add sorting functionality in respective columns
        if columnToSort == "name" and columnSortingOrder=="ascending":
            reservationList = reservationList.order_by('name')
        if columnToSort == "name" and columnSortingOrder=="descending":
            reservationList = reservationList.order_by('-name')

        if columnToSort == "contact_number" and columnSortingOrder=="ascending":
            reservationList = reservationList.order_by('contact_number')
        if columnToSort == "contact_number" and columnSortingOrder=="descending":
            reservationList = reservationList.order_by('-contact_number')
            
        if columnToSort == "table_number" and columnSortingOrder=="ascending":
            reservationList = reservationList.order_by('table_number')
        if columnToSort == "table_number" and columnSortingOrder=="descending":
            reservationList = reservationList.order_by('-table_number')
        
        if columnToSort == "reservation_status" and columnSortingOrder=="ascending":
            reservationList = reservationList.order_by('reservation_status')
        if columnToSort == "reservation_status" and columnSortingOrder=="descending":
            reservationList = reservationList.order_by('-reservation_status')
            
        if columnToSort == "date" and columnSortingOrder=="ascending":
            reservationList = reservationList.order_by('date')
        if columnToSort == "date" and columnSortingOrder=="descending":
            reservationList = reservationList.order_by('-date')
            
        if columnToSort == "number_of_person" and columnSortingOrder=="ascending":
            reservationList = reservationList.order_by('number_of_person')
        if columnToSort == "number_of_person" and columnSortingOrder=="descending":
            reservationList = reservationList.order_by('-number_of_person')
        # End of Addition by - pratap sahu on 07-09-2023
        # Reason - To add sorting functionality in respective columns
        
        reservationListCount=reservationList.count()

        # from django.core.paginator import Paginator
        paginator = Paginator(reservationList, listPerPage)
        filteredReservationList = paginator.page(currentPage)
        ReservationsSerializedData = ReservationSerializer(filteredReservationList, many =True)
        
        return Response({
            "msg":"success",
            "reservation":ReservationsSerializedData.data,
            "reservationListCount":reservationListCount,
        })
# End of addition by pratap sahu on 07-09-2023
# Reason: to add sorting,searching and pagination functionality on Reservation page in jS
# ----------------------------------------------

# Added by :- Parineeta Gedam
# Date :- 26-05-2023
# Reason : API for get the reservations data
class GetReservationsAPIView(APIView):
    def get(self, request, tenant):

        # Modified by :- Parineeta Gedam on 16-06-2023 
        # reason :- In reservation table newly request should be displayed at top in table.
        # reservationList = Reservation.objects.all()
        reservationList = Reservation.objects.all().order_by('-id')
        
        # End of modified code  by :- Parineeta Gedam on 16-06-2023 reason :- In reservation table newly request should be displayed at top in table.
        reservationSerializer = ReservationSerializer(reservationList, many=True)
        return Response({"msg": "success", "reservationList": reservationSerializer.data})
        
        # Added by Pratap Sahu on 08-09-2023
        # Reason: to get single reservation detail by id
    def get(self,request,tenant,reservationId):
        if reservationId:
            reservtion=Reservation.objects.get(id=reservationId)
        else:
            reservtion= None
        if reservtion:
            reservationSerializer=ReservationSerializer(reservtion)
            reservationSerializedData=reservationSerializer.data
            
        return Response({"msg":"success","reservation":reservationSerializedData})
    
# End of addition by- Pratap Sahu on 08-09-2023,To get single reservation detail by id

# Added by :- Parineeta Gedam
# Date :- 28-05-2023
# Reason : API for get the billing data
class GetBillingDataAPIView(APIView):
    def post(self, request, tenant):
        order = Order.objects.filter(
            customer_id__contact_number=request.data['contact_number']).latest('date')
        orderSerializedData = OrderSerializer(order)

        # Commented and modified by :- Parineeta Gedam on 23-06-2023 reason :- latest order item show in top
        # orderItem = OrderItem.objects.filter(order_id__order_id=order.order_id)
        orderItem = OrderItem.objects.filter(order_id__order_id=order.order_id).order_by('-id')
        # End of Commented and modified by :- Parineeta Gedam on 23-06-2023 reason :- latest order item show in top

        orderItemSerializedData = OrderItemSerializer(orderItem, many=True)
        settingserailize = SettingSaveSerializer(Setting.objects.last())
        from admin_app.models import Tenant, RestaurantRequest
        tenant = Tenant.objects.get(tenant_name=tenant)
        tenant_detail = {
            "name": tenant.restaurant_name.restaurant_name,
            "address": tenant.restaurant_name.address
        }
        return Response({"msg":"success", "order": orderSerializedData.data, "orderItem": orderItemSerializedData.data, "setting": settingserailize.data, "tenant": tenant_detail})
# End of added code by :- Parineeta Gedam on 26-05-2023

# Added by Parineeta Gedam on 04-06-2023
# Reason - to update the reservation 
class UpdateReservationAPI(APIView):
    def post(self,request,tenant):
        if "id" in request.data :
            try:
                obj = Reservation.objects.get(id=request.data["id"])
                serial = ReservationSerializer(obj, data=request.data)
            except Exception as e:
                serial = ReservationSerializer(data=request.data)
        else :
            serial = ReservationSerializer(data=request.data)
        if serial.is_valid():
            serial.save()
            return Response({
                "msg": "Saved Successfully",
                "reservationData": serial.data,
            }, status=status.HTTP_201_CREATED)
        return Response({"msg": "Not Saved"}, status=status.HTTP_200_OK)
# End of addition code by Parineeta Gedam on 04-06-2023




# Added by Ashish Dewangan on 12-06-2023
# Reason - API for CRUD operation on menu
class MenuAPI(APIView):
    
    # Added by Ashish Dewangan on 12-06-2023
    # Reason - To get count of menu
    def get(self,request,tenant):
         menuCount=Menu.objects.all().count() 
         return Response({
            "msg":"success",
            "menuCount":menuCount,
        })
    # End of code addition by - Ashish Dewangan on 12-06-2023
    # Reason - To get count of menu
    
    # Added by - Ashish Dewangan on 12-06-2023
    # Reason - To get list of menu using backend pagination.
    def post(self,request,tenant):
        paginationDetails=request.data['paginationDetails']
        columnToSort=request.data['columnToSort']
        columnSortingOrder=request.data['columnSortingOrder']
        currentPage=paginationDetails['currentPage']
        listPerPage=paginationDetails['listPerPage']

        # Commented and modified by - Ashish Dewangan on 14-06-2023
        # Reason - To enhance and add basic search functionality
        searchText=request.data['searchText']

        menuList=[]

        if columnToSort == "":
            menuList = Menu.objects.all()

        if searchText:
            menuList=Menu.objects.filter(Q(name__icontains=searchText) )
        else:
            menuList = Menu.objects.all()        
        
        # if columnToSort == "name" and columnSortingOrder=="ascending":
        #     menuList = Menu.objects.all().order_by('name')
        # if columnToSort == "name" and columnSortingOrder=="descending":
        #     menuList = Menu.objects.all().order_by('-name')
        # if columnToSort == "name" and columnSortingOrder=="":
        #     menuList = Menu.objects.all()
        
        # if columnToSort == "is_active" and columnSortingOrder=="ascending":
        #     menuList=Menu.objects.all().order_by('is_active')
        # if columnToSort == "is_active" and columnSortingOrder=="descending":
        #     menuList = Menu.objects.all().order_by('-is_active')
        # if columnToSort == "is_active" and columnSortingOrder=="":
        #     menuList=Menu.objects.all()

        if columnToSort == "name" and columnSortingOrder=="ascending":
            menuList = menuList.order_by('name')
        if columnToSort == "name" and columnSortingOrder=="descending":
            menuList = menuList.order_by('-name')
        
        
        if columnToSort == "is_active" and columnSortingOrder=="ascending":
            menuList = menuList.order_by('is_active')
        if columnToSort == "is_active" and columnSortingOrder=="descending":
            menuList = menuList.order_by('-is_active')
        
        menuListCount=menuList.count()

        # from django.core.paginator import Paginator

        paginator = Paginator(menuList, listPerPage)
        filteredMenuList = paginator.page(currentPage)

        menuListSerializer = MenuListSerializer(filteredMenuList, many =True)
        return Response({
            "msg":"success",
            "menuList":menuListSerializer.data,
            "menuListCount":menuListCount,
        })
        # End of code modification by - Ashish Dewangan on 14-06-2023
        # Reason - To enhance and add basic search functionality
        
    # End of code addition by - Ashish Dewangan on 12-06-2023
    # Reason - To get list of menu using backend pagination
    
# End of code addition by - Ashish Dewangan on 12-06-2023
# Reason - API to get list of menu 

# Added by - Ashish Dewangan on 14-06-2023
# Reason - API to get setting by id
class MenuDetailsAPI(APIView):
    logger=logging.getLogger("custom_logger")
    def get(self,request,tenant,menuId):
        self.logger.info(request.data)
        if menuId:
            menu=Menu.objects.get(id=menuId)
        else:
            menu= None

        if menu:
            menuSerializer=MenuListSerializer(menu)
            menuData=menuSerializer.data
        else:
            menuData={}  
       
        return Response({"msg":"success","menu":menuData})
    
    # Added by - Ashish Dewangan on 16-06-2023
    # Reason - To save menu details
    def post(self,request,tenant):
        if "id" in request.data :
            obj = Menu.objects.get(id=request.data["id"])
            menuListSerializer = MenuListSerializer(obj, data=request.data,partial=True)
        else :
            menuListSerializer = MenuListSerializer(data=request.data)

        if menuListSerializer.is_valid():
            menuListSerializer.save()
            return Response({"msg": "Saved Successfully" }, status=status.HTTP_201_CREATED)
        return Response({"error": menuListSerializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of code addition by - Ashish Dewangan on 16-06-2023
    # Reason - To save menu details
    
# End of code addition by - Ashish Dewangan on 14-06-2023. Reason - to get setting data by id    

# Added by Om Shrivastava on 14-06-23
# Reason: When user apply rating than show rating and review
class RatingReviewAPI(APIView):
    def post(self,request,tenant):
        # print(request.data)
        serializedData = RatingReviewSerializer(data=request.data)
     
        if serializedData.is_valid():
            serializedData.save()
            return Response({"msg": "Saved Successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    
# End of addition by Om Shrivastava on 14-06-23

# Added by Om Shrivastava on 15-06-23
# Reason - API for CRUD operation on order
class OrderAPI(APIView):

    # Added by Om Shrivastava on 15-06-23
    # Reason - To get count of order
    def get(self,request,tenant):
         orderCount=Order.objects.all().count() 
         # Added by Om Shrivastava on 04-09-23
         # Reason : Set the data in order table
         todays_order_item=OrderItem.objects.all().order_by("-id")
         todays_order_item_serializer=OrderItemWithOrderIdSerializer(todays_order_item, many=True)
         
         settingserailize = SettingSaveSerializer(Setting.objects.last())
         from admin_app.models import Tenant, RestaurantRequest
         tenant = Tenant.objects.get(tenant_name=tenant)
         tenant_detail = {
            "name": tenant.restaurant_name.restaurant_name,
            "address": tenant.restaurant_name.address
         }
         # End of Added by Om Shrivastava on 04-09-23
         # Reason : Set the data in order table

         return Response({
            "msg":"success",
            "orderCount":orderCount,
            # Added by Om Shrivastava on 04-09-23
            # Reason : Set the data in order table
            "order_item":todays_order_item_serializer.data,
            "setting": settingserailize.data, 
            "tenant": tenant_detail,
            # End of Added by Om Shrivastava on 04-09-23
            # Reason : Set the data in order table

        })
    # End of code addition by - Om Shrivastava on 15-06-23
    # Reason - To get count of order
    
    # Added by - Om Shrivastava on 15-06-23
    # Reason - To get list of order using backend pagination.
    def post(self,request,tenant):
        paginationDetails=request.data['paginationDetails']
        columnToSort=request.data['columnToSort']
        columnSortingOrder=request.data['columnSortingOrder']
        currentPage=paginationDetails['currentPage']
        listPerPage=paginationDetails['listPerPage']

        # Commented and modified by - Ashish Dewangan on 14-06-2023
        # Reason - To enhance and add basic search functionality
        searchText=request.data['searchText']

        orderList=[]

        if columnToSort == "":
            orderList = Order.objects.all()

        if searchText:
            orderList=Order.objects.filter(Q(table_number__icontains=searchText) | 
                                                       Q(order_id__icontains=searchText) |
                                                       Q(order_status__icontains=searchText) |
                                                       Q(payment_status__icontains=searchText))
        else:
            orderList = Order.objects.all()        
        
        # if columnToSort == "name" and columnSortingOrder=="ascending":
        #     orderList = Order.objects.all().order_by('name')
        # if columnToSort == "name" and columnSortingOrder=="descending":
        #     orderList = Order.objects.all().order_by('-name')
        # if columnToSort == "name" and columnSortingOrder=="":
        #     orderList = Order.objects.all()
        
        # if columnToSort == "is_active" and columnSortingOrder=="ascending":
        #     orderList=Order.objects.all().order_by('is_active')
        # if columnToSort == "is_active" and columnSortingOrder=="descending":
        #     orderList = Order.objects.all().order_by('-is_active')
        # if columnToSort == "is_active" and columnSortingOrder=="":
        #     orderList=Order.objects.all()

        # Added by Yuvraj Sahu on 07-08-2023
        # Reason - to filter the order list when start date and end will come
        # if request.data['startDate'] != None and request.data['endDate'] != None :
        if "startDate" and "endDate" in request.data :
            orderList = Order.objects.filter(date__range=[request.data['startDate'], request.data['endDate']])
        # end of addition by Yuvraj Sahu on 07-08-2023

        if columnToSort == "order_id" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('order_id')
        if columnToSort == "order_id" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-order_id')
        
        if columnToSort == "table_number" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('table_number')
        if columnToSort == "table_number" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-table_number')
        
        if columnToSort == "order_status" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('order_status')
        if columnToSort == "order_status" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-order_status')

        if columnToSort == "payment_status" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('payment_status')
        if columnToSort == "payment_status" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-payment_status')

        if columnToSort == "payment_mode" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('payment_mode')
        if columnToSort == "payment_mode" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-payment_mode')

        if columnToSort == "date" and columnSortingOrder=="ascending":
            orderList = orderList.order_by('date')
        if columnToSort == "date" and columnSortingOrder=="descending":
            orderList = orderList.order_by('-date')

        orderListCount=orderList.count()

        # from django.core.paginator import Paginator

        paginator = Paginator(orderList, listPerPage)
        filteredOrderList = paginator.page(currentPage)

        orderListSerializer = AllOrderSerializer(filteredOrderList, many =True)
        return Response({
            "msg":"success",
            "orderList":orderListSerializer.data,
            "orderListCount":orderListCount,
        })
        # End of code modification by - Ashish Dewangan on 14-06-2023
        # Reason - To enhance and add basic search functionality
        
    # End of code addition by - Om Shrivastava on 15-06-23
    # Reason - To get list of Order using backend pagination
    
# End of code addition by - Om Shrivastava on 15-06-23
# Reason - API to get list of Order 

"""
Added by Om Shrivastava on 16-06-23 
Reason - to get and update the order details in form section in admin js
"""
class OrderDetailAPIView(APIView) :
    def get(self, request, tenant):
        orderObjs = Order.objects.all()
        serialized=AllOrderSerializer(orderObjs, many=True)
        
        # Added by Rohan kansari - 28/6/23
        # Reason - To send setting value also in a response
        settingSerialize=SettingSerializer(Setting.objects.last())


        # order_status = dict(Order.fields['order_status'].choices)[order_status]
       
        return Response({
            "msg":"success",
            "orderData":serialized.data,
            "setting":settingSerialize.data
            # "dropDown":order_status,
            })
    
        # End of code - Rohan kansari - 28/6/23
    
    def post(self,request,tenant):
    # Added by Om Shrivastava on 16-06-23
    # Reason - to update and also save order details in same api
        if "id" in request.data :
            obj = Order.objects.get(id=request.data["id"])
            # Some namme changes by Om Shrivastava on 18-06-23
            orderDetailSerailizer = AllOrderSerializer(obj, data=request.data,partial=True)
        else :
            orderDetailSerailizer = AllOrderSerializer(data=request.data)
    # End of addition by Om Shrivastava on 16-06-23
        # orderObjs = Order.objects.all()
        # serialized=AllOrderSerializer(orderObjs, many=True)
        if orderDetailSerailizer.is_valid():
            orderDetailSerailizer.save()
            # Added by Rohan kansari - 14/8/23
            # Reason - To get update customer loyality point from serializer
            obj=Order.objects.get(id=orderDetailSerailizer.data["id"])
            orderDetailSerailizer = AllOrderSerializer(obj)
            # ENd of code - Rohan kansari - 14/8/23 - To get update customer loyality point from serializer
            # Added by ROhan kansari - 27/7/23 
            # Reason - To send updated order detail data and order item
            # return Response({"msg": "Saved Successfully"}, status=status.HTTP_201_CREATED)
            AllOrderItem=OrderItem.objects.filter(order_id=obj.id)
            orderItemSerializer=OrderItemSerializer(AllOrderItem,many=True)
            return Response({"msg": "Saved Successfully","orderData":orderDetailSerailizer.data,"orderItems":orderItemSerializer.data}, status=status.HTTP_201_CREATED)
        return Response({"error": orderDetailSerailizer.errors}, status=status.HTTP_400_BAD_REQUEST)
   
"""
End of addition by Om shrivastava on 16-06-23
"""

# Added by Yuvraj Sahu on 16-06-2023
# Reason - API for CRUD operation on category
class CategoryAPI(APIView):
    # Added by Yuvraj Sahu on 16-06-2023
    # Reason - To get count of category
    def get(self,request,tenant):
         categoryCount=Category.objects.all().count() 
         return Response({
            "msg":"success",
            "categoryCount":categoryCount,
        })
    # End of code addition by - Yuvraj Sahu on 16-06-2023
    # Reason - To get count of category
    
    # Added by - Yuvraj Sahu on 16-06-2023
    # Reason - To get list of category using backend pagination.
    def post(self,request,tenant):
        paginationDetails=request.data['paginationDetails']
        columnToSort=request.data['columnToSort']
        columnSortingOrder=request.data['columnSortingOrder']
        currentPage=paginationDetails['currentPage']
        listPerPage=paginationDetails['listPerPage']

        # Commented and modified by - Yuvraj Sahu on 16-06-2023
        # Reason - To enhance and add basic search functionality
        searchText=request.data['searchText']

        categoryList=[]

        if columnToSort == "":
            categoryList = Category.objects.all()

        if searchText:
            # Modified by Yuvraj Sahu on 17-06-2023
            # Reason - to search by category name and menu name 
            categoryList=Category.objects.filter(Q(name__icontains=searchText) | Q(menu__name__icontains=searchText) )
            # End of addition by Yuvraj Sahu on 18-06-2023
        else:
            categoryList = Category.objects.all()        

        if columnToSort == "name" and columnSortingOrder=="ascending":
            categoryList = categoryList.order_by('name')
        if columnToSort == "name" and columnSortingOrder=="descending":
            categoryList = categoryList.order_by('-name')

        # Addde by Yuvraj Sahu on 17-06-2023
        # Reason - to sort data with menu name
        if columnToSort == "menu" and columnSortingOrder=="ascending":
            categoryList = Category.objects.all().order_by('menu__name')     
        if columnToSort == "menu" and columnSortingOrder=="descending":
            categoryList = Category.objects.all().order_by('-menu__name')     
        # End of addition by Yuvraj Sahu on 17-06-2023
        
        
        if columnToSort == "is_active" and columnSortingOrder=="ascending":
            categoryList = categoryList.order_by('is_active')
        if columnToSort == "is_active" and columnSortingOrder=="descending":
            categoryList = categoryList.order_by('-is_active')
        
        categoryListCount=categoryList.count()

        # from django.core.paginator import Paginator

        paginator = Paginator(categoryList, listPerPage)
        filteredCategoryList = paginator.page(currentPage)

        categoryListSerializer = CategoryListSerializer(filteredCategoryList, many =True)
        return Response({
            "msg":"success",
            "categoryList":categoryListSerializer.data,
            "categoryListCount":categoryListCount,
        })
        # End of code modification by - Yuvraj Sahu on 16-06-2023
        # Reason - To enhance and add basic search functionality
        
    # End of code addition by - Yuvraj Sahu on 16-06-2023
    # Reason - To get list of category using backend pagination
    
# End of code addition by - Yuvraj Sahu on 16-06-2023
# Reason - API to get list of category 


# Added by - Yuvraj Sahu on 17-06-2023
# Reason - API to get category by id
class CategoryDetailsAPI(APIView):
    logger=logging.getLogger("custom_logger")
    def get(self,request,tenant,categoryId):
        self.logger.info(request.data)
        if categoryId:
            category=Category.objects.get(id=categoryId)
        else:
            category= None
        if category:
            categorySerializer=CategoryListSerializer(category)
            categoryData=categorySerializer.data
        else:
            categoryData={}  
        menus = Menu.objects.all()
        menuSerializer = MenuListSerializer(menus, many=True)
        return Response({"msg":"success","category":categoryData, "menus":menuSerializer.data})
    # Added by - Yuvraj Sahu on 17-06-2023
    # Reason - To save category details
    def post(self,request,tenant):
        if "id" in request.data :
            obj = Category.objects.get(id=request.data["id"])
            categorySaveSerializer = CategorySaveSerializer(obj, data=request.data,partial=True)
        else :
            categorySaveSerializer = CategorySaveSerializer(data=request.data)
        if categorySaveSerializer.is_valid():
            categorySaveSerializer.save()
            return Response({"msg": "Saved Successfully" }, status=status.HTTP_201_CREATED)
        return Response({"error": categorySaveSerializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of code addition by - Yuvraj Sahu on 17-06-2023
    # Reason - To save category details

# Added by Yuvraj Sahu on 17-06-2023
# Reason - to get all menu from database
class GetMenusAPI(APIView):
    def get(self,request,tenant):
        menuList=Menu.objects.all().order_by('name')
        # Commented and modified by Yuvraj Sahu on 20-07-2023
        # Reason - to get all menus
        # var = menuList.filter(is_active = True) 
        # menuListSerializer = MenuListSerializer(var, many =True)
        menuListSerializer = MenuListSerializer(menuList, many =True)
        # End of commeted by yuvraj Sahu on 20-07-2023
        return Response({"msg":"success", "menus":menuListSerializer.data})
# End of addition by Yuvraj Sahu on 17-06-2023


# Added by Yuvraj Sahu on 23-06-2023
# Reason - API for CRUD operation on Item
class ItemAPI(APIView):
    # Added by Yuvraj Sahu on 23-06-2023
    # Reason - To get count of item
    def get(self,request,tenant):
         itemCount=Item.objects.all().count() 
         return Response({
            "msg":"success",
            "itemCount":itemCount,
        })
    # End of code addition by - Yuvraj Sahu on 23-06-2023
    # Reason - To get count of item
    
    # Added by - Yuvraj Sahu on 23-06-2023
    # Reason - To get list of item using backend pagination.
    def post(self,request,tenant):
        paginationDetails=request.data['paginationDetails']
        columnToSort=request.data['columnToSort']
        columnSortingOrder=request.data['columnSortingOrder']
        currentPage=paginationDetails['currentPage']
        listPerPage=paginationDetails['listPerPage']

        # Commented and modified by - Yuvraj Sahu on 23-06-2023
        # Reason - To enhance and add basic search functionality
        searchText=request.data['searchText']

        itemList=[]

        if columnToSort == "":
            itemList = Item.objects.all()

        if searchText:
            # Modified by Yuvraj Sahu on 24-06-2023
            # Reason - to search by item name and category name 
            itemList=Item.objects.filter(Q(name__icontains=searchText) | Q(category__name__icontains=searchText) | Q(price_full__icontains=searchText) | Q(price_half__icontains=searchText))
            # End of addition by Yuvraj Sahu on 24-06-2023
        else:
            itemList = Item.objects.all()        

        if columnToSort == "name" and columnSortingOrder=="ascending":
            itemList = itemList.order_by('name')
        if columnToSort == "name" and columnSortingOrder=="descending":
            itemList = itemList.order_by('-name')

        # Added by yuvraj Sahu on 24-06-2023
        # Reason - to sort by category name
        if columnToSort == "category" and columnSortingOrder=="ascending":
            itemList = Item.objects.all().order_by('category__name')     
        if columnToSort == "category" and columnSortingOrder=="descending":
            itemList = Item.objects.all().order_by('-category__name')
        # End of sorting by category name by Yuvraj Sahu on 14-06-2023

        # Added by yuvraj Sahu on 24-06-2023
        # Reason - to sort by full price name
        if columnToSort == "priceFull" and columnSortingOrder=="ascending":
            itemList = itemList.order_by('price_full')
        if columnToSort == "priceFull" and columnSortingOrder=="descending":
            itemList = itemList.order_by('-price_full')
        # End of sorting by full price by Yuvraj Sahu on 14-06-2023

        # Added by yuvraj Sahu on 24-06-2023
        # Reason - to sort by price full name
        if columnToSort == "priceHalf" and columnSortingOrder=="ascending":
            itemList = itemList.order_by('price_half')
        if columnToSort == "priceHalf" and columnSortingOrder=="descending":
            itemList = itemList.order_by('-price_half')
        # End of sorting by half price by Yuvraj Sahu on 14-06-2023     
        
        # Added by yuvraj Sahu on 24-06-2023
        # Reason - to sort by active status
        if columnToSort == "is_active" and columnSortingOrder=="ascending":
            itemList = itemList.order_by('is_active')
        if columnToSort == "is_active" and columnSortingOrder=="descending":
            itemList = itemList.order_by('-is_active')
        # End of sorting by active status by Yuvraj Sahu on 14-06-2023
        
        # Added by yuvraj Sahu on 24-06-2023
        # Reason - to sort by best seller item
        if columnToSort == "best_seller" and columnSortingOrder=="ascending":
            itemList = itemList.order_by('best_seller')
        if columnToSort == "best_seller" and columnSortingOrder=="descending":
            itemList = itemList.order_by('-best_seller')
        # End of sorting by best seller by Yuvraj Sahu on 14-06-2023
        
        itemListCount=itemList.count()

        # from django.core.paginator import Paginator

        paginator = Paginator(itemList, listPerPage)
        filteredItemList = paginator.page(currentPage)

        itemListSerializer = ItemListSerializer(filteredItemList, many =True)
        return Response({
            "msg":"success",
            "itemList":itemListSerializer.data,
            "itemListCount":itemListCount,
        })
        # End of code modification by - Yuvraj Sahu on 23-06-2023
        # Reason - To enhance and add basic search functionality
        
    # End of code addition by - Yuvraj Sahu on 23-06-2023
    # Reason - To get list of item using backend pagination
    
# End of code addition by - Yuvraj Sahu on 23-06-2023
# Reason - API to get list of item 


# Added by - Yuvraj Sahu on 23-06-2023
# Reason - API to get item by id
class ItemDetailsAPI(APIView):
    logger=logging.getLogger("custom_logger")
    def get(self,request,tenant, itemId):
        self.logger.info(request.data)
        if itemId:
            item=Item.objects.get(id=itemId)
        else:
            item= None
        if item:
            itemSerializer=ItemListSerializer(item)
            itemData=itemSerializer.data
        else:
            itemData={}  
        categories = Category.objects.all()
        categorySerializer = CategoryListSerializer(categories, many=True)
        return Response({"msg":"success","item":itemData, "categories":categorySerializer.data})
    # Added by - Yuvraj Sahu on 23-06-2023
    # Reason - To save item details
    def post(self,request,tenant):
        if "id" in request.data :
            obj = Item.objects.get(id=request.data["id"])
            itemSaveSerializer = ItemSaveSerializer(obj, data=request.data,partial=True)
        else :
            itemSaveSerializer = ItemSaveSerializer(data=request.data)
        if itemSaveSerializer.is_valid():
            itemSaveSerializer.save()
            return Response({"msg": "Saved Successfully" }, status=status.HTTP_201_CREATED)
        return Response({"error": itemSaveSerializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of code addition by - Yuvraj Sahu on 23-06-2023
    # Reason - To save item details

# Added by Yuvraj Sahu on 23-06-2023
# Reason - to get all categories from database
class GetCategoryAPI(APIView):
    def get(self,request,tenant):
        categoryList=Category.objects.all().order_by('name')
        # Commeted and modification by yuvraj Sahu on 20-07-2023
        # Reason - to return all categories
        # var = categoryList.filter(is_active = True) 
        categoryListSerializer = CategoryListSerializer(categoryList, many =True)
        # End of modification by yuvraj sahu on 20-07-2023
        return Response({"msg":"success", "categoryList":categoryListSerializer.data})
# End of addition by Yuvraj Sahu on 23-06-2023

# Addded by Om Shrivastava on 26-06-23
# Reason : Get all order item data 
class GetAllOrderItemAPI(APIView):
    def get(self,request,tenant):
         orderItemCount=OrderItem.objects.all().count() 
         return Response({
            "msg":"success",
            "orderItemCount":orderItemCount,
        })
    
    #To get list of order item using backend pagination.
    def post(self,request,tenant):
        paginationDetails=request.data['paginationDetails']
        columnToSort=request.data['columnToSort']
        columnSortingOrder=request.data['columnSortingOrder']
        currentPage=paginationDetails['currentPage']
        listPerPage=paginationDetails['listPerPage']

        #To enhance and add basic search functionality
        searchText=request.data['searchText']

        orderItemList=[]

        if columnToSort == "":

            # Commented and modified by :- Parineeta gedam on 28-07-2023 
            # reason :- When we run the 3rd flow of "Add more item" functionality then same items is not display in admin JS.  
                     
            # orderItemList = OrderItem.objects.all()
            orderItemList = OrderItem.objects.all().order_by('-id')

            # End of Commented and modified by :- Parineeta gedam on 28-07-2023 
            # reason :- When we run the 3rd flow of "Add more item" functionality then same items is not display in admin JS

        if searchText:
            #To search by item name and category name 

            # Commented and modified by :- Parineeta gedam on 28-07-2023 
            # reason :- When we run the 3rd flow of "Add more item" functionality then same items is not display in admin JS.  

            # orderItemList=OrderItem.objects.filter(Q(order_id__order_id__icontains=searchText)| Q(item_status__icontains=searchText)
            #                                         | Q(item__icontains=searchText)| Q(quantity__icontains=searchText)| Q(serving_size__icontains=searchText)).order_by('-id')

            orderItemList=OrderItem.objects.filter(Q(order_id__order_id__icontains=searchText)| Q(item_status__icontains=searchText)
                                                    | Q(item__icontains=searchText)| Q(quantity__icontains=searchText)| Q(serving_size__icontains=searchText)).order_by('-id')       

            # End of Commented and modified by :- Parineeta gedam on 28-07-2023 
            # reason :- When we run the 3rd flow of "Add more item" functionality then same items is not display in admin JS
                              
        else:

            # Commented and modified by :- Parineeta gedam on 28-07-2023 
            # reason :- When we run the 3rd flow of "Add more item" functionality then same items is not display in admin JS.  

            # orderItemList = OrderItem.objects.all()
            orderItemList = OrderItem.objects.all().order_by('-id')

            # End of Commented and modified by :- Parineeta gedam on 28-07-2023 
            # reason :- When we run the 3rd flow of "Add more item" functionality then same items is not display in admin JS

        # Added by Yuvraj Sahu on 07-08-2023
        # Reason - to filter the order item list when start date and end will come
        if "startDate" and "endDate" in request.data :
        # if request.data['startDate'] != None and request.data['endDate'] != None :
            orderItemList = OrderItem.objects.filter(date__range=[request.data['startDate'], request.data['endDate']])
        # end of addition by Yuvraj Sahu on 07-08-2023

        if columnToSort == "order_id" and columnSortingOrder=="ascending":
            orderItemList = orderItemList.order_by('order_id__order_id')
        if columnToSort == "order_id" and columnSortingOrder=="descending":
            orderItemList = orderItemList.order_by('-order_id__order_id')

        if columnToSort == "item_status" and columnSortingOrder=="ascending":
            orderItemList = orderItemList.order_by('item_status')
        if columnToSort == "item_status" and columnSortingOrder=="descending":
            orderItemList = orderItemList.order_by('-item_status')
        
        # Added by Om Shrivastava on 30-06-23 Reason : Need to apply sorting through the quantity, item name
        if columnToSort == "item" and columnSortingOrder=="ascending":
            orderItemList = orderItemList.order_by('item')
        if columnToSort == "item" and columnSortingOrder=="descending":
            orderItemList = orderItemList.order_by('-item')

        if columnToSort == "quantity" and columnSortingOrder=="ascending":
            orderItemList = orderItemList.order_by('quantity')
        if columnToSort == "quantity" and columnSortingOrder=="descending":
            orderItemList = orderItemList.order_by('-quantity')

        if columnToSort == "price" and columnSortingOrder=="ascending":
            orderItemList = orderItemList.order_by('price')
        if columnToSort == "price" and columnSortingOrder=="descending":
            orderItemList = orderItemList.order_by('-price')
        
        if columnToSort == "serving_size" and columnSortingOrder=="ascending":
            orderItemList = orderItemList.order_by('serving_size')
        if columnToSort == "serving_size" and columnSortingOrder=="descending":
            orderItemList = orderItemList.order_by('-serving_size')

        # End of code added by Om Shrivastava on 30-06-23 Reason : Need to apply sorting through the quantity, item name
 

        if columnToSort == "date" and columnSortingOrder=="ascending":
            orderItemList = orderItemList.order_by('date')
        if columnToSort == "date" and columnSortingOrder=="descending":
            orderItemList = orderItemList.order_by('-date')

        orderItemListCount=orderItemList.count()

        # from django.core.paginator import Paginator

        paginator = Paginator(orderItemList, listPerPage)
        filteredOrderItemList = paginator.page(currentPage)

        orderItemListSerializer = OrderItemWithOrderIdSerializer(filteredOrderItemList, many =True)
        return Response({
            "msg":"success",
            "orderItemList":orderItemListSerializer.data,
            "orderItemListCount":orderItemListCount,
        })
        
# End of addition by Om Shrivatava on 26-06-23 Reason : Get all order item data 

"""
Added by Om Shrivastava on 30-06-23 
Reason - to get and update the order item details in form section in admin js
"""
class OrderItemDetailAPIView(APIView) :
    def get(self, request, tenant):
        orderItemObjs = OrderItem.objects.all()
        serialized=OrderItemWithOrderIdSerializer(orderItemObjs, many=True)
        
        return Response({
            "msg":"success",
            "orderItemData":serialized.data,
            })
    
        # End of code - Rohan kansari - 28/6/23
    
    def post(self,request,tenant):
    # Added by Om Shrivastava on 30-06-23
    # Reason - to update and also save order item details in same api
        if "id" in request.data :
            obj = OrderItem.objects.get(id=request.data["id"])
            # Some namme changes by Om Shrivastava on 18-06-23
            orderItemDetailSerailizer = OrderItemSerializer(obj, data=request.data,partial=True)
        else :
            orderItemDetailSerailizer = OrderItemSerializer(data=request.data)
    # End of addition by Om Shrivastava on 30-06-23
        # orderObjs = Order.objects.all()
        # serialized=AllOrderSerializer(orderObjs, many=True)
        if orderItemDetailSerailizer.is_valid():
            orderItemDetailSerailizer.save()
            return Response({"msg": "Saved Successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": orderItemDetailSerailizer.errors}, status=status.HTTP_400_BAD_REQUEST)

class GetAllOrderItemDetailsAPI(APIView):
    def get(self,request,tenant):
        orderItemData=OrderItem.objects.all()
        orderItemDataSerializer = OrderItemWithOrderIdSerializer(orderItemData, many =True)

        return Response({
            "msg":"success",
            "orderItemData":orderItemDataSerializer.data,
        })
"""
End of addition by Om shrivastava on 30-06-23
"""

# Added by Om Shrivastava  on 24-07-2023
# Reason - API for CRUD operation on rating and review for restaurant
class RestaurantRatingAPI(APIView):
    
    # Added by Om Shrivastava  on 24-07-2023
    # Reason - To get count of rating for restaurant
    def get(self,request,tenant):
         ratingCount=RatingReview.objects.all().count() 
        #  Added by Om Shrivastava on 26-07-23
        #  Reason : get the rating and review for restaurant
        #  Added by Om Shrivastava on 26-07-23
        #  Reason : get the rating by id, and new sent data show always upper
        #  allratingData = RatingReview.objects.all()
         allratingData = RatingReview.objects.all().order_by('-id')
        # End of addition and modification get the rating by id, and new sent data show always upper
         ratingSerializer=RatingReviewSerializer(allratingData, many=True)
        #  End of addition by Om Shrivastava on 26-07-23
        #  Reason : get the rating and review for restaurant
         return Response({
            "msg":"success",
            "ratingCount":ratingCount,
             #  Added by Om Shrivastava on 26-07-23
             #  Reason : get the rating and review for restaurant
            "allRatingData":ratingSerializer.data
             #  End of addition by Om Shrivastava on 26-07-23
             #  Reason : get the rating and review for restaurant
        })
    # End of code addition by - Om Shrivastava  on 24-07-2023
    # Reason - To get count of rating for restaurant
    
    # Added by - Om Shrivastava  on 24-07-2023
    # Reason - To get list of rating for restaurant using backend pagination.
    def post(self,request,tenant):
        paginationDetails=request.data['paginationDetails']
        columnToSort=request.data['columnToSort']
        columnSortingOrder=request.data['columnSortingOrder']
        currentPage=paginationDetails['currentPage']
        listPerPage=paginationDetails['listPerPage']

        # Commented and modified by - Om Shrivastava  on 24-07-2023
        # Reason - To enhance and add basic search functionality
        searchText=request.data['searchText']

        ratingReviewList=[]

        if columnToSort == "":
            #  Added by Om Shrivastava on 26-07-23
            #  Reason : get the rating and review for restaurant
            # ratingReviewList = RatingReview.objects.all()
            ratingReviewList = RatingReview.objects.all().order_by('-id')
            # End of addition by Om Shrivastava on 26-07-23
            #  Reason : get the rating and review for restaurant

        if searchText:
            ratingReviewList=RatingReview.objects.filter(Q(review__icontains=searchText) | 
                                                       Q(rating__icontains=searchText))
        else:
            #  Added by Om Shrivastava on 26-07-23
            #  Reason : get the rating and review for restaurant
            # ratingReviewList = RatingReview.objects.all()
            ratingReviewList = RatingReview.objects.all().order_by('-id')
            # End of addition by Om Shrivastava on 26-07-23
            #  Reason : get the rating and review for restaurant   

        if columnToSort == "review" and columnSortingOrder=="ascending":
            ratingReviewList = ratingReviewList.order_by('review')
        if columnToSort == "review" and columnSortingOrder=="descending":
            ratingReviewList = ratingReviewList.order_by('-review')

        if columnToSort == "rating" and columnSortingOrder=="ascending":
            ratingReviewList = ratingReviewList.order_by('rating')
        if columnToSort == "rating" and columnSortingOrder=="descending":
            ratingReviewList = ratingReviewList.order_by('-rating')

        ratingReviewListCount=ratingReviewList.count()

        # from django.core.paginator import Paginator

        paginator = Paginator(ratingReviewList, listPerPage)
        filteredRatingReviewList = paginator.page(currentPage)

        ratingReviewSerializer = RatingReviewSerializer(filteredRatingReviewList, many =True)
        return Response({
            "msg":"success",
            "ratingReviewList":ratingReviewSerializer.data,
            "ratingReviewListCount":ratingReviewListCount,
            
        })
        # End of code modification by - Om Shrivastava  on 24-07-2023
        # Reason - To enhance and add basic search functionality

    # End of code addition by - Om Shrivastava  on 24-07-2023
    # Reason - To get list of rating for restaurant using backend pagination
    
# End of code addition by - Om Shrivastava  on 24-07-2023
# Reason - API to get list of rating for restaurant 

"""
Added by Yuvraj Sahu on 03-07-2023
Reason - to update the order status
"""
class UpdateOrderStatus(APIView):
    def post(self,request,tenant):
        # Commeted and modified by yuvraj Sahu on 24-07-2023
        # Reason - to update the order status from native side 
        # Order.objects.filter(order_id = request.data["order_id"]).update(order_status = request.data["order_status"])
        # if request.data["order_status"] == "Confirm" :
        #       OrderItem.objects.filter(order_id__order_id = request.data["order_id"], item_status = "Pending").update(item_status = "Confirm", kot_print_status=True)
        orderObj = Order.objects.get(order_id=request.data["order_id"])
        orderSerializer = OrderSerializer(orderObj, data=request.data, partial=True)
        if orderSerializer.is_valid() :
            orderSerializer.save()
            return Response({
                "msg":"Order Status Updated"
            })
        return Response({
            "msg":"error"
        })
        # End of modification by yuvraj Sahu on 24-07-2023
"""
End of addition by Yuvraj Sahu on 03-07-2023
"""

"""
Added by Yuvraj Sahu on 03-07-2023
Reason - to update the payment status
"""
class UpdatePaymentStatus(APIView):
    def post(self,request,tenant):
        # Commeted and added by Yuvraj Sahu on 26-07-2023
        # Reason - to the payment status using save method
        # Order.objects.filter(order_id = request.data["order_id"]).update(payment_status = request.data["payment_status"])
        # return Response({
        #     "msg":"Payment status Updated"
        # })
        orderObj = Order.objects.get(order_id=request.data["order_id"])
        orderSerializer = OrderSerializer(orderObj, data=request.data, partial=True)
        if orderSerializer.is_valid() :
            orderSerializer.save()
            return Response({
                "msg":"Payment status Updated"
            })
        return Response({
            "msg":"error"
        })
        # End of modification by yuvraj Sahu on 16-07-2023
"""
End of addition by Yuvraj Sahu on 03-07-2023
"""

# Added by Om Shrivastava  on 05-08-23
# Reason - API for CRUD operation on offer details
class OfferBannerAPI(APIView):
    
    # Added by Om Shrivastava  on 05-08-23
    # Reason - To get count of offer/banner 
    def get(self,request,tenant):
         offerBannerCount=Offer.objects.all().count() 
        #  Added by Om Shrivastava on 26-07-23
        #  Reason : get the offer/banner by id, and new sent data show always upper
         allOfferBanner = Offer.objects.all().order_by('-id')
        # End of addition and modification get the rating by id, and new sent data show always upper
         offerSerializer=OfferBannerSerializer(allOfferBanner, many=True)
        
         return Response({
            "msg":"success",
            "offerBannerCount":offerBannerCount,
             #  Added by Om Shrivastava on 26-07-23
             #  Reason : get the rating and review for restaurant
            "allOfferBanner":offerSerializer.data
             #  End of addition by Om Shrivastava on 26-07-23
             #  Reason : get the rating and review for restaurant
        })
    # End of code addition by - Om Shrivastava  on 05-08-23
    # Reason - To get count of rating for restaurant
    
    # Added by - Om Shrivastava  on 05-08-23
    # Reason - To get list of rating for restaurant using backend pagination.
    def post(self,request,tenant):
        paginationDetails=request.data['paginationDetails']
        columnToSort=request.data['columnToSort']
        columnSortingOrder=request.data['columnSortingOrder']
        currentPage=paginationDetails['currentPage']
        listPerPage=paginationDetails['listPerPage']

        # Commented and modified by - Om Shrivastava  on 05-08-23
        # Reason - To enhance and add basic search functionality
        searchText=request.data['searchText']

        offerBannerList=[]

        if columnToSort == "":
            #  Added by Om Shrivastava on 26-07-23
            #  Reason : get the rating and review for restaurant
            # offerBannerList = RatingReview.objects.all()
            offerBannerList = Offer.objects.all().order_by('-id')
            # End of addition by Om Shrivastava on 26-07-23
            #  Reason : get the rating and review for restaurant

        if searchText:
            offerBannerList=Offer.objects.filter(Q(offer_name__icontains=searchText) | 
                                                       Q(discount__icontains=searchText))
        else:
            #  Added by Om Shrivastava on 26-07-23
            #  Reason : get the rating and review for restaurant
            # offerBannerList = RatingReview.objects.all()
            offerBannerList = Offer.objects.all().order_by('-id')
            # End of addition by Om Shrivastava on 26-07-23
            #  Reason : get the rating and review for restaurant   

        if columnToSort == "offer_name" and columnSortingOrder=="ascending":
            offerBannerList = offerBannerList.order_by('offer_name')
        if columnToSort == "offer_name" and columnSortingOrder=="descending":
            offerBannerList = offerBannerList.order_by('-offer_name')

        if columnToSort == "discount" and columnSortingOrder=="ascending":
            offerBannerList = offerBannerList.order_by('discount')
        if columnToSort == "discount" and columnSortingOrder=="descending":
            offerBannerList = offerBannerList.order_by('-discount')

        offerBannerListCount=offerBannerList.count()

        # from django.core.paginator import Paginator

        paginator = Paginator(offerBannerList, listPerPage)
        filteredofferBannerList = paginator.page(currentPage)

        offerBannerSerializer = OfferBannerSerializer(filteredofferBannerList, many =True)
        return Response({
            "msg":"success",
            "offerBannerList":offerBannerSerializer.data,
            "offerBannerListCount":offerBannerListCount,
            
        })
        # End of code modification by - Om Shrivastava  on 05-08-23
        # Reason - To enhance and add basic search functionality

    # End of code addition by - Om Shrivastava  on 05-08-23
    # Reason - To get list of rating for restaurant using backend pagination
    
# End of code addition by - Om Shrivastava  on 05-08-23
# Reason - API to get list of rating for restaurant 

# Added by Om Shrivastava on 06-08-23
# Reason - to save, delete and edit the offer/banner details
class BannerOfferAPIView(APIView):

    logger=logging.getLogger("custom_logger")
    def get(self,request,tenant,offerId):
        self.logger.info(request.data)
        offerBannerCount=Offer.objects.all().count() 

        if offerId:
            offer=Offer.objects.get(id=offerId)
        else:
            offer= None

        if offer:
            offerSerializer=OfferBannerSerializer(offer)
            offerData=offerSerializer.data
        else:
            offerData={}  
       
        return Response({"msg":"success","offer":offerData,
                              "offerBannerCount":offerBannerCount,
                         })
   
    def post(self,request,tenant):
        
        if "id" in request.data :
            obj = Offer.objects.get(id=request.data["id"]) 
            offerBannerSave = OfferBannerSerializer(obj, data=request.data,partial=True)
        else :
            offerBannerSave = OfferBannerSerializer(data=request.data)
        if offerBannerSave.is_valid():
            offerBannerSave.save()
            # Addition by Om Shrivastava on 06-09-23
            # Reason : Set the all offer data
            offerBannerCount=Offer.objects.all().count() 
            # End of addition by Om Shrivastava on 06-09-23
            # Reason : Set the all offer data
            # allOfferBanner = Offer.objects.all().order_by('-id')
            # offerSerializer=OfferBannerSerializer(allOfferBanner, many=True)
        
            return Response({"msg": "Saved Successfully","data":offerBannerSave.data,
                              # Addition by Om Shrivastava on 06-09-23
                              # Reason : Set the all offer data
                              "offerBannerCount":offerBannerCount
                              # End of addition by Om Shrivastava on 06-09-23
                              # Reason : Set the all offer data

                              }, status=status.HTTP_201_CREATED)
        return Response({"error": offerBannerSave.errors}, status=status.HTTP_400_BAD_REQUEST)

    # Added by Om on 06-08-2023
    # Reason - to update offer name
    def put(self,request,tenant):
        item = Offer.objects.get(id=request.data["id"])
        offerSerializer = OfferBannerSerializer(item, data=request.data,partial=True)
        if offerSerializer.is_valid():
            offerSerializer.save()
            itemList=Offer.objects.all().order_by("-id")
            itemListSerializer=OfferBannerSerializer(itemList,many=True)
            return Response({
            "msg":"Saved Successfully",
            "offerBannerList":itemListSerializer.data
            })
        return Response({"error": offerSerializer.errors}, status=200)

    # def put(self, request,tenant, pk):
    #     id = pk
    #     print("update method",request.data)
    #     offerBanner=Offer.objects.all()
    #     offerbannerSerializer=OfferBannerSerializer(offerBanner,many=True)
    #     offerItemList=OfferItem.objects.filter(item_name__is_active=True, item_name__category__is_active=True,item_name__category__menu__is_active=True)
    #     offeritemsSerializer=OfferItemsSerializer(offerItemList,many=True)
        
    #     offerObj = Offer.objects.get(id = id)
    #     serializedData = OfferBannerSerializer(offerObj, data=request.data)
    #     if serializedData.is_valid(raise_exception=True):
    #         serializedData.save()
    #         return Response({
    #             "msg": "Updated Successfully",
    #             "offerBanner": offerbannerSerializer.data,
    #             "offerItemList": offeritemsSerializer.data,
    #         })
    #     return Response({"error": "Something Went Wrong"}, status=status.HTTP_400_BAD_REQUEST)
    # End of addition

    # Commented by Om Shrivastava on 21-08-23
    # Reason : Not working this put API
    # def put(self,request,tenant):
    #     item = Item.objects.get(id=request.data["id"])
    #     itemSerializer = ItemSerializer(item, data=request.data,partial=True)
    #     if itemSerializer.is_valid():
    #         itemSerializer.save()
    #         itemList=Item.objects.all().order_by("-id")
    #         itemListSerializer=ItemListSerializer(itemList,many=True)
    #         return Response({
    #         "msg":"Saved Successfully",
    #         "itemList":itemListSerializer.data
    #         })
    #     return Response({"error": itemSerializer.errors}, status=200)
    # End of commented code by Om Shrivastava on 21-08-23
    # Reason : Not working this put API

    def delete(self, request,tenant, pk):
        id = pk
        category = Offer.objects.get(id=id)
        if category :
            category.delete()
            return Response({"msg": "Deleted Successfully"}, 200)
        return Response({"error": "error"}, 404)

# End of addition by Om Shrivastava on 06-08-23
# Reason - to save, delete and edit the offer/banner details


# Added by ROhan kansari - 9/9/23 
# Reason - - To get waiter detail 

class WaiterAPI(APIView):
    def get(self,request,tenant):
        waiterList=Waiter.objects.all().order_by("-id")
        waiterSerialize=WaiterSerializer(waiterList,many=True)
        return Response({"data":waiterSerialize.data})
    
    def post(self,request,tenant):
        from django.contrib.auth.hashers import make_password,check_password
        print(request.data)
        if request.data["id"]:
            waiterObj=Waiter.objects.get(id=request.data["id"])
            # if check_password(request.data["password"],waiterObj.password) == False:
            request.data["password"]=make_password(request.data["password"])
            waiterSerialize=WaiterSerializer(waiterObj,data=request.data,partial=True)
        else:
            request.data["password"]=make_password(request.data["password"])
            waiterSerialize= WaiterSerializer(data=request.data)
            
       
        if waiterSerialize.is_valid():
            waiterSerialize.save()
            return Response({"data":waiterSerialize.data}, status=status.HTTP_200_OK) 
        return Response({"error":waiterSerialize.errors})

# Added by Pratap Sahu on 27-08-23
# Reason - API to to get Customer Report Details
def getFilteredCustomerReport(customerList):
    
         arrayOfCustReport=list()
        #  customerList=CustomerDetail.objects.all()
         for customer in customerList:

            setdata = dict()
            name=customer.last_customer_name
            contactNumber=customer.contact_number
            
            if customer.last_email is None:
                email=customer.email
            else:
                email=customer.last_email
            
            numberOfOrders=Order.objects.filter(customer_id=customer.id).count()
            cancelledOrder=Order.objects.filter(customer_id=customer.id,order_status="Cancelled").count()
            completedOrder=Order.objects.filter(customer_id=customer.id,payment_status="Completed").count()
            loyaltyPoints=customer.loyality_points
            total=Order.objects.filter(customer_id=customer.id).values('total')
            totalAmount=0
            for x in total:
                totalAmount+=x['total']
                
            setdata['last_customer_name']=name
            setdata['contact_number']=contactNumber
            setdata['email']=email
            setdata['numberOfOrders']=numberOfOrders
            setdata['cancelledOrder']=cancelledOrder
            setdata['completedOrder']=completedOrder
            setdata['loyality_points']=loyaltyPoints
            setdata['totalAmount']=totalAmount
            
            arrayOfCustReport.append(setdata)
         return arrayOfCustReport

class CustomerReportAPI(APIView):

    # Added by pratap sahu on 28-08-2023
    # Reason: to get Customer report list when sorting,searching or pagination appied
    def post(self,request,tenant):
        
        paginationDetails=request.data['paginationDetails']
        columnToSort=request.data['columnToSort']
        columnSortingOrder=request.data['columnSortingOrder']
        currentPage=paginationDetails['currentPage']
        listPerPage=paginationDetails['listPerPage']
        searchText=request.data['searchText']
        customerList=[]

        if columnToSort == "":
            customerList = CustomerDetail.objects.all()

        if searchText :
            customerList=CustomerDetail.objects.filter(Q(last_customer_name__icontains=searchText) | 
                                                       Q(last_email__icontains=searchText) |
                                                       Q(contact_number__icontains=searchText) 
                                                        )        
        else:
            customerList = CustomerDetail.objects.all()
        
        arraylist=getFilteredCustomerReport(customerList)
        # Added by pratap sahu on 29-08-23
        # Reason: to get sorted list details from backend
        if columnToSort == "last_customer_name" and columnSortingOrder=="ascending":
            customerList = sorted(arraylist,key=lambda x:x["last_customer_name"].lower())
        if columnToSort == "last_customer_name" and columnSortingOrder=="descending":
            customerList = sorted(arraylist,key=lambda x:x["last_customer_name"].lower(),reverse=True)
         
        if columnToSort == "contact_number" and columnSortingOrder=="ascending":
            customerList =sorted(arraylist,key=lambda x:x["contact_number"])
            
        if columnToSort == "contact_number" and columnSortingOrder=="descending":
            customerList =sorted(arraylist,key=lambda x:x["contact_number"],reverse=True)
                       
        if columnToSort == "email" and columnSortingOrder=="ascending":
            customerList =sorted(arraylist,key=lambda x:x["email"].lower())
        if columnToSort == "email" and columnSortingOrder=="descending":
            customerList =sorted(arraylist,key=lambda x:x["email"].lower(),reverse=True)
        
        if columnToSort == "totalAmount" and columnSortingOrder=="ascending":
            customerList = sorted(arraylist,key=lambda x:x["totalAmount"])
        if columnToSort == "totalAmount" and columnSortingOrder=="descending":
            customerList = sorted(arraylist,key=lambda x:x["totalAmount"],reverse=True)
                 
        if columnToSort == "numberOfOrders" and columnSortingOrder=="ascending":
            customerList = sorted(arraylist,key=lambda x:x["numberOfOrders"])
        if columnToSort == "numberOfOrders" and columnSortingOrder=="descending":
            customerList = sorted(arraylist,key=lambda x:x["numberOfOrders"],reverse=True) 
           
        if columnToSort == "cancelledOrder" and columnSortingOrder=="ascending":
            customerList = sorted(arraylist,key=lambda x:x["cancelledOrder"])
        if columnToSort == "cancelledOrder" and columnSortingOrder=="descending":
            customerList = sorted(arraylist,key=lambda x:x["cancelledOrder"],reverse=True)          
            
        if columnToSort == "completedOrder" and columnSortingOrder=="ascending":
            customerList = sorted(arraylist,key=lambda x:x["completedOrder"])
        if columnToSort == "completedOrder" and columnSortingOrder=="descending":
            customerList = sorted(arraylist,key=lambda x:x["completedOrder"],reverse=True) 
                        
        if columnToSort == "loyality_points" and columnSortingOrder=="ascending":
            customerList = sorted(arraylist,key=lambda x:x["loyality_points"])
        if columnToSort == "loyality_points" and columnSortingOrder=="descending":
            customerList = sorted(arraylist,key=lambda x:x["loyality_points"],reverse=True) 
      
        #  code addition by -  Pratap Sahu on 29-08-2023
        # Reason - To get list of customers using backend pagination
 
        if currentPage>1:
           startindex=int(listPerPage*(currentPage-1))
        else:
            startindex=0
        endIndex=startindex+int(listPerPage)
        filteredCutomerList=customerList[startindex:endIndex]
        print(filteredCutomerList,listPerPage,currentPage,startindex,endIndex)
        customerListCount=CustomerDetail.objects.all().count()
        return Response({
            "customerList":filteredCutomerList,
            "customerListCount":customerListCount,
            # "allcustomerList":filteredCutomerList
        },200)
        # End of code addition by -  Pratap Sahu on 29-08-2023
        # Reason - To get list of customers using backend pagination & Add search functionality
            

class WaiterAuthenticateAPI(APIView):
    def post(self,request,tenant):
        restaurant = Tenant.objects.get(tenant_name = tenant).restaurant_name
        try:
          waiterObj=Waiter.objects.get(contact_number=request.data["contact_number"])
        except:
            return Response({"error":"Please enter valid contact number"})
        
        from django.contrib.auth.hashers import check_password

        if(check_password(request.data["password"],waiterObj.password)):
          from admin_app.authentication import create_access_token,create_refresh_token
          access_token = create_access_token(waiterObj.id)
          refresh_token = create_refresh_token(waiterObj.id)
          waiterSerialize=WaiterSerializer(waiterObj)
          
          return Response({"token":access_token,"refresh_token":refresh_token,
                           "waiter":waiterSerialize.data,
                           'tenantInfo': Tenant.objects.filter(tenant_name = tenant).values().first(),
            })
        else:
          return Response({"error":"Please enter valid password"})  