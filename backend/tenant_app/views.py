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
        tenantListSerializer=TenantListSerializer(tenant)
        return Response({
            "msg":"success",
            "tenantDetails":tenantListSerializer.data,
            })
# End of addition

class MenuAPIView(APIView):
    def get(self,request,tenant):
        print('gfagfgf', tenant)
        menuList=Menu.objects.all()
        menuListSerializer=MenuListSerializer(menuList,many=True)
        categoryList=Category.objects.all()
        categoryListSerializer=CategoryListSerializer(categoryList,many=True)
        itemList=Item.objects.all()
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
            "menuList":menuListSerializer.data,
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
    
class ItemAPIView(APIView):
#     def get(self,request,tenant):
#         itemList=Item.objects.all()
#         itemListSerializer=ItemListSerializer(itemList,many=True)
#         return Response({"msg":"success","menuList":itemListSerializer.data})

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

# Added by Om on 01-03-23
# Reason : Show the Offer details
class OfferAPIView(APIView):
    def get(self,request,tenant):
        print('gfagfgf', tenant)
        offerBanner=Offer.objects.all()
        offerbannerSerializer=OfferBannerSerializer(offerBanner,many=True)
        offerItemList=OfferItem.objects.all()
        offeritemsSerializer=OfferItemsSerializer(offerItemList,many=True)

        return Response({
            "msg":"success",
            "offerBanner":offerbannerSerializer.data,
            "offerItemList":offeritemsSerializer.data,
            })
# End of addition

# Added by Om on 11-03-23
# Reason : Show the footer and description details
class FooterandDescriptionAPIView(APIView):
    def get(self,request,tenant):
        print('gfagfgf', tenant)
        footer=Footer.objects.all()
        footerSerializer=FooterSerializer(footer,many=True)
        descriptionList=Description.objects.all()
        descriptionSerializer=DescriptionSerializer(descriptionList,many=True)

        return Response({
            "msg":"success",
            "footer":footerSerializer.data,
            "descriptionList":descriptionSerializer.data,
            })
    
# End of addition

# Added by Om on 11-03-23
# Reason : Show the footer and description details
class SettingAPIView(APIView):
    def get(self,request,tenant):
        print('gfagfgf', tenant)
        setting=Setting.objects.last()
        settingSerializer=SettingSerializer(setting)

        return Response({
            "msg":"success",
            "setting":settingSerializer.data,
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
