import { atom } from 'jotai';

export type MainTab = 'schedule' | 'expenses';

export const selectedMainTabAtom = atom<MainTab>('schedule');
