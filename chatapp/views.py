from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.core import serializers
from django.contrib.auth.decorators import login_required
from .models import FriendsRequest, GroupChat, Message, File
from chatapp.models import Profile, Account
from django.core.files.uploadedfile import SimpleUploadedFile
from django.shortcuts import get_object_or_404, Http404
from .serializers import FriendsRequestSerializer, GroupChatEditSerializer, FileSerializer
import json
from django.core.serializers.json import DjangoJSONEncoder
from .validations import validate_request
import datetime
from django.db.models import Count

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
        try:
            is_requested_by_looking_user=FriendsRequest.objects.get(who_send=request.user.profile, who_received=second_us_prof)
        except:
            is_requested_by_looking_user=None
    
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
                
                request.user.profile.friends.add(request_processed.who_send)
                request_processed.who_send.friends.add(request.user.profile)
                request_processed.delete()
                
                
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
    

class ShowUserGroups(APIView):
    def get(self, request, *args, **kwargs):  
        all_groups=GroupChat.objects.filter(members=request.user.profile)
        print(all_groups)
        n=[{"name":x.name, "id":x.id, "image":x.image.url if x.image else "", "type":x.type} for x in all_groups]
        print(n)
        return Response({'groups':n}, status=status.HTTP_200_OK)
    
class ShowChat(APIView):
    def get(self, request, *args, **kwargs):
        
        print(request.data)
        choosen_group=GroupChat.objects.get(id=kwargs["id"])
        if request.user.profile in choosen_group.members.all():
            print(choosen_group)
            print(choosen_group.members.all())
            all_members=[{"username":x.user.username, "image":x.image.url if x.image else "", "admin":'yes' if x.user.profile in choosen_group.admins.all() else 'no'} for x in choosen_group.members.all()]
            return Response({"group":{"name":choosen_group.name, "image":choosen_group.image.url if choosen_group.image else "", "type":choosen_group.type, "members":all_members, "admin":"yes" if request.user.profile in choosen_group.admins.all() else "no"}}, status=status.HTTP_200_OK)
        else:
            print('nieautoryzowany')
            return Response("",status=status.HTTP_401_UNAUTHORIZED)
        
class ShowMessages(APIView):
    def get(self, request, *args, **kwargs):
        choosen_group=GroupChat.objects.get(id=kwargs["id"])
        if request.user.profile in choosen_group.members.all():
            messages=Message.objects.filter(belongs_to=choosen_group)
            #messages_returned=[{"author":x.author.user.username, "text":x.text, "date":datetime.datetime.strptime(str(x.date)[0:10], "%Y-%m-%d").strftime('%d/%m/%Y'), 'files':x.files} for x in messages]
            messages_returned=[]
            for x in messages:
                one_mes={}
                one_mes["author"]=x.author.user.username
                one_mes["text"]=x.text
                one_mes["date"]=datetime.datetime.strptime(str(x.date)[0:10], "%Y-%m-%d").strftime('%d/%m/%Y')
                print('fasfasfasfas')
                files_container=[]
                for file in x.files.all():
                    files_container.append(file.file.url)

                one_mes["files"]=files_container
                messages_returned.append(one_mes)

            return Response({"group_messages":messages_returned}, status=status.HTTP_200_OK)
        else:
            print('nieautoryzowany')
            return Response("",status=status.HTTP_401_UNAUTHORIZED)

