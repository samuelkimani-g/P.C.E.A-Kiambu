from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserViewSet

# Authentication-specific endpoints
urlpatterns = [
    path('register/', UserViewSet.as_view({'post': 'register'}), name='auth-register'),
    path('login/', UserViewSet.as_view({'post': 'login'}), name='auth-login'),
    path('logout/', UserViewSet.as_view({'post': 'logout_view'}), name='auth-logout'),
    path('profile/', UserViewSet.as_view({'get': 'profile', 'put': 'update_profile', 'patch': 'update_profile'}), name='auth-profile'),
    path('change-password/', UserViewSet.as_view({'post': 'change_password'}), name='auth-change-password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]

