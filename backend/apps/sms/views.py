from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import SMS
from .serializers import SMSSerializer
from .permissions import IsAuthenticatedOrReadOnly


class SMSViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling SMS CRUD operations.
    
    Permissions:
    - GET (list/retrieve) - Public access
    - POST/PUT/PATCH/DELETE - Requires authentication
    
    Provides:
    - GET /api/sms/ - List all SMS messages (paginated, public)
    - GET /api/sms/{id}/ - Retrieve a specific SMS message (public)
    - POST /api/sms/ - Create a new SMS message record (auth required)
    - POST /api/sms/send/ - Send SMS to recipients (auth required, admin)
    - PUT /api/sms/{id}/ - Update an SMS message (auth required)
    - PATCH /api/sms/{id}/ - Partial update an SMS message (auth required)
    - DELETE /api/sms/{id}/ - Delete an SMS message (auth required)
    """
    queryset = SMS.objects.all()
    serializer_class = SMSSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['post'], url_path='send', permission_classes=[IsAuthenticated])
    def send(self, request):
        """
        Send SMS to multiple recipients.
        This is a simulation endpoint for now - logs messages instead of actually sending.
        
        Expected payload:
        {
            "message": "Your message content",
            "recipients": ["+254712345678", "+254723456789"]
        }
        
        For production: Integrate with Twilio or Africa's Talking
        """
        # Check if user has permission to send SMS (admin/pastor only)
        if not (request.user.role in ['admin', 'pastor'] or request.user.is_superuser):
            return Response(
                {"error": "Only admins and pastors can send SMS messages"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        message_text = request.data.get('message')
        recipients = request.data.get('recipients', [])
        
        if not message_text:
            return Response(
                {"error": "Message text is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not recipients or not isinstance(recipients, list):
            return Response(
                {"error": "Recipients list is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create SMS records for each recipient
        sent_messages = []
        for recipient in recipients:
            sms = SMS.objects.create(
                sender=request.user.username,
                receiver=recipient,
                message=message_text
            )
            sent_messages.append(SMSSerializer(sms).data)
            
            # TODO: Integrate actual SMS sending here
            # For example with Africa's Talking:
            # import africastalking
            # africastalking.initialize(username, api_key)
            # sms_service = africastalking.SMS
            # response = sms_service.send(message_text, [recipient])
            
            # For now, just log it
            print(f"[SMS SIMULATED] To: {recipient}, From: {request.user.username}, Message: {message_text}")
        
        return Response({
            "success": True,
            "message": f"SMS sent to {len(sent_messages)} recipient(s)",
            "sent_messages": sent_messages
        }, status=status.HTTP_201_CREATED)
