from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LivestreamViewSet

# Create a router and register the viewset
router = DefaultRouter()
router.register(r'', LivestreamViewSet, basename='livestream')

urlpatterns = [
    path('', include(router.urls)),
]
