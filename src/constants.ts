import type React from "react";
import type { SpotCategory } from "./types/schedule";

export interface LoadingCharacter {
  src: string;
  name: string;
}

export interface CelebrationLayers {
  character: string;
  isShinchan: boolean;
  doodle: string;
  confettiColors: string[];
}

export const CATEGORY_COLORS: Record<SpotCategory, string> = {
  restaurant: "#E8453C",
  attraction: "#3B7DD8",
  shopping: "#FFB830",
  hotel: "#4CAF50",
};

export const COLORS = {
  primary: "#3B7DD8",
  secondary: "#E8453C",
  success: "#4CAF50",
  warning: "#FFB830",
  textPrimary: "#2D2D2D",
  background: "#FFF9E6",
  paper: "#FFFFFF",
};

export const LOADING_CHARACTERS: LoadingCharacter[] = [
  { src: "/images/characters/Crayon Shin-chan1.png", name: "Shin-chan" },
  { src: "/images/characters/Snoopy1.png", name: "Snoopy" },
  { src: "/images/characters/Crayon Shin-chan2.png", name: "Shin-chan" },
  { src: "/images/characters/Snoopy2.png", name: "Snoopy" },
  { src: "/images/characters/Crayon Shin-chan3.png", name: "Shin-chan" },
  { src: "/images/characters/Snoopy3.png", name: "Snoopy" },
  { src: "/images/characters/Crayon Shin-chan4.png", name: "Shin-chan" },
];

export const WAITING_CHARACTERS: string[] = [
  "/images/characters/shinnosuke-waiting.png",
  "/images/characters/snoopy-lying.png",
];

export const CELEBRATION_SHINCHAN_FRAMES: string[] = [
  "/images/characters/Crayon Shin-chan1.png",
  "/images/characters/Crayon Shin-chan2.png",
  "/images/characters/Crayon Shin-chan3.png",
  "/images/characters/Crayon Shin-chan4.png",
];

export const CELEBRATION_SNOOPY_FRAMES: string[] = [
  "/images/characters/Snoopy1.png",
  "/images/characters/Snoopy2.png",
  "/images/characters/Snoopy3.png",
];

export const CELEBRATION_DOODLES: string[] = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220"><polyline points="10,110 70,40 140,160 210,60" fill="none" stroke="%23E8453C" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><circle cx="60" cy="150" r="12" fill="%23FFB830"/><circle cx="170" cy="50" r="8" fill="%233B7DD8"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220"><path d="M20 60 Q110 10 200 60 T110 200" fill="none" stroke="%233B7DD8" stroke-width="12" stroke-linecap="round"/><circle cx="40" cy="100" r="10" fill="%23E8453C"/><circle cx="160" cy="160" r="16" fill="%234CAF50"/></svg>',
];

export const CELEBRATION_CONFETTI_COLORS: string[] = [
  COLORS.secondary,
  COLORS.primary,
  COLORS.warning,
  COLORS.success,
];

export const FALLBACK_IMAGE = "/images/characters/snoopy-heart.png";

export const getRandomItem = <T,>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)]!;

export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>): void => {
  event.currentTarget.style.display = "none";
};

export const getCelebrationLayers = (): CelebrationLayers => {
  const showShinchan = Math.random() < 0.5;

  return {
    character: showShinchan
      ? getRandomItem(CELEBRATION_SHINCHAN_FRAMES)
      : getRandomItem(CELEBRATION_SNOOPY_FRAMES),
    isShinchan: showShinchan,
    doodle: getRandomItem(CELEBRATION_DOODLES),
    confettiColors: Array.from({ length: 3 }, () => getRandomItem(CELEBRATION_CONFETTI_COLORS)),
  };
};
