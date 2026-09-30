from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from apps.accounts.models import User
from .models import Member


@receiver(post_save, sender=User)
def create_member_profile(sender, instance, created, **kwargs):
    """
    Automatically create a Member profile when a new User is created.
    Only creates if the user is a member role.
    """
    if created and instance.role == 'member':
        defaults = {
            'full_name': instance.get_full_name() or instance.username,
            'phone': instance.phone_number or '',
            'email': instance.email or '',
            'address': instance.address or '',
            'district': getattr(instance, 'district', ''),
            'joined_on': getattr(instance, 'date_joined', timezone.now()).date(),
        }
        Member.objects.update_or_create(user=instance, defaults=defaults)

