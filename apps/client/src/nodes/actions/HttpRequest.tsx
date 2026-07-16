import { NodeWrapper } from "@/component/NodeWrapper";
import { NodeCard } from "@/component/NodeCard";

export type HttpRequestMetadata = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: string;
  queryParams?: Record<string, string>;
};

export const HttpRequest = ({
  id,
  data,
}: {
  id: string;
  data: { metadata: HttpRequestMetadata; status?: any };
}) => {
  return (
    <NodeWrapper status={data?.status} nodeId={id}>
      <NodeCard id={id} type="http-request" />
    </NodeWrapper>
  );
};
