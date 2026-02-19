export type ScheduleItemType = "spot" | "transit" | "reminder";

export type SpotCategory = "restaurant" | "attraction" | "shopping" | "hotel";

export interface SpotItem {
  type: "spot";
  id: string;
  time: string;
  name: string;
  category: SpotCategory;
  emoji: string;
  image?: string;
  note?: string;
  googleMapUrl?: string;
}

export interface TransitItem {
  type: "transit";
  id?: string;
  img: string;
  duration: string;
}

export interface ReminderItem {
  type: "reminder";
  id: string;
  time: string;
  name: string;
  emoji: string;
  note?: string;
  url?: string;
}

export type ScheduleItem = SpotItem | TransitItem | ReminderItem;

export interface DaySchedule {
  date: string;
  weekday: string;
  title: string;
  items: ScheduleItem[];
}

export interface ScheduleData {
  days: DaySchedule[];
}
export interface ScheduleAdapter {
  source: string;
  supportsRefresh: boolean;
  fetchAll: () => Promise<ScheduleData>;
  fetchByIndex: (index: number) => Promise<DaySchedule | null>;
  fetchByDate: (date: string) => Promise<DaySchedule | null>;
  getItems: (index: number) => Promise<ScheduleItem[]>;
}

export interface ScheduleService {
  adapter: ScheduleAdapter;
  locale: {
    formatDate: (date: string) => string;
    formatWeekday: (weekday: string) => string;
  };
  invalidateCache: () => void;
}
