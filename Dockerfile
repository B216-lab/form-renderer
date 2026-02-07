FROM node:25-bullseye-slim AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm@10.23.0 && \
    pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_DADATA_KEY
ARG VITE_DADATA_API

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_DADATA_KEY=$VITE_DADATA_KEY \
    VITE_DADATA_API=$VITE_DADATA_API

RUN pnpm run build

FROM nginx:stable-alpine3.23-slim

LABEL org.opencontainers.image.title="Geoform" \
    org.opencontainers.image.description="Vue.js application for geodata collection" \
    org.opencontainers.image.version="0.0.0" \
    org.opencontainers.image.vendor="B216" \
    org.opencontainers.image.licenses="GPL-3.0" \
    org.opencontainers.image.authors="Kirill Zhilenkov & B216 Team" \
    org.opencontainers.image.source="https://github.com/b216/manual-geoform" \
    org.opencontainers.image.url="https://github.com/b216/manual-geoform" \
    maintainer="Kirill Zhilenkov & B216 Team"

# Устанавливаем gettext для envsubst (генерация env.js из шаблона)
RUN apk add --no-cache gettext

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем шаблон env.js и entrypoint скрипт для генерации runtime конфигурации
COPY env.template.js /usr/share/nginx/html/env.template.js
COPY docker-entrypoint.d/10-env.sh /docker-entrypoint.d/10-env.sh
RUN chmod +x /docker-entrypoint.d/10-env.sh

EXPOSE 4173
# Генерируем env.js из шаблона при старте контейнера, затем запускаем nginx
CMD ["sh", "-c", "/docker-entrypoint.d/10-env.sh && nginx -g 'daemon off;'"]
