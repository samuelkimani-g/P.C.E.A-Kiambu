from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Event, Attendance
from .serializers import EventSerializer, AttendanceSerializer
from .permissions import IsAdminOrReadOnly


class EventViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Event CRUD operations.
    
    Permissions:
    - Admin: Full CRUD access
    - Authenticated users: Read access
    
    Provides:
    - GET /api/events/ - List all events
    - GET /api/events/{id}/ - Retrieve a specific event
    - GET /api/events/{id}/attendance/ - View attendance for an event (admin)
    - POST /api/events/{id}/mark-attendance/ - Mark attendance for an event
    - POST /api/events/ - Create a new event (admin only)
    - PUT /api/events/{id}/ - Update an event (admin only)
    - PATCH /api/events/{id}/ - Partial update an event (admin only)
    - DELETE /api/events/{id}/ - Delete an event (admin only)
    """
    queryset = Event.objects.select_related('created_by').all()
    serializer_class = EventSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def perform_create(self, serializer):
        """Automatically set created_by to current user when creating an event."""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['get'], url_path='attendance')
    def attendance(self, request, pk=None):
        """
        View attendance for a specific event.
        Admin only.
        """
        if not (request.user.role == 'admin' or request.user.is_superuser):
            return Response(
                {"error": "Only admins can view full attendance lists"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        event = self.get_object()
        attendances = Attendance.objects.filter(event=event).select_related('member')
        serializer = AttendanceSerializer(attendances, many=True)
        
        # Calculate summary
        total = attendances.count()
        present = attendances.filter(status='present').count()
        absent = attendances.filter(status='absent').count()
        excused = attendances.filter(status='excused').count()
        
        return Response({
            "event": EventSerializer(event).data,
            "summary": {
                "total": total,
                "present": present,
                "absent": absent,
                "excused": excused
            },
            "attendances": serializer.data
        })
    
    @action(detail=True, methods=['post'], url_path='mark-attendance', permission_classes=[IsAuthenticated])
    def mark_attendance(self, request, pk=None):
        """
        Mark attendance for the current user or specified member.
        Members can mark their own attendance.
        Admins can mark attendance for any member.
        
        Body:
        {
            "status": "present",  // or "absent", "excused"
            "member_id": 1  // optional, only for admins
        }
        """
        event = self.get_object()
        
        # Determine which member we're marking attendance for
        member_id = request.data.get('member_id')
        if member_id:
            # Only admins can mark attendance for other members
            if not (request.user.role == 'admin' or request.user.is_superuser):
                return Response(
                    {"error": "Only admins can mark attendance for other members"},
                    status=status.HTTP_403_FORBIDDEN
                )
            try:
                from apps.members.models import Member
                member = Member.objects.get(id=member_id)
            except Member.DoesNotExist:
                return Response({"error": "Member not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Mark attendance for current user
            if not hasattr(request.user, 'member_profile'):
                return Response(
                    {"error": "No member profile found for this user"},
                    status=status.HTTP_404_NOT_FOUND
                )
            member = request.user.member_profile
        
        status_value = request.data.get('status', 'present')
        notes = request.data.get('notes', '')
        
        # Create or update attendance
        attendance, created = Attendance.objects.update_or_create(
            event=event,
            member=member,
            defaults={
                'status': status_value,
                'notes': notes
            }
        )
        
        serializer = AttendanceSerializer(attendance)
        return Response({
            "message": "Attendance marked successfully" if created else "Attendance updated successfully",
            "attendance": serializer.data
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class AttendanceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing Attendance records.
    Admin access only.
    """
    queryset = Attendance.objects.select_related('event', 'member').all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Admins see all attendance records.
        Members see only their own attendance.
        """
        if self.request.user.role == 'admin' or self.request.user.is_superuser:
            return self.queryset
        
        if hasattr(self.request.user, 'member_profile'):
            return self.queryset.filter(member=self.request.user.member_profile)
        
        return Attendance.objects.none()
