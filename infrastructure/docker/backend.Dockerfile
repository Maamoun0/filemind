FROM node:20-alpine AS base

FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/backend/package.json packages/backend/
COPY packages/shared/package.json packages/shared/
RUN npm install
COPY packages/backend packages/backend
COPY packages/shared packages/shared
RUN npm run build -w @easytool/shared
RUN npm run build -w @easytool/backend

FROM base AS runner
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/backend/package.json packages/backend/
COPY packages/shared/package.json packages/shared/
RUN npm install --omit=dev
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/packages/backend/dist packages/backend/dist
CMD ["npm", "start", "-w", "@easytool/backend"]
