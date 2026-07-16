import { NodeWrapper } from "@/component/NodeWrapper";
import { NodeCard } from "@/component/NodeCard";

export type TimerMetadata = {
  time?: number;
  endTime?: string;
};

export const Timer = ({
  id,
  data,
}: {
  id: string;
  data: { metadata: TimerMetadata; status?: any };
}) => {
  return (
    <NodeWrapper status={data?.status} nodeId={id}>
      <NodeCard id={id} type="timer" isTrigger />
    </NodeWrapper>
  );
};
