# integration-ai — Agent Rules

此套件是 **AI 服務整合的唯一封裝層**：Genkit、Google AI、OpenAI。
AI 能力的 provider 設定與 flow 呼叫必須集中在此，業務層不得直接 import AI SDK。

---

## Route Here

| 類型 | 說明 |
|---|---|
| Genkit flow 呼叫 | `runGenkitFlow(flowName, input)` — flow 呼叫入口 |
| AI provider 初始化 | Google AI / OpenAI client 設定 |
| AI 服務 API 型別 | `GenerateRequest`、`GenerateResponse` 等共用型別 |
| Safety / policy 設定原語 | 供 `src/modules/ai/` 消費的 policy config |

## Route Elsewhere

| 類型 | 正確位置 |
|---|---|
| AI 業務邏輯（prompt 組裝、RAG 流程） | `src/modules/ai/` |
| Notebook 推理流程 | `src/modules/notebooklm/` |
| Genkit flow **定義**（非呼叫） | `src/modules/ai/` 或 py_fn/ |

---

## 嚴禁

```ts
// ❌ 在 modules/notebooklm 直接 import AI SDK
import { generate } from '@genkit-ai/core'

// ✅ 透過此套件或 modules/ai 邊界
import { runGenkitFlow } from '@integration-ai'
```

- 不得在此套件加入業務 prompt 範本或 RAG 邏輯
- 不得 import `src/modules/*`
- 環境設定只能來自 env vars（`GOOGLE_AI_API_KEY` 等）

## Alias

```ts
import { ... } from '@integration-ai'
```
