# infra/uuid

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
