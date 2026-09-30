from django.db import models


class Announcement(models.Model):
    """
    Model for church announcements.
    Stores title, message, creation timestamp, and urgency flag.
    """
    title = models.CharField(max_length=255, help_text="Title of the announcement")
    message = models.TextField(help_text="Full announcement message")
    is_urgent = models.BooleanField(default=False, help_text="Mark as urgent/important announcement")
    created_at = models.DateTimeField(auto_now_add=True, help_text="When the announcement was created")

    class Meta:
        ordering = ['-created_at']  # Most recent first
        verbose_name = 'Announcement'
        verbose_name_plural = 'Announcements'

    def __str__(self):
        urgent_marker = " [URGENT]" if self.is_urgent else ""
        return f"{self.title}{urgent_marker} - {self.created_at.strftime('%Y-%m-%d')}"
