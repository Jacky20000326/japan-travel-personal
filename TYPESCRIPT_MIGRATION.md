# TypeScript 遷移規劃

> 本文件記錄將 `tokyo-fujisan-schedule` 專案從 JavaScript 遷移至 TypeScript 的完整計畫。

## 1. 專案現況分析

### 1.1 技術棧

| 項目 | 現況 |
|------|------|
| Framework | React 18 + Vite 5 |
| UI Library | MUI v5 (Material-UI) — 內建 TypeScript 定義，無需額外 @types |
| Styling | Emotion (CSS-in-JS) — 內建 TypeScript 定義 |
| State Management | React hooks + localStorage |
| Build Tool | Vite + @vitejs/plugin-react |

### 1.2 現有型別基礎

專案已有 JSDoc 型別定義檔 `src/types/schedule.js`，定義了：
- `ScheduleItemType` — `"spot" | "transit"`
- `SpotCategory` — `"restaurant" | "attraction" | "shopping" | "hotel"`
- `SpotItem` / `TransitItem` / `ScheduleItem` / `DaySchedule` / `ScheduleData` / `ServiceError`

`package.json` 已包含 `@types/react` 和 `@types/react-dom` 作為 devDependencies。

### 1.3 檔案清單（32 個源碼檔）

```
src/
├── main.jsx                                    → main.tsx
├── App.jsx                                     → App.tsx
├── theme.js                                    → theme.ts
├── constants.js                                → constants.ts
├── animations.css                              （保持不變）
├── types/
│   └── schedule.js                             → schedule.ts（JSDoc → TypeScript interfaces）
├── styles/
│   ├── tokens.js                               → tokens.ts
│   ├── layout.js                               → layout.tsx
│   └── components.js                           → components.tsx
├── data/
│   └── schedule.js                             → schedule.ts
├── hooks/
│   ├── useCompleted.js                         → useCompleted.ts
│   ├── useDaySelection.js                      → useDaySelection.ts
│   └── useSchedule.js                          → useSchedule.ts
├── services/
│   ├── scheduleService.js                      → scheduleService.ts
│   └── adapters/
│       └── staticAdapter.js                    → staticAdapter.ts
├── contexts/
│   └── ScheduleContext.jsx                     → ScheduleContext.tsx
└── components/
    ├── Header.jsx                              → Header.tsx
    ├── DayTabs.jsx                             → DayTabs.tsx
    ├── TransitChip.jsx                         → TransitChip.tsx
    ├── LoadingScreen.jsx                       → LoadingScreen.tsx
    ├── ImagePlaceholder.jsx                    → ImagePlaceholder.tsx
    ├── CharacterCelebration.jsx                → CharacterCelebration.tsx
    ├── FloatingToggleButton.jsx                → FloatingToggleButton.tsx
    ├── SpotCard/
    │   ├── index.jsx                           → index.tsx
    │   ├── SpotCardHeader.jsx                  → SpotCardHeader.tsx
    │   ├── SpotCardMedia.jsx                   → SpotCardMedia.tsx
    │   ├── SpotCardContent.jsx                 → SpotCardContent.tsx
    │   └── SpotCardActions.jsx                 → SpotCardActions.tsx
    └── Timeline/
        ├── index.jsx                           → index.tsx
        ├── TimelineItem.jsx                    → TimelineItem.tsx
        ├── SpotTimelineItem.jsx                → SpotTimelineItem.tsx
        ├── TransitTimelineItem.jsx             → TransitTimelineItem.tsx
        └── ReminderTimelineItem.jsx            → ReminderTimelineItem.tsx
```

---

## 2. 需安裝的依賴

### 2.1 新增 devDependencies

```bash
npm install -D typescript @types/node
```

> **注意**：`@types/react` 和 `@types/react-dom` 已存在於 `package.json`。
> MUI v5 和 Emotion 已內建 TypeScript 定義，無需額外安裝 @types 套件。

---

## 3. 新增配置檔

### 3.1 tsconfig.json

```jsonc
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src", "vite-env.d.ts"]
}
```

### 3.2 vite-env.d.ts

```typescript
/// <reference types="vite/client" />
```

### 3.3 vite.config.js → vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 3.4 index.html 入口修改

