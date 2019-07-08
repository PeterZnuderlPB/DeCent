from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import get_user_model


from django.conf import settings
from post.serializers import PostSerializerDepth

class CustomUserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = '__all__'

    def create(self, validated_data):
        password = validated_data['password']
        user_obj = CustomUser(**validated_data)
        user_obj.set_password(password)
        user_obj.save()

        return user_obj

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
