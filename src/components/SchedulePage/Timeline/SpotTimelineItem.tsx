import { memo } from "react";
import SpotCard from "../../SpotCard/SpotCard";
import type { SpotItem } from "../../../types/schedule";

interface SpotTimelineItemProps {
  spot: SpotItem;
}

const SpotTimelineItem = ({ spot }: SpotTimelineItemProps) => {
  return <SpotCard spot={spot} />;
};

export default memo(SpotTimelineItem);
