# syntax=docker/dockerfile:1
FROM node:25-bullseye-slim

ENV NODE_ENV=production
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g corepack; \
    corepack enable; \
    corepack install; \
    pnpm install --frozen-lockfile;

COPY . .

RUN pnpm run build

EXPOSE 4173

CMD pnpm run preview --host 0.0.0.0 --port 4173
