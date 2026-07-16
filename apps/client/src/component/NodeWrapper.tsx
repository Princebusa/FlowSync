import { Loader2, Check, X, Trash2 } from "lucide-react";
import type { ReactNode, MouseEvent } from "react";
import { useReactFlow } from "@xyflow/react";

interface NodeWrapperProps {
  nodeId?: string;
  status?: "pending" | "running" | "success" | "failed";
  children: ReactNode;
}

export const NodeWrapper = ({ nodeId, status, children }: NodeWrapperProps) => {
  const { setNodes, setEdges } = useReactFlow();

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    if (!nodeId) return;
    setNodes((nodes) => nodes.filter((n) => n.id !== nodeId));
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  return (
    <div className="group relative">
      {nodeId && (
        <button
          onClick={handleDelete}
          className="absolute -right-2 -top-2 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-muted-foreground opacity-0 shadow-sm transition-all hover:border-destructive/30 hover:bg-red-50 hover:text-destructive group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}

      <div>{children}</div>

      {status && (
        <div className="absolute -left-2 -top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white shadow-sm">
          {status === "running" && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          )}
          {status === "success" && (
            <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />
          )}
          {status === "failed" && (
            <X className="h-3.5 w-3.5 text-destructive" strokeWidth={2.5} />
          )}
        </div>
      )}
    </div>
  );
};
