# syntax=docker/dockerfile:1
FROM node:23.8.0-bullseye-slim

ARG BUILD_ENV=production
ENV NODE_ENV=${BUILD_ENV}

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

RUN pnpm install --frozen-lockfile

COPY . .

RUN if [ "$BUILD_ENV" = "production" ]; then pnpm run build; fi

EXPOSE 5173

CMD if [ "$NODE_ENV" = "production" ]; then pnpm run preview --host; else pnpm run dev --host; fi
