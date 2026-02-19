import type { SyntheticEvent } from "react";
import { useAtom } from "jotai";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { selectedMainTabAtom } from "../../../atoms/navigationAtoms";
import { OUTLINE_BORDER_THICK } from "../../../styles/tokens";

export const MainTabs = () => {
  const [selectedTab, setSelectedTab] = useAtom(selectedMainTabAtom);

  const handleChange = (
    _: SyntheticEvent,
    newValue: "schedule" | "expenses",
  ): void => {
    setSelectedTab(newValue);
  };

  return (
    <Box
      sx={{
        borderBottom: OUTLINE_BORDER_THICK,
        backgroundColor: "primary.main",
        top: 64,
        zIndex: 1200,
      }}
    >
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        variant="fullWidth"
        sx={{
          "& .MuiTabs-indicator": {
            height: 4,
            backgroundColor: "#fff",
          },
          "& .MuiTab-root": {
            color: "rgba(255,255,255,0.7)",
            fontWeight: 700,
            fontSize: "1rem",
            minHeight: 48,
            textTransform: "none",
            letterSpacing: "0.05em",
            transition: "all 0.2s ease",
            "&.Mui-selected": {
              color: "#fff",
            },
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          },
        }}
      >
        <Tab label="🗓️ 行程" value="schedule" />
        <Tab label="💰 記帳" value="expenses" />
      </Tabs>
    </Box>
  );
};
