import json
import random
from pathlib import Path

import requests
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from .models import Hymn
from .serializers import HymnSerializer
from .permissions import IsAuthenticatedOrReadOnly


class HymnViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Hymn CRUD operations.
    
    Permissions:
    - GET (list/retrieve) - Public access
    - POST/PUT/PATCH/DELETE - Requires authentication
    
    Provides:
    - GET /api/hymns/ - List all hymns (paginated, public)
    - GET /api/hymns/{id}/ - Retrieve a specific hymn (public)
    - GET /api/hymns/search/?q=query - Search hymns by title or lyrics (public)
    - GET /api/hymns/random/ - Get a random hymn (public)
    - GET /api/hymns/golden-bells/ - Fetch hymns from the Golden Bells collection
    - POST /api/hymns/ - Create a new hymn (auth required)
    - PUT /api/hymns/{id}/ - Update a hymn (auth required)
    - PATCH /api/hymns/{id}/ - Partial update a hymn (auth required)
    - DELETE /api/hymns/{id}/ - Delete a hymn (auth required)
    """
    queryset = Hymn.objects.all()
    serializer_class = HymnSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'lyrics', 'number']
    ordering_fields = ['number', 'title', 'created_at']
    
    def perform_create(self, serializer):
        """Automatically set created_by to current user when creating a hymn."""
        if self.request.user.is_authenticated:
            serializer.save(created_by=self.request.user)
        else:
            serializer.save()
    
    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        """
        Search hymns by title or lyrics.
        Query parameter: q (search query)
        
        Example: GET /api/hymns/search/?q=amazing
        """
        query = request.query_params.get('q', '')
        
        if not query:
            return Response(
                {"error": "Please provide a search query using ?q="},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Search in title and lyrics
        results = self.queryset.filter(
            Q(title__icontains=query) | 
            Q(lyrics__icontains=query) |
            Q(number__icontains=query)
        )
        
        page = self.paginate_queryset(results)
        serializer = self.get_serializer(page if page else results, many=True)
        
        if page:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='random')
    def random_hymn(self, request):
        """
        Get a random hymn from the database.
        
        Example: GET /api/hymns/random/
        """
        hymn_count = self.queryset.count()
        
        if hymn_count == 0:
            return Response(
                {"message": "No hymns available"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get a random hymn
        random_index = random.randint(0, hymn_count - 1)
        random_hymn = self.queryset.all()[random_index]
        
        serializer = self.get_serializer(random_hymn)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='golden-bells')
    def golden_bells(self, request):
        """Fetch hymns from the Golden Bells collection (external or local sample)."""
        language = request.query_params.get('language')
        data = []
        source_error = None

        external_api = getattr(settings, 'GOLDEN_BELLS_API', None)
        if external_api:
            try:
                params = {'language': language} if language else None
                response = requests.get(external_api, params=params, timeout=10)
                if response.status_code == 200:
                    data = response.json()
            except requests.RequestException as exc:
                source_error = str(exc)

        if not data:
            sample_file = Path(__file__).resolve().parent / 'data' / 'golden_bells_sample.json'
            try:
                with sample_file.open() as handle:
                    data = json.load(handle)
            except FileNotFoundError:
                return Response({'detail': 'Golden Bells sample data not found.'}, status=500)

        if language:
            data = [item for item in data if item.get('language', '').lower() == language.lower()]

        payload = {
            'count': len(data),
            'results': data,
        }
        if source_error:
            payload['warning'] = f"Fell back to local sample data: {source_error}" 
        return Response(payload)
    
    @action(detail=False, methods=['get'], url_path='category/(?P<category_name>[^/.]+)')
    def by_category(self, request, category_name=None):
        """
        Get hymns filtered by category.
        
        Example: GET /api/hymns/category/worship/
        """
        hymns = self.queryset.filter(category=category_name)
        
        page = self.paginate_queryset(hymns)
        serializer = self.get_serializer(page if page else hymns, many=True)
        
        if page:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)
