import { WorkFlow, Execution } from "db/client";
import { sortNodes, type GraphNode, type GraphEdge } from "./graph.ts";
import { runNode } from "./nodes/index.ts";
import { isCancelled } from "./cancel.ts";
import { reportNodeStatus, reportWorkflowStatus } from "./status.ts";

/**
 * Load workflow from Mongo and run each node in order.
 */
export async function runWorkflow(executionId: string, workflowId: string) {
  const execution = await Execution.findById(executionId);
  if (!execution) {
    console.error("Execution not found:", executionId);
    return;
  }

  // Already stopped before we started
  if (execution.status === "CANCELLED") {
    await reportWorkflowStatus(workflowId, "stopped");
    return;
  }

  execution.status = "RUNNING";
  await execution.save();

  const workflow = await WorkFlow.findById(workflowId).populate("nodes.nodeId");
  if (!workflow) {
    execution.status = "FAILED";
    execution.endTime = new Date();
    await execution.save();
    await reportWorkflowStatus(workflowId, "failed");
    return;
  }

  const nodes: GraphNode[] = workflow.nodes.map((n: any) => ({
    id: String(n.id),
    type: n.nodeId?.title || "unknown",
    data: n.data,
    credentials: n.credentials,
  }));

  const edges: GraphEdge[] = (workflow.edges || []).map((e: any) => ({
    source: String(e.source),
    target: String(e.target),
  }));

  const ordered = sortNodes(nodes, edges);
  let lastOutput: any = null;

  try {
    for (const node of ordered) {
      if (await isCancelled(executionId)) {
        console.log("Stopped by user");
        await reportWorkflowStatus(workflowId, "stopped");
        return;
      }

      await reportNodeStatus(workflowId, node.id, "running");

      try {
        lastOutput = await runNode(node.type, node.data?.metadata || {}, lastOutput);
        await reportNodeStatus(workflowId, node.id, "success");
      } catch (err: any) {
        console.error(`Node ${node.type} failed:`, err.message);
        await reportNodeStatus(workflowId, node.id, "failed");
        throw err;
      }
    }

    if (await isCancelled(executionId)) {
      await reportWorkflowStatus(workflowId, "stopped");
      return;
    }

    execution.status = "SUCCESS";
    execution.endTime = new Date();
    await execution.save();

    await WorkFlow.findByIdAndUpdate(workflowId, { isRunning: false });
    await reportWorkflowStatus(workflowId, "success");
    console.log("Workflow finished:", workflowId);
  } catch (err: any) {
    execution.status = "FAILED";
    execution.endTime = new Date();
    await execution.save();

    await WorkFlow.findByIdAndUpdate(workflowId, { isRunning: false });
    await reportWorkflowStatus(workflowId, "failed");
    console.error("Workflow failed:", err.message);
  }
}
