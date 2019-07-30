from rest_framework import permissions
from django.contrib.auth.models import Group

class IsOwner(permissions.BasePermission):
    #obj must have "owner" attribute
    message = 'You must be owner of this object.'
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class IsOwnerOrReadOnly(permissions.BasePermission):
    message = 'You must be owner of this object to edit.'
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        #obj must have "owner" attribute
        return obj.owner == request.user

def is_in_group(user, group_name):
    group = Group.objects.get(name=group_name)
    user_groups = user.groups.values_list('name', flat=True)
    try:
        return Group.objects.get(name=group_name).user_set.filter(id=user.id).exists()
    except Group.DoesNotExist:
        return False

class HasGroupPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        required_groups_mapping = getattr(view, "required_groups", {})
        required_groups = required_groups_mapping.get(request.method, [])
        # Return True if the user has all the required groups or is staff.
        return all([is_in_group(request.user, group_name) if group_name != "__all__" else True for group_name in required_groups]) or (request.user and request.user.is_staff)

class HasObjectPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        required_permissions_mapping = getattr(view, "required_permissions", {})
        required_permissions = required_permissions_mapping.get(request.method, [])
        return all([request.user.has_perm(required_permission) or required_permission == '__all__' for required_permission in required_permissions])