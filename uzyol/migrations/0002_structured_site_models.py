import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("uzyol", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="HomeContent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("intro", models.TextField()),
                ("purpose", models.TextField()),
            ],
            options={
                "verbose_name": "bosh sahifa kontenti",
                "verbose_name_plural": "bosh sahifa kontenti",
            },
        ),
        migrations.CreateModel(
            name="Leader",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255)),
                ("position", models.CharField(max_length=255)),
                ("born", models.CharField(blank=True, max_length=255)),
                ("education", models.TextField(blank=True)),
                ("image_url", models.URLField(blank=True, max_length=2000)),
                ("order", models.PositiveIntegerField(default=0)),
                ("is_active", models.BooleanField(default=True)),
            ],
            options={
                "verbose_name": "rahbariyat",
                "verbose_name_plural": "rahbariyat",
                "ordering": ("order", "id"),
            },
        ),
        migrations.CreateModel(
            name="NavigationItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("label", models.CharField(max_length=128)),
                ("slug", models.SlugField(max_length=128)),
                ("order", models.PositiveIntegerField(default=0)),
                ("is_active", models.BooleanField(default=True)),
                (
                    "parent",
                    models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="children", to="uzyol.navigationitem"),
                ),
            ],
            options={
                "verbose_name": "navigatsiya elementi",
                "verbose_name_plural": "navigatsiya elementlari",
                "ordering": ("order", "id"),
            },
        ),
        migrations.CreateModel(
            name="Page",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("slug", models.SlugField(max_length=128, unique=True)),
                ("title", models.CharField(max_length=255)),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("home", "Bosh sahifa"),
                            ("empty", "Boʻsh sahifa"),
                            ("status", "Status sahifa"),
                            ("leaders", "Rahbariyat"),
                            ("document", "Hujjat"),
                            ("announcement", "Eʼlon"),
                            ("contact", "Qayta aloqa"),
                        ],
                        max_length=32,
                    ),
                ),
                ("status", models.TextField(blank=True)),
                ("document", models.CharField(blank=True, max_length=255)),
                ("order", models.PositiveIntegerField(default=0)),
                ("is_active", models.BooleanField(default=True)),
            ],
            options={
                "verbose_name": "sahifa",
                "verbose_name_plural": "sahifalar",
                "ordering": ("order", "id"),
            },
        ),
        migrations.CreateModel(
            name="SiteSettings",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(default="Oʻzyoʻlkoʻprik", max_length=128)),
                ("legal_name", models.CharField(max_length=255)),
                ("tagline", models.TextField(blank=True)),
                ("source_url", models.URLField(blank=True, max_length=1000)),
                ("logo_url", models.URLField(blank=True, max_length=2000)),
                ("hero_image_url", models.URLField(blank=True, max_length=2000)),
                ("plant_image_url", models.URLField(blank=True, max_length=2000)),
                ("contact_image_url", models.URLField(blank=True, max_length=2000)),
                ("phone_primary", models.CharField(blank=True, max_length=64)),
                ("phone_secondary", models.CharField(blank=True, max_length=64)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("bank", models.TextField(blank=True)),
                ("address", models.TextField(blank=True)),
                ("hours", models.CharField(blank=True, max_length=128)),
                ("map_url", models.URLField(blank=True, max_length=2000)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "sayt sozlamasi",
                "verbose_name_plural": "sayt sozlamalari",
            },
        ),
        migrations.CreateModel(
            name="HomeCapability",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("order", models.PositiveIntegerField(default=0)),
                ("home", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="capabilities", to="uzyol.homecontent")),
            ],
            options={
                "verbose_name": "klaster vazifasi",
                "verbose_name_plural": "klaster vazifalari",
                "ordering": ("order", "id"),
            },
        ),
        migrations.CreateModel(
            name="HomeTask",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("text", models.TextField()),
                ("order", models.PositiveIntegerField(default=0)),
                ("home", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="tasks", to="uzyol.homecontent")),
            ],
            options={
                "verbose_name": "asosiy vazifa",
                "verbose_name_plural": "asosiy vazifalar",
                "ordering": ("order", "id"),
            },
        ),
        migrations.CreateModel(
            name="Announcement",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("intro", models.TextField()),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("is_active", models.BooleanField(default=True)),
                ("page", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="announcement", to="uzyol.page")),
            ],
            options={
                "verbose_name": "eʼlon",
                "verbose_name_plural": "eʼlonlar",
            },
        ),
        migrations.CreateModel(
            name="AnnouncementItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("text", models.CharField(max_length=255)),
                ("order", models.PositiveIntegerField(default=0)),
                ("announcement", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="items", to="uzyol.announcement")),
            ],
            options={
                "verbose_name": "eʼlon elementi",
                "verbose_name_plural": "eʼlon elementlari",
                "ordering": ("order", "id"),
            },
        ),
    ]
