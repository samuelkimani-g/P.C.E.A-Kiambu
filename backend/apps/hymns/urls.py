from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HymnViewSet

# Create a router and register the viewset
router = DefaultRouter()
router.register(r'', HymnViewSet, basename='hymn')

urlpatterns = [
    path('', include(router.urls)),
]
