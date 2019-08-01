from django.urls import path
from . import views

urlpatterns = [
    path('api/competency/', views.CompotencyList.as_view()),
    path('api/competency/<pk>', views.CompotencyDetails.as_view()),
    path('api/subcategory/', views.SubcategoryList.as_view()),
    path('api/organization/', views.OrganizationList.as_view()),
    path('api/organizationtype/', views.OrganizationTypeList.as_view()),
    path('api/evaluation/', views.EvaluationList.as_view()),
    path('api/evaluation/<pk>', views.EvaluationDetails.as_view()),
    path('api/evaluation_type/', views.EvaluationTypeList.as_view()),
    path('api/subject/', views.SubjectList.as_view())
]