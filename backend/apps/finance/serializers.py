from rest_framework import serializers
from .models import Tithe, Offering


class TitheSerializer(serializers.ModelSerializer):
    """
    Serializer for the Tithe model.
    """
    member_name = serializers.CharField(source='member.full_name', read_only=True)
    verified_by_username = serializers.CharField(source='verified_by.username', read_only=True)
    
    class Meta:
        model = Tithe
        fields = [
            'id', 'member', 'member_name', 'amount', 'date_given', 'method', 
            'reference_number', 'verified_by', 'verified_by_username', 
            'is_verified', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'member_name', 'verified_by_username']


class OfferingSerializer(serializers.ModelSerializer):
    """
    Serializer for the Offering model.
    """
    collected_by_username = serializers.CharField(source='collected_by.username', read_only=True)
    verified_by_username = serializers.CharField(source='verified_by.username', read_only=True)
    
    class Meta:
        model = Offering
        fields = [
            'id', 'offering_type', 'amount', 'date_given', 'method', 
            'reference_number', 'collected_by', 'collected_by_username', 
            'verified_by', 'verified_by_username', 'is_verified', 
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'collected_by_username', 'verified_by_username']

