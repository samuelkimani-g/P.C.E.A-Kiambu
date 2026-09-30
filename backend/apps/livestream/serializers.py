from rest_framework import serializers
from .models import Livestream


class LivestreamSerializer(serializers.ModelSerializer):
    """
    Serializer for the Livestream model.
    Converts Livestream instances to/from JSON format.
    """
    is_upcoming = serializers.ReadOnlyField()
    
    class Meta:
        model = Livestream
        fields = ['id', 'title', 'description', 'url', 'start_time', 'is_live', 'is_upcoming', 'created_at']
        read_only_fields = ['id', 'created_at', 'is_upcoming']  # Auto-generated fields

