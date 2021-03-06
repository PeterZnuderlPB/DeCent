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
    path('api/subject/', views.SubjectList.as_view()),
    path('api/subject/<pk>', views.SubjectDetails.as_view()),
    path('api/subject_type/', views.SubjectTypeList.as_view()),
    path('api/subject_type/<pk>', views.SubjectDetails.as_view()),
    path('api/tag/', views.TagList.as_view()),
    path('api/compquestion/', views.CompQuestionList.as_view()),
    path('api/predefinedanswer/', views.PredefinedAnswerList.as_view()),
    path('api/answer/', views.AnswerList.as_view()),
    path('api/answer/<pk>', views.AnswerDetails.as_view()),
    path('api/comprating/', views.CompRatingList.as_view()),
    path('api/userpermission/', views.UserPermissionsList.as_view()),
    path('api/userpermission/<pk>', views.UserPermissionDetails.as_view()),
    path('api/comment/', views.CommnetList.as_view()),
    path('api/comment/<pk>', views.CommentDetails.as_view()),
    path('api/project/', views.ProjectList.as_view()),
    path('api/project/<pk>', views.ProjectDetails.as_view()),
    path('api/workorder/', views.WorkOrderList.as_view()),
    path('api/workorder/<pk>', views.WorkOrderDetails.as_view()),
    path('api/cooperative/', views.CooperativeList.as_view()),
    path('api/cooperative/<pk>', views.CooperativeDetails.as_view()),
    path('api/cooperativeenrollment/', views.CooperativeEnrollmentList.as_view()),
    path('api/cooperativeenrollment/<pk>', views.CooperativeEnrollmentDetails.as_view())
]