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

# Nginx konfiguratsiya (SPA routing uchun) — inline yoziladi
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    # React SPA routing\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    # Static assetlar uchun uzoq cache\n\
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {\n\
        expires 30d;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
