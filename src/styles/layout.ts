import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { CANVAS_BACKGROUND } from "./tokens";

export const SnoopyCanvas = styled(Box)(() => ({
  position: "relative",
  minHeight: "100vh",
  "&::before": {
    content: '""',
    position: "fixed",
    inset: 0,
    zIndex: -1,
    backgroundImage: "url('/images/snoopy-crown.png')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "960px 100vh",
    backgroundPosition: "center",
    backgroundColor: CANVAS_BACKGROUND,
  },
}));
