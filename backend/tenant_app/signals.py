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

@receiver(post_save,sender=Order)
def on_order_status_update(sender,instance,created,**kwargs):
    if not created:
        try:
            customerDetail=CustomerDetail.objects.get(id=instance.customer_id.id)
            order=Order.objects.get(id=instance.id)
            orderItem = OrderItem.objects.filter(order_id = order)
            fcmRegisteredObject=FcmNotification.objects.filter(phone_number=customerDetail.contact_number)
            data1=serializers.serialize('json', [ order,])
            data2=serializers.serialize('json', orderItem)
            fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":data1, "orderItem" : data2}))
            print("success-----")
        except Exception as e:
            print("exception occured order :----------------",e) 
    else:
        print("created order -------------------------------------")          


# Added by :- Parineeta Gedam on 25-05-2023
# reason :-

@receiver(post_save,sender=OrderItem)
def on_orderItem_status_update(sender,instance,created,**kwargs):
    orderItemObject = OrderItem.objects.filter(order_id = instance.order_id)
    itemsPrice = []
    for cart in orderItemObject:
        if(cart.item_status != "Cancelled") :
            price = cart.price
            itemsPrice.append(price)
    order = Order.objects.get(order_id = instance.order_id)
    subTotal = round(float("{:.2f}".format(sum(itemsPrice))),2)
    order.sub_total=subTotal
    order.save()
    if not created:
        try:
            customerDetail=CustomerDetail.objects.get(id=order.customer_id.id)
            order=Order.objects.get(order_id=instance.order_id)
            orderItem = OrderItem.objects.filter(order_id = instance.order_id)
            fcmRegisteredObject=FcmNotification.objects.filter(phone_number=customerDetail.contact_number)
            fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":serializers.serialize('json',[order,]),"orderItem":serializers.serialize('json',orderItem)}))
            print("success--------")
        except Exception as e:
            print("exception occured order Items :----------------",e) 
    else:
        print("created order items-------------------------------------")   

#  End of added code by :- Parineeta Gedam on 25-05-2023 


