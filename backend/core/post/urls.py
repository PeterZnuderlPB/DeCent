from django.urls import path
from . import views

urlpatterns = [
    path('api/posts/', views.PostList.as_view() ),
    path('api/posts/<pk>', views.PostDetails.as_view()),
#    path('api/posts/pdf/', views.PostPdfPrintView.as_view()),
    #path('api/saveData/', views.PostDetails.as_view()),
]