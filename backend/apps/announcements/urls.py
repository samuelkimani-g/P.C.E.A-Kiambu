from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnnouncementViewSet

# Create a router and register the viewset
router = DefaultRouter()
router.register(r'', AnnouncementViewSet, basename='announcement')

urlpatterns = [
    path('', include(router.urls)),
]
