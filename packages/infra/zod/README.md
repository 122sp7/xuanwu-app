# infra/zod

<!-- nested-index:start -->
## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent AGENTS: [AGENTS.md](../AGENTS.md)
- Parent README: [README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Package / Directory Index

- `index.ts`

## Pair Contract

- `README.md` 保留最短概覽與實際目錄索引。
- `AGENTS.md` 保留 routing 與放置決策。
<!-- nested-index:end -->


Zod 基礎設施原語。封裝 **Zod v4**，提供共用 schema 片段、brand helper、邊界驗證工具。

## 公開 API

```ts
import {
  z,

  // 共用 schema 片段
  UuidSchema,
  IsoDateTimeSchema,

  // Domain value object helper
  createBrandedUuidSchema,

  // 邊界驗證工具
  zodErrorToFieldMap,   // ZodError -> Record<fieldPath, messages[]>
  zodParseOrThrow,      // 驗證失敗時拋出 Error（附摘要）
  zodSafeParse,         // 不拋出，回傳 { success, data, error }
} from '@infra/zod'
```

## 三層驗證位置（架構規則）

| 層級 | 用途 | API |
|---|---|---|
| `interfaces/` Server Action 邊界 | 外部輸入驗證 | `zodParseOrThrow` |
| `domain/value-objects/` | Brand type 定義 | `createBrandedUuidSchema` / `z.brand()` |
| `infrastructure/` adapter | 外部系統輸出驗證 | `z.parse()` / `zodSafeParse` |

## 範例

```ts
// ─── Server Action boundary ───────────────────────────────────────
import { z, zodParseOrThrow } from '@infra/zod'

const InputSchema = z.object({ name: z.string().min(1) })

export async function createWorkspaceAction(raw: unknown) {
  const input = zodParseOrThrow(InputSchema, raw)
  // input is typed InputSchema
}

// ─── Domain value object ──────────────────────────────────────────
import { createBrandedUuidSchema } from '@infra/zod'

export const WorkspaceIdSchema = createBrandedUuidSchema('WorkspaceId')
export type WorkspaceId = typeof WorkspaceIdSchema._type
```

## Context7 官方基線

- 文件：`/colinhacks/zod`（Zod v4）
- 邊界驗證採 `parse` / `safeParse`；錯誤統一回傳 `ZodError.issues` 結構。
- `z.object().passthrough()` 禁止用於生產資料路徑。
