import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import {
  LOADING_CHARACTERS,
  COLORS,
  getRandomItem,
  handleImageError,
} from "../../../constants";

const LOADING_DURATION = 2000;
const FADE_DURATION = 500;

interface LoadingScreenProps {
  visible: boolean;
  onComplete?: () => void;
}

const LoadingScreen = ({ visible, onComplete }: LoadingScreenProps) => {
  const randomCharacter = useMemo(() => getRandomItem(LOADING_CHARACTERS), []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onComplete?.();
    }, LOADING_DURATION);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <Fade in={visible} timeout={FADE_DURATION}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          bgcolor: COLORS.background,
          zIndex: 9999,
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 200,
            height: 200,
            mb: 3,
          }}
        >
          <Box
            component="img"
            src={randomCharacter.src}
            alt={randomCharacter.name}
            onError={handleImageError}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              animation:
                "float 2s ease-in-out infinite, slideInUp 0.5s ease-out",
              filter: "drop-shadow(3px 3px 8px rgba(0,0,0,0.2))",
            }}
          />
        </Box>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 700,
            fontSize: "1.2rem",
            color: COLORS.textPrimary,
            animation: "pulse 1s ease-in-out infinite",
          }}
        >
          準備中...
        </Typography>
      </Box>
    </Fade>
  );
};

export default LoadingScreen;
