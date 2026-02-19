# 東京/富士山行程表 SPA 製作過程

## Step 1: 初始化專案

1. 建立 `package.json`，定義專案名稱與依賴：
   - React 18 + ReactDOM
   - MUI v5（@mui/material, @mui/icons-material）
   - Emotion（@emotion/react, @emotion/styled）
   - Vite 5 + @vitejs/plugin-react

2. 建立 `vite.config.js`（使用 React plugin）

3. 建立 `index.html`（lang="zh-TW"、viewport meta、載入 `/src/main.jsx`）

4. 執行 `npm install` 安裝所有依賴（124 packages）

5. 建立目錄結構：
   ```
   src/components/
   src/data/
   src/hooks/
   public/images/
   ```

---

## Step 2: 建立行程資料 (`src/data/schedule.js`)

將 `schedule.md` 轉換為結構化 JavaScript 陣列，包含 5 天行程：

- 每天包含 `date`、`weekday`、`title`、`items` 陣列
- `items` 中有兩種型別：
  - `type: 'spot'` — 景點（含 id, time, name, category, emoji, image, note）
  - `type: 'transit'` — 交通（含 mode, duration）
- 景點分類：`restaurant` | `attraction` | `hotel` | `shopping`
- 圖片路徑指向 `/images/[spot-name].svg`

---

## Step 3: 搜尋並建立景點圖片

為 26 個景點建立 SVG placeholder 圖片至 `public/images/`：

| 檔案 | 配色 | 內容 |
|------|------|------|
| meat-man.svg | 暖紅漸層 | MEAT MAN |
| sushi-gompachi.svg | 藍色漸層 | 🍣 |
| niku-azabu.svg | 深紅漸層 | 🥩 |
| rokusan-angel.svg | 紫色漸層 | ROKUSAN |
| sengen-shrine.svg | 橙紅漸層 | ⛩️ |
| fujisan-shokupan.svg | 奶油色漸層 | 🍞 |
| honcho-chacha.svg | 綠色漸層 | 🏘️ |
| unagi-yosakura.svg | 棕色漸層 | 🐟 |
| lawson-ohashi.svg | 藍色漸層 | 🏪🗻 |
| swan-lake.svg | 淺藍漸層 | 🦢 |
| ango-yamanakako.svg | 青綠漸層 | 🏡 |
| koshuya.svg | 棕色漸層 | 🐄 |
| ogino.svg | 綠色漸層 | 🛒 |
| yume-bridge.svg | 日出粉橙漸層 | 🌅 |
| fuji-starbucks.svg | 綠色漸層 | ☕🗻 |
| uomitei.svg | 海藍漸層 | 🐟 |
| kamakura-highschool.svg | 天藍漸層 | 🏫 |
| shichirigahama.svg | 深藍漸層 | 🏖️ |
| wagyu-sukiyaki.svg | 暖棕漸層 | 🍲 |
| sensoji.svg | 紅金漸層 | ⛩️ |
| misojyu.svg | 暖黃漸層 | 🍜 |
| fuglen.svg | 咖啡棕漸層 | ☕ |
| asakusa-unana.svg | 淺棕漸層 | 🍮 |
| os-drug.svg | 白藍漸層 | 💊 |
| tsurujiro.svg | 深色漸層 | 🥘 |
| mcdonalds-lawson.svg | 黃色漸層 | 🍔 |

每個 SVG 為 400x200px，使用對角線性漸層背景 + 置中文字/emoji。

---

## Step 4: 開發 MUI 主題 (`src/theme.js`)

- **Primary**: 綠色系（#2E7D32）— 旅行/自然風
- **Secondary**: 橙色系（#FF6F00）— 活力點綴
- **背景**: 淡米色（#f5f5f0）
- **字體**: -apple-system, Noto Sans TC, sans-serif
- **元件覆寫**:
  - Card: borderRadius 12px, 柔和陰影
  - Button: borderRadius 20px, 44px 最小高度
  - Tab: 48px 最小高度, fontWeight 600

---

## Step 5: 開發核心元件

