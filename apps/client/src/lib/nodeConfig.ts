import type { NodeTypes } from "comman";

export type NodeStyle = {
  title: string;
  icon: string;
  color: string;
};

export const NODE_STYLES: Record<NodeTypes, NodeStyle> = {
  timer: {
    title: "Timer",
    icon: "⏳",
    color: "bg-pink-300",
  },
  webhook: {
    title: "Webhook",
    icon: "🔗",
    color: "bg-orange-300",
  },
  schedule: {
    title: "Schedule",
    icon: "⏰",
    color: "bg-indigo-300",
  },
  mail: {
    title: "Send Email",
    icon: "📧",
    color: "bg-blue-300",
  },
  "http-request": {
    title: "HTTP Request",
    icon: "🌐",
    color: "bg-yellow-300",
  },
};

export function getNodeStyle(type: string): NodeStyle {
  return (
    NODE_STYLES[type as NodeTypes] || {
      title: type,
      icon: "📦",
      color: "bg-gray-300",
    }
  );
}
