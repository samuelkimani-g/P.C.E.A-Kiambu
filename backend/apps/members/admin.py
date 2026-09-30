from django.contrib import admin
from .models import Member


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    """
    Admin interface for managing Members.
    """
    list_display = ['full_name', 'user', 'district', 'phone', 'membership_status', 'joined_on']
    list_filter = ['membership_status', 'gender', 'district', 'joined_on', 'baptism_date']
    search_fields = ['full_name', 'phone', 'email', 'district', 'user__username']
    ordering = ['full_name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'joined_on'
    
    fieldsets = (
        ('User Account', {
            'fields': ('user',)
        }),
        ('Personal Information', {
            'fields': ('full_name', 'gender', 'age', 'phone', 'email', 'address', 'district')
        }),
        ('Church Information', {
            'fields': ('baptism_date', 'membership_status', 'joined_on')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
