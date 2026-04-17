# src/ui — Shared UI Components

`src/ui/` 儲存跨路由、跨模組共用的 React UI 元件。元件基於 `src/design/` 的 design token 與 `packages/ui-shadcn/` 的 shadcn/ui 元件組合而成。

## 職責

- 提供可重用的 UI primitive 與複合元件
- 不承載業務邏輯，不呼叫 use case 或 domain model
- 不直接依賴 `src/modules/` 或 `modules/` 的業務邊界

## 設計原則

- Mobile First：所有元件預設先設計小螢幕版本
- 元件只接受 props，不讀取 global store 或 URL state
- 互動狀態（loading / error / empty）由 props 控制，不內建業務假設
- 命名使用 PascalCase（例如 `PageHeader`、`DataTable`、`EmptyState`）

## 與 packages/ui-shadcn 的分工

| 位置 | 說明 |
|---|---|
| `packages/ui-shadcn/` | shadcn/ui 原始元件封裝（Button、Input、Dialog 等） |
| `src/ui/` | 基於 shadcn 組合的 app-specific 複合元件（PageHeader、SidebarCard 等） |

## 相關層

| 層 | 用途 |
|---|---|
| `src/design/` | Design token 基礎層 |
| `src/ui/` | 共用 UI 元件（本層） |
| `src/app/` | 路由組合，引用本層元件做頁面組裝 |
| `src/modules/*/adapters/inbound/react/` | 模組專屬元件，不放在本層 |
