from django.contrib import admin
from .models import SMS


@admin.register(SMS)
class SMSAdmin(admin.ModelAdmin):
    """
    Admin interface for managing SMS messages.
    """
    list_display = ['sender', 'receiver', 'sent_at', 'message_preview']
    list_filter = ['sent_at', 'sender']
    search_fields = ['sender', 'receiver', 'message']
    ordering = ['-sent_at']
    readonly_fields = ['sent_at']
    date_hierarchy = 'sent_at'
    
    fieldsets = (
        ('Message Details', {
            'fields': ('sender', 'receiver', 'message')
        }),
        ('Metadata', {
            'fields': ('sent_at',),
            'classes': ('collapse',)
        }),
    )
    
    def message_preview(self, obj):
        """Display a preview of the message (first 50 characters)"""
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    message_preview.short_description = 'Message Preview'
