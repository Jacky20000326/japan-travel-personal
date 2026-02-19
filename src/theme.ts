import { createTheme } from "@mui/material/styles";
import {
  OUTLINE_COLOR,
  OUTLINE_BORDER_THIN,
  OUTLINE_BORDER_THICK,
  CARD_RADIUS,
  BUTTON_RADIUS,
  TAB_MIN_HEIGHT,
  CANVAS_BACKGROUND,
  SURFACE_BACKGROUND,
  CATEGORY_BAR_WIDTH,
} from "./styles/tokens";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      outlineThin: string;
      outlineThick: string;
      outlineColor: string;
      cardRadius: number;
      tabsMinHeight: number;
    };
  }

  interface ThemeOptions {
    custom?: {
      outlineThin?: string;
      outlineThick?: string;
      outlineColor?: string;
      cardRadius?: number;
      tabsMinHeight?: number;
    };
  }

  interface Palette {
    customOutline: string;
  }

  interface PaletteOptions {
    customOutline?: string;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#3B7DD8",
      light: "#6BA3E8",
      dark: "#2A5CA0",
    },
    secondary: {
      main: "#E8453C",
      light: "#FF6F66",
      dark: "#B8302A",
    },
    background: {
      default: CANVAS_BACKGROUND,
      paper: SURFACE_BACKGROUND,
    },
    text: {
      primary: OUTLINE_COLOR,
      secondary: "#5C5C5C",
    },
    success: {
      main: "#4CAF50",
    },
    warning: {
      main: "#FFB830",
    },
    divider: OUTLINE_COLOR,
    customOutline: OUTLINE_COLOR,
  },
  typography: {
    fontFamily: ['"Zen Maru Gothic"', '"Noto Sans JP"', "sans-serif"].join(","),
    h6: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 700,
    },
    body1: {
      fontWeight: 400,
      lineHeight: 1.7,
    },
    body2: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: CANVAS_BACKGROUND,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: CARD_RADIUS,
          boxShadow: "none",
          border: OUTLINE_BORDER_THIN,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: CATEGORY_BAR_WIDTH,
            backgroundColor: "#3B7DD8",
            borderRadius: `${CARD_RADIUS}px 0 0 ${CARD_RADIUS}px`,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: BUTTON_RADIUS,
          textTransform: "none",
          minHeight: 40,
          fontWeight: 700,
          letterSpacing: "0.04em",
          border: OUTLINE_BORDER_THIN,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 6px rgba(45,45,45,0.2)",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: TAB_MIN_HEIGHT,
          fontWeight: 600,
          letterSpacing: "0.03em",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: OUTLINE_BORDER_THICK,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: OUTLINE_BORDER_THIN,
        },
      },
    },
  },
  custom: {
    outlineThin: OUTLINE_BORDER_THIN,
    outlineThick: OUTLINE_BORDER_THICK,
    outlineColor: OUTLINE_COLOR,
    cardRadius: CARD_RADIUS,
    tabsMinHeight: TAB_MIN_HEIGHT,
  },
});

export default theme;
