from django.contrib import admin
from .models import Livestream


@admin.register(Livestream)
class LivestreamAdmin(admin.ModelAdmin):
    """
    Admin interface for managing Livestreams.
    """
    list_display = ['title', 'start_time', 'is_live', 'url']
    list_filter = ['is_live', 'start_time']
    search_fields = ['title', 'description']
    ordering = ['-start_time']
    date_hierarchy = 'start_time'
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Livestream Details', {
            'fields': ('title', 'description', 'url', 'start_time', 'is_live')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
