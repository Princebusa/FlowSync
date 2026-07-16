import type { NodeTypes } from "comman";
import type { LucideIcon } from "lucide-react";
import {
  Timer,
  Webhook,
  CalendarClock,
  Mail,
  Globe,
  Box,
} from "lucide-react";

export type NodeStyle = {
  title: string;
  Icon: LucideIcon;
  surface: string;
  accent: string;
};

export const NODE_STYLES: Record<NodeTypes, NodeStyle> = {
  timer: {
    title: "Timer",
    Icon: Timer,
    surface: "bg-white",
    accent: "bg-stone-100 text-stone-700",
  },
  webhook: {
    title: "Webhook",
    Icon: Webhook,
    surface: "bg-white",
    accent: "bg-sky-50 text-sky-800",
  },
  schedule: {
    title: "Schedule",
    Icon: CalendarClock,
    surface: "bg-white",
    accent: "bg-teal-50 text-teal-800",
  },
  mail: {
    title: "Send Email",
    Icon: Mail,
    surface: "bg-white",
    accent: "bg-blue-50 text-blue-800",
  },
  "http-request": {
    title: "HTTP Request",
    Icon: Globe,
    surface: "bg-white",
    accent: "bg-amber-50 text-amber-900",
  },
};

export function getNodeStyle(type: string): NodeStyle {
  return (
    NODE_STYLES[type as NodeTypes] || {
      title: type,
      Icon: Box,
      surface: "bg-white",
      accent: "bg-muted text-muted-foreground",
    }
  );
}
