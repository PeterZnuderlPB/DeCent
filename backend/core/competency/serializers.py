from rest_framework import serializers
from .models import Competency, Subcategory, Organization

from core.serializers import DynamicFieldsModelSerializer

class CompetencySerializerBasic(DynamicFieldsModelSerializer ,serializers.ModelSerializer):

    class Meta:
        model = Competency #  Model to serialize
        fields = '__all__' #    A tuple with names of fields to serialize
        depth = 0 # How deep we want to serialize fk connections

class CompetencySerializerDepth(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = Competency
        fields = '__all__'
        depth = 1

class SubcategorySerializerBasic(DynamicFieldsModelSerializer ,serializers.ModelSerializer):

    class Meta:
        model = Subcategory #  Model to serialize
        fields = '__all__' #    A tuple with names of fields to serialize
        depth = 0 # How deep we want to serialize fk connections

class SubcategorySerializerDepth(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = '__all__'
        depth = 1

class OrganizationSerializerBasic(DynamicFieldsModelSerializer ,serializers.ModelSerializer):

    class Meta:
        model = Organization #  Model to serialize
        fields = '__all__' #    A tuple with names of fields to serialize
        depth = 0 # How deep we want to serialize fk connections

class OrganizationSerializerDepth(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'
        depth = 1

