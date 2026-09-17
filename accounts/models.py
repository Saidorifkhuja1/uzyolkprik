from django.conf import settings
from django.db import models


class AdminProfile(models.Model):
    """
    Har bir foydalanuvchiga admin paneldagi bo'limlar uchun ruxsatlar beradi.
    Superuser Django admin panelda yaratadi va ruxsatlarni belgilaydi.
    """
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="admin_profile",
        verbose_name="Foydalanuvchi",
    )

    # ── Bo'limlar bo'yicha ruxsatlar ──────────────────────────────
    can_edit_site_settings = models.BooleanField(
        default=False, verbose_name="Sayt sozlamalari"
    )
    can_edit_home_content = models.BooleanField(
        default=False, verbose_name="Bosh sahifa kontenti"
    )
    can_edit_leaders = models.BooleanField(
        default=False, verbose_name="Rahbariyat"
    )
    can_edit_announcements = models.BooleanField(
        default=False, verbose_name="E'lonlar (Announcement)"
    )
    can_edit_korxona_ustavi = models.BooleanField(
        default=False, verbose_name="Korxona ustavi"
    )
    can_edit_tashkiliy_tuzilma = models.BooleanField(
        default=False, verbose_name="Tashkiliy tuzilma"
    )
    can_edit_katalog = models.BooleanField(
        default=False, verbose_name="Katalog"
    )
    can_edit_nomenklatura = models.BooleanField(
        default=False, verbose_name="Nomenklatura"
    )
    can_edit_narx_navo = models.BooleanField(
        default=False, verbose_name="Narx-navo"
    )
    can_edit_vacancies = models.BooleanField(
        default=False, verbose_name="Bo'sh ish o'rinlari"
    )
    can_edit_filiallar = models.BooleanField(
        default=False, verbose_name="Filiallar"
    )
    can_edit_contact = models.BooleanField(
        default=False, verbose_name="Qayta aloqa"
    )
    can_edit_elonlar = models.BooleanField(
        default=False, verbose_name="E'lonlar (product)"
    )

    class Meta:
        verbose_name = "Admin profil"
        verbose_name_plural = "Admin profillar"

    def __str__(self):
        return f"{self.user.username} — ruxsatlar"

    def get_permissions_dict(self):
        """Barcha ruxsatlarni dict formatda qaytaradi."""
        return {
            "can_edit_site_settings": self.can_edit_site_settings,
            "can_edit_home_content": self.can_edit_home_content,
            "can_edit_leaders": self.can_edit_leaders,
            "can_edit_announcements": self.can_edit_announcements,
            "can_edit_korxona_ustavi": self.can_edit_korxona_ustavi,
            "can_edit_tashkiliy_tuzilma": self.can_edit_tashkiliy_tuzilma,
            "can_edit_katalog": self.can_edit_katalog,
            "can_edit_nomenklatura": self.can_edit_nomenklatura,
            "can_edit_narx_navo": self.can_edit_narx_navo,
            "can_edit_vacancies": self.can_edit_vacancies,
            "can_edit_filiallar": self.can_edit_filiallar,
            "can_edit_contact": self.can_edit_contact,
            "can_edit_elonlar": self.can_edit_elonlar,
        }

    def sync_django_permissions(self):
        """
        Foydalanuvchiga tegishli Django Model ruxsatlarini beradi yoki olib tashlaydi,
        va admin panelga kira olishi uchun is_staff holatini sozlaydi.
        """
        if self.user.is_superuser:
            return

        from django.contrib.auth.models import Permission
        from django.contrib.contenttypes.models import ContentType

        model_map = {
            "can_edit_site_settings": ["sitesettings"],
            "can_edit_home_content": ["homecontent", "homecapability", "hometask"],
            "can_edit_leaders": ["leader"],
            "can_edit_announcements": ["announcement", "announcementitem"],
            "can_edit_korxona_ustavi": ["korxonaustavi"],
            "can_edit_tashkiliy_tuzilma": ["tashkiliytuzilma"],
            "can_edit_katalog": ["katalogpage", "catalogitem"],
            "can_edit_nomenklatura": ["nomenklaturapage"],
            "can_edit_narx_navo": ["narxnavoproduct"],
            "can_edit_vacancies": ["boshishorinlari", "boshishorinlariproduct"],
            "can_edit_filiallar": ["filiallarpage", "filialitem"],
            "can_edit_contact": ["qaytaaloqa"],
            "can_edit_elonlar": ["elonlarproduct"],
        }

        has_any_perm = False
        user = self.user

        for field_name, model_names in model_map.items():
            is_allowed = getattr(self, field_name, False)
            if is_allowed:
                has_any_perm = True
            for m_name in model_names:
                try:
                    ct = ContentType.objects.get(app_label="uzyol", model=m_name)
                    perms = Permission.objects.filter(content_type=ct)
                    if is_allowed:
                        user.user_permissions.add(*perms)
                    else:
                        user.user_permissions.remove(*perms)
                except ContentType.DoesNotExist:
                    pass

        should_be_staff = has_any_perm
        if user.is_staff != should_be_staff and not user.is_superuser:
            user.is_staff = should_be_staff
            user.save(update_fields=["is_staff"])

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        try:
            self.sync_django_permissions()
        except Exception:
            pass


from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_admin_profile_for_new_user(sender, instance, created, **kwargs):
    if created:
        AdminProfile.objects.get_or_create(user=instance)

