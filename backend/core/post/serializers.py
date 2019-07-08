from rest_framework import serializers
from .models import Post

from core.serializers import DynamicFieldsModelSerializer

class PostSerializerBasic(DynamicFieldsModelSerializer ,serializers.ModelSerializer):

    class Meta:
        model = Post #  Model to serialize
        fields = '__all__' #    A tuple with names of fields to serialize
        depth = 0 # How deep we want to serialize fk connections

class PostSerializerDepth(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        depth = 1
