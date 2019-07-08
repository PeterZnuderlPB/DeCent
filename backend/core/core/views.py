from rest_framework import generics, permissions
from django.contrib.auth.models import Group

from .serializers import GroupSerializer
from .permissions import HasGroupPermission
from rest_framework.response import Response

from django.shortcuts import render


class GroupList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    required_scopes = ['groups']
    permission_groups={
        'GET': ['__all__'],
    }
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def get(*args, **kwargs):
        groups = Group.objects.all()
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)

    

def home(request):
	return render(request, 'home.html')