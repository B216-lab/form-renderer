FROM node:25-bullseye-slim AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

# Install pnpm globally and then dependencies for build
RUN npm install -g pnpm@10.23.0 && \
    pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_DADATA_KEY
ARG VITE_DADATA_API

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_DADATA_KEY=$VITE_DADATA_KEY
ENV VITE_DADATA_API=$VITE_DADATA_API

RUN pnpm run build

FROM node:25-bullseye

LABEL org.opencontainers.image.title="Geoform" \
    org.opencontainers.image.description="Vue.js application for geodata collection" \
    org.opencontainers.image.version="0.0.0" \
    org.opencontainers.image.vendor="B216" \
    org.opencontainers.image.licenses="GPL-3.0" \
    org.opencontainers.image.authors="Kirill Zhilenkov & B216 Team" \
    org.opencontainers.image.source="https://github.com/b216/manual-geoform" \
    org.opencontainers.image.url="https://github.com/b216/manual-geoform" \
    maintainer="Kirill Zhilenkov & B216 Team"

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4173

WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-lock.yaml* ./

RUN npm install -g pnpm@10.23.0 && \
    pnpm install --frozen-lockfile --prod && \
    pnpm add -D vite@latest


COPY --from=builder /app/dist ./dist

# default port
EXPOSE 4173

CMD ["sh", "-c", "pnpm run preview --host ${HOST} --port ${PORT}"]
