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
import datetime

# Commented by Rohan kansari - 28/9/23 - To comment all firbase signal and connecting 
# websocket for sending push notification

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

# @receiver(post_save,sender=Order)
# def on_order_status_update(sender,instance,created,**kwargs):
#     if not created:
#         try:
#             customerDetail=CustomerDetail.objects.get(id=instance.customer_id.id)
#             order=Order.objects.get(id=instance.id)
#             orderItem = OrderItem.objects.filter(order_id = order).order_by('-id')
#             try :
#                 fcmRegisteredObject=FcmNotification.objects.filter(phone_number=customerDetail.contact_number)
#                 if order.order_status == "Confirm" and order.send_notifications_on_order_update == True :
#                     data1=serializers.serialize('json', [ order,])
#                     data2=serializers.serialize('json', orderItem)
#                     fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":data1, "orderItem" : data2}))
#                 # print("success order status confirm -----")
#                 if order.order_status == "Served" and order.send_notifications_on_order_update == True :
#                     data1=serializers.serialize('json', [ order,])
#                     data2=serializers.serialize('json', orderItem)
#                     fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":data1, "orderItem" : data2}))
#                 # print("success order status Served -----")
#                 if order.payment_status == "Completed" and order.send_notifications_on_payment_update == True:
#                     data1=serializers.serialize('json', [ order,])
#                     data2=serializers.serialize('json', orderItem)
#                     fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":data1, "orderItem" : data2}))
#                 # print("success order status Completed -----")
#                 if order.send_notifications_on_amount_update == True:
#                     data1=serializers.serialize('json', [ order,])
#                     data2=serializers.serialize('json', orderItem)
#                     fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":data1, "orderItem" : data2}))
#                 # print("success order status Completed -----")
#                 # Added by :- Parineeta Gedam on 23-06-2023 reason :- send notifications for order cancelled

#                 # Added by Rohan kansari - 28/8/23 - To send notification in table update
#                 if order.send_notification_on_tableNum_update== True:
#                     data1=serializers.serialize('json', [ order,])
#                     data2=serializers.serialize('json', orderItem)
#                     fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":data1, "orderItem" : data2}))
#                 # ENd of code - Rohan kansari - 28/8/23 - To send notification in table update


#                 if order.order_status == "Cancelled" :
#                     data1=serializers.serialize('json', [ order,])
#                     data2=serializers.serialize('json', orderItem)
#                     fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":data1, "orderItem" : data2}))
#                 # End of Added by :- Parineeta Gedam on 23-06-2023 reason :- send notifications for order cancelled
#             except :
#                 # Commented and modified by :- Parineeta gedam on 23-06-2023
#                 # fcmRegisteredObject=FcmNotification.objects.filter(phone_number=customerDetail.contact_number)
#                 # print("except ====== ")
#                 pass
#                 # End of Commented and modified by :- Parineeta gedam on 23-06-2023
                
#         except Exception as e:
#             print("exception occured order :----------------",e) 
#     else:
#         print("created order -------------------------------------")          

# # End of commented code by :- Parineeta Gedam on 22-06-2023 reason :- conditions based we send push notifications 

# # Added and modified by :- Parineeta Gedam on 22-05-2023 
# # reason :- conditions based we send push notifications
# @receiver(post_save,sender=OrderItem)
# def on_orderItem_status_update(sender,instance,created,**kwargs):

#     # Commented by :- Parineeta Gedam on 30-06-2023 reason :- not used
#     # orderItemObject = OrderItem.objects.filter(order_id = instance.order_id)
#     # itemsPrice = []
#     # for cart in orderItemObject:
#     #     if(cart.item_status != "Cancelled") :
#     #         price = cart.price
#     #         itemsPrice.append(price)
#     # order = Order.objects.get(order_id = instance.order_id)
#     # subTotal = round(float("{:.2f}".format(sum(itemsPrice))),2)

#     # Modified by :- Parineeta Gedam on 28-06-2023
#     # order.sub_total=subTotal
#     # order.order_status="Placed"
#     # order.save()
#     # orders = Order.objects.filter(order_id = instance.order_id).update(sub_total = subTotal,
#     #                                                                     # order_status = "Placed"
#     #                                                                     )
#     # End of Modified by :- Parineeta Gedam on 28-06-2023
#     # End of Commented code by :- Parineeta Gedam on 30-06-2023 reason :- not used
    
#     if not created:
#         try:
#             customerDetail=CustomerDetail.objects.get(id=order.customer_id.id)
#             order=Order.objects.get(order_id=instance.order_id)
#             orderItem = OrderItem.objects.filter(order_id = instance.order_id).order_by('-id')
#             orderItemID = OrderItem.objects.get(id = instance.id)
#             fcmRegisteredObject=FcmNotification.objects.filter(phone_number=customerDetail.contact_number)

