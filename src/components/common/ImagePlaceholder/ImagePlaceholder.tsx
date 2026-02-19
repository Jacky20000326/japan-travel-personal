import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import {
  WAITING_CHARACTERS,
  getRandomItem,
  handleImageError,
} from "../../../constants";

const ImagePlaceholder = () => {
  const randomChar = getRandomItem(WAITING_CHARACTERS);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(200, 200, 200, 0.1)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        sx={{
          position: "absolute",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <Box
        component="img"
        src={randomChar}
        alt="Loading character"
        onError={handleImageError}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "auto",
          height: "80%",
          maxWidth: "80%",
          objectFit: "contain",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
    </Box>
  );
};

export default ImagePlaceholder;
