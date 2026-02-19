import { atom } from "jotai";
import type { DaySchedule } from "../types/schedule";
import { SCHEDULE } from "../data/schedule";

const formatSchedule = SCHEDULE.map((day) => ({
  ...day,
  items: day.items.map((item, index) => ({
    id: "id" in item ? item.id : `${day.date}-${index}`,
    ...item,
  })),
}));

export const daysAtom = atom<DaySchedule[]>(formatSchedule);
