from django.contrib import admin
from django.db import models
from django.forms.widgets import ClearableFileInput

class UzbekClearableFileInput(ClearableFileInput):
    clear_checkbox_label = "Oʻchirish"


from .models import (
    CatalogItem,
    HomeCapability,
    HomeContent,
    HomeTask,
    Leader,
    Page,
    SiteSettings,
    KorxonaUstavi,
    TashkiliyTuzilma,
    Ishlarimiz,
    NarxNavoProduct,
    ElonlarProduct,
    BoshIshOrinlariProduct,
    QaytaAloqa,
    FilialItem,
    KatalogItem,
    NomenklaturaItem,
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
    list_display = ("title", "slug", "is_active")
    fields = ("title", "content", "file", "image")
    target_slug = ""
    formfield_overrides = {
        models.FileField: {'widget': UzbekClearableFileInput},
        models.ImageField: {'widget': UzbekClearableFileInput},
    }

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if self.target_slug:
            return qs.filter(slug=self.target_slug)
        return qs

    def save_model(self, request, obj, form, change):
        if self.target_slug and not obj.slug:
            obj.slug = self.target_slug
        super().save_model(request, obj, form, change)

    def has_add_permission(self, request):
        return not self.get_queryset(request).exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(KorxonaUstavi)
class KorxonaUstaviAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "is_active", "has_image", "has_file")
    list_editable = ("order", "is_active")
    fields = ("title", "content", "image", "file", "order", "is_active")
    ordering = ("order", "id")
    formfield_overrides = {
        models.FileField: {'widget': UzbekClearableFileInput},
        models.ImageField: {'widget': UzbekClearableFileInput},
    }

    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = "Rasm"

    def has_file(self, obj):
        return bool(obj.file)
    has_file.boolean = True
    has_file.short_description = "Fayl"

    def get_queryset(self, request):
        return super().get_queryset(request).filter(
            models.Q(type="korxona-ustavi") | models.Q(slug__startswith="korxona-ustavi-")
        ).exclude(slug="korxona-ustavi")

    def save_model(self, request, obj, form, change):
        obj.type = "korxona-ustavi"
        if not obj.slug or obj.slug == "korxona-ustavi":
            from django.utils.text import slugify
            base = slugify(obj.title) or "ustav"
            candidate = f"korxona-ustavi-{base}"
            counter = 1
            qs = Page.objects.exclude(pk=obj.pk) if change else Page.objects.all()
            while qs.filter(slug=candidate).exists():
                candidate = f"korxona-ustavi-{base}-{counter}"
                counter += 1
            obj.slug = candidate
        super().save_model(request, obj, form, change)

    def has_add_permission(self, request):
        return True

    def has_delete_permission(self, request, obj=None):
        return True


@admin.register(TashkiliyTuzilma)
class TashkiliyTuzilmaAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "is_active", "has_image", "has_file")
    list_editable = ("order", "is_active")
    fields = ("title", "content", "image", "file", "order", "is_active")
    ordering = ("order", "id")
    formfield_overrides = {
        models.FileField: {'widget': UzbekClearableFileInput},
        models.ImageField: {'widget': UzbekClearableFileInput},
    }

    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = "Rasm"

    def has_file(self, obj):
        return bool(obj.file)
    has_file.boolean = True
    has_file.short_description = "Fayl"

    def get_queryset(self, request):
        return super().get_queryset(request).filter(
            models.Q(type="tashkiliy-tuzilma") | models.Q(slug__startswith="tashkiliy-tuzilma-")
        ).exclude(slug="tashkiliy-tuzilma")

    def save_model(self, request, obj, form, change):
        obj.type = "tashkiliy-tuzilma"
        if not obj.slug or (obj.slug == "tashkiliy-tuzilma" and not change):
            from django.utils.text import slugify
            base = slugify(obj.title) or "bolim"
            if not Page.objects.filter(slug="tashkiliy-tuzilma").exists() and not change:
                obj.slug = "tashkiliy-tuzilma"
            else:
                candidate = f"tashkiliy-tuzilma-{base}"
                counter = 1
                qs = Page.objects.all()
                if change:
                    qs = qs.exclude(pk=obj.pk)
                while qs.filter(slug=candidate).exists():
                    candidate = f"tashkiliy-tuzilma-{base}-{counter}"
                    counter += 1
                obj.slug = candidate
        super().save_model(request, obj, form, change)

    def has_add_permission(self, request):
        return True

    def has_delete_permission(self, request, obj=None):
        return True


