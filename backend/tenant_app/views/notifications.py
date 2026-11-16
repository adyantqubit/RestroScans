from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import *
from admin_app.models import *
from ..serializers import *
from django.db.models import Q
from django.core.paginator import Paginator

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

