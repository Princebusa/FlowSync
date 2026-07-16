import { Handle, Position } from "@xyflow/react";
import { Pencil } from "lucide-react";
import type { MouseEvent } from "react";
import { getNodeStyle } from "@/lib/nodeConfig";
import { useEditNode } from "@/contexts/EditNodeContext";

type NodeCardProps = {
  id: string;
  type: string;
  /** Triggers only have a source handle on the right */
  isTrigger?: boolean;
};

export function NodeCard({ id, type, isTrigger = false }: NodeCardProps) {
  const style = getNodeStyle(type);
  const onEdit = useEditNode();

  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    onEdit?.(id);
  };

  return (
    <div className={`${style.color} w-52 flex flex-col border-4 border-black`}>
      <div className="bg-black text-white p-3 font-black uppercase tracking-tight flex items-center gap-2">
        <span className="text-lg">{style.icon}</span>
        <span className="truncate">{style.title}</span>
      </div>

      <div className="p-4 flex items-center justify-center gap-3">
        <div className="w-14 h-14 bg-white border-4 border-black flex items-center justify-center text-3xl shadow-[4px_4px_0_0_#000]">
          {style.icon}
        </div>
        <button
          type="button"
          onClick={handleEdit}
          title="Edit node"
          className="w-12 h-12 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_#000] hover:bg-yellow-200 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0_0_#000] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_#000] transition-all"
        >
          <Pencil className="w-5 h-5 text-black stroke-[2.5]" />
        </button>
      </div>

      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-5 h-5 bg-black border-4 border-white rounded-none -left-2.5"
        />
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="w-5 h-5 bg-black border-4 border-white rounded-none -right-2.5"
      />
    </div>
  );
}
