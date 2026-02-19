import { atom } from 'jotai';
import { daysAtom } from './scheduleAtoms';
import type { DaySchedule } from '../types/schedule';

const selectedDayIndexBaseAtom = atom<number>(0);

export const selectedDayIndexAtom = atom(
  (get) => {
    const days = get(daysAtom);
    const index = get(selectedDayIndexBaseAtom);
    if (days.length === 0) {
      return 0;
    }
    return Math.max(0, Math.min(index, days.length - 1));
  },
  (_get, set, nextIndex: number) => {
    set(selectedDayIndexBaseAtom, nextIndex);
  },
);

export const selectedDayAtom = atom<DaySchedule | null>((get) => {
  const days = get(daysAtom);
  const index = get(selectedDayIndexAtom);
  return days[index] ?? null;
});
