from rest_framework import serializers
from .models import File

class FileSerializerBasic(serializers.ModelSerializer):
    class Meta:
        model = File 
        fields = '__all__' 
        depth = 0 


class FileSerializerDepth(serializers.ModelSerializer):
    class Meta:
        model = File 
        fields = '__all__'
        depth = 1