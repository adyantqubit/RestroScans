from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import *
from admin_app.models import *
from ..serializers import *
from django.db.models import Q
import logging
from django.core.paginator import Paginator
from django.conf import settings
from common.listing import list_page

class TenantAPIView(APIView):
    def get(self,request,tenant):
        from django.db.models import F
        from admin_app.serializers import TenantListSerializer

        tenant_obj = Tenant.objects.select_related('restaurant_name').get(schema_name=tenant)
        if not VisitCount.objects.filter(tenant_name=tenant).update(count=F('count') + 1):
            VisitCount.objects.create(tenant_name=tenant, count=1)
        tenantListSerializer = TenantListSerializer(tenant_obj)

        from admin_app.plan_catalog import codes_for_tenant, plan_name_of

        return Response({
            "msg":"success",
            "tenantDetails":tenantListSerializer.data,
            "features_provided":codes_for_tenant(tenant_obj),
            "plan_name": plan_name_of(tenant_obj),
            })

class PlanFeaturesAPIView(APIView):
    """Feature codes of the signed-in restaurant's plan (the admin panel reads this)."""

    def get(self, request, tenant):
        from admin_app.plan_catalog import codes_for_tenant, plan_name_of

        tenant_obj = Tenant.objects.get(schema_name=tenant)
        return Response({
            "features": codes_for_tenant(tenant_obj),
            "plan_name": plan_name_of(tenant_obj),
        })

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
        from admin_app.plan_catalog import setting_write_data
        payload = setting_write_data(request, request.data)
        if "id" in payload :
            obj = Setting.objects.get(id=payload["id"])
            serial = SettingSerializer(obj, data=payload)
        else :
            serial = SettingSerializer(data=payload)
        if serial.is_valid():
            serial.save()
            return Response({
                "msg": "Updated Successfully",
                "settingsetdata": serial.data,
            }, status=status.HTTP_201_CREATED)
        return Response({"error": serial.errors}, status=status.HTTP_400_BAD_REQUEST)

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
        tenantObj = Tenant.objects.get(schema_name=tenant)

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
        from admin_app.plan_catalog import setting_write_data
        payload = setting_write_data(request, request.data)
        if "id" in payload :

            # Commented and modified by - Ashish Dewangan on 02-06-2023
            # Reason - exception was not being handled when empty id was coming
            # obj = Setting.objects.get(id=request.data["id"])
            # serial = SettingSaveSerializer(obj, data=request.data)
            try:
                obj = Setting.objects.get(id=payload["id"])
                serial = SettingSaveSerializer(obj, data=payload, partial=True)
            except Exception as e:
                serial = SettingSaveSerializer(data=payload)
            # End of code modification by - Ashish Dewangan. Reason - exception handling        
        else :
            serial = SettingSaveSerializer(data=payload)
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


class SocialLinksPageAPI(APIView):
    """Paged social-link list. Search, sort and page run in the database."""

    def post(self, request, tenant):
        rows, total = list_page(
            SocialLinks.objects.all(),
            request.data,
            ('social_media_name', 'social_media_link'),
            {'name': 'social_media_name', 'link': 'social_media_link'},
            default_order='id',
        )
        return Response({
            'msg': 'success',
            'social': SocialLinksSerializer(rows, many=True).data,
            'count': total,
        })

