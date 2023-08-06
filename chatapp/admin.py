from django.contrib import admin
from .models import GroupChat, Message, Profile, FriendsRequest, File
# Register your models here.
admin.site.register(GroupChat)
admin.site.register(Message)
admin.site.register(Profile)
admin.site.register(FriendsRequest)
admin.site.register(File)