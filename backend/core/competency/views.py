import json
from django.views.generic import ListView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models.query import QuerySet
from django.db.models import Q
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
    UserPermission,
    Comment,
    Project,
    WorkOrder
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
    UserPermissionSerializerDepth,
    CommentSerializerBasic,
    CommentSerializerDepth,
    ProjectSerializerBasic,
    ProjectSerializerDepth,
    WorkOrderSerializerBasic,
    WorkOrderSerializerDepth
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

    def get_queryset(self, q_settings):   
        user_permissions = None
        user_permissions_subjects = None
        subject_list = []
        try:
            user_permissions = UserPermission.objects.get(account__id=self.request.user.id, organization__id=self.request.user.active_organization_id)
            user_permissions_subjects = user_permissions.subject.all()
            for s in user_permissions_subjects:
                subject_list.append(s.id)

        except:
            user_permissions = None

        allowedSubjects = None
        if not user_permissions == None:
            allowedSubjects = Subject.objects.filter(Q(id__in=subject_list) | Q(subject__id__in=subject_list))
        else:
            allowedSubjects = Subject.objects.filter(organization__id=self.request.user.active_organization_id)
        # subject_list = Subject.objects.filter()

        if (type(q_settings) == type('')):
            q_settings = json.loads(q_settings)
        dictkeys = q_settings.keys()
        order= list(q_settings.get('sortOrder'))
        orderfield = list(q_settings.get('sortField'))
        for i in range(len(order)):
            if(order[i]=="descend"):
                orderfield[i] = "-" + orderfield[i]
            elif(order[i] == None):
                orderfield[i]= None

        nullOrder = [i for i in range(len(order)) if order[i]== None]
        clean_orderfield = [orderfield[i] for i in range(len(orderfield)) if orderfield[i] is not None]


        filters = q_settings.get('filters', None)
        filters_with_type = {}
        for key, val in filters.items():
            if type(val) == list:
                filters_with_type[key + "__in"] = val
            else:
                filters_with_type[key + "__icontains"] = val
        filters_with_type["is_active"] = True
        qs = allowedSubjects.filter(**filters_with_type).order_by(*clean_orderfield)
        return qs

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

class UserPermissionDetails(PBDetailsViewMixin, generics.RetrieveUpdateDestroyAPIView):
    model = UserPermission

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

class CommnetList(PBListViewMixin, generics.ListCreateAPIView): 
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = Comment
    table_name = "Commnets" # For search and filter options (Redis key)
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
            return CommentSerializerDepth
        return CommentSerializerBasic

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        addedComment = Comment.objects.last()
        depthSerializer = CommentSerializerDepth(addedComment)

        return Response(depthSerializer.data, status=status.HTTP_201_CREATED, headers=headers)

class CommentDetails(PBDetailsViewMixin, generics.RetrieveUpdateDestroyAPIView):
    model = Comment

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
            return CommentSerializerDepth
        return CommentSerializerBasic

class ProjectList(PBListViewMixin, generics.ListCreateAPIView): 
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = Project
    table_name = "Projects" # For search and filter options (Redis key)
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
            return ProjectSerializerDepth
        return ProjectSerializerBasic

class ProjectDetails(PBDetailsViewMixin, generics.RetrieveUpdateDestroyAPIView):
    model = Project

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
            return ProjectSerializerDepth
        return ProjectSerializerBasic

class WorkOrderList(PBListViewMixin, generics.ListCreateAPIView): 
    permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = WorkOrder
    table_name = "WorkOrders" # For search and filter options (Redis key)
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
            return WorkOrderSerializerDepth
        return WorkOrderSerializerBasic

class WorkOrderDetails(PBDetailsViewMixin, generics.RetrieveUpdateDestroyAPIView):
    model = WorkOrder

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
            return WorkOrderSerializerDepth
        return WorkOrderSerializerBasic