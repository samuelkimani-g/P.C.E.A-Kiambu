from rest_framework import serializers
from .models import Member


class MemberSerializer(serializers.ModelSerializer):
    """
    Serializer for the Member model.
    Includes user information.
    """
    username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Member
        fields = [
            'id', 'user', 'username', 'user_email', 'full_name', 'gender', 'age', 
            'phone', 'email', 'address', 'district', 'baptism_date', 'membership_status', 
            'joined_on', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'username', 'user_email']

