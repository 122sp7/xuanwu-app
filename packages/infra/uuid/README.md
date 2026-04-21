# infra/uuid

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


UUID 生成原語。封裝 **uuid v13**，是 domain 層唯一允許的 ID 生成入口。

## 公開 API

```ts
import {
  generateId,   // v4 UUID string
  isValidUUID,  // boolean
  asUUID,       // branded type cast
} from '@infra/uuid'
```

## 使用規則

| ✅ 正確 | ❌ 錯誤 |
|---|---|
| `import { generateId } from '@infra/uuid'` | `import { v4 as uuidv4 } from 'uuid'` |
| 只在 `domain/` factory 或 `application/` use case 呼叫 | 在 `infrastructure/` 或 `interfaces/` 中生成 ID |

## Context7 官方基線

- 文件：`/uuidjs/uuid`
- 實作：以 `v4()` 生成 ID；驗證時用 `validate()`（必要時再加 `version() === 4`）。
