import { memo } from "react";
import TransitChip from "./TransitChip";

interface TransitTimelineItemProps {
  img: string;
  duration: string;
}

const TransitTimelineItem = ({ img, duration }: TransitTimelineItemProps) => (
  <TransitChip img={img} duration={duration} />
);

export default memo(TransitTimelineItem);
