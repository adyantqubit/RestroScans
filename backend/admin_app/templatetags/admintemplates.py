#Created by Om Shrivastava on 07-01-2023
#Reason - To show Revenue, todays orders, pending orders on dashboard

from django import template
from tenant_app.models import *
from tenant_app.serializers import *
import datetime
from django.utils.timezone import timedelta
from django.db.models.functions import TruncMonth
from django.db.models import Sum

register = template.Library()

@register.simple_tag
def getRevenue():
   
    today=datetime.date.today()

    # data=[]
    setdata = dict()

    # print("Menu !!!!!!!!!!!!!!!!!!!!!!!!", Menu.objects.filter(is_active=False))
    # print("category !!!!!!!!!!!!!!!!!!!!!!!!", Category.objects.filter(is_active=False))
    # print("item !!!!!!!!!!!!!!!!!!!!!!!!", Item.objects.filter(is_active=False))

    # tt=Property.objects.all()
    # print("--------------tt",tt)
    # totalListing = Property.objects.filter( date_modified_at__gte= today).count()
    # print('check total listing',totalListing)
    # setdata['totalListing']= totalListing
    # data.append(setdata)
    # return data        

#     setdata = dict()
#     totalListing = Property.objects.filter( date_modified_at__gte= today).count()
#     totalresgisteredUser = CustomUser.objects.filter( date_created_at__gte= today).count()
#     totalNakshaenquiry = NakshaPassRequest.objects.filter( date_created_at__gte= today).count()
#     totalNiyamitikaranenquiry = NiyamitikaranRequest.objects.filter( date_created_at__gte= today).count()
#     totalbuildingValuation = BuildingValuationRequest.objects.filter( date_created_at__gte= today).count()
#     totalconstructionSolution = ConstructionSolutionRequest.objects.filter( date_created_at__gte= today).count()
#     totalexpertOpinion = ExpertOpenionRequest.objects.filter( date_created_at__gte= today).count()
#     totalfreeEvaluation = FreeEvaluationRequest.objects.filter( date_created_at__gte= today).count()


#     setdata["title"]="Today's Entry"
#     setdata['totalListing']= totalListing
#     setdata['totalfreeEvaluation']= totalfreeEvaluation
#     setdata['totalNakshaenquiry']= totalNakshaenquiry
#     setdata['totalNiyamitikaranenquiry']= totalNiyamitikaranenquiry
#     setdata['totalbuildingValuation']= totalbuildingValuation
#     setdata['totalconstructionSolution']= totalconstructionSolution
#     setdata['totalexpertOpinion']= totalexpertOpinion
#     setdata['totalresgisteredUser']= totalresgisteredUser

#     data.append(setdata)

#     return data 