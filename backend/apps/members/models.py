from django.db import models
from apps.accounts.models import User


class Member(models.Model):
    """
    Model for church members.
    Each member is linked to a User account.
    """
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('transferred', 'Transferred'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='member_profile')
    full_name = models.CharField(max_length=255, help_text="Full legal name")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, help_text="Gender")
    age = models.IntegerField(null=True, blank=True, help_text="Age in years")
    phone = models.CharField(max_length=20, help_text="Phone number")
    email = models.EmailField(help_text="Email address")
    address = models.TextField(help_text="Physical address")
    district = models.CharField(max_length=120, blank=True, help_text="District / fellowship group")
    baptism_date = models.DateField(null=True, blank=True, help_text="Date of baptism")
    membership_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active', help_text="Current membership status")
    joined_on = models.DateField(help_text="Date joined the church")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['full_name']
        verbose_name = 'Member'
        verbose_name_plural = 'Members'

    def __str__(self):
        district_label = f" - {self.district}" if self.district else ""
        return f"{self.full_name} ({self.membership_status}){district_label}"
