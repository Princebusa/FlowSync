import { Handle, Position } from "@xyflow/react";
import { Pencil } from "lucide-react";
import type { MouseEvent } from "react";
import { getNodeStyle } from "@/lib/nodeConfig";
import { useEditNode } from "@/contexts/EditNodeContext";

type NodeCardProps = {
  id: string;
  type: string;
  isTrigger?: boolean;
};

export function NodeCard({ id, type, isTrigger = false }: NodeCardProps) {
  const style = getNodeStyle(type);
  const { Icon } = style;
  const onEdit = useEditNode();

  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    onEdit?.(id);
  };

  return (
    <div
      className={`${style.surface} w-48 rounded-xl border border-border shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${style.accent}`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>
          <span className="truncate font-second text-sm font-medium tracking-tight text-foreground">
            {style.title}
          </span>
        </div>
        <button
          type="button"
          onClick={handleEdit}
          title="Edit node"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-center px-3 py-5">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${style.accent}`}
        >
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </div>
      </div>

      {!isTrigger && <Handle type="target" position={Position.Left} />}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
