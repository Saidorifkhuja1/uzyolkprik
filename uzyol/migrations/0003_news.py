from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("uzyol", "0002_structured_site_models"),
    ]

    operations = [
        migrations.CreateModel(
            name="News",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("slug", models.SlugField(max_length=128, unique=True)),
                ("summary", models.TextField(blank=True)),
                ("body", models.TextField()),
                ("image_url", models.URLField(blank=True, max_length=2000)),
                ("published_at", models.DateTimeField()),
                ("is_active", models.BooleanField(default=True)),
            ],
            options={
                "verbose_name": "yangilik",
                "verbose_name_plural": "yangiliklar",
                "ordering": ("-published_at", "id"),
            },
        ),
    ]
