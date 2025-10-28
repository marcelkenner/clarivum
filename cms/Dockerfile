# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=20.12.2

FROM node:${NODE_VERSION}-bullseye-slim AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
ENV NODE_ENV=development
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM base AS prod-deps
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM base AS runtime
LABEL org.opencontainers.image.source="https://github.com/clarivum/clarivum"
LABEL org.opencontainers.image.description="Clarivum Strapi CMS"
LABEL org.opencontainers.image.licenses="MIT"

ENV NODE_ENV=production \
    PORT=1337 \
    HOST=0.0.0.0

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app ./

EXPOSE 1337
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -fsS http://localhost:${PORT}/_health || exit 1

CMD ["npm", "run", "start"]
