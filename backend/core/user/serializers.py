from rest_framework import serializers
from .models import CustomUser
from django.forms.models import model_to_dict
from competency.serializers import OrganizationSerializerBasic, OrganizationTypeSerializerBasic
from competency.models import Organization, OrganizationType
from django.contrib.auth import get_user_model


from django.conf import settings
from post.serializers import PostSerializerDepth

class CustomUserSimpleSerializer(serializers.ModelSerializer):
    organization_type = serializers.Field()
    organization_name = serializers.Field()

    class Meta:
        model = get_user_model()
        fields = '__all__'

    def create(self, validated_data):
        validationData = validated_data

        orgType = validationData['organization_type']
        orgName = validationData['organization_name']

        del validationData['confirm']
        del validationData['agreement']
        del validationData['organization_name']
        del validationData['organization_type']

        password = validated_data['password']
        user_obj = CustomUser(**validationData)
        user_obj.set_password(password)
        user_obj.save()

        organizationType = OrganizationType.objects.get(id=orgType)
        organization = Organization(name=orgName, organization_type=organizationType, account=user_obj, is_active=True, is_locked=False, user_last_modified=user_obj, user_created=user_obj)
        organization.save()

        return user_obj

    def to_internal_value(self, value):
        return value
    
    def to_representation(self, value):
        return model_to_dict(value)

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
