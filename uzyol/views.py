from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    Announcement,
    AnnouncementItem,
    HomeContent,
    HomeCapability,
    HomeTask,
    Leader,
    NavigationItem,
    NarxNavoProduct,
    BoshIshOrinlariProduct,
    CatalogItem,
    FilialItem,
    Page,
    SiteSettings,
    ElonlarProduct,
)
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


def _serialize_leader(leader):
    img_url = leader.get_image_url()
    return {
        "id": leader.id,
        "name": leader.name,
        "position": leader.position,
        "born": leader.born or "",
        "education": leader.education or "",
        "imageUrl": img_url,
        "image": img_url,
        "order": leader.order,
        "is_active": leader.is_active,
    }


def _serialize_product(p):
    """Generic serializer for NarxNavoProduct and BoshIshOrinlariProduct."""
    img = p.image.url if p.image else None
    f = p.file.url if p.file else None
    return {
        "id": p.id,
        "name": p.name,
        "text": p.text or "",
        "imageUrl": img,
        "image": img,
        "fileUrl": f,
        "file": f,
        "order": p.order,
        "is_active": p.is_active,
    }


_serialize_narx_navo = _serialize_product
_serialize_vacancy = _serialize_product


def _serialize_catalog_item(item):
    f_url = item.get_download_url()
    emb_url = item.get_embed_url()
    return {
        "id": item.id,
        "pageSlug": item.page.slug if item.page else None,
        "title": item.title,
        "description": item.description or "",
        "fileUrl": f_url,
        "file": f_url,
        "embedUrl": emb_url,
        "fileSize": item.file_size or "",
        "order": item.order,
        "is_active": item.is_active,
    }


def _leader_payload(page):
    leaders = Leader.objects.filter(is_active=True).order_by("order", "id")
    image_urls = [
        leader.get_image_url()
        for leader in leaders
        if leader.get_image_url()
    ]
    leader_rows = []
    for leader in leaders:
        row = _serialize_leader(leader)
        img_url = leader.get_image_url()
        row["imageIndex"] = image_urls.index(img_url) if img_url in image_urls else None
        leader_rows.append(row)

    return {
        "slug": page.slug,
        "title": page.title,
        "type": page.type,
        "leaders": leader_rows,
    }



def _serialize_elon(e):
    image_url = e.image.url if e.image else None
    file_url = e.file.url if e.file else None
    return {
        "id": e.id,
        "name": e.name,
        "text": e.text or "",
        "imageUrl": image_url,
        "image": image_url,
        "fileUrl": file_url,
        "file": file_url,
        "order": e.order,
        "is_active": e.is_active,
        "created_at": e.created_at.isoformat() if e.created_at else None,
    }


def _serialize_filial(f):
    img_url = f.image.url if f.image else None
    dir_img_url = f.director_image.url if f.director_image else None
    file_url = f.file.url if f.file else None
    return {
        "id": f.id,
        "name": f.name,
        "region": f.region or "",
        "director": f.director or "",
        "directorImageUrl": dir_img_url,
        "directorImage": dir_img_url,
        "description": f.description or "",
        "address": f.address or "",
        "imageUrl": img_url,
        "image": img_url,
        "phone": f.phone or "",
        "tasks": f.tasks or "",
        "status": f.status or "Faol",
        "fileUrl": file_url,
        "file": file_url,
        "order": f.order,
        "is_active": f.is_active,
        "created_at": f.created_at.isoformat() if f.created_at else None,
    }


def _elonlar_list_payload(user=None):
    can_see_all = user and (_check_perm(user, "can_edit_elonlar") or _check_perm(user, "can_edit_announcements"))
    if can_see_all:
        elonlar = ElonlarProduct.objects.all().order_by("-id")
    else:
        elonlar = ElonlarProduct.objects.filter(is_active=True).order_by("-id")
    return [_serialize_elon(e) for e in elonlar]


