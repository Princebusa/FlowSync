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

const SUPPORTED_ACTION = [
  { id: "http-request" as const, title: "HTTP Request" },
  { id: "mail" as const, title: "Send Email (SMTP)" },
];

export const ActionSheet = ({
  onSelect,
  onClose,
}: {
  onSelect: (kind: NodeTypes, metadata: MetaData) => void;
  onClose: () => void;
}) => {
  const [metadata, setMetaData] = useState<MetaData>({});
  const [selectedAction, setSelectedAction] = useState<NodeTypes | "">("");

  return (
    <Sheet
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display">Add action</SheetTitle>
          <SheetDescription>Choose a node and configure it</SheetDescription>
        </SheetHeader>

        <div className="mt-4 grid gap-4 px-4">
          <Select
            value={selectedAction}
            onValueChange={(value) => {
              setSelectedAction(value as NodeTypes);
              setMetaData({});
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an action" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SUPPORTED_ACTION.map(({ id, title }) => (
                  <SelectItem key={id} value={id}>
                    {title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {selectedAction === "http-request" && (
            <div className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4">
              <div className="grid gap-2">
                <Label>Method</Label>
                <Select
                  value={metadata.method}
                  onValueChange={(value) =>
                    setMetaData((prev: MetaData) => ({ ...prev, method: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="GET" />
                  </SelectTrigger>
                  <SelectContent>
                    {["GET", "POST", "PUT", "DELETE", "PATCH"].map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>URL</Label>
                <Input
                  placeholder="https://api.example.com"
                  onChange={(e) =>
                    setMetaData((prev: MetaData) => ({ ...prev, url: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Headers (JSON)</Label>
                <Input
                  placeholder='{"Authorization":"Bearer …"}'
                  onChange={(e) => {
                    try {
                      setMetaData((prev: MetaData) => ({
                        ...prev,
                        headers: JSON.parse(e.target.value),
                      }));
                    } catch {
                      /* ignore */
                    }
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label>Body (JSON)</Label>
                <Input
                  placeholder='{"key":"value"}'
                  onChange={(e) =>
                    setMetaData((prev: MetaData) => ({ ...prev, body: e.target.value }))
                  }
                />
              </div>
            </div>
          )}

          {selectedAction === "mail" && (
            <div className="grid max-h-[50vh] gap-3 overflow-y-auto rounded-lg border border-border bg-muted/30 p-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label>SMTP host</Label>
                  <Input
                    onChange={(e) =>
                      setMetaData((prev: MetaData) => ({ ...prev, host: e.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Port</Label>
                  <Input
                    type="number"
                    onChange={(e) =>
                      setMetaData((prev: MetaData) => ({ ...prev, port: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <Label>Username</Label>
                <Input
                  onChange={(e) =>
                    setMetaData((prev: MetaData) => ({ ...prev, user: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  onChange={(e) =>
                    setMetaData((prev: MetaData) => ({ ...prev, password: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label>To</Label>
                <Input
                  onChange={(e) =>
                    setMetaData((prev: MetaData) => ({ ...prev, to: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label>Subject</Label>
                <Input
                  onChange={(e) =>
                    setMetaData((prev: MetaData) => ({ ...prev, subject: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label>Body</Label>
                <textarea
                  className="min-h-[72px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  onChange={(e) =>
                    setMetaData((prev: MetaData) => ({ ...prev, body: e.target.value }))
                  }
                />
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="mt-6 gap-2">
          <Button
            onClick={() => {
              if (!selectedAction) return alert("Select an action");
              if (selectedAction === "http-request" && !metadata.url)
                return alert("URL is required");
              if (
                selectedAction === "mail" &&
                (!metadata.host || !metadata.user || !metadata.password || !metadata.to)
              ) {
                return alert("SMTP credentials & To address are required");
              }
              onSelect(selectedAction, metadata);
            }}
          >
            Add node
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
