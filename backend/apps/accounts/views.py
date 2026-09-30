from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone

from apps.members.models import Member

from .models import User, AuditLog
from .serializers import UserSerializer, RegisterSerializer, UpdatePasswordSerializer
from .permissions import IsAdminOrReadOnly

# ---------------------------
# Helper: Token generation
# ---------------------------
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}

# ---------------------------
# User ViewSet
# ---------------------------
class UserViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for User model.
    - list/retrieve accessible to read-only (unless restricted by permission)
    - create = registration (public)
    - update/destroy restricted by IsAdminOrReadOnly (admins)
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_permissions(self):
        # override registration action permissions
        if self.action in ["register", "login", "google_auth"]:
            return [AllowAny()]
        if self.action in ["change_password"]:
            return [IsAuthenticated()]
        return super().get_permissions()

    def list(self, request, *args, **kwargs):
        # filter out archived by default unless admin requests
        if request.user.is_authenticated and (request.user.role == "admin" or request.user.is_superuser):
            qs = self.get_queryset()
        else:
            qs = self.get_queryset().filter(is_archived=False)
        page = self.paginate_queryset(qs)
        serializer = self.get_serializer(page or qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path="register")
    def register(self, request):
        """
        Register a new user.
        """
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        if user.role == User.ROLE_MEMBER:
            member_defaults = {
                "full_name": f"{user.first_name} {user.last_name}".strip() or user.username,
                "phone": user.phone_number or "",
                "email": user.email or "",
                "address": getattr(user, "address", "") or "",
                "district": getattr(user, "_pending_member_data", {}).get("district", ""),
                "joined_on": timezone.now().date(),
            }
            Member.objects.update_or_create(user=user, defaults=member_defaults)

        tokens = get_tokens_for_user(user)
        AuditLog.objects.create(user=user, actor=user.username, action="create", note="Registered via API")
        return Response({"user": UserSerializer(user).data, "tokens": tokens}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"], url_path="login")
    def login(self, request):
        """
        Basic username/email + password login that returns JWT tokens.
        Accepts either 'username' or 'email'.
        """
        username = request.data.get("username") or request.data.get("email")
        password = request.data.get("password")
        if not username or not password:
            return Response({"detail": "provide username/email and password"}, status=status.HTTP_400_BAD_REQUEST)

        # try authenticate: prefer username, fallback to email
        user = authenticate(request, username=username, password=password)
        if not user:
            # try authenticate by email
            try:
                user_obj = User.objects.get(email__iexact=username)
                user = authenticate(request, username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

        if not user:
            return Response({"detail": "invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # optional: login to set session
        login(request, user)
        tokens = get_tokens_for_user(user)
        AuditLog.objects.create(user=user, actor=user.username, action="login", note="Logged in via API")
        return Response({"user": UserSerializer(user).data, "tokens": tokens})

    @action(detail=False, methods=["post"], url_path="logout", permission_classes=[IsAuthenticated])
    def logout_view(self, request):
        # if using session auth
        AuditLog.objects.create(user=request.user, actor=request.user.username, action="logout", note="Logged out via API")
        logout(request)
        return Response({"detail": "successfully logged out"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="change-password", permission_classes=[IsAuthenticated])
    def change_password(self, request):
        serializer = UpdatePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        old = serializer.validated_data.get("old_password") or serializer.validated_data.get("old_password")
        new = serializer.validated_data["new_password"]
        if not user.check_password(old):
            return Response({"detail": "old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new)
        user.save()
        AuditLog.objects.create(user=user, actor=user.username, action="update", note="Password changed")
        return Response({"detail": "password updated"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="google-auth", permission_classes=[AllowAny])
    def google_auth(self, request):
        """
        Accepts an ID token from Google Sign-In on client (mobile or web).
        This method demonstrates where to verify the token and create/login the user.
        NOTE: to do real verification, install `google-auth` and call google.oauth2.id_token.verify_oauth2_token
        """
        id_token = request.data.get("id_token")
        if not id_token:
            return Response({"detail": "id_token is required"}, status=status.HTTP_400_BAD_REQUEST)

        # --- Example placeholder code ---
        # Real implementation (recommended):
        # from google.oauth2 import id_token as google_id_token
        # from google.auth.transport import requests as google_requests
        # try:
        #     idinfo = google_id_token.verify_oauth2_token(id_token, google_requests.Request(), CLIENT_ID)
        # except ValueError:
        #     return Response({"detail": "invalid google token"}, status=status.HTTP_400_BAD_REQUEST)
        #
        # Use idinfo['email'], idinfo['name'] etc to create or get user.
        #
        # For now we accept a payload for local dev:
        email = request.data.get("email")
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")
        if not email:
            return Response({"detail": "email is required for google-auth fallback"}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(email=email, defaults={
            "username": email.split("@")[0],
            "first_name": first_name,
            "last_name": last_name,
        })
        if created:
            user.set_unusable_password()
            user.save()
            AuditLog.objects.create(user=user, actor=user.username, action="create", note="Created via Google auth")
        # return tokens
        tokens = get_tokens_for_user(user)
        return Response({"user": UserSerializer(user).data, "tokens": tokens})

    @action(detail=False, methods=["get"], url_path="profile", permission_classes=[IsAuthenticated])
    def profile(self, request):
        """
        Get current authenticated user's profile.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["put", "patch"], url_path="update-profile", permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        """
        Update current authenticated user's profile.
        """
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        AuditLog.objects.create(user=request.user, actor=request.user.username, action="update", note="Profile updated")
        return Response(serializer.data)

    def perform_destroy(self, instance):
        # soft-delete: mark archived
        instance.is_archived = True
        instance.is_active = False
        instance.save()
        AuditLog.objects.create(user=instance, actor="system", action="delete", note="Soft archived user")
