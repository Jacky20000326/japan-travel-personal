import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Fade from "@mui/material/Fade";
import ImagePlaceholder from "../common/ImagePlaceholder/ImagePlaceholder";
import { FALLBACK_IMAGE, handleImageError } from "../../constants";
import { CARD_MEDIA_HEIGHT } from "../../styles/tokens";

interface SpotCardMediaProps {
  image?: string;
  alt: string;
  loading: boolean;
  error: boolean;
  onLoad: () => void;
  onError: () => void;
}

const SpotCardMedia = ({
  image,
  alt,
  loading,
  error,
  onLoad,
  onError,
}: SpotCardMediaProps) => {
  if (!image) {
    return null;
  }

  return (
    <Box
      sx={{
        boxShadow: "1px 4px 17px -6px #000000",
        borderRadius: "0 0 12px 12px",
        margin: "0px auto",
        width: "90%",
      }}
    >
      {loading && !error && <ImagePlaceholder />}
      {!error && (
        <Fade in={!loading} timeout={300}>
          <CardMedia
            component="img"
            height={CARD_MEDIA_HEIGHT}
            image={image}
            alt={alt}
            loading="lazy"
            decoding="async"
            sx={{
              objectFit: "cover",
              borderRadius: "8px",
              display: loading ? "none" : "block",
            }}
            onLoad={onLoad}
            onError={onError}
          />
        </Fade>
      )}
      {error && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: CARD_MEDIA_HEIGHT,
            bgcolor: "rgba(200, 200, 200, 0.1)",
            borderRadius: "8px",
          }}
        >
          <Box
            component="img"
            src={FALLBACK_IMAGE}
            alt="Error"
            onError={handleImageError}
            sx={{
              width: "auto",
              height: "80%",
              maxWidth: "80%",
              objectFit: "contain",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default SpotCardMedia;
