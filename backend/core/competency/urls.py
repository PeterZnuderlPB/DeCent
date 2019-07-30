from django.urls import path
from . import views

urlpatterns = [
    path('api/compotencies/', views.CompotencyList.as_view()),
    path('api/compotencies/<pk>', views.CompotencyDetails.as_view())
]