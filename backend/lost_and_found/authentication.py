from rest_framework import authentication
from rest_framework import exceptions
from .models import UserProfile

class EmailAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        email = request.headers.get('X-User-Email')
        if not email:
            return None

        try:
            user = UserProfile.objects.get(email=email)
        except UserProfile.DoesNotExist:
            raise exceptions.AuthenticationFailed('No such user')

        return (user, None)
