from collections import OrderedDict
from decimal import Decimal

from django.db.models import Sum
from django.db.models.functions import TruncMonth
from django.utils.dateparse import parse_date
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Offering, Tithe
from .permissions import IsAdminOrReadOwn
from .serializers import OfferingSerializer, TitheSerializer


class TitheViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Tithe CRUD operations.

    Permissions:
    - Admin: Full CRUD access to all tithes
    - Members: Can only view their own tithes

    Provides:
    - GET /api/finance/tithes/ - List all tithes (admin) or own tithes (member)
    - GET /api/finance/tithes/{id}/ - Retrieve a specific tithe
    - GET /api/finance/tithes/my-tithes/ - Get current member's tithes
    - POST /api/finance/tithes/ - Create a new tithe (admin only)
    - PUT /api/finance/tithes/{id}/ - Update a tithe (admin only)
    - PATCH /api/finance/tithes/{id}/ - Partial update a tithe (admin only)
    - DELETE /api/finance/tithes/{id}/ - Delete a tithe (admin only)
    """

    queryset = Tithe.objects.select_related('member', 'verified_by').all()
    serializer_class = TitheSerializer
    permission_classes = [IsAdminOrReadOwn]

    def get_queryset(self):
        """Admins see all tithes. Members only their own."""
        if self.request.user.is_superuser or self.request.user.role == 'admin':
            return self.queryset

        if hasattr(self.request.user, 'member_profile'):
            return self.queryset.filter(member=self.request.user.member_profile)

        return Tithe.objects.none()

    @action(detail=False, methods=['get'], url_path='my-tithes')
    def my_tithes(self, request):
        """Get the current member's tithe history with total."""
        if not hasattr(request.user, 'member_profile'):
            return Response({"message": "No member profile found"}, status=404)

        member_tithes = self.queryset.filter(member=request.user.member_profile)
        total = member_tithes.aggregate(total=Sum('amount'))['total'] or Decimal('0')

        serializer = self.get_serializer(member_tithes, many=True)
        return Response({
            "tithes": serializer.data,
            "total_tithes": str(total)
        })


class OfferingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling Offering CRUD operations.

    Permissions:
    - Admin: Full CRUD access
    - Authenticated users: Read-only access

    Provides:
    - GET /api/finance/offerings/ - List all offerings
    - GET /api/finance/offerings/{id}/ - Retrieve a specific offering
    - POST /api/finance/offerings/ - Create a new offering (admin only)
    - PUT /api/finance/offerings/{id}/ - Update an offering (admin only)
    - PATCH /api/finance/offerings/{id}/ - Partial update an offering (admin only)
    - DELETE /api/finance/offerings/{id}/ - Delete an offering (admin only)
    """

    queryset = Offering.objects.select_related('collected_by', 'verified_by').all()
    serializer_class = OfferingSerializer
    permission_classes = [IsAdminOrReadOwn]


class FinanceSummaryView(APIView):
    """Aggregated finance report for leadership roles."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not (user.is_superuser or user.role in ('admin', 'pastor', 'staff')):
            return Response({"detail": "You do not have permission to view finance reports."}, status=status.HTTP_403_FORBIDDEN)

        date_from = parse_date(request.query_params.get('from')) if request.query_params.get('from') else None
        date_to = parse_date(request.query_params.get('to')) if request.query_params.get('to') else None

        tithes_qs = Tithe.objects.all()
        offerings_qs = Offering.objects.all()

        if date_from:
            tithes_qs = tithes_qs.filter(date_given__gte=date_from)
            offerings_qs = offerings_qs.filter(date_given__gte=date_from)
        if date_to:
            tithes_qs = tithes_qs.filter(date_given__lte=date_to)
            offerings_qs = offerings_qs.filter(date_given__lte=date_to)

        tithes_total = tithes_qs.aggregate(total=Sum('amount'))['total'] or Decimal('0')
        offerings_total = offerings_qs.aggregate(total=Sum('amount'))['total'] or Decimal('0')

        def monthly(queryset, field):
            return (
                queryset.annotate(month=TruncMonth(field))
                .values('month')
                .order_by('month')
                .annotate(total=Sum('amount'))
            )

        tithes_monthly = monthly(tithes_qs, 'date_given')
        offerings_monthly = monthly(offerings_qs, 'date_given')

        month_map = OrderedDict()
        for record in tithes_monthly:
            key = record['month'].strftime('%Y-%m')
            month_map.setdefault(
                key,
                {
                    'month': record['month'].strftime('%b %Y'),
                    'tithes': Decimal('0'),
                    'offerings': Decimal('0'),
                },
            )
            month_map[key]['tithes'] = record['total'] or Decimal('0')

        for record in offerings_monthly:
            key = record['month'].strftime('%Y-%m')
            month_map.setdefault(
                key,
                {
                    'month': record['month'].strftime('%b %Y'),
                    'tithes': Decimal('0'),
                    'offerings': Decimal('0'),
                },
            )
            month_map[key]['offerings'] = record['total'] or Decimal('0')

        monthly_data = [
            {
                'month': data['month'],
                'tithes': str(data['tithes']),
                'offerings': str(data['offerings']),
            }
            for data in month_map.values()
        ]

        by_method = {}
        for record in tithes_qs.values('method').annotate(total=Sum('amount')):
            method = record['method'] or 'other'
            by_method.setdefault(method, Decimal('0'))
            by_method[method] += record['total'] or Decimal('0')
        for record in offerings_qs.values('method').annotate(total=Sum('amount')):
            method = record['method'] or 'other'
            by_method.setdefault(method, Decimal('0'))
            by_method[method] += record['total'] or Decimal('0')
        by_method = {method: str(total) for method, total in by_method.items()}

        top_members = (
            tithes_qs.select_related('member')
            .values('member__full_name')
            .annotate(total=Sum('amount'))
            .order_by('-total')[:5]
        )
        top_members = [
            {
                'member': item['member__full_name'] or 'Unknown',
                'amount': str(item['total'] or Decimal('0')),
            }
            for item in top_members
        ]

        return Response(
            {
                'tithes_total': str(tithes_total),
                'offerings_total': str(offerings_total),
                'monthly': monthly_data,
                'by_method': by_method,
                'top_members': top_members,
                'filters': {
                    'from': date_from.isoformat() if date_from else None,
                    'to': date_to.isoformat() if date_to else None,
                },
            }
        )
