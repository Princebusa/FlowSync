import { Execution } from "db/client";

/** Returns true if the user clicked Stop */
export async function isCancelled(executionId: string): Promise<boolean> {
  const execution = await Execution.findById(executionId).select("status");
  return execution?.status === "CANCELLED";
}
