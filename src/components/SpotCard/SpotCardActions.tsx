import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RoomIcon from '@mui/icons-material/Room';

const HIDDEN_SPOT_NAMES = ['出門', '新宿載麒順希希', '各自飯店 check in'];

interface SpotCardActionsProps {
  completed: boolean;
  onToggle: () => void;
  mapUrl?: string;
  spotName: string;
}

const SpotCardActions = ({
  completed,
  onToggle,
  mapUrl,
  spotName,
}: SpotCardActionsProps) => {
  const safeName = spotName?.trim();
  const isHiddenSpot = !safeName || HIDDEN_SPOT_NAMES.includes(safeName) || safeName.includes('住宿');
  const fallbackUrl = safeName
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(safeName)}`
    : undefined;
  const googleMapsUrl = isHiddenSpot ? undefined : mapUrl || fallbackUrl;

  return (
    <CardActions sx={{ pt: 3, pb: 2, pl: 2.5, pr: 1.5 }}>
      <Button
        size="small"
        variant={completed ? 'outlined' : 'contained'}
        color={completed ? 'inherit' : 'primary'}
        onClick={onToggle}
        startIcon={completed ? null : <CheckCircleIcon />}
        sx={{ minHeight: 36, borderRadius: 20 }}
      >
        {completed ? '取消完成' : '標記完成'}
      </Button>

      {googleMapsUrl && (
        <Tooltip title="在 Google Maps 開啟">
          <IconButton
            component="a"
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            sx={{ ml: 'auto', border: '2px solid', borderColor: 'primary.main' }}
          >
            <RoomIcon />
          </IconButton>
        </Tooltip>
      )}
    </CardActions>
  );
};

export default SpotCardActions;
