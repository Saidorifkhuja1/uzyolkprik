from django.db import migrations


def add_ishlarimiz_navigation(apps, schema_editor):
    NavigationItem = apps.get_model("uzyol", "NavigationItem")
    Page = apps.get_model("uzyol", "Page")

    # 1. Asosiy sahifa (ishlarimiz) mavjudligini ta'minlash
    if not Page.objects.filter(slug="ishlarimiz").exists():
        Page.objects.create(
            slug="ishlarimiz",
            title="Ishlarimiz",
            type="document",
            status="Klaster tomonidan amalga oshirilgan va davom etayotgan asosiy ishlar va loyihalar.",
            is_active=True,
            order=4,
        )

    # 2. Menyu elementi (NavigationItem) 'Korxona haqida' ostiga qo'shish
    parent = NavigationItem.objects.filter(slug="korxona-haqida").first()
    if parent:
        NavigationItem.objects.update_or_create(
            slug="ishlarimiz",
            defaults={
                "label": "Ishlarimiz",
                "parent": parent,
                "order": 3,
                "is_active": True,
            },
        )


def remove_ishlarimiz_navigation(apps, schema_editor):
    NavigationItem = apps.get_model("uzyol", "NavigationItem")
    NavigationItem.objects.filter(slug="ishlarimiz").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("uzyol", "0022_ishlarimiz_alter_elonlarproduct_options_and_more"),
    ]

    operations = [
        migrations.RunPython(add_ishlarimiz_navigation, remove_ishlarimiz_navigation),
    ]