```html
<!-- 將 -->
<script type="module" src="/src/main.jsx"></script>
<!-- 改為 -->
<script type="module" src="/src/main.tsx"></script>
```

---

## 4. TypeScript 型別定義設計

### 4.1 核心資料型別 (`src/types/schedule.ts`)

```typescript
// ── Schedule Item Types ──
export type ScheduleItemType = 'spot' | 'transit' | 'reminder';

export type SpotCategory = 'restaurant' | 'attraction' | 'shopping' | 'hotel';

export interface SpotItem {
  type: 'spot';
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
  type: 'transit';
  id?: string;
  img: string;
  duration: string;
}

export interface ReminderItem {
  type: 'reminder';
  id: string;
  time?: string;
  name: string;
  emoji?: string;
  note?: string;
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

// ── Service Layer Types ──
export interface ServiceError {
  code: string;
  message: string;
  recoverable: boolean;
}

export interface ServiceResult<T> {
  data: T | null;
  error: ServiceError | null;
  loading: boolean;
}

// ── Storage Adapter ──
export interface StorageAdapter {
  load(): CompletedMap;
  save(next: CompletedMap): void;
  clear(): void;
}

export type CompletedMap = Record<string, boolean>;

// ── Schedule Adapter ──
export interface ScheduleAdapter {
  source: string;
  supportsRefresh: boolean;
  fetchAll(): Promise<ScheduleData>;
  fetchByIndex(index: number): Promise<DaySchedule | null>;
  fetchByDate(date: string): Promise<DaySchedule | null>;
  getItems(index: number): Promise<ScheduleItem[]>;
}

// ── Schedule Service ──
export interface ScheduleService {
  adapter: ScheduleAdapter;
  locale: LocaleConfig;
  getAllDays(): Promise<ServiceResult<DaySchedule[]>>;
  getDayByIndex(index: number): Promise<ServiceResult<DaySchedule>>;
  getItems(index: number): Promise<ServiceResult<ScheduleItem[]>>;
  invalidateCache(): void;
}

export interface LocaleConfig {
  formatDate(date: string): string;
  formatWeekday(weekday: string): string;
}

// ── Context ──
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

// ── Component Props ──
export interface BulkToggleState {
  expand: boolean;
  version: number;
}

// ── Celebration Layers ──
export interface CelebrationLayers {
  character: string;
  isShinchan: boolean;
  doodle: string;
  confettiColors: string[];
}

// ── Loading Character ──
export interface LoadingCharacter {
  src: string;
  name: string;
}
```

### 4.2 MUI Theme 擴展型別 (`src/types/theme.ts`)

```typescript
import '@mui/material/styles';

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
    custom?: Partial<Theme['custom']>;
  }

  interface Palette {
    customOutline: string;
  }

  interface PaletteOptions {
    customOutline?: string;
  }
}
```

---

## 5. 遷移執行順序

遷移按**依賴關係由底向上**的順序進行，確保每一步完成後專案仍可正常編譯運行。

### Wave 1 — 基礎設施（無依賴）

這些檔案是最底層的模組，不依賴專案內其他檔案。

| # | 檔案 | 轉換 | 說明 |
|---|------|------|------|
| 1.1 | 新增 `tsconfig.json` | — | TypeScript 編譯器配置 |
| 1.2 | 新增 `vite-env.d.ts` | — | Vite 型別宣告 |
| 1.3 | `vite.config.js` → `vite.config.ts` | 重命名 | Vite 原生支援 .ts 配置 |
| 1.4 | `src/types/schedule.js` → `src/types/schedule.ts` | 重寫 | JSDoc typedef → TypeScript interface/type |
| 1.5 | 新增 `src/types/theme.ts` | 新增 | MUI Theme 擴展型別宣告 |
| 1.6 | `src/styles/tokens.js` → `src/styles/tokens.ts` | 重命名 | 純常數，只需加 `as const` |

### Wave 2 — 資料與工具層

| # | 檔案 | 轉換 | 說明 |
|---|------|------|------|
| 2.1 | `src/constants.js` → `src/constants.ts` | 加型別 | 函式簽名需要型別、常數加 `as const` |
| 2.2 | `src/data/schedule.js` → `src/data/schedule.ts` | 加型別 | 資料陣列需加 `DaySchedule[]` 型別標注 |
| 2.3 | `src/styles/layout.js` → `src/styles/layout.tsx` | 重命名 | styled components (使用 JSX)  |
| 2.4 | `src/styles/components.js` → `src/styles/components.tsx` | 重命名 | styled components |

