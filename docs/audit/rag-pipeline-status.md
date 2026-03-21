# RAG Pipeline 13-Layer Audit Report

> Generated: 2026-03-21
> Branch: `copilot/update-wiki-module-features`

---

## Summary

| # | Layer | Status | Owner |
|---|-------|--------|-------|
| 1 | 文件上傳（Document Upload） | ✅ | Next.js |
| 2 | OCR（Optical Character Recognition） | ✅ | functions-python |
| 3 | 資料擷取層（Ingestion Layer） | ✅ | functions-python |
| 4 | 解析與結構化層（Parsing & Structuring Layer） | ✅ | functions-python |
| 5 | 知識建模層（Knowledge Modeling Layer） | ✅ | functions-python |
| 6 | 文本前處理層（Text Preprocessing Layer） | ✅ | functions-python |
| 7 | 文本分塊層（Text Chunking Layer） | ✅ | functions-python |
| 8 | 向量化層（Embedding Layer） | ✅ | functions-python + Next.js |
| 9 | 索引層（Indexing Layer） | ✅ | functions-python (Firestore) |
| 10 | 語意檢索層（Semantic Retrieval Layer） | ✅ | Next.js (modules/ai + modules/wiki) |
| 11 | 約束過濾層（Constraint & Filtering Layer） | ⚠️ 部分完成 | Next.js (modules/ai) |
| 12 | 重排序層（Reranking Layer） | ❌ | 尚未實作 |
| 13 | 推理與生成層（Reasoning & Generation / RAG） | ✅ | Next.js (modules/ai Genkit) |

**完成：10/13 ✅ ｜ 部分完成：1/13 ⚠️ ｜ 未完成：1/13 ❌ ｜ 已規劃但未觸發：1/13**

---

## Layer 1: 文件上傳（Document Upload） — ✅ 已完成

### 實作位置

| 元件 | 路徑 |
|------|------|
| Server Action | `modules/file/interfaces/_actions/file.actions.ts` → `registerUploadedRagDocument()` |
| Use Case | `modules/file/application/use-cases/register-uploaded-rag-document.use-case.ts` |
| Repository | `modules/file/infrastructure/firebase/FirebaseRagDocumentRepository.ts` |
| UI 入口 | `modules/workspace/interfaces/components/WorkspaceWikiTab.tsx` → 「上傳文件」按鈕 |
| Firestore 路徑 | `knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}` |

### 詳細描述

- 支援格式：PDF, DOCX, DOC, HTML, HTM, TXT, MD
- 大小限制：1 KB ～ 50 MB
- 上傳後在 Firestore 建立 `RagDocumentRecord`，status 設為 `"uploaded"`
- 寫入欄位包含：displayName, title, sourceFileName, mimeType, storagePath, sizeBytes, checksum, taxonomy, category, department, language, accessControl, versionGroupId, versionNumber, isLatest, accountId
- Storage 路徑：`organizations/{orgId}/workspaces/{wsId}/files/{fileName}`
- 上傳驗證規則、元資料填寫均有文件記載（`docs/architecture/wiki.md §5.4`）

### UI/UX

- WorkspaceWikiTab 提供「上傳文件」按鈕
- WikiWorkspaceDocView 提供文件列表 + 連結至 `/workspace/{id}?tab=Files`
- 上傳後即時在文件列表中顯示（status badge 標示為 uploaded/processing/ready/failed）

---

## Layer 2: OCR（Optical Character Recognition） — ✅ 已完成

### 實作位置

| 元件 | 路徑 |
|------|------|
| Cloud Function callable | `functions-python/main.py` → `process_document_with_ai` |
| Handler | `functions-python/app/document_ai/interfaces/callables/process_document_with_ai.py` |
| Use Case | `functions-python/app/document_ai/application/use_cases/process_document_with_ai.py` |
| OCR Extractor Adapter | `functions-python/app/document_ai/infrastructure/google/document_ai_processor.py` → `GoogleCloudDocumentAiProcessor` |
| OCR Classifier Adapter | `functions-python/app/document_ai/infrastructure/google/document_ai_classifier.py` → `GoogleCloudDocumentAiClassifier` |
| 次級 OCR（ingestion 內） | `functions-python/app/rag_ingestion/infrastructure/google/document_ai_parser.py` → `DocumentAiRagParser` |

