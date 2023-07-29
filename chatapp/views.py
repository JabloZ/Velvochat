from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.core import serializers
from django.contrib.auth.decorators import login_required
from .models import FriendsRequest, GroupChat
from chatapp.models import Profile, Account
from django.shortcuts import get_object_or_404, Http404
from .serializers import FriendsRequestSerializer
import json
from django.core.serializers.json import DjangoJSONEncoder
from .validations import validate_request
import datetime

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
            
class DidYouRequest(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    def get(self, request, *args, **kwargs):
        print(request.data)
        second_us=Account.objects.get(username=kwargs["username"])
        second_us_prof=Profile.objects.get(user=second_us)
        is_requested_by_looking_user=FriendsRequest.objects.get(who_send=request.user.profile, who_received=second_us_prof)
        print(is_requested_by_looking_user,'sprawdm')
        if not is_requested_by_looking_user:
            return Response({'is_requested_by_you':"no"}, status=status.HTTP_200_OK)
        else:
            return Response({'is_requested_by_you':"yes", 'request_id':is_requested_by_looking_user.id}, status=status.HTTP_200_OK)


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

class AllRequests(APIView):
    def get(self, request, *args, **kwargs):  
        all_requests=FriendsRequest.objects.filter(who_received=request.user.profile)
        

        to_send=[{"username":x.who_send.user.username, "image":x.who_send.image.name, "reqId":x.id, "date":datetime.datetime.strptime(str(x.date)[0:10], "%Y-%m-%d").strftime('%d/%m/%Y')} for x in all_requests]
        
        return Response({'requests_list':to_send}, status=status.HTTP_200_OK)
    
class ResponseToFriendsRequest(APIView):
    def post(self, request, *args, **kwargs):
        is_accepted=request.data["is_accepted"]
        if is_accepted=='yes':
            print('wow bedziecie znaj')
            request_processed=FriendsRequest.objects.get(id=kwargs["id"])
            print(request_processed)
            if request.user.profile==request_processed.who_received:
                print('zaraz akcept pojdzie jo')
                
                request.user.profile.friends.add(request_processed.who_send)
                request_processed.who_send.friends.add(request.user.profile)
                request_processed.delete()
                g=GroupChat(type='private', name=request.user.username+" "+request_processed.who_send.user.username+' conversation')
                g.save()
                g.members.add(*[request.user.profile, request_processed.who_send])
                
            else:
                print('wtf ziomus nie zaakceptujemy tego od cb')
                
        return Response({''}, status=status.HTTP_200_OK)
    
class deleteFriendsRequest(APIView):
    print('dotralo')
    def post(self, request, *args, **kwargs):
        request_processed=FriendsRequest.objects.get(id=kwargs["id"])
        if request.user.profile==request_processed.who_send:
            request_processed.delete()
            return Response({''}, status=status.HTTP_200_OK)
        else:
            return Response({''}, status=status.HTTP_401_UNAUTHORIZED)

class deleteFromFriends(APIView):
    def post(self, request, *args, **kwargs):

        user_to_remove_from_friends_acc=Account.objects.get(username=kwargs["username"])
        user_to_remove_from_friends=Profile.objects.get(user=user_to_remove_from_friends_acc)
        request.user.profile.friends.remove(user_to_remove_from_friends)
        user_to_remove_from_friends.friends.remove(request.user.profile)
        return Response({''}, status=status.HTTP_200_OK)
    
class deleteProfilePicture(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        request.user.profile.image.delete(save=True)
        return Response({''}, status=status.HTTP_200_OK)