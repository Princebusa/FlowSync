import { sleep } from "../helpers.ts";

/** Wait for N seconds, then pass data through */
export async function runTimer(metadata: any, input: any) {
  const seconds = Number(metadata?.time) || 1;
  console.log(`[timer] waiting ${seconds}s`);
  await sleep(seconds * 1000);
  return input ?? { ok: true };
}
