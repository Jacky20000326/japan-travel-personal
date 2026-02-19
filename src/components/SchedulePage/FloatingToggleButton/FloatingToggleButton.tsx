import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import { OUTLINE_BORDER_THICK, OUTLINE_COLOR } from "../../../styles/tokens";
import { COLORS } from "../../../constants";
import { selectedDayAtom } from "../../../atoms/daySelectionAtom";
import {
  allExpandedAtom,
  resetBulkToggleAtom,
  toggleBulkToggleAtom,
} from "../../../atoms/uiAtoms";

const FloatingToggleButton = () => {
  const selectedDay = useAtomValue(selectedDayAtom);
  const expanded = useAtomValue(allExpandedAtom);
  const resetBulkToggle = useSetAtom(resetBulkToggleAtom);
  const toggleBulkToggle = useSetAtom(toggleBulkToggleAtom);
  const hasSpots = (selectedDay?.items ?? []).some(
    (item) => item.type === "spot",
  );

  useEffect(() => {
    resetBulkToggle();
  }, [selectedDay?.date, resetBulkToggle]);

  const handleToggle = () => {
    if (!hasSpots) {
      return;
    }
    toggleBulkToggle();
  };

  if (!hasSpots) {
    return null;
  }

  const IconComponent = expanded ? UnfoldLessIcon : UnfoldMoreIcon;
  const label = expanded ? "全部收合" : "全部展開";
  const backgroundColor = expanded ? COLORS.secondary : COLORS.primary;
  const backgroundHover = expanded ? "#d63e34" : "#315fa6";

  return (
    <Box
      sx={{
        position: "fixed",
        right: { xs: 16, sm: 32 },
        bottom: { xs: "calc(env(safe-area-inset-bottom, 0px) + 20px)", sm: 40 },
        zIndex: 1400,
      }}
    >
      <Tooltip title={label} placement="left">
        <span>
          <Fab
            color="secondary"
            onClick={handleToggle}
            aria-label={label}
            sx={{
              width: 64,
              height: 64,
              minHeight: 64,
              border: OUTLINE_BORDER_THICK,
              borderColor: OUTLINE_COLOR,
              backgroundColor,
              color: "#fff",
              boxShadow: "4px 4px 0 rgba(45,45,45,0.3)",
              "&:hover": {
                backgroundColor: backgroundHover,
                boxShadow: "6px 6px 0 rgba(45,45,45,0.35)",
              },
              "&:active": {
                transform: "translateY(1px)",
              },
              "& .MuiSvgIcon-root": {
                fontSize: 30,
              },
            }}
          >
            <IconComponent />
          </Fab>
        </span>
      </Tooltip>
    </Box>
  );
};

export default FloatingToggleButton;
