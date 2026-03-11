FROM node:20-alpine AS base

FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/frontend/package.json packages/frontend/
RUN npm install
COPY packages/frontend packages/frontend
WORKDIR /app/packages/frontend
RUN npm run build

FROM base AS runner
WORKDIR /app/packages/frontend
ENV NODE_ENV production
# NOTE: Need to enable output standalone in next.config.mjs
COPY --from=builder /app/packages/frontend/public ./public
COPY --from=builder /app/packages/frontend/.next/standalone ./
COPY --from=builder /app/packages/frontend/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
