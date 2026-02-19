import { atom } from 'jotai';

export interface BulkToggleState {
  expand: boolean;
  version: number;
}

export const allExpandedAtom = atom<boolean>(true);

export const bulkToggleStateAtom = atom<BulkToggleState>({
  expand: true,
  version: 0,
});

export const resetBulkToggleAtom = atom(null, (_get, set) => {
  set(allExpandedAtom, true);
  set(bulkToggleStateAtom, (prev) => ({ expand: true, version: prev.version + 1 }));
});

export const toggleBulkToggleAtom = atom(null, (get, set) => {
  const next = !get(allExpandedAtom);
  set(allExpandedAtom, next);
  set(bulkToggleStateAtom, (prev) => ({ expand: next, version: prev.version + 1 }));
});
