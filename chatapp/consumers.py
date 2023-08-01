from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync
from .models import GroupChat

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        print(self.scope['user'])
        self.room_id = self.scope['url_route']['kwargs']['id']
        self.room_group_id= f'chat_{self.room_id}'
        self.room = GroupChat.objects.get(id=self.room_id)

        self.accept()

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_id,
            self.channel_name
        )


    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        
        message = text_data_json['message']
        date=text_data_json["date"]
        author=text_data_json["author"]

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_id,
            {
                'type':'chat_message',
                'message':message,
                "author":author,
                "date":date
            }
        )

    def chat_message(self, event):
        message = event['message']
        date=event["date"]
        author=event["author"]

        self.send(text_data=json.dumps({
            'type':'chat',
            'message':message,
            'author':author,
            'date':date
        }))
    def disconnect(self, close_code):
        print(close_code,'owboy')
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_id,
            self.channel_name,
        )