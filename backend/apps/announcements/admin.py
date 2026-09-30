from django.contrib import admin
from .models import Announcement


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    """
    Admin interface for managing Announcements.
    """
    list_display = ['title', 'is_urgent', 'created_at']
    list_filter = ['is_urgent', 'created_at']
    search_fields = ['title', 'message']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Announcement Details', {
            'fields': ('title', 'message', 'is_urgent')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
