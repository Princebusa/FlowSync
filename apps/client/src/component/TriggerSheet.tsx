import type { NodeTypes } from "comman";
import { useState } from "react";
import type { MetaData } from "./workflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUPPORTED_TRIGGER = [
  { id: "timer" as const, title: "Timer" },
  { id: "webhook" as const, title: "Webhook" },
  { id: "schedule" as const, title: "Schedule" },
];

export const TriggerSheet = ({
  onSelect,
  onClose,
}: {
  onSelect: (kind: NodeTypes, metadata: MetaData) => void;
  onClose?: () => void;
}) => {
  const [metadata, setMetaData] = useState<MetaData>({});
  const [selectedTrigger, setSelectedTrigger] = useState<NodeTypes>("timer");

  return (
    <Sheet
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose?.();
      }}
    >
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">Add trigger</SheetTitle>
          <SheetDescription>Start your workflow with a trigger node</SheetDescription>
        </SheetHeader>

        <div className="mt-4 grid gap-4 px-4">
          <Select
            value={selectedTrigger}
            onValueChange={(value) => {
              setSelectedTrigger(value as NodeTypes);
              setMetaData({});
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a trigger" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SUPPORTED_TRIGGER.map(({ id, title }) => (
                  <SelectItem key={id} value={id}>
                    {title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {selectedTrigger === "timer" && (
            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label>Interval (seconds)</Label>
                <Input
                  type="number"
                  placeholder="60"
                  onChange={(e) =>
                    setMetaData((prev: MetaData) => ({
                      ...prev,
                      time: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label>Stop after</Label>
                <Input
                  type="datetime-local"
                  onChange={(e) =>
                    setMetaData((prev: MetaData) => ({ ...prev, endTime: e.target.value }))
                  }
                />
              </div>
            </div>
          )}

          {selectedTrigger === "webhook" && (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>Endpoint path</Label>
                <Input
                  placeholder="/webhook/my-endpoint"
                  onChange={(e) =>
                    setMetaData((prev: MetaData) => ({ ...prev, endpoint: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>HTTP method</Label>
                <Select
                  value={metadata.method as string}
                  onValueChange={(value) =>
                    setMetaData((prev: MetaData) => ({ ...prev, method: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {["GET", "POST", "PUT", "DELETE"].map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedTrigger === "schedule" && (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>Schedule type</Label>
                <Select
                  value={metadata.type as string}
                  onValueChange={(value) =>
                    setMetaData((prev: MetaData) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interval">Interval</SelectItem>
                    <SelectItem value="cron">Cron</SelectItem>
                    <SelectItem value="once">Once</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {metadata.type === "interval" && (
                <div className="grid gap-2">
                  <Label>Interval (seconds)</Label>
                  <Input
                    type="number"
                    onChange={(e) =>
                      setMetaData((prev: MetaData) => ({
                        ...prev,
                        interval: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              )}
              {metadata.type === "cron" && (
                <div className="grid gap-2">
                  <Label>Cron expression</Label>
                  <Input
                    placeholder="0 * * * *"
                    onChange={(e) =>
                      setMetaData((prev: MetaData) => ({
                        ...prev,
                        cronExpression: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
              {metadata.type === "once" && (
                <div className="grid gap-2">
                  <Label>Date & time</Label>
                  <Input
                    type="datetime-local"
                    onChange={(e) =>
                      setMetaData((prev: MetaData) => ({
                        ...prev,
                        datetime: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
              <div className="grid gap-1">
                <Label>Stop after</Label>
                <Input
                  type="datetime-local"
                  onChange={(e) =>
                    setMetaData((prev: MetaData) => ({ ...prev, endTime: e.target.value }))
                  }
                />
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="mt-6 flex flex-col gap-2 sm:flex-col">
          <Button onClick={() => onSelect(selectedTrigger, metadata)}>Add trigger</Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
