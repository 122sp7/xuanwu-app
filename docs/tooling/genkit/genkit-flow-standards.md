# Genkit Flow Standards

AI orchestration 基線採 **Genkit**。所有 AI 能力（Flow、Tool Calling、Prompt Pipeline）視為外部能力，由 `platform` 主域的 `ai` 子域統一治理。`notebooklm` 使用這些能力，`notion` 對 AI 一無所知。

## 核心原則

1. **AI 是外部依賴**：Genkit SDK 只存在於 `platform/infrastructure/` 或 `platform/subdomains/ai/` 的 adapter 層，任何 `domain/` 核心不直接依賴 Genkit。
2. **輸入輸出明確定型**：每個 flow 必須以 Zod schema 定義 input 與 output，不允許 `any` 或 `unknown`。
3. **AI 輸出先驗證，再進 use case**：AI 回傳結果必須通過 Zod parse，失敗視為外部錯誤，不得讓未驗證的 AI 輸出直接進入 domain。
4. **AI 不直接改 domain 狀態**：AI flow 回傳資料後，由 use case 決定是否觸發 domain 變更。
5. **可觀測性是必需品，不是選項**：所有 flow 執行必須記錄輸入、輸出、模型版本、時間戳，確保可重放與可稽核。

---

## 治理邊界

| 治理項目 | 歸屬 |
|---|---|
| provider 選擇（Gemini / OpenAI / Vertex AI 等）| `ai context` |
| quota 限制、rate limiting | `ai context` |
| safety policy、content filtering | `ai context` |
| flow 定義（retrieval、synthesis、evaluation）| `notebooklm` |
| prompt template 管理 | `notebooklm`（可委託 `ai context` 的 prompt registry）|
| embedding pipeline | `py_fn`（背景 worker）|

---

## Flow 結構規範

### 標準 Flow 骨架

```typescript
// src/modules/notebooklm/subdomains/conversation/adapters/outbound/ai/synthesis.flow.ts
import { defineFlow } from '@genkit-ai/core';
import { z } from 'zod';

// 1. 明確定義 input schema
const SynthesisInputSchema = z.object({
  notebookId: z.string().uuid(),
  query: z.string().min(1).max(2000),
  groundingChunks: z.array(z.object({
    chunkId: z.string().uuid(),
    content: z.string(),
    sourceRef: z.string(),
  })).min(1).max(20),
  modelConfig: z.object({
    temperature: z.number().min(0).max(1).default(0.3),
  }).optional(),
});

// 2. 明確定義 output schema
const SynthesisOutputSchema = z.object({
  answer: z.string(),
  citations: z.array(z.object({
    chunkId: z.string().uuid(),
    excerpt: z.string(),
  })),
  modelVersion: z.string(),
  completedAt: z.string().datetime(),
});

export type SynthesisInput = z.infer<typeof SynthesisInputSchema>;
export type SynthesisOutput = z.infer<typeof SynthesisOutputSchema>;

export const synthesisFlow = defineFlow(
  {
    name: 'notebooklm.synthesis',
    inputSchema: SynthesisInputSchema,
    outputSchema: SynthesisOutputSchema,
  },
  async (input) => {
    // 3. 執行 AI 推理
    // ...呼叫 model、組裝 prompt、接收結果...

    // 4. 回傳結果（Genkit 會以 outputSchema 驗證）
    return {
      answer,
      citations,
      modelVersion: 'gemini-1.5-pro',
      completedAt: new Date().toISOString(),
    };
  }
);
```

### Use Case 中使用 Flow 的正確模式

```typescript
// src/modules/notebooklm/subdomains/conversation/application/use-cases/synthesize-answer.use-case.ts
export class SynthesizeAnswerUseCase {
  constructor(
    private readonly aiPort: AIOrchestrationPort,  // port，不是直接依賴 flow
    private readonly notebookRepository: NotebookRepository,
    private readonly auditLogger: AuditLogPort,
  ) {}

  async execute(command: SynthesizeAnswerCommand): Promise<SynthesisResult> {
    // 1. 先驗證 domain 前置條件
    const notebook = await this.notebookRepository.findById(command.notebookId);
    if (!notebook.canSynthesize()) {
      throw new NotebookNotReadyError(command.notebookId);
    }

    // 2. 記錄 AI 請求（traceability）
    const traceId = generateId();
    await this.auditLogger.recordAIRequest({
      traceId,
      source: 'notebooklm.synthesize-answer',
      input: command,
      initiatedAt: new Date().toISOString(),
    });

    // 3. 呼叫 AI port（不直接呼叫 flow）
    const rawResult = await this.aiPort.runSynthesis({
      notebookId: command.notebookId,
      query: command.query,
      groundingChunks: command.chunks,
    });

    // 4. AI 輸出驗證（在 port 實作中完成，use case 只信任 port 回傳的型別）

    // 5. 持久化後再觸發 domain event
    notebook.recordSynthesisCompleted(traceId, rawResult.modelVersion);
    await this.notebookRepository.save(notebook);

    return { traceId, answer: rawResult.answer, citations: rawResult.citations };
  }
}
```

