import requests as http_requests
import difflib
from django.utils import timezone
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from .permissions import IsAdminProfile
from .models import FoundItem, LostReport, ItemReport, PickupSchedule, UserProfile, ClaimRequest
from .serializers import (
    FoundItemSerializer, LostReportSerializer,
    ItemReportSerializer, PickupScheduleSerializer, UserProfileSerializer, ClaimRequestSerializer
)
from .services.auth_service import authenticate_google_user

# ─── Utility ──────────────────────────────────────────────────────────────────



# ─── Google OAuth ──────────────────────────────────────────────────────────────

@api_view(['POST'])
def google_auth(request):
    access_token = request.data.get('access_token')
    credential = request.data.get('credential')
    
    user_info, error = authenticate_google_user(access_token, credential)
    
    if error:
        return Response({'error': error['error']}, status=error.get('status', 400))

    # Only allow @auis.edu.krd emails
    if not user_info['email'].endswith("@auis.edu.krd"):
        return Response(
            {"error": "Only AUIS emails are allowed."},
            status=403
        )

    email = user_info['email']
    google_id = user_info['google_id']
    full_name = user_info['full_name']
    photo_url = user_info['photo_url']


    profile, _ = UserProfile.objects.get_or_create(
        google_id=google_id,
        defaults={'email': email}
    )
    
    # Update profile info on each login
    profile.full_name = full_name
    profile.photo_url = photo_url
    profile.save()

    return Response({
        'id': profile.id,
        'email': profile.email,
        'full_name': profile.full_name,
        'photo_url': profile.photo_url,
        'is_admin': profile.is_admin,
    })


# ─── Admin Stats ──────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAdminProfile])
def admin_stats(request):
    return Response({
        'total_found': FoundItem.objects.count(),
        'total_found_available': FoundItem.objects.filter(status='found').count(),
        'total_claimed': FoundItem.objects.filter(status='claimed').count(),
        'total_lost_reports': LostReport.objects.count(),
        'pending_reports': ItemReport.objects.filter(status='pending').count(),
        'active_schedules': PickupSchedule.objects.filter(status='scheduled').count(),
        'active_claims': ClaimRequest.objects.filter(status='pending').count(),
        'resolved_reports': LostReport.objects.filter(is_resolved=True).count(),
    })

# ─── ViewSets ─────────────────────────────────────────────────────────────────

class UserProfileViewSet(viewsets.ModelViewSet):
    """
    Manage user profile: updating settings, getting history, deleting account.
    We only allow users to affect their OWN profile.
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get_permissions(self):
        # We explicitly rely on the custom EmailAuthentication handling to set request.user
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if hasattr(self.request, 'user') and self.request.user:
            if getattr(self.request.user, 'is_admin', False):
                return UserProfile.objects.all().order_by('-created_at')
            return UserProfile.objects.filter(id=self.request.user.id)
        return UserProfile.objects.none()

    @action(detail=False, methods=['get'])
    def me(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def history(self, request):
        """Returns the user's active posts (Lost Reports & Item Reports)."""
        user = request.user
        lost_reports = LostReport.objects.filter(student_email=user.email).order_by('-date_lost')
        item_reports = ItemReport.objects.filter(reporter_email=user.email).order_by('-submitted_at')
        
        return Response({
            'lost_reports': LostReportSerializer(lost_reports, many=True).data,
            'found_reports': ItemReportSerializer(item_reports, many=True).data
        })

    @action(detail=False, methods=['delete'])
    def delete_account(self, request):
        """Standard cascading delete handled by Django or manually mapped."""
        user = request.user
        # Optional: Delete associated user records (if not cascaded by DB implicitly).
        # We delete reports tied to the user email:
        LostReport.objects.filter(student_email=user.email).delete()
        ItemReport.objects.filter(reporter_email=user.email).delete()
        PickupSchedule.objects.filter(student_email=user.email).delete()
        
        user.delete()
        return Response({'message': 'Account and associated data deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class FoundItemViewSet(viewsets.ModelViewSet):
    """
    Public board of found items.
    Users can READ. Admins can CREATE, UPDATE, DELETE.
    """
    queryset = FoundItem.objects.all().order_by('-date_found')
    serializer_class = FoundItemSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsAdminProfile]
        return [permission() for permission in permission_classes]



class LostReportViewSet(viewsets.ModelViewSet):
    queryset = LostReport.objects.all().order_by('-date_lost')
    serializer_class = LostReportSerializer

    def perform_create(self, serializer):
        serializer.save()


class ItemReportViewSet(viewsets.ModelViewSet):
    queryset = ItemReport.objects.all().order_by('-submitted_at')
    serializer_class = ItemReportSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsAdminProfile]
        return [permission() for permission in permission_classes]


class PickupScheduleViewSet(viewsets.ModelViewSet):
    queryset = PickupSchedule.objects.all().order_by('-created_at')
    serializer_class = PickupScheduleSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsAdminProfile]
        return [permission() for permission in permission_classes]


class ClaimRequestViewSet(viewsets.ModelViewSet):
    queryset = ClaimRequest.objects.all().order_by('-created_at')
    serializer_class = ClaimRequestSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsAdminProfile]
        return [permission() for permission in permission_classes]
