# TypeScript 遷移計畫

> 本文件記錄將本專案從 JavaScript 遷移至 TypeScript 的完整規劃。
> 專案：Tokyo/Fujisan 旅行行程表 Web App（React 18 + Vite 5 + MUI v5 + Emotion）

---

## 一、遷移概覽

| 項目 | 說明 |
|------|------|
| **總檔案數** | 32 個源碼檔案（`.js` / `.jsx`） |
| **目標** | 全部轉為 `.ts` / `.tsx`，加入完整型別定義 |
| **策略** | 依據依賴關係由底層（葉節點）向上逐波遷移 |
| **額外需求** | 新增 `tsconfig.json`、`tsconfig.node.json`；更新 `vite.config`；MUI 主題型別擴充 |

---

## 二、依賴圖（Dependency Graph）

```
Layer 0（無依賴 - 基礎模組）
├── src/styles/tokens.js          → tokens.ts
├── src/types/schedule.js         → schedule.ts（轉為 TS interfaces）
└── src/constants.js              → constants.ts

Layer 1（僅依賴 Layer 0）
├── src/styles/layout.js          → layout.ts          (依賴 tokens)
├── src/styles/components.js      → components.ts       (依賴 tokens)
├── src/data/schedule.js          → schedule.ts         (依賴 types/schedule)
└── src/theme.js                  → theme.ts            (依賴 tokens)

Layer 2（依賴 Layer 0-1）
├── src/services/adapters/staticAdapter.js  → staticAdapter.ts  (依賴 data/schedule, types)
├── src/hooks/useCompleted.js               → useCompleted.ts
└── src/hooks/useDaySelection.js            → useDaySelection.ts

Layer 3（依賴 Layer 2）
├── src/services/scheduleService.js         → scheduleService.ts (依賴 staticAdapter, types)
└── src/hooks/useSchedule.js                → useSchedule.ts     (依賴 scheduleService)

Layer 4（依賴 Layer 2-3）
└── src/contexts/ScheduleContext.jsx        → ScheduleContext.tsx (依賴所有 hooks)

Layer 5（葉節點元件 - 無子元件依賴）
├── src/components/ImagePlaceholder.jsx     → ImagePlaceholder.tsx
├── src/components/CharacterCelebration.jsx → CharacterCelebration.tsx
├── src/components/TransitChip.jsx          → TransitChip.tsx
├── src/components/Header.jsx               → Header.tsx
├── src/components/DayTabs.jsx              → DayTabs.tsx
├── src/components/LoadingScreen.jsx        → LoadingScreen.tsx
├── src/components/FloatingToggleButton.jsx → FloatingToggleButton.tsx
├── src/components/SpotCard/SpotCardHeader.jsx   → SpotCardHeader.tsx
├── src/components/SpotCard/SpotCardContent.jsx  → SpotCardContent.tsx
├── src/components/SpotCard/SpotCardMedia.jsx    → SpotCardMedia.tsx
└── src/components/SpotCard/SpotCardActions.jsx  → SpotCardActions.tsx

Layer 6（組合元件）
├── src/components/SpotCard/index.jsx       → index.tsx    (依賴 SpotCard*)
├── src/components/Timeline/TransitTimelineItem.jsx  → TransitTimelineItem.tsx
├── src/components/Timeline/ReminderTimelineItem.jsx → ReminderTimelineItem.tsx
└── src/components/Timeline/SpotTimelineItem.jsx     → SpotTimelineItem.tsx

Layer 7（頂層元件）
├── src/components/Timeline/TimelineItem.jsx → TimelineItem.tsx
├── src/components/Timeline/index.jsx        → index.tsx

Layer 8（應用層）
├── src/App.jsx  → App.tsx
└── src/main.jsx → main.tsx
```

---

## 三、型別定義規劃

### 3.1 Schedule 相關型別（`src/types/schedule.ts`）

現有 JSDoc typedef 轉換為 TypeScript interfaces，並補充遺漏型別：

