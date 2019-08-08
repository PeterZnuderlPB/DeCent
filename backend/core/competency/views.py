import json
from django.views.generic import ListView
from rest_framework import generics, permissions, status
#from django_weasyprint import WeasyTemplateResponseMixin
#Redis
from django.conf import settings
#Own
from .models import (
    Competency, 
    Subcategory, 
    Organization,
    OrganizationType, 
    Evaluation, 
    EvaluationType, 
    Subject,
    SubjectType,
    Tag, 
    CompQuestion,
    PredefinedAnswer,
    Answer,
    CompRating,
    UserPermission
)
from .serializers import (
    CompetencySerializerBasic,
    CompetencySerializerDepth,
    SubcategorySerializerBasic,
    SubcategorySerializerDepth,
    OrganizationSerializerBasic,
    OrganizationSerializerDepth,
    OrganizationTypeSerializerBasic,
    OrganizationTypeSerializerDepth,
    EvaluationSerializerBasic,
    EvaluationSerializerDepth,
    EvaluationTypeSerializerBasic,
    EvaluationTypeSerializerDepth,
    SubjectSerializerBasic,
    SubjectSerializerDepth,
    TagSerializerBasic,
    TagSerializerDepth,
    CompQuestionSerializerBasic,
    CompQuestionSerializerDepth,
    PredefinedAnswerSerializerBasic,
    PredefinedAnswerSerializerDepth,
    AnswerSerializerBasic,
    AnswerSerializerDepth,
    CompRatingSerializerBasic,
    CompRatingSerializerDepth,
    SubjectTypeSerializerBasic,
    SubjectTypeSerializerDepth,
    UserPermissionSerializerBasic,
    UserPermissionSerializerDepth
)
from core.permissions import HasGroupPermission, HasObjectPermission
from core.views import PBListViewMixin, PBDetailsViewMixin

# Create your views here.
class CompotencyList(PBListViewMixin, generics.ListCreateAPIView): 
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = Competency
    table_name = "Compotencys" # For search and filter options (Redis key)
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return CompetencySerializerDepth
        return CompetencySerializerBasic

class CompotencyDetails(PBDetailsViewMixin, generics.RetrieveUpdateDestroyAPIView):
    model = Competency

    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    
    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return CompetencySerializerDepth
        return CompetencySerializerBasic

class SubcategoryList(PBListViewMixin, generics.ListCreateAPIView): 
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = Subcategory
    table_name = "Subcategorys" # For search and filter options (Redis key)
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return SubcategorySerializerDepth
        return SubcategorySerializerDepth

class OrganizationList(PBListViewMixin, generics.ListCreateAPIView): 
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = Organization
    table_name = "Organizations" # For search and filter options (Redis key)
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return OrganizationSerializerDepth
        return OrganizationSerializerDepth

class OrganizationTypeList(PBListViewMixin, generics.ListAPIView):
    permission_classes = ()
    model = OrganizationType
    table_name = "Organizationtypes" # For search and filter options (Redis key)
    required_groups = {}
    required_permissions= {}

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return OrganizationTypeSerializerDepth
        return OrganizationTypeSerializerDepth

class EvaluationList(PBListViewMixin, generics.ListCreateAPIView): 
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = Evaluation
    table_name = "Evaluations" # For search and filter options (Redis key)
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return EvaluationSerializerDepth
        return EvaluationSerializerBasic

class EvaluationDetails(PBDetailsViewMixin, generics.RetrieveUpdateDestroyAPIView):
    model = Evaluation
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    
    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return EvaluationSerializerDepth
        return EvaluationSerializerBasic

class EvaluationTypeList(PBListViewMixin, generics.ListCreateAPIView): 
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = EvaluationType
    table_name = "Evaluationtypes" # For search and filter options (Redis key)
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return EvaluationTypeSerializerDepth
        return EvaluationTypeSerializerDepth

class SubjectList(PBListViewMixin, generics.ListCreateAPIView): 
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = Subject
    table_name = "Subjects" # For search and filter options (Redis key)
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return SubjectSerializerDepth
        return SubjectSerializerBasic

class SubjectDetails(PBDetailsViewMixin, generics.RetrieveUpdateDestroyAPIView):
    model = Subject
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    
    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return SubjectSerializerDepth
        return SubjectSerializerBasic

class TagList(PBListViewMixin, generics.ListCreateAPIView): 
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = Tag
    table_name = "Tags" # For search and filter options (Redis key)
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return TagSerializerDepth
        return TagSerializerDepth

class CompQuestionList(PBListViewMixin, generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = CompQuestion
    table_name = "CompQuestions" # For search and filter options (Redis key)
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return CompQuestionSerializerDepth
        return CompQuestionSerializerDepth

class PredefinedAnswerList(PBListViewMixin, generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = PredefinedAnswer
    table_name = "PredefinedAnswers" # For search and filter options (Redis key)
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return PredefinedAnswerSerializerDepth
        return PredefinedAnswerSerializerDepth

class AnswerList(PBListViewMixin, generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = Answer
    table_name = "Answers" # For search and filter options (Redis key)
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return AnswerSerializerDepth
        return AnswerSerializerDepth

class AnswerDetails(PBDetailsViewMixin, generics.RetrieveUpdateDestroyAPIView):
    model = Answer
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    
    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return AnswerSerializerDepth
        return AnswerSerializerDepth

class CompRatingList(PBListViewMixin, generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = CompRating
    table_name = "Compratings" # For search and filter options (Redis key)
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return CompRatingSerializerDepth
        return CompRatingSerializerDepth

class SubjectTypeList(PBListViewMixin, generics.ListCreateAPIView): 
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = SubjectType
    table_name = "Subjecttypes" # For search and filter options (Redis key)
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return SubjectTypeSerializerDepth
        return SubjectTypeSerializerBasic

class SubjectTypeDetails(PBDetailsViewMixin, generics.RetrieveUpdateDestroyAPIView):
    model = SubjectType

    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    
    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return SubjectTypeSerializerDepth
        return SubjectTypeSerializerBasic

class UserPermissionsList(PBListViewMixin, generics.ListCreateAPIView): 
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = UserPermission
    table_name = "Userpermissions" # For search and filter options (Redis key)
    required_groups= {
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }
    required_permissions={
        'GET':['__all__'],
        'POST':['__all__'],
        'PUT':['__all__'],
    }

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return UserPermissionSerializerDepth
        return UserPermissionSerializerBasic