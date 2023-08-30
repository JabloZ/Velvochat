"""velvochat URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import settings
from . import views
from accounts.views import ProfileView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('accounts/', include("accounts.urls")),
    path('chatapp/', include("chatapp.urls")),
    path('',views.index, name='index'),
    path('login',views.index, name='index'),
    path('register',views.index, name='index'),
    path('settings',views.index, name='index'),
    path('profile/<str:username>/', views.index, name='index'),
    path('requests', views.index, name='index'),
    path('editprofile', views.index, name='index'),
    path('allchats', views.index, name='index'),
    path('chat/<id>', views.index, name='index'),
    path('allfriends/<str:username>', views.index, name='index'),
    path('creategroup', views.index, name='index'),
    path('editgroup/<id>', views.index, name='index'),
    path('searchresult/<str:search>', views.index, name='index'),
]
urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