```typescript
// 分類
export type SpotCategory = 'restaurant' | 'attraction' | 'shopping' | 'hotel';

// 景點項目
export interface SpotItem {
  type: 'spot';
  id: string;
  time: string;
  name: string;
  category: SpotCategory;
  emoji: string;
  image?: string;
  note?: string;
  googleMapUrl?: string;  // ← 補充：原 JSDoc 遺漏
}

// 交通項目
export interface TransitItem {
  type: 'transit';
  id?: string;            // ← 補充：normalizeSchedule 會補上
  img: string;
  duration: string;
}

// 提醒項目（新增：原 JSDoc 遺漏）
export interface ReminderItem {
  type: 'reminder';
  id: string;
  time: string;
  name: string;
  emoji: string;
  note?: string;
}

// 聯合型別
export type ScheduleItem = SpotItem | TransitItem | ReminderItem;

// 單日行程
export interface DaySchedule {
  date: string;
  weekday: string;
  title: string;
  items: ScheduleItem[];
}

// 行程資料
export interface ScheduleData {
  days: DaySchedule[];
}

// 服務錯誤
export interface ServiceError {
  code: string;
  message: string;
  recoverable: boolean;
}

// Service 回傳結果
export interface ServiceResult<T> {
  data: T | null;
  error: ServiceError | null;
  loading: boolean;
}
```

### 3.2 MUI 主題擴充（`src/theme.ts` 內或獨立 `src/types/theme.d.ts`）

```typescript
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      outlineThin: string;
      outlineThick: string;
      outlineColor: string;
      cardRadius: number;
      tabsMinHeight: number;
    };
  }
  interface ThemeOptions {
    custom?: {
      outlineThin?: string;
      outlineThick?: string;
      outlineColor?: string;
      cardRadius?: number;
      tabsMinHeight?: number;
    };
  }
  interface Palette {
    customOutline: string;
  }
  interface PaletteOptions {
    customOutline?: string;
  }
}
```

### 3.3 Context 型別（`src/contexts/ScheduleContext.tsx`）

```typescript
export interface ScheduleContextValue {
  days: DaySchedule[];
  loading: boolean;
  error: ServiceError | null;
  refetch: () => Promise<void>;
  selectedDayIndex: number;
  selectedDay: DaySchedule | null;
  setSelectedDay: (index: number) => void;
  isCompleted: (spotId: string) => boolean;
  toggleComplete: (spotId: string) => void;
}
```

### 3.4 Hook 型別

```typescript
// useCompleted
interface CompletedMap {
  [spotId: string]: boolean;
}

interface StorageAdapter {
  load: () => CompletedMap;
  save: (next: CompletedMap) => void;
  clear: () => void;
}

interface UseCompletedOptions {
  adapter?: StorageAdapter;
  fallbackAdapter?: StorageAdapter;
}

interface UseCompletedReturn {
  toggleComplete: (spotId: string) => void;
  isCompleted: (spotId: string) => boolean;
  setCompleted: (spotId: string, value: boolean) => void;
  clearAll: () => void;
  completedMap: CompletedMap;
}

// useDaySelection
interface UseDaySelectionOptions {
  totalDays?: number;
  initialIndex?: number;
}

interface UseDaySelectionReturn {
  selectedIndex: number;
  select: (value: number) => void;
  isFirst: boolean;
  isLast: boolean;
  selectNext: () => void;
  selectPrevious: () => void;
}

// useSchedule
interface UseScheduleOptions {
  service?: ScheduleService;
  autoFetch?: boolean;
}

interface UseScheduleReturn {
  days: DaySchedule[];
  loading: boolean;
  error: ServiceError | null;
  refetch: () => Promise<void>;
  getDayByIndex: (index: number) => DaySchedule | null;
  getItemsByIndex: (index: number) => ScheduleItem[];
}
```

### 3.5 Component Props 型別

