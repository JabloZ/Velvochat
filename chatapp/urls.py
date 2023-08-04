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
    path('chatmessages/<id>', views.ShowMessages.as_view(), name='showmessages'),
    path('sendmessage/<id>', views.SendMessage.as_view(), name='sendmessages'),
    path('privatechatexists/<username>', views.PrivateChatExists.as_view(), name='privatechatexists'),
    path('createprivatechat/<username>', views.CreatePrivateChat.as_view(), name='createprivatechat'),
    path('showuserfriends/<username>', views.ShowUserFriends.as_view(), name='showuserfriends'),
    path('creategroup', views.CreateGroup.as_view(), name='creategroup'),
    path('leavegroup/<id>', views.LeaveGroup.as_view(), name='leavegroup'),
    path('deletefromgroup', views.DeleteFromGroup.as_view(), name='deletefromgroup'),
    path('editgroup/<id>', views.EditGroup.as_view(), name='editgroup'),
    path('deletegrouppicture/<id>', views.DeleteGroupPicture.as_view(), name='deletegrouppicture'),
    path('addtogroup/<id>', views.AddToGroup.as_view(),name='addtogroup')
]