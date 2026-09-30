from django.db import models
from apps.members.models import Member
from apps.accounts.models import User


class Event(models.Model):
    """
    Model for church events.
    """
    EVENT_TYPE_CHOICES = [
        ('service', 'Church Service'),
        ('prayer', 'Prayer Meeting'),
        ('bible_study', 'Bible Study'),
        ('youth', 'Youth Meeting'),
        ('women', 'Women Fellowship'),
        ('men', 'Men Fellowship'),
        ('conference', 'Conference'),
        ('seminar', 'Seminar'),
        ('outreach', 'Outreach'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=255, help_text="Event title")
    description = models.TextField(help_text="Event description")
    event_type = models.CharField(max_length=50, choices=EVENT_TYPE_CHOICES, default='service', help_text="Type of event")
    event_date = models.DateTimeField(help_text="Date and time of the event")
    location = models.CharField(max_length=255, help_text="Event location/venue")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='events_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-event_date']
        verbose_name = 'Event'
        verbose_name_plural = 'Events'

    def __str__(self):
        return f"{self.title} - {self.event_date.strftime('%Y-%m-%d %H:%M')}"


class Attendance(models.Model):
    """
    Model for tracking event attendance.
    """
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('excused', 'Excused'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendances')
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='attendances')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present', help_text="Attendance status")
    timestamp = models.DateTimeField(auto_now_add=True, help_text="When attendance was marked")
    notes = models.TextField(blank=True, null=True, help_text="Additional notes")

    class Meta:
        ordering = ['-timestamp']
        unique_together = ['event', 'member']  # One attendance record per member per event
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendances'

    def __str__(self):
        return f"{self.member.full_name} - {self.event.title} ({self.status})"
