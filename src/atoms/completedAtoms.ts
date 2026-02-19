import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface CompletedMap {
  [spotId: string]: boolean;
}

const STORAGE_KEY = 'travel-schedule-completed';

export const completedMapAtom = atomWithStorage<CompletedMap>(
  STORAGE_KEY,
  {},
  undefined,
  { getOnInit: true },
);

export const toggleSpotCompletedAtom = atom(
  null,
  (get, set, spotId: string) => {
    const current = get(completedMapAtom);
    set(completedMapAtom, {
      ...current,
      [spotId]: !current[spotId],
    });
  },
);
