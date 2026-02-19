import Box from "@mui/material/Box";
import { useAtomValue } from "jotai";
import { selectedDayAtom } from "../../../atoms/daySelectionAtom";
import TimelineItem from "./TimelineItem";

const Timeline = () => {
  const selectedDay = useAtomValue(selectedDayAtom);
  const items = selectedDay?.items ?? [];

  return (
    <Box sx={{ px: 2, pt: 2, pb: { xs: 10, sm: 8 } }}>
      {items.map((item, index) => (
        <TimelineItem key={item.id ?? `timeline-${index}`} item={item} />
      ))}
    </Box>
  );
};

export default Timeline;
