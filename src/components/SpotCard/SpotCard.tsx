import { memo, useEffect, useMemo, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import CharacterCelebration from "../SchedulePage/CharacterCelebration/CharacterCelebration";
import SpotCardHeader from "./SpotCardHeader";
import SpotCardMedia from "./SpotCardMedia";
import SpotCardContent from "./SpotCardContent";
import SpotCardActions from "./SpotCardActions";
import {
  completedMapAtom,
  toggleSpotCompletedAtom,
} from "../../atoms/completedAtoms";
import { bulkToggleStateAtom } from "../../atoms/uiAtoms";
import { CATEGORY_COLORS, COLORS } from "../../constants";
import type { SpotItem } from "../../types/schedule";

const CELEBRATION_DURATION = 1500;
const COLLAPSE_DELAY = 600;

interface SpotCardProps {
  spot: SpotItem;
}

const SpotCard = ({ spot }: SpotCardProps) => {
  const completedAtom = useMemo(
    () =>
      selectAtom(completedMapAtom, (completedMap) =>
        Boolean(completedMap[spot.id]),
      ),
    [spot.id],
  );
  const completed = useAtomValue(completedAtom);
  const bulkToggleState = useAtomValue(bulkToggleStateAtom);
  const toggleSpotCompleted = useSetAtom(toggleSpotCompletedAtom);
  const [expanded, setExpanded] = useState(!completed);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    setExpanded(!completed);
  }, [completed]);

  useEffect(() => {
    setExpanded(bulkToggleState.expand);
  }, [bulkToggleState]);

  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
  }, [spot.id]);

  const barColor = completed
    ? COLORS.success
    : CATEGORY_COLORS[spot.category] || COLORS.primary;

  const handleToggle = () => {
    if (!completed) {
      setShowCelebration(true);
      window.setTimeout(() => setShowCelebration(false), CELEBRATION_DURATION);
      window.setTimeout(() => setExpanded(false), COLLAPSE_DELAY);
    }
    toggleSpotCompleted(spot.id);
  };

  return (
    <Card
      sx={{
        mb: 2,
        opacity: completed ? 0.6 : 1,
        transition: "opacity 0.3s ease",
        "&::before": {
          backgroundColor: barColor,
        },
      }}
    >
      <SpotCardHeader
        time={spot.time}
        emoji={spot.emoji}
        name={spot.name}
        completed={completed}
        expanded={expanded}
        onExpand={() => setExpanded((prev) => !prev)}
      />

      {showCelebration && <CharacterCelebration />}

      <Collapse in={expanded} timeout={300}>
        <SpotCardMedia
          image={spot.image}
          alt={spot.name}
          loading={imageLoading}
          error={imageError}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
        />

        <SpotCardContent
          note={spot.note}
          completed={completed}
          hasImage={Boolean(spot.image)}
        />

        <SpotCardActions
          completed={completed}
          onToggle={handleToggle}
          mapUrl={spot.googleMapUrl}
          spotName={spot.name}
        />
      </Collapse>
    </Card>
  );
};

export default memo(SpotCard);