### Wave 3 — Service 層

| # | 檔案 | 轉換 | 說明 |
|---|------|------|------|
| 3.1 | `src/services/adapters/staticAdapter.js` → `staticAdapter.ts` | 加型別 | 實作 `ScheduleAdapter` 介面 |
| 3.2 | `src/services/scheduleService.js` → `scheduleService.ts` | 加型別 | 函式參數與回傳值加型別 |

### Wave 4 — Hooks 層

| # | 檔案 | 轉換 | 說明 |
|---|------|------|------|
| 4.1 | `src/hooks/useCompleted.js` → `useCompleted.ts` | 加型別 | `StorageAdapter` 介面、`CompletedMap` 型別 |
| 4.2 | `src/hooks/useDaySelection.js` → `useDaySelection.ts` | 加型別 | 參數與回傳值型別 |
| 4.3 | `src/hooks/useSchedule.js` → `useSchedule.ts` | 加型別 | 泛型 `ServiceResult` 整合 |

### Wave 5 — Context 層

| # | 檔案 | 轉換 | 說明 |
|---|------|------|------|
| 5.1 | `src/contexts/ScheduleContext.jsx` → `ScheduleContext.tsx` | 加型別 | `ScheduleContextValue` 介面 |

### Wave 6 — 葉節點元件（無子元件依賴）

| # | 檔案 | 轉換 | 說明 |
|---|------|------|------|
| 6.1 | `ImagePlaceholder.jsx` → `.tsx` | 加型別 | 無 props |
| 6.2 | `CharacterCelebration.jsx` → `.tsx` | 加型別 | 無 props |
| 6.3 | `TransitChip.jsx` → `.tsx` | 加型別 | props: `{ img: string; duration: string }` |
| 6.4 | `LoadingScreen.jsx` → `.tsx` | 加型別 | props: `{ onComplete?: () => void }` |
| 6.5 | `Header.jsx` → `.tsx` | 加型別 | 無 props，內部 `CharacterIcon` 需定義 props |
| 6.6 | `FloatingToggleButton.jsx` → `.tsx` | 加型別 | props: `{ expanded: boolean; onToggle: () => void; disabled: boolean }` |

### Wave 7 — SpotCard 子元件

| # | 檔案 | 轉換 | 說明 |
|---|------|------|------|
| 7.1 | `SpotCardHeader.jsx` → `.tsx` | 加型別 | props interface |
| 7.2 | `SpotCardMedia.jsx` → `.tsx` | 加型別 | props interface |
| 7.3 | `SpotCardContent.jsx` → `.tsx` | 加型別 | props interface |
| 7.4 | `SpotCardActions.jsx` → `.tsx` | 加型別 | props interface |
| 7.5 | `SpotCard/index.jsx` → `.tsx` | 加型別 | 整合 `SpotItem` + `BulkToggleState` |

### Wave 8 — Timeline 元件

| # | 檔案 | 轉換 | 說明 |
|---|------|------|------|
| 8.1 | `TransitTimelineItem.jsx` → `.tsx` | 加型別 | 薄包裝 |
| 8.2 | `ReminderTimelineItem.jsx` → `.tsx` | 加型別 | `ReminderItem` props |
| 8.3 | `SpotTimelineItem.jsx` → `.tsx` | 加型別 | 薄包裝 |
| 8.4 | `TimelineItem.jsx` → `.tsx` | 加型別 | discriminated union 判斷 |
| 8.5 | `Timeline/index.jsx` → `.tsx` | 加型別 | `BulkToggleState` props |

### Wave 9 — 頂層元件

| # | 檔案 | 轉換 | 說明 |
|---|------|------|------|
| 9.1 | `DayTabs.jsx` → `.tsx` | 加型別 | 無 props，使用 context |
| 9.2 | `App.jsx` → `.tsx` | 加型別 | 頂層元件 |
| 9.3 | `main.jsx` → `.tsx` | 加型別 | 入口點 + 更新 `index.html` |

### Wave 10 — 清理與驗證