```typescript
// SpotCard
interface BulkToggleState {
  expand: boolean;
  version: number;
}

interface SpotCardProps {
  spot: SpotItem;
  completed: boolean;
  onToggle?: (spotId: string) => void;
  bulkToggleState?: BulkToggleState;
}

// SpotCardHeader
interface SpotCardHeaderProps {
  time: string;
  emoji: string;
  name: string;
  completed: boolean;
  expanded: boolean;
  onExpand: () => void;
}

// SpotCardMedia
interface SpotCardMediaProps {
  image?: string;
  alt: string;
  loading: boolean;
  error: boolean;
  onLoad: () => void;
  onError: () => void;
}

// SpotCardContent
interface SpotCardContentProps {
  note?: string;
  completed: boolean;
  hasImage: boolean;
}

// SpotCardActions
interface SpotCardActionsProps {
  completed: boolean;
  onToggle: () => void;
  mapUrl?: string;
  spotName: string;
}

// TransitChip
interface TransitChipProps {
  img: string;
  duration: string;
}

// FloatingToggleButton
interface FloatingToggleButtonProps {
  expanded: boolean;
  onToggle: () => void;
  disabled: boolean;
}

// LoadingScreen
interface LoadingScreenProps {
  onComplete?: () => void;
}

// Timeline
interface TimelineProps {
  bulkToggleState: BulkToggleState;
}

// TimelineItem
interface TimelineItemProps {
  item: ScheduleItem;
  completed?: boolean;
  onToggle?: () => void;
  bulkToggleState?: BulkToggleState;
}

// ReminderTimelineItem
interface ReminderTimelineItemProps {
  reminder: ReminderItem;
}
```

---

## 四、執行波次（Parallel Waves）

### Wave 0：基礎設施（Config & 依賴）

| # | 任務 | 說明 |
|---|------|------|
| 0-1 | 安裝 TypeScript 依賴 | `npm install -D typescript` |
| 0-2 | 建立 `tsconfig.json` | React + Vite 推薦配置 |
| 0-3 | 建立 `tsconfig.node.json` | Vite config 用 |
| 0-4 | 更新 `index.html` | `src/main.jsx` → `src/main.tsx` |
| 0-5 | 重新命名 `vite.config.js` → `vite.config.ts` | 更新 import 語法 |

### Wave 1：基礎模組（Layer 0 - 可並行）

| # | 檔案 | 動作 |
|---|------|------|
| 1-1 | `src/types/schedule.js` → `src/types/schedule.ts` | JSDoc → TS interfaces，補充 ReminderItem、googleMapUrl |
| 1-2 | `src/styles/tokens.js` → `src/styles/tokens.ts` | 加上 `as const` 或明確型別 |
| 1-3 | `src/constants.js` → `src/constants.ts` | 加型別標注，泛型化 `getRandomItem<T>` |

### Wave 2：Layer 1 模組（可並行）

| # | 檔案 | 動作 |
|---|------|------|
| 2-1 | `src/styles/layout.js` → `src/styles/layout.ts` | 更新 import 路徑 |
| 2-2 | `src/styles/components.js` → `src/styles/components.ts` | 更新 import 路徑 |
| 2-3 | `src/data/schedule.js` → `src/data/schedule.ts` | 加型別標注 `DaySchedule[]`，滿足新增的 ReminderItem |
| 2-4 | `src/theme.js` → `src/theme.ts` | 加 MUI Theme augmentation，改用 createTheme 的 custom 欄位 |

### Wave 3：Layer 2-3 模組（可並行）

| # | 檔案 | 動作 |
|---|------|------|
| 3-1 | `src/services/adapters/staticAdapter.js` → `staticAdapter.ts` | 加 adapter interface 型別 |
| 3-2 | `src/hooks/useCompleted.js` → `useCompleted.ts` | 加 StorageAdapter、CompletedMap 型別 |
| 3-3 | `src/hooks/useDaySelection.js` → `useDaySelection.ts` | 加 options & return 型別 |
| 3-4 | `src/services/scheduleService.js` → `scheduleService.ts` | 加 service factory 型別 |
| 3-5 | `src/hooks/useSchedule.js` → `useSchedule.ts` | 加 options & return 型別 |

### Wave 4：Context（依賴 Wave 3）

| # | 檔案 | 動作 |
|---|------|------|
| 4-1 | `src/contexts/ScheduleContext.jsx` → `ScheduleContext.tsx` | 加 ScheduleContextValue 型別 |

### Wave 5：葉節點元件（Layer 5 - 可並行）

