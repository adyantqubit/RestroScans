# Created by Rohan Kansari - 28/9/23 
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync,sync_to_async
import json
from  tenant_app.models import *


# class OrderConsumer(AsyncWebsocketConsumer):

#     async def connect(self):
#         self.group_name='order_data'
#         await self.channel_layer.group_add(
#             self.group_name,
#             self.channel_name
#         )

#         await self.accept()

#     async def disconnect(self,close_code):
#         pass

#     async def receive(self,text_data):
#         # print (text_data)
#         await self.channel_layer.group_send(
#             self.group_name,
#             {
#                 'type':'send_order',
#                 'value':text_data,
#             }
#         )

#     async def send_order(self,event):
#         print (event['value'])
#         await self.send(event['value'])
        
        

class OrderProgress(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['order_id']+"_"+self.scope['url_route']['kwargs']['tenant']
        self.room_group_name = 'order_%s' % self.room_name
        # print(self.room_group_name)
        
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        # print("all runs")
        order = Order.give_order_details(self.room_name)
        self.accept()
        
        self.send(text_data=json.dumps({
            'payload': order
        }))

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        # Send message to room group
        # print("order_status send",text_data)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'order_status',
                'payload': text_data
            }
        )

    # Receive message from room group
    def order_status(self, event):
        # print("order_status send",event)
        data = event['value']
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'payload': data
        }))

#Added by Rohan kansari - 29/9/23 
# Reason - To send dashboard data
def DashboardDetails(tenant):
    # select * from tbl_name 
    # where cast(datecolumn as Date) = cast(getdate() as Date)
    # todays_newly_placed_orders=Order.objects.filter(date__gte=today,order_status='Placed').order_by("-id")
    # todays_newly_placed_orders_serializer=OrderSerializer(todays_newly_placed_orders, many=True)
    # todays_pending_orders=Order.objects.filter(~Q(order_status='Placed'),Q(payment_status='Pending')|Q(payment_status='Paid') ,date__gte=today).order_by("-id")
    # todays_completed_orders=Order.objects.filter(date__gte=today,payment_status='Completed').order_by("-id")
    # todays_order_item=OrderItem.objects.all().filter(date__gte=today).order_by("-id")
    from django.db import connection
    connection.set_schema(tenant)
    try:
        from django.utils.timezone import datetime

        today=datetime.today().date()
        order={}
        newly_placed=Order.objects.filter(order_status ="Placed",date__gte=today)
        from django.db.models import Q
        pending=Order.objects.filter(~Q(order_status='Placed'), Q(payment_status='Pending')|Q(payment_status='Paid') ,date__gte=today)
        Completed=Order.objects.filter(date__gte=today,payment_status='Completed' )
        todays_order_item=OrderItem.objects.filter(date__gte=today)
        # values2=OrderItem.objects.raw("SELECT * FROM "+tenant[1]+".tenant_app_orderitem WHERE order_id_id=  %s",[values[0].id])
        from tenant_app.serializers import OrderSerializer,OrderItemWithOrderIdSerializer
        order["todays_newly_placed_orders"]=OrderSerializer(newly_placed,many=True).data    
        order["todays_pending_orders"]=OrderSerializer(pending,many=True).data       
        order["todays_completed_orders"]=OrderSerializer(Completed,many=True).data       
        order["todays_order_item"]=OrderItemWithOrderIdSerializer(todays_order_item,many=True).data
        return order
    except Exception as inst:
        order=None    
        print("signal-dashboard",order,inst)

class DashboardData(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['tenant']
        self.room_group_name = 'dashboard_data_%s' % self.room_name
        print(self.room_group_name)
        
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        print("all runs")
        order = DashboardDetails(self.room_name)
        self.accept()
        
        self.send(text_data=json.dumps({
            'payload': order
        }))

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        # Send message to room group
        # print("order_status send",text_data)
        # text_data = DashboardDetails(self.room_name)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'update_dashbaord',
                'payload': text_data
            }
        )

    # Receive message from room group
    def update_dashbaord(self, event):
        # print("update_dashbaord send",event["value"])
        schema = event['value']
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'payload': DashboardDetails(schema)
        }))        