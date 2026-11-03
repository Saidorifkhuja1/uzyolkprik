#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  deploy.sh — Ubuntu/Debian server uchun to'liq deploy skripti
#  Server: 185.8.213.164 | 4GB RAM | 2 CPU | 60GB SSD
#  Domain:  api.uzyulkuprik.uz
#
#  Ishlatish:
#    bash deploy.sh
#
#  Eslatma: Ishga tushirishdan oldin .env.production faylini
#  /opt/uzyolkprik/ papkasiga ko'chiring:
#    scp .env.production root@185.8.213.164:/opt/uzyolkprik/
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# ── Ranglar ───────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; exit 1; }

# ── Sozlamalar ─────────────────────────────────────────────────
PROJECT_DIR="/opt/uzyolkprik"
DOMAIN="api.uzyulkuprik.uz"
# GitHub repo manzilingizni o'zgartiring:
GITHUB_REPO="https://github.com/Saidorifkhuja1/uzyolkprik.git"

echo ""
echo "================================================"
echo "   Uzyolkoprik — Server Deploy Skripti"
echo "   Domain: $DOMAIN"
echo "================================================"
echo ""

[ "$EUID" -ne 0 ] && err "Root sifatida ishga tushiring: sudo bash deploy.sh"

# ── 1. Tizim paketlari ─────────────────────────────────────────
info "1/7 — Tizim paketlari o'rnatilmoqda..."
apt-get update -qq
apt-get install -y -qq curl wget git ufw fail2ban ca-certificates gnupg lsb-release
log "Tizim paketlari tayyor"

# ── 2. Xavfsizlik — Firewall ───────────────────────────────────
info "2/7 — Firewall sozlanmoqda..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
systemctl enable fail2ban --quiet && systemctl start fail2ban
log "UFW (22,80,443) va Fail2ban yoqildi"

# ── 3. Docker o'rnatish ────────────────────────────────────────
info "3/7 — Docker o'rnatilmoqda..."
if ! command -v docker &>/dev/null; then
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
        | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
        https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
        > /etc/apt/sources.list.d/docker.list
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    systemctl enable docker --quiet && systemctl start docker
    log "Docker o'rnatildi: $(docker --version)"
else
    info "Docker mavjud: $(docker --version)"
fi

# ── 4. Loyihani olish (GitHub) ────────────────────────────────
info "4/7 — Loyiha kodi olinmoqda..."
mkdir -p "$PROJECT_DIR"

if [ ! -d "$PROJECT_DIR/.git" ]; then
    if [ "$GITHUB_REPO" = "https://github.com/YOUR_USERNAME/YOUR_REPO.git" ]; then
        err "deploy.sh ichidagi GITHUB_REPO o'zgaruvchisini o'zgartiring!"
    fi
    git clone "$GITHUB_REPO" "$PROJECT_DIR"
    log "Repo clone qilindi: $PROJECT_DIR"
fi

cd "$PROJECT_DIR"
git pull origin main
log "Repo yangilandi"

cd "$PROJECT_DIR"

# .env.production mavjudligini tekshirish
if [ ! -f ".env.production" ]; then
    err ".env.production fayli yo'q!
Lokal mashinangizdan ko'chiring:
  scp .env.production root@185.8.213.164:${PROJECT_DIR}/"
fi
chmod 600 .env.production
log ".env.production topildi"

# ── 5. Let's Encrypt SSL ───────────────────────────────────────
info "5/7 — SSL sertifikat tekshirilmoqda..."

if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    # DNS tekshiruvi
    RESOLVED_IP=$(dig +short "$DOMAIN" 2>/dev/null | head -1 || true)
    if [ "$RESOLVED_IP" != "185.8.213.164" ]; then
        warn "DNS hali yo'nalmagan: $DOMAIN → '$RESOLVED_IP' (185.8.213.164 bo'lishi kerak)"
        warn "SSL o'tkazib yuborildi. DNS tayyor bo'lgach qo'lda ishga tushiring:"
        warn "  apt install certbot -y && certbot certonly --standalone -d $DOMAIN"
    else
        apt-get install -y -qq certbot
        # 80-port bo'sh bo'lishi kerak (nginx hali ishga tushmagan)
        certbot certonly --standalone -d "$DOMAIN" \
            --non-interactive --agree-tos \
            --email admin@uzyolkoprik.uz \
            --no-eff-email
        log "SSL sertifikat olindi: /etc/letsencrypt/live/$DOMAIN/"

        # Avtomatik yangilash uchun cron
        CRON_JOB="0 3 * * * certbot renew --pre-hook \"docker compose -f ${PROJECT_DIR}/docker-compose.yml --env-file ${PROJECT_DIR}/.env.production stop nginx\" --post-hook \"docker compose -f ${PROJECT_DIR}/docker-compose.yml --env-file ${PROJECT_DIR}/.env.production start nginx\" >> /var/log/certbot-renew.log 2>&1"
        (crontab -l 2>/dev/null | grep -v "certbot renew"; echo "$CRON_JOB") | crontab -
        log "Certbot avtomatik yangilash cron'ga qo'shildi"
    fi
else
    info "SSL sertifikat allaqachon mavjud"
fi

# ── 6. Docker Compose bilan Deploy ───────────────────────────
info "6/7 — Docker build va ishga tushirish..."
docker compose --env-file .env.production down 2>/dev/null || true
docker compose --env-file .env.production build --no-cache
docker compose --env-file .env.production up -d

info "Konteynerlar ishga tushishi kutilmoqda (45 soniya)..."
sleep 45
docker compose --env-file .env.production ps

# ── 7. Tekshiruv ──────────────────────────────────────────────
info "7/7 — Sog'lomlik tekshiruvi..."
HTTP_CODE=$(curl -sk -o /dev/null -w "%{http_code}" "http://localhost/api/site/" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    log "API javob bermoqda (HTTP $HTTP_CODE)"
else
    warn "API javobi: HTTP $HTTP_CODE — loglarni tekshiring: docker compose logs backend"
fi

echo ""
echo "================================================"
log "Deploy tugadi!"
echo ""
echo "  🌐 API:     https://$DOMAIN/api/"
echo "  🔧 Admin:   https://$DOMAIN/admin/"
echo "  📖 Swagger: https://$DOMAIN/swagger/"
echo ""
echo "  📋 Loglar:  docker compose --env-file .env.production logs -f"
echo "  📊 Status:  docker compose --env-file .env.production ps"
echo ""
warn "Admin parolini birinchi kirishda o'zgartiring!"
echo "================================================"
