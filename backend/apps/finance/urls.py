from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TitheViewSet, OfferingViewSet, FinanceSummaryView

# Create a router and register the viewsets
router = DefaultRouter()
router.register(r'tithes', TitheViewSet, basename='tithe')
router.register(r'offerings', OfferingViewSet, basename='offering')

urlpatterns = [
    path('reports/summary/', FinanceSummaryView.as_view(), name='finance-summary'),
    path('', include(router.urls)),
]

