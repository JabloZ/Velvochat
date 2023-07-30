from django.urls import path
from . import views

urlpatterns=[
    path('friendsrequest/<id>', views.FriendRequest.as_view(), name='friendsrequest'),
    path('isrequested/<id>', views.FriendRequest.as_view(), name='friendsrequest'),
    path('addtofriends', views.AddToFriends.as_view(), name='addtofriends'),
    path('allfriendsrequests', views.AllRequests.as_view(), name='allrequests'),
    path('responsetofriendsrequest/<id>', views.ResponseToFriendsRequest.as_view(), name='responserequest'),
    path('didyourequest/<username>', views.DidYouRequest.as_view(), name='didyourequest'),
    path('deleterequest/<id>', views.deleteFriendsRequest.as_view(), name='deletefriendsrequest'),
    path('deletefromfriends/<username>', views.deleteFromFriends.as_view(), name='deletefriendsrequest'),
    path('deleteprofilepicture', views.deleteProfilePicture.as_view(), name='deleteprofilepicture'),
    path('allusergroups', views.ShowUserGroups.as_view(), name='allusergroups'),
    path('chatinfo/<id>', views.ShowChat.as_view(), name='showchat'),
    path('chatmessages/<id>', views.ShowMessages.as_view(), name='showmessages')
    
]