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
            return Response({"msg":"Banner added successfully"},status=status.HTTP_201_CREATED)
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
            return Response({"msg":"Banner item added successfully"},status=status.HTTP_201_CREATED)
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
        return Response({"error":"This item already exist with other offer"}, 400)
    
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
           return Response({
            "msg":"success",
            "setting":settingSerializer.data,
            })
        else:
            settingSerializer={"data":0}
            return Response({
                "msg":"no data",
                "setting":"",
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
def orderCreation(tenant,request):
        
        # Save cart item in Order table
        order_no = orderNoGeneration(tenant)  
        cartData = dict ()
        
        # setting order id , customer id (foreing key), and table no
        cartData['order_id'] =  order_no
        customer_id = CustomerDetail.objects.get(contact_number = request.data['contact_number'])
        cartData['customer_id'] =  customer_id.id
        cartData['table_number'] =  request.data['table_number']
        
        itemsPrice = []
        allOffer=OfferItem.objects.all()

        # loop to getting offered or non offered price to get subtotal 
        for cart in request.data['cart']:
            item = Item.objects.get(id = cart['id'])
            discounted=0
            if allOffer.filter(item_name=item).count() > 0:
                discounted = allOffer.get(item_name=item).offer_name.discount
            if(cart['serve_size'] == "Half Plate"):
                price = float(item.price_half)*float(cart['quantity']) - float(item.price_half *cart['quantity']/100)*discounted
            else :
                price =  float(item.price_full)*float(cart['quantity'])-float(item.price_full *cart['quantity']/100)*discounted

            itemsPrice.append(price)

        cartData['sub_total'] = sum(itemsPrice)

        tax = Setting.objects.first()

        if tax is not None :
            cartData['tax'] = (sum(itemsPrice)*(tax.tax))/100
            a = (sum(itemsPrice)*(tax.tax))/100
            cartData['total'] = a + sum(itemsPrice)

        else :
            cartData['tax'] = 0
            cartData['total'] = sum(itemsPrice)

        orderSerializer = OrderSerializer(data=cartData)
        order_obj=0
        
        if orderSerializer.is_valid(raise_exception=True):
            order_obj=orderSerializer.save()

        return {"order_obj":order_obj,"orderSerializer":orderSerializer}
        # End of added code 06-04-2023

# Added by :- Parineeta Gedam
# Date :- 06-04-2023
# Reason : method for save the cart item in order Items table
def orderItemsCreation(request,order_obj):
            
    # save cart item in Order Item Table
            cartItem = []
            allOffer=OfferItem.objects.all()

            for cart in request.data['cart']:
                cartData = dict ()

                item = Item.objects.get(id = cart['id'])
                discounted=0
                if allOffer.filter(item_name=item).count() > 0:
                   discounted = allOffer.get(item_name=item).offer_name.discount
                cartData["item_id"]=item.id   
                cartData['order_id'] =  order_obj.id
                cartData['item'] =  cart['name']
                cartData['serving_size'] =  cart['serve_size']
                cartData['quantity'] = cart['quantity']

                if(cart['serve_size'] == "Half Plate"):
                    cartData['price'] =  float(item.price_half)- float(item.price_half/100)*discounted
                else :
                    cartData['price'] =  float(item.price_full)-float(item.price_full/100)*discounted

                cartItem.append(cartData)
            
            orderItemSerializer = OrderItemSerializer(data=cartItem, many=True)
            if orderItemSerializer.is_valid(raise_exception=True):
                orderItemSerializer.save()   

            return {"orderItemSerializer":orderItemSerializer}  
   
# End of added code 06-04-2023 

# Added by :- Parineeta Gedam
# Date :- 06-04-2023
# Reason : method for get data in frontend
def responseDataCreation(order,orderItems,cutomer):
        return {
            "contact_number":cutomer.contact_number,
            "order_details":order,
            "order_items":orderItems
        }
# End of added code 06-04-2023 

# Added by :- Parineeta Gedam
# Date :- 06-04-2023
# Reason : API for save the customer Details in customerDetails Table, save the order in Order table and save the order Item in Order Item table.
class PostCustomerDetailsAPIView(APIView):
    def post(self,request,tenant):

        # try :
            try :
                customerDetails = CustomerDetail.objects.get(contact_number = request.data['contact_number'])
                if request.data["name"] in customerDetails.name.split(",") :
                    pass
                else :
                    customerDetails.name = customerDetails.name + "," + request.data["name"]
                    customerDetails.save()

            except :
                customerDetails = {
                    "name":request.data['name'],
                    "email":request.data['email'],
                    "contact_number":request.data['contact_number'],
                }
                CustomerSerializer = CustomerDetailSerializer(data=customerDetails)
                if CustomerSerializer.is_valid():
                   CustomerSerializer.save()

            orderValue=orderCreation(tenant,request)
            order_obj=orderValue['order_obj']
            orderSerializer=orderValue['orderSerializer']

            orderItem = orderItemsCreation(request,order_obj)
            orderItemSerializer=orderItem['orderItemSerializer']

            data=responseDataCreation(orderSerializer.data,orderItemSerializer.data,CustomerDetail.objects.get(contact_number=request.data['contact_number']))

            return Response({"msg":"success", "data":data},status=status.HTTP_201_CREATED)
        # except:
        #     return Response({"msg":"error"},status=status.HTTP_201_CREATED)
# End of added code 06-04-2023 

# Added by :- Parineeta Gedam
# Date :- 10-04-2023
# Reason :- In order Item table update rating and review 

class updateRatingAndReviewAPIView(APIView):
   
    def put(self, request, tenant):

        orderList = request.data
        for order in orderList:
            orderObj = OrderItem.objects.get(id = order['id'])
            if 'rating' in order:
                orderObj.rating = order['rating']
            else :
                pass                 

            if order['review'] == "":
                orderObj.review = "-"
            else :
                orderObj.review = order['review']

            orderObj.save()

        return Response({ "msg": "success"},status=status.HTTP_201_CREATED)
# End of added code 10-04-2023

# Added by :- Parineeta Gedam
# Date :- 10-04-2023
# Reason :- In order and order items table update cart data.

class updateOrdersAPIView(APIView):
   
    def put(self, request, tenant):
        print("request", request.data)

        updateOrderList = []


        # cart= []
        # cart=request.data['cart']
        # cart.filter(id=)

        # for cartItem in request.data['cart']:
        #     for orderItem in request.data['orderItem']:
        #         # if orderItem[]
        #         pass


        # orderObj = Order.objects.filter(order_id = request.data['order_id'])
        # print("orderObj",orderObj)

        # orderSerializer = OrderSerializer(orderObj,data=request.data, partial = True)
        # print("============",orderSerializer)
        # if OrderSerializer.is_valid():
        #     print("----------------")
        #     OrderSerializer.save()
        #     return Response({"msg":"success", "orderSerializer" : orderSerializer.data},status=status.HTTP_201_CREATED)
        return Response({})
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
        ordersSerializer=OrderSerializer(allOrders, many=True)
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
        return Response ({
            "msg":"success",
            "orderItems": orderItemsSerializer.data,
            "customerDetail": customerSerializer.data,
            "orderDetail": OrderSerializers.data
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
        if setting or theme is not None:
           settingSerializer=SettingSerializer(setting)
           return Response({
            "msg":"success",
            "themeOptions": themeSerializer.data,
            "setting":settingSerializer.data,
            })
        else:
            settingSerializer={"data":0}
            return Response({
                "msg":"no data",
                "setting":"",
                })
    
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
            "msg":"success",
            "settingsetdata":serial.data,
            },status=status.HTTP_201_CREATED)
        return Response({"error":serial.errors}, status=status.HTTP_400_BAD_REQUEST)
    # End of modification
# End of addition

"""
Added by :- Parineeta Gedam 
Date - 11/04/2023
Reason - To add scanner
"""
class getPaymentMethodAPIView(APIView):
    def get(self,tenant):
        print("------")
        content = PaymentMethod.objects.all()
        serializer = PaymentMethodSerializer(content, many=True)
        return Response(serializer.data)
"""
End of added code
"""

# Added by :- Parineeta Gedam
# Date :- 10-04-2023
# Reason :- In order table update the payment mode['cash', 'scanner', 'card']. 

class updatePaymentModeAPIView(APIView):
   
    def put(self, request, tenant):

        orderObj = Order.objects.get(order_id = request.data['order_id'])
        print("orderObj",orderObj)
        orderObj.payment_mode=request.data['payment_mode']
        orderObj.save()
        return Response({"msg":"success"},200)
    

# End of added code 10-04-2023

