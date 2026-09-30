from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for listing users.
    """
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "role",
            "phone_number",
            "address",
            "date_of_birth",
            "profile_picture",
            "is_active",
            "is_archived",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_full_name(self, obj):
        return obj.full_name()

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration (creates a new user).
    """
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password")
    district = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ("username", "email", "first_name", "last_name", "password", "password2", "role", "phone_number", "district")

    def validate(self, attrs):
        if attrs.get("password") != attrs.pop("password2", None):
            raise serializers.ValidationError({"password": "Passwords must match."})
        # validate password strength
        validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        district = validated_data.pop("district", "")
        user = User(**validated_data)
        user.set_password(password)
        user.district = district  # temporary attribute for member signal/update
        # default role is member unless provided and allowed
        if not user.role:
            user.role = User.ROLE_MEMBER
        user.save()
        user.refresh_from_db()
        setattr(user, "_pending_member_data", {"district": district})
        return user

class UpdatePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value
