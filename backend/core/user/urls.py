from django.urls import path
from . import views

urlpatterns = [
    path('api/users/', views.CustomUserList.as_view() ),
    path('api/users/<pk>/', views.CustomUserDetails.as_view()),
    path('api/allusers/', views.FullUserList.as_view()),
    path('api/pbusers/', views.FullPBUserList.as_view())
]