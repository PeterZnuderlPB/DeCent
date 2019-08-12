#from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from rest_framework import generics, permissions, status
from rest_framework_jwt.settings import api_settings
from rest_framework.response import Response

from .models import CustomUser
from core.views import PBListViewMixin, PBDetailsViewMixin
from .serializers import CustomUserSerializer, CustomUserSimpleSerializer
from core.permissions import HasGroupPermission, HasObjectPermission
from core.oauth import get_user_from_token


class CustomUserList( generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSimpleSerializer

    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        encode_handler = api_settings.JWT_ENCODE_HANDLER

        user_serializer = CustomUserSimpleSerializer(data=request.data)

        if user_serializer.is_valid():
            user = user_serializer.save()
            return Response({'user': user_serializer.data}, status=status.HTTP_201_CREATED)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    #def get(self, request, *args, **kwargs):
    #    #user_serializer = CustomUserSerializer(data=request.user)
    #    #if user_serializer.is_valid():
    #    user = request.user
    #    print(user)
    #    if not request.user.is_authenticated:
    #        return Response(None, status=status.HTTP_401_UNAUTHORIZED)
    #    
    #    serializer = CustomUserSimpleSerializer(request.user)
    #    return Response({'user': serializer.data, 'token':request.auth}, status=status.HTTP_200_OK)
        
    def get(self, request, *args, **kwargs):
        permission_classes = (permissions.IsAuthenticated,)
        user = request.user
        if not request.user.is_authenticated:
            return Response(None, status=status.HTTP_401_UNAUTHORIZED)
        serializer = CustomUserSimpleSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

class CustomUserDetails(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    permission_classes = (permissions.IsAuthenticated,)

    