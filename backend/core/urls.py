from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication routes
    path('api/auth/', include('apps.accounts.auth_urls')),
 
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/hymns/', include('apps.hymns.urls')),
    path('api/announcements/', include('apps.announcements.urls')),
    path('api/livestream/', include('apps.livestream.urls')),
    path('api/sms/', include('apps.sms.urls')),
    path('api/members/', include('apps.members.urls')),
    path('api/finance/', include('apps.finance.urls')),
    path('api/', include('apps.events.urls')),  # events has nested paths (events/ and attendance/)
]
