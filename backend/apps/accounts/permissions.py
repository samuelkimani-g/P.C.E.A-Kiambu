from rest_framework.permissions import BasePermission

class IsAdminOrReadOnly(BasePermission):
    """
    Allow read-only access to all, but restrict write actions to admin users.
    """
    def has_permission(self, request, view):
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True
        return bool(request.user and request.user.is_authenticated and (request.user.role == "admin" or request.user.is_superuser))
