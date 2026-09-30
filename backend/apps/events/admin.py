from django.contrib import admin
from .models import Event, Attendance


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """
    Admin interface for managing Events.
    """
    list_display = ['title', 'event_type', 'event_date', 'location', 'created_by']
    list_filter = ['event_type', 'event_date']
    search_fields = ['title', 'description', 'location']
    ordering = ['-event_date']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'event_date'
    
    fieldsets = (
        ('Event Details', {
            'fields': ('title', 'description', 'event_type', 'event_date', 'location')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    """
    Admin interface for managing Attendance.
    """
    list_display = ['member', 'event', 'status', 'timestamp']
    list_filter = ['status', 'timestamp', 'event']
    search_fields = ['member__full_name', 'event__title']
    ordering = ['-timestamp']
    readonly_fields = ['timestamp']
    
    fieldsets = (
        ('Attendance Information', {
            'fields': ('event', 'member', 'status', 'notes')
        }),
        ('Metadata', {
            'fields': ('timestamp',),
            'classes': ('collapse',)
        }),
    )
