import { sleep } from "../helpers.ts";

/** Simple wait using interval seconds from metadata */
export async function runSchedule(metadata: any, input: any) {
  const seconds = Number(metadata?.interval) || 1;
  console.log(`[schedule] waiting ${seconds}s`);
  await sleep(seconds * 1000);
  return input ?? { ok: true, type: metadata?.type || "interval" };
}
