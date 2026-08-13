FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/client/package.json ./apps/client/
COPY apps/engine/package.json ./apps/engine/
COPY packages/comman/package.json ./packages/comman/
COPY packages/db/package.json ./packages/db/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/queue/package.json ./packages/queue/
COPY packages/typescript-config/package.json ./packages/typescript-config/

RUN bun install --frozen-lockfile

COPY packages/comman ./packages/comman
COPY packages/db ./packages/db
COPY packages/queue ./packages/queue
COPY apps/backend ./apps/backend

RUN bunx tsc -p packages/comman/tsconfig.json && \
    bun run --cwd packages/queue build && \
    bun run --cwd packages/db build && \
    bun run --cwd apps/backend build

FROM oven/bun:1-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json bun.lock ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/client/package.json ./apps/client/
COPY apps/engine/package.json ./apps/engine/
COPY packages/comman/package.json ./packages/comman/
COPY packages/db/package.json ./packages/db/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/queue/package.json ./packages/queue/
COPY packages/typescript-config/package.json ./packages/typescript-config/

RUN bun install --frozen-lockfile --production

COPY --from=builder /app/packages/comman/dist ./packages/comman/dist
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/queue/dist ./packages/queue/dist
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend

EXPOSE 2000

CMD ["bun", "dist/index.js"]
