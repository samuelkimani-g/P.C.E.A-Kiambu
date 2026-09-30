from django.contrib import admin
from .models import Hymn


@admin.register(Hymn)
class HymnAdmin(admin.ModelAdmin):
    """
    Admin interface for managing Hymns.
    """
    list_display = ['number', 'title', 'category', 'created_by', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['title', 'lyrics', 'number']
    ordering = ['number']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Hymn Details', {
            'fields': ('number', 'title', 'category', 'lyrics')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
