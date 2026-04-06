# AI Domain（Genkit Flow）

本文件說明 Xuanwu App 的 AI 領域設計，包含 Genkit 整合架構、RAG（Retrieval-Augmented Generation）管線，以及 `search`、`notebook`、`ai` 三個相關 bounded context 的職責分工。

> **相關文件：** [`domain-model.md`](./domain-model.md) · [`infrastructure-strategy.md`](./infrastructure-strategy.md) · [`use-cases.md`](./use-cases.md)

---

## AI 層架構概覽

```
使用者輸入問題
      │
      ▼
[Next.js Server Action]
  notebook.actions.ts / search.actions.ts
      │
      ▼
┌─────────────────────────────────────────────┐
│  search 模組 (RAG 核心)                      │
│                                               │
│  AnswerRagQueryUseCase.execute()              │
│  ┌─────────────────────────────────────────┐ │
│  │  1. 正規化輸入 + 前置驗證               │ │
│  │  2. RagRetrievalRepository.retrieve()   │ │  ← Firestore Vector Search
│  │     → topK 個相關 chunks（含 score）    │ │
│  │  3. RagGenerationRepository.generate()  │ │  ← Genkit / Gemini
│  │     → answer + citations               │ │
│  │  4. 組裝 RagStreamEvents                │ │
│  │  5. 返回 AnswerRagQueryResult           │ │
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
      │
      ▼
[notebook 模組]（可選：對話與研究增強層）
  Ask/Cite / Summary / Generation orchestration
      │ agentClient.generate()
      ▼
  Genkit + Gemini 2.5 Flash
```

---

## 有界上下文職責分工

### `search` — RAG 核心上下文

**職責：** Vector Search → Chunk Ranking → Answer Generation + Citations

| 元素 | 說明 |
|------|------|
| `AnswerRagQueryUseCase` | RAG 端對端流程（Retrieve + Generate） |
| `RagRetrievalRepository` | 向量搜索介面（Firestore Vector） |
| `RagGenerationRepository` | AI 生成介面（Genkit Gemini） |
| `GenkitRagGenerationRepository` | Genkit 實作：Context-grounded 答案生成 |
| `FirebaseRagRetrievalRepository` | Firestore Vector Search 實作 |
| `IVectorStore` port | 向量資料庫的可替換抽象埠 |

**Genkit Prompt 策略（RAG）：**

```
System:
  "You are the Xuanwu RAG orchestration layer.
   Answer only from the supplied context and preserve citations."

User:
  "Use the retrieved context to answer the user query.
   If the context is incomplete, answer conservatively.

   User query: {userQuery}

   Retrieved context:
   [doc:{docId} chunk:{chunkIndex} page:{page} taxonomy:{taxonomy}]
   {text}
   ---
   [doc:{docId2} chunk:{chunkIndex2} ...]
   {text2}"
```

**Citations 生成（Grounded Answer）：**

```typescript
citations = chunks.map(chunk => ({
  docId: chunk.docId,
  chunkIndex: chunk.chunkIndex,
  page: chunk.page,
  reason: `Retrieved from ${chunk.taxonomy} context with score ${chunk.score.toFixed(2)}.`,
}));
```

---

### `notebook` — AI 研究與對話上下文

**職責：** 對話式 AI 代理的 Thread、Message 管理，以及自由形式的 Genkit 流程編排

| 元素 | 說明 |
|------|------|
| `GenerateAgentResponseUseCase` | 對話生成（無 RAG 上下文） |
| `AnswerRagQueryUseCase` | RAG 增強的筆記本查詢（委派至 `search/api`） |
| `AgentRepository` | 代理生成介面 |
| `GenkitNotebookRepository` | Genkit 實作：自由對話生成 |
| `Thread` / `Message` | 對話歷程實體 |

---

## Genkit 整合細節

### Client 工廠

```typescript
// modules/notebook/infrastructure/genkit/client.ts
// modules/search/infrastructure/genkit/client.ts

const DEFAULT_MODEL = "googleai/gemini-2.5-flash";

export function createGenkitClient(options?: GenkitClientOptions) {
  return genkit({
    plugins: [googleAI()],
    model: getConfiguredGenkitModel(options?.model),
  });
}

// 可透過 GENKIT_MODEL 環境變數覆蓋模型
export function getConfiguredGenkitModel(model?: string): string {
  return model ?? process.env.GENKIT_MODEL ?? DEFAULT_MODEL;
}
```

**兩個獨立 client：**

| Client | 模組 | 系統提示策略 |
|--------|------|------------|
| `aiClient` | `retrieval/infrastructure/genkit` | Context-grounded，嚴格依據 chunks 回答 |
| `agentClient` | `agent/infrastructure/genkit` | 開放式對話，不限定 context |

