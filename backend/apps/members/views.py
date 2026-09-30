from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from .models import Member
from .serializers import MemberSerializer
from .permissions import IsAdminOrOwner


class MemberViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Member CRUD operations.
    
    Permissions:
    - List/Retrieve - Authenticated users only
    - Create/Update/Delete - Admin only
    - Members can only view/edit their own profile
    
    Provides:
    - GET /api/members/ - List all members (admin only, authenticated users see all)
    - GET /api/members/{id}/ - Retrieve a specific member (owner or admin)
    - GET /api/members/me/ - Get current user's member profile
    - POST /api/members/ - Create a new member (admin only)
    - PUT /api/members/{id}/ - Update a member (admin or owner)
    - PATCH /api/members/{id}/ - Partial update a member (admin or owner)
    - DELETE /api/members/{id}/ - Delete a member (admin only)
    """
    queryset = Member.objects.select_related('user').all()
    serializer_class = MemberSerializer
    permission_classes = [IsAdminOrOwner]
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ['full_name', 'district', 'phone', 'email']
    filterset_fields = ['membership_status', 'district']
    ordering_fields = ['full_name', 'joined_on']
    ordering = ['full_name']
    
    def get_queryset(self):
        """
        Admins see all members.
        Regular users see only their own profile.
        """
        if self.request.user.role == 'admin' or self.request.user.is_superuser:
            return self.queryset
        return self.queryset.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """
        Get the current authenticated user's member profile.
        """
        try:
            member = Member.objects.get(user=request.user)
            serializer = self.get_serializer(member)
            return Response(serializer.data)
        except Member.DoesNotExist:
            return Response(
                {"message": "No member profile found for this user"},
                status=404
            )
