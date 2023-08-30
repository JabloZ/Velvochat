from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, ProfileSerializer, EditProfileSerializer
from rest_framework import permissions, status
from .validations import custom_validation, validate_email, validate_password, validate_username
from django.contrib.auth.decorators import login_required
from .models import Account
from chatapp.models import Profile
from django.shortcuts import get_object_or_404, Http404
from django.core.files.storage import FileSystemStorage

import datetime
import pytz

class UserRegister(APIView):
	
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		
		clean_data = custom_validation(request.data)
		
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			
			user = serializer.create(clean_data)
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)

	##
	def post(self, request):
		if request.user.is_authenticated:
			data = request.data
			assert validate_email(data)
			assert validate_password(data)
			serializer = UserLoginSerializer(data=data)
			if serializer.is_valid(raise_exception=True):
				
				user = serializer.check_user(data)
				login(request, user)
				return Response(serializer.data, status=status.HTTP_200_OK)	
		else:
			redirect("/")

class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		
		logout(request)
		return Response(status=status.HTTP_200_OK)

class UserView(APIView):
	print('tu mog')
	##
	
	def get(self, request):
		if request.user.is_authenticated:	
			try:
				serializer = UserSerializer(request.user)
				return Response({'user': serializer.data, "logged":"yes"}, status=status.HTTP_200_OK)
			except:
				print('tu error bo nei log')
				return Response({"logged":"no"}, status=status.HTTP_401_UNAUTHORIZED)
		else:
			return redirect("login")
	
	

class ProfileView(APIView):
	
		
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)

	def get(self, request, *args, **kwargs):
		def format_date(date_str1, date_str2):
			date_format = "%Y-%m-%d %H:%M:%S.%f%z"
			date1 = datetime.datetime.strptime(date_str1, date_format)
			date2 = datetime.datetime.strptime(date_str2, date_format)

			last_mes_date_diff=date1-date2
			days = last_mes_date_diff.days
			seconds = last_mes_date_diff.seconds
			hours = seconds // 3600
			minutes = (seconds // 60) % 60
			last_ac=last_mes_date_diff.seconds + last_mes_date_diff.days*86400
			if days!=0: 
				last_ac=str(days)+" days ago"
			elif days==0:
				if hours!=0:
					last_ac=str(hours)+" hours ago"
				else:
					last_ac=str(minutes)+" minutes ago"
			return last_ac
		


		serializer=ProfileSerializer
		username = self.kwargs.get("username")
		if username is not None:
			
			user = get_object_or_404(Account, username=username)
			obj = get_object_or_404(Profile, user=user)
			serializer=ProfileSerializer(obj)
			serializeuser=UserSerializer(user)
			if obj == None:
				raise Http404
		self.check_object_permissions(self.request, obj)
		#new_friend_list=[{"image":(get_object_or_404(Profile, id=x)).image.url if (get_object_or_404(Profile, id=x)).image else "","username":(get_object_or_404(Profile, id=x)).user.username, "last_active":(get_object_or_404(Profile, id=x)).last_activity} for x in serializer.data["friends"]]
		
		new_friend_list=[]
		for x in serializer.data["friends"]:
			to_append={}
			prof=Profile.objects.get(id=x)
			to_append["image"]=prof.image.url if prof.image else ""
			to_append["username"]=prof.user.username
			date_str1 = str(datetime.datetime.now(pytz.utc))
			date_str2 = str(prof.last_activity)

			last_ac=format_date(date_str1,date_str2)
			print(last_ac)
			to_append["last_activity"]=last_ac

			new_friend_list.append(to_append)
		serialized=serializer.data
		serialized["friends"]=new_friend_list
		print(new_friend_list)
		serialized["last_activity"]=format_date(str(datetime.datetime.now(pytz.utc)),str(obj.last_activity))
		
		return Response({'profile': serialized, 'user':serializeuser.data, 'flistlength':len(new_friend_list)}, status=status.HTTP_200_OK)

class editProfile(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	def get(self, request):
		serializer=EditProfileSerializer(request.user.profile)
		return Response({"profile":serializer.data}, status=status.HTTP_200_OK)
	def post(self, request, *args, **kwargs):
		if "image" in request.data:
			request.user.profile.image.delete(save=True)
			request.user.profile.image.save(request.data["image"].name, request.data["image"])
		if "bio" in request.data:	
			request.user.profile.bio=str(request.data["bio"])
			request.user.profile.save()
		return Response({"":''}, status=status.HTTP_200_OK)
