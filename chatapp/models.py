from django.db import models
import datetime
from accounts.models import Account
from django.db.models.signals import post_save
from .validations import validate_file_extension
def upload_location_profile_image(instance, filename):
    file_path='images/users/{user}/profile-picture/{filename}'.format(user=str(instance.id), filename=filename)
    return str(file_path)

class Profile(models.Model):
    user = models.OneToOneField(Account, null=True, on_delete=models.CASCADE)
    bio=models.TextField(max_length=300, blank=True, null=True)
    friends=models.ManyToManyField("self", related_name='profile_friends', blank=True, symmetrical=False)
    image=models.ImageField(upload_to=upload_location_profile_image, null=True, blank=True)

    def __str__(self):
        return str(self.user.username)
    
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

post_save.connect(create_user_profile, sender=Account)

def upload_location_groupchat_logo(instance, filename):
    file_path='images/groups/{groupname}/groupimage/{filename}'.format(groupname=str(instance.id), filename=filename)
    return str(file_path)


class GroupChat(models.Model):
    now=datetime.datetime.now()

    image=models.ImageField(upload_to=upload_location_groupchat_logo, null=True, blank=True)
    type=models.CharField(max_length=10, unique=False, blank=False)
    name=models.TextField(max_length=60, unique=False, blank=False)
    admins=models.ManyToManyField(Profile, related_name='admins', blank=True)
    members=models.ManyToManyField(Profile, related_name='members', blank=True)
    date = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return str(str(self.name) + ' ' + str(self.id))
    
class FriendsRequest(models.Model):
    now=datetime.datetime.now()

    who_send=models.ForeignKey(Profile, null=True, on_delete=models.CASCADE, related_name='who_send', blank=False)
    who_received=models.ForeignKey(Profile, null=True, on_delete=models.CASCADE, related_name='who_received', blank=False)
    date=models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return str(self.who_send)+' wants '+str(self.who_received)


def upload_location_groupchat_message(instance, filename):
    file_path='images/groups/{groupname}/{filename}'.format(groupname=str(instance.id), filename=filename)
    return str(file_path)

class File(models.Model):
    file=models.FileField(upload_to=upload_location_groupchat_message, validators=[validate_file_extension])
    
    
class Message(models.Model):
    now=datetime.datetime.now()

    image=models.ImageField(upload_to=upload_location_groupchat_message, null=True, blank=True)
    author=models.ForeignKey(Profile, null=True, on_delete=models.CASCADE)
    text=models.TextField(max_length=500, blank=False, null=True)
    date=models.DateTimeField(auto_now_add=True, blank=True)
    belongs_to=models.ForeignKey(GroupChat, null=True, on_delete=models.CASCADE)
    files=models.ManyToManyField(File, null=True, blank=True, related_name='messages')

    def __str__(self):
        return str(str(self.id) + ' ' + self.text+' '+str(self.belongs_to))

