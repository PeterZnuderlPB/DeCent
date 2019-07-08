from user.serializers import CustomUserSimpleSerializer

def jwt_response_payload_handler(token, user=None, request=None):
    user_serialized = CustomUserSimpleSerializer(user)

    return{
        'token': token,
        'user': user_serialized.data
    }