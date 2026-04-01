from rest_framework import permissions

class IsAdminProfile(permissions.BasePermission):
    """
    Custom permission to only allow UserProfiles with is_admin=True to access the view.
    """
    def has_permission(self, request, view):
        # request.user will be the UserProfile instance if EmailAuthentication succeeded
        return bool(request.user and getattr(request.user, 'is_admin', False))