| # | 任務 | 說明 |
|---|------|------|
| 10.1 | 更新 `index.html` | `src="/src/main.tsx"` |
| 10.2 | 更新 `package.json` scripts | 加入 `"typecheck": "tsc --noEmit"` |
| 10.3 | 刪除 `src/types/schedule.js` | 已被 `.ts` 取代 |
| 10.4 | 執行 `npm run build` | 驗證生產構建 |
| 10.5 | 執行 `npx tsc --noEmit` | 驗證型別檢查通過 |
| 10.6 | 執行 `npm run dev` | 驗證開發伺服器正常 |
| 10.7 | 更新 `CLAUDE.md` | 反映新的檔案結構與命令 |

---

## 6. 遷移原則

### 6.1 嚴格模式

- 開啟 `strict: true`，不使用 `as any`、`@ts-ignore`、`@ts-expect-error`
- 所有 component props 使用 `interface` 定義
- 所有 hook 回傳值使用明確的型別

### 6.2 命名規範

- 型別檔案：`*.ts`（純邏輯）、`*.tsx`（含 JSX）
- Interface 命名：`PascalCase`，例如 `SpotCardHeaderProps`
- Type alias：`PascalCase`，例如 `SpotCategory`
- Props interface 格式：`{ComponentName}Props`

### 6.3 匯入路徑

- 遷移後移除所有 `.js` / `.jsx` 副檔名引用（TypeScript + Vite bundler mode 不需要副檔名）
- 統一使用不帶副檔名的匯入：`import X from './path'`

### 6.4 向後相容

- 不改變任何業務邏輯
- 不改變元件行為
- 不重新命名任何元件或函式
- 僅做型別標注與檔案副檔名轉換

---

## 7. 風險與注意事項

| 風險 | 對策 |
|------|------|
| MUI theme 擴展 `theme.custom` 不被 TS 認識 | 在 `src/types/theme.ts` 中使用 module augmentation 擴展 |
| `schedule.js` 資料物件缺少 `googleMapUrl` 欄位定義 | 在 `SpotItem` 中標記為 optional (`googleMapUrl?: string`) |
| `ReminderItem` 型別在現有 JSDoc 中未定義 | 新增 `ReminderItem` interface，實際資料已使用 `type: 'reminder'` |
| `styled()` 組件需要 `.tsx` 副檔名 | `layout.js` 和 `components.js` 雖然不直接含 JSX，但 styled API 依賴 JSX transform |
| Emotion styled 的 `theme` 參數型別 | MUI 的 styled 已正確推斷 theme 型別，無需額外處理 |
| `localStorage` 的 `JSON.parse` 回傳 `any` | 使用 `as CompletedMap` 做安全型別斷言（因為有 try-catch 保護） |
| `index.html` 引用路徑需同步更新 | Wave 10 中處理 |

---

## 8. 預估工作量

| Wave | 檔案數 | 複雜度 | 預估 |
|------|--------|--------|------|
| Wave 1（基礎設施） | 6 | 低 | 配置與型別定義 |
| Wave 2（資料工具） | 4 | 低 | 純常數與資料 |
| Wave 3（Service） | 2 | 中 | 泛型與介面實作 |
| Wave 4（Hooks） | 3 | 中 | 泛型 Hook 型別 |
| Wave 5（Context） | 1 | 中 | Context 型別化 |
| Wave 6（葉元件） | 6 | 低 | Props interface |
| Wave 7（SpotCard） | 5 | 低 | Props interface |
| Wave 8（Timeline） | 5 | 低 | Props interface |
| Wave 9（頂層） | 3 | 低 | 整合 |
| Wave 10（驗證） | — | — | 構建驗證 |
| **總計** | **35 個檔案** | — | — |

---

## 9. 驗證標準

遷移完成的判定條件：

- [ ] `npx tsc --noEmit` 零錯誤
- [ ] `npm run build` 成功（exit code 0）
- [ ] `npm run dev` 開發伺服器正常啟動
- [ ] 所有 `.js` / `.jsx` 原始碼檔案已轉換為 `.ts` / `.tsx`
- [ ] 無任何 `as any`、`@ts-ignore`、`@ts-expect-error` 使用
- [ ] 所有 component props 使用 interface 定義
- [ ] `CLAUDE.md` 已更新反映新架構
