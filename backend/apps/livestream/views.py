from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Livestream
from .serializers import LivestreamSerializer
from .permissions import IsAuthenticatedOrReadOnly


class LivestreamViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Livestream CRUD operations.
    
    Permissions:
    - GET (list/retrieve) - Public access
    - POST/PUT/PATCH/DELETE - Requires authentication
    
    Provides:
    - GET /api/livestream/ - List all livestreams (paginated, public)
    - GET /api/livestream/{id}/ - Retrieve a specific livestream (public)
    - GET /api/livestream/now/ - Get currently live streams (public)
    - GET /api/livestream/upcoming/ - Get upcoming scheduled streams (public)
    - POST /api/livestream/ - Create a new livestream (auth required)
    - PUT /api/livestream/{id}/ - Update a livestream (auth required)
    - PATCH /api/livestream/{id}/ - Partial update a livestream (auth required)
    - DELETE /api/livestream/{id}/ - Delete a livestream (auth required)
    """
    queryset = Livestream.objects.all()
    serializer_class = LivestreamSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['get'], url_path='now')
    def now(self, request):
        """
        Get all currently live streams.
        """
        live_streams = self.queryset.filter(is_live=True)
        serializer = self.get_serializer(live_streams, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='upcoming')
    def upcoming(self, request):
        """
        Get all upcoming scheduled livestreams.
        """
        upcoming_streams = self.queryset.filter(
            start_time__gt=timezone.now(),
            is_live=False
        )
        page = self.paginate_queryset(upcoming_streams)
        serializer = self.get_serializer(page if page else upcoming_streams, many=True)
        if page:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)
