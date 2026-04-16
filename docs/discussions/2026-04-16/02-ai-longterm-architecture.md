# 問題二：AI 相關功能的長遠開發性

**Date**: 2026-04-16  
**Context**: `src/modules/ai` 蒸餾完成 (commit 46dd39a3)，port 層已存在，adapter 尚未實作。

---

## 現況

`src/modules/ai` 已有正確的 port 設計：

- `TextGenerationPort`、`ContentDistillationPort`、`TaskExtractionPort`（generation 子域）
- `VectorRetrievalPort`、`RetrievalQueryPort`（retrieval 子域）
- `ContextSession` entity + use-cases（context 子域）
- `MemoryItem` entity（memory 子域）
- `AiTool` entity（tool-calling 子域）

**問題**：所有 adapter 尚為 InMemory mock，沒有 production 實作。

---

## 長遠開發框架

### 原則一：AI 永遠是外部不信任 Actor

```
Use Case
  → AI Port (interface in domain/)
  → Adapter (in adapters/outbound/)
  → validate output with Zod
  → return typed result to use case
```

AI output 未通過 Zod schema parse 之前，永遠不進入 domain 層。

### 原則二：Provider 策略模式（可熱換）

```
src/modules/ai/
  adapters/
    outbound/
      genkit/                      ← production adapter（首選）
        GenkitGenerationAdapter.ts
        GenkitRetrievalAdapter.ts
        GenkitEmbeddingAdapter.ts
      openai/                      ← alternative adapter（同 port）
        OpenAIGenerationAdapter.ts
        OpenAIEmbeddingAdapter.ts
      local/                       ← offline/dev adapter
        LocalGenerationAdapter.ts
      mock/                        ← test adapter（目前 InMemory 即是）
        MockGenerationAdapter.ts
```

所有 adapter 實作相同的 port interface → DI 組裝時抽換，不影響任何 use-case 或 domain。

### 原則三：Streaming 以 AsyncGenerator 為 port contract

```typescript
// domain port — 不含框架細節
export interface TextGenerationPort {
  generate(input: GenerationInput): Promise<GenerationOutput>;
  generateStream(input: GenerationInput): AsyncGenerator<GenerationChunk>;
}
```

React Server Component 消費 `generateStream`，透過 `ReadableStream` 傳到 client — Next.js 層細節，不進 domain。

### 原則四：py_fn 是 AI 的 outbound worker

Python 端（`py_fn/`）擁有 embedding、chunking、indexing 的 production 實作（OpenAI、Upstash Vector）。這是 outbound worker adapter，契約由 `src/modules/ai/` 的 port interface 定義，透過 QStash message 或 Firestore trigger 觸發。

```
src/modules/ai (port 定義)
  ↓ QStash message
py_fn/src/infrastructure/external/openai/embeddings.py (實作)
```

---

## AI 子域演化路徑

| 階段 | 重點 | 對應子域 |
|---|---|---|
| 已完成 | Port 定義 + InMemory mock | generation, retrieval, chunk, embedding |
| 近期 | Genkit adapter 實作（Next.js 端） | generation, pipeline |
| 中期 | RAG 評估回路 | evaluation, citation |
| 長期 | Multi-agent 協作 | context, memory, tool-calling |

每個子域獨立演化，不觸碰其他子域內部。

---

## 模組邊界守則

| 規則 | 說明 |
|---|---|
| `notion` 不直接呼叫 AI | notion 只發布 domain event；platform 路由到 ai adapter |
| `notebooklm` 消費 `ai` API | notebooklm 持有 conversation + notebook 業務語意；ai 持有技術機制 |
| `workspace` 不持有 AI 邏輯 | workspace 透過 notebooklm.api 取得 AI 生成結果 |
| AI output 一律 Zod 驗證 | 任何從 AI adapter 回來的資料在 infrastructure 層 parse；失敗 → 視為外部錯誤 |

---

## 跨 runtime 協作契約（Next.js ↔ py_fn）

```
Next.js (src/modules/ai adapters/outbound/genkit/)
  → heavy job → QStash message
  → py_fn/src/interface/handlers/rag_ingestion.py
  → py_fn/src/application/use_cases/rag_ingestion.py
  → py_fn/src/infrastructure/external/openai/embeddings.py
  → Upstash Vector write
  → Firestore mark ready
```

契約：QStash message payload 使用 Zod schema 定義於 `src/modules/ai/subdomains/embedding/` 的 published language。
