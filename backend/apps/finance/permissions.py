from rest_framework.permissions import BasePermission


class IsAdminOrReadOwn(BasePermission):
    """
    Admin can view/create/update all financial records.
    Members can only view their own tithes.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Admins have full access
        if request.user.role == 'admin' or request.user.is_superuser:
            return True
        
        # Members can only GET (view)
        return request.method == 'GET'
    
    def has_object_permission(self, request, view, obj):
        # Admins can access everything
        if request.user.role == 'admin' or request.user.is_superuser:
            return True
        
        # For tithes, members can only view their own
        if hasattr(obj, 'member'):
            return hasattr(request.user, 'member_profile') and obj.member == request.user.member_profile
        
        # For offerings, authenticated users can view but not modify
        return request.method == 'GET'

