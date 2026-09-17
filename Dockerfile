# ─────────────────────────────────────────
#  Django Backend Dockerfile
#  Multi-stage: build → production
# ─────────────────────────────────────────

# === 1-bosqich: dependencies ===
FROM python:3.12-slim AS builder

WORKDIR /app

# Tizim paketlari (PostgreSQL va Pillow uchun)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libjpeg-dev \
    libpng-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir --prefix=/install -r requirements.txt


# === 2-bosqich: production image ===
FROM python:3.12-slim AS production

WORKDIR /app

# Faqat zarur tizim paketlari
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    libjpeg62-turbo \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Builder dan o'rnatilgan paketlarni ko'chirish
COPY --from=builder /install /usr/local

# Loyiha fayllarini ko'chirish
COPY . .

# Static va media papkalar
RUN mkdir -p /app/staticfiles /app/media

# Foydalanuvchi (root bo'lmagan)
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
RUN chown -R appuser:appgroup /app
USER appuser

# Entrypoint skript
COPY entrypoint.sh /entrypoint.sh
USER root
RUN chmod +x /entrypoint.sh
USER appuser

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
