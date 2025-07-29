FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable

COPY . .
RUN yarn install --immutable

EXPOSE 8080
CMD ["node", "dist"]
