# integration-ai

AI 服務整合層：Genkit singleton、flow 執行合約、共用 AI 型別。

## 套件結構

```
packages/integration-ai/
  index.ts    ← 合約型別 + createUnconfiguredAiClient
  genkit.ts   ← Genkit singleton（`ai` 實例）
  AGENTS.md
```

## 公開 API

```ts
// 從 index.ts（瀏覽器安全的型別 + 合約）
import {
  type AiGenerateTextInput,
  type AiGenerateTextResult,
  type AiTextClient,
  IntegrationAiConfigurationError,
  IntegrationAiFlowError,
  createUnconfiguredAiClient,
} from '@integration-ai'

// Genkit singleton（Server 端，在 infrastructure/ai/ 中使用）
// genkit/googleAI 是 Server-only，不包含在 index.ts barrel 內
import { ai } from '@integration-ai/genkit'
```

## 使用規則

| 規則 | 說明 |
|---|---|
| **只允許在 `infrastructure/ai/` 使用** | Flow 定義放 `infrastructure/ai/*.flow.ts` |
| **禁止在 `domain/` 或 `application/` import** | 這兩層依賴 port 介面，不依賴 genkit 直接呼叫 |
| **flow 必須有 inputSchema + outputSchema** | 使用 Zod（`genkitZ`）定義 |
| **AI 輸出在返回 application 前必須驗證** | `outputSchema.parse(output)` |
| **環境憑證只來自 env vars** | `GOOGLE_GENAI_API_KEY` / `GOOGLE_API_KEY` |

## Flow 定義範例

```ts
import { ai } from '@integration-ai/genkit'
import { genkitZ } from '@integration-ai'
import { googleAI } from '@genkit-ai/google-genai'

export const synthesisFlow = ai.defineFlow(
  {
    name: 'notebooklm.synthesis',
    inputSchema: genkitZ.object({ query: genkitZ.string() }),
    outputSchema: genkitZ.object({ answer: genkitZ.string() }),
  },
  async ({ query }) => {
    const { text } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: query,
    })
    return { answer: text }
  },
)
```

## Context7 官方基線

- 文件：`/websites/genkit_dev_js`
- flow/tool 必須有 schema（輸入/輸出）；避免回傳未驗證的模型結果。
- Genkit singleton 以 `genkit({ plugins: [googleAI()] })` 初始化一次。
