# infra/uuid — Agent Rules

<!-- nested-index:start -->
## Immediate Index

- Pair: [README.md](README.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `packages/infra/uuid/` 的 routing 與 nested index。
- `README.md` 保留同節點的人類可讀概覽。
<!-- nested-index:end -->


此套件是 **UUID 生成的唯一授權來源**。
`domain/` 層需要 id 生成時，**必須使用此套件**，不得直接呼叫 `crypto.randomUUID()`。

---

## Route Here

| 類型 | 說明 |
|---|---|
| UUID v4 生成 | `generateId()` — 唯一 id 生成入口 |
| UUID 驗證 | `isValidUUID(value)` — 格式驗證 |
| UUID 型別 | `UUID` brand type |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| domain brand type 定義 | `src/modules/<context>/domain/value-objects/` |
| Zod UUID schema | `packages/infra/zod/` |

---

## 嚴禁

```ts
// ❌ 在 domain/ 直接呼叫 crypto
const id = crypto.randomUUID()

// ✅ 必須透過此套件
import { generateId } from '@infra/uuid'
const id = generateId()
```

- 不得在此套件包含任何業務語意
- `domain/` 層違反此規則屬 ADR 1101 層違規，必須立即修正

## Alias

```ts
import { generateId, isValidUUID, type UUID } from '@infra/uuid'
```
