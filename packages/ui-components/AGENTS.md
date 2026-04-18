# ui-components — Agent Rules

此套件是 **業務無關的自訂 UI 組件庫**，提供設計系統擴充組件與 shadcn/ui 的 thin wrapper。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 設計系統擴充組件 | 有設計語意但無業務語意的組件（`DataTable`、`EmptyState`、`LoadingSkeleton`） |
| shadcn thin wrapper | 加設計 token 或共用 variant 的 wrapper |
| Layout 原語 | `PageShell`、`SectionHeader` 等版面組件 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 有業務語意的 UI（WorkspaceCard、TaskRow） | `src/modules/<context>/interfaces/` |
| shadcn 官方原始組件 | `packages/ui-shadcn/ui/`（CLI 生成，不直接放這裡）|
| 主題 token | `src/app/globals.css` CSS 變數層 |

---

## 嚴禁

- 不得包含業務判斷邏輯（module 層級 use case、domain rule）
- 不得 import `src/modules/*`
- 不得 import Firebase 或任何外部服務 SDK

## Alias

```ts
import { ... } from '@ui-components'
```
