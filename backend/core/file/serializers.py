from rest_framework import serializers
from .models import File

class FileSerializerBasic(serializers.ModelSerializer):
    class Meta:
        model = File 
        fields = ('owner','name','upload_date',) 
        depth = 0 


class FileSerializerWithFile(serializers.ModelSerializer):
    class Meta:
        model = File 
        fields = '__all__'