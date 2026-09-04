from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Announcement, HomeContent, Leader, NavigationItem, NarxNavoProduct, FilialItem, Page, SiteSettings
from .serializers import ErrorSerializer, PageSerializer, PagesResponseSerializer, SitePayloadSerializer


def _settings_payload(settings):
    from .models import HomeContent
    home = HomeContent.objects.first()

    legal_name = (home.hero_title if home and home.hero_title else "") or settings.legal_name
    tagline = (home.hero_tagline if home and home.hero_tagline else "") or settings.tagline
    hero_url = home.hero_image.url if (home and home.hero_image) else settings.get_hero_url()
    
    if home and home.tasks_image:
        plant_url = home.tasks_image.url
    elif home and home.hero_image:
        plant_url = home.hero_image.url
    else:
        plant_url = settings.plant_image_url

    phones = [phone for phone in (settings.phone_primary, settings.phone_secondary) if phone]
    return {
        "brand": {
            "name": settings.name,
            "legalName": legal_name,
            "tagline": tagline,
        },
        "assets": {
            "logo": settings.logo_url,
            "hero": hero_url,
            "plant": plant_url,
            "contact": settings.contact_image_url,
            "leaders": [
                leader.get_image_url()
                for leader in Leader.objects.filter(is_active=True).order_by("order", "id")
                if leader.get_image_url()
            ],
        },
        "contact": {
            "phones": phones,
            "email": settings.email,
            "bank": settings.bank,
            "address": settings.address,
            "hours": settings.hours,
            "map": settings.map_url,
        },
    }


def _navigation_payload():
    items = []
    parents = NavigationItem.objects.filter(parent__isnull=True, is_active=True).prefetch_related("children")
    for item in parents:
        row = {"label": item.label, "slug": item.slug}
        children = [child for child in item.children.all() if child.is_active]
        if children:
            row["children"] = [{"label": child.label, "slug": child.slug} for child in children]
        items.append(row)
    return items


def _home_payload():
    home = HomeContent.objects.first()
    if home is None:
        return {
            "intro": "",
            "purpose": "",
            "tasks": [],
            "capabilities": [],
            "modelEyebrow": "Klaster Modeli",
            "modelTitle": "Loyihadan tayyor konstruksiyagacha yagona boshqaruv",
            "capabilitiesEyebrow": "Yoʻnalishlar",
            "capabilitiesTitle": "Koʻprik infratuzilmasi uchun asosiy xizmat bloklari",
            "workflowEyebrow": "Ish Oqimi",
            "workflowTitle": "Texnik qarordan amaliy natijagacha",
            "tasksEyebrow": "Vazifalar",
            "tasksTitle": "Klaster bajaradigan asosiy ishlar",
        }
    return {
        "intro": home.intro,
        "purpose": home.purpose,
        "tasks": [task.text for task in home.tasks.all()],
        "capabilities": [capability.title for capability in home.capabilities.all()],
        "modelEyebrow": home.model_eyebrow,
        "modelTitle": home.model_title,
        "capabilitiesEyebrow": home.capabilities_eyebrow,
        "capabilitiesTitle": home.capabilities_title,
        "workflowEyebrow": home.workflow_eyebrow,
        "workflowTitle": home.workflow_title,
        "tasksEyebrow": home.tasks_eyebrow,
        "tasksTitle": home.tasks_title,
    }


def _leader_payload(page):
    image_urls = [
        leader.get_image_url()
        for leader in Leader.objects.filter(is_active=True).order_by("order", "id")
        if leader.get_image_url()
    ]
    leaders = []
    for leader in Leader.objects.filter(is_active=True).order_by("order", "id"):
        img_url = leader.get_image_url()
        image_index = image_urls.index(img_url) if img_url in image_urls else None
        leaders.append(
            {
                "name": leader.name,
                "position": leader.position,
                "born": leader.born,
                "education": leader.education,
                "imageIndex": image_index,
            }
        )
    return {
        "slug": page.slug,
        "title": page.title,
        "type": page.type,
        "leaders": leaders,
    }


def _announcement_payload(page):
    announcement = Announcement.objects.filter(page=page, is_active=True).first()
    return {
        "slug": page.slug,
        "title": page.title,
        "type": page.type,
        "intro": announcement.intro if announcement else "",
        "items": [item.text for item in announcement.items.all()] if announcement else [],
        "email": announcement.email if announcement else "",
    }


