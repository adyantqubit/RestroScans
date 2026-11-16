from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import *
from admin_app.models import *
from ..serializers import *
from common.listing import list_page

class getCustomerList(APIView):
    def get(self,request,tenant):
        allCustomers = CustomerDetail.objects.all().order_by("-id")
        ordersSerializer=CustomerDetailSerializer(allCustomers, many=True)
        return Response ({"msg":"success", "allCustomers": ordersSerializer.data})

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
    def post(self, request, tenant):
        rows, total = list_page(
            CustomerDetail.objects.all(), request.data,
            ('last_customer_name', 'contact_number', 'loyality_points'),
            {'last_customer_name': 'last_customer_name', 'contact_number': 'contact_number',
             'loyality_points': 'loyality_points'}, default_order='id')
        return Response({
            "msg": "success",
            "customerList": CustomerDetailSerializer(rows, many=True).data,
            "customerListCount": total,
        })

