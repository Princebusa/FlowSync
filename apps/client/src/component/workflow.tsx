import { useEffect, useState, useCallback, type Dispatch, type SetStateAction } from "react";
import { ActionSheet } from "./actionSheet";
import { EditNodeSheet } from "./EditNodeSheet";
import { Mail } from "../nodes/actions/mail";
import { HttpRequest } from "../nodes/actions/HttpRequest";
import type { NodeTypes } from "comman";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TriggerSheet } from "./TriggerSheet";
import { Timer } from "@/nodes/triggers/Timer";
import { Webhook } from "@/nodes/triggers/Webhook";
import { Schedule } from "@/nodes/triggers/Schedule";
import { useAuth } from "@/contexts/AuthContext";
import { EditNodeProvider } from "@/contexts/EditNodeContext";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import {
  apiGetWorkflow,
  apiUpdateWorkflow,
  apiExecuteWorkflow,
  apiStopWorkflowExecution,
} from "@/lib/api";

interface WorkflowNode {
  type: NodeTypes;
  data: {
    kind: "ACTION" | "TRIGGER";
    metadata: MetaData;
    status?: "pending" | "running" | "success" | "failed";
  };
  id: string;
  position: { x: number; y: number };
}

export type MetaData = Record<string, any>;

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface ExecutionLog {
  timestamp: string;
  message: string;
  type: "info" | "success" | "error";
}

const nodeTypes = {
  timer: Timer,
  webhook: Webhook,
  schedule: Schedule,
  mail: Mail,
  "http-request": HttpRequest,
};

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:2000";

function addLog(
  setLogs: Dispatch<SetStateAction<ExecutionLog[]>>,
  message: string,
  type: ExecutionLog["type"] = "info"
) {
  setLogs((prev) => [
    ...prev,
    { timestamp: new Date().toLocaleTimeString(), message, type },
  ]);
}

