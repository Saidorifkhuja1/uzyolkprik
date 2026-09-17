from django.contrib.auth import login as django_login, logout as django_logout
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import AdminProfile
from .serializers import LoginSerializer, ProfileSerializer


class LoginRateThrottle(AnonRateThrottle):
    """Login uchun maxsus throttle: soatiga 10 ta urinish."""
    scope = 'login'


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def login_view(request):
    """
    Foydalanuvchini login qiladi va JWT access + refresh tokenlarini qaytaradi.
    Shuningdek Django session'ga ham kirgizadi (Admin panelda qayta login so'ramasligi uchun).
    Rate limiting: soatiga 10 ta urinish.
    """
    # Login uchun rate limiting
    throttle = LoginRateThrottle()
    if not throttle.allow_request(request, None):
        return Response(
            {"detail": "Juda ko'p urinish. Keyinroq qayta urinib ko'ring."},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {"detail": serializer.errors.get("non_field_errors", ["Login yoki parol noto'g'ri."])[0]},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    user = serializer.validated_data["user"]
    refresh = RefreshToken.for_user(user)

    # AdminProfile bo'lmasa, yaratish
    profile, _ = AdminProfile.objects.get_or_create(user=user)

    # Django session orqali ham tizimga kiritish (Admin panelga o'tganda avtomatik ochiq bo'ladi)
    try:
        django_login(request._request if hasattr(request, "_request") else request, user)
    except Exception:
        pass

    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": _build_profile_data(user, profile),
    })


@api_view(["POST", "GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def logout_view(request):
    """
    Foydalanuvchini Django session'dan ham chiqaradi.
    Refresh token berilsa, uni qora ro'yxatga qo'shadi.
    """
    # Refresh tokenni qora ro'yxatga qo'shish (token blacklisting)
    refresh_token = request.data.get("refresh") if request.method == "POST" else None
    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            pass  # Token allaqachon muddati o'tgan yoki noto'g'ri bo'lsa ham chiqish amalga oshiriladi

    try:
        django_logout(request._request if hasattr(request, "_request") else request)
    except Exception:
        pass
    return Response({"detail": "Muvaffaqiyatli chiqildi."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """
    Joriy foydalanuvchining profili va ruxsatlarini qaytaradi.
    """
    user = request.user
    profile, _ = AdminProfile.objects.get_or_create(user=user)

    return Response(_build_profile_data(user, profile))


def _build_profile_data(user, profile):
    """Profil ma'lumotlarini dict formatda yaratadi."""
    return {
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name or "",
        "last_name": user.last_name or "",
        "is_superuser": user.is_superuser,
        "permissions": profile.get_permissions_dict(),
    }