### 詳細描述

- **雙路 OCR 實作**：
  1. 獨立 callable（`process_document_with_ai`）：接收 base64 編碼的檔案內容，回傳 text + pageCount
  2. Ingestion 內嵌（`DocumentAiRagParser`）：在 RAG ingestion pipeline 中自動從 Storage 下載二進位檔案，送 OCR Extractor 解析
- 使用 Google Cloud Document AI：
  - OCR Extractor processor（`ocr_extractor_resource`）：萃取文字
  - OCR Classifier processor（`ocr_classifier_resource`）：分類文件類型
- 條件啟用：僅在 `DOCUMENTAI_PROJECT_ID` 環境變數設定時啟用，否則 fallback 至 `PassthroughRagParser`
- Audit log：處理結果記錄至 Firestore `document_ai_audit_logs` collection

### UI/UX

- Wiki 模組的 `callDocumentAi` server action（`modules/wiki/interfaces/_actions/wiki-document.actions.ts`）提供 callable 呼叫包裝
- WorkspaceWikiTab 中的「重試」按鈕（`retryDocumentProcessing`）可重新觸發完整 ingestion pipeline（含 OCR）

---

## Layer 3: 資料擷取層（Ingestion Layer） — ✅ 已完成

### 實作位置

| 元件 | 路徑 |
|------|------|
| Cloud Function callable | `functions-python/main.py` → `process_uploaded_rag_document` |
| Firestore trigger | `functions-python/main.py` → `process_uploaded_rag_document_on_create` |
| Handler | `functions-python/app/rag_ingestion/interfaces/callables/process_uploaded_rag_document.py` |
| Use Case | `functions-python/app/rag_ingestion/application/use_cases/process_uploaded_document.py` → `ProcessUploadedDocumentUseCase` |

### 詳細描述

- **雙觸發機制**：
  1. `on_call()` callable：供前端 retry 按鈕手動呼叫
  2. `on_document_created` Firestore trigger：當 `knowledge_base/{orgId}/workspaces/{wsId}/documents/{docId}` 建立且 status=`"uploaded"` 時自動觸發
- Ingestion pipeline 依序執行：
  1. 狀態轉移：`uploaded` → `processing`
  2. Parsing（OCR 或 passthrough）
  3. Text cleaning / normalization
  4. Taxonomy classification
  5. Chunking
  6. Embedding
  7. Persistence（chunks + documents）
  8. 狀態轉移：`processing` → `ready` 或 `failed`
- 錯誤處理：pipeline 任一步驟失敗 → `mark_failed()` 寫入 errorCode + errorMessage

### UI/UX

- 上傳完成後 Firestore trigger 自動啟動 ingestion（使用者無需手動操作）
- 失敗文件可通過 WorkspaceWikiTab「重試」按鈕（`retryDocumentProcessing`）重新觸發
- 失敗文件可通過「封存」按鈕（`archiveRagDocument`）標記為 archived

---

## Layer 4: 解析與結構化層（Parsing & Structuring Layer） — ✅ 已完成

### 實作位置

| 元件 | 路徑 |
|------|------|
| Port | `functions-python/app/rag_ingestion/domain/ports.py` → `RagParserPort` |
| Document AI Parser | `functions-python/app/rag_ingestion/infrastructure/google/document_ai_parser.py` → `DocumentAiRagParser` |
| Passthrough Parser | `functions-python/app/rag_ingestion/infrastructure/default/parser.py` → `PassthroughRagParser` |
| 已解析文字寫入 | `functions-python/app/rag_ingestion/infrastructure/firebase/processed_text_writer.py` → `ProcessedTextWriter` |

### 詳細描述

- **DocumentAiRagParser**（生產用）：
  1. 從 Firebase Storage 下載原始二進位檔案（`read_bytes(storage_path)`）
  2. 送 Google Document AI OCR Extractor 處理
  3. 返回萃取文字；若 OCR 無結果則 fallback 至 `raw_text`
- **PassthroughRagParser**（fallback/測試用）：直接返回 `raw_text`，無 OCR
- 解析後文字存入 Firebase Storage：`organizations/{orgId}/workspaces/{wsId}/extracted/{docId}.txt`
- Firestore 文件記錄更新：`extractedTextStoragePath`, `indexedAtISO`, `chunkCount`

### UI/UX

