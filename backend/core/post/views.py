import json
from django.conf import settings
from django.views.generic import ListView
from django.http import QueryDict
from rest_framework import generics, permissions, status
from rest_framework.response import Response
#from django_weasyprint import WeasyTemplateResponseMixin
#Redis
from django.core.cache import cache
from django.conf import settings
from django.core.cache.backends.base import DEFAULT_TIMEOUT
CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)
#Own
from .models import Post
from .serializers import PostSerializerBasic, PostSerializerDepth
from core.permissions import HasGroupPermission, HasObjectPermission
from core.mail import send_mail
from core.views import PBListViewMixin

# Create your views here.
class PostList(PBListViewMixin, generics.ListCreateAPIView): 
    #permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = Post
    table_name = "POSTS" # For search and filter options (Redis key)

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return PostSerializerDepth
        return PostSerializerBasic


class PostDetails(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    required_groups= {
        'GET':['__all__'],
        'POST':['PostViewer'],
        'PUT':['PostViewer'],
    }
    required_permissions={
        'GET':['post.view_post'],
        'POST':['post.add_post'],
        'PUT':['post.change_post'],
    }
    model = Post
    queryset = Post.objects.all()
    serializer_class = PostSerializerBasic

    
    def get(self, request, pk):
        instance = self.model.objects.filter(id = pk).values_list()
        att_types = [field.description for field in self.model._meta.get_fields()]
        att_names = [field.name for field in self.model._meta.get_fields()]
        fileds = self.model._meta.get_fields()
        
        print("**************************")
        print(instance[0])
        return Response({'data': instance[0], 'column_names': att_names, 'column_types':att_types}, status=status.HTTP_200_OK)

    # Prevent editing locked posts - Aljaz
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        if instance.is_locked:
            return Response("Locked posts cannot be edited.", status=403)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class PostBaseDetailPrintView(ListView):
    model=Post
    template_name="post/post_pdf.html"
"""
class PostPdfPrintView(WeasyTemplateResponseMixin, PostBaseDetailPrintView):
    # output of MyModelView rendered as PDF with hardcoded CSS
    pdf_stylesheets = [
        settings.BASE_DIR + '/core/documents/css/pb.css',
    ]
    # show pdf in-line (default: True, show download dialog)
    pdf_attachment = True
    # suggested filename (is required for attachment!)
    pdf_filename = 'post.pdf'
    """