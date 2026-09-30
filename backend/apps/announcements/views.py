from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Announcement
from .serializers import AnnouncementSerializer
from .permissions import IsAuthenticatedOrReadOnly


class AnnouncementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Announcement CRUD operations.
    
    Permissions:
    - GET (list/retrieve) - Public access
    - POST/PUT/PATCH/DELETE - Requires authentication
    
    Provides:
    - GET /api/announcements/ - List all announcements (paginated, public)
    - GET /api/announcements/{id}/ - Retrieve a specific announcement (public)
    - GET /api/announcements/urgent/ - List only urgent announcements (public)
    - POST /api/announcements/ - Create a new announcement (auth required)
    - PUT /api/announcements/{id}/ - Update an announcement (auth required)
    - PATCH /api/announcements/{id}/ - Partial update an announcement (auth required)
    - DELETE /api/announcements/{id}/ - Delete an announcement (auth required)
    """
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['get'], url_path='urgent')
    def urgent(self, request):
        """
        Get all urgent announcements.
        """
        urgent_announcements = self.queryset.filter(is_urgent=True)
        page = self.paginate_queryset(urgent_announcements)
        serializer = self.get_serializer(page if page else urgent_announcements, many=True)
        if page:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)
