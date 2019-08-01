from rest_framework import serializers
from .models import Competency, Subcategory, Organization, OrganizationType

from core.serializers import DynamicFieldsModelSerializer

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

class CompetencySerializerBasic(DynamicFieldsModelSerializer ,serializers.ModelSerializer):

    class Meta:
        model = Competency #  Model to serialize
        fields = '__all__' #    A tuple with names of fields to serialize
        depth = 0 # How deep we want to serialize fk connections

class CompetencySerializerDepth(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    organization_id = OrganizationSerializerDepth
    subcategory_id = SubcategorySerializerDepth

    class Meta:
        model = Competency
        fields = '__all__'
        depth = 1

class OrganizationTypeSerializerBasic(DynamicFieldsModelSerializer ,serializers.ModelSerializer):

    class Meta:
        model = OrganizationType #  Model to serialize
        fields = '__all__' #    A tuple with names of fields to serialize
        depth = 0 # How deep we want to serialize fk connections

class OrganizationTypeSerializerDepth(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = OrganizationType
        fields = '__all__'
        depth = 1