def _announcement_payload(page):
    announcement = Announcement.objects.filter(page=page, is_active=True).first()
    return {
        "slug": page.slug,
        "title": page.title,
        "type": page.type,
        "intro": announcement.intro if announcement else "",
        "items": [item.text for item in announcement.items.all()] if announcement else [],
        "email": announcement.email if announcement else "",
        "elonlarList": _elonlar_list_payload(),
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
        payload["branches"] = [_serialize_filial(f) for f in filials]

    # Bo'sh ish o'rinlari
    if page.slug == "bosh-ish-orinlari":
        vacancies = BoshIshOrinlariProduct.objects.filter(is_active=True).order_by("order", "id")
        payload["vacancies"] = [_serialize_vacancy(v) for v in vacancies]

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


def _check_page_permission(user, slug):
    if not user or not user.is_authenticated:
        return False
    if user.is_superuser:
        return True
    profile = getattr(user, "admin_profile", None)
    if not profile:
        return False

    slug_perm_map = {
        "korxona-ustavi": profile.can_edit_korxona_ustavi,
        "tashkiliy-tuzilma": profile.can_edit_tashkiliy_tuzilma,
        "katalog": profile.can_edit_katalog,
        "nomenklatura": profile.can_edit_nomenklatura,
        "narx-navo": profile.can_edit_narx_navo,
        "bosh-ish-orinlari": profile.can_edit_vacancies,
        "filiallar": profile.can_edit_filiallar,
        "qayta-aloqa": profile.can_edit_contact,
        "elonlar": profile.can_edit_elonlar or profile.can_edit_announcements,
        "rahbariyat": profile.can_edit_leaders,
    }
    return bool(slug_perm_map.get(slug, False))


@swagger_auto_schema(
    methods=["get"],
    operation_summary="Bitta sahifa kontenti",
    operation_description="Slug bo'yicha bitta sahifa ma'lumotlarini qaytaradi.",
    responses={
        200: PageSerializer,
        404: ErrorSerializer,
        503: ErrorSerializer,
    },
    tags=["Sayt"],
)
@api_view(["GET", "PATCH"])
def page_detail(request, slug):
    try:
        page = Page.objects.get(slug=slug, is_active=True)
    except Page.DoesNotExist:
        return Response({"detail": "Sahifa topilmadi"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(_page_payload(page))

    # PATCH
    if not _check_page_permission(request.user, slug):
        return Response(
            {"detail": "Sizda ushbu sahifani tahrirlash huquqi mavjud emas."},
            status=status.HTTP_403_FORBIDDEN,
        )

    if "title" in request.data:
        title = request.data.get("title", "").strip()
        if title:
            page.title = title

    if "content" in request.data:
        page.content = request.data.get("content", "").strip()

    if "status" in request.data:
        page.status = request.data.get("status", "").strip()

    if "document" in request.data:
        page.document = request.data.get("document", "").strip()

    if "file" in request.FILES:
        page.file = request.FILES.get("file")
    elif request.data.get("remove_file") in ("true", "1", True):
        page.file = None

    if "image" in request.FILES:
        page.image = request.FILES.get("image")
    elif request.data.get("remove_image") in ("true", "1", True):
        page.image = None

    page.save()
    return Response(_page_payload(page))


@api_view(["GET", "POST"])
def elonlar_list_create(request):
    """
    GET: Barcha faol e'lonlar ro'yxatini qaytaradi.
    POST: Yangi e'lon yaratadi (ruxsati bor foydalanuvchilar uchun).
    """
    if request.method == "GET":
        return Response({"results": _elonlar_list_payload(request.user)})

    if not _check_perm(request.user, "can_edit_elonlar") and not _check_perm(request.user, "can_edit_announcements"):
        return Response(
            {"detail": "Sizda e'lon qo'shish huquqi mavjud emas."},
            status=status.HTTP_403_FORBIDDEN,
        )

    name = request.data.get("name", "").strip()
    if not name:
        return Response(
            {"detail": "E'lon nomi (sarlavhasi) kiritilishi shart."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    text = request.data.get("text", "").strip()
    image = request.FILES.get("image")
    file = request.FILES.get("file")
    order = request.data.get("order", 0)
    try:
        order = int(order)
    except (ValueError, TypeError):
        order = 0

    is_active = True
    if "is_active" in request.data:
        is_active = request.data.get("is_active") in ("true", "1", True, "True")

    elon = ElonlarProduct.objects.create(
        name=name,
        text=text,
        image=image,
        file=file,
        order=order,
        is_active=is_active,
    )
    return Response(_serialize_elon(elon), status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def elonlar_detail_update_delete(request, pk):
    """
    GET: Bitta e'lon ma'lumotlari.
    PUT/PATCH: E'lonni tahrirlash (ruxsati bor xodimlar uchun).
    DELETE: E'lonni o'chirish (ruxsati bor xodimlar uchun).
    """
    try:
        elon = ElonlarProduct.objects.get(pk=pk)
    except ElonlarProduct.DoesNotExist:
        return Response({"detail": "E'lon topilmadi."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(_serialize_elon(elon))

    if not _check_perm(request.user, "can_edit_elonlar") and not _check_perm(request.user, "can_edit_announcements"):
        return Response(
            {"detail": "Sizda e'lonni o'zgartirish yoki o'chirish huquqi mavjud emas."},
            status=status.HTTP_403_FORBIDDEN,
        )

    if request.method == "DELETE":
        elon.delete()
        return Response({"detail": "E'lon muvaffaqiyatli o'chirildi.", "id": pk})

    # PUT / PATCH
    if "name" in request.data:
        name = request.data.get("name", "").strip()
        if not name:
            return Response(
                {"detail": "E'lon nomi bo'sh bo'lishi mumkin emas."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        elon.name = name

    if "text" in request.data:
        elon.text = request.data.get("text", "").strip()

    if "order" in request.data:
        try:
            elon.order = int(request.data.get("order", 0))
        except (ValueError, TypeError):
            pass

    if "is_active" in request.data:
        elon.is_active = request.data.get("is_active") in ("true", "1", True, "True")

    if "image" in request.FILES:
        elon.image = request.FILES.get("image")
    elif request.data.get("remove_image") in ("true", "1", True):
        elon.image = None

    if "file" in request.FILES:
        elon.file = request.FILES.get("file")
    elif request.data.get("remove_file") in ("true", "1", True):
        elon.file = None

    elon.save()
    return Response(_serialize_elon(elon))


@api_view(["GET", "POST"])
def filiallar_list_create(request):
    """
    GET: Filiallar ro'yxati (xodimlar uchun barcha filiallar, boshqalar uchun faol bo'lganlari).
    POST: Yangi filial qo'shish (can_edit_filiallar yoki superuser).
    """
    if request.method == "GET":
        can_manage = _check_filiallar_permission(request.user)
        qs = FilialItem.objects.all() if can_manage else FilialItem.objects.filter(is_active=True)
        return Response({"results": [_serialize_filial(f) for f in qs.order_by("order", "id")]})

    if not _check_filiallar_permission(request.user):
        return Response(
            {"detail": "Sizda filiallar bo'limini o'zgartirish huquqi mavjud emas."},
            status=status.HTTP_403_FORBIDDEN,
        )

    name = request.data.get("name", "").strip()
    if not name:
        return Response({"detail": "Filial nomi kiritilishi shart."}, status=status.HTTP_400_BAD_REQUEST)

    order = request.data.get("order", 0)
    try:
        order = int(order)
    except (ValueError, TypeError):
        order = 0

    is_active = True
    if "is_active" in request.data:
        is_active = request.data.get("is_active") in ("true", "1", True, "True")

    filial = FilialItem.objects.create(
        name=name,
        region=request.data.get("region", "").strip(),
        director=request.data.get("director", "").strip(),
        phone=request.data.get("phone", "").strip(),
        address=request.data.get("address", "").strip(),
        status=request.data.get("status", "Faol").strip() or "Faol",
        tasks=request.data.get("tasks", "").strip(),
        description=request.data.get("description", "").strip(),
        image=request.FILES.get("image"),
        director_image=request.FILES.get("director_image"),
        file=request.FILES.get("file"),
        order=order,
        is_active=is_active,
    )
    return Response(_serialize_filial(filial), status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def filiallar_detail_update_delete(request, pk):
    """
    GET: Bitta filial ma'lumotlari.
    PUT/PATCH: Filialni tahrirlash (can_edit_filiallar yoki superuser).
    DELETE: Filialni o'chirish (can_edit_filiallar yoki superuser).
    """
    try:
        filial = FilialItem.objects.get(pk=pk)
    except FilialItem.DoesNotExist:
        return Response({"detail": "Filial topilmadi."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(_serialize_filial(filial))

    if not _check_filiallar_permission(request.user):
        return Response(
            {"detail": "Sizda filialni o'zgartirish yoki o'chirish huquqi mavjud emas."},
            status=status.HTTP_403_FORBIDDEN,
        )

    if request.method == "DELETE":
        filial.delete()
        return Response({"detail": "Filial muvaffaqiyatli o'chirildi.", "id": pk})

    # PUT / PATCH
    if "name" in request.data:
        name = request.data.get("name", "").strip()
        if not name:
            return Response({"detail": "Filial nomi bo'sh bo'lishi mumkin emas."}, status=status.HTTP_400_BAD_REQUEST)
        filial.name = name

    if "region" in request.data:
        filial.region = request.data.get("region", "").strip()

    if "director" in request.data:
        filial.director = request.data.get("director", "").strip()

    if "phone" in request.data:
        filial.phone = request.data.get("phone", "").strip()

    if "address" in request.data:
        filial.address = request.data.get("address", "").strip()

    if "status" in request.data:
        filial.status = request.data.get("status", "").strip() or "Faol"

    if "tasks" in request.data:
        filial.tasks = request.data.get("tasks", "").strip()

    if "description" in request.data:
        filial.description = request.data.get("description", "").strip()

    if "order" in request.data:
        try:
            filial.order = int(request.data.get("order", 0))
        except (ValueError, TypeError):
            pass

    if "is_active" in request.data:
        filial.is_active = request.data.get("is_active") in ("true", "1", True, "True")

    if "image" in request.FILES:
        filial.image = request.FILES.get("image")
    elif request.data.get("remove_image") in ("true", "1", True):
        filial.image = None

    if "director_image" in request.FILES:
        filial.director_image = request.FILES.get("director_image")
    elif request.data.get("remove_director_image") in ("true", "1", True):
        filial.director_image = None

    if "file" in request.FILES:
        filial.file = request.FILES.get("file")
    elif request.data.get("remove_file") in ("true", "1", True):
        filial.file = None

    filial.save()
    return Response(_serialize_filial(filial))


def _check_perm(user, perm_name):
    if not user or not user.is_authenticated:
        return False
    if user.is_superuser:
        return True
    profile = getattr(user, "admin_profile", None)
    if not profile:
        return False
    return bool(getattr(profile, perm_name, False))


# ─────────────────────────────────────────────────────────────
# 1. RAHBARIYAT (LEADERS) CRUD
# ─────────────────────────────────────────────────────────────
@api_view(["GET", "POST"])
def leaders_list_create(request):
    can_manage = _check_perm(request.user, "can_edit_leaders")
    if request.method == "GET":
        qs = Leader.objects.all() if can_manage else Leader.objects.filter(is_active=True)
        return Response({"results": [_serialize_leader(l) for l in qs.order_by("order", "id")]})

    if not can_manage:
        return Response({"detail": "Sizda rahbariyat bo'limini o'zgartirish huquqi mavjud emas."}, status=status.HTTP_403_FORBIDDEN)

    name = request.data.get("name", "").strip()
    if not name:
        return Response({"detail": "Rahbar ismi kiritilishi shart."}, status=status.HTTP_400_BAD_REQUEST)

    order = request.data.get("order", 0)
    try:
        order = int(order)
    except (ValueError, TypeError):
        order = 0

    is_active = True
    if "is_active" in request.data:
        is_active = request.data.get("is_active") in ("true", "1", True, "True")

    leader = Leader.objects.create(
        name=name,
        position=request.data.get("position", "").strip(),
        born=request.data.get("born", "").strip(),
        education=request.data.get("education", "").strip(),
        image=request.FILES.get("image"),
        order=order,
        is_active=is_active,
    )
    return Response(_serialize_leader(leader), status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def leader_detail_update_delete(request, pk):
    try:
        leader = Leader.objects.get(pk=pk)
    except Leader.DoesNotExist:
        return Response({"detail": "Rahbar topilmadi."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(_serialize_leader(leader))

    if not _check_perm(request.user, "can_edit_leaders"):
        return Response({"detail": "Sizda rahbariyat a'zosini o'zgartirish yoki o'chirish huquqi mavjud emas."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "DELETE":
        leader.delete()
        return Response({"detail": "Rahbar muvaffaqiyatli o'chirildi.", "id": pk})

    if "name" in request.data:
        name = request.data.get("name", "").strip()
        if not name:
            return Response({"detail": "Rahbar ismi bo'sh bo'lishi mumkin emas."}, status=status.HTTP_400_BAD_REQUEST)
        leader.name = name

    if "position" in request.data:
        leader.position = request.data.get("position", "").strip()

    if "born" in request.data:
        leader.born = request.data.get("born", "").strip()

    if "education" in request.data:
        leader.education = request.data.get("education", "").strip()

    if "order" in request.data:
        try:
            leader.order = int(request.data.get("order", 0))
        except (ValueError, TypeError):
            pass

    if "is_active" in request.data:
        leader.is_active = request.data.get("is_active") in ("true", "1", True, "True")

    if "image" in request.FILES:
        leader.image = request.FILES.get("image")
    elif request.data.get("remove_image") in ("true", "1", True):
        leader.image = None

    leader.save()
    return Response(_serialize_leader(leader))


# ─────────────────────────────────────────────────────────────
# 2. NARX-NAVO PRODUCTS CRUD
# ─────────────────────────────────────────────────────────────
@api_view(["GET", "POST"])
def narx_navo_list_create(request):
    can_manage = _check_perm(request.user, "can_edit_narx_navo")
    if request.method == "GET":
        qs = NarxNavoProduct.objects.all() if can_manage else NarxNavoProduct.objects.filter(is_active=True)
        return Response({"results": [_serialize_narx_navo(p) for p in qs.order_by("order", "id")]})

    if not can_manage:
        return Response({"detail": "Sizda narx-navo mahsulotlarini qo'shish huquqi mavjud emas."}, status=status.HTTP_403_FORBIDDEN)

    name = request.data.get("name", "").strip()
    if not name:
        return Response({"detail": "Mahsulot nomi kiritilishi shart."}, status=status.HTTP_400_BAD_REQUEST)

    order = request.data.get("order", 0)
    try:
        order = int(order)
    except (ValueError, TypeError):
        order = 0

    is_active = True
    if "is_active" in request.data:
        is_active = request.data.get("is_active") in ("true", "1", True, "True")

    product = NarxNavoProduct.objects.create(
        name=name,
        text=request.data.get("text", "").strip(),
        image=request.FILES.get("image"),
        file=request.FILES.get("file"),
        order=order,
        is_active=is_active,
    )
    return Response(_serialize_narx_navo(product), status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def narx_navo_detail_update_delete(request, pk):
    try:
        product = NarxNavoProduct.objects.get(pk=pk)
    except NarxNavoProduct.DoesNotExist:
        return Response({"detail": "Mahsulot topilmadi."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(_serialize_narx_navo(product))

    if not _check_perm(request.user, "can_edit_narx_navo"):
        return Response({"detail": "Sizda mahsulotni o'zgartirish yoki o'chirish huquqi mavjud emas."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "DELETE":
        product.delete()
        return Response({"detail": "Mahsulot muvaffaqiyatli o'chirildi.", "id": pk})

    if "name" in request.data:
        name = request.data.get("name", "").strip()
        if not name:
            return Response({"detail": "Mahsulot nomi bo'sh bo'lishi mumkin emas."}, status=status.HTTP_400_BAD_REQUEST)
        product.name = name

    if "text" in request.data:
        product.text = request.data.get("text", "").strip()

    if "order" in request.data:
        try:
            product.order = int(request.data.get("order", 0))
        except (ValueError, TypeError):
            pass

    if "is_active" in request.data:
        product.is_active = request.data.get("is_active") in ("true", "1", True, "True")

    if "image" in request.FILES:
        product.image = request.FILES.get("image")
    elif request.data.get("remove_image") in ("true", "1", True):
        product.image = None

    if "file" in request.FILES:
        product.file = request.FILES.get("file")
    elif request.data.get("remove_file") in ("true", "1", True):
        product.file = None

    product.save()
    return Response(_serialize_narx_navo(product))


# ─────────────────────────────────────────────────────────────
# 3. BO'SH ISH O'RINLARI (VACANCIES) CRUD
# ─────────────────────────────────────────────────────────────
@api_view(["GET", "POST"])
def vacancies_list_create(request):
    can_manage = _check_perm(request.user, "can_edit_vacancies")
    if request.method == "GET":
        qs = BoshIshOrinlariProduct.objects.all() if can_manage else BoshIshOrinlariProduct.objects.filter(is_active=True)
        return Response({"results": [_serialize_vacancy(v) for v in qs.order_by("order", "id")]})

    if not can_manage:
        return Response({"detail": "Sizda bo'sh ish o'rinlarini qo'shish huquqi mavjud emas."}, status=status.HTTP_403_FORBIDDEN)

    name = request.data.get("name", "").strip()
    if not name:
        return Response({"detail": "Ish o'rni nomi kiritilishi shart."}, status=status.HTTP_400_BAD_REQUEST)

    order = request.data.get("order", 0)
    try:
        order = int(order)
    except (ValueError, TypeError):
        order = 0

    is_active = True
    if "is_active" in request.data:
        is_active = request.data.get("is_active") in ("true", "1", True, "True")

    vacancy = BoshIshOrinlariProduct.objects.create(
        name=name,
        text=request.data.get("text", "").strip(),
        image=request.FILES.get("image"),
        file=request.FILES.get("file"),
        order=order,
        is_active=is_active,
    )
    return Response(_serialize_vacancy(vacancy), status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def vacancies_detail_update_delete(request, pk):
    try:
        vacancy = BoshIshOrinlariProduct.objects.get(pk=pk)
    except BoshIshOrinlariProduct.DoesNotExist:
        return Response({"detail": "Ish o'rni topilmadi."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        return Response(_serialize_vacancy(vacancy))

    if not _check_perm(request.user, "can_edit_vacancies"):
        return Response({"detail": "Sizda ish o'rnini o'zgartirish yoki o'chirish huquqi mavjud emas."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "DELETE":
        vacancy.delete()
        return Response({"detail": "Ish o'rni muvaffaqiyatli o'chirildi.", "id": pk})

    if "name" in request.data:
        name = request.data.get("name", "").strip()
        if not name:
            return Response({"detail": "Ish o'rni nomi bo'sh bo'lishi mumkin emas."}, status=status.HTTP_400_BAD_REQUEST)
        vacancy.name = name

    if "text" in request.data:
        vacancy.text = request.data.get("text", "").strip()

    if "order" in request.data:
        try:
            vacancy.order = int(request.data.get("order", 0))
        except (ValueError, TypeError):
            pass

    if "is_active" in request.data:
        vacancy.is_active = request.data.get("is_active") in ("true", "1", True, "True")

    if "image" in request.FILES:
        vacancy.image = request.FILES.get("image")
    elif request.data.get("remove_image") in ("true", "1", True):
        vacancy.image = None

    if "file" in request.FILES:
        vacancy.file = request.FILES.get("file")
    elif request.data.get("remove_file") in ("true", "1", True):
        vacancy.file = None

    vacancy.save()
    return Response(_serialize_vacancy(vacancy))


# ─────────────────────────────────────────────────────────────
# 4. KATALOG & NOMENKLATURA (CATALOG ITEMS) CRUD
# ─────────────────────────────────────────────────────────────
@api_view(["GET", "POST"])
def catalog_items_list_create(request):
    slug = request.query_params.get("slug") or request.data.get("page_slug", "katalog")
    perm_name = "can_edit_nomenklatura" if slug == "nomenklatura" else "can_edit_katalog"
    can_manage = _check_perm(request.user, perm_name)

    if request.method == "GET":
        qs = CatalogItem.objects.filter(page__slug=slug) if slug else CatalogItem.objects.all()
        if not can_manage:
            qs = qs.filter(is_active=True)
        return Response({"results": [_serialize_catalog_item(item) for item in qs.order_by("order", "id")]})

    if not can_manage:
        return Response({"detail": "Sizda hujjat qo'shish huquqi mavjud emas."}, status=status.HTTP_403_FORBIDDEN)

    title = request.data.get("title", "").strip()
    if not title:
        return Response({"detail": "Hujjat nomi kiritilishi shart."}, status=status.HTTP_400_BAD_REQUEST)

    page_obj = Page.objects.filter(slug=slug).first()

    order = request.data.get("order", 0)
    try:
        order = int(order)
    except (ValueError, TypeError):
        order = 0

    item = CatalogItem.objects.create(
        page=page_obj,
        title=title,
        description=request.data.get("description", "").strip(),
        file=request.FILES.get("file"),
        file_url=request.data.get("file_url", "").strip(),
        order=order,
        is_active=request.data.get("is_active", "true") in ("true", "1", True, "True"),
    )
    return Response(_serialize_catalog_item(item), status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def catalog_item_detail_update_delete(request, pk):
    try:
        item = CatalogItem.objects.get(pk=pk)
    except CatalogItem.DoesNotExist:
        return Response({"detail": "Hujjat topilmadi."}, status=status.HTTP_404_NOT_FOUND)

    slug = item.page.slug if item.page else "katalog"
    perm_name = "can_edit_nomenklatura" if slug == "nomenklatura" else "can_edit_katalog"
    can_manage = _check_perm(request.user, perm_name)

    if request.method == "GET":
        return Response(_serialize_catalog_item(item))

    if not can_manage:
        return Response({"detail": "Sizda ushbu hujjatni o'zgartirish yoki o'chirish huquqi mavjud emas."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "DELETE":
        item.delete()
        return Response({"detail": "Hujjat muvaffaqiyatli o'chirildi.", "id": pk})

    if "title" in request.data:
        title = request.data.get("title", "").strip()
        if not title:
            return Response({"detail": "Hujjat nomi bo'sh bo'lishi mumkin emas."}, status=status.HTTP_400_BAD_REQUEST)
        item.title = title

    if "description" in request.data:
        item.description = request.data.get("description", "").strip()

    if "order" in request.data:
        try:
            item.order = int(request.data.get("order", 0))
        except (ValueError, TypeError):
            pass

    if "is_active" in request.data:
        item.is_active = request.data.get("is_active") in ("true", "1", True, "True")

    if "file" in request.FILES:
        item.file = request.FILES.get("file")
    elif request.data.get("remove_file") in ("true", "1", True):
        item.file = None

    if "file_url" in request.data:
        item.file_url = request.data.get("file_url", "").strip()

    item.save()
    return Response(_serialize_catalog_item(item))


# ─────────────────────────────────────────────────────────────
# 5. BOSH SAHIFA KONTENTI (HOME CONTENT) UPDATE
# ─────────────────────────────────────────────────────────────
@api_view(["GET", "PATCH"])
def home_content_update(request):
    home = HomeContent.objects.first()
    if not home:
        home = HomeContent.objects.create()

    if request.method == "GET":
        return Response(_home_payload())

    if not _check_perm(request.user, "can_edit_home_content"):
        return Response({"detail": "Sizda bosh sahifa kontentini o'zgartirish huquqi mavjud emas."}, status=status.HTTP_403_FORBIDDEN)

    if "intro" in request.data:
        home.intro = request.data.get("intro", "").strip()
    if "purpose" in request.data:
        home.purpose = request.data.get("purpose", "").strip()
    if "hero_title" in request.data:
        home.hero_title = request.data.get("hero_title", "").strip()
    if "hero_tagline" in request.data:
        home.hero_tagline = request.data.get("hero_tagline", "").strip()

    if "hero_image" in request.FILES:
        home.hero_image = request.FILES.get("hero_image")
    elif request.data.get("remove_hero_image") in ("true", "1", True):
        home.hero_image = None

    if "tasks_image" in request.FILES:
        home.tasks_image = request.FILES.get("tasks_image")
    elif request.data.get("remove_tasks_image") in ("true", "1", True):
        home.tasks_image = None

    if "model_title" in request.data:
        home.model_title = request.data.get("model_title", "").strip()
    if "capabilities_title" in request.data:
        home.capabilities_title = request.data.get("capabilities_title", "").strip()
    if "workflow_title" in request.data:
        home.workflow_title = request.data.get("workflow_title", "").strip()
    if "tasks_title" in request.data:
        home.tasks_title = request.data.get("tasks_title", "").strip()

    home.save()

    # Tasks update
    if "tasks" in request.data:
        raw_tasks = request.data.get("tasks")
        if isinstance(raw_tasks, str):
            task_lines = [t.strip() for t in raw_tasks.split("\n") if t.strip()]
        elif isinstance(raw_tasks, list):
            task_lines = [str(t).strip() for t in raw_tasks if str(t).strip()]
        else:
            task_lines = []
        if task_lines:
            home.tasks.all().delete()
            for idx, text in enumerate(task_lines):
                HomeTask.objects.create(home=home, text=text, order=idx + 1)

    # Capabilities update
    if "capabilities" in request.data:
        raw_caps = request.data.get("capabilities")
        if isinstance(raw_caps, str):
            cap_lines = [c.strip() for c in raw_caps.split("\n") if c.strip()]
        elif isinstance(raw_caps, list):
            cap_lines = [str(c).strip() for c in raw_caps if str(c).strip()]
        else:
            cap_lines = []
        if cap_lines:
            home.capabilities.all().delete()
            for idx, text in enumerate(cap_lines):
                HomeCapability.objects.create(home=home, title=text, order=idx + 1)

    return Response(_home_payload())


# ─────────────────────────────────────────────────────────────
# 6. QAYTA ALOQA (CONTACT SETTINGS) UPDATE
# ─────────────────────────────────────────────────────────────
@api_view(["GET", "PATCH"])
def contact_settings_update(request):
    settings_obj = SiteSettings.objects.first()
    if not settings_obj:
        settings_obj = SiteSettings.objects.create(name="O'zyo'lko'prik")

    if request.method == "GET":
        phones = [p for p in (settings_obj.phone_primary, settings_obj.phone_secondary) if p]
        return Response({
            "phones": phones,
            "phone_primary": settings_obj.phone_primary or "",
            "phone_secondary": settings_obj.phone_secondary or "",
            "email": settings_obj.email or "",
            "bank": settings_obj.bank or "",
            "address": settings_obj.address or "",
            "hours": settings_obj.hours or "",
            "map": settings_obj.map_url or "",
        })

    if not _check_perm(request.user, "can_edit_contact"):
        return Response({"detail": "Sizda aloqa ma'lumotlarini o'zgartirish huquqi mavjud emas."}, status=status.HTTP_403_FORBIDDEN)

    if "phone_primary" in request.data:
        settings_obj.phone_primary = request.data.get("phone_primary", "").strip()
    if "phone_secondary" in request.data:
        settings_obj.phone_secondary = request.data.get("phone_secondary", "").strip()
    if "email" in request.data:
        settings_obj.email = request.data.get("email", "").strip()
    if "bank" in request.data:
        settings_obj.bank = request.data.get("bank", "").strip()
    if "address" in request.data:
        settings_obj.address = request.data.get("address", "").strip()
    if "hours" in request.data:
        settings_obj.hours = request.data.get("hours", "").strip()
    if "map" in request.data:
        settings_obj.map_url = request.data.get("map", "").strip()

    settings_obj.save()

    phones = [p for p in (settings_obj.phone_primary, settings_obj.phone_secondary) if p]
    return Response({
        "phones": phones,
        "phone_primary": settings_obj.phone_primary or "",
        "phone_secondary": settings_obj.phone_secondary or "",
        "email": settings_obj.email or "",
        "bank": settings_obj.bank or "",
        "address": settings_obj.address or "",
        "hours": settings_obj.hours or "",
        "map": settings_obj.map_url or "",
    })


# ─────────────────────────────────────────────────────────────
# 7. E'LONLAR (ANNOUNCEMENT SETTINGS) UPDATE
# ─────────────────────────────────────────────────────────────
@api_view(["GET", "PATCH"])
def announcement_settings_update(request):
    page_obj = Page.objects.filter(slug="elonlar").first()
    announcement = Announcement.objects.filter(is_active=True).first()
    if not announcement and page_obj:
        announcement = Announcement.objects.create(page=page_obj, intro="E'lon matni")

    if request.method == "GET":
        return Response({
            "intro": announcement.intro if announcement else "",
            "email": announcement.email if announcement else "",
            "items": [item.text for item in announcement.items.all()] if announcement else [],
        })

    if not _check_perm(request.user, "can_edit_announcements"):
        return Response({"detail": "Sizda e'lon sozlamalarini o'zgartirish huquqi mavjud emas."}, status=status.HTTP_403_FORBIDDEN)

    if "intro" in request.data:
        announcement.intro = request.data.get("intro", "").strip()
    if "email" in request.data:
        announcement.email = request.data.get("email", "").strip()
    announcement.save()

    if "items" in request.data:
        raw_items = request.data.get("items")
        if isinstance(raw_items, str):
            item_lines = [i.strip() for i in raw_items.split("\n") if i.strip()]
        elif isinstance(raw_items, list):
            item_lines = [str(i).strip() for i in raw_items if str(i).strip()]
        else:
            item_lines = []
        if item_lines:
            announcement.items.all().delete()
            for idx, text in enumerate(item_lines):
                AnnouncementItem.objects.create(announcement=announcement, text=text, order=idx + 1)

    return Response({
        "intro": announcement.intro,
        "email": announcement.email,
        "items": [item.text for item in announcement.items.all()],
    })


