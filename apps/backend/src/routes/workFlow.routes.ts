import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createWorkflow,
  getWorkflow,
  updateWorkflow,
  nodes,
  getAllWorkflow,
  executeWorkflow,
  stopWorkflowExecution,
  getLatestExecution,
  updateNodeStatus,
  updateWorkflowStatus,
} from "../controllers/workFlow.controller";

const router = Router();

router.post("/workflow", authMiddleware, createWorkflow);
router.get("/workflow", authMiddleware, getAllWorkflow);
router.get("/workflow/:workflowId", authMiddleware, getWorkflow);
router.put("/workflow/:workflowId", authMiddleware, updateWorkflow);
router.post("/workflow/:workflowId/execute", authMiddleware, executeWorkflow);
router.post("/workflow/:workflowId/stop", authMiddleware, stopWorkflowExecution);
router.get("/workflow/:workflowId/execution", authMiddleware, getLatestExecution);
router.get("/nodes", authMiddleware, nodes);

// Called by the engine worker to push live status to the editor
router.post("/node-status", updateNodeStatus);
router.post("/workflow-status", updateWorkflowStatus);

export default router;
