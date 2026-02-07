Issues in this production Dockerfile:

## Major Issues:

### 1. **CMD uses shell form with env vars (Line 50)**
```dockerfile
CMD ["sh", "-c", "pnpm run preview --host ${HOST} --port ${PORT}"]
```
- Shell form loses proper signal handling (SIGTERM/SIGINT)
- Environment variables won't expand in exec form `["..."]`
- Use an entrypoint script instead

### 2. **Inefficient layer structure (Lines 41-43)**
```dockerfile
RUN pnpm install --frozen-lockfile --prod
RUN pnpm add -D vite@latest
```
- Two separate RUN commands create unnecessary layers
- Should be combined into one RUN

### 3. **Unpinned dependency version (Line 43)**
```dockerfile
RUN pnpm add -D vite@latest
```
- `@latest` is not reproducible
- Pin to a specific version

### 4. **Running as root user**
- Security risk: container runs as root
- Should create and use a non-root user

### 5. **No healthcheck**
- No way to verify container health
- Should add HEALTHCHECK instruction

## Minor Issues:

### 6. **EXPOSE doesn't match variable (Line 48)**
- EXPOSE is hardcoded to 4173, but PORT can be changed via env var
- This is documentation only, but could be confusing

### 7. **Could optimize base image**
- Both stages use `node:25-bullseye-slim`
- Final stage could use `node:25-alpine` for smaller size (if compatible)

## Recommended Fixes:

```dockerfile
FROM node:25-bullseye-slim AS builder
WORKDIR /app
RUN npm install -g corepack && corepack enable && corepack install
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:25-bullseye-slim

LABEL org.opencontainers.image.title="Geoform" \
    org.opencontainers.image.description="Vue.js application for geodata collection" \
    org.opencontainers.image.version="0.0.0" \
    org.opencontainers.image.vendor="B216" \
    org.opencontainers.image.licenses="GPL-3.0" \
    org.opencontainers.image.authors="Kirill Zhilenkov & B216 Team" \
    org.opencontainers.image.source="https://github.com/b216/manual-geoform" \
    org.opencontainers.image.url="https://github.com/b216/manual-geoform" \
    maintainer="Kirill Zhilenkov & B216 Team"

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

RUN npm install -g corepack && corepack enable && corepack install

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4173

WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-lock.yaml* ./

# Install production deps + vite in one layer
RUN pnpm install --frozen-lockfile --prod && \
    pnpm add -D vite@7.1.7 && \
    chown -R appuser:appuser /app

COPY --from=builder /app/dist ./dist

# Entrypoint script for proper signal handling
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 4173

USER appuser

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:${PORT:-4173}', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["/entrypoint.sh"]
```

And create `docker-entrypoint.sh`:
```bash
#!/bin/sh
set -e
exec pnpm run preview --host "${HOST:-0.0.0.0}" --port "${PORT:-4173}"
```

Most critical: fix the CMD issue and add a non-root user.