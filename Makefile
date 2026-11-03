# ─────────────────────────────────────────────────────────────
#  Makefile — Deploy buyruqlari
#  Ishlatish: make <buyruq>
# ─────────────────────────────────────────────────────────────

ENV_FILE = .env.production
DC = docker compose --env-file $(ENV_FILE)

.PHONY: help build up down logs shell migrate collectstatic superuser restart clean backup

help:
	@echo ""
	@echo "Uzyolkoprik Deploy Buyruqlari"
	@echo "══════════════════════════════════════"
	@echo "  make build          - Docker imagelarni build qilish"
	@echo "  make up             - Barcha servislarni ishga tushirish"
	@echo "  make down           - Servislarni to'xtatish"
	@echo "  make restart        - Qayta ishga tushirish"
	@echo "  make logs           - Barcha loglar"
	@echo "  make logs-backend   - Backend loglari"
	@echo "  make logs-nginx     - Nginx loglari"
	@echo "  make shell          - Django shellga kirish"
	@echo "  make migrate        - Migratsiyalar"
	@echo "  make collectstatic  - Static fayllar"
	@echo "  make superuser      - Superuser yaratish"
	@echo "  make backup         - Ma'lumotlar bazasi backup"
	@echo "  make clean          - Keraksiz imagelarni tozalash"
	@echo ""

# Build
build:
	$(DC) build --no-cache

# Production ishga tushirish
up:
	$(DC) up -d
	@echo "✅ Servislar ishga tushdi!"
	@echo "   API:     https://api.uzyulkuprik.uz/api/"
	@echo "   Admin:   https://api.uzyulkuprik.uz/admin/"
	@echo "   Swagger: https://api.uzyulkuprik.uz/swagger/"

# Build + Up (bitta buyruq)
deploy:
	$(DC) up -d --build
	@echo "✅ Deploy tugadi!"

# To'xtatish
down:
	$(DC) down

# Qayta ishga tushirish
restart:
	$(DC) restart

# Barcha loglar
logs:
	$(DC) logs -f --tail=100

# Backend loglari
logs-backend:
	$(DC) logs -f backend --tail=100

# Nginx loglari
logs-nginx:
	$(DC) logs -f nginx --tail=100

# Django shell
shell:
	$(DC) exec backend python manage.py shell

# Migratsiyalar
migrate:
	$(DC) exec backend python manage.py migrate

# Static fayllar
collectstatic:
	$(DC) exec backend python manage.py collectstatic --noinput

# Superuser yaratish (qo'lda)
superuser:
	$(DC) exec backend python manage.py createsuperuser

# Konteyner holati
status:
	$(DC) ps

# Ma'lumotlar bazasi backup
backup:
	@mkdir -p backups
	$(DC) exec db pg_dump -U $${DB_USER:-uzyolkprik_user} $${DB_NAME:-uzyolkprik} \
		> backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@gzip backups/backup_*.sql 2>/dev/null || true
	@echo "✅ Backup saqlandi: backups/"

# Tozalash
clean:
	docker system prune -f
	docker volume prune -f

# Development rejimi
dev:
	docker compose -f docker-compose.dev.yml up

dev-build:
	docker compose -f docker-compose.dev.yml up --build

dev-down:
	docker compose -f docker-compose.dev.yml down
