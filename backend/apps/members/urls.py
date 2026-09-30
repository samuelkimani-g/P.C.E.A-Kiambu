from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MemberViewSet

# Create a router and register the viewset
router = DefaultRouter()
router.register(r'', MemberViewSet, basename='member')

urlpatterns = [
    path('', include(router.urls)),
]

