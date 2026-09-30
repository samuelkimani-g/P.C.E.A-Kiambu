from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    """
    Only admins can create/update/delete events.
    All authenticated users can read and mark attendance.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Anyone can view
        if request.method in SAFE_METHODS:
            return True
        
        # Only admins can create/update/delete events
        return request.user.role == 'admin' or request.user.is_superuser

