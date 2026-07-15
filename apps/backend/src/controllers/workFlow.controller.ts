import { WorkFlow, Node, Execution } from "db/client";
import { Response, Request } from "express";
import { CreateWorkflowSchema } from "comman/types";
import { broadcastToWorkflow } from "../utils/wsBroadcast";

export const createWorkflow = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { success, data } = CreateWorkflowSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({ message: "incorrect input" });
  }

  try {
    const newFlow = await WorkFlow.create({
      userId,
      name: data.name || "Untitled Workflow",
      nodes: data.nodes,
      edges: data.edges,
    });
    return res.json(newFlow);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to create workflow", error: error.message });
  }
};

export const getWorkflow = async (req: Request, res: Response) => {
  const { workflowId } = req.params as { workflowId: string };
  const workflow = await WorkFlow.findOne({ _id: workflowId, userId: req.userId }).populate(
    "nodes.nodeId"
  );

  if (!workflow) {
    return res.status(404).json({ message: "workflow not found" });
  }

  return res.json(workflow);
};

export const getAllWorkflow = async (req: Request, res: Response) => {
  const allflow = await WorkFlow.find({ userId: req.userId });
  return res.json(allflow);
};

export const updateWorkflow = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { workflowId } = req.params;

  try {
    const workflow = await WorkFlow.findOne({ _id: workflowId, userId });

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    if (req.body.nodes) {
      const convertedNodes = await Promise.all(
        req.body.nodes.map(async (node: any) => {
          const nodeModel = await Node.findOne({ title: node.type });
          return {
            id: node.id,
            position: node.position,
            credentials: node.credentials,
            data: {
              kind: String(node.data?.kind || "").toUpperCase() === "TRIGGER" ? "TRIGGER" : "ACTION",
              metadata: node.data?.metadata,
            },
            nodeId: nodeModel?._id,
          };
        })
      );

      //@ts-ignore
      workflow.nodes = convertedNodes;
    }

    if (req.body.edges) {
      //@ts-ignore
      workflow.edges = req.body.edges;
    }

    if (req.body.name) {
      //@ts-ignore
      workflow.name = req.body.name;
    }

    await workflow.save();
    return res.json(workflow);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to update workflow", error: error.message });
  }
};

export const nodes = async (_req: Request, res: Response) => {
  const node = await Node.find();
  return res.json(node);
};

export const executeWorkflow = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const workflow = await WorkFlow.findOne({ _id: workflowId, userId });

    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    if (!workflow.nodes?.length) {
      return res.status(400).json({ message: "Workflow has no nodes to execute" });
    }

    const execution = await Execution.create({
      workflowId: workflow._id,
      status: "PENDING",
      startTime: new Date(),
    });

    workflow.isRunning = true;
    await workflow.save();

    return res.json({
      success: true,
      executionId: execution._id,
      message: "Execution queued successfully",
    });
  } catch (error: any) {
    console.error("Workflow execution crash:", error);
    return res.status(500).json({
      message: "Workflow execution failed",
      error: error?.message || String(error) || "Unknown error",
    });
  }
};

export const stopWorkflowExecution = async (req: Request, res: Response) => {
  try {
    const workflowId = String(req.params.workflowId);
    const userId = req.userId;

    const workflow = await WorkFlow.findOne({ _id: workflowId, userId });
    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }

    const execution = await Execution.findOneAndUpdate(
      {
        workflowId,
        status: { $in: ["PENDING", "RUNNING"] },
      },
      {
        status: "CANCELLED",
        endTime: new Date(),
      },
      { sort: { startTime: -1 }, returnDocument: "after" }
    );

    if (!execution) {
      return res.status(404).json({ message: "No active execution found to stop" });
    }

    await WorkFlow.findByIdAndUpdate(workflowId, { isRunning: false });

    broadcastToWorkflow(req, workflowId, {
      type: "workflow-stopped",
      workflowId,
      executionId: execution._id,
    });

    return res.json({ success: true, message: "Workflow execution stopped successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to stop workflow execution",
      error: error.message,
    });
  }
};

export const getLatestExecution = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;
    const execution = await Execution.findOne({ workflowId }).sort({ startTime: -1 });
    return res.json(execution);
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to fetch execution status", error: error.message });
  }
};

/** Status updates from the engine worker — broadcast to editor via WebSocket */
export const updateNodeStatus = async (req: Request, res: Response) => {
  try {
    const { workflowId, nodeId, status } = req.body;
    if (!workflowId || !nodeId || !status) {
      return res.status(400).json({ message: "workflowId, nodeId, and status are required" });
    }

    broadcastToWorkflow(req, workflowId, {
      type: "node-status-change",
      workflowId,
      nodeId,
      status,
    });

    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateWorkflowStatus = async (req: Request, res: Response) => {
  try {
    const { workflowId, status } = req.body;
    if (!workflowId || !status) {
      return res.status(400).json({ message: "Missing workflowId or status" });
    }

    await WorkFlow.findByIdAndUpdate(workflowId, { isRunning: false });

    const eventType =
      status === "success"
        ? "workflow-finished"
        : status === "stopped"
          ? "workflow-stopped"
          : "workflow-failed";

    broadcastToWorkflow(req, workflowId, { type: eventType, workflowId });

    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
