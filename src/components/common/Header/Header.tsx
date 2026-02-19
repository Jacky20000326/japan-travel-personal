import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { handleImageError } from "../../../constants";

interface CharacterIconProps {
  src: string;
  alt: string;
  position: "left" | "right";
}

const CharacterIcon = ({ src, alt, position }: CharacterIconProps) => {
  const [hover, setHover] = useState(false);

  const positionStyles = position === "left" ? { left: 8 } : { right: 8 };

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={handleImageError}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 50,
        height: 50,
        cursor: "pointer",
        animation: hover ? "wiggle 0.5s ease-in-out" : "none",
        "&:hover": {
          filter: "brightness(1.1)",
        },
        ...positionStyles,
      }}
    />
  );
};

const Header = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: "#3B7DD8", position: "relative" }}>
      <CharacterIcon
        src="/images/characters/snoopy-walking.png"
        alt="Snoopy"
        position="left"
      />
      <CharacterIcon
        src="/images/characters/shinnosuke-peek.png"
        alt="Shin-chan"
        position="right"
      />

      <Toolbar sx={{ justifyContent: "center", py: 1.5 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: "1.4rem",
              color: "#FFFFFF",
            }}
          >
            東京 / 富士山旅行
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "0.8rem",
              mt: 0.25,
            }}
          >
            🐾 2/21 - 3/1 🐾
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