#             # Modified by :- Parineeta Gedam on 22-06-2023 reason :- conditions based send push notifications 
#             if orderItemID.item_status == "Confirm" and orderItemID.send_notifications_on_item_update == True:
#                 fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":serializers.serialize('json',[order,]),"orderItem":serializers.serialize('json',orderItem)}))
#                 # print("success orderItem status update--------")

#             if orderItemID.item_status == "Cancelled" and orderItemID.send_notifications_on_item_update == True:
#                 fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":serializers.serialize('json',[order,]),"orderItem":serializers.serialize('json',orderItem)}))
#                 # print("success orderItem status update--------")

#             if orderItemID.item_status == "Pending" and orderItemID.send_notifications_on_item_update == True:
#                 fcmRegisteredObject.send_message(Message(notification=Notification(title='Restroscans.com', body='Order Status'),data={"order":serializers.serialize('json',[order,]),"orderItem":serializers.serialize('json',orderItem)}))
#                 # print("success orderItem status update--------")    
            
#         except Exception as e:
#             logger.info("exception occured order Items :----------------"+str(e)) 
#     else:
#         print("created order items-------------------------------------")   

# # End of modifications code by :- Parineeta Gedam on 22-05-2023 reason :- conditions based send push notifications


# End of Commentation by Rohan kansari - 28/9/23 - To comment all firbase signal and connecting 
# websocket for sending push notification

# Added by Rohan kansari - 28/9/23 - To comment all firbase signal and connecting 
# websocket for sending push notification
class DateTimeEncoder(json.JSONEncoder):
    def default(self, z):
        if isinstance(z, datetime.datetime):
            return (str(z))
        else:
            return super().default(z)

@receiver(post_save, sender=Order)
def update_order_instance(sender, instance,created, **kwargs):
    from django.db import connection
    schema_name=connection.schema_name 
    try:
        print("mksd",schema_name)
        # pass
        # with connection.cursor() as cursor:
        #     cursor.execute('SELECT * FROM '+schema_name+'.tenant_app_order WHERE order_id= %s',[instance.order_id])
        #     # import json
        #     # print(OrderSerializer(cursor.fetchall()[0]))
        #     print(cursor.fetchall()[0][0])
        #     cursor.execute('SELECT * FROM '+schema_name+'.tenant_app_orderitem WHERE order_id= %s',[instance.order_id])
        #     print(cursor.fetchall()[0])
            # print(value)
        values=Order.objects.raw('SELECT * FROM '+schema_name+'.tenant_app_order WHERE order_id= %s',[instance.order_id])
        values2=OrderItem.objects.raw('SELECT * FROM '+schema_name+'.tenant_app_orderitem WHERE order_id_id= %s',[values[0].id])
        order={}
        order["order"]=OrderSerializer(values,many=True).data[0]
        order["order_item"]=OrderItemWithOrderIdSerializer(values2,many=True).data
        print("----------schema",order)
    except Exception as inst:
        order=None    
        print("signal87",order,inst)
   
    channel_layer = get_channel_layer()
    print('order_%s_%s'%(instance.order_id,schema_name))
    if instance.order_created_by == "User" and order is not None:
        async_to_sync(channel_layer.group_send)(
            'order_%s_%s'%(instance.order_id,schema_name),{
                'type': 'order_status',
                'value': order
            }
        )
    #Added by Rohan kansari - 29/9/23 - To connect with dashboard also
    async_to_sync(channel_layer.group_send)(
            'dashboard_data_%s'%schema_name,{
                'type': 'update_dashbaord',
                'value': schema_name
            }
        )    
    #End of addition by Rohan kansari - 29/9/23 - To connect with dashboard also

@receiver(post_save, sender=OrderItem)
def update_order_item(sender,created,instance, **kwargs):
  
        from django.db import connection
        schema_name=connection.schema_name 
        try:
            values=Order.objects.raw('SELECT * FROM '+schema_name+'.tenant_app_order WHERE order_id= %s',[instance.order_id.order_id])
            values2=OrderItem.objects.raw('SELECT * FROM '+schema_name+'.tenant_app_orderitem WHERE order_id_id= %s',[values[0].id])
            order=dict()
            from tenant_app.serializers import OrderSerializer,OrderItemWithOrderIdSerializer
            order["order"]=OrderSerializer(values[0]).data
            order["order_item"]=OrderItemWithOrderIdSerializer(values2,many=True).data
        except:
            order=None    
            print(order)
        
        channel_layer = get_channel_layer()
        print('order_%s_%s'%(values[0].order_id,schema_name))
        if values[0].order_created_by == "User" and order is not None:
            async_to_sync(channel_layer.group_send)(
                'order_%s_%s'%(instance.order_id,schema_name),{
                    'type': 'order_status',
                    'value': order
                }
            )

# End of addition by Rohan kansari - 28/9/23 - To comment all firbase signal and connecting 
# websocket for sending push notification