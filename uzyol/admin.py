from django.contrib import admin
from django.db import models
from django.forms.widgets import ClearableFileInput

class UzbekClearableFileInput(ClearableFileInput):
    clear_checkbox_label = "Oʻchirish"


from .models import (
    Announcement,
    AnnouncementItem,
    CatalogItem,
    HomeCapability,
    HomeContent,
    HomeTask,
    Leader,
    News,
    Page,
    SiteSettings,
    KorxonaUstavi,
    TashkiliyTuzilma,
    NarxNavo,
    NarxNavoProduct,
    ElonlarProduct,
    BoshIshOrinlariProduct,
    BoshIshOrinlari,
    QaytaAloqa,
    KatalogPage,
    NomenklaturaPage,
    FiliallarPage,
    FilialItem,
)


class HomeCapabilityInline(admin.TabularInline):
    model = HomeCapability
    extra = 1
    fields = ("title", "order")


class HomeTaskInline(admin.TabularInline):
    model = HomeTask
    extra = 1
    fields = ("text", "order")


@admin.register(HomeContent)
class HomeContentAdmin(admin.ModelAdmin):
    inlines = (HomeCapabilityInline, HomeTaskInline)
    fieldsets = (
        ("Bosh qism (Hero Section)", {"fields": ("hero_title", "hero_tagline", "hero_image", "intro")}),
        ("Klaster Modeli (Section 1)", {"fields": ("model_eyebrow", "model_title", "purpose")}),
        ("Yoʻnalishlar (Section 2)", {"fields": ("capabilities_eyebrow", "capabilities_title")}),
        ("Ish Oqimi (Section 3)", {"fields": ("workflow_eyebrow", "workflow_title")}),
        ("Vazifalar (Section 4)", {"fields": ("tasks_eyebrow", "tasks_title", "tasks_image")}),
    )
    formfield_overrides = {
        models.FileField: {'widget': UzbekClearableFileInput},
        models.ImageField: {'widget': UzbekClearableFileInput},
    }

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = self.get_queryset(request).first()
        if obj:
            from django.urls import reverse
            from django.shortcuts import redirect
            url = reverse(f"admin:uzyol_{self.model._meta.model_name}_change", args=[obj.pk])
            return redirect(url)
        return super().changelist_view(request, extra_context)


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Brend", {"fields": ("name", "legal_name", "tagline")}),
        ("Rasmlar", {"fields": ("logo_url", "hero_image", "hero_image_url", "plant_image_url", "contact_image_url")}),
        ("Aloqa", {"fields": ("phone_primary", "phone_secondary", "email", "bank", "address", "hours", "map_url")}),
    )
    list_display = ("name", "email", "updated_at")
    search_fields = ("name",)
    formfield_overrides = {
        models.FileField: {'widget': UzbekClearableFileInput},
        models.ImageField: {'widget': UzbekClearableFileInput},
    }

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = self.get_queryset(request).first()
        if obj:
            from django.urls import reverse
            from django.shortcuts import redirect
            url = reverse(f"admin:uzyol_{self.model._meta.model_name}_change", args=[obj.pk])
            return redirect(url)
        return super().changelist_view(request, extra_context)




class BaseSinglePageAdmin(admin.ModelAdmin):
    fields = ("title", "content", "file", "image")
    formfield_overrides = {
        models.FileField: {'widget': UzbekClearableFileInput},
        models.ImageField: {'widget': UzbekClearableFileInput},
    }

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = self.get_queryset(request).first()
        if obj:
            from django.urls import reverse
            from django.shortcuts import redirect
            url = reverse(f"admin:uzyol_{self.model._meta.model_name}_change", args=[obj.pk])
            return redirect(url)
        return super().changelist_view(request, extra_context)


