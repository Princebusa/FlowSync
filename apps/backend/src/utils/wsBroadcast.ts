import type { Request } from "express";
import type { WebSocket } from "ws";

export function broadcastToWorkflow(
  req: Request,
  workflowId: string,
  payload: Record<string, unknown>
) {
  const rooms = req.app.get("wssRooms") as Map<string, Set<WebSocket>> | undefined;
  const clients = rooms?.get(workflowId);
  if (!clients) return;

  const message = JSON.stringify(payload);
  for (const client of clients) {
    if (client.readyState === 1) {
      client.send(message);
    }
  }
}