### 模型調用（generate API）

```typescript
// Retrieval - 有 system prompt
const response = await aiClient.generate({
  prompt: buildPrompt(input),          // 包含 chunks context
  system: "...RAG system instruction",
  model: input.model,                  // 可選覆蓋
});

// Agent - 可選 system prompt
const response = await agentClient.generate({
  prompt: input.prompt,
  ...(input.system ? { system: input.system } : {}),
  model: input.model,
});
```

---

## RAG 串流事件（RagStreamEvent）

RAG 查詢結果以串流事件形式傳遞，便於前端逐步渲染：

```typescript
type RagStreamEvent =
  | { type: "token";    traceId: string; payload: string }        // AI 生成的文字片段
  | { type: "citation"; traceId: string; payload: RagCitation }   // 引用來源
  | { type: "done";     traceId: string; payload: RagRetrievalSummary }  // 完成摘要
  | { type: "error";    traceId: string; payload: DomainError }   // 錯誤
```

**AnswerRagQueryResult 結構：**

```typescript
interface AnswerRagQueryResult {
  ok: true;
  data: {
    answer: string;                    // 完整 AI 答案
    citations: RagCitation[];          // 引用來源列表
    retrievalSummary: RagRetrievalSummary;  // 檢索統計
    model: string;                     // 使用的 LLM 模型
    traceId: string;                   // 追蹤 ID（用於除錯）
    events: RagStreamEvent[];          // 串流事件序列
  };
}
```

---

## RAG 查詢範圍控制

查詢範圍由 `organizationId` + 可選的 `workspaceId` 決定：

| 參數 | 查詢範圍 | 說明 |
|------|---------|------|
| `organizationId` 只填 | 組織全範圍 | 搜索組織所有工作區的 chunks |
| `organizationId` + `workspaceId` | 工作區範圍 | 僅搜索特定工作區的 chunks |
| `taxonomy` | 領域過濾 | 進一步縮小至特定分類的 chunks |

```typescript
const result = await answerRagQueryUseCase.execute({
  organizationId: "org-123",
  workspaceId: "ws-456",    // 可選：縮小至工作區
  userQuery: "如何設定 CI/CD 流程？",
  taxonomy: "engineering",   // 可選：領域過濾
  topK: 5,                  // 預設 5，上限 10
});
```

---

## 錯誤碼

| 錯誤碼 | 說明 | 處理方式 |
|--------|------|---------|
| `QUERY_FILTER_SCOPE_MISSING` | organizationId 未提供 | 前端顯示「請選擇組織」 |
| `QUERY_INVALID_INPUT` | userQuery 為空 | 前端顯示「請輸入問題」 |
| `NO_RELEVANT_CHUNKS` | 向量搜索無結果 | 提示使用者確認文件已完成攝入 |
| `FLOW_MODEL_PROVIDER_ERROR` | Genkit/Gemini API 錯誤 | 顯示服務暫時不可用，記錄 traceId |
| `AGENT_GENERATE_FAILED` | Agent 生成失敗 | 同上 |

---

## topK 正規化策略

```typescript
const DEFAULT_TOP_K = 5;
const MAX_TOP_K = 10;

function normalizeTopK(value?: number): number {
  if (value === undefined || !Number.isFinite(value)) return DEFAULT_TOP_K;
  return Math.min(MAX_TOP_K, Math.max(1, Math.trunc(value)));
}
```

---

## Python Worker AI 整合

**Embedding 模型：** `Google textembedding-004`（在 `py_fn/` 執行）

```
py_fn 攝入管線
└── chunk.text → Embed → float[] → Firestore vector field
                          │
                     Firestore Vector Search
                          │
                    retrieval.FirebaseRagRetrievalRepository.retrieve()
                    → 返回 RagRetrievedChunk[]（含 score）
```

**Metadata 結構（每個 chunk 的 Firestore 文件）：**

```
{
  chunkIndex: number,
  text: string,
  vector: float[],              // Firestore Vector 欄位
  docId: string,
  organizationId: string,
  workspaceId: string,
  taxonomy: string,
  page?: number,
}
```

---

## 計畫中的 AI 能力

| 功能 | 狀態 | 說明 |
|------|------|------|
| Auto-link（知識圖自動連結） | 🔴 計畫中 | LinkExtractor service 已存在，觸發管道待建 |
| 串流 SSE 回應 | 🟡 評估中 | 目前 generate() 為一次性回應，非 streaming |
| 多輪對話上下文 | 🟡 評估中 | Thread/Message 模型已定義 |
| 跨模組 AI 事件 | 🟢 低優先 | `content.block-updated` → 自動重新索引 |
