from django.db import models


class SitePayload(models.Model):
    name = models.CharField(max_length=64, unique=True, default="main", verbose_name="Nomi")
    payload = models.JSONField(verbose_name="Yuklama (Payload JSON)")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Yangilangan vaqti")

    class Meta:
        verbose_name = "sayt kontenti yuklamasi"
        verbose_name_plural = "sayt kontenti yuklamalari"

    def __str__(self):
        return self.name


class SiteSettings(models.Model):
    name = models.CharField(max_length=128, default="Oʻzyoʻlkoʻprik", verbose_name="Nomi")
    legal_name = models.CharField(max_length=255, verbose_name="Yuridik nomi")
    tagline = models.TextField(blank=True, verbose_name="Shior (Tagline)")
    logo_url = models.URLField(max_length=2000, blank=True, verbose_name="Logotip havolasi")
    hero_image = models.ImageField(upload_to="settings/", blank=True, null=True, verbose_name="Asosiy rasm (Hero Image)")
    hero_image_url = models.URLField(max_length=2000, blank=True, verbose_name="Asosiy rasm havolasi (Hero Image)")
    plant_image_url = models.URLField(max_length=2000, blank=True, verbose_name="Zavod rasmi havolasi")
    contact_image_url = models.URLField(max_length=2000, blank=True, verbose_name="Aloqa sahifasi rasmi havolasi")
    phone_primary = models.CharField(max_length=64, blank=True, verbose_name="Asosiy telefon")
    phone_secondary = models.CharField(max_length=64, blank=True, verbose_name="Qoʻshimcha telefon")
    email = models.EmailField(blank=True, verbose_name="Elektron pochta")
    bank = models.TextField(blank=True, verbose_name="Bank rekvizitlari")
    address = models.TextField(blank=True, verbose_name="Manzil")
    hours = models.CharField(max_length=128, blank=True, verbose_name="Ish vaqti")
    map_url = models.URLField(max_length=2000, blank=True, verbose_name="Xarita havolasi (Google/Yandex map)")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Yangilangan vaqti")

    class Meta:
        verbose_name = "sayt sozlamasi"
        verbose_name_plural = "sayt sozlamalari"

    def __str__(self):
        return self.name

    def get_hero_url(self):
        if self.hero_image:
            return self.hero_image.url
        return self.hero_image_url


class NavigationItem(models.Model):
    label = models.CharField(max_length=128, verbose_name="Menyu nomi")
    slug = models.SlugField(max_length=128, blank=True, verbose_name="Slug (URL manzili)")
    parent = models.ForeignKey(
        "self",
        blank=True,
        null=True,
        related_name="children",
        on_delete=models.CASCADE,
        verbose_name="Ota menyu",
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib raqami")
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    image = models.ImageField(upload_to="navigation/", blank=True, null=True, verbose_name="Orqa fon rasmi (Background Image)")

    class Meta:
        ordering = ("order", "id")
        verbose_name = "navigatsiya elementi"
        verbose_name_plural = "navigatsiya elementlari"

    def __str__(self):
        return self.label

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.label)
            if not self.slug:
                self.slug = self.label.lower().replace(" ", "-").replace("ʻ", "").replace("'", "")
        super().save(*args, **kwargs)


class HomeContent(models.Model):
    intro = models.TextField(verbose_name="Kirish matni")
    purpose = models.TextField(verbose_name="Maqsad va vazifalar")

    hero_title = models.CharField(max_length=255, blank=True, verbose_name="Asosiy sarlavha (Hero Title)")
    hero_tagline = models.TextField(blank=True, verbose_name="Shior (Tagline)")
    hero_image = models.ImageField(upload_to="home/", blank=True, null=True, verbose_name="Asosiy rasm (Hero Image)")
    tasks_image = models.ImageField(upload_to="home/", blank=True, null=True, verbose_name="Operatsion Vazifalar boʻlimi rasmi (Tasks Image)")

    model_eyebrow = models.CharField(max_length=128, default="Klaster Modeli", verbose_name="Klaster modeli ustki matni (Eyebrow)")
    model_title = models.CharField(max_length=255, default="Loyihadan tayyor konstruksiyagacha yagona boshqaruv", verbose_name="Klaster modeli sarlavhasi")

    capabilities_eyebrow = models.CharField(max_length=128, default="Yoʻnalishlar", verbose_name="Yoʻnalishlar ustki matni (Eyebrow)")
    capabilities_title = models.CharField(max_length=255, default="Koʻprik infratuzilmasi uchun asosiy xizmat bloklari", verbose_name="Yoʻnalishlar sarlavhasi")

    workflow_eyebrow = models.CharField(max_length=128, default="Ish Oqimi", verbose_name="Ish oqimi ustki matni (Eyebrow)")
    workflow_title = models.CharField(max_length=255, default="Texnik qarordan amaliy natijagacha", verbose_name="Ish oqimi sarlavhasi")

    tasks_eyebrow = models.CharField(max_length=128, default="Vazifalar", verbose_name="Vazifalar ustki matni (Eyebrow)")
    tasks_title = models.CharField(max_length=255, default="Klaster bajaradigan asosiy ishlar", verbose_name="Vazifalar sarlavhasi")

    class Meta:
        verbose_name = "bosh sahifa kontenti"
        verbose_name_plural = "bosh sahifa kontenti"

    def __str__(self):
        return "Bosh sahifa"


class HomeCapability(models.Model):
    home = models.ForeignKey(HomeContent, related_name="capabilities", on_delete=models.CASCADE, verbose_name="Bosh sahifa kontenti")
    title = models.CharField(max_length=255, verbose_name="Vazifa nomi")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib raqami")

    class Meta:
        ordering = ("order", "id")
        verbose_name = "klaster vazifasi"
        verbose_name_plural = "klaster vazifalari"

    def __str__(self):
        return self.title


