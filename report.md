# 效能優化報告

## 目標
在不改變既有功能與視覺行為的前提下，針對 React 渲染成本與圖片載入成本做最小侵入優化，改善互動流暢度與用戶體感速度。

## 已完成的更動

### 1) 完成狀態訂閱粒度優化（降低不必要 re-render）
- 檔案：`src/atoms/completedAtoms.ts`
- 更動：保留 `completedMapAtom` 為單一來源，改由元件端使用 selector 只取單一 spot 的布林值。
- 效果：避免某一個景點完成狀態改變時，整批 SpotCard 都因讀取整張 `completedMap` 而重算。

### 2) SpotCard 改為細粒度狀態來源 + 元件 memo 化
- 檔案：`src/components/SpotCard/index.tsx`
- 更動：
  - 使用 `selectAtom(completedMapAtom, ...)` 並搭配 `useMemo`，只訂閱當前 `spot.id` 的完成值。
  - 匯出改為 `export default memo(SpotCard)`。
- 效果：只在該卡片相關狀態改變時更新，降低時間軸卡片列表重繪成本。

### 3) Timeline 子項元件 memo 化
- 檔案：
  - `src/components/Timeline/TimelineItem.tsx`
  - `src/components/Timeline/SpotTimelineItem.tsx`
  - `src/components/Timeline/TransitTimelineItem.tsx`
- 更動：三個元件皆套用 `memo`。
- 效果：當上層重新渲染但 item props 未變時，減少子項不必要重渲染。

### 3-1) atom 資料改為就地讀取（避免透過 props 傳遞）
- 檔案：
  - `src/components/FloatingToggleButton.tsx`
  - `src/App.tsx`
- 更動：
  - `FloatingToggleButton` 改為直接讀取 `selectedDayAtom`、`allExpandedAtom`，並直接觸發 `resetBulkToggleAtom` / `toggleBulkToggleAtom`。
  - `App` 移除 `expanded/onToggle/disabled` 相關 props 傳遞與對應 atom 訂閱。
- 效果：減少上層元件因 atom 值變動而產生的傳遞鏈更新，讓狀態與使用點更貼近。

### 4) 圖片載入策略優化（降低首屏與滾動時主執行緒壓力）
- 檔案：`src/components/SpotCard/SpotCardMedia.tsx`
- 更動：`CardMedia` 新增 `loading="lazy"` 與 `decoding="async"`。
- 效果：非立即可視圖片延後載入，解碼改非同步，減少初始與滾動階段卡頓機率。

### 5) 移除重複的啟動計時更新
- 檔案：`src/App.tsx`
- 更動：移除 `AppContent` 中額外的 2500ms `setTimeout`（`LoadingScreen` 已處理完成回調）。
- 效果：避免重複 state update 與不必要的排程工作。

## 驗證結果
- 變更檔案已用 `lsp_diagnostics` 檢查：無新增錯誤。
- 已執行 `npm run build`：建置成功（Vite production build 通過）。

## 風險與注意事項
- `memo` 的收益建立在 props 穩定性上；目前行程資料為靜態來源，符合條件。
- selector 需搭配 `useMemo` 維持 atom 參考穩定；目前已在 SpotCard 內處理。

## 後續可量測建議
- 使用 React DevTools Profiler 比對優化前後：
  - 切換完成狀態時的 commit 次數
  - Timeline 相關元件 render 次數
- 以 Lighthouse/Performance 面板量測：
  - 首次互動前主執行緒工作量
  - 圖片載入與解碼對滾動流暢度影響
