import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { OUTLINE_BORDER_THIN } from "./tokens";

export const TabsContainer = styled(Box)(({ theme }) => ({
  borderBottom: OUTLINE_BORDER_THIN,
  backgroundColor: theme.palette.background.paper,
  position: "sticky",
  top: 0,
  zIndex: theme.zIndex.appBar - 1,
}));

export const TimelineWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));