@admin.register(KorxonaUstavi)
class KorxonaUstaviAdmin(BaseSinglePageAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(slug="korxona-ustavi")


@admin.register(TashkiliyTuzilma)
class TashkiliyTuzilmaAdmin(BaseSinglePageAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(slug="tashkiliy-tuzilma")



class NarxNavoCatalogItemAdmin(admin.ModelAdmin):
    """Narx-navo sahifasidagi mahsulotlar ro'yxati – alohida admin panel."""

    list_display = ("title", "file_size", "order", "is_active", "created_at")
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "description")
    ordering = ("order", "id")
    list_per_page = 50
    fieldsets = (
        ("Asosiy ma'lumot", {
            "fields": ("title", "description", "file_size", "order", "is_active")
        }),
        ("Fayl / Havola", {
            "fields": ("file", "file_url", "embed_url"),
            "description": "Faylni yuklang yoki tashqi havola kiriting."
        }),
    )
    formfield_overrides = {
        models.FileField: {'widget': UzbekClearableFileInput},
        models.ImageField: {'widget': UzbekClearableFileInput},
    }

    # ── Narx-navo sahifasiga bog'liq elementlarni ko'rsatish ──────────────
    def _get_narx_page(self):
        return Page.objects.filter(slug="narx-navo").first()

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        narx_page = self._get_narx_page()
        return qs.filter(page=narx_page) if narx_page else qs.none()

    # ── Yangi mahsulotni avtomatik narx-navo sahifasiga bog'lash ──────────
    def save_model(self, request, obj, form, change):
        if not change:
            narx_page = self._get_narx_page()
            if narx_page:
                obj.page = narx_page
        super().save_model(request, obj, form, change)

    # ── Har doim ro'yxatga qaytarish ──────────────────────────────────────
    def _redirect_to_list(self):
        from django.http import HttpResponseRedirect
        from django.urls import reverse
        return HttpResponseRedirect(reverse("admin:uzyol_catalogitem_changelist"))

    def response_add(self, request, obj, post_url_continue=None):
        # "Saqlash va yangisini qo'shish" tugmasi bundan mustasno
        if "_addanother" in request.POST:
            from django.contrib import messages
            messages.success(request, f'"{obj.title}" qo\'shildi.')
            from django.http import HttpResponseRedirect
            from django.urls import reverse
            return HttpResponseRedirect(reverse("admin:uzyol_catalogitem_add"))
        return self._redirect_to_list()

    def response_change(self, request, obj):
        if "_addanother" in request.POST:
            from django.http import HttpResponseRedirect
            from django.urls import reverse
            return HttpResponseRedirect(reverse("admin:uzyol_catalogitem_add"))
        if "_continue" in request.POST:
            from django.http import HttpResponseRedirect
            from django.urls import reverse
            return HttpResponseRedirect(
                reverse("admin:uzyol_catalogitem_change", args=[obj.pk])
            )
        return self._redirect_to_list()


admin.site.register(CatalogItem, NarxNavoCatalogItemAdmin)


@admin.register(NarxNavoProduct)
class NarxNavoProductAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active", "created_at")
    list_editable = ("is_active",)
    list_filter = ("is_active",)
    search_fields = ("name", "text")
    ordering = ("id",)
    list_per_page = 50
    fieldsets = (
        ("Asosiy ma'lumot", {
            "fields": ("name", "text", "image", "file", "is_active")
        }),
    )
    formfield_overrides = {
        models.FileField: {'widget': UzbekClearableFileInput},
        models.ImageField: {'widget': UzbekClearableFileInput},
    }



@admin.register(BoshIshOrinlari)
class BoshIshOrinlariAdmin(BaseSinglePageAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(slug="bosh-ish-orinlari")


@admin.register(QaytaAloqa)
class QaytaAloqaAdmin(BaseSinglePageAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(slug="qayta-aloqa")





@admin.register(Leader)
class LeaderAdmin(admin.ModelAdmin):
    fields = ("name", "position", "born", "education", "image", "image_url", "order", "is_active")
    list_display = ("name", "position", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "position", "born", "education")
    formfield_overrides = {
        models.FileField: {'widget': UzbekClearableFileInput},
        models.ImageField: {'widget': UzbekClearableFileInput},
    }


class AnnouncementItemInline(admin.TabularInline):
    model = AnnouncementItem
    extra = 1
    fields = ("text", "order")


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    inlines = (AnnouncementItemInline,)
    list_display = ("page", "email", "is_active")
    list_filter = ("is_active",)
    search_fields = ("page__title", "intro", "email")


# News admini o'chirildi (foydalanuvchi so'rovi bilan)


def _make_product_admin(fieldset_title="Asosiy ma'lumot"):
    """NarxNavoProduct bilan bir xil admin class factory."""
    class ProductAdmin(admin.ModelAdmin):
        list_display = ("name", "is_active", "created_at")
        list_editable = ("is_active",)
        list_filter = ("is_active",)
        search_fields = ("name", "text")
        ordering = ("id",)
        list_per_page = 50
        fieldsets = (
            (fieldset_title, {
                "fields": ("name", "text", "image", "file", "is_active")
            }),
        )
        formfield_overrides = {
            models.FileField: {'widget': UzbekClearableFileInput},
            models.ImageField: {'widget': UzbekClearableFileInput},
        }
    return ProductAdmin


@admin.register(ElonlarProduct)
class ElonlarProductAdmin(_make_product_admin("E'lon ma'lumotlari")):
    pass


@admin.register(BoshIshOrinlariProduct)
class BoshIshOrinlariProductAdmin(_make_product_admin("Ish o'rni ma'lumotlari")):
    pass


@admin.register(KatalogPage)
class KatalogPageAdmin(BaseSinglePageAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(slug="katalog")


@admin.register(NomenklaturaPage)
class NomenklaturaPageAdmin(BaseSinglePageAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(slug="nomenklatura")


@admin.register(FiliallarPage)
class FiliallarPageAdmin(BaseSinglePageAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(slug="filiallar")


@admin.register(FilialItem)
class FilialItemAdmin(admin.ModelAdmin):
    list_display = ("name", "region", "director", "director_image_preview", "phone", "status", "order", "is_active")
    list_editable = ("order", "is_active", "status")
    list_filter = ("is_active", "region", "status")
    search_fields = ("name", "region", "director", "description", "address", "phone", "tasks")
    ordering = ("order", "id")
    list_per_page = 50
    fieldsets = (
        ("Asosiy ma'lumotlar", {
            "fields": (
                "name",
                "region",
                "director",
                "director_image",
                "description",
                "address",
                "image",
                "phone",
                "tasks",
                "file",
                "status",
                "order",
                "is_active",
            )
        }),
    )
    formfield_overrides = {
        models.FileField: {'widget': UzbekClearableFileInput},
        models.ImageField: {'widget': UzbekClearableFileInput},
    }

    def director_image_preview(self, obj):
        if obj.director_image:
            from django.utils.html import format_html
            return format_html('<img src="{}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" />', obj.director_image.url)
        return "-"
    director_image_preview.short_description = "Direktor rasmi"


# Monkey patch: sidebar tartibini sozlash va narx-navo nomini o'zgartirish
original_get_app_list = admin.site.get_app_list

def get_app_list(request, app_label=None):
    app_list = original_get_app_list(request, app_label)

    model_order = [
        "homecontent",
        "korxonaustavi",
        "tashkiliytuzilma",
        "leader",
        "katalogpage",
        "nomenklaturapage",
        "narxnavoproduct",     # Narx-navo
        "boshishorinlari",
        "filialitem",          # Filiallar
        "qaytaaloqa",
        "announcement",
        "news",
        "sitesettings",
    ]

    for app in app_list:
        if app['app_label'] != 'uzyol':
            continue

        cleaned = []
        for model in app['models']:
            obj_name = model.get('object_name', '').lower()

            # narxnavo, catalogitem va filiallarpage ni sidebardan yashirish
            if obj_name in ('narxnavo', 'catalogitem', 'filiallarpage'):
                continue

            # narxnavoproduct → Narx-navo
            if obj_name == 'narxnavoproduct':
                model = dict(model)
                model['name'] = 'Narx-navo'

            cleaned.append(model)

        def get_sort_key(model_dict):
            name = model_dict.get('object_name', '').lower()
            return model_order.index(name) if name in model_order else len(model_order)

        cleaned.sort(key=get_sort_key)
        app['models'] = cleaned

    return app_list

admin.site.get_app_list = get_app_list
