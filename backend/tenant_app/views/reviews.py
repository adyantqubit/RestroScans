# from django.shortcuts import render
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from ..models import *
# from admin_app.models import *
# from ..order_access import ensure_order_access
# from ..serializers import *
# from common.listing import list_page

# class updateRatingAndReviewAPIView(APIView):

#     def put(self, request, tenant):

#         # Check every line belongs to someone the caller may act for before saving any of them.
#         lines = []
#         for entry in request.data['ItemRateReview']:
#             line = OrderItem.objects.select_related('order_id__customer_id').get(id=entry['id'])
#             ensure_order_access(request, tenant, line.order_id)
#             lines.append((line, entry))

#         for line, entry in lines:
#             if 'rating' in entry:
#                 line.rating = entry['rating']
#             line.review = entry['review'] or "-"
#             line.save()

#         # The overall review is optional: a missing order or missing fields leave the item reviews saved.
#         order = Order.objects.select_related('customer_id').filter(order_id=request.data.get('order_id')).first()
#         if order is not None and 'overallReview' in request.data and 'overallRating' in request.data:
#             ensure_order_access(request, tenant, order)
#             order.review = request.data['overallReview']
#             order.rating = request.data['overallRating']
#             order.save()

#         return Response({"msg": "success"}, status=status.HTTP_201_CREATED)

# class RatingReviewAPI(APIView):
#     def post(self,request,tenant):
#         # print(request.data)
#         serializedData = RatingReviewSerializer(data=request.data)
     
#         if serializedData.is_valid():
#             serializedData.save()
#             return Response({"msg": "Saved Successfully"}, status=status.HTTP_201_CREATED)
#         return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)

# class RestaurantRatingAPI(APIView):
    
#     # Added by Om Shrivastava  on 24-07-2023
#     # Reason - To get count of rating for restaurant
#     def get(self,request,tenant):
#          ratingCount=RatingReview.objects.all().count() 
#         #  Added by Om Shrivastava on 26-07-23
#         #  Reason : get the rating and review for restaurant
#         #  Added by Om Shrivastava on 26-07-23
#         #  Reason : get the rating by id, and new sent data show always upper
#         #  allratingData = RatingReview.objects.all()
#          allratingData = RatingReview.objects.all().order_by('-id')
#         # End of addition and modification get the rating by id, and new sent data show always upper
#          ratingSerializer=RatingReviewSerializer(allratingData, many=True)
#         #  End of addition by Om Shrivastava on 26-07-23
#         #  Reason : get the rating and review for restaurant
#          return Response({
#             "msg":"success",
#             "ratingCount":ratingCount,
#              #  Added by Om Shrivastava on 26-07-23
#              #  Reason : get the rating and review for restaurant
#             "allRatingData":ratingSerializer.data
#              #  End of addition by Om Shrivastava on 26-07-23
#              #  Reason : get the rating and review for restaurant
#         })
#     # End of code addition by - Om Shrivastava  on 24-07-2023
#     # Reason - To get count of rating for restaurant
    
#     # Added by - Om Shrivastava  on 24-07-2023
#     # Reason - To get list of rating for restaurant using backend pagination.
#     def post(self, request, tenant):
#         rows, total = list_page(RatingReview.objects.all(), request.data, ('review', 'rating'),
#                                 {'review': 'review', 'rating': 'rating'})
#         return Response({
#             "msg": "success",
#             "ratingReviewList": RatingReviewSerializer(rows, many=True).data,
#             "ratingReviewListCount": total,
#         })




from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import *
from admin_app.models import *
from ..order_access import ensure_order_access
from ..serializers import *
from common.listing import list_page
from django.db.models import Avg, Count

class updateRatingAndReviewAPIView(APIView):

    def put(self, request, tenant):

        # Check every line belongs to someone the caller may act for before saving any of them.
        lines = []
        for entry in request.data['ItemRateReview']:
            line = OrderItem.objects.select_related('order_id__customer_id').get(id=entry['id'])
            ensure_order_access(request, tenant, line.order_id)
            lines.append((line, entry))

        for line, entry in lines:
            if 'rating' in entry:
                line.rating = entry['rating']
            line.review = entry['review'] or "-"
            line.save()

        # The overall review is optional: a missing order or missing fields leave the item reviews saved.
        order = Order.objects.select_related('customer_id').filter(order_id=request.data.get('order_id')).first()
        if order is not None and 'overallReview' in request.data and 'overallRating' in request.data:
            ensure_order_access(request, tenant, order)
            order.review = request.data['overallReview']
            order.rating = request.data['overallRating']
            order.save()

        return Response({"msg": "success"}, status=status.HTTP_201_CREATED)

class RatingReviewAPI(APIView):
    def post(self,request,tenant):
        # print(request.data)
        serializedData = RatingReviewSerializer(data=request.data)
     
        if serializedData.is_valid():
            serializedData.save()
            return Response({"msg": "Saved Successfully"}, status=status.HTTP_201_CREATED)
        return Response({"error": serializedData.errors}, status=status.HTTP_400_BAD_REQUEST)

class RestaurantRatingAPI(APIView):
    
    # Added by Om Shrivastava  on 24-07-2023
    # Reason - To get count of rating for restaurant
    def get(self,request,tenant):
         rating_stats = RatingReview.objects.filter(rating__isnull=False).aggregate(average=Avg("rating"), count=Count("id"))
         ratingCount = RatingReview.objects.count()
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
            "averageRating": round(float(rating_stats["average"] or 0), 2),
            "ratedCustomerCount": rating_stats["count"],
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
    def post(self, request, tenant):
        rows, total = list_page(RatingReview.objects.all(), request.data, ('review', 'rating'),
                                {'review': 'review', 'rating': 'rating'})
        return Response({
            "msg": "success",
            "ratingReviewList": RatingReviewSerializer(rows, many=True).data,
            "ratingReviewListCount": total,
        })

