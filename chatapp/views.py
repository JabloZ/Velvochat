from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.core import serializers
from django.contrib.auth.decorators import login_required
from .models import FriendsRequest
from chatapp.models import Profile, Account
from django.shortcuts import get_object_or_404, Http404
from .serializers import FriendsRequestSerializer
import json
from django.core.serializers.json import DjangoJSONEncoder
from .validations import validate_request

class FriendRequest(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    
    def get(self, request, *args, **kwargs):  
        print(kwargs['id'])
        if kwargs['id'] is not None:
            
            all_requests=FriendsRequest.objects.all()
            get_from_user=kwargs['id']
            get_from=Profile.objects.get(id=get_from_user)
            print(get_from)
            try:

                sent_by=FriendsRequest.objects.filter(who_send=get_from)
                received_by=FriendsRequest.objects.filter(who_received=get_from)
                

                data_sent=FriendsRequestSerializer(sent_by, many=True)   
                data_received=FriendsRequestSerializer(received_by, many=True)   
                data_received=data_received.data    
                data=data_sent.data        
               

                
                return Response({'request_data': {'sent_by_user':data, 'received_by_user':data_received} }, status=status.HTTP_200_OK)
            except:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            
class isRequested(APIView):
    def get(self, request, *args, **kwargs):
        print(request.user.profile, args, kwargs)


class AddToFriends(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    
    def post(self, request, *args, **kwargs):

        received_user=Account.objects.get(username=request.data['who_received'])
        received_profile=Profile.objects.get(user=received_user)
        sender_profile=Profile.objects.get(id=request.data['who_send'])
        
        data2={"who_send":sender_profile.id,"who_received":received_profile.id}
        print(data2)
        clean_data=validate_request(data2)
        
        serializer=FriendsRequestSerializer(data=clean_data)
        print(serializer.is_valid())
        if not serializer.is_valid():
            print(serializer.errors)
        if serializer.is_valid(raise_exception=True):
            
            r = FriendsRequest(who_send=sender_profile, who_received=received_profile)
            r.save()
            print(r)
            if r:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print(serializer.errors)
        return Response(status=status.HTTP_400_BAD_REQUEST)

