from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, AuditLog

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "email", "role", "is_staff", "is_active", "is_archived")
    list_filter = ("role", "is_staff", "is_active", "is_archived")
    search_fields = ("username", "email", "first_name", "last_name", "phone_number")
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "email", "phone_number", "address", "date_of_birth", "profile_picture")}),
        ("Permissions", {"fields": ("role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
        ("Archiving", {"fields": ("is_archived",)}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "password1", "password2", "role", "is_staff", "is_active"),
        }),
    )

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("action", "user", "actor", "ip_address", "created_at")
    search_fields = ("user__username", "actor", "note")
    readonly_fields = ("user", "actor", "action", "ip_address", "note", "created_at")
