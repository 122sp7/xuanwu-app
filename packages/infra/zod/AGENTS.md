# infra/zod — Agent Rules

此套件提供 **Zod 基礎設施原語**：共用 schema 片段、brand type helper、通用驗證工具。

---

## Route Here

| 類型 | 說明 |
|---|---|
| 共用 Zod schema 片段 | email、url、isoDate 等共用格式 schema |
| Brand type helper | `createBrandedId<T>()` 等建立 brand type 的工具 |
| 通用 Zod 工具 | `zodToFormError()` — Zod error 轉 UI 錯誤格式 |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| 業務 domain brand type | `src/modules/<context>/domain/value-objects/` |
| 外部 boundary 驗證 schema | `src/modules/<context>/interfaces/` server action 邊界 |
| infrastructure output 驗證 | `src/modules/<context>/adapters/outbound/` |

---

## 嚴禁

- 不得在此套件加入業務規則（invariant）
- 不得 import `src/modules/*`

## Alias

```ts
import { ... } from '@infra/zod'
```
