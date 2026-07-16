import { NodeWrapper } from "@/component/NodeWrapper";
import { NodeCard } from "@/component/NodeCard";

export type WebhookMetadata = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  responseCode?: number;
};

export const Webhook = ({
  id,
  data,
}: {
  id: string;
  data: { metadata: WebhookMetadata; status?: any };
}) => {
  return (
    <NodeWrapper status={data?.status} nodeId={id}>
      <NodeCard id={id} type="webhook" isTrigger />
    </NodeWrapper>
  );
};
