from rest_framework import serializers
from .models import Event, Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    """
    Serializer for the Attendance model.
    """
    member_name = serializers.CharField(source='member.full_name', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = Attendance
        fields = ['id', 'event', 'event_title', 'member', 'member_name', 'status', 'timestamp', 'notes']
        read_only_fields = ['id', 'timestamp', 'member_name', 'event_title']


class EventSerializer(serializers.ModelSerializer):
    """
    Serializer for the Event model.
    """
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    attendance_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'event_type', 'event_date', 'location', 
            'created_by', 'created_by_username', 'attendance_count', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by_username', 'attendance_count']
    
    def get_attendance_count(self, obj):
        """Get the number of people who attended this event."""
        return obj.attendances.filter(status='present').count()