- 解析結果存於原路徑鄰近目錄（`/extracted/` 子路徑），可從 Firestore `extractedTextStoragePath` 欄位取得
- 文件 status badge 顯示解析進度（processing → ready/failed）

---

## Layer 5: 知識建模層（Knowledge Modeling Layer） — ✅ 已完成

### 實作位置

| 元件 | 路徑 |
|------|------|
| Taxonomy Port | `functions-python/app/rag_ingestion/domain/ports.py` → `RagTaxonomyClassifierPort` |
| Document AI Classifier | `functions-python/app/rag_ingestion/infrastructure/google/document_ai_taxonomy_classifier.py` → `DocumentAiTaxonomyClassifier` |
| Simple Classifier | `functions-python/app/rag_ingestion/infrastructure/default/taxonomy_classifier.py` → `SimpleRagTaxonomyClassifier` |
| Taxonomy VO | `modules/wiki/domain/value-objects/taxonomy.vo.ts` |
| Knowledge Summary | `modules/wiki/domain/entities/workspace-knowledge-summary.entity.ts` |

### 詳細描述

- **Document-level taxonomy 分類**（在 chunking 前完成，確保每個 chunk 繼承正確 taxonomy）：
  - `DocumentAiTaxonomyClassifier`：使用 Document AI OCR Classifier → 映射到 taxonomy enum
  - `SimpleRagTaxonomyClassifier`：關鍵字比對 fallback（finance/governance/legal/general）
  - 若 `taxonomy_hint` 已提供（用戶手動標記），直接使用不呼叫 API
- 支援的 taxonomy enum：`規章制度`, `技術文件`, `產品手冊`, `操作指南`, `政策文件`, `訓練教材`, `研究報告`, `其他`（中文）+ `finance`, `governance`, `legal`, `general` 等（英文映射）
- `WikiHubView` 中顯示 taxonomy 分佈圖磚

### UI/UX

- WikiHubView 中的 taxonomy 磁磚顯示各分類文件數量
- 上傳表單中 taxonomy 為必填欄位
- 文件詳情中顯示 taxonomy 標籤

---

## Layer 6: 文本前處理層（Text Preprocessing Layer） — ✅ 已完成

### 實作位置

| 元件 | 路徑 |
|------|------|
| Use Case 中的 normalization | `functions-python/app/rag_ingestion/application/use_cases/process_uploaded_document.py` 第 42 行 |

### 詳細描述

- 在 `ProcessUploadedDocumentUseCase.execute()` 中：
  ```python
  parsed_text = self._parser.parse(command).strip()
  normalized_text = " ".join(parsed_text.split())
  ```
- 處理步驟：
  1. `strip()`：移除首尾空白
  2. `" ".join(parsed_text.split())`：壓縮連續空白字元為單一空格，移除多餘換行
- ADR-005 Step B (Cleaning) 定義的規則：不可破壞來源段落順序與 page 對應資訊
- 目前實作為基礎正規化；進階清理（如特殊字元移除、語言偵測）尚未獨立成 adapter，但已滿足契約要求

### 備註

- 目前 normalization 嵌入 use case 而非獨立 port/adapter。設計上足夠簡單，不需獨立抽象。若未來需要進階清理（例如 HTML tag stripping、特殊字元正規化），可提升為獨立的 `TextCleanerPort`。

---

## Layer 7: 文本分塊層（Text Chunking Layer） — ✅ 已完成

### 實作位置

| 元件 | 路徑 |
|------|------|
| Port | `functions-python/app/rag_ingestion/domain/ports.py` → `RagChunkerPort` |
| SimpleParagraphChunker | `functions-python/app/rag_ingestion/infrastructure/default/chunker.py` |
| Entity | `functions-python/app/rag_ingestion/domain/entities.py` → `RagChunkDraft` |

### 詳細描述

- **SimpleParagraphChunker**：
  1. 以 `\n` 分割文本為段落
  2. 每段落若超過 `MAX_CHUNK_LENGTH=800` 字元則再切分
  3. 每個 chunk 帶 `chunk_index`（deterministic）和 `page`（預設 1）
  4. 空文本產出單一空 chunk
- 產出 `RagChunkDraft(chunk_index, text, page, tags)`
- ADR-005 Step D 要求：deterministic `chunkIndex` ✅
- 單元測試：`functions-python/tests/test_process_uploaded_document.py` 覆蓋

