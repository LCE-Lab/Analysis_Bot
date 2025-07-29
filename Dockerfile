FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --immutable && mv node_modules ../

COPY . .
EXPOSE 8080
CMD ["node", "./dist/index.js"]
