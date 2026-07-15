import { takeJob } from "queue";
import { runWorkflow } from "./runner";

/**
 * Forever loop:
 * 1. Wait for a job from Redis
 * 2. Run that workflow
 * 3. Repeat
 */
export async function startWorker() {
  console.log("Engine worker started — waiting for jobs...");

  while (true) {
    try {
      // Wait up to 5 seconds for a job
      const job = await takeJob(5);

      if (!job) {
        continue;
      }

      console.log("Got job:", job);

      await runWorkflow(job.executionId, job.workflowId);
    } catch (err: any) {
      console.error("Worker error:", err.message);
      // Small pause so we don't spam logs if Redis is down
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}
