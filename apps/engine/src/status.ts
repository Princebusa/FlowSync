import axios from "axios";
import { BACKEND_URL } from "./config.ts";

/** Tell the backend so the UI can update live */
export async function reportNodeStatus(
  workflowId: string,
  nodeId: string,
  status: "running" | "success" | "failed"
) {
  try {
    await axios.post(`${BACKEND_URL}/api/node-status`, {
      workflowId,
      nodeId,
      status,
    });
  } catch (err: any) {
    console.error("Could not report node status:", err.message);
  }
}

export async function reportWorkflowStatus(
  workflowId: string,
  status: "success" | "failed" | "stopped"
) {
  try {
    await axios.post(`${BACKEND_URL}/api/workflow-status`, {
      workflowId,
      status,
    });
  } catch (err: any) {
    console.error("Could not report workflow status:", err.message);
  }
}
