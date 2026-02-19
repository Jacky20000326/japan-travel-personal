import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getCelebrationLayers, handleImageError } from "../../../constants";

interface ConfettiPosition {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

const CONFETTI_POSITIONS: ConfettiPosition[] = [
  { top: "-10%", left: "10%" },
  { top: "5%", right: "-5%" },
  { bottom: "-10%", left: "25%" },
];

const CharacterCelebration = () => {
  const { character, isShinchan, doodle, confettiColors } = useMemo(
    () => getCelebrationLayers(),
    [],
  );
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.src = character;
    image.onload = (): void => {
      if (!cancelled) {
        setAssetsReady(true);
      }
    };
    image.onerror = (): void => {
      if (!cancelled) {
        setAssetsReady(true);
      }
    };

    return () => {
      cancelled = true;
    };
  }, [character]);

  if (typeof document === "undefined" || !assetsReady) {
    return null;
  }

  return createPortal(
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1500,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "50vh",
          maxWidth: "100vw",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transformOrigin: "center",
        }}
        className="celebration-panel"
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: 24,
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 249, 230, 0.85))",
            mixBlendMode: "multiply",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
          }}
        />

        <Box
          sx={{
            position: "relative",
            width: "min(640px, 90vw)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
          }}
        >
          <Box
            component="img"
            src={doodle}
            alt="Doodle burst"
            onError={handleImageError}
            className="celebration-doodle"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 260,
              height: 260,
              opacity: 0.9,
            }}
          />

          <Box
            component="img"
            src={character}
            alt={isShinchan ? "Shin-chan cheering" : "Snoopy cheering"}
            onError={handleImageError}
            className="celebration-bounce"
            sx={{
              width: isShinchan ? 200 : 170,
              height: isShinchan ? 200 : 170,
              position: "relative",
              zIndex: 1,
              transform: isShinchan ? "none" : "rotate(-6deg)",
            }}
          />

          {confettiColors.map((color, index) => (
            <Box
              key={`${color}-${index}`}
              className="celebration-confetti"
              sx={{
                position: "absolute",
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: color,
                boxShadow: `0 0 0 4px ${color}33`,
                ...CONFETTI_POSITIONS[index],
              }}
            />
          ))}

          <Typography
            variant="subtitle1"
            sx={{
              mt: 2,
              px: 2,
              py: 0.5,
              display: "inline-block",
              backgroundColor: "#FFF",
              border: "3px solid #000",
              borderRadius: "999px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#2D2D2D",
              boxShadow: "4px 4px 0 #00000033",
            }}
          >
            目標は達成されました
          </Typography>
        </Box>
      </Box>
    </Box>,
    document.body,
  );
};

export default CharacterCelebration;
