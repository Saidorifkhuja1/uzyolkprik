from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth.models import User
from .models import AdminProfile

PERMISSION_FIELDS = [
    ("can_edit_site_settings", "Sayt sozlamalari"),
    ("can_edit_home_content", "Bosh sahifa kontenti"),
    ("can_edit_leaders", "Rahbariyat"),
    ("can_edit_announcements", "E'lonlar"),
    ("can_edit_korxona_ustavi", "Korxona ustavi"),
    ("can_edit_tashkiliy_tuzilma", "Tashkiliy tuzilma"),
    ("can_edit_katalog", "Katalog"),
    ("can_edit_nomenklatura", "Nomenklatura"),
    ("can_edit_narx_navo", "Narx-navo"),
    ("can_edit_vacancies", "Bo'sh ish o'rinlari"),
    ("can_edit_filiallar", "Filiallar"),
    ("can_edit_contact", "Qayta aloqa"),
]


class AdminUserCreationForm(UserCreationForm):
    """
    Superuser uchun yangi foydalanuvchi yaratish sahifasi formasi.
    Bir sahifaning o'zida login, parol, ism-familiya va
    admin panel bo'limlariga ruxsat beruvchi bo'sh katakchalar ko'rinadi.
    """
    first_name = forms.CharField(max_length=150, required=False, label="Ism")
    last_name = forms.CharField(max_length=150, required=False, label="Familiya")

    can_edit_site_settings = forms.BooleanField(required=False, label="Sayt sozlamalari")
    can_edit_home_content = forms.BooleanField(required=False, label="Bosh sahifa kontenti")
    can_edit_leaders = forms.BooleanField(required=False, label="Rahbariyat")
    can_edit_announcements = forms.BooleanField(required=False, label="E'lonlar")
    can_edit_korxona_ustavi = forms.BooleanField(required=False, label="Korxona ustavi")
    can_edit_tashkiliy_tuzilma = forms.BooleanField(required=False, label="Tashkiliy tuzilma")
    can_edit_katalog = forms.BooleanField(required=False, label="Katalog")
    can_edit_nomenklatura = forms.BooleanField(required=False, label="Nomenklatura")
    can_edit_narx_navo = forms.BooleanField(required=False, label="Narx-navo")
    can_edit_vacancies = forms.BooleanField(required=False, label="Bo'sh ish o'rinlari")
    can_edit_filiallar = forms.BooleanField(required=False, label="Filiallar")
    can_edit_contact = forms.BooleanField(required=False, label="Qayta aloqa")

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "first_name", "last_name")

    def save(self, commit=True):
        user = super().save(commit=False)
        user.first_name = self.cleaned_data.get("first_name", "")
        user.last_name = self.cleaned_data.get("last_name", "")
        user.is_active = True

        has_any_perm = any(
            self.cleaned_data.get(field_name, False)
            for field_name, _ in PERMISSION_FIELDS
        )
        if has_any_perm:
            user.is_staff = True

        def _apply_permissions():
            if user.pk:
                profile, _ = AdminProfile.objects.get_or_create(user=user)
                for field_name, _ in PERMISSION_FIELDS:
                    setattr(profile, field_name, bool(self.cleaned_data.get(field_name, False)))
                profile.save()
                if has_any_perm and not user.is_staff:
                    user.is_staff = True
                    user.save(update_fields=["is_staff"])

        if commit:
            user.save()
            _apply_permissions()
            user.refresh_from_db()

        self.save_m2m = _apply_permissions
        return user


class AdminUserChangeForm(UserChangeForm):
    """
    Foydalanuvchini tahrirlash formasi.
    Status va bo'limlar ruxsatlarini bir sahifada saqlaydi va sinxronlaydi.
    """
    new_password = forms.CharField(
        label="Yangi parol (o'zgartirish uchun)",
        required=False,
        widget=forms.PasswordInput(attrs={
            "placeholder": "Parolni o'zgartirish uchun yangi parol yozing",
            "autocomplete": "new-password",
        }),
        help_text="Foydalanuvchi parolini o'zgartirish kerak bo'lsa, yangi parol yozing. Bo'sh qoldirilsa, eski parol saqlanadi.",
    )

    can_edit_site_settings = forms.BooleanField(required=False, label="Sayt sozlamalari")
    can_edit_home_content = forms.BooleanField(required=False, label="Bosh sahifa kontenti")
    can_edit_leaders = forms.BooleanField(required=False, label="Rahbariyat")
    can_edit_announcements = forms.BooleanField(required=False, label="E'lonlar")
    can_edit_korxona_ustavi = forms.BooleanField(required=False, label="Korxona ustavi")
    can_edit_tashkiliy_tuzilma = forms.BooleanField(required=False, label="Tashkiliy tuzilma")
    can_edit_katalog = forms.BooleanField(required=False, label="Katalog")
    can_edit_nomenklatura = forms.BooleanField(required=False, label="Nomenklatura")
    can_edit_narx_navo = forms.BooleanField(required=False, label="Narx-navo")
    can_edit_vacancies = forms.BooleanField(required=False, label="Bo'sh ish o'rinlari")
    can_edit_filiallar = forms.BooleanField(required=False, label="Filiallar")
    can_edit_contact = forms.BooleanField(required=False, label="Qayta aloqa")

    class Meta(UserChangeForm.Meta):
        model = User
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            try:
                profile = self.instance.admin_profile
            except Exception:
                profile, _ = AdminProfile.objects.get_or_create(user=self.instance)
            for field_name, _ in PERMISSION_FIELDS:
                if field_name in self.fields:
                    self.fields[field_name].initial = getattr(profile, field_name, False)

    def save(self, commit=True):
        user = super().save(commit=commit)

        new_pw = self.cleaned_data.get("new_password")
        if new_pw and new_pw.strip():
            user.set_password(new_pw.strip())
            if commit:
                user.save(update_fields=["password"])

        has_any_perm = any(
            self.cleaned_data.get(field_name, False)
            for field_name, _ in PERMISSION_FIELDS
        )

        def _apply_permissions():
            if user.pk:
                profile, _ = AdminProfile.objects.get_or_create(user=user)
                for field_name, _ in PERMISSION_FIELDS:
                    setattr(profile, field_name, bool(self.cleaned_data.get(field_name, False)))
                profile.save()
                if has_any_perm and not user.is_staff and not user.is_superuser:
                    user.is_staff = True
                    user.save(update_fields=["is_staff"])

        if commit and user.pk:
            _apply_permissions()

        self.save_m2m = _apply_permissions
        return user