| # | 檔案 | 動作 |
|---|------|------|
| 5-1 | `src/components/ImagePlaceholder.jsx` → `.tsx` | 無 props |
| 5-2 | `src/components/CharacterCelebration.jsx` → `.tsx` | 無 props |
| 5-3 | `src/components/TransitChip.jsx` → `.tsx` | TransitChipProps |
| 5-4 | `src/components/Header.jsx` → `.tsx` | CharacterIconProps (internal) |
| 5-5 | `src/components/DayTabs.jsx` → `.tsx` | 無 props（從 context 取值）|
| 5-6 | `src/components/LoadingScreen.jsx` → `.tsx` | LoadingScreenProps |
| 5-7 | `src/components/FloatingToggleButton.jsx` → `.tsx` | FloatingToggleButtonProps |
| 5-8 | `src/components/SpotCard/SpotCardHeader.jsx` → `.tsx` | SpotCardHeaderProps |
| 5-9 | `src/components/SpotCard/SpotCardContent.jsx` → `.tsx` | SpotCardContentProps |
| 5-10 | `src/components/SpotCard/SpotCardMedia.jsx` → `.tsx` | SpotCardMediaProps |
| 5-11 | `src/components/SpotCard/SpotCardActions.jsx` → `.tsx` | SpotCardActionsProps |

### Wave 6：組合元件（Layer 6 - 可並行）

| # | 檔案 | 動作 |
|---|------|------|
| 6-1 | `src/components/SpotCard/index.jsx` → `.tsx` | SpotCardProps |
| 6-2 | `src/components/Timeline/TransitTimelineItem.jsx` → `.tsx` | TransitTimelineItemProps |
| 6-3 | `src/components/Timeline/ReminderTimelineItem.jsx` → `.tsx` | ReminderTimelineItemProps |
| 6-4 | `src/components/Timeline/SpotTimelineItem.jsx` → `.tsx` | SpotTimelineItemProps |

### Wave 7：頂層元件（依序）

| # | 檔案 | 動作 |
|---|------|------|
| 7-1 | `src/components/Timeline/TimelineItem.jsx` → `.tsx` | TimelineItemProps |
| 7-2 | `src/components/Timeline/index.jsx` → `.tsx` | TimelineProps |

### Wave 8：應用層

| # | 檔案 | 動作 |
|---|------|------|
| 8-1 | `src/App.jsx` → `src/App.tsx` | BulkToggleState 型別 |
| 8-2 | `src/main.jsx` → `src/main.tsx` | Non-null assertion for root element |

### Wave 9：驗證

| # | 任務 | 說明 |
|---|------|------|
| 9-1 | `npx tsc --noEmit` | 確認無型別錯誤 |
| 9-2 | `npm run build` | 確認 Vite 建置成功 |
| 9-3 | `npm run dev` | 確認開發伺服器正常啟動 |
| 9-4 | 清理舊檔案 | 確認所有 `.js`/`.jsx` 已移除（僅保留 config） |

---

## 五、tsconfig.json 預定配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src", "vite-env.d.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

### vite-env.d.ts

```typescript
/// <reference types="vite/client" />
```

---

## 六、需安裝的依賴

```bash
npm install -D typescript
```

> 注意：`@types/react` 和 `@types/react-dom` 已在 devDependencies 中。

---

## 七、注意事項

1. **不使用 `as any`、`@ts-ignore`、`@ts-expect-error`** — 所有型別必須正確定義
2. **MUI Theme 擴充**必須在 `theme.ts` 中使用 module augmentation，不可用後置 `theme.custom = ...` 的方式
3. **`handleImageError`** 需標注為 `React.SyntheticEvent<HTMLImageElement>` 參數型別
4. **Schedule data** 中 `image` 為 `""` 的情況需在型別中允許（`string` 含空字串，邏輯層用 `Boolean(spot.image)` 判斷）
5. **import 路徑**：遷移後移除所有 `.js` / `.jsx` 副檔名，TypeScript + bundler moduleResolution 會自動解析
6. **`index.html`** 中的 `src/main.jsx` 需更新為 `src/main.tsx`
7. **`vite.config.js`** 重新命名為 `vite.config.ts`

---

## 八、預計工時

| 波次 | 預估時間 |
|------|---------|
| Wave 0（基礎設施） | 5 分鐘 |
| Wave 1-3（基礎模組 + 服務層） | 15 分鐘 |
| Wave 4-7（元件遷移） | 20 分鐘 |
| Wave 8（應用層） | 5 分鐘 |
| Wave 9（驗證） | 5 分鐘 |
| **總計** | **~50 分鐘** |
