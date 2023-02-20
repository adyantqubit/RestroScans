from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
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
"""
End of code addition
"""

# class CategoryAPIView(APIView):
#     def get(self,request,tenant):
#         categoryList=Category.objects.all()
#         categoryListSerializer=CategoryListSerializer(categoryList,many=True)
#         return Response({"msg":"success","categoryList":categoryListSerializer.data})
    
# class ItemAPIView(APIView):
#     def get(self,request,tenant):
#         itemList=Item.objects.all()
#         itemListSerializer=ItemListSerializer(itemList,many=True)
#         return Response({"msg":"success","menuList":itemListSerializer.data})    
    