### Header.jsx
- MUI `AppBar` + `Toolbar` + `Typography`
- 顯示「🗾 東京/富士山旅行 2/23-2/27」

### DayTabs.jsx
- MUI `Tabs`（variant="scrollable", scrollButtons="auto"）
- 5 個 `Tab`：2/23（一）~ 2/27（五）
- 手機上可左右滑動切換

### SpotCard.jsx
- MUI `Card` + `CardMedia` + `CardContent` + `CardActions`
- 標題列：時間 + emoji + 名稱（始終可見）
- `Collapse` 動畫（timeout=300ms）展開/收合詳情
- 展開時顯示：圖片、備註、完成狀態
- 「標記完成」/「取消完成」按鈕（MUI Button, minHeight 44px）
- 完成後自動收合、顯示 CheckCircle 圖標
- `ExpandMoreIcon` 旋轉指示展開狀態
- 圖片載入失敗時隱藏（onError handler）

### TransitChip.jsx
- MUI `Chip`（size="small", variant="outlined"）
- 格式：`{mode} {duration}`（如「🚗 30分鐘」）
- 置中顯示於景點之間

### Timeline.jsx
- 遍歷當日 `items` 陣列
- transit 類型渲染 `TransitChip`
- spot 類型渲染 `SpotCard`

---

## Step 6: useCompleted hook (`src/hooks/useCompleted.js`)

- localStorage key: `travel-schedule-completed`
- 初始化時從 localStorage 讀取已完成 ID 陣列
- 提供 `toggleComplete(spotId)` — 切換完成/未完成
- 提供 `isCompleted(spotId)` — 查詢是否已完成
- 每次 toggle 時同步寫入 localStorage
- 頁面重新整理後狀態保持

---

## Step 7: App.jsx 組裝

```jsx
App
├── Header
├── DayTabs (currentDay state)
└── Timeline (當日 items + isCompleted + toggleComplete)
```

- `useState(0)` 管理當前選中的日期分頁
- 從 `useCompleted()` 取得持久化方法
- 從 `schedule[currentDay]` 取得當日行程

---

## Step 8: main.jsx 入口

- `ThemeProvider` 包裹全域主題
- `CssBaseline` 重置瀏覽器預設樣式
- `React.StrictMode` 開啟嚴格模式

---

## Step 9: 驗證

- `npx vite build` 建置成功（443 modules, 288.98 kB JS）
- `npx vite --host` 啟動開發伺服器
- 瀏覽 http://localhost:5173/ 確認功能正常

---

## 最終專案結構

```
/Users/hongqishun/Documents/2026/test/
├── schedule.md                  # 原始行程文字
├── build-app-progress.md        # 本文件（製作過程）
├── package.json
├── vite.config.js
├── index.html
├── node_modules/
├── public/
│   └── images/                  # 26 個 SVG 景點圖片
│       ├── meat-man.svg
│       ├── sushi-gompachi.svg
│       ├── ... (共 26 個)
│       └── mcdonalds-lawson.svg
└── src/
    ├── main.jsx                 # 入口 + ThemeProvider
    ├── App.jsx                  # 主元件
    ├── theme.js                 # MUI 自訂主題
    ├── data/
    │   └── schedule.js          # 結構化行程資料
    ├── components/
    │   ├── Header.jsx           # AppBar 標題
    │   ├── DayTabs.jsx          # 日期分頁
    │   ├── Timeline.jsx         # 時間軸容器
    │   ├── SpotCard.jsx         # 景點卡片（含收合動畫）
    │   └── TransitChip.jsx      # 交通資訊 Chip
    └── hooks/
        └── useCompleted.js      # localStorage 持久化 hook
```

---

## 技術摘要

| 項目 | 選用 |
|------|------|
| 框架 | React 18 + Vite 5 |
| UI 庫 | MUI v5 |
| 樣式 | Emotion (styled) |
| 狀態管理 | useState + localStorage |
| 圖片 | SVG placeholders (400x200) |
| 響應式 | Mobile-first, 375px 基準 |
| Touch | 最小 44px 點擊區域 |
| 動畫 | MUI Collapse, 300ms ease |
