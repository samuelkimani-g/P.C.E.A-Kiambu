from rest_framework import serializers
from .models import SMS


class SMSSerializer(serializers.ModelSerializer):
    """
    Serializer for the SMS model.
    Converts SMS instances to/from JSON format.
    """
    class Meta:
        model = SMS
        fields = ['id', 'sender', 'receiver', 'message', 'sent_at']
        read_only_fields = ['id', 'sent_at']  # These fields are auto-generated