@admin.register(Ishlarimiz)
class IshlarimizAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "is_active", "has_image", "has_file")
    list_editable = ("order", "is_active")
    fields = ("title", "content", "image", "file", "order", "is_active")
    ordering = ("order", "id")
    formfield_overrides = {
        models.FileField: {'widget': UzbekClearableFileInput},
        models.ImageField: {'widget': UzbekClearableFileInput},
    }

    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = "Rasm"

    def has_file(self, obj):
        return bool(obj.file)
    has_file.boolean = True
    has_file.short_description = "Fayl"

    def get_queryset(self, request):
        return super().get_queryset(request).filter(
            models.Q(type="ishlarimiz") | models.Q(slug__startswith="ishlarimiz-")
        ).exclude(slug="ishlarimiz")

    def save_model(self, request, obj, form, change):
        obj.type = "ishlarimiz"
        if not obj.slug or obj.slug == "ishlarimiz":
            from django.utils.text import slugify
            base = slugify(obj.title) or "ish"
            candidate = f"ishlarimiz-{base}"
            counter = 1
            qs = Page.objects.all()
            if change:
                qs = qs.exclude(pk=obj.pk)
            while qs.filter(slug=candidate).exists():
                candidate = f"ishlarimiz-{base}-{counter}"
                counter += 1
            obj.slug = candidate
        super().save_model(request, obj, form, change)

    def has_add_permission(self, request):
        return True

    def has_delete_permission(self, request, obj=None):
        return True




@admin.register(KatalogItem)
class KatalogItemAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "is_active", "has_image", "has_file", "created_at")
    list_editable = ("order", "is_active")
    fields = ("title", "description", "file", "image", "order", "is_active")
    ordering = ("order", "id")
    formfield_overrides = {
        models.FileField: {'widget': UzbekClearableFileInput},
        models.ImageField: {'widget': UzbekClearableFileInput},
    }

    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = "Rasm"

    def has_file(self, obj):
        return bool(obj.file or obj.file_url)
    has_file.boolean = True
    has_file.short_description = "Fayl"

    def get_queryset(self, request):
        return super().get_queryset(request).filter(page__slug="katalog")

    def save_model(self, request, obj, form, change):
        if not obj.page_id:
            obj.page = Page.objects.filter(slug="katalog").first()
        super().save_model(request, obj, form, change)

    def has_add_permission(self, request):
        return True


@admin.register(NomenklaturaItem)
class NomenklaturaItemAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "is_active", "has_image", "has_file", "created_at")
    list_editable = ("order", "is_active")
    fields = ("title", "description", "file", "image", "order", "is_active")
    ordering = ("order", "id")
    formfield_overrides = {
        models.FileField: {'widget': UzbekClearableFileInput},
        models.ImageField: {'widget': UzbekClearableFileInput},
    }

    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = "Rasm"

    def has_file(self, obj):
        return bool(obj.file or obj.file_url)
    has_file.boolean = True
    has_file.short_description = "Fayl"

    def get_queryset(self, request):
        return super().get_queryset(request).filter(page__slug="nomenklatura")

    def save_model(self, request, obj, form, change):
        if not obj.page_id:
            obj.page = Page.objects.filter(slug="nomenklatura").first()
        super().save_model(request, obj, form, change)

    def has_add_permission(self, request):
        return True


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


@admin.register(QaytaAloqa)
class QaytaAloqaAdmin(BaseSinglePageAdmin):
    target_slug = "qayta-aloqa"


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
class ElonlarProductAdmin(_make_product_admin("Faoliyatimiz ma'lumotlari")):
    pass


@admin.register(BoshIshOrinlariProduct)
class BoshIshOrinlariProductAdmin(_make_product_admin("Ish o'rni ma'lumotlari")):
    pass


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


# Monkey patch: sidebar tartibini sozlash va nomlarni moslashtirish
original_get_app_list = admin.site.get_app_list

def get_app_list(request, app_label=None):
    app_list = original_get_app_list(request, app_label)

    model_order = [
        "homecontent",
        "sitesettings",
        "korxonaustavi",
        "tashkiliytuzilma",
        "ishlarimiz",
        "leader",
        "katalogitem",
        "nomenklaturaitem",
        "narxnavoproduct",
        "elonlarproduct",
        "boshishorinlariproduct",
        "filialitem",
        "qaytaaloqa",
    ]

    for app in app_list:
        if app['app_label'] != 'uzyol':
            continue

        cleaned = []
        for model in app['models']:
            obj_name = model.get('object_name', '').lower()

            # Yashiriladigan modellar
            if obj_name in (
                'narxnavo',
                'catalogitem',
                'filiallarpage',
                'katalogpage',
                'nomenklaturapage',
                'boshishorinlari',
                'announcement',
                'announcementitem',
                'news',
            ):
                continue

            # Nomlarni chiroyli ko'rsatish
            if obj_name == 'narxnavoproduct':
                model = dict(model)
                model['name'] = 'Narx-navo'
            elif obj_name == 'elonlarproduct':
                model = dict(model)
                model['name'] = 'Faoliyatimiz'
            elif obj_name == 'boshishorinlariproduct':
                model = dict(model)
                model['name'] = "Bo'sh ish o'rinlari"
            elif obj_name == 'katalogitem':
                model = dict(model)
                model['name'] = 'Katalog'
            elif obj_name == 'nomenklaturaitem':
                model = dict(model)
                model['name'] = 'Nomenklatura'

            cleaned.append(model)

        def get_sort_key(model_dict):
            name = model_dict.get('object_name', '').lower()
            return model_order.index(name) if name in model_order else len(model_order)

        cleaned.sort(key=get_sort_key)
        app['models'] = cleaned

    return app_list

admin.site.get_app_list = get_app_list
