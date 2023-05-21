"""
    Created by - Ashish Dewangan on 30-04-2023
    Reason - To have signals logic of backend
"""

from django.db.models.signals import post_save
from .models import *
from firebase_admin.messaging import Message,Notification
from django.dispatch import receiver
from .serializers import *
from django.core import serializers

# @receiver(post_save,sender=Order)
# def on_order_status_update(sender,instance,created,**kwargs):
#     if not created:
#         try:
#             print("post save-----------------------------")
#             customerDetail=CustomerDetail.objects.get(id=instance.customer_id.id)
#             print(customerDetail.id)
#             order=Order.objects.filter(id=instance.id)
#             fcmRegisteredObject=FcmNotification.objects.filter(phone_number=customerDetail.contact_number)
#             fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":serializers.serialize('json',order)}))
#         except Exception as e:
#             print("exception occured :----------------",e) 
#     else:
#         print("created-------------------------------------")           


