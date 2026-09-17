from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

UserModel = get_user_model()


class CaseInsensitiveModelBackend(ModelBackend):
    """
    Foydalanuvchi loginini katta-kichik harflarga sezgir bo'lmagan (case-insensitive)
    va chetki bo'shliqlarni tozalagan holda tekshiradi.
    Masalan: 'User', 'user', 'USER', ' user ' birdek to'g'ri ishlaydi.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        if not username or not password:
            return None

        clean_username = username.strip()
        try:
            user = UserModel.objects.filter(username__iexact=clean_username).first()
        except Exception:
            return None

        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
