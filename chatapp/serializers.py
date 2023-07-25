from .models import FriendsRequest
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from chatapp.models import Profile, FriendsRequest
from django.core.exceptions import ValidationError

FriendsRequestModel=FriendsRequest

class FriendsRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model=FriendsRequestModel
        fields=('who_send','who_received')