class SendMessage(APIView):
    def post(self, request, *args, **kwargs):
        group_id=kwargs["id"]
        print(request.data, kwargs["id"],'fasasasasasasasasas')
        try:
            groupWherePosted=GroupChat.objects.get(id=group_id)
            if request.user.profile in groupWherePosted.members.all():
                
                    mes=Message(text=request.data["text"], author=request.user.profile, belongs_to=groupWherePosted)
                    mes.save()
                    files = request.data.getlist('files[]', [])
                    all_fil=[]
                    files_url=[]
                    for uploaded_file in files:  
                        file_instance = File(file=uploaded_file)
                        file_instance.save()
                        all_fil.append(file_instance)
                        files_url.append(file_instance.file.url)
                    
                    mes.files.set(all_fil)
                    serializer = FileSerializer(all_fil, many=True)

                    return Response({"files":files_url},status=status.HTTP_201_CREATED)
            else:
                return Response("", status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response("",status=status.HTTP_400_BAD_REQUEST)
    
class PrivateChatExists(APIView):
    def get(self, request, *args, **kwargs):
        try:
            other_user=Account.objects.get(username=kwargs["username"])
            other_user_prof=Profile.objects.get(user=other_user)
            
            pk_list = [request.user.profile, other_user_prof]

            node_query = GroupChat.objects.annotate(count=Count('members')).filter(count=len(pk_list))

            for pk in pk_list:
                print(pk)
                node_query = node_query.filter(members=pk)
            if node_query:
                print('cos jest')
                gc=(list(node_query))[0]
                print(gc.id)
                return Response({"isgroup":"yes", "groupid":gc.id},status=status.HTTP_200_OK)
            else:
                return Response({"isgroup":"no"},status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({"isgroup":"no"},status=status.HTTP_400_BAD_REQUEST)
        
class CreatePrivateChat(APIView):
     def post(self, request, *args, **kwargs):
        try:
            other_user=Account.objects.get(username=kwargs["username"])
            other_user_prof=Profile.objects.get(user=other_user)
            
            pk_list = [request.user.profile, other_user_prof]

            node_query = GroupChat.objects.annotate(count=Count('members')).filter(count=len(pk_list))

            for pk in pk_list:
                print(pk)
                node_query = node_query.filter(members=pk)
            if node_query:
                return Response({},status=status.HTTP_409_CONFLICT)
            else:
                
                g=GroupChat(name=f"{request.user.username}, {other_user_prof.user.username}", type="private")
                g.save()
                g.members.add(*pk_list)
                return Response({},status=status.HTTP_201_CREATED)
        except:
            return Response({},status=status.HTTP_400_BAD_REQUEST)
        
class ShowUserFriends(APIView):
    def get(self, request, *args, **kwargs):  
        get_user_account=Account.objects.get(username=kwargs["username"])
        get_user_profile=Profile.objects.get(user=get_user_account)
        all_friends=get_user_profile.friends.all()

        n=[{"name":x.user.username, "image":x.image.url if x.image else ""} for x in all_friends]
        print(len(n),len(all_friends))
        return Response({'friends':n, 'flistlength':len(all_friends)}, status=status.HTTP_200_OK)

class CreateGroup(APIView):
    def post(self, request, *args, **kwargs):
        group_name=request.data["name"]
        if group_name!="":
            print(request.data)
            if request.data["image"]:
                group_image=request.data["image"]
            else:
                group_image=""
            g=GroupChat(name=group_name, image=group_image, type="group")
            g.save()
            g.members.add(request.user.profile)
            g.admins.add(request.user.profile)
            return Response({"group":g.id},status=status.HTTP_201_CREATED)
        
class LeaveGroup(APIView):
    def post(self, request, *args, **kwargs):
        
        group=GroupChat.objects.get(id=kwargs["id"])
        if group.type!="private":
            group.members.remove(request.user.profile)
            group.admins.remove(request.user.profile)
            if len(list(group.members.all()))<1:
                group.delete()
            return Response(status=status.HTTP_202_ACCEPTED)
        
class DeleteFromGroup(APIView):
    def post(self, request, *args, **kwargs):
        print(request.data)
        group=GroupChat.objects.get(id=request.data["group"])
        print(group)
        user=Account.objects.get(username=request.data["username"])
        print(user)
        profile=Profile.objects.get(user=user)
        print(profile)

        if group.type!="private" and request.user.profile in group.admins.all() and profile not in group.admins.all():
            print('none')
            group.members.remove(profile)
            group.admins.remove(profile)
            return Response(status=status.HTTP_202_ACCEPTED)
    
class EditGroup(APIView):
    print('to nawet kurwa nie dociera xD')
    def get(self, request, *args, **kwargs):

        group=GroupChat.objects.get(id=kwargs['id'])
        if request.user.profile in group.admins.all():
            return Response({"authorized":"yes", "name":group.name, "image":group.image.url if group.image else ""}, status=status.HTTP_200_OK)
        else:
            return Response({"authorized":"no"}) 
        
    def post(self,request, *args, **kwargs):
        print('gowno zajebane')
        print(request.data,'fasgasgasonjigbnasovov9u')
        group=GroupChat.objects.get(id=kwargs["id"])
        if request.user.profile in group.admins.all():
            serializer=GroupChatEditSerializer(group)
            if "image" in request.data:
                group.image.delete(save=True)
                print(request.data["image"], 'grupa image')
                group.image.save(request.data["image"].name, request.data["image"])
            if "name" in request.data:
                group.name=str(request.data["name"])
                group.save()
            return Response({"group":group.id},status=status.HTTP_202_ACCEPTED)
        else:
            return Response("You are unathorized to do this (not a group admin)")
        
class DeleteGroupPicture(APIView):
    def post(self, request, *args, **kwargs):
        group=GroupChat.objects.get(id=kwargs["id"])
        if request.user.profile in group.admins.all():
            group.image.delete(save=True)
            return Response({''}, status=status.HTTP_200_OK)
        else:
            return Response("You are unathorized to do this (not a group admin)")
        
class AddToGroup(APIView):
    def post(self,request, *args, **kwargs):
        group=GroupChat.objects.get(id=kwargs["id"])
        try:
            Iuser=Account.objects.get(username=request.data["user"])
            Puser=Profile.objects.get(user=Iuser)
        except:
            return Response({"info":"user not found"})
        if request.user.profile in group.admins.all():
            if Puser in group.members.all():
                return Response({"info":"user already in group"}) 
            elif Puser not in request.user.profile.friends.all():
                return Response({"info":"user not in friends"}) 
            else:
                group.members.add(Puser)
                return Response({"info":"user succesfully added"},status=status.HTTP_202_ACCEPTED)
        else:
            return Response({"info":"something else went wrong."})

