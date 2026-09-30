from django.db import models
from django.utils import timezone


class Livestream(models.Model):
    """
    Model for church livestream events.
    Stores livestream title, description, URL, scheduled date, and live status.
    """
    title = models.CharField(max_length=255, help_text="Title of the livestream event")
    description = models.TextField(help_text="Description of the livestream event")
    url = models.URLField(max_length=500, help_text="URL link to the livestream (YouTube, Facebook, etc.)")
    start_time = models.DateTimeField(help_text="Scheduled start date and time of the livestream")
    is_live = models.BooleanField(default=False, help_text="Is this livestream currently active?")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        ordering = ['-start_time']  # Most recent first
        verbose_name = 'Livestream'
        verbose_name_plural = 'Livestreams'

    def __str__(self):
        live_marker = " [LIVE NOW]" if self.is_live else ""
        return f"{self.title}{live_marker} - {self.start_time.strftime('%Y-%m-%d %H:%M')}"
    
    @property
    def is_upcoming(self):
        """Check if livestream is in the future."""
        return self.start_time > timezone.now() and not self.is_live
