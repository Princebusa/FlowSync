FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json package-lock.json bun.lock* ./
COPY apps/engine/package.json ./apps/engine/
COPY packages/db/package.json ./packages/db/
COPY packages/queue/package.json ./packages/queue/

RUN bun install --frozen-lockfile

COPY packages/db ./packages/db
COPY packages/queue ./packages/queue
COPY apps/engine ./apps/engine

RUN bun run --cwd packages/queue build && \
    bun run --cwd packages/db build && \
    bun run --cwd apps/engine build

FROM oven/bun:1-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json bun.lock* ./
COPY apps/engine/package.json ./apps/engine/
COPY packages/db/package.json ./packages/db/
COPY packages/queue/package.json ./packages/queue/

RUN bun install --frozen-lockfile --production

COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/queue/dist ./packages/queue/dist
COPY --from=builder /app/apps/engine/dist ./apps/engine/dist

WORKDIR /app/apps/engine

CMD ["bun", "dist/index.js"]
