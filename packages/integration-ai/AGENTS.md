# integration-ai — Agent Rules

此套件是 **AI SDK（Genkit、Google AI）的唯一封裝層**。所有與 AI 模型、flow、embedding 服務的互動必須透過此套件，不得在 `src/modules/` 或 `src/app/` 中直接 import AI SDK。

---

## Route Here（放這裡）

| 類型 | 說明 |
|---|---|
| Genkit 初始化與設定 | AI client 初始化 singleton |
| AI Flow 執行原語 | `runFlow`、`streamFlow` 等底層呼叫封裝 |
| Embedding 生成 | `generateEmbedding`、`batchEmbedding` 封裝 |
| 模型 API 呼叫封裝 | normalize model input/output 格式 |
| AI SDK 設定（API key、model name） | 從 env vars 讀取，在此統一管理 |

## Route Elsewhere（不放這裡）

| 類型 | 正確位置 |
|---|---|
| AI Flow 業務邏輯（prompt 設計、grounding） | `src/modules/platform/` 或 `src/modules/notebooklm/` |
| Safety guardrail policy | `src/modules/platform/` ai subdomain |
| RAG pipeline 編排 | `src/modules/notebooklm/` 或 `py_fn/` |
| Domain 層使用 AI 能力 | 透過 port interface，不直接 import 此套件 |

---

## 嚴禁

```ts
// ❌ 直接在 modules 中 import Genkit
import { genkit } from 'genkit'

// ✅ 必須透過此套件
import { runAiFlow } from '@integration-ai'
```

- 不得在此套件加入 prompt 設計或業務判斷
- 不得 import `src/modules/*` 任何路徑
- 不得在此套件處理 safety policy（由 platform.ai 負責）
- API key 等敏感設定只能來自 server-side env vars（不含 `NEXT_PUBLIC_`）

---

## Alias

```ts
import { ... } from '@integration-ai'
```

只允許在 `src/modules/*/adapters/outbound/` 使用（ESLint boundary 規則）。
