from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class User(AbstractUser):
    """
    Custom user model.
    Extends AbstractUser to add role & profile fields used across the church apps.
    """
    ROLE_ADMIN = "admin"
    ROLE_PASTOR = "pastor"
    ROLE_STAFF = "staff"
    ROLE_MEMBER = "member"

    ROLE_CHOICES = [
        (ROLE_ADMIN, "Admin"),
        (ROLE_PASTOR, "Pastor"),
        (ROLE_STAFF, "Staff"),
        (ROLE_MEMBER, "Member"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_MEMBER)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to="profile_pics/", blank=True, null=True)
    # audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # soft delete flag (simple)
    is_archived = models.BooleanField(default=False)

    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def __str__(self):
        return f"{self.username} ({self.role})"

class AuditLog(models.Model):
    """
    Simple audit log for user-related actions.
    Useful for admin / logs interface in the web UI.
    """
    ACTION_CHOICES = [
        ("create", "Create"),
        ("update", "Update"),
        ("delete", "Delete"),
        ("login", "Login"),
        ("logout", "Logout"),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    actor = models.CharField(max_length=150, blank=True, null=True)  # who performed the action
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    ip_address = models.CharField(max_length=50, blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.action} - {self.user} @ {self.created_at:%Y-%m-%d %H:%M}"
