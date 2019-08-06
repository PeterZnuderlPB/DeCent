from rest_framework import serializers
from django.forms.models import model_to_dict
from user.models import CustomUser
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
    PredefinedAnswer ,
    Answer
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

    def create(self, validated_data):

        user = CustomUser.objects.get(id=validated_data['user_created'])
        evaluationType_obj = EvaluationType.objects.get(id=validated_data['evaluation_type'])
        subject_obj = Subject.objects.get(id=validated_data['subject'])
        # organization_obj = Organization.objects.get(id=validated_data['organization'])

        dateCreated = validated_data['date_created']
        dateLastModified = validated_data['date_last_modified']
        isActive = validated_data['is_active']
        isLocked = validated_data['is_locked']
        commentTemp = validated_data['comment']
        evaluationDate = validated_data['evaluation_date']

        question_list = validated_data['questions']

        evaluation_obj = Evaluation(date_created=dateCreated, date_last_modified=dateLastModified, user_created=user, user_last_modified=user, is_active=isActive, is_locked=isLocked, comment=commentTemp, evaluation_date=evaluationDate, evaluation_type=evaluationType_obj, subject=subject_obj)
        evaluation_obj.save()

        for k,v in question_list.items():
            if 'tbox' in k:
                continue

            comp_question_obj = CompQuestion.objects.get(id=k)
            predefined_answer_obj = PredefinedAnswer.objects.get(id=v)
            answer_obj = Answer(user_created=user, user_last_modified=user, is_locked=False, is_active=True, comment=question_list[f'tbox{k}'], predefined_answer=predefined_answer_obj, comp_question=comp_question_obj, evaluation=evaluation_obj)
            answer_obj.save()

        return evaluation_obj

    def to_internal_value(self, value):
        return value
    
    def to_representation(self, value):
        return model_to_dict(value)

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