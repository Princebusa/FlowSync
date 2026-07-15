
import { Redis } from "ioredis";


export const QUEUE_NAME = "workflow-queue";


export type Job = {
  executionId: string;
  workflowId: string;
  userId: string;
};


let redis: Redis | null = null;


export function getRedis(): Redis {
  if (redis) return redis;

  const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";
  redis = new Redis(url);

  redis.on("error", (err: Error) => {
    console.error("Redis error:", err.message);
  });

  return redis;
}


export async function addJob(job: Job): Promise<void> {
  const client = getRedis();
  const data = JSON.stringify(job);
  await client.rpush(QUEUE_NAME, data);
}


export async function takeJob(timeoutSeconds = 0): Promise<Job | null> {
  const client = getRedis();

  const result = await client.blpop(QUEUE_NAME, timeoutSeconds);

  if (!result) return null;

  const json = result[1];
  return JSON.parse(json) as Job;
}


export async function removeJob(executionId: string): Promise<boolean> {
  const client = getRedis();
  const items = await client.lrange(QUEUE_NAME, 0, -1);

  for (const item of items) {
    try {
      const job = JSON.parse(item) as Job;
      if (job.executionId === executionId) {
       
        const removed = await client.lrem(QUEUE_NAME, 1, item);
        return removed > 0;
      }
    } catch {
      // skip bad JSON
    }
  }

  return false;
}

/** Close Redis when shutting down */
export async function closeRedis(): Promise<void> {
  if (!redis) return;
  await redis.quit();
  redis = null;
}