---

## Tool Calling 規範

- Tool 定義放在 `platform/subdomains/ai/tools/` 或 `notebooklm/infrastructure/ai/tools/`
- 每個 tool 必須有明確的 `description`（模型依賴此描述判斷使用時機）
- Tool 的 input / output 必須以 Zod schema 定型
- Tool 呼叫結果必須驗證，不允許直接 passthrough

```typescript
// 正確：有 schema 的 tool 定義
import { defineTool } from '@genkit-ai/core';

const retrieveChunksTool = defineTool(
  {
    name: 'retrieveGroundingChunks',
    description: '根據查詢語句從 vector index 取回最相關的知識片段，用於回答問題的 grounding',
    inputSchema: z.object({
      query: z.string(),
      limit: z.number().int().min(1).max(20).default(5),
    }),
    outputSchema: z.array(z.object({
      chunkId: z.string().uuid(),
      content: z.string(),
      score: z.number(),
    })),
  },
  async ({ query, limit }) => {
    // 呼叫 vector search adapter
    return retrievalAdapter.search(query, limit);
  }
);
```

---

## Prompt Pipeline 規範

- Prompt template 以結構化字串管理，不散落在 flow 實作中
- 系統 prompt 與使用者 prompt 分開定義
- 支援多語言、多模型的 prompt 需納入 `ai context` 的 prompt registry 治理

```typescript
// 正確：prompt 以 definePrompt 或 template 函式管理
const synthesisPrompt = (input: SynthesisInput) => `
你是知識助理，依照以下參考資料回答問題，回答必須引用來源。

### 參考資料
${input.groundingChunks.map((c, i) => `[${i + 1}] ${c.content}`).join('\n\n')}

### 問題
${input.query}

### 回答要求
- 每個主張必須引用對應的 [編號]
- 若資料不足以回答，明確告知「資料不足」
- 不可捏造不在參考資料中的資訊
`;
```

---

## 可觀測性（Traceability）硬性要求

每次 AI flow 執行都必須記錄：

| 欄位 | 說明 |
|---|---|
| `traceId` | 請求唯一識別碼（UUID） |
| `source` | 發起模組與 use case 名稱 |
| `flowName` | Genkit flow 名稱 |
| `modelVersion` | 實際使用的模型版本 |
| `inputHash` | input 的 hash（用於去重與比對） |
| `initiatedAt` | 請求開始時間（ISO string） |
| `completedAt` | 請求完成時間（ISO string） |
| `status` | `success` / `failed` |
| `errorCode` | 失敗時的錯誤分類 |

---

## 禁止模式

- ❌ 在 `domain/` 直接 `import { defineFlow }` 或任何 Genkit symbol
- ❌ AI flow 結果不驗證直接賦值給 domain aggregate
- ❌ 在 `notion/` 的任何層呼叫或引用 AI flow
- ❌ workspace 直接呼叫 ai context 或 Genkit（workspace 只能呼叫 notebooklm.api）
- ❌ 不記錄 traceId 的 AI 呼叫
- ❌ Prompt 以魔法字串散落在 use case 實作中

---

## Document Network

- [state-machine-model.md](./state-machine-model.md)
- [event-driven-design.md](./event-driven-design.md)
- [firebase-architecture.md](./firebase-architecture.md)
- [`../.github/instructions/genkit-flow.instructions.md`](../../.github/instructions/genkit-flow.instructions.md)
- [`docs/structure/contexts/platform/README.md`](../contexts/platform/README.md)
- [`docs/structure/contexts/notebooklm/README.md`](../contexts/notebooklm/README.md)
