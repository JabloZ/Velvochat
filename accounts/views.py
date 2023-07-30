

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
		data = request.data
		assert validate_email(data)
		assert validate_password(data)
		serializer = UserLoginSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			
			user = serializer.check_user(data)
			login(request, user)
			return Response(serializer.data, status=status.HTTP_200_OK)

class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		
		logout(request)
		return Response(status=status.HTTP_200_OK)

class UserView(APIView):
	
	permission_classes = (permissions.IsAuthenticated,)
	
	authentication_classes = (SessionAuthentication,)
	##
	def get(self, request):
		serializer = UserSerializer(request.user)
		
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)
	

class ProfileView(APIView):

	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)

	def get(self, *args, **kwargs):
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

		new_friend_list=[{"image":(get_object_or_404(Profile, id=x)).image.url if (get_object_or_404(Profile, id=x)).image else "","username":(get_object_or_404(Profile, id=x)).user.username, } for x in serializer.data["friends"]]
		serialized=serializer.data
		serialized["friends"]=new_friend_list
		
		return Response({'profile': serialized, 'user':serializeuser.data}, status=status.HTTP_200_OK)

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
