import logging
from django.db.models import Avg

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.listing import list_page

from ..models import Category, Item, Menu, Offer, OfferItem
from ..repositories.catalog_repository import getBestproduct
from ..serializers import *

def items_with_ratings(queryset):
    return queryset.annotate(average_rating_value=Avg("orderitem__rating"))



class MenuAPIView(APIView):
    def get(self,request,tenant):
        menuList=Menu.objects.all().order_by('name')
        var = menuList.filter(is_active = True) 
        menuData = MenuListSerializer(var, many =True)

        categoryList=Category.objects.select_related('menu').filter(is_active=True, menu__is_active=True).order_by('name')
        categoryListSerializer=CategoryListSerializer(categoryList,many=True)

        # itemList=items_with_ratings(Item.objects.select_related('category__menu')).order_by('name')
        itemList=items_with_ratings(Item.objects.select_related('category__menu')).filter(is_active=True, category__menu__is_active=True,category__is_active=True).order_by('name')
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
            "show_item_ratings_to_customers": bool(getattr(Setting.objects.last(), "show_item_ratings_to_customers", False)),
            "top_product": list

        })
    #end of code- rohan - 13/4/23
    # Added by Yuvraj Sahu on 23-3-2023
    # Reason - to save menu
    def post(self,request,tenant):
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
        # Added by Yuvraj Sahu on 7-4-2023
        # reason - to get updated menu category and item
        menuList=Menu.objects.all().order_by('name')
        menuData = MenuListSerializer(menuList, many =True)
        categoryList=Category.objects.select_related('menu').order_by('name')
        categoryListSerializer=CategoryListSerializer(categoryList,many=True)
        itemList=items_with_ratings(Item.objects.select_related('category__menu')).order_by('name')
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

class CategoryAPIView(APIView):
    # def get(self,request,tenant):
    #     categoryList=Category.objects.select_related('menu')
    #     categoryListSerializer=CategoryListSerializer(categoryList,many=True)
    #     return Response({"msg":"success","categoryList":categoryListSerializer.data})

    # Added by Yuvraj Sahu on 23-3-2023
    # Reason - to save category
    def post(self,request,tenant):
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
        # Added by Yuvraj Sahu on 7-4-2023
        # reason - to get updated menu category and item
        menuList=Menu.objects.all().order_by('name')
        menuData = MenuListSerializer(menuList, many =True)
        categoryList=Category.objects.select_related('menu').order_by('name')
        categoryListSerializer=CategoryListSerializer(categoryList,many=True)
        itemList=items_with_ratings(Item.objects.select_related('category__menu')).order_by('name')
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

class ItemAPIView(APIView):
    def get(self,request,tenant):
        itemList=items_with_ratings(Item.objects.select_related('category__menu'))
        itemListSerializer=ItemListSerializer(itemList,many=True)
        return Response({"msg":"success","menuList":itemListSerializer.data})

    # Added by Yuvraj Sahu on 23-3-2023
    # Reason - to save item
    def post(self,request,tenant):
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

class OfferAPIView(APIView):
    def get(self,request,tenant):
        # Added and modified by Yuvraj Sahu on 18-08-2023
        # Reason - to sort of banner list
        # offerBanner=Offer.objects.all()
        offerBanner=Offer.objects.filter(is_active=True).order_by("offer_name")
        # End of modification by Yuvraj Sahu on 18-08-2023
        offerbannerSerializer=OfferBannerSerializer(offerBanner,many=True)
        # offerItemList=OfferItem.objects.select_related('offer_name', 'item_name')
        offerItemList=OfferItem.objects.select_related('offer_name', 'item_name').filter(offer_name__is_active=True, item_name__is_active=True, item_name__category__is_active=True,item_name__category__menu__is_active=True)
        offeritemsSerializer=OfferItemsSerializer(offerItemList,many=True)

        return Response({
            "msg":"success",
            "offerBanner":offerbannerSerializer.data,
            "offerItemList":offeritemsSerializer.data,
            })
    
    # Added by Om on 9-4-2023
    # Reason - to save banner details
    def post(self,request,tenant):
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
        offerBanner=Offer.objects.all()
        offerbannerSerializer=OfferBannerSerializer(offerBanner,many=True)
        # offerItemList=OfferItem.objects.select_related('offer_name', 'item_name')
        offerItemList=OfferItem.objects.select_related('offer_name', 'item_name').filter(item_name__is_active=True, item_name__category__is_active=True,item_name__category__menu__is_active=True)
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

