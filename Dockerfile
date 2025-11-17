# https://pnpm.io/docker
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app
COPY package.json /app/package.json
COPY pnpm-lock.yaml /app/pnpm-lock.yaml
RUN pnpm fetch --prod

FROM base AS prod
RUN pnpm install --prod --frozen-lockfile

FROM base AS builder
COPY . /app
RUN pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:24-alpine
ENV NODE_ENV=production
COPY --from=prod /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
EXPOSE 8080
CMD ["node", "dist"]
