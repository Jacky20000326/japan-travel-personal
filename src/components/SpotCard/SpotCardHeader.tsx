import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { COLORS } from '../../constants';

interface SpotCardHeaderProps {
  time: string;
  emoji: string;
  name: string;
  completed: boolean;
  expanded: boolean;
  onExpand: () => void;
}

const SpotCardHeader = ({
  time,
  emoji,
  name,
  completed,
  expanded,
  onExpand,
}: SpotCardHeaderProps) => {
  return (
    <Box
      onClick={onExpand}
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        pl: 2.5,
        py: 1.5,
        cursor: 'pointer',
        minHeight: 44,
        gap: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          mr: 1.5,
          color: 'text.secondary',
          minWidth: 45,
          fontSize: '0.8rem',
        }}
      >
        {time}
      </Typography>
      <Typography sx={{ mr: 0.5, fontSize: '1.1rem' }}>{emoji}</Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
          flex: 1,
        }}
      >
        {name}
      </Typography>
      {completed && <CheckCircleIcon sx={{ fontSize: 18, ml: 1, color: COLORS.success }} />}
      <ExpandMoreIcon
        sx={{
          ml: 0.5,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
          color: 'text.secondary',
          fontSize: 20,
        }}
      />
    </Box>
  );
};

export default SpotCardHeader;
