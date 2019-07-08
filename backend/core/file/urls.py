from django.urls import path
from . import views

urlpatterns = [
    path('api/files/', views.FileList.as_view() ),
    path('api/files/<pk>', views.FileDetails.as_view()),
    path('api/files/pdf/', views.FilePdfPrintView.as_view()),
]