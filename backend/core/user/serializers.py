from rest_framework import serializers
from .models import CustomUser
from django.forms.models import model_to_dict
from competency.serializers import OrganizationSerializerBasic, OrganizationTypeSerializerBasic, CompetencySerializerBasic
from competency.models import Organization, OrganizationType
from django.contrib.auth import get_user_model
from core.serializers import DynamicFieldsModelSerializer


from django.conf import settings
from post.serializers import PostSerializerDepth

class CustomUserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = '__all__'

    def create(self, validated_data):
        validationData = validated_data

        del validationData['confirm']
        del validationData['agreement']

        password = validated_data['password']
        user_obj = CustomUser(**validationData)
        user_obj.set_password(password)
        user_obj.save()

        return user_obj

    def to_internal_value(self, value):
        return value
    
    def to_representation(self, value):
        valueDict = model_to_dict(value)
        competencyList = []

        for k,v in valueDict.items():
            if 'competency' in k:
                if type(v) == list:
                    for val in v:
                        competencyList.append(model_to_dict(val))

        for v in competencyList:
            try:
                del v['tags']
            except KeyError:
                pass

        del valueDict['groups']
        del valueDict['user_permissions']
        # del valueDict['Permission']

        valueDict['competencys'] = competencyList

        return valueDict

class CustomUserSerializer(serializers.ModelSerializer):
    posts = serializers.PrimaryKeyRelatedField(many=True, queryset=get_user_model().objects.all())
    posts  = PostSerializerDepth(many=True)
    class Meta:
        model = get_user_model()
        fields = '__all__'
        depth = 0

    def create(self, validated_data):
        password = validated_data['password']
        user_obj = CustomUser(**validated_data)
        user_obj.set_password(password)
        user_obj.save()

        return validated_data

class CustomUserSerialierDepth(DynamicFieldsModelSerializer, serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = '__all__'
        depth = 1