class HomeTask(models.Model):
    home = models.ForeignKey(HomeContent, related_name="tasks", on_delete=models.CASCADE, verbose_name="Bosh sahifa kontenti")
    text = models.TextField(verbose_name="Vazifa matni")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib raqami")

    class Meta:
        ordering = ("order", "id")
        verbose_name = "asosiy vazifa"
        verbose_name_plural = "asosiy vazifalar"

    def __str__(self):
        return self.text[:80]


class Page(models.Model):
    HOME = "home"
    EMPTY = "empty"
    STATUS = "status"
    LEADERS = "leaders"
    DOCUMENT = "document"
    ANNOUNCEMENT = "announcement"
    CONTACT = "contact"

    PAGE_TYPES = (
        (HOME, "Bosh sahifa"),
        (EMPTY, "Boʻsh sahifa"),
        (STATUS, "Status sahifa"),
        (LEADERS, "Rahbariyat"),
        (DOCUMENT, "Hujjat"),
        (ANNOUNCEMENT, "Eʼlon"),
        (CONTACT, "Qayta aloqa"),
    )

    slug = models.SlugField(max_length=128, unique=True, verbose_name="Slug (URL manzili)")
    title = models.CharField(max_length=255, verbose_name="Sahifa sarlavhasi")
    type = models.CharField(max_length=32, choices=PAGE_TYPES, verbose_name="Sahifa turi")
    status = models.TextField(blank=True, verbose_name="Holat (Status)")
    document = models.CharField(max_length=255, blank=True, verbose_name="Hujjat nomi")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib raqami")
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        ordering = ("order", "id")
        verbose_name = "sahifa"
        verbose_name_plural = "sahifalar"

    def __str__(self):
        return self.title


class Leader(models.Model):
    name = models.CharField(max_length=255, verbose_name="F.I.SH.")
    position = models.CharField(max_length=255, verbose_name="Lavozimi")
    born = models.CharField(max_length=255, blank=True, verbose_name="Tugʻilgan yili va joyi")
    education = models.TextField(blank=True, verbose_name="Maʼlumoti")
    image_url = models.URLField(max_length=2000, blank=True, verbose_name="Rasm havolasi")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib raqami")
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        ordering = ("order", "id")
        verbose_name = "rahbariyat a'zosi"
        verbose_name_plural = "rahbariyat"

    def __str__(self):
        return self.name


class Announcement(models.Model):
    page = models.OneToOneField(Page, related_name="announcement", on_delete=models.CASCADE, verbose_name="Sahifa")
    intro = models.TextField(verbose_name="Kirish matni")
    email = models.EmailField(blank=True, verbose_name="Elektron pochta")
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        verbose_name = "eʼlon"
        verbose_name_plural = "eʼlonlar"

    def __str__(self):
        return self.page.title


class AnnouncementItem(models.Model):
    announcement = models.ForeignKey(Announcement, related_name="items", on_delete=models.CASCADE, verbose_name="Eʼlon")
    text = models.CharField(max_length=255, verbose_name="Element matni")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib raqami")

    class Meta:
        ordering = ("order", "id")
        verbose_name = "eʼlon elementi"
        verbose_name_plural = "eʼlon elementlari"

    def __str__(self):
        return self.text


class News(models.Model):
    title = models.CharField(max_length=255, verbose_name="Yangilik sarlavhasi")
    slug = models.SlugField(max_length=128, unique=True, verbose_name="Slug (URL manzili)")
    summary = models.TextField(blank=True, verbose_name="Qisqacha mazmuni")
    body = models.TextField(verbose_name="Batafsil matn")
    image_url = models.URLField(max_length=2000, blank=True, verbose_name="Rasm havolasi")
    published_at = models.DateTimeField(verbose_name="Nashr qilingan vaqti")
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        ordering = ("-published_at", "id")
        verbose_name = "yangilik"
        verbose_name_plural = "yangiliklar"

    def __str__(self):
        return self.title


class CatalogItem(models.Model):
    page = models.ForeignKey(
        Page,
        related_name="catalog_items",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        verbose_name="Sahifa",
    )
    title = models.CharField(max_length=255, default="Каталог ver. 2.pdf", verbose_name="Hujjat nomi")
    file = models.FileField(upload_to="catalogs/", blank=True, null=True, verbose_name="Hujjat fayli")
    file_url = models.URLField(max_length=2000, blank=True, verbose_name="Hujjat havolasi (Google Drive va h.k.)")
    embed_url = models.URLField(max_length=2000, blank=True, verbose_name="Koʻrish havolasi (Embed URL)")
    description = models.TextField(blank=True, verbose_name="Tavsif (Ta'rif)")
    file_size = models.CharField(max_length=64, blank=True, verbose_name="Fayl hajmi")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib raqami")
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Yaratilgan vaqti")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Yangilangan vaqti")

    class Meta:
        ordering = ("order", "id")
        verbose_name = "katalog hujjati"
        verbose_name_plural = "katalog hujjatlari"

    def __str__(self):
        return self.title

    def get_download_url(self):
        if self.file:
            return self.file.url
        return self.file_url

    def get_embed_url(self):
        if self.embed_url:
            return self.embed_url
        url = self.get_download_url()
        if "drive.google.com" in url and "preview" not in url:
            if "id=" in url:
                file_id = url.split("id=")[1].split("&")[0]
                return f"https://drive.google.com/file/d/{file_id}/preview"
        return url