def _catalog_items_payload(page):
    items = []
    for item in page.catalog_items.filter(is_active=True).order_by("order", "id"):
        items.append({
            "id": item.id,
            "title": item.title,
            "fileUrl": item.get_download_url(),
            "embedUrl": item.get_embed_url(),
            "description": item.description,
            "fileSize": item.file_size,
        })
    return items



def _page_payload(page):
    if page.type == Page.LEADERS:
        return _leader_payload(page)
    if page.type == Page.ANNOUNCEMENT:
        return _announcement_payload(page)

    payload = {
        "slug": page.slug,
        "title": page.title,
        "type": page.type,
        "content": page.content,
        "fileUrl": page.file.url if page.file else None,
        "imageUrl": page.image.url if page.image else None,
    }
    if page.status:
        payload["status"] = page.status
    if page.document:
        payload["document"] = page.document

    catalog_items = _catalog_items_payload(page)
    if catalog_items:
        payload["catalogItems"] = catalog_items

    # Narx-navo mahsulotlari
    if page.slug == "narx-navo":
        products = NarxNavoProduct.objects.filter(is_active=True).order_by("order", "id")
        payload["narxNavoProducts"] = [
            {
                "id": p.id,
                "name": p.name,
                "text": p.text,
                "fileUrl": p.file.url if p.file else None,
                "imageUrl": p.image.url if p.image else None,
            }
            for p in products
        ]

    # Filiallar ro'yxati
    if page.slug == "filiallar":
        filials = FilialItem.objects.filter(is_active=True).order_by("order", "id")
        payload["branches"] = [
            {
                "id": f.id,
                "name": f.name,
                "region": f.region,
                "director": f.director,
                "directorImageUrl": f.director_image.url if f.director_image else None,
                "description": f.description,
                "address": f.address,
                "imageUrl": f.image.url if f.image else None,
                "phone": f.phone,
                "tasks": f.tasks,
                "status": f.status,
                "fileUrl": f.file.url if f.file else None,
            }
            for f in filials
        ]

    return payload



def _get_payload():
    settings = SiteSettings.objects.first()
    if settings is None:
        return None

    payload = _settings_payload(settings)
    pages = [_page_payload(page) for page in Page.objects.filter(is_active=True)]
    payload.update(
        {
            "navigation": _navigation_payload(),
            "home": _home_payload(),
            "pages": pages,
        }
    )
    return payload


@swagger_auto_schema(
    method="get",
    operation_summary="Saytning to'liq kontenti",
    operation_description="Brend, navigatsiya, bosh sahifa va barcha sahifalar ma'lumotlarini qaytaradi.",
    responses={
        200: SitePayloadSerializer,
        503: ErrorSerializer,
    },
    tags=["Sayt"],
)
@api_view(["GET"])
def site_payload(_request):
    payload = _get_payload()
    if payload is None:
        return Response({"detail": "Site data has not been seeded"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    return Response(payload)


@swagger_auto_schema(
    method="get",
    operation_summary="Sahifalar ro'yxati",
    operation_description="Saytdagi barcha faol sahifalar ro'yxatini qaytaradi.",
    responses={
        200: PagesResponseSerializer,
        503: ErrorSerializer,
    },
    tags=["Sayt"],
)
@api_view(["GET"])
def pages(_request):
    payload = _get_payload()
    if payload is None:
        return Response({"detail": "Site data has not been seeded"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    return Response({"pages": payload.get("pages", [])})


@swagger_auto_schema(
    method="get",
    operation_summary="Bitta sahifa kontenti",
    operation_description="Slug bo'yicha bitta sahifa ma'lumotlarini qaytaradi.",
    responses={
        200: PageSerializer,
        404: ErrorSerializer,
        503: ErrorSerializer,
    },
    tags=["Sayt"],
)
@api_view(["GET"])
def page_detail(_request, slug):
    payload = _get_payload()
    if payload is None:
        return Response({"detail": "Site data has not been seeded"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    for page in payload.get("pages", []):
        if page.get("slug") == slug:
            return Response(page)
    return Response({"detail": "Sahifa topilmadi"}, status=status.HTTP_404_NOT_FOUND)
