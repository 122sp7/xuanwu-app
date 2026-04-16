# 問題五：packages 設計（簡易討論）

**Date**: 2026-04-16  
**Context**: src/ 架構完成後，packages 的定位與分類規則。

---

## 現況 packages 分類

```
packages/
  shared-*         → 純型別/工具，無框架依賴
  integration-*    → Firebase/HTTP 外部整合
  ui-*             → UI 元件庫 (shadcn, vis)
  lib-*            → 第三方庫 thin wrappers
  api-contracts    → 跨服務 API 型別契約
```

---

## src/ 架構後的 packages 定位

**原則：packages 只服務兩種目的**

| 類型 | 定位 | 使用層 | 規則 |
|---|---|---|---|
| **Shared Primitives** (`@shared-*`) | 純工具，無 DDD 概念 | 任何層 | 零業務邏輯，無模組依賴 |
| **Infrastructure Adapters** (`@integration-*`) | 外部系統實作 | `adapters/outbound/` 只 | 不能進 `domain/` 或 `application/` |
| **UI Primitives** (`@ui-*`) | 純 UI 元件庫 | `adapters/inbound/react/` 只 | 不包含業務語意 |
| **Lib Wrappers** (`@lib-*`) | 第三方包薄包裝 | 任何層（按各 lib 規則） | 不加業務語意 |

---

## api-contracts 的去向

目前 `api-contracts` 混合了「跨模組 API 型別」：

- 若是 cross-module published language tokens → 遷移到對應 `src/modules/<context>/api/`
- 若是純 HTTP wire 型別 → 留在 `@api-contracts` 或遷移到 `@integration-http`

---

## packages 不應增加的東西

- 業務規則（屬於 `src/modules/<context>/domain/`）
- 模組間狀態協調邏輯（屬於 `src/modules/<context>/adapters/inbound/react/`）
- 任何對 `src/modules/` 的 import（packages 是下游，不是上游）

---

## 長遠

考慮 npm workspaces 本地連結，但目前 tsconfig paths alias 方案已足夠，不應過早引入複雜度（Occam's Razor）。詳細討論見 [07-packages-pyfn-post-migration.md](./07-packages-pyfn-post-migration.md)。
