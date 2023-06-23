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
import logging 
logger=logging.getLogger("custom_logger")
# Commented by :- Parineeta Gedam on 22-06-2023
# reason :- conditions based we send push notifications 
# @receiver(post_save,sender=Order)
# def on_order_status_update(sender,instance,created,**kwargs):
#     if not created:
#         try:
#             customerDetail=CustomerDetail.objects.get(id=instance.customer_id.id)
#             order=Order.objects.get(id=instance.id)
#             orderItem = OrderItem.objects.filter(order_id = order)
#             fcmRegisteredObject=FcmNotification.objects.filter(phone_number=customerDetail.contact_number)
#             data1=serializers.serialize('json', [ order,])
#             print("data1=====", data1)
#             data2=serializers.serialize('json', orderItem)
#             print("data1=====", data2)

#             fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":data1, "orderItem" : data2}))
#             print("success order status update -----")
#         except Exception as e:
#             print("exception occured order :----------------",e) 
#     else:
#         print("created order -------------------------------------")          
# End of commented code by :- Parineeta Gedam on 22-06-2023 reason :- conditions based we send push notifications 


# Added by :- Parineeta Gedam on 22-06-2023
# reason :- conditions based we send push notifications 

@receiver(post_save,sender=Order)
def on_order_status_update(sender,instance,created,**kwargs):
    if not created:
        try:
            customerDetail=CustomerDetail.objects.get(id=instance.customer_id.id)
            order=Order.objects.get(id=instance.id)
            orderItem = OrderItem.objects.filter(order_id = order).order_by('-id')
            try :
                fcmRegisteredObject=FcmNotification.objects.filter(phone_number=customerDetail.contact_number)
                if order.order_status == "Confirm" and order.send_notifications_on_order_update == True :
                    data1=serializers.serialize('json', [ order,])
                    data2=serializers.serialize('json', orderItem)
                    fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":data1, "orderItem" : data2}))
                # print("success order status confirm -----")
                if order.order_status == "Served" and order.send_notifications_on_order_update == True :
                    data1=serializers.serialize('json', [ order,])
                    data2=serializers.serialize('json', orderItem)
                    fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":data1, "orderItem" : data2}))
                # print("success order status Served -----")
                if order.payment_status == "Completed" and order.send_notifications_on_payment_update == True:
                    data1=serializers.serialize('json', [ order,])
                    data2=serializers.serialize('json', orderItem)
                    fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":data1, "orderItem" : data2}))
                # print("success order status Completed -----")
                if order.send_notifications_on_amount_update == True:
                    data1=serializers.serialize('json', [ order,])
                    data2=serializers.serialize('json', orderItem)
                    fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":data1, "orderItem" : data2}))
                # print("success order status Completed -----")
                # Added by :- Parineeta Gedam on 23-06-2023 reason :- send notifications for order cancelled
                if order.order_status == "Cancelled" :
                    data1=serializers.serialize('json', [ order,])
                    data2=serializers.serialize('json', orderItem)
                    fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":data1, "orderItem" : data2}))
                # End of Added by :- Parineeta Gedam on 23-06-2023 reason :- send notifications for order cancelled
            except :
                # Commented and modified by :- Parineeta gedam on 23-06-2023
                # fcmRegisteredObject=FcmNotification.objects.filter(phone_number=customerDetail.contact_number)
                # print("except ====== ")
                pass
                # End of Commented and modified by :- Parineeta gedam on 23-06-2023
                
        except Exception as e:
            print("exception occured order :----------------",e) 
    else:
        print("created order -------------------------------------")          

# End of commented code by :- Parineeta Gedam on 22-06-2023 reason :- conditions based we send push notifications 

# Added and modified by :- Parineeta Gedam on 22-05-2023 
# reason :- conditions based we send push notifications
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
            orderItem = OrderItem.objects.filter(order_id = instance.order_id).order_by('-id')
            orderItemID = OrderItem.objects.get(id = instance.id)
            fcmRegisteredObject=FcmNotification.objects.filter(phone_number=customerDetail.contact_number)

            # Modified by :- Parineeta Gedam on 22-06-2023 reason :- conditions based send push notifications 
            if orderItemID.item_status == "Confirm" and orderItemID.send_notifications_on_item_update == True:
                fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":serializers.serialize('json',[order,]),"orderItem":serializers.serialize('json',orderItem)}))
                # print("success orderItem status update--------")

            if orderItemID.item_status == "Cancelled" and orderItemID.send_notifications_on_item_update == True:
                fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":serializers.serialize('json',[order,]),"orderItem":serializers.serialize('json',orderItem)}))
                # print("success orderItem status update--------")

            if orderItemID.item_status == "Pending" and orderItemID.send_notifications_on_item_update == True:
                fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":serializers.serialize('json',[order,]),"orderItem":serializers.serialize('json',orderItem)}))
                # print("success orderItem status update--------")    
            
        except Exception as e:
            logger.info("exception occured order Items :----------------"+str(e)) 
    else:
        print("created order items-------------------------------------")   

# End of modifications code by :- Parineeta Gedam on 22-05-2023 reason :- conditions based send push notifications

