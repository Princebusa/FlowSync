import { Plus } from "lucide-react";

type AddTriggerPlaceholderProps = {
  onClick: () => void;
};

/** Empty-canvas starter: dashed box with + to open the trigger picker */
export function AddTriggerPlaceholder({ onClick }: AddTriggerPlaceholderProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto group flex w-56 flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-card/80 px-6 py-10 shadow-sm transition-all hover:border-primary/50 hover:bg-card hover:shadow-md"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-border bg-muted/40 text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:bg-accent group-hover:text-primary">
          <Plus className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <div className="text-center">
          <p className="font-second text-sm font-medium text-foreground">Add a trigger</p>
          <p className="mt-1 text-xs text-muted-foreground">Start your workflow here</p>
        </div>
      </button>
    </div>
  );
}
