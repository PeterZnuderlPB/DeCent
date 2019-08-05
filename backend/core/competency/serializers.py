from rest_framework import serializers
from .models import (
    Competency, 
    Subcategory, 
    Organization, 
    OrganizationType, 
    Evaluation, 
    EvaluationType, 
    Subject, 
    Tag, 
    CompQuestion, 
    PredefinedAnswer 
)

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

class EvaluationSerializerBasic(DynamicFieldsModelSerializer ,serializers.ModelSerializer):

    class Meta:
        model = Evaluation #  Model to serialize
        fields = '__all__' #    A tuple with names of fields to serialize
        depth = 0 # How deep we want to serialize fk connections

class EvaluationSerializerDepth(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'
        depth = 2

class EvaluationTypeSerializerBasic(DynamicFieldsModelSerializer ,serializers.ModelSerializer):

    class Meta:
        model = EvaluationType #  Model to serialize
        fields = '__all__' #    A tuple with names of fields to serialize
        depth = 0 # How deep we want to serialize fk connections

class EvaluationTypeSerializerDepth(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = EvaluationType
        fields = '__all__'
        depth = 1

class SubjectSerializerBasic(DynamicFieldsModelSerializer ,serializers.ModelSerializer):

    class Meta:
        model = Subject #  Model to serialize
        fields = '__all__' #    A tuple with names of fields to serialize
        depth = 0 # How deep we want to serialize fk connections

class SubjectSerializerDepth(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
        depth = 1

class TagSerializerBasic(DynamicFieldsModelSerializer ,serializers.ModelSerializer):

    class Meta:
        model = Tag #  Model to serialize
        fields = '__all__' #    A tuple with names of fields to serialize
        depth = 0 # How deep we want to serialize fk connections

class TagSerializerDepth(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        depth = 1

class CompQuestionSerializerBasic(DynamicFieldsModelSerializer ,serializers.ModelSerializer):

    class Meta:
        model = CompQuestion #  Model to serialize
        fields = '__all__' #    A tuple with names of fields to serialize
        depth = 0 # How deep we want to serialize fk connections

class CompQuestionSerializerDepth(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = CompQuestion
        fields = '__all__'
        depth = 1

class PredefinedAnswerSerializerBasic(DynamicFieldsModelSerializer ,serializers.ModelSerializer):

    class Meta:
        model = PredefinedAnswer #  Model to serialize
        fields = '__all__' #    A tuple with names of fields to serialize
        depth = 0 # How deep we want to serialize fk connections

class PredefinedAnswerSerializerDepth(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = PredefinedAnswer
        fields = '__all__'
        depth = 1