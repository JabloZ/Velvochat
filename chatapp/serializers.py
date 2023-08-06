from .models import FriendsRequest
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from chatapp.models import Profile, FriendsRequest, File, Message
from django.core.exceptions import ValidationError

FriendsRequestModel=FriendsRequest

class FriendsRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model=FriendsRequestModel
        fields=('who_send','who_received')

class GroupChatEditSerializer(serializers.ModelSerializer):
    class Meta:
        model=FriendsRequestModel
        fields=('name','image')


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True, required=False)

    class Meta:
        model = Message
        fields = '__all__'

