import json
from django.conf import settings
from django.views.generic import ListView
from django.http import QueryDict
from rest_framework import generics, permissions
from rest_framework.response import Response
from django_weasyprint import WeasyTemplateResponseMixin
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

# Create your views here.
class PostList(generics.ListCreateAPIView): 
    #permission_classes = (permissions.IsAuthenticated, HasGroupPermission, HasObjectPermission,)
    required_groups= {
        'GET':['__all__'],
        'POST':['PostViewer'],
        'PUT':['PostViewer'],
        'DELETE':[],
    }
    required_permissions={
        'GET':['post.view_post'],
        'POST':['post.add_post'],
        'PUT':['post.change_post'],
        'DELETE':['post.delete_post']
    }
    DEFAULT_QUERY_SETTINGS={
        'results':10,
        'page':1,
        'sortOrder':[],
        'sortField':[],
        'visibleFields':['id', 'title'],
        'filters':{}
    }

    def get_queryset(self, q_settings):
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
            filters_with_type[key + "__icontains"] = filters[key]
        qs = Post.objects.filter(**filters_with_type).order_by(*clean_orderfield)
        return qs   

    def get_serializer_class(self):
        if self.request.method == 'GET' and self.request.user.has_perm('user.view_user'):
            return PostSerializerDepth
        return PostSerializerBasic

    def list(self, request, *args, **kwargs):
        #cache.set(request.user.id, request.query_params, timeout=CACHE_TTL)
        #--------------------------------------------------------------
        # Getting or setting redis cache and deciding on values to use
        #--------------------------------------------------------------
        key = "USER_" + str(request.user.id) + ":BROWSE:POSTS"
        #cache.delete(key)
        default_val = self.DEFAULT_QUERY_SETTINGS
        received_val = None
        rec_val_str = request.query_params.get('settings', None)
        if(rec_val_str != 'null'):
            received_val = json.loads(rec_val_str)
            #received_val = received_val[0]
        cached_val = None

        if key in cache:
            cached_val = cache.get(key)
            cached_val = json.loads(cached_val)
        else: 
            cache.set(key, default_val, timeout=None)
            cached_val=default_val
        
        try:
            if received_val != None:
                cache.set(key, json.dumps(received_val), timeout=None)
                cached_val=received_val
        except:
            print("Error setting data to cache.")

        final_val = None
        if received_val is not None:
            final_val=received_val
        elif cached_val is not None:
            final_val=cached_val

        #-----------------------------
        # Using final value for query
        #-----------------------------
        queryset_full = self.get_queryset(final_val)
        #fullset = Post.objects.all()
        size = queryset_full.count()

        page = int(final_val.get('page'))
        results = int(final_val.get('results'))
        tfrom = (page-1)*results
        tto = page*results
        if(size < tfrom ):
            tfrom = 0
            tto = results
        queryset = queryset_full[tfrom:tto]

        serializerclass = self.get_serializer_class()

        if(type(final_val) != type({})):
            final_val = json.loads(final_val)
        visibleFields = final_val.get('visibleFields', None)

        serializer = serializerclass(queryset, many=True, fields=visibleFields)
        #ser_field = serializer.get_fields();
        fields = Post._meta.get_fields()
        fieldNames = []
        for field in fields:
            fieldNames.append(field.column)
        response = {
            'table_name': 'Posts Browse',
            'available_columns': fieldNames,
            'data': serializer.data,
            'size': size,
            'settings': final_val
        }
        return Response(response)


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
    queryset = Post.objects.all()
    serializer_class = PostSerializerBasic

class PostBaseDetailPrintView(ListView):
    model=Post
    template_name="post/post_pdf.html"

class PostPdfPrintView(WeasyTemplateResponseMixin, PostBaseDetailPrintView):
    # output of MyModelView rendered as PDF with hardcoded CSS
    pdf_stylesheets = [
        settings.BASE_DIR + '/core/documents/css/pb.css',
    ]
    # show pdf in-line (default: True, show download dialog)
    pdf_attachment = True
    # suggested filename (is required for attachment!)
    pdf_filename = 'post.pdf'