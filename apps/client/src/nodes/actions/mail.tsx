import { NodeWrapper } from "@/component/NodeWrapper";
import { NodeCard } from "@/component/NodeCard";

export type MailMetadata = {
  host?: string;
  port?: string;
  user?: string;
  password?: string;
  to?: string;
  subject?: string;
  body?: string;
};

export const Mail = ({
  id,
  data,
}: {
  id: string;
  data: { metadata: MailMetadata; status?: any };
}) => {
  return (
    <NodeWrapper status={data?.status} nodeId={id}>
      <NodeCard id={id} type="mail" />
    </NodeWrapper>
  );
};
