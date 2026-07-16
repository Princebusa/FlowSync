import { NodeWrapper } from "@/component/NodeWrapper";
import { NodeCard } from "@/component/NodeCard";

export type ScheduleMetadata = {
  type: "interval" | "cron" | "once";
  interval?: number;
  cronExpression?: string;
  datetime?: string;
  timezone?: string;
  endTime?: string;
};

export const Schedule = ({
  id,
  data,
}: {
  id: string;
  data: { metadata: ScheduleMetadata; status?: any };
}) => {
  return (
    <NodeWrapper status={data?.status} nodeId={id}>
      <NodeCard id={id} type="schedule" isTrigger />
    </NodeWrapper>
  );
};
