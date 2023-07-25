from django.urls import path
from . import views

urlpatterns=[
    path('friendsrequest/<id>', views.FriendRequest.as_view(), name='friendsrequest'),
    path('isrequested/<id>', views.FriendRequest.as_view(), name='friendsrequest'),
    path('addtofriends', views.AddToFriends.as_view(), name='addtofriends'),
    path('allfriendsrequests', views.AllRequests.as_view(), name='allrequests'),
]