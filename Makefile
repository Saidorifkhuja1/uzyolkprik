# ─────────────────────────────────────────────────────────────
#  Makefile — Deploy buyruqlari
#  Ishlatish: make <buyruq>
# ─────────────────────────────────────────────────────────────

.PHONY: help build up down logs shell migrate collectstatic createsuperuser restart clean

help:
	@echo ""
	@echo "Uzyolkoprik Deploy Buyruqlari"
	@echo "══════════════════════════════════════"
	@echo "  make build          - Docker imagelarni build qilish"
	@echo "  make up             - Barcha servislarni ishga tushirish"
	@echo "  make down           - Servislarni to'xtatish"
	@echo "  make restart        - Qayta ishga tushirish"
	@echo "  make logs           - Loglarni ko'rish"
	@echo "  make shell          - Django shellga kirish"
	@echo "  make migrate        - Migratsiyalar"
	@echo "  make collectstatic  - Static fayllar"
	@echo "  make superuser      - Superuser yaratish"
	@echo "  make backup         - Ma'lumotlar bazasi backup"
	@echo "  make clean          - Keraksiz imagelarni tozalash"
	@echo ""

# Build
build:
	docker-compose build --no-cache

# Production ishga tushirish
up:
	docker-compose up -d
	@echo "✅ Servislar ishga tushdi!"
	@echo "   Frontend: https://localhost"
	@echo "   Admin:    https://localhost/admin/"
	@echo "   API:      https://localhost/api/"

# To'xtatish
down:
	docker-compose down

# Qayta ishga tushirish
restart:
	docker-compose restart

# Loglar
logs:
	docker-compose logs -f --tail=100

# Backend loglari
logs-backend:
	docker-compose logs -f backend --tail=100

# Nginx loglari
logs-nginx:
	docker-compose logs -f nginx --tail=100

# Django shell
shell:
	docker-compose exec backend python manage.py shell

# Migratsiyalar (odatda entrypoint.sh da bajariladi)
migrate:
	docker-compose exec backend python manage.py migrate

# Static fayllar
collectstatic:
	docker-compose exec backend python manage.py collectstatic --noinput

# Superuser yaratish
superuser:
	docker-compose exec backend python manage.py createsuperuser

# Ma'lumotlar bazasi backup
backup:
	@mkdir -p backups
	docker-compose exec db pg_dump -U $${DB_USER:-postgres} $${DB_NAME:-uzyolkprik} | gzip > backups/backup_$$(date +%Y%m%d_%H%M%S).sql.gz
	@echo "✅ Backup saqlandi: backups/"

# Restore
restore:
	@echo "Restore qilmoqchi bo'lsangiz: zcat backups/FILENAME.sql.gz | docker-compose exec -T db psql -U postgres uzyolkprik"

# Tozalash
clean:
	docker system prune -f
	docker volume prune -f

# Development rejimida ishga tushirish
dev:
	docker-compose -f docker-compose.dev.yml up

dev-build:
	docker-compose -f docker-compose.dev.yml up --build

dev-down:
	docker-compose -f docker-compose.dev.yml down
