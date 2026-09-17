#!/bin/bash
# ─────────────────────────────────────────
#  Django entrypoint.sh
#  Container ishga tushganda bajariladigan skript
# ─────────────────────────────────────────

set -e  # Biror xato bo'lsa darhol to'xta

echo "=========================================="
echo "  Uzyolkoprik Backend — Ishga tushyapti"
echo "=========================================="

# Ma'lumotlar bazasi tayyor bo'lguncha kutish
echo "⏳ PostgreSQL ga ulanish kutilmoqda..."
python << 'PYEOF'
import os, time, psycopg2

host = os.environ.get("DB_HOST", "db")
port = int(os.environ.get("DB_PORT", 5432))
dbname = os.environ.get("DB_NAME", "uzyolkprik")
user = os.environ.get("DB_USER", "postgres")
password = os.environ.get("DB_PASSWORD", "")

for attempt in range(1, 31):
    try:
        conn = psycopg2.connect(
            host=host, port=port,
            dbname=dbname, user=user, password=password,
            connect_timeout=3
        )
        conn.close()
        print(f"✅ PostgreSQL tayyor! ({attempt}-urinish)")
        break
    except Exception as e:
        print(f"⏳ Urinish {attempt}/30: {e}")
        time.sleep(2)
else:
    print("❌ PostgreSQL ga ulanib bo'lmadi. Chiqilmoqda.")
    exit(1)
PYEOF

# Migratsiyalar
echo ""
echo "📦 Migratsiyalar qo'llanilmoqda..."
python manage.py migrate --noinput

# Static fayllar
echo ""
echo "📂 Static fayllar yig'ilmoqda..."
python manage.py collectstatic --noinput --clear

# Avtomatik Superuser yaratish
echo ""
echo "👤 Superuser tekshirilmoqda..."
python << 'PYEOF'
import django
django.setup()
from django.contrib.auth import get_user_model

User = get_user_model()
username = "admin"
password = "admin123"

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, password=password, email="admin@uzyolkoprik.uz")
    print(f"✅ Superuser yaratildi: {username} / {password}")
else:
    print(f"ℹ️  Superuser '{username}' allaqachon mavjud — o'tkazib yuborildi.")
PYEOF

echo ""
echo "✅ Tayyorlik tugadi. Gunicorn ishga tushmoqda..."
echo ""

# Gunicorn bilan ishga tushirish
exec gunicorn core.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers ${GUNICORN_WORKERS:-3} \
    --worker-class sync \
    --timeout ${GUNICORN_TIMEOUT:-120} \
    --keep-alive 5 \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --log-level ${GUNICORN_LOG_LEVEL:-info} \
    --access-logfile - \
    --error-logfile - \
    --forwarded-allow-ips='*'