class OfferItemsAPIView(APIView):
    def get(self,request,tenant):
        offerItemList=OfferItem.objects.select_related('offer_name', 'item_name').filter(item_name__is_active=True, item_name__category__is_active=True,item_name__category__menu__is_active=True)
        offeritemsSerializer=OfferItemsSerializer(offerItemList,many=True)

        return Response({
            "msg":"success",
            "offerItemList":offeritemsSerializer.data,
            })
    
    def post(self,request,tenant):
        serializedData = OfferallItemsSerializer(data=request.data)
     
        if serializedData.is_valid():
            serializedData.save()
            return Response({"msg": "Banner/Offer Item Added Successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
        # End of addition by Yuvraj Sahu on 07-05-2023
        # End of moodification
    # End of addition

    def put(self, request,tenant, pk):
        id = pk
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

class getAllMenusAPI(APIView):
    def get(self,request,tenant):
        menuList=Menu.objects.all().order_by('name')
        menuData = MenuListSerializer(menuList, many =True)
        categoryList=Category.objects.select_related('menu').order_by('name')
        categoryListSerializer=CategoryListSerializer(categoryList,many=True)
        itemList=items_with_ratings(Item.objects.select_related('category__menu')).order_by('name')
        itemListSerializer=ItemListSerializer(itemList,many=True)
        # Added by Om shrivastava on 26-06-23
        # Reason : Show item name by id 
        itemListbyId=items_with_ratings(Item.objects.select_related('category__menu')).order_by('id')
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
    def post(self, request, tenant):
        rows, total = list_page(Menu.objects.all(), request.data, ('name',),
                                {'name': 'name', 'is_active': 'is_active'}, default_order='id',
                                filter_fields={'is_active': 'is_active'})
        return Response({
            "msg": "success",
            "menuList": MenuListSerializer(rows, many=True).data,
            "menuListCount": total,
        })

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

class CategoryAPI(APIView):
    # Added by Yuvraj Sahu on 16-06-2023
    # Reason - To get count of category
    def get(self,request,tenant):
         categoryCount=Category.objects.select_related('menu').count() 
         return Response({
            "msg":"success",
            "categoryCount":categoryCount,
        })
    # End of code addition by - Yuvraj Sahu on 16-06-2023
    # Reason - To get count of category
    
    # Added by - Yuvraj Sahu on 16-06-2023
    # Reason - To get list of category using backend pagination.
    def post(self, request, tenant):
        rows, total = list_page(
            Category.objects.select_related('menu'), request.data, ('name', 'menu__name'),
            {'name': 'name', 'menu': 'menu__name', 'is_active': 'is_active'}, default_order='id',
            filter_fields={'is_active': 'is_active'})
        return Response({
            "msg": "success",
            "categoryList": CategoryListSerializer(rows, many=True).data,
            "categoryListCount": total,
        })

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

class ItemAPI(APIView):
    # Added by Yuvraj Sahu on 23-06-2023
    # Reason - To get count of item
    def get(self,request,tenant):
         itemCount=items_with_ratings(Item.objects.select_related('category__menu')).count() 
         return Response({
            "msg":"success",
            "itemCount":itemCount,
        })
    # End of code addition by - Yuvraj Sahu on 23-06-2023
    # Reason - To get count of item
    
    # Added by - Yuvraj Sahu on 23-06-2023
    # Reason - To get list of item using backend pagination.
    def post(self, request, tenant):
        rows, total = list_page(
            items_with_ratings(Item.objects.select_related('category__menu')), request.data,
            ('name', 'category__name', 'price_full', 'price_half'),
            {'name': 'name', 'category': 'category__name', 'priceFull': 'price_full', 'priceHalf': 'price_half',
             'is_active': 'is_active', 'best_seller': 'best_seller'}, default_order='id',
            filter_fields={'is_active': 'is_active', 'best_seller': 'best_seller'})
        return Response({
            "msg": "success",
            "itemList": ItemListSerializer(rows, many=True).data,
            "itemListCount": total,
        })

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
        categories = Category.objects.select_related('menu')
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

class GetCategoryAPI(APIView):
    def get(self,request,tenant):
        categoryList=Category.objects.select_related('menu').order_by('name')
        # Commeted and modification by yuvraj Sahu on 20-07-2023
        # Reason - to return all categories
        # var = categoryList.filter(is_active = True) 
        categoryListSerializer = CategoryListSerializer(categoryList, many =True)
        # End of modification by yuvraj sahu on 20-07-2023
        return Response({"msg":"success", "categoryList":categoryListSerializer.data})

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
    def post(self, request, tenant):
        rows, total = list_page(Offer.objects.all(), request.data, ('offer_name', 'discount'),
                                {'offer_name': 'offer_name', 'discount': 'discount'},
                                filter_fields={'is_active': 'is_active'})
        return Response({
            "msg": "success",
            "offerBannerList": OfferBannerSerializer(rows, many=True).data,
            "offerBannerListCount": total,
        })

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
    #     offerItemList=OfferItem.objects.select_related('offer_name', 'item_name').filter(item_name__is_active=True, item_name__category__is_active=True,item_name__category__menu__is_active=True)
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
    #         itemList=items_with_ratings(Item.objects.select_related('category__menu')).order_by("-id")
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

class OfferBannerItemAPI(APIView):
    
    # Added by Om Shrivastava  on 17-09-23
    # Reason - To get count of offer/banner 
    def get(self,request,tenant):
         offerBannerCount=OfferItem.objects.select_related('offer_name', 'item_name').count() 
         allOfferBanner = OfferItem.objects.select_related('offer_name', 'item_name').order_by('-id')
         offerItemSerializer=OfferItemsSerializer(allOfferBanner, many=True)

        #  offerItemList=OfferItem.objects.select_related('offer_name', 'item_name').filter(item_name__is_active=True, item_name__category__is_active=True,item_name__category__menu__is_active=True)
        #  offeritemsSerializer=OfferItemsSerializer(offerItemList,many=True)
        
         return Response({
            "msg":"success",
            "offerItemCount":offerBannerCount,
             #  Added by Om Shrivastava on 26-07-23
             #  Reason : get the rating and review for restaurant
            "allOfferItemBanner":offerItemSerializer.data
             #  End of addition by Om Shrivastava on 26-07-23
             #  Reason : get the rating and review for restaurant
        })
    # End of code addition by - Om Shrivastava  on 17-09-23
    # Reason - To get count of rating for restaurant
    
    # Added by - Om Shrivastava  on 17-09-23
    # Reason - To get list of rating for restaurant using backend pagination.
    def post(self, request, tenant):
        rows, total = list_page(
            OfferItem.objects.select_related('offer_name', 'item_name'), request.data,
            ('offer_name__offer_name', 'item_name__name'),
            {'offer_name': 'offer_name__offer_name', 'item_name': 'item_name__name'})
        return Response({
            "msg": "success",
            "offerBannerItemList": OfferItemsSerializer(rows, many=True).data,
            "offerBannerItemListCount": total,
        })

class BannerItemAPIView(APIView):

    logger=logging.getLogger("custom_logger")
    def get(self,request,tenant,offerItemId):
        self.logger.info(request.data)
        offerBannerCount=OfferItem.objects.select_related('offer_name', 'item_name').count() 

        if offerItemId:
            offer=OfferItem.objects.get(id=offerItemId)
        else:
            offer= None

        if offer:
            offerSerializer=OfferItemsSerializer(offer)
            offerData=offerSerializer.data
        else:
            offerData={}  
       
        return Response({"msg":"success","offerItem":offerData,
                              "offerItemBannerCount":offerBannerCount,
                         })
   
    def post(self,request,tenant):
        
        if "id" in request.data :
            obj = OfferItem.objects.get(id=request.data["id"]) 
            offerBannerSave = OfferallItemsSerializer(obj, data=request.data,partial=True)
        else :
            offerBannerSave = OfferallItemsSerializer(data=request.data)
        if offerBannerSave.is_valid():
            offerBannerSave.save()
           
            offerBannerCount=OfferItem.objects.select_related('offer_name', 'item_name').count() 
           
        
            return Response({"msg": "Saved Successfully","data":offerBannerSave.data,
                             
                              "offerItemBannerCount":offerBannerCount
                            

                              }, status=status.HTTP_201_CREATED)
        return Response({"error": offerBannerSave.errors}, status=status.HTTP_400_BAD_REQUEST)

class MenuCategoryItemAPIView(APIView):
    def get(self,request,tenant,offerItemId):
        
        # print('gfagfgf', tenant)
        menuList=Menu.objects.all().order_by('name')
        var = menuList.filter(is_active = True) 
        menuData = MenuSerializer(var, many =True)

        categoryList=Category.objects.select_related('menu').filter(is_active=True, menu__is_active=True).order_by('name')
        categoryListSerializer=CategorySerializer(categoryList,many=True)

        # itemList=items_with_ratings(Item.objects.select_related('category__menu')).order_by('name')
        itemList=items_with_ratings(Item.objects.select_related('category__menu')).filter(is_active=True, category__menu__is_active=True,category__is_active=True).order_by('name')
        itemListSerializer=ItemSerializer(itemList,many=True)

        offerItemList=OfferItem.objects.select_related('offer_name', 'item_name').filter(item_name__is_active=True, item_name__category__is_active=True,item_name__category__menu__is_active=True,offer_name=offerItemId)
        offeritemsSerializer=OfferItemsSerializer(offerItemList,many=True)

        # list = getBestproduct()
        return Response({
            "msg":"success",
            "menuList":menuData.data,
            "categoryList": categoryListSerializer.data,
            "itemList": itemListSerializer.data,
            "offerItemList":offeritemsSerializer.data,
            # "top_product": list

        })
    
    def post(self,request,tenant):
        # print(request.data)
        serializedData = MenuListSerializer(data=request.data)
        if serializedData.is_valid():
            serializedData.save()
            return Response({"msg": "Saved Successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request,tenant, pk):
        id = pk
        # print("update method",request.data)
        menuList=Menu.objects.all().order_by('name')
        menuData = MenuListSerializer(menuList, many =True)
        categoryList=Category.objects.select_related('menu').order_by('name')
        categoryListSerializer=CategoryListSerializer(categoryList,many=True)
        itemList=items_with_ratings(Item.objects.select_related('category__menu')).order_by('name')
        itemListSerializer=ItemListSerializer(itemList,many=True)
        
        menuObj = Menu.objects.get(id = id)
        serializedData = MenuListSerializer(menuObj, data=request.data)
        if serializedData.is_valid(raise_exception=True):
            serializedData.save()
            return Response({
                "msg": "Updated Successfully",
                "menuList": menuData.data,
                "categoryList": categoryListSerializer.data,
                "itemList": itemListSerializer.data
            })
        return Response({"error":serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request,tenant, pk):
        id = pk
        menu = Menu.objects.get(id=id)
        if menu :
            menu.delete()
            return Response({"msg": "Deleted Successfully"}, 200)
        return Response({"error": "error"}, 404)
