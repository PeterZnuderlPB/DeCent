import json
from django.views.generic import ListView
from rest_framework import generics, permissions, status
#from django_weasyprint import WeasyTemplateResponseMixin
#Redis
from django.conf import settings
#Own
from .models import Post
from .serializers import PostSerializerBasic, PostSerializerDepth
from core.permissions import HasGroupPermission, HasObjectPermission
from core.mail import send_mail
from core.views import PBListViewMixin, PBDetailsViewMixin

# Create your views here.
class PostList(PBListViewMixin, generics.ListCreateAPIView): 
    #permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    model = Post
    table_name = "POSTS" # For search and filter options (Redis key)
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

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return PostSerializerDepth
        return PostSerializerBasic


class PostDetails(PBDetailsViewMixin, generics.RetrieveUpdateDestroyAPIView):
    model = Post
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
    
    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return PostSerializerDepth
        return PostSerializerBasic



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