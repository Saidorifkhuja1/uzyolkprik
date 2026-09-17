from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import AdminProfile
from .forms import AdminUserCreationForm, AdminUserChangeForm

# Standart User adminni qayta ro'yxatdan o'tkazish
admin.site.unregister(User)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Superuser uchun yangi foydalanuvchi yaratish va tahrirlash paneli.
    Yangi foydalanuvchi yaratish sahifasida (Add User) va tahrirlashda
    status va bo'limlar ruxsatlari ptichkalari bevosita ko'rinadi.
    """
    add_form = AdminUserCreationForm
    form = AdminUserChangeForm

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "username",
                "first_name",
                "last_name",
                "password1",
                "password2",
                "can_edit_site_settings",
                "can_edit_home_content",
                "can_edit_leaders",
                "can_edit_announcements",
                "can_edit_korxona_ustavi",
                "can_edit_tashkiliy_tuzilma",
                "can_edit_katalog",
                "can_edit_nomenklatura",
                "can_edit_narx_navo",
                "can_edit_vacancies",
                "can_edit_filiallar",
                "can_edit_contact",
            ),
        }),
    )

    fieldsets = (
        ("Foydalanuvchi hisobi", {
            "fields": ("username", "password", "new_password"),
        }),
        ("Shaxsiy ma'lumotlar", {
            "fields": ("first_name", "last_name", "email"),
        }),
        ("Status va Roli", {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
            ),
        }),
        ("Status — Bo'limlar bo'yicha ruxsatlar (Keraklisiga ptichka qo'ying)", {
            "description": (
                "Xodimga ruxsat beriladigan bo'limlarni tanlang. "
                "Foydalanuvchi faqat ptichka qo'yilgan bo'limlarni ko'ra oladi va o'zgartira oladi:"
            ),
            "fields": (
                "can_edit_site_settings",
                "can_edit_home_content",
                "can_edit_leaders",
                "can_edit_announcements",
                "can_edit_korxona_ustavi",
                "can_edit_tashkiliy_tuzilma",
                "can_edit_katalog",
                "can_edit_nomenklatura",
                "can_edit_narx_navo",
                "can_edit_vacancies",
                "can_edit_filiallar",
                "can_edit_contact",
            ),
        }),
        ("Muhim sanalar", {
            "classes": ("collapse",),
            "fields": ("last_login", "date_joined"),
        }),
    )

    list_display = (
        "username",
        "first_name",
        "last_name",
        "is_staff",
        "is_superuser",
        "get_allowed_sections",
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("admin_profile")

    def get_allowed_sections(self, obj):
        if obj.is_superuser:
            return "👑 Barcha bo'limlar (Superuser)"
        try:
            profile = getattr(obj, "admin_profile", None)
            if not profile:
                profile = AdminProfile.objects.filter(user=obj).first()
            if not profile:
                return "❌ Ruxsat berilmagan"

            LABEL_MAP = {
                "can_edit_site_settings": "Sayt sozlamalari",
                "can_edit_home_content": "Bosh sahifa",
                "can_edit_leaders": "Rahbariyat",
                "can_edit_announcements": "E'lonlar",
                "can_edit_korxona_ustavi": "Korxona ustavi",
                "can_edit_tashkiliy_tuzilma": "Tuzilma",
                "can_edit_katalog": "Katalog",
                "can_edit_nomenklatura": "Nomenklatura",
                "can_edit_narx_navo": "Narx-navo",
                "can_edit_vacancies": "Bo'sh ish o'rinlari",
                "can_edit_filiallar": "Filiallar",
                "can_edit_contact": "Qayta aloqa",
                "can_edit_elonlar": "Mahsulotlar",
            }

            perms = profile.get_permissions_dict()
            active = [LABEL_MAP.get(k, k) for k, v in perms.items() if v]
            if not active:
                return "❌ Ruxsat berilmagan"
            if len(active) <= 3:
                return ", ".join(active)
            return ", ".join(active[:3]) + f" (+{len(active)-3} ta)"
        except Exception:
            return "-"

    def save_model(self, request, obj, form, change):
        from .forms import PERMISSION_FIELDS

        has_any_perm = any(
            form.cleaned_data.get(field_name, False)
            for field_name, _ in PERMISSION_FIELDS
        )
        if has_any_perm and not obj.is_superuser:
            obj.is_staff = True

        super().save_model(request, obj, form, change)

        profile, _ = AdminProfile.objects.get_or_create(user=obj)
        for field_name, _ in PERMISSION_FIELDS:
            if field_name in form.cleaned_data:
                setattr(profile, field_name, bool(form.cleaned_data.get(field_name, False)))
        profile.save()

        if has_any_perm and not obj.is_superuser and not obj.is_staff:
            obj.is_staff = True
            obj.save(update_fields=["is_staff"])

    get_allowed_sections.short_description = "Ruxsat etilgan bo'limlar"

    class Media:
        css = {
            "all": ("accounts/css/admin_permissions.css",)
        }


@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    """Foydalanuvchilar ruxsatlarini umumiy ko'rish va boshqarish paneli."""

    class Media:
        css = {
            "all": ("accounts/css/admin_permissions.css",)
        }

    list_display = ("user", "get_username", "get_permissions_summary")
    search_fields = ("user__username", "user__first_name", "user__last_name")
    list_filter = (
        "can_edit_site_settings",
        "can_edit_home_content",
        "can_edit_leaders",
        "can_edit_announcements",
        "can_edit_korxona_ustavi",
        "can_edit_tashkiliy_tuzilma",
        "can_edit_katalog",
        "can_edit_nomenklatura",
        "can_edit_narx_navo",
        "can_edit_vacancies",
        "can_edit_filiallar",
        "can_edit_contact",
        "can_edit_elonlar",
    )

    fieldsets = (
        ("Foydalanuvchi", {
            "fields": ("user",),
        }),
        ("Status — Bo'limlar bo'yicha ruxsatlar", {
            "description": "Foydalanuvchiga ruxsat berilgan bo'limlarni belgilang (ptichka qo'ying).",
            "fields": (
                "can_edit_site_settings",
                "can_edit_home_content",
                "can_edit_leaders",
                "can_edit_announcements",
                "can_edit_korxona_ustavi",
                "can_edit_tashkiliy_tuzilma",
                "can_edit_katalog",
                "can_edit_nomenklatura",
                "can_edit_narx_navo",
                "can_edit_vacancies",
                "can_edit_filiallar",
                "can_edit_contact",
                "can_edit_elonlar",
            ),
        }),
    )

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = "Username"

    def get_permissions_summary(self, obj):
        perms = obj.get_permissions_dict()
        active = [k.replace("can_edit_", "").replace("_", " ").title() for k, v in perms.items() if v]
        if not active:
            return "Ruxsat yo'q"
        return ", ".join(active[:4]) + ("..." if len(active) > 4 else "")
    get_permissions_summary.short_description = "Ruxsatlar"
