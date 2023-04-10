from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import *
from admin_app.models import *
from .serializers import *

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
        visitCount=VisitCount.objects.get(tenant_name=tenant)
        visitCount.count=visitCount.count+1
        visitCount.save()
        tenantListSerializer=TenantListSerializer(tenant)
        return Response({
            "msg":"success",
            "tenantDetails":tenantListSerializer.data
            })
# End of addition

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
        return Response({
            "msg":"success",
            # Commented by Om
            # "tenantDetails":tenantListSerializer.data,
            # End of commented code
            "menuList":menuData.data,
            # "menuList":menuListSerializer.data,
            "categoryList":categoryListSerializer.data,
            "itemList":itemListSerializer.data
            })
    
    # Added by Yuvraj Sahu on 23-3-2023
    # Reason - to save menu
    def post(self,request,tenant):
        print(request.data)
        serializedData = MenuListSerializer(data=request.data)
     
        if serializedData.is_valid():
            serializedData.save()
            return Response({"msg":"success"},status=status.HTTP_201_CREATED)
        return Response({"error":serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
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
            "msg":"success",
            "menuList":menuData.data,
            "categoryList":categoryListSerializer.data,
            "itemList":itemListSerializer.data
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
            return Response({"msg":"Successfully deleted"},200)
        return Response({"error":"error"}, 404)
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
            return Response({"msg":"success"},status=status.HTTP_201_CREATED)
        return Response({"error":serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
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
            "msg":"Updated",
            "menuList":menuData.data,
            "categoryList":categoryListSerializer.data,
            "itemList":itemListSerializer.data
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
            return Response({"msg":"Successfully category deleted"},200)
        return Response({"error":"error"}, 404)
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
            return Response({"msg":"success"},status=status.HTTP_201_CREATED)
        return Response({"error":serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
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
            return Response({"msg":"Updated"},status=status.HTTP_201_CREATED)
        return Response({"error":serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of addition
    
    # Added by Om on 06-04-23
    # Reason - to delete the items
    def delete(self, request,tenant, pk):
        id = pk
        item = Item.objects.get(id=id)
        if item :
            item.delete()
            return Response({"msg":"Successfully Items deleted"},200)
        return Response({"error":"error"},404)
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
            return Response({"msg":"success"},status=status.HTTP_201_CREATED)
        return Response({"error":serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
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
            "msg":"success",
            "offerBanner":offerbannerSerializer.data,
            "offerItemList":offeritemsSerializer.data,
            })
        return Response({"error":serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of addition

    def delete(self, request,tenant, pk):
        id = pk
        category = Offer.objects.get(id=id)
        if category :
            category.delete()
            return Response({"msg":"Successfully banner deleted"},200)
        return Response({"error":"error"}, 404)
    
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
            return Response({"msg":"success"},status=status.HTTP_201_CREATED)
        return Response({"error":serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of addition

    def put(self, request,tenant, pk):
        id = pk
        print("update method",request.data)
        itemObj = OfferItem.objects.get(id = id)
        serializedData = OfferallItemsSerializer(itemObj, data=request.data)
        if serializedData.is_valid(raise_exception=True):
            serializedData.save()
            return Response({"msg":"Updated"},status=status.HTTP_201_CREATED)
        return Response({"error":serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request,tenant, pk):
        id = pk
        category = OfferItem.objects.get(id=id)
        if category :
            category.delete()
            return Response({"msg":"Successfully banner items deleted"},200)
        return Response({"error":"error"}, 404)
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
        print('gfagfgf', tenant)
        setting=Setting.objects.last()
        if setting is not None:
           settingSerializer=SettingSerializer(setting)
        else:
            settingSerializer={"data":0}
        return Response({
            "msg":"success",
            "setting":settingSerializer['data'],
            })
    
    def post(self,request,tenant):
        serial = SettingSerializer(data=request.data)
        if serial.is_valid():
            serial.save()
            return Response({
            "msg":"success",
            "settingsetdata":serial.data,
            },status=status.HTTP_201_CREATED)
        return Response({"error":serial.errors}, status=status.HTTP_400_BAD_REQUEST)
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