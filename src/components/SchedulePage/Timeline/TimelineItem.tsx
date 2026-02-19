import { memo } from "react";
import SpotTimelineItem from "./SpotTimelineItem";
import TransitTimelineItem from "./TransitTimelineItem";
import ReminderTimelineItem from "./ReminderTimelineItem";
import type { ScheduleItem, SpotItem } from "../../../types/schedule";
import { TimelineCategory } from "./constant";

interface TimelineItemProps {
  item: ScheduleItem;
}

const TimelineItem = ({ item }: TimelineItemProps) => {
  if (item.type === TimelineCategory.TRANSIT) {
    return <TransitTimelineItem img={item.img} duration={item.duration} />;
  }

  if (item.type === TimelineCategory.REMINDER) {
    return <ReminderTimelineItem reminder={item} />;
  }

  const spotItem: SpotItem = item;

  return <SpotTimelineItem spot={spotItem} />;
};

export default memo(TimelineItem);
