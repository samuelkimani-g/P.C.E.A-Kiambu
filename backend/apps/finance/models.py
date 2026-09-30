from django.db import models
from apps.members.models import Member
from apps.accounts.models import User


class Tithe(models.Model):
    """
    Model for tracking tithes given by church members.
    """
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('mpesa', 'M-Pesa'),
        ('bank', 'Bank Transfer'),
        ('cheque', 'Cheque'),
        ('other', 'Other'),
    ]
    
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='tithes', help_text="Member who gave the tithe")
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Amount in local currency")
    date_given = models.DateField(help_text="Date the tithe was given")
    method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cash', help_text="Payment method used")
    reference_number = models.CharField(max_length=100, blank=True, null=True, help_text="Transaction reference (M-Pesa code, cheque number, etc.)")
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_tithes', help_text="Admin who verified this tithe")
    is_verified = models.BooleanField(default=False, help_text="Has this been verified by an admin?")
    notes = models.TextField(blank=True, null=True, help_text="Additional notes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_given']
        verbose_name = 'Tithe'
        verbose_name_plural = 'Tithes'

    def __str__(self):
        return f"{self.member.full_name} - KES {self.amount} ({self.date_given})"


class Offering(models.Model):
    """
    Model for tracking general church offerings.
    Offerings are not tied to specific members.
    """
    OFFERING_TYPE_CHOICES = [
        ('general', 'General Offering'),
        ('thanksgiving', 'Thanksgiving'),
        ('building', 'Building Fund'),
        ('missions', 'Missions'),
        ('special', 'Special Offering'),
        ('other', 'Other'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('mpesa', 'M-Pesa'),
        ('bank', 'Bank Transfer'),
        ('cheque', 'Cheque'),
        ('other', 'Other'),
    ]
    
    offering_type = models.CharField(max_length=50, choices=OFFERING_TYPE_CHOICES, default='general', help_text="Type of offering")
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total amount collected")
    date_given = models.DateField(help_text="Date the offering was collected")
    method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cash', help_text="Payment method used")
    reference_number = models.CharField(max_length=100, blank=True, null=True, help_text="Transaction reference")
    collected_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='collected_offerings', help_text="Person who collected/recorded this")
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_offerings', help_text="Admin who verified this offering")
    is_verified = models.BooleanField(default=False, help_text="Has this been verified?")
    notes = models.TextField(blank=True, null=True, help_text="Additional notes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_given']
        verbose_name = 'Offering'
        verbose_name_plural = 'Offerings'

    def __str__(self):
        return f"{self.offering_type} - KES {self.amount} ({self.date_given})"
