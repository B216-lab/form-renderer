# syntax=docker/dockerfile:1.9

ARG NODE_VERSION=23.8.0
ARG PNPM_VERSION=10.13.1
ARG GIT_VERSION="1:2.30.2-1+deb11u2"
ARG DUMB_INIT_VERSION="1.2.5-1"

FROM node:${NODE_VERSION}-bullseye-slim

ENV PNPM_HOME=/opt/pnpm \
    PNPM_VERSION=${PNPM_VERSION} \
    PNPM_STORE_PATH=/pnpm-store \
    APP_HOME=/workspace

RUN set -eux; \
    apt-get update; \
    apt-get install --no-install-recommends -y git=${GIT_VERSION} dumb-init=${DUMB_INIT_VERSION}; \
    rm -rf /var/lib/apt/lists/*; \
    corepack enable; \
    corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR ${APP_HOME}

COPY docker/entrypoints/dev-entrypoint.sh /usr/local/bin/dev-entrypoint
RUN chmod +x /usr/local/bin/dev-entrypoint

ENTRYPOINT ["dumb-init", "/usr/local/bin/dev-entrypoint"]
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]

