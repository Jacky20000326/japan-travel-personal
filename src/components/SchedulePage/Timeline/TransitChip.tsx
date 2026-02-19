import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { OUTLINE_BORDER_THIN } from "../../../styles/tokens";

const TRANSIT_BG_COLOR = "#E3F2FD";
const ICON_SIZE = 24;

interface TransitChipProps {
  img: string;
  duration: string;
}

const TransitChip = ({ img, duration }: TransitChipProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", my: 1.5 }}>
      <Chip
        icon={
          <img
            style={{ width: ICON_SIZE, height: ICON_SIZE }}
            src={img}
            alt=""
          />
        }
        label={duration}
        size="small"
        sx={(theme) => ({
          fontSize: "0.8rem",
          color: theme.palette.text.primary,
          backgroundColor: TRANSIT_BG_COLOR,
          border: OUTLINE_BORDER_THIN,
          borderRadius: theme.shape.borderRadius,
          fontWeight: 500,
        })}
      />
    </Box>
  );
};

export default TransitChip;
