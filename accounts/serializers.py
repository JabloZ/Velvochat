from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from chatapp.models import Profile, FriendsRequest
from django.core.exceptions import ValidationError

UserModel=get_user_model()
ProfileModel=Profile
FriendsRequestModel=FriendsRequest

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserModel
        fields='__all__'
    def create(self, clean_data):
        
        user_obj=UserModel.objects.create_user(email=clean_data['email'], password=clean_data['password'], username=clean_data['username'])
        user_obj.username=clean_data['username']
        user_obj.save()
        return user_obj
    
class UserLoginSerializer(serializers.Serializer):
    email=serializers.EmailField()
    password=serializers.CharField()

    def check_user(self, clean_data):
        
        user=authenticate(email=clean_data['email'], password=clean_data['password'])
        if not user:
            raise ValidationError('user not found')
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserModel
        fields=('email','username', 'last_login', 'is_active')

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProfileModel
        fields=('user','image','bio','friends', 'id')

class EditProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=ProfileModel
        fields=('image','bio')
