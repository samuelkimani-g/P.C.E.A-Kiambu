from django.contrib import admin
from .models import Tithe, Offering


@admin.register(Tithe)
class TitheAdmin(admin.ModelAdmin):
    """
    Admin interface for managing Tithes.
    """
    list_display = ['member', 'amount', 'date_given', 'method', 'is_verified', 'verified_by']
    list_filter = ['is_verified', 'method', 'date_given']
    search_fields = ['member__full_name', 'reference_number']
    ordering = ['-date_given']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date_given'
    
    fieldsets = (
        ('Tithe Information', {
            'fields': ('member', 'amount', 'date_given', 'method', 'reference_number')
        }),
        ('Verification', {
            'fields': ('is_verified', 'verified_by', 'notes')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Offering)
class OfferingAdmin(admin.ModelAdmin):
    """
    Admin interface for managing Offerings.
    """
    list_display = ['offering_type', 'amount', 'date_given', 'method', 'is_verified', 'collected_by']
    list_filter = ['is_verified', 'offering_type', 'method', 'date_given']
    search_fields = ['offering_type', 'reference_number']
    ordering = ['-date_given']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date_given'
    
    fieldsets = (
        ('Offering Information', {
            'fields': ('offering_type', 'amount', 'date_given', 'method', 'reference_number')
        }),
        ('Collection & Verification', {
            'fields': ('collected_by', 'is_verified', 'verified_by', 'notes')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