export default function Workflow() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { workflowId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [action, setAction] = useState<{
    position: { x: number; y: number };
    parentNode: string;
  } | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const editingNode = editingNodeId
    ? nodes.find((n) => n.id === editingNodeId) || null
    : null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUpdateWorkflow = async () => {
    if (!workflowId) return;

    setIsSaving(true);
    try {
      await apiUpdateWorkflow(workflowId, { nodes, edges });
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to update workflow:", error);
      alert("Failed to update workflow. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunWorkflow = async () => {
    if (!workflowId) return;
    setIsRunning(true);
    setExecutionLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        message: "Queuing workflow execution...",
        type: "info",
      },
    ]);
    try {
      const result = await apiExecuteWorkflow(workflowId);
      if (result.success) {
        addLog(setExecutionLogs, "Workflow queued — waiting for worker", "success");
      } else {
        setIsRunning(false);
        addLog(setExecutionLogs, `Queue failed: ${result.error ?? "Unknown error"}`, "error");
      }
    } catch (err: unknown) {
      setIsRunning(false);
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to run workflow";
      addLog(setExecutionLogs, message, "error");
    }
  };

  const handleStopWorkflow = async () => {
    if (!workflowId) return;
    try {
      addLog(setExecutionLogs, "Requesting stop...", "info");
      await apiStopWorkflowExecution(workflowId);
    } catch (err: any) {
      addLog(
        setExecutionLogs,
        "Failed to stop: " + (err.response?.data?.message || err.message),
        "error"
      );
    }
  };

  useEffect(() => {
    if (!workflowId) return;
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const wf = await apiGetWorkflow(workflowId);

        const mappedNodes: WorkflowNode[] = (wf?.nodes || []).map((n: any) => ({
          id: String(n.id),
          type: (n.nodeId?.title || n.type) as NodeTypes,
          position: n.position,
          data: {
            kind:
              String(n?.data?.kind || "")
                .toUpperCase()
                .includes("TRIGGER")
                ? "TRIGGER"
                : "ACTION",
            metadata: n?.data?.metadata,
          },
        }));

        const mappedEdges: Edge[] = (wf?.edges || []).map((e: any) => ({
          id: String(e.id),
          source: String(e.source),
          target: String(e.target),
        }));

        if (!cancelled) {
          setNodes(mappedNodes);
          setEdges(mappedEdges);
          setIsRunning(Boolean(wf?.isRunning));
        }
      } catch (e: any) {
        if (!cancelled) setLoadError(e?.message || "Failed to load workflow");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [workflowId]);

  useEffect(() => {
    if (!workflowId) return;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", workflowId }));
    };

    ws.onmessage = (event) => {
      try {
        const eventData = JSON.parse(event.data);
        if (eventData.type === "node-status-change" && eventData.nodeId) {
          setNodes((nds) => {
            const node = nds.find((n) => n.id === eventData.nodeId);
            if (node) {
              const textStatus =
                eventData.status === "running"
                  ? "Started"
                  : eventData.status === "success"
                    ? "Completed"
                    : "Failed";
              const logType =
                eventData.status === "failed"
                  ? "error"
                  : eventData.status === "success"
                    ? "success"
                    : "info";
              setTimeout(() => {
                addLog(setExecutionLogs, `[${node.type}] ${textStatus}`, logType);
              }, 0);
            }

            return nds.map((n) =>
              n.id === eventData.nodeId
                ? { ...n, data: { ...n.data, status: eventData.status } }
                : n
            );
          });
        } else if (
          eventData.type === "workflow-stopped" ||
          eventData.type === "workflow-finished" ||
          eventData.type === "workflow-failed"
        ) {
          setIsRunning(false);
          const msg =
            eventData.type === "workflow-stopped"
              ? "Workflow stopped"
              : eventData.type === "workflow-finished"
                ? "Workflow finished successfully"
                : "Workflow failed";
          addLog(
            setExecutionLogs,
            msg,
            eventData.type === "workflow-failed" ? "error" : "success"
          );
        }
      } catch (e) {
        console.error(e);
      }
    };

    return () => {
      ws.close();
    };
  }, [workflowId]);

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot) as WorkflowNode[]);
    setHasChanges(true);
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot) as Edge[]);
    setHasChanges(true);
  }, []);

  const onConnect = useCallback((params: any) => {
    setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
    setHasChanges(true);
  }, []);

  const onConnectEnd = useCallback((_params: any, sh: any) => {
    if (!sh.isValid) {
      setAction({
        position: {
          x: sh.from.x + 100,
          y: sh.from.y - 18,
        },
        parentNode: sh.fromNode.id,
      });
    }
  }, []);

  return (
    <div className="relative h-screen w-screen bg-[#f4f6f8]">
      <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between gap-4 rounded-xl border border-border bg-card/95 px-4 py-2.5 shadow-sm backdrop-blur-sm">
        <div className="font-display flex items-center gap-2 text-sm font-medium tracking-tight">
          <span>FlowSync</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Editor</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleRunWorkflow}
            disabled={isLoading || isRunning || nodes.length === 0}
          >
            {isRunning ? "Running…" : "Run"}
          </Button>
          {isRunning && (
            <Button size="sm" variant="destructive" onClick={handleStopWorkflow}>
              Stop
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleUpdateWorkflow}
            disabled={!hasChanges || isSaving || isLoading}
          >
            {isSaving ? "Saving…" : "Save"}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Quit
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="absolute left-1/2 top-20 z-10 -translate-x-1/2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
          Loading workflow…
        </div>
      )}
      {loadError && (
        <div className="absolute left-1/2 top-20 z-10 -translate-x-1/2 rounded-lg border border-destructive/20 bg-red-50 px-4 py-2 text-sm text-destructive shadow-sm">
          {loadError}
        </div>
      )}

      {action && (
        <ActionSheet
          onClose={() => setAction(null)}
          onSelect={(type, metadata) => {
            const nodeId = crypto.randomUUID();
            setNodes([
              ...nodes,
              {
                id: nodeId,
                type,
                data: { kind: "ACTION", metadata },
                position: action.position,
              },
            ]);
            setEdges([
              ...edges,
              {
                id: `${action.parentNode}-${nodeId}`,
                source: action.parentNode,
                target: nodeId,
              },
            ]);
            setAction(null);
            setHasChanges(true);
          }}
        />
      )}

      {!nodes.length && !isLoading && (
        <TriggerSheet
          onSelect={(type, metadata) => {
            setNodes([
              {
                id: crypto.randomUUID(),
                type,
                data: { kind: "TRIGGER", metadata },
                position: { x: 0, y: 0 },
              },
            ]);
            setHasChanges(true);
          }}
        />
      )}

      <EditNodeProvider onEdit={setEditingNodeId}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectEnd={onConnectEnd}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#A9A9A9" gap={20} size={1.5} />
        </ReactFlow>
      </EditNodeProvider>

      {editingNode && (
        <EditNodeSheet
          open={true}
          nodeType={editingNode.type}
          metadata={editingNode.data.metadata || {}}
          onClose={() => setEditingNodeId(null)}
          onSave={(metadata) => {
            setNodes((nds) =>
              nds.map((n) =>
                n.id === editingNode.id ? { ...n, data: { ...n.data, metadata } } : n
              )
            );
            setEditingNodeId(null);
            setHasChanges(true);
          }}
        />
      )}

      {executionLogs.length > 0 && (
        <div className="absolute bottom-4 right-4 top-20 z-20 flex w-80 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-display text-sm font-medium">Live execution</span>
            <button
              onClick={() => setExecutionLogs([])}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
            {executionLogs.map((log, i) => (
              <div
                key={i}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  log.type === "error"
                    ? "border-red-100 bg-red-50 text-red-800"
                    : log.type === "success"
                      ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                      : "border-border bg-muted/40 text-foreground"
                }`}
              >
                <div className="mb-0.5 text-[10px] text-muted-foreground">{log.timestamp}</div>
                <div>{log.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
