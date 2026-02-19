import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { COLORS } from '../../constants';

interface SpotCardContentProps {
  note?: string;
  completed: boolean;
  hasImage: boolean;
}

const SpotCardContent = ({
  note,
  completed,
  hasImage,
}: SpotCardContentProps) => {
  if (!note && !completed) {
    return null;
  }

  return (
    <CardContent sx={{ pt: hasImage ? 2 : 0, pb: 1, pl: 2.5 }}>
      {note && (
        <Stack spacing={0.5} alignItems="flex-start">
          <Chip
            icon={<CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
            label="實景資訊"
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {note}
          </Typography>
        </Stack>
      )}
      {completed && (
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 700, color: COLORS.success }}>
          completed
        </Typography>
      )}
    </CardContent>
  );
};

export default SpotCardContent;
