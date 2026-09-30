from rest_framework import serializers
from .models import Hymn


class HymnSerializer(serializers.ModelSerializer):
    """
    Serializer for the Hymn model.
    Converts Hymn instances to/from JSON format.
    """
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Hymn
        fields = ['id', 'title', 'number', 'lyrics', 'category', 'created_by', 'created_by_username', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by_username']

