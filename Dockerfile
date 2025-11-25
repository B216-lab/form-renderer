# syntax=docker/dockerfile:1
FROM node:23.8.0-bullseye-slim

ENV NODE_ENV=production

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 4173

CMD pnpm run preview --host 0.0.0.0 --port 4173
