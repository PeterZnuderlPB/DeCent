from django.conf import settings
from django.shortcuts import render
from django.views.generic import ListView
from rest_framework import generics, permissions
from rest_framework import views, status
from rest_framework.parsers import FileUploadParser
from rest_framework.response import Response
from core.views import PBDetailsViewMixin
#from django_weasyprint import WeasyTemplateResponseMixin

from .models import File
from .serializers import FileSerializerBasic, FileSerializerWithFile

class FileList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    parser_class = (FileUploadParser,)

    def post(self, request, *args, **kwargs):
        file_serializer = FileSerializerWithFile(data = request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return File.objects.all()

    def get_serializer_class(self):
        return FileSerializerBasic

class FileDetails(generics.RetrieveAPIView):
    serializer_class = FileSerializerBasic
    permission_classes = (permissions.IsAuthenticated,)
    parser_class = (FileUploadParser,)

    def get_queryset(self):
        return File.objects.all()
    

    def post(self, request, *args, **kwargs):
        file_serializer = FileSerializerWithFile(data = request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        file = File.objects.get(pk = kwargs['pk'])
        file_serializer = FileSerializerBasic(file)
        file.delete()
        return Response(file_serializer.data, status = status.HTTP_202_ACCEPTED)

class FileBaseDetailPrintView(ListView):
    model=File
    template_name="file/file_pdf.html"

#class FilePdfPrintView(WeasyTemplateResponseMixin, FileBaseDetailPrintView):
#    # output of MyModelView rendered as PDF with hardcoded CSS
#    pdf_stylesheets = [
#        settings.BASE_DIR + '\\core\\documents\\css\\pb.css',
#    ]
#    # show pdf in-line (default: True, show download dialog)
#    pdf_attachment = True
#    # suggested filename (is required for attachment!)
#    pdf_filename = 'file.pdf'