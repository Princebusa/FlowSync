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
  {
    id: "timer" as const,
    title: "Timer",
    description: "Run this node every X seconds",
  },
  {
    id: "webhook" as const,
    title: "Webhook",
    description: "Triggered by HTTP requests",
  },
  {
    id: "schedule" as const,
    title: "Schedule",
    description: "Run on specific schedule",
  },
];

export const TriggerSheet = ({
  onSelect,
}: {
  onSelect: (kind: NodeTypes, metadata: MetaData) => void;
}) => {
  const [metadata, setMetaData] = useState<MetaData>({});
  const [selectedTrigger, setSelectedTrigger] = useState<NodeTypes>("timer");

  return (
    <Sheet open={true}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create a Trigger</SheetTitle>
          <SheetDescription>Configure the starting node for this workflow</SheetDescription>
        </SheetHeader>
        <div className="px-3 grid gap-5">
          <Select
            value={selectedTrigger}
            onValueChange={(value) => {
              setSelectedTrigger(value as NodeTypes);
              setMetaData({});
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a TRIGGER" />
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
                <Label className="capitalize font-bold text-xs">Run Interval (Seconds)</Label>
                <Input
                  type="number"
                  placeholder="60"
                  onChange={(e) =>
                    setMetaData((prev: MetaData) => ({ ...prev, time: Number(e.target.value) }))
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label className="capitalize font-bold text-xs text-red-600">
                  Auto-Stop After (End Time)
                </Label>
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
                <Label>Endpoint Path</Label>
                <Input
                  placeholder="/webhook/my-endpoint"
                  onChange={(e) =>
                    setMetaData((prev: MetaData) => ({ ...prev, endpoint: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>HTTP Method</Label>
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
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedTrigger === "schedule" && (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>Schedule Type</Label>
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
                    <SelectItem value="cron">Cron Expression</SelectItem>
                    <SelectItem value="once">Once</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {metadata.type === "interval" && (
                <div className="grid gap-2">
                  <Label>Interval (seconds)</Label>
                  <Input
                    type="number"
                    placeholder="60"
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
                  <Label>Cron Expression</Label>
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
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    onChange={(e) =>
                      setMetaData((prev: MetaData) => ({ ...prev, datetime: e.target.value }))
                    }
                  />
                </div>
              )}
              <div className="grid gap-1 mt-2">
                <Label className="capitalize font-bold text-xs text-red-600">
                  Auto-Stop After (End Time)
                </Label>
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
        <SheetFooter className="mt-8">
          <Button
            type="submit"
            className="neo-btn rounded-none bg-yellow-400 text-black w-full py-6 text-xl font-black uppercase hover:bg-yellow-300"
            onClick={() => onSelect(selectedTrigger, metadata)}
          >
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
