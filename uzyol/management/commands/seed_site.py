import json
from pathlib import Path

from django.core.management.base import BaseCommand

from uzyol.models import (
    Announcement,
    AnnouncementItem,
    CatalogItem,
    HomeCapability,
    HomeContent,
    HomeTask,
    Leader,
    NavigationItem,
    Page,
    SiteSettings,
    FilialItem,
)



class Command(BaseCommand):
    help = "Seed the Oʻzyoʻlkoʻprik site payload into the database."

    def handle(self, *args, **options):
        fixture_path = Path(__file__).resolve().parents[2] / "fixtures" / "site_payload.json"
        payload = json.loads(fixture_path.read_text(encoding="utf-8"))

        brand = payload["brand"]
        assets = payload["assets"]
        contact = payload["contact"]
        phones = contact.get("phones", [])
        SiteSettings.objects.update_or_create(
            id=1,
            defaults={
                "name": brand.get("name", ""),
                "legal_name": brand.get("legalName", ""),
                "tagline": brand.get("tagline", ""),
                "logo_url": assets.get("logo", ""),
                "hero_image_url": assets.get("hero", ""),
                "plant_image_url": assets.get("plant", ""),
                "contact_image_url": assets.get("contact", ""),
                "phone_primary": phones[0] if len(phones) > 0 else "",
                "phone_secondary": phones[1] if len(phones) > 1 else "",
                "email": contact.get("email", ""),
                "bank": contact.get("bank", ""),
                "address": contact.get("address", ""),
                "hours": contact.get("hours", ""),
                "map_url": contact.get("map", ""),
            },
        )

        NavigationItem.objects.all().delete()
        for index, item in enumerate(payload.get("navigation", [])):
            parent = NavigationItem.objects.create(
                label=item["label"],
                slug=item["slug"],
                order=index,
                is_active=True,
            )
            for child_index, child in enumerate(item.get("children", [])):
                NavigationItem.objects.create(
                    label=child["label"],
                    slug=child["slug"],
                    parent=parent,
                    order=child_index,
                    is_active=True,
                )

        home_payload = payload["home"]
        home, _created = HomeContent.objects.update_or_create(
            id=1,
            defaults={
                "intro": home_payload.get("intro", ""),
                "purpose": home_payload.get("purpose", ""),
                "hero_title": brand.get("legalName", "“Oʻzyoʻlkoʻprik” klasteri davlat muassasasi"),
                "hero_tagline": brand.get("tagline", "Koʻprik va sunʼiy inshootlar uchun loyihalash, ishlab chiqarish, taʼmirlash va diagnostika ishlari"),
                "model_eyebrow": "Klaster Modeli",
                "model_title": "Loyihadan tayyor konstruksiyagacha yagona boshqaruv",
                "capabilities_eyebrow": "Yoʻnalishlar",
                "capabilities_title": "Koʻprik infratuzilmasi uchun asosiy xizmat bloklari",
                "workflow_eyebrow": "Ish Oqimi",
                "workflow_title": "Texnik qarordan amaliy natijagacha",
                "tasks_eyebrow": "Vazifalar",
                "tasks_title": "Klaster bajaradigan asosiy ishlar",
            },
        )
        home.capabilities.all().delete()
        home.tasks.all().delete()
        for index, title in enumerate(home_payload.get("capabilities", [])):
            HomeCapability.objects.create(home=home, title=title, order=index)
        for index, text in enumerate(home_payload.get("tasks", [])):
            HomeTask.objects.create(home=home, text=text, order=index)

        Page.objects.all().delete()
        for index, page in enumerate(payload.get("pages", [])):
            Page.objects.create(
                slug=page["slug"],
                title=page["title"],
                type=page["type"],
                status=page.get("status", ""),
                document=page.get("document", ""),
                order=index,
                is_active=True,
            )

        Leader.objects.all().delete()
        leader_images = assets.get("leaders", [])
        leaders_page = next((page for page in payload.get("pages", []) if page.get("type") == "leaders"), {})
        for index, leader in enumerate(leaders_page.get("leaders", [])):
            image_index = leader.get("imageIndex")
            Leader.objects.create(
                name=leader.get("name", ""),
                position=leader.get("position", ""),
                born=leader.get("born", ""),
                education=leader.get("education", ""),
                image_url=leader_images[image_index] if image_index is not None and image_index < len(leader_images) else "",
                order=index,
                is_active=True,
            )

        Announcement.objects.all().delete()
        for page_payload in payload.get("pages", []):
            if page_payload.get("type") != "announcement":
                continue
            page = Page.objects.get(slug=page_payload["slug"])
            announcement = Announcement.objects.create(
                page=page,
                intro=page_payload.get("intro", ""),
                email=page_payload.get("email", ""),
                is_active=True,
            )
            for index, item in enumerate(page_payload.get("items", [])):
                AnnouncementItem.objects.create(announcement=announcement, text=item, order=index)

        CatalogItem.objects.all().delete()
        catalog_files = {
            "katalog": {
                "title": "Каталог ver. 2.pdf",
                "file_id": "1m2fTdEmw9IXzEmaeZWfr-nScjt5DWw2n",
                "description": "Oʻzyoʻlkoʻprik klasteri rasmiy zavod mahsulotlari, koʻprik va temir-beton konstruksiyalari katalogi.",
                "file_size": "14.8 MB",
            },
            "nomenklatura": {
                "title": "Номенклатура PDF.pdf",
                "file_id": "1AQ51BXeCgo0TsPHUQ068kuND-6w96Ay8",
                "description": "Oʻzyoʻlkoʻprik klasteri rasmiy zavod mahsulotlari va buyumlari nomenklaturasi.",
                "file_size": "8.5 MB",
            },
        }
        for page_payload in payload.get("pages", []):
            slug = page_payload.get("slug")
            if slug in catalog_files or page_payload.get("document"):
                page = Page.objects.get(slug=slug)
                cdata = catalog_files.get(
                    slug,
                    {
                        "title": page_payload.get("document") or "Hujjat.pdf",
                        "file_id": "1m2fTdEmw9IXzEmaeZWfr-nScjt5DWw2n",
                        "description": "Rasmiy rasmiy hujjat fayli.",
                        "file_size": "10 MB",
                    },
                )
                file_id = cdata["file_id"]
                CatalogItem.objects.create(
                    page=page,
                    title=cdata["title"],
                    file_url=f"https://drive.google.com/uc?id={file_id}&export=download",
                    embed_url=f"https://drive.google.com/file/d/{file_id}/preview",
                    description=cdata["description"],
                    file_size=cdata["file_size"],
                    order=0,
                    is_active=True,
                )

        if not FilialItem.objects.exists():
            default_branches = [
                {
                    "name": "Toshkent Bosh Filiali va Temir-Beton Klasteri",
                    "region": "Toshkent shahri va viloyati",
                    "address": "Toshkent shahri, Yashnobod tumani, Ohangrabo koʻchasi 12-uy",
                    "phone": "+998 55 515 16 16",
                    "tasks": "Bosh boshqaruv, Temir-beton konstruksiyalar ishlab chiqarish, Diagnostika markazi",
                    "status": "Asosiy bazasi",
                    "order": 0,
                },
                {
                    "name": "Vodiy Hududiy Filiali (Fargʻona, Andijon, Namangan)",
                    "region": "Fargʻona vodiysi",
                    "address": "Fargʻona shahri, Sanoat zonasi 4-daha",
                    "phone": "+998 73 244 12 34",
                    "tasks": "Koʻprik inshootlarini taʼmirlash, tovar-beton va konstruksiya taʼminoti",
                    "status": "Faol",
                    "order": 1,
                },
                {
                    "name": "Samarqand va Zarafshon Hududiy Filiali",
                    "region": "Samarqand va Jizzax viloyatlari",
                    "address": "Samarqand shahri, Dagbit koʻchasi 88-uy",
                    "phone": "+998 66 233 45 67",
                    "tasks": "Avtomobil yoʻllaridagi koʻpriklarni diagnostika va rekonstruksiya qilish",
                    "status": "Faol",
                    "order": 2,
                },
                {
                    "name": "Buxoro va Navoiy Hududiy Filiali",
                    "region": "Buxoro va Navoiy viloyatlari",
                    "address": "Buxoro shahri, Sanoatchilar koʻchasi 15-uy",
                    "phone": "+998 65 221 78 90",
                    "tasks": "Choʻl va magistral hududlardagi sunʼiy inshootlarni saqlash va taʼmirlash",
                    "status": "Faol",
                    "order": 3,
                },
                {
                    "name": "Janubiy Hududiy Filiali (Qashqadaryo va Surxondaryo)",
                    "region": "Qashqadaryo va Surxondaryo viloyatlari",
                    "address": "Qarshi shahri, Kasan yoʻli 42-uy",
                    "phone": "+998 75 225 33 11",
                    "tasks": "Togʻ va murakkab relyefli koʻpriklarni tiklash va qurilish ishlari",
                    "status": "Faol",
                    "order": 4,
                },
                {
                    "name": "Shimoliy-Gʻarbiy Filial (Xorazm va Qoraqalpogʻiston)",
                    "region": "Xorazm viloyati va Qoraqalpogʻiston Resp.",
                    "address": "Urganch shahri, Al-Xorazmiy koʻchasi 102-uy",
                    "phone": "+998 62 228 99 00",
                    "tasks": "Daryo koʻpriklari va suv inshootlari texnik diagnostikasi hamda taʼmiri",
                    "status": "Faol",
                    "order": 5,
                },
            ]
            for branch in default_branches:
                FilialItem.objects.create(**branch, is_active=True)

        self.stdout.write(self.style.SUCCESS("Seeded editable site data into database."))

