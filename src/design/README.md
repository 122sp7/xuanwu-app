# src/design — Design Tokens & System Foundations

`src/design/` 儲存全域設計基礎層，包含 design tokens、spacing scale、color palette、typography 等視覺基準，供 `src/ui/` 與 `src/app/` 引用。

## 職責

- 定義並匯出 design token（colors、spacing、typography、breakpoints、shadows）
- 不包含任何 React 元件或業務邏輯
- 不依賴 `src/modules/`、`modules/` 或 Firebase

## 設計原則

- Token 命名遵循 Tailwind CSS 4 語意化命名規則（`--color-primary`、`--spacing-*`）
- 所有 token 必須可追溯到 `tailwind.config.ts`
- 不在此層撰寫互動行為或元件狀態

## 相關層

| 層 | 用途 |
|---|---|
| `src/design/` | Token 定義（本層） |
| `src/ui/` | 基於 token 組合的共用 UI 元件 |
| `packages/ui-shadcn/` | shadcn/ui 元件庫封裝 |
| `src/app/` | 路由組合與 Layout 组裝 |
