FROM node:22-alpine
ENV NODE_ENV=production
RUN corepack enable
WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --production --immutable && mv node_modules ../
COPY . .
EXPOSE 8080
CMD ["node", "./dist/index.js"]
