# Engine worker

Takes jobs from the Redis queue and runs workflows.

## Structure

```
src/
  index.ts      start here
  config.ts     env vars
  db.ts         Mongo connection
  worker.ts     queue loop (take job → run)
  runner.ts     run one workflow
  graph.ts      sort nodes in order
  cancel.ts     check Stop
  status.ts     tell backend (live UI)
  helpers.ts    sleep + template fill
  nodes/        one file per node type
```

## Run

1. Redis + Mongo + backend must be running
2. Copy `.env.example` to `.env`
3. Start:

```bash
cd apps/engine
bun run dev
```

## Flow

```
Redis job → load workflow → sort nodes → run each node → update Mongo + UI
```
