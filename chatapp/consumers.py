from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync
from .models import GroupChat, Profile
from accounts.models import Account

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
        
        
        action_type=text_data_json["action_type"]

        if action_type=="message":
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
        #"members_type":"delete",
        #"user":e.target.dataset.username
        elif action_type=="members":
            if text_data_json["action"]=="delete":
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_id,
                    {
                        'type':'members_change',
                        'user':text_data_json["user"],
                        'action':text_data_json["action"]
                    }
                )
            elif text_data_json["action"]=="add":
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_id,
                    {
                        'type':'members_change',
                        'user':text_data_json["user"],
                        'action':text_data_json["action"]
                    }
                )
    def members_change(self, event):
        userE = event['user']
        type = event['type']
        action=event['action']
        acc=Account.objects.get(username=userE)
        prof=Profile.objects.get(user=acc)

        self.send(text_data=json.dumps({
            'type':'members',
            'user':{'username':userE,'image':prof.image.url if prof.image else "", 'isAdmin':"no"},
            'action':action
        }))



    def chat_message(self, event):
        print('to chyba nie ma miejsca nawet \n ka')
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
        
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_id,
            self.channel_name,
        )