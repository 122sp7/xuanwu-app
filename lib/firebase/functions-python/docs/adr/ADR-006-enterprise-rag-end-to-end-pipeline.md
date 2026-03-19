# ADR 006: 企業級 RAG 的端到端流程與 runtime 分工

## 狀態 (Status)
**Accepted**

## 背景 (Context)

現有 ADR 已經定義：

- `functions-python` 是 worker / ingestion runtime
- Next.js 是 user-facing edge
- `functions-python` 內部採用 `interfaces -> application -> domain <- infrastructure`

但對企業級 RAG 而言，若沒有把 **Ingestion Pipeline**、**Query Pipeline**、以及可選的
**Retrieval 強化** 寫成正式 ADR，實作仍然容易退化成：

1. Upload、query、streaming、worker 任務混在同一個 runtime。
2. Python worker 被誤用成 product-facing API server。
3. Query-time enhancement（hybrid search / rerank / cache / feedback）沒有明確落點。
4. 已退休的 `lib/firebase/functions` 雖然本來就沒有前端交互，後續仍可能被誤以為需要重新引入。

## 決策 (Decision)

企業級 RAG 的端到端流程採用以下固定分工：

- **Next.js**：負責所有 browser-facing orchestration
- **Firebase Storage / Firestore**：負責原始檔案與 canonical metadata
- **Cloud Functions (Python)**：負責 ingestion / parsing / structuring / embedding 的背景處理
- **Genkit**：負責 query preprocess、prompt 組裝與回答生成

`lib/firebase/functions` 不再是此流程的一部分；其原因不是「先刪再說」，而是它本來就**不承接前端交互**，
也不再承擔 active worker responsibility。

## 設計細節 (Design)

### ① Ingestion Pipeline

```text
[Next.js upload file]
        ↓
[Firebase Storage raw file]
        ↓
[Firestore documents metadata: status=uploaded]
        ↓
[Cloud Functions (Python) trigger]
        ↓
[Download file / read binary]
        ↓
[Parsing: PDF / DOCX / HTML -> text]
        ↓
[Cleaning: normalize / denoise]
        ↓
[Document-level taxonomy]
        ↓
[Structuring / chunking]
        ↓
[Chunk-level metadata]
        ↓
[Embedding per chunk]
        ↓
[Firestore chunks persistence]
        ↓
[Firestore vector index ready]
        ↓
[Document status = ready]
```

### ② Query Pipeline

```text
[Next.js user query]
        ↓
[Route Handler / Server Action]
        ↓
[Genkit query preprocess]
        ↓
[Query embedding]
        ↓
[Firestore vector search: top-k + taxonomy filters]
        ↓
[Top-k chunks]
        ↓
[Context assembly / prompt building]
        ↓
[Genkit LLM answer generation]
        ↓
[Next.js streaming response]
```

### ③ Runtime ownership

#### Next.js owns

- upload UI / browser interaction
- auth / session / cookies / request context
- initial document creation and upload orchestration
- Route Handlers / Server Actions
- query preprocess
- vector-search request orchestration
- prompt building
- final response shaping
- streaming back to the UI
- feedback submit

#### functions-python owns

- Storage / Firestore triggered worker execution
- raw file download
- parsing
- cleaning
- document taxonomy
- chunking / structuring
- chunk metadata generation
- embedding generation
- chunk persistence
- document status transition
- reprocess / backfill / internal maintenance jobs

### ④ Optional enterprise enhancements

#### Hybrid Search

```text
[Vector Search]
   + [Keyword Search / BM25]
        ↓
[Hybrid merge / rerank]
```

- Query-time orchestration仍屬 **Next.js / Genkit**
- worker 若需要支援 hybrid retrieval，可在 ingestion 階段準備 keyword-friendly fields

#### Re-ranking

```text
[Top-k chunks]
        ↓
[Cross-Encoder / LLM rerank]
        ↓
[Top-n chunks]
```

- 屬於 query-time precision enhancement
- 不應把 product-facing rerank orchestration 放回 worker runtime

#### Cache

```text
[Query hash]
        ↓
[Firestore / Redis cache]
        ↓
[hit -> return cached response]
```

- cache policy 與 UX strongly coupled，應優先由 **Next.js** 管理

#### Feedback Loop

```text
[User feedback 👍👎]
        ↓
[Firestore persistence]
        ↓
[ranking / prompt improvement]
```

- feedback 入口在 **Next.js**
- worker 可在後續離線分析或批次調整時參與，但不是 browser entrypoint

## Alternatives Considered

### 方案 A：把 Query Pipeline 也搬到 Python Functions

**不採用。**

原因：

- query / streaming 與 auth/session/request context 高耦合
- 會讓 product-facing API 分散
- 與 `functions-python` 的 worker runtime 定位衝突

### 方案 B：重新引入 `lib/firebase/functions` 處理前端互動

**不採用。**

原因：

- `lib/firebase/functions` 本來就沒有前端交互
- 重新引入只會再次製造 runtime ambiguity
- 既有 user-facing orchestration 已經明確留在 Next.js

## 後果 (Consequences)

### 正面影響

1. Ingestion 與 Query 責任完全分離，Copilot 可直接判斷功能落點。
2. 企業級 RAG 的 optional enhancements 有明確歸屬，不再靠口頭共識。
3. Python-only worker runtime 與 Next.js-only product edge 的邊界更加穩定。

### 負面影響

1. 需要維護跨 runtime 的文件一致性。
2. Query 與 worker 的 observability 需要分開設計。

## Migration Impact

- 未來新增的 ingestion / embedding / reprocess 能力，應直接落在 `functions-python`
- 未來新增的 upload / query / stream / feedback API，應直接落在 Next.js
- 不應為了「看起來對稱」而重新建立 Node Functions 中介層