### 備註

- 目前為字元級切割（非 token 級）。對於中文文本，800 字元約 400-600 個 token，落在合理範圍。
- 尚未實作語意分塊（semantic chunking）或重疊窗口（overlapping window）。這是可改進的方向但非必要。

---

## Layer 8: 向量化層（Embedding Layer） — ✅ 已完成

### 實作位置

| 元件 | 路徑 | 說明 |
|------|------|------|
| Port | `functions-python/app/rag_ingestion/domain/ports.py` → `RagEmbedderPort` | |
| DeterministicRagEmbedder | `functions-python/app/rag_ingestion/infrastructure/default/embedder.py` | Scaffold（4 維，測試用） |
| OpenAiEmbedder | `functions-python/app/rag_ingestion/infrastructure/openai/embedder.py` | 生產用（1536 維） |
| Next.js Embedding | `modules/wiki/infrastructure/repositories/openai-embedding.repository.ts` | Query-side embedding |

### 詳細描述

- **Ingestion-side（Python）**：
  - `OpenAiEmbedder`：使用 `text-embedding-3-small`（1536 維），batch size ≤ 20，含 retry + backoff
  - `DeterministicRagEmbedder`：4 維 scaffold，本地測試使用
- **Query-side（Next.js）**：
  - `OpenAIEmbeddingRepository`：使用相同的 `text-embedding-3-small` 模型和維度（1536）
  - 用於將使用者查詢轉換為向量以進行檢索
- 兩端使用相同模型確保向量空間一致

---

## Layer 9: 索引層（Indexing Layer） — ✅ 已完成

### 實作位置

| 元件 | 路徑 |
|------|------|
| Chunk Persistence | `functions-python/app/rag_ingestion/infrastructure/firebase/document_repository.py` → `save_ready()` |
| Firestore 路徑 | `knowledge_base/{orgId}/workspaces/{wsId}/chunks/{chunkId}` |
| Index 配置 | `firestore.indexes.json`（文件中記載） |
| Vector Index | Upstash Vector（`packages/integration-upstash/vector.ts`） + Firestore vector field |

### 詳細描述

- **Firestore chunks collection**：
  - 每個 chunk 寫入：`chunkId`, `docId`, `organizationId`, `workspaceId`, `chunkIndex`, `text`, `embedding`, `taxonomy`, `page`, `tags`
  - 使用 Firestore batch write 確保原子性
  - Chunk ID 格式：`{documentId}_{chunkIndex}`（deterministic upsert key）
- **索引配置**：
  - Composite index：`organizationId` + `isLatest` + `taxonomy`
  - Vector index：`embedding` field，維度 1536，COSINE distance
- **狀態更新**：chunks 寫入完成後 → `documents.status = "ready"` + `chunkCount` + `indexedAtISO`
- **Upstash Vector**：`vectorIndex()` 提供 Upstash Vector index client（用於 wiki 模組的 retrieval）

---

## Layer 10: 語意檢索層（Semantic Retrieval Layer） — ✅ 已完成

### 實作位置

| 元件 | 路徑 | 說明 |
|------|------|------|
| Repository (ai 模組) | `modules/ai/infrastructure/firebase/FirebaseRagRetrievalRepository.ts` | metadata-filter + token scoring |
| Repository (wiki 模組) | `modules/wiki/infrastructure/repositories/upstash-retrieval.repository.ts` | Upstash Vector search |
| Use Case (ai) | `modules/ai/application/use-cases/answer-rag-query.use-case.ts` → `AnswerRagQueryUseCase` | |
| Use Case (wiki) | `modules/wiki/application/use-cases/get-rag-answer.use-case.ts` → `GetRAGAnswerUseCase` | |
| Search Action | `modules/wiki/interfaces/_actions/wiki-search.actions.ts` → `searchWikiDocuments` | |

### 詳細描述

- **modules/ai 的 skeleton metadata-filter retrieval**：
  1. 查詢 Firestore `documents` collection group（status=ready，organizationId filter）
  2. 查詢 Firestore `chunks` collection group（同 org/workspace/taxonomy filter）
  3. 使用 token-based scoring（`scoreChunk`：query token 與 chunk text 的 BM25-like 交集比）
  4. 按分數排序後取 top-K
