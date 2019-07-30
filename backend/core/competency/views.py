import json
from django.views.generic import ListView
from rest_framework import generics, permissions, status
#from django_weasyprint import WeasyTemplateResponseMixin
#Redis
from django.conf import settings
#Own
from .models import Competency, Subcategory, Organization
from .serializers import CompetencySerializerBasic, CompetencySerializerDepth, SubcategorySerializerDepth, OrganizationSerializerDepth
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
        return CompetencySerializerDepth

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
        return CompetencySerializerDepth

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