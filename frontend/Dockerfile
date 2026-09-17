# ─────────────────────────────────────────
#  React Frontend Dockerfile
#  Multi-stage: build → nginx serve
# ─────────────────────────────────────────

# === 1-bosqich: React build ===
FROM node:20-alpine AS builder

WORKDIR /app

# Dependencies o'rnatish (cache uchun avval package.json)
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Loyiha kodini ko'chirish va build qilish
COPY . .
RUN npm run build


# === 2-bosqich: Nginx bilan serve ===
FROM nginx:1.27-alpine AS production

# Build natijasini Nginx'ning html papkasiga ko'chirish
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx konfiguratsiya (SPA routing uchun)
COPY ../nginx/nginx-frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
