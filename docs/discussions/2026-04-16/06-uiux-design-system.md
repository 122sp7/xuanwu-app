# 問題六：UI/UX 設計系統 — 如何不再凌亂

**Date**: 2026-04-16  
**Context**: 現有 UI 元件散落於 `app/(shell)/_shell/`、`modules/*/interfaces/web/`、`packages/ui-shadcn/`，缺乏統一管控。

---

## 現況診斷

### 問題：UI 元件分佈混亂

```
app/(shell)/_shell/
  ShellAppRail.tsx           ← 導覽 + 業務邏輯混合
  ShellRootLayout.tsx        ← 780行，混合 3 個 bounded context 狀態
  ShellDashboardSidebar.tsx  ← 側欄，直接消費 context

modules/platform/interfaces/web/shell/
  header/components/ShellThemeToggle.tsx
  header/components/ShellHeaderControls.tsx
  search/ShellGlobalSearchDialog.tsx    ← 已有較好的位置，但路徑不一致

modules/workspace/interfaces/web/components/
  cards/WorkspaceProductSpineCard.tsx
  layout/WorkspaceSectionContent.tsx
  tabs/WorkspaceFilesManagementTab.tsx  ← 散落在多個子資料夾

modules/notion/interfaces/knowledge/components/
  PageEditorPanel.tsx
  KnowledgeDetailPanel.tsx
  BlockEditorPanel.tsx

packages/ui-shadcn/ui/                 ← 純 primitive 元件庫（正確位置）
packages/ui-vis/                       ← 純視覺化元件（正確位置）
```

**核心問題**：
1. `app/(shell)/_shell/` 是非標準位置，不屬於任何模組
2. `modules/*/interfaces/web/components/` 結構各模組不一致
3. 業務語意元件（如 `WorkspaceCard`）與 UI primitive（如 `Button`）層次混淆
4. 沒有設計系統的 token 治理（顏色、間距、字型只靠 Tailwind class 字串）

---

## 六邊形架構下的 UI 分層模型

```
Layer 0: Design Tokens    → packages/ui-shadcn (CSS variables, Tailwind config)
Layer 1: UI Primitives    → packages/ui-shadcn/ui/ (Button, Card, Dialog ...)
Layer 2: UI Compositions  → packages/ui-shadcn/ui/ (DataTable, FormField ...)
Layer 3: Domain UI        → src/modules/<context>/adapters/inbound/react/components/
Layer 4: Screen Adapters  → src/modules/<context>/adapters/inbound/react/ (Provider, Frame, Dispatcher)
Layer 5: App Routes       → src/app/ (純 shim，3 行)
```

**規則**：
- Layer 0–2 在 `packages/` — 無業務語意，可跨模組重用
- Layer 3 在模組 `adapters/inbound/react/components/` — 有業務語意，只被自己模組使用
- Layer 4 是 inbound adapter 本體（見問題一/三）
- Layer 5 永遠只是 import + mount

---

## 目標結構

### packages（Layer 0–2，不變，純整理）

```
packages/
  ui-shadcn/
    ui/              ← 原有 primitive 元件（Button, Input, Card ...），維持
    compositions/    ← 新增：無業務語意的複合元件
      DataTable.tsx
      FormField.tsx
      PageHeader.tsx
      EmptyState.tsx
      LoadingSpinner.tsx
    tokens/          ← 新增：設計 token 常數（不是 Tailwind class 字串）
      colors.ts
      spacing.ts
      typography.ts
```

### 各模組（Layer 3，統一命名規範）

```
src/modules/<context>/
  adapters/
    inbound/
      react/
        components/          ← Domain UI components（有業務語意）
          <Context>Card.tsx  ← e.g. WorkspaceCard.tsx
          <Context>List.tsx
          <Context>Form.tsx
          <Context>Panel.tsx
        <Context>Provider.tsx  ← Layer 4
        <Context>Frame.tsx     ← Layer 4
        use<Context>.ts        ← Layer 4 hooks
        index.ts               ← 只 export public surface
```

---

## 命名規範

| 元件類型 | 命名 | 位置 |
|---|---|---|
| UI Primitive | `Button`, `Card`, `Input` | `packages/ui-shadcn/ui/` |
| UI Composition | `DataTable`, `FormField`, `EmptyState` | `packages/ui-shadcn/compositions/` |
| Domain Component | `WorkspaceCard`, `NotebookPanel` | `src/modules/<context>/adapters/inbound/react/components/` |
| Screen Provider | `WorkspaceScopeProvider` | `src/modules/<context>/adapters/inbound/react/` |
| Shell Frame | `ShellFrame`, `ShellAppRail` | `src/modules/platform/adapters/inbound/react/` |
| App Route | `page.tsx`, `layout.tsx` | `src/app/` |

---

## 設計 Token 治理

問題：目前顏色、間距都是 Tailwind class 字串（`"bg-slate-900 text-white"`），分散在每個元件。

解方：在 `packages/ui-shadcn/tokens/` 定義語意 token，配合 Tailwind CSS v4 的 CSS variable：

```css
/* packages/ui-shadcn/tokens/globals.css */
:root {
  --color-surface: hsl(0 0% 100%);
  --color-surface-elevated: hsl(0 0% 98%);
  --color-on-surface: hsl(222 84% 5%);
  --color-brand: hsl(221 83% 53%);
  --color-destructive: hsl(0 72% 51%);
  --spacing-shell-rail: 3.5rem;
  --spacing-shell-sidebar: 16rem;
}
```

```typescript
// packages/ui-shadcn/tokens/spacing.ts
export const SHELL_RAIL_WIDTH = "var(--spacing-shell-rail)";
export const SHELL_SIDEBAR_WIDTH = "var(--spacing-shell-sidebar)";
```

---

## 遷移策略（三步驟）

### Step 1：清零 `app/(shell)/_shell/`
把 `ShellAppRail.tsx`、`ShellSidebar*` 遷移到 `src/modules/platform/adapters/inbound/react/`，業務邏輯分離。刪除 `_shell/` 資料夾。

### Step 2：各模組統一 `adapters/inbound/react/components/` 結構
把 `modules/*/interfaces/web/components/` 下的 Domain UI 複製到 `src/modules/*/adapters/inbound/react/components/`（配合蒸餾）。

### Step 3：`packages/ui-shadcn/compositions/` 提取共用複合元件
找出跨模組重複使用的 UI pattern（空狀態、載入指示、頁面標題），提取到 compositions 層，避免每個模組各自實作。

---

## 反模式（必須避免）

| 反模式 | 原因 | 正確做法 |
|---|---|---|
| `app/(shell)/_shell/` 類的非模組目錄 | 不屬於任何邊界，無法測試 | 移入 platform 模組 inbound adapter |
| Domain Component 放在 `packages/` | packages 不能有業務語意 | 移入對應模組 `adapters/inbound/react/components/` |
| `ShellFrame` 直接 import 其他模組 context | 跨模組邊界 | 透過 props 或各模組自己的 hook |
| Tailwind class 字串作為設計 token | 無法統一修改 | 用 CSS variable + token 常數 |
| 每個模組各自重新實作 LoadingSpinner | 重複 | 提取到 `packages/ui-shadcn/compositions/` |
