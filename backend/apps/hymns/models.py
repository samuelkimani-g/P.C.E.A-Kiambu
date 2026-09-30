from django.db import models
from apps.accounts.models import User


class Hymn(models.Model):
    """
    Model for church hymns.
    Stores hymn title, lyrics, category, and number.
    """
    CATEGORY_CHOICES = [
        ('worship', 'Worship'),
        ('praise', 'Praise'),
        ('thanksgiving', 'Thanksgiving'),
        ('prayer', 'Prayer'),
        ('communion', 'Communion'),
        ('christmas', 'Christmas'),
        ('easter', 'Easter'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=255, help_text="Title of the hymn")
    number = models.IntegerField(unique=True, help_text="Hymn number in the hymnal")
    lyrics = models.TextField(help_text="Full lyrics of the hymn")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='worship', help_text="Category of the hymn")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='hymns_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['number']  # Order by hymn number
        verbose_name = 'Hymn'
        verbose_name_plural = 'Hymns'

    def __str__(self):
        return f"#{self.number} - {self.title}"
