import { Paper, Typography, Box, useTheme, alpha, Chip } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { OUTLINE_BORDER_THIN } from "../../../styles/tokens";
import type { ReminderItem } from "../../../types/schedule";

interface ReminderTimelineItemProps {
  reminder: ReminderItem;
}

const ReminderTimelineItem = ({ reminder }: ReminderTimelineItemProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Paper
        sx={{
          mb: 1.5,
          px: 1.75,
          py: 0.75,
          border: OUTLINE_BORDER_THIN,
          borderRadius: "18px",
          backgroundColor: alpha(theme.palette.warning.light, 0.3),
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 1,
          alignSelf: "center",
        }}
      >
        {reminder.time && (
          <Box
            sx={{
              minWidth: 56,
              px: 1,
              py: 0.25,
              borderRadius: "999px",
              border: OUTLINE_BORDER_THIN,
              backgroundColor: theme.palette.common.white,
              textAlign: "center",
              fontWeight: 600,
              fontSize: "0.7rem",
              color: theme.palette.text.primary,
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {reminder.time}
          </Box>
        )}

        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: "0.9rem",
            color: theme.palette.text.primary,
            display: "inline-block",
          }}
        >
          {reminder.name}
        </Typography>

        {reminder.url && (
          <Chip
            component="a"
            href={reminder.url}
            target="_blank"
            rel="noopener noreferrer"
            label="取票"
            icon={<OpenInNewIcon sx={{ fontSize: "0.75rem !important" }} />}
            size="small"
            clickable
            sx={{
              height: 22,
              fontSize: "0.7rem",
              fontWeight: 600,
              border: OUTLINE_BORDER_THIN,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              "& .MuiChip-icon": { color: theme.palette.common.white },
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default ReminderTimelineItem;
