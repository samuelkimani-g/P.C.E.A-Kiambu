from rest_framework import serializers
from .models import Announcement


class AnnouncementSerializer(serializers.ModelSerializer):
    """
    Serializer for the Announcement model.
    Converts Announcement instances to/from JSON format.
    """
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'message', 'is_urgent', 'created_at']
        read_only_fields = ['id', 'created_at']  # These fields are auto-generated

