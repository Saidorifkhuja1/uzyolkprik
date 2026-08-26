from django.contrib import admin

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


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Brend", {"fields": ("name", "legal_name", "tagline")}),
        ("Rasmlar", {"fields": ("logo_url", "hero_image", "hero_image_url", "plant_image_url", "contact_image_url")}),
        ("Aloqa", {"fields": ("phone_primary", "phone_secondary", "email", "bank", "address", "hours", "map_url")}),
    )
    list_display = ("name", "email", "updated_at")
    search_fields = ("name",)



class CatalogItemInline(admin.TabularInline):
    model = CatalogItem
    extra = 1
    fields = ("title", "file", "file_url", "embed_url", "file_size", "order", "is_active")


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    inlines = (CatalogItemInline,)
    list_display = ("title", "slug", "type", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("type", "is_active")
    search_fields = ("title", "slug", "status", "document")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(CatalogItem)
class CatalogItemAdmin(admin.ModelAdmin):
    list_display = ("title", "page", "file", "file_url", "embed_url", "order", "is_active", "created_at")
    list_editable = ("order", "is_active")
    list_filter = ("is_active", "page")
    search_fields = ("title", "description")



@admin.register(Leader)
class LeaderAdmin(admin.ModelAdmin):
    list_display = ("name", "position", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "position", "born", "education")


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


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ("title", "published_at", "is_active")
    list_filter = ("is_active", "published_at")
    search_fields = ("title", "summary", "body")
    prepopulated_fields = {"slug": ("title",)}
