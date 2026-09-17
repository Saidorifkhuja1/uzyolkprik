from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    SessionAuthentication subclass that disables CSRF enforcement for API endpoints.
    Allows frontend API calls (with credentials included) to function properly without
    conflicting with Django admin session cookies.
    """
    def enforce_csrf(self, request):
        return  # Do not enforce CSRF for API requests
