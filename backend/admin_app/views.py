from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import APIException, AuthenticationFailed
from .authentication import *
from .models import *
from .serializers import *
from django.contrib.auth.hashers import make_password, check_password
from .send_mail import *

"""
Added by - Ashish Dewangan on 08-02-2023
Reason - To get list of tenants
"""
class TenantAPIView(APIView):
    def get(self,request,tenantId=None):
        if tenantId:
            tenant=Tenant.objects.get(tenant_name=tenantId)
            tenantSerializer=TenantListSerializer(tenant)
            return Response({"msg":"success","tenantDetails":tenantSerializer.data})
        else:
            tenantList=Tenant.objects.all()
            tenantListSerializer=TenantListSerializer(tenantList,many=True)
            return Response({"msg":"success","tenantList":tenantListSerializer.data})
"""
End of code addition
"""


"""
Added by - Yuvraj Sahu on 15-2-2023
Reason - To save tenant request
"""
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie

class RestaurantRegistartionView(APIView):
    # @csrf_exempt
    def post(self, request, format=None):
        # Commented by Yuvraj Sahu on 29-3-2023
        # Reason - to remove hash password because it is hashed in models
        # encryptedPassword = make_password(request.data.get('password'))
        # request.data['password'] = encryptedPassword
        # End of comment
        serializer = RestaurantRequestSerializer(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({'msg':'Successfully Saved'})
            else :
                return Response({'err':'Data not save'})
        except Exception as e:
            print(e)    
            return Response({'msg':'Error'})
"""
End of code addition
"""


"""
Added by - Yuvraj Sahu on 17-2-2023
Reason - To authenticate restaurant for login using jwt
"""
class RestaurantLoginView(APIView):
    def post(self, request):
        restaurant = RestaurantRequest.objects.filter(email = request.data.get('email')).first()
        print(request.data.get('password'))
        print(request.data["password"])
        print(restaurant.email)
        # Modified by Yuvraj Sahu on 2-3-2023
        # Reason - to send email and password validation msg
        response = Response()
        if not restaurant:
            # raise APIException('Invalid Credentials')
            response.data = {
                'invalid': 'Invailid email'
            }
            return response
        # if not restaurant.check_password(request.data['password']):
        print(check_password(request.data.get('password'), restaurant.password))
        if not check_password(request.data.get('password'), restaurant.password):
            # raise APIException('Invalid Credentials')
            response.data = {
                'invalid': 'Invailid password'
            }
            return response
    
        if restaurant.is_active==False:
            # response = Response()
            response.data = {
                'error': 'Please wait for approval'
            }
            return response
        # End of Modification
        access_token = create_access_token(restaurant.id)
        refresh_token = create_refresh_token(restaurant.id)

        response = Response()
        response.set_cookie(key='refreshToken', value=refresh_token)

        response.data = {
            'token': access_token,
            'userData': [RestaurantRequest.objects.filter(email=request.data.get('email')).values()[0]],
            # Added by Yuvraj Sahu on 25-3-2023
            # Reason - to get tenant data
            'tenantInfo': Tenant.objects.filter(restaurant_name = restaurant.id).values().first()
            # End of Addition
        }
        return response


"""
Added by - Yuvraj Sahu on 18-2-2023
Reason - To send otp in mail for forget password
"""
class OtpAPI(APIView):
    def post(self ,request):
        email= request.data.get('email')
        restaurant=RestaurantRequest.objects.filter(email=email).count()
        if restaurant>0:
            restaurantObj = RestaurantRequest.objects.get(email=email)
            serializer=OtpSerializer(restaurantObj,data=request.data)
            if serializer.is_valid():
                serializer.save()
                send_otp_via_email(email)
                data=dict()
                data["msg"]="OTP is sent succssfully. Please check your email"
                data["mail"]=email
                response=Response(data, status=200)
                return response
        else:
            data=dict()
            data["error"]="Entered email is not registered"
            response=Response(data, status=200)
            return response
"""
End of code addition
"""


"""
Added by - Yuvraj Sahu on 18-2-2023
Reason - To upldate password
"""
class UpdatePassword(APIView):
   def put(self, request):
        email=request.data.get('email')
        otp = request.data.get('otp')
        otp_obj = Otp.objects.filter(email=email, otp=otp)
        if(otp_obj):
            #check otp timeout
            createdTs=otp_obj[0].otptime
            from datetime import datetime,timedelta
            from django.utils import timezone
            currentTs=timezone.now()
            expTime=(createdTs+timedelta(minutes=5))
            if(currentTs>expTime):
                data=dict()
                data["error"]="OTP Expired"
                response=Response(data, status=200)
                return response
            else:
                restaurantObj = RestaurantRequest.objects.get(email=email)
                restaurantObj.password = make_password(request.data['password'])
                restaurantObj.confirm_password = make_password(request.data['password'])
                restaurantObj.save()
                data=dict()
                data["msg"]="Password successfully changed"
                response=Response(data, status=200)
                return response
        else:
            data=dict()
            data["error"]="Entered OTP is wrong"
            response=Response(data, status=200)
            return response
"""
End of code addition
"""

class AppSettingAPI(APIView):
    def get(self,request):
        settings = AppSetting.objects.all().values().first()
        print(settings)
        return Response({
            "app_logo":settings["app_logo"],
            "adyant_logo":settings["adyant_logo"],
            "title":settings["title"],
            "bottom_text":settings["bottom_text"],
            "adyant_webite_link":settings["adyant_webite_link"]},200)