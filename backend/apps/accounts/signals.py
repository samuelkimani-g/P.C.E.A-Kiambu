from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, AuditLog

@receiver(post_save, sender=User)
def create_user_audit(sender, instance, created, **kwargs):
    """
    Create a simple audit log entry whenever a user is created or updated.
    """
    if created:
        AuditLog.objects.create(user=instance, actor=instance.username, action="create", note="User created")
    else:
        AuditLog.objects.create(user=instance, actor=instance.username, action="update", note="User updated")
