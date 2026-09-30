from rest_framework.permissions import BasePermission


class IsAdminOrOwner(BasePermission):
    """
    Only allow admins to create/update/delete members.
    Members can only view their own profile.
    """
    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user.is_authenticated
        # POST/PUT/PATCH/DELETE require admin
        return request.user.is_authenticated and (request.user.role == 'admin' or request.user.is_superuser)
    
    def has_object_permission(self, request, view, obj):
        # Admins can do anything
        if request.user.role == 'admin' or request.user.is_superuser:
            return True
        # Members can only view/edit their own profile
        return obj.user == request.user

