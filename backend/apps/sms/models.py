from django.db import models


class SMS(models.Model):
    """
    Model for SMS messages sent to church members.
    Stores sender, receiver, message content, and timestamp.
    """
    sender = models.CharField(max_length=255, help_text="Name or identifier of the sender")
    receiver = models.CharField(max_length=255, help_text="Name or phone number of the receiver")
    message = models.TextField(help_text="Content of the SMS message")
    sent_at = models.DateTimeField(auto_now_add=True, help_text="Timestamp when the SMS was sent")

    class Meta:
        ordering = ['-sent_at']  # Most recent first
        verbose_name = 'SMS Message'
        verbose_name_plural = 'SMS Messages'

    def __str__(self):
        return f"From {self.sender} to {self.receiver} - {self.sent_at.strftime('%Y-%m-%d %H:%M')}"
