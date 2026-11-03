#!/bin/bash
# ─────────────────────────────────────────────────────────────
#  deploy.sh — Ubuntu/Debian server uchun to'liq deploy skripti
#  Server: 185.8.213.164 | Ubuntu/Debian | 4GB RAM | 2 CPU | 60GB SSD
#  Subdomain: api.uzyulkuprik.uz
#
#  Ishlatish (serverda root sifatida):
#    bash deploy.sh
#
#  Yoki lokal mashinadan:
#    ssh root@185.8.213.164 'bash -s' < deploy.sh
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# ── Ranglar ───────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log()  { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; exit 1; }

# ── Sozlamalar ────────────────────────────────────────────────
PROJECT_DIR="/opt/uzyolkprik"
DOMAIN="api.uzyulkuprik.uz"
DEPLOY_USER="deployer"
SERVER_IP="185.8.213.164"

echo ""
echo "=============================================="
echo "   Uzyolkoprik — Server Deploy Skripti"
echo "   Domain: $DOMAIN"
echo "   Server: $SERVER_IP"
echo "=============================================="
echo ""

# Root tekshiruvi
if [ "$EUID" -ne 0 ]; then
    err "Bu skript root sifatida ishga tushirilishi kerak: sudo bash deploy.sh"
fi

# ── 1. Tizim yangilash ────────────────────────────────────────
info "1/8 — Tizim yangilanmoqda..."
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq \
    curl wget git nano ufw fail2ban \
    ca-certificates gnupg lsb-release
log "Tizim yangilandi"

# ── 2. Xavfsizlik sozlamalari (Firewall + SSH) ────────────────
info "2/8 — Xavfsizlik sozlanmoqda..."

# UFW Firewall
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable
log "UFW Firewall yoqildi (22, 80, 443)"

# Fail2ban (brute-force himoyasi)
systemctl enable fail2ban --quiet
systemctl start fail2ban
log "Fail2ban yoqildi"

# ── 3. Deploy foydalanuvchisi yaratish ───────────────────────
info "3/8 — Deploy foydalanuvchisi yaratilmoqda..."
if ! id "$DEPLOY_USER" &>/dev/null; then
    useradd -m -s /bin/bash "$DEPLOY_USER"
    usermod -aG docker "$DEPLOY_USER" 2>/dev/null || true
    log "Foydalanuvchi '$DEPLOY_USER' yaratildi"
else
    info "Foydalanuvchi '$DEPLOY_USER' allaqachon mavjud"
fi

# ── 4. Docker o'rnatish ───────────────────────────────────────
info "4/8 — Docker o'rnatilmoqda..."
if ! command -v docker &>/dev/null; then
    # Docker rasmiy repo
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
        | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg

    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
        https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" \
        > /etc/apt/sources.list.d/docker.list

    apt-get update -qq
    apt-get install -y -qq \
        docker-ce docker-ce-cli containerd.io \
        docker-buildx-plugin docker-compose-plugin

    systemctl enable docker --quiet
    systemctl start docker

    # deployer foydalanuvchisini docker guruhiga qo'shish
    usermod -aG docker "$DEPLOY_USER"
    log "Docker o'rnatildi: $(docker --version)"
else
    info "Docker allaqachon o'rnatilgan: $(docker --version)"
fi

# docker-compose standalone ham kerak (Makefile uchun)
if ! command -v docker-compose &>/dev/null; then
    apt-get install -y -qq docker-compose
    log "docker-compose o'rnatildi"
fi

# ── 5. Certbot o'rnatish ──────────────────────────────────────
info "5/8 — Certbot (Let's Encrypt) o'rnatilmoqda..."
if ! command -v certbot &>/dev/null; then
    apt-get install -y -qq certbot python3-certbot-nginx
    log "Certbot o'rnatildi"
else
    info "Certbot allaqachon o'rnatilgan"
fi

# ── 6. Loyiha papkasi va ruxsatlar ───────────────────────────
info "6/8 — Loyiha papkasi tayyorlanmoqda..."
mkdir -p "$PROJECT_DIR"
mkdir -p "$PROJECT_DIR/nginx/ssl"

# .env.production mavjudligini tekshirish
if [ ! -f "$PROJECT_DIR/.env.production" ]; then
    err ".env.production fayli topilmadi!

Quyidagi buyruq bilan LOKAL mashinangizdan serverga ko'chiring:
  scp /Users/said/PycharmProjects/uzyolkprik/.env.production root@${SERVER_IP}:${PROJECT_DIR}/

Yoki serverda qo'lda yarating:
  nano ${PROJECT_DIR}/.env.production"
fi

# Fayl ruxsatlarini cheklash
chmod 600 "$PROJECT_DIR/.env.production"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$PROJECT_DIR"
log "Papka ruxsatlari sozlandi"

# ── 7. Docker build va ishga tushirish ───────────────────────
info "7/8 — Docker build qilinmoqda..."
cd "$PROJECT_DIR"

# Eski konteynerlarni to'xtatish (agar mavjud bo'lsa)
docker-compose down 2>/dev/null || true

# Build va ishga tushirish
docker-compose build --no-cache
docker-compose up -d

# Konteynerlar tayyor bo'lguncha kutish
info "Konteynerlar ishga tushishi kutilmoqda (30 soniya)..."
sleep 30

# Holat tekshirish
docker-compose ps
log "Konteynerlar ishga tushdi"

# ── 8. SSL Sertifikat ─────────────────────────────────────────
info "8/8 — SSL sertifikat..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
warn "DNS ni tekshiring: $DOMAIN → $SERVER_IP"
warn "DNS tayyor bo'lgandan so'ng SSL oling:"
echo ""
echo "  certbot --nginx -d $DOMAIN"
echo ""
warn "nginx.conf da SSL sertifikat yo'lini yangilang:"
echo "  ssl_certificate     /etc/letsencrypt/live/$DOMAIN/fullchain.pem;"
echo "  ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;"
echo ""
warn "So'ng nginx ni qayta ishga tushiring:"
echo "  docker-compose restart nginx"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── Yakuniy ma'lumot ──────────────────────────────────────────
echo ""
echo "=============================================="
log "Deploy muvaffaqiyatli tugadi!"
echo ""
echo "  🌐 API:     https://$DOMAIN/api/"
echo "  🔧 Admin:   https://$DOMAIN/admin/"
echo "  📖 Swagger: https://$DOMAIN/swagger/"
echo ""
echo "  📋 Loglar:  docker-compose logs -f"
echo "  📊 Status:  docker-compose ps"
echo "  🔄 Restart: docker-compose restart"
echo "  🛑 Stop:    docker-compose down"
echo ""
warn "Admin parolini birinchi kirishda o'zgartiring!"
warn "  https://$DOMAIN/admin/ → Foydalanuvchilar → admin → Parolni o'zgartirish"
echo "=============================================="
