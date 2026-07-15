/** Webhook trigger just passes trigger payload / input through */
export async function runWebhook(_metadata: any, input: any) {
  console.log("[webhook] trigger passed");
  return input ?? { ok: true, trigger: "webhook" };
}
