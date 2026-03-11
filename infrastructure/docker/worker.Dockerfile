FROM node:20-alpine AS base

FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/worker/package.json packages/worker/
COPY packages/shared/package.json packages/shared/
RUN npm install
COPY packages/worker packages/worker
COPY packages/shared packages/shared
RUN npm run build -w @easytool/shared
RUN npm run build -w @easytool/worker

FROM base AS runner
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/worker/package.json packages/worker/
COPY packages/shared/package.json packages/shared/
RUN npm install --omit=dev
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/packages/worker/dist packages/worker/dist
CMD ["npm", "start", "-w", "@easytool/worker"]
