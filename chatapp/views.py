from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.core import serializers
from django.contrib.auth.decorators import login_required
from .models import FriendsRequest, GroupChat, Message, File, Notification
from chatapp.models import Profile, Account
from django.core.files.uploadedfile import SimpleUploadedFile
from django.shortcuts import get_object_or_404, Http404
from .serializers import FriendsRequestSerializer, GroupChatEditSerializer, FileSerializer
import json
from django.core.serializers.json import DjangoJSONEncoder
from .validations import validate_request
import datetime
from django.db.models import Count
import pytz

class FriendRequest(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    
    def get(self, request, *args, **kwargs):  
        if kwargs['id'] is not None:
            
            all_requests=FriendsRequest.objects.all()
            get_from_user=kwargs['id']
            get_from=Profile.objects.get(id=get_from_user)
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
        clean_data=validate_request(data2)
        
        serializer=FriendsRequestSerializer(data=clean_data)

        if not serializer.is_valid():
            print(serializer.errors)
        if serializer.is_valid(raise_exception=True):
            
            r = FriendsRequest(who_send=sender_profile, who_received=received_profile)
            r.save()
            if r:
                return Response(serializer.data, status=status.HTTP_201_CREATED)

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
                
                pk_list = [request.user.profile, request_processed.who_send]

                node_query = GroupChat.objects.annotate(count=Count('members')).filter(count=len(pk_list))
                for pk in pk_list:
                    node_query = node_query.filter(members=pk)
                if node_query:
                    print('n')
                else:
                    g=GroupChat(type='private', name=request.user.username+", "+request_processed.who_send.user.username)
                    g.save()
                    g.members.add(*[request.user.profile, request_processed.who_send])
                
                
            else:
                print('wtf ziomus nie zaakceptujemy tego od cb')
                
        return Response({''}, status=status.HTTP_200_OK)
    
class deleteFriendsRequest(APIView):
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
        request.user.profile.image.delete(save=True)
        return Response({''}, status=status.HTTP_200_OK)
    

class ShowUserGroups(APIView):
    def get(self, request, *args, **kwargs):  
        all_groups=GroupChat.objects.filter(members=request.user.profile)
        #"name":x.name, "id":x.id, "image":x.image.url if x.image else "", "type":x.type,
        n=[]
        for x in all_groups:
            to_add={}
            to_add["name"]=x.name
            to_add["id"]=x.id
            to_add["image"]=x.image.url if x.image else ""
            to_add["type"]=x.type
            all_mes=Message.objects.filter(belongs_to=x)
            
            if all_mes.exists():
                last_mes=(all_mes[::-1][0]).text
                last_mes_author=str((all_mes[::-1][0]).author)+": "
                last_mes_date=(all_mes[::-1][0]).date              
                date_str1 = str(datetime.datetime.now(pytz.utc))
                date_str2 = str(last_mes_date)
                
                date_format = "%Y-%m-%d %H:%M:%S.%f%z"
                date1 = datetime.datetime.strptime(date_str1, date_format)
                date2 = datetime.datetime.strptime(date_str2, date_format)

                last_mes_date_diff=date1-date2
                days = last_mes_date_diff.days
                seconds = last_mes_date_diff.seconds
                hours = seconds // 3600
                minutes = (seconds // 60) % 60
                last_mes_diff_int=last_mes_date_diff.seconds + last_mes_date_diff.days*86400
                if days!=0: 
                    last_mes_date_diff=str(days)+" days ago"
                elif days==0:
                    if hours!=0:
                        last_mes_date_diff=str(hours)+" hours ago"
                    else:
                        last_mes_date_diff=str(minutes)+" minutes ago"
            else:
                last_mes=""
                last_mes_author=""
                last_mes_date_diff="never"
                last_mes_diff_int=1000000000000
            to_add["last_mes_diff_int"]=last_mes_diff_int
            to_add["last_mes_date_diff"]=last_mes_date_diff
            to_add["last_mes"]=last_mes
            to_add["last_mes_author"]=last_mes_author
            
            n.append(to_add)

        sorted_data = sorted(n, key=lambda x: x['last_mes_diff_int'])    
        return Response({'groups':sorted_data}, status=status.HTTP_200_OK)
    
class ShowChat(APIView):
    def get(self, request, *args, **kwargs):
        
        choosen_group=GroupChat.objects.get(id=kwargs["id"])
        if request.user.profile in choosen_group.members.all():
            
            all_members=[{"username":x.user.username, "image":x.image.url if x.image else "", "admin":'yes' if x.user.profile in choosen_group.admins.all() else 'no', "owner":"yes" if x.user.profile==choosen_group.owner else "no"} for x in choosen_group.members.all()]
            return Response({"group":{"name":choosen_group.name, "image":choosen_group.image.url if choosen_group.image else "", "type":choosen_group.type, "members":all_members, "admin":"yes" if request.user.profile in choosen_group.admins.all() else "no", "owner":"yes" if request.user.profile==choosen_group.owner else "no", "is_member":"yes" if request.user.profile in choosen_group.members.all() else "no"}}, status=status.HTTP_200_OK)
        else:
            
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
                one_mes["date"]=str(datetime.datetime.strptime(str(x.date)[11:19], "%H:%M:%S"))[11:19]+" "+str(datetime.datetime.strptime(str(x.date)[0:10], "%Y-%m-%d").strftime('%d/%m/%Y'))
                one_mes["type"]=x.type
                files_container=[]
                for file in x.files.all():
                    files_container.append(file.file.url)

                one_mes["files"]=files_container
                messages_returned.append(one_mes)

            return Response({"group_messages":messages_returned}, status=status.HTTP_200_OK)
        else:
            
            return Response("",status=status.HTTP_401_UNAUTHORIZED)

class SendMessage(APIView):
    def post(self, request, *args, **kwargs):
        group_id=kwargs["id"]
        
        try:
            groupWherePosted=GroupChat.objects.get(id=group_id)
            if request.user.profile in groupWherePosted.members.all():
                    
                    if request.data["author"]=="system":
                        acc_pr=Account.objects.get(username="system")
                        pr=Profile.objects.get(user=acc_pr)
                        mes=Message(text=request.data["text"], author=pr, belongs_to=groupWherePosted, type='system')
                        mes.save()
                    else:
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
                
                node_query = node_query.filter(members=pk)
            if node_query:
                
                gc=(list(node_query))[0]
                
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
                
                node_query = node_query.filter(members=pk)
            if node_query:
                return Response({},status=status.HTTP_409_CONFLICT)
            else:
                
                g=GroupChat(name=f"{request.user.username}, {other_user_prof.user.username}", type="private")
                g.save()
                g.members.add(*pk_list)
                g.admins.add(*pk_list)




                return Response({},status=status.HTTP_201_CREATED)
        except:
            return Response({},status=status.HTTP_400_BAD_REQUEST)
        
class ShowUserFriends(APIView):
    def get(self, request, *args, **kwargs):  
        get_user_account=Account.objects.get(username=kwargs["username"])
        get_user_profile=Profile.objects.get(user=get_user_account)
        all_friends=get_user_profile.friends.all()

        n=[{"username":x.user.username, "image":x.image.url if x.image else "", "last_activity":str(x.last_activity)[0:10]+" "+str(x.last_activity)[11:19]} for x in all_friends]
        
        return Response({'friends':n, 'flistlength':len(all_friends)}, status=status.HTTP_200_OK)

class CreateGroup(APIView):
    def post(self, request, *args, **kwargs):
        group_name=request.data["name"]
        if group_name!="":
            
            if request.data["image"]:
                group_image=request.data["image"]
            else:
                group_image=""
            g=GroupChat(name=group_name, image=group_image, type="group", owner=request.user.profile)
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
        group=GroupChat.objects.get(id=request.data["group"])
        user=Account.objects.get(username=request.data["username"])
        profile=Profile.objects.get(user=user)

        if group.type!="private" and (request.user.profile in group.admins.all() and profile not in group.admins.all()) or request.user.profile==group.owner:
            group.members.remove(profile)
            group.admins.remove(profile)
            return Response(status=status.HTTP_202_ACCEPTED)
    
class EditGroup(APIView):
    def get(self, request, *args, **kwargs):

        group=GroupChat.objects.get(id=kwargs['id'])
        if request.user.profile in group.admins.all():
            return Response({"authorized":"yes", "name":group.name, "image":group.image.url if group.image else ""}, status=status.HTTP_200_OK)
        else:
            return Response({"authorized":"no"}) 
        
    def post(self,request, *args, **kwargs):
        group=GroupChat.objects.get(id=kwargs["id"])
        if request.user.profile in group.admins.all() or group.type=="private":
            serializer=GroupChatEditSerializer(group)
            if "image" in request.data:
                group.image.delete(save=True)
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
            return Response({"info":"user not found", "send":"no"})
        if request.user.profile in group.admins.all() or group.type!="private":
            if Puser in group.members.all():
                return Response({"info":"user already in group", "send":"no"}) 
            elif Puser not in request.user.profile.friends.all():
                return Response({"info":"user not in friends", "send":"no"}) 
            else:
                group.members.add(Puser)
                return Response({"info":"user succesfully added", "send":"yes"},status=status.HTTP_202_ACCEPTED)
        else:
            return Response({"info":"something else went wrong.", "send":"no"})

class ChangeRole(APIView):
    def post(self, request):
        g=GroupChat.objects.get(id=request.data["group"])
        if request.user.profile==g.owner:
            changed_user_acc=Account.objects.get(username=request.data["user"])
            changed_user=Profile.objects.get(user=changed_user_acc)
            if changed_user in g.members.all():
                if changed_user in g.admins.all():
                    g.admins.remove(changed_user)
                else:
                    g.admins.add(changed_user)
                return Response("Role changed succesfully")
            else:
                return Response("User not in group")
        else:
            return Response("",status=status.HTTP_401_UNAUTHORIZED)    
        
class UserNotifications(APIView):
    def get(self,request):
        all_not=Notification.objects.filter(belongs_to=request.user.profile)
        print(all_not,'all_not')
        return Response({"all_notifications":[{"text":x.text, "date":str(x.date)[0:10]+" "+str(x.date)[11:19]} for x in all_not]})