- **modules/wiki 的 vector search retrieval**：
  1. 使用 OpenAI 將 query 轉向量
  2. 使用 Upstash Vector `searchByVector` 進行語意相似度搜尋
- 兩個 retrieval path 同時存在，由呼叫端選擇

### UI/UX

- `RagSearchBar` 元件提供 RAG 搜尋入口
- Wiki 頁面的搜尋功能直接呼叫 `searchWikiDocuments` server action
- AI Chat 頁面使用 `AnswerRagQueryUseCase` 進行 RAG 查詢

---

## Layer 11: 約束過濾層（Constraint & Filtering Layer） — ⚠️ 部分完成

### 實作位置

| 元件 | 路徑 | 狀態 |
|------|------|------|
| organizationId filter | `FirebaseRagRetrievalRepository.ts:72` | ✅ 已實作 |
| workspaceId filter | `FirebaseRagRetrievalRepository.ts:74` | ✅ 已實作 |
| taxonomy filter | `FirebaseRagRetrievalRepository.ts:75` | ✅ 已實作 |
| status=ready filter | `FirebaseRagRetrievalRepository.ts:73` | ✅ 已實作 |
| isLatest filter | 文件要求但未在 retrieval 中實作 | ❌ 缺失 |
| accessControl RBAC filter | 文件要求（`accessControl in userRoles`）但未在 retrieval 中實作 | ❌ 缺失 |

### 詳細描述

- **已實作的過濾**：
  - `organizationId`：租戶隔離 ✅
  - `workspaceId`（可選）：工作區範圍 ✅
  - `taxonomy`（可選）：分類篩選 ✅
  - `status == "ready"`：排除未就緒文件 ✅
- **缺失的過濾**（文件合約要求但未實作）：
  - `isLatest == true`：排除廢棄版本（`RetrieveRagChunksInput` 中無此欄位，Firestore query 未包含）
  - `accessControl in userRoles`：RBAC 權限過濾（`RetrieveRagChunksInput` 中無 `userRoles` 欄位）
- 參考合約：`docs/reference/development-contracts/wiki-contract.md` §Required query filters
- 參考架構文件：`docs/wiki/development-guide.md` §4.3

### 影響

- 無 `isLatest` filter：版本更新後舊版本的 chunks 可能仍被檢索到
- 無 `accessControl` filter：權限受限的文件可能被無權限的使用者檢索到

---

## Layer 12: 重排序層（Reranking Layer） — ❌ 未完成

### 實作位置

無實作程式碼。

### 詳細描述

- ADR-004 §4 明確規劃了 Reranking layer：
  ```text
  [Top-K chunks] → [Cross-Encoder / LLM rerank] → [Top-N chunks]
  ```
- 開發指南 §4.8 將 reranking 標記為「P1 強化」（`reranking：Cross-Encoder（P1 強化）`）
- 目前 retrieval 只使用 token-based scoring（`scoreChunk`）作為排序依據，無 Cross-Encoder 或 LLM-based reranking
- `FirebaseRagRetrievalRepository` 中的 `.sort((left, right) => right.score - left.score)` 是簡單的分數排序，非語意重排序

### 影響

- 檢索精度受限於 token 匹配，語意相關但詞彙不重疊的 chunk 可能排名偏低
- 中文文本的 BM25-like token matching 效果有限（分詞粒度粗）

### 建議

- 引入 Cross-Encoder reranker（如 Cohere Rerank API、BGE-reranker、或 LLM-based rerank）
- 在 `AnswerRagQueryUseCase.execute()` 中，在 `retrieve()` 之後、`generate()` 之前插入 rerank 步驟

---

## Layer 13: 推理與生成層（Reasoning & Generation / RAG） — ✅ 已完成

### 實作位置

| 元件 | 路徑 |
|------|------|
| Use Case | `modules/ai/application/use-cases/answer-rag-query.use-case.ts` → `AnswerRagQueryUseCase` |
| Generation Repository | `modules/ai/infrastructure/genkit/GenkitRagGenerationRepository.ts` |
| Genkit Client | `modules/ai/infrastructure/genkit/client.ts` |
| Domain Types | `modules/ai/domain/entities/RagQuery.ts` |

### 詳細描述

