

from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, ProfileSerializer
from rest_framework import permissions, status
from .validations import custom_validation, validate_email, validate_password, validate_username
from django.contrib.auth.decorators import login_required
from .models import Account
from chatapp.models import Profile
from django.shortcuts import get_object_or_404, Http404

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
		return Response({'profile': serializer.data, 'user':serializeuser.data}, status=status.HTTP_200_OK)