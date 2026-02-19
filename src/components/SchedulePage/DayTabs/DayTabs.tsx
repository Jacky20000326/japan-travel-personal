import type { SyntheticEvent } from "react";
import { useAtom, useAtomValue } from "jotai";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { daysAtom } from "../../../atoms/scheduleAtoms";
import { selectedDayIndexAtom } from "../../../atoms/daySelectionAtom";
import { TabsContainer } from "../../../styles/components";

const DayTabs = () => {
  const days = useAtomValue(daysAtom);
  const [selectedDayIndex, setSelectedDay] = useAtom(selectedDayIndexAtom);

  const handleChange = (_: SyntheticEvent, newValue: number): void => {
    setSelectedDay(newValue);
  };

  return (
    <TabsContainer>
      <Tabs
        value={selectedDayIndex}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        textColor="primary"
        sx={{
          "& .MuiTabs-indicator": {
            height: 3,
            backgroundColor: "#E8453C",
          },
          "& .MuiTab-root": {
            fontWeight: 600,
            borderBottom: "none",
            minHeight: "unset",
          },
        }}
      >
        {days.map((day, index) => (
          <Tab key={day.date} label={day.title} value={index} />
        ))}
      </Tabs>
    </TabsContainer>
  );
};

export default DayTabs;
