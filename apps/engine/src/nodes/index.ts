import { runTimer } from "./timer.ts";
import { runSchedule } from "./schedule.ts";
import { runWebhook } from "./webhook.ts";
import { runHttpRequest } from "./http-request.ts";
import { runMail } from "./mail.ts";

/** Pick the right function for this node type */
export async function runNode(type: string, metadata: any, input: any) {
  const name = type.toLowerCase();

  if (name === "timer") return runTimer(metadata, input);
  if (name === "schedule") return runSchedule(metadata, input);
  if (name === "webhook") return runWebhook(metadata, input);
  if (name === "http-request") return runHttpRequest(metadata);
  if (name === "mail") return runMail(metadata, input);

  console.log(`[${name}] unknown type — skipping`);
  return input ?? { ok: true };
}
