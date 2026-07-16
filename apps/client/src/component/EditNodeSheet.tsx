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

  useEffect(() => {
    if (open) {
      setForm(metadata || {});
    }
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
          <SheetTitle className="flex items-center gap-2 uppercase font-black">
            <span>{style.icon}</span>
            Edit {style.title}
          </SheetTitle>
          <SheetDescription>Update settings for this node</SheetDescription>
        </SheetHeader>

        <div className="px-4 grid gap-4 mt-4">
          {nodeType === "timer" && (
            <>
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs">Run Interval (Seconds)</Label>
                <Input
                  type="number"
                  value={form.time ?? ""}
                  onChange={(e) => setField("time", Number(e.target.value))}
                  className="border-2 border-black rounded-none"
                />
              </div>
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs text-red-600">
                  Auto-Stop After (End Time)
                </Label>
                <Input
                  type="datetime-local"
                  value={form.endTime ?? ""}
                  onChange={(e) => setField("endTime", e.target.value)}
                  className="border-2 border-black rounded-none"
                />
              </div>
            </>
          )}

          {nodeType === "webhook" && (
            <>
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs">Endpoint Path</Label>
                <Input
                  value={form.endpoint ?? ""}
                  placeholder="/webhook/my-endpoint"
                  onChange={(e) => setField("endpoint", e.target.value)}
                  className="border-2 border-black rounded-none"
                />
              </div>
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs">HTTP Method</Label>
                <Select
                  value={form.method || "POST"}
                  onValueChange={(value) => setField("method", value)}
                >
                  <SelectTrigger className="border-2 border-black rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {nodeType === "schedule" && (
            <>
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs">Schedule Type</Label>
                <Select
                  value={form.type || "interval"}
                  onValueChange={(value) => setField("type", value)}
                >
                  <SelectTrigger className="border-2 border-black rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interval">Interval</SelectItem>
                    <SelectItem value="cron">Cron Expression</SelectItem>
                    <SelectItem value="once">Once</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(form.type === "interval" || !form.type) && (
                <div className="grid gap-1">
                  <Label className="font-bold uppercase text-xs">Interval (seconds)</Label>
                  <Input
                    type="number"
                    value={form.interval ?? ""}
                    onChange={(e) => setField("interval", Number(e.target.value))}
                    className="border-2 border-black rounded-none"
                  />
                </div>
              )}
              {form.type === "cron" && (
                <div className="grid gap-1">
                  <Label className="font-bold uppercase text-xs">Cron Expression</Label>
                  <Input
                    value={form.cronExpression ?? ""}
                    placeholder="0 * * * *"
                    onChange={(e) => setField("cronExpression", e.target.value)}
                    className="border-2 border-black rounded-none"
                  />
                </div>
              )}
              {form.type === "once" && (
                <div className="grid gap-1">
                  <Label className="font-bold uppercase text-xs">Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={form.datetime ?? ""}
                    onChange={(e) => setField("datetime", e.target.value)}
                    className="border-2 border-black rounded-none"
                  />
                </div>
              )}
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs text-red-600">
                  Auto-Stop After (End Time)
                </Label>
                <Input
                  type="datetime-local"
                  value={form.endTime ?? ""}
                  onChange={(e) => setField("endTime", e.target.value)}
                  className="border-2 border-black rounded-none"
                />
              </div>
            </>
          )}

          {nodeType === "http-request" && (
            <>
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs">Method</Label>
                <Select
                  value={form.method || "GET"}
                  onValueChange={(value) => setField("method", value)}
                >
                  <SelectTrigger className="border-2 border-black rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs">Target URL</Label>
                <Input
                  value={form.url ?? ""}
                  placeholder="https://api.example.com/endpoint"
                  onChange={(e) => setField("url", e.target.value)}
                  className="border-2 border-black rounded-none"
                />
              </div>
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs">Headers (JSON)</Label>
                <Input
                  defaultValue={
                    form.headers
                      ? typeof form.headers === "string"
                        ? form.headers
                        : JSON.stringify(form.headers)
                      : ""
                  }
                  placeholder='{"Authorization": "Bearer token"}'
                  onChange={(e) => {
                    try {
                      setField("headers", JSON.parse(e.target.value));
                    } catch {
                      /* ignore while typing */
                    }
                  }}
                  className="border-2 border-black rounded-none"
                />
              </div>
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs">Body (JSON)</Label>
                <Input
                  defaultValue={form.body ?? ""}
                  placeholder='{"key": "value"}'
                  onChange={(e) => setField("body", e.target.value)}
                  className="border-2 border-black rounded-none"
                />
              </div>
            </>
          )}

          {nodeType === "mail" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label className="font-bold uppercase text-xs">SMTP Host</Label>
                  <Input
                    value={form.host ?? ""}
                    onChange={(e) => setField("host", e.target.value)}
                    className="border-2 border-black rounded-none"
                  />
                </div>
                <div className="grid gap-1">
                  <Label className="font-bold uppercase text-xs">Port</Label>
                  <Input
                    type="number"
                    value={form.port ?? ""}
                    onChange={(e) => setField("port", e.target.value)}
                    className="border-2 border-black rounded-none"
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs">Username</Label>
                <Input
                  value={form.user ?? ""}
                  onChange={(e) => setField("user", e.target.value)}
                  className="border-2 border-black rounded-none"
                />
              </div>
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs">App Password</Label>
                <Input
                  type="password"
                  value={form.password ?? ""}
                  onChange={(e) => setField("password", e.target.value)}
                  className="border-2 border-black rounded-none"
                />
              </div>
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs">To Address</Label>
                <Input
                  value={form.to ?? ""}
                  onChange={(e) => setField("to", e.target.value)}
                  className="border-2 border-black rounded-none"
                />
              </div>
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs">Subject</Label>
                <Input
                  value={form.subject ?? ""}
                  onChange={(e) => setField("subject", e.target.value)}
                  className="border-2 border-black rounded-none"
                />
              </div>
              <div className="grid gap-1">
                <Label className="font-bold uppercase text-xs">Body Text</Label>
                <textarea
                  value={form.body ?? ""}
                  onChange={(e) => setField("body", e.target.value)}
                  className="border-2 border-black rounded-none bg-transparent p-2 min-h-[80px] text-sm"
                />
                <span className="text-[9px] text-muted-foreground font-bold italic">
                  Tip: Use {"{{ $json.fieldName }}"} to insert data from previous nodes.
                </span>
              </div>
            </>
          )}
        </div>

        <SheetFooter className="mt-8 flex flex-col gap-3">
          <Button
            onClick={handleSave}
            className="neo-btn rounded-none bg-yellow-400 text-black w-full py-6 text-xl font-black uppercase hover:bg-yellow-300"
          >
            Save
          </Button>
          <Button
            onClick={onClose}
            className="neo-btn rounded-none bg-white text-black w-full py-4 text-lg font-bold uppercase hover:bg-gray-100"
          >
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
