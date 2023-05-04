from django.db import models
import datetime
from accounts.models import Account
from django.db.models.signals import post_save

class Profile(models.Model):
    user = models.OneToOneField(Account, null=True, on_delete=models.CASCADE)
    bio=models.TextField(max_length=300, blank=True, null=True)
    def __str__(self):
        return str(self.user.username)
    
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

post_save.connect(create_user_profile, sender=Account)




class GroupChat(models.Model):
    now=datetime.datetime.now()

    name=models.TextField(max_length=60, unique=False)
    members=models.ManyToManyField(Profile, related_name='profiles', blank=True)
    date = models.DateTimeField(auto_now_add=True, blank=True)

    def __str__(self):
        return str(self.name)
    
class Message(models.Model):
    now=datetime.datetime.now()

    author=models.ForeignKey(Profile, null=True, on_delete=models.CASCADE)
    text=models.TextField(max_length=500, blank=False, null=True)
    date=models.DateTimeField(auto_now_add=True, blank=True)
    belongs_to=models.ForeignKey(GroupChat, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.text)

