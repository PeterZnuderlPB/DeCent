"""core URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
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
from django.contrib.auth import views # For views, not REST
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from rest_framework_jwt.views import obtain_jwt_token

#Import API views
from .views import GroupList, home
from .mail import SendMail

urlpatterns = [
    path('admin/', admin.site.urls),
    #path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')), #    for OAuth2 authentication
    #re_path(r'^api-token-auth/', obtain_jwt_token),
    #re_path(r'^auth/', include('social_django.urls', namespace='social')),  # <- for Social Auth
    #re_path(r'^login/$', views.LoginView.as_view(), name='login'), 
    #re_path(r'^logout/$', views.LogoutView.as_view(), name='logout'), 
    url(r'^admin/', admin.site.urls),
    url(r'^auth/', include('rest_framework_social_oauth2.urls')),
    re_path(r'^$', home, name='home'), # change
    path('', include('user.urls')),# look for paths in the user/urls.py file
    path('groups/', GroupList.as_view()),
    path('', include('post.urls')),
    path('', include('file.urls')),
    path('api/mail/', SendMail.as_view())
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)