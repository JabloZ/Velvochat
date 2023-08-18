from django.contrib import admin
from .models import GroupChat, Message, Profile, FriendsRequest, File
# Register your models here.
admin.site.register(GroupChat)
admin.site.register(Message)

admin.site.register(FriendsRequest)
admin.site.register(File)

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'image', 'bio', 'last_activity')  # Dodaj tu nowe pole

admin.site.register(Profile, ProfileAdmin)
