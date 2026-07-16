import { useEffect, useState } from "react";
import type { NodeTypes } from "comman";
import type { MetaData } from "./workflow";
import { getNodeStyle } from "@/lib/nodeConfig";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EditNodeSheetProps = {
  open: boolean;
  nodeType: NodeTypes;
  metadata: MetaData;
  onClose: () => void;
  onSave: (metadata: MetaData) => void;
};

export function EditNodeSheet({
  open,
  nodeType,
  metadata,
  onClose,
  onSave,
}: EditNodeSheetProps) {
  const [form, setForm] = useState<MetaData>(metadata || {});
  const style = getNodeStyle(nodeType);
  const { Icon } = style;

  useEffect(() => {
    if (open) setForm(metadata || {});
  }, [open, metadata]);

  const setField = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (nodeType === "http-request" && !form.url) {
      return alert("URL is required");
    }
    if (
      nodeType === "mail" &&
      (!form.host || !form.user || !form.password || !form.to)
    ) {
      return alert("SMTP credentials & To address are required");
    }
    onSave(form);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-second flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
            Edit {style.title}
          </SheetTitle>
          <SheetDescription>Update settings for this node</SheetDescription>
        </SheetHeader>

        <div className="mt-4 grid gap-4 px-4">
          {nodeType === "timer" && (
            <>
              <div className="grid gap-1">
                <Label>Interval (seconds)</Label>
                <Input
                  type="number"
                  value={form.time ?? ""}
                  onChange={(e) => setField("time", Number(e.target.value))}
                />
              </div>
              <div className="grid gap-1">
                <Label>Stop after</Label>
                <Input
                  type="datetime-local"
                  value={form.endTime ?? ""}
                  onChange={(e) => setField("endTime", e.target.value)}
                />
              </div>
            </>
          )}

          {nodeType === "webhook" && (
            <>
              <div className="grid gap-1">
                <Label>Endpoint path</Label>
                <Input
                  value={form.endpoint ?? ""}
                  onChange={(e) => setField("endpoint", e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label>HTTP method</Label>
                <Select
                  value={form.method || "POST"}
                  onValueChange={(value) => setField("method", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
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
            </>
          )}

          {nodeType === "schedule" && (
            <>
              <div className="grid gap-1">
                <Label>Schedule type</Label>
                <Select
                  value={form.type || "interval"}
                  onValueChange={(value) => setField("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interval">Interval</SelectItem>
                    <SelectItem value="cron">Cron</SelectItem>
                    <SelectItem value="once">Once</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(form.type === "interval" || !form.type) && (
                <div className="grid gap-1">
                  <Label>Interval (seconds)</Label>
                  <Input
                    type="number"
                    value={form.interval ?? ""}
                    onChange={(e) => setField("interval", Number(e.target.value))}
                  />
                </div>
              )}
              {form.type === "cron" && (
                <div className="grid gap-1">
                  <Label>Cron expression</Label>
                  <Input
                    value={form.cronExpression ?? ""}
                    onChange={(e) => setField("cronExpression", e.target.value)}
                  />
                </div>
              )}
              {form.type === "once" && (
                <div className="grid gap-1">
                  <Label>Date & time</Label>
                  <Input
                    type="datetime-local"
                    value={form.datetime ?? ""}
                    onChange={(e) => setField("datetime", e.target.value)}
                  />
                </div>
              )}
              <div className="grid gap-1">
                <Label>Stop after</Label>
                <Input
                  type="datetime-local"
                  value={form.endTime ?? ""}
                  onChange={(e) => setField("endTime", e.target.value)}
                />
              </div>
            </>
          )}

          {nodeType === "http-request" && (
            <>
              <div className="grid gap-1">
                <Label>Method</Label>
                <Select
                  value={form.method || "GET"}
                  onValueChange={(value) => setField("method", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
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
              <div className="grid gap-1">
                <Label>URL</Label>
                <Input
                  value={form.url ?? ""}
                  onChange={(e) => setField("url", e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label>Headers (JSON)</Label>
                <Input
                  defaultValue={
                    form.headers
                      ? typeof form.headers === "string"
                        ? form.headers
                        : JSON.stringify(form.headers)
                      : ""
                  }
                  onChange={(e) => {
                    try {
                      setField("headers", JSON.parse(e.target.value));
                    } catch {
                      /* ignore */
                    }
                  }}
                />
              </div>
              <div className="grid gap-1">
                <Label>Body (JSON)</Label>
                <Input
                  defaultValue={form.body ?? ""}
                  onChange={(e) => setField("body", e.target.value)}
                />
              </div>
            </>
          )}

          {nodeType === "mail" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label>SMTP host</Label>
                  <Input
                    value={form.host ?? ""}
                    onChange={(e) => setField("host", e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label>Port</Label>
                  <Input
                    type="number"
                    value={form.port ?? ""}
                    onChange={(e) => setField("port", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <Label>Username</Label>
                <Input
                  value={form.user ?? ""}
                  onChange={(e) => setField("user", e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password ?? ""}
                  onChange={(e) => setField("password", e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label>To</Label>
                <Input value={form.to ?? ""} onChange={(e) => setField("to", e.target.value)} />
              </div>
              <div className="grid gap-1">
                <Label>Subject</Label>
                <Input
                  value={form.subject ?? ""}
                  onChange={(e) => setField("subject", e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label>Body</Label>
                <textarea
                  value={form.body ?? ""}
                  onChange={(e) => setField("body", e.target.value)}
                  className="min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                />
              </div>
            </>
          )}
        </div>

        <SheetFooter className="mt-6 flex flex-col gap-2 sm:flex-col">
          <Button onClick={handleSave}>Save</Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
