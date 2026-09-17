from rest_framework import serializers
from django.contrib.auth import authenticate


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        raw_username = data.get("username", "").strip()
        raw_password = data.get("password", "")

        user = authenticate(
            username=raw_username,
            password=raw_password,
        )
        if user is None:
            raise serializers.ValidationError("Login yoki parol noto'g'ri.")
        if not user.is_active:
            raise serializers.ValidationError("Bu hisob faol emas.")
        data["user"] = user
        return data


class PermissionsSerializer(serializers.Serializer):
    can_edit_site_settings = serializers.BooleanField()
    can_edit_home_content = serializers.BooleanField()
    can_edit_leaders = serializers.BooleanField()
    can_edit_announcements = serializers.BooleanField()
    can_edit_korxona_ustavi = serializers.BooleanField()
    can_edit_tashkiliy_tuzilma = serializers.BooleanField()
    can_edit_katalog = serializers.BooleanField()
    can_edit_nomenklatura = serializers.BooleanField()
    can_edit_narx_navo = serializers.BooleanField()
    can_edit_vacancies = serializers.BooleanField()
    can_edit_filiallar = serializers.BooleanField()
    can_edit_contact = serializers.BooleanField()
    can_edit_elonlar = serializers.BooleanField()


class ProfileSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    is_superuser = serializers.BooleanField()
    permissions = PermissionsSerializer()