- **AnswerRagQueryUseCase** 完整的 RAG orchestration：
  1. 驗證輸入（organizationId 必填、userQuery 非空）
  2. 呼叫 `RagRetrievalRepository.retrieve()` 取得 top-K chunks
  3. 若無 chunk → 回傳 `NO_RELEVANT_CHUNKS` 錯誤
  4. 呼叫 `RagGenerationRepository.generate()` 生成答案
  5. 返回結果含：answer, citations, retrievalSummary, model, traceId, events（streaming）
- **GenkitRagGenerationRepository**：
  - System prompt：`"You are the Xuanwu RAG orchestration layer. Answer only from the supplied context and preserve citations."`
  - Prompt 結構：user query + 格式化的 chunks（含 doc ID, chunk index, page, taxonomy）
  - Citations 自動生成：每個 chunk 附 docId, chunkIndex, page, reason
- 支援 streaming events（token + citation + done）

### UI/UX

- AI Chat 頁面（`app/(shell)/ai-chat/page.tsx`）是主要 RAG 查詢入口
- Wiki RagSearchBar 提供輕量搜尋
- 答案附帶 citations（來源文件 + 頁碼 + taxonomy）

---

## 架構全景圖

```text
                        ┌─────────────────────────────────────────────────────────┐
                        │                    Next.js (App Router)                  │
                        ├─────────────────────────────────────────────────────────┤
[1] Document Upload ──→ │ file.actions.ts → RegisterUploadedRagDocumentUseCase    │
                        │ → Firebase Storage (raw file)                           │
                        │ → Firestore documents (status: "uploaded")              │
                        └──────────────────────────┬──────────────────────────────┘
                                                   │ Firestore on_document_created
                        ┌──────────────────────────▼──────────────────────────────┐
                        │               functions-python (Cloud Functions)          │
                        ├─────────────────────────────────────────────────────────┤
[2] OCR ──────────────→ │ DocumentAiRagParser (reads binary → OCR Extractor)      │
[3] Ingestion ────────→ │ ProcessUploadedDocumentUseCase (orchestrator)            │
[4] Parsing ──────────→ │ parser.parse() → extracted text                         │
[5] Knowledge Model ──→ │ taxonomy_classifier.classify() → taxonomy label         │
[6] Preprocessing ────→ │ " ".join(parsed_text.split()) → normalized text         │
[7] Chunking ─────────→ │ SimpleParagraphChunker.chunk() → RagChunkDraft[]        │
[8] Embedding ────────→ │ OpenAiEmbedder.embed() → float[1536][]                 │
[9] Indexing ─────────→ │ FirebaseRagDocumentRepository.save_ready()              │
                        │ → Firestore chunks (text + embedding + metadata)        │
                        │ → documents.status = "ready"                            │
                        │ → ProcessedTextWriter → Storage extracted/{docId}.txt   │
                        └─────────────────────────────────────────────────────────┘

                        ┌─────────────────────────────────────────────────────────┐
                        │                    Next.js (Query Path)                  │
                        ├─────────────────────────────────────────────────────────┤
[10] Retrieval ───────→ │ FirebaseRagRetrievalRepository.retrieve()               │
                        │ + UpstashRetrievalRepository (wiki vector search)       │
[11] Filtering ───────→ │ organizationId + workspaceId + taxonomy + status=ready  │
                        │ ⚠️ Missing: isLatest, accessControl RBAC               │
[12] Reranking ───────→ │ ❌ NOT IMPLEMENTED (token scoring only)                 │
[13] Generation ──────→ │ GenkitRagGenerationRepository.generate()                │
                        │ → Genkit LLM → streaming answer + citations             │
                        └─────────────────────────────────────────────────────────┘
```

---

## 待辦事項

### P0（安全性）
- [ ] **Layer 11**：在 `RetrieveRagChunksInput` 加入 `userRoles: string[]`，在 Firestore query 中加入 `accessControl` array-contains-any filter

### P1（資料正確性）
- [ ] **Layer 11**：在 retrieval query 中加入 `isLatest == true` filter，防止檢索到廢棄版本
- [ ] **Layer 12**：實作 Cross-Encoder reranking（可使用 Cohere Rerank API 或 LLM-based rerank）

### P2（品質提升）
- [ ] **Layer 7**：考慮語意分塊（semantic chunking）或 overlapping window 策略
- [ ] **Layer 6**：提升文本前處理為獨立 port/adapter，支援進階清理規則
