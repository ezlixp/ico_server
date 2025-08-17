FROM node:22-slim AS base
WORKDIR /usr/local/app

FROM base AS backend-deps
COPY package*.json ./
RUN npm ci

# TODO: use env injection
FROM backend-deps AS backend-build
COPY tsconfig.json ./
COPY .env.* ./
COPY src ./src
RUN npx tsc

FROM backend-build AS backend-test
COPY jest.config.json ./
COPY test ./test
RUN npm test

FROM base AS backend-prod-deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force


FROM backend-build AS backend-dev
CMD ["npm", "run", "dev"]

FROM node:22-slim AS backend-final
WORKDIR /usr/local/app
ENV NODE_ENV=production

COPY --from=backend-prod-deps /usr/local/app/node_modules ./node_modules
COPY --from=backend-build /usr/local/app/dist/src ./dist
COPY .env.production ./

EXPOSE 3000
CMD ["node", "dist/index.js"]
