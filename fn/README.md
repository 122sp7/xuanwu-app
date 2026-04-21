# fn — Firebase Functions (Python) Worker Runtime

`fn/` 是 Xuanwu App 的 Python Cloud Functions layer，負責所有重度、可重試的 ingestion / embedding / query pipeline。所有業務邏輯嚴格依循 Hexagonal Architecture，`domain/` 保持零外部依賴。

---

## 概覽

| 維度 | 內容 |
|---|---|
| 語言 | Python 3.12 |
| 執行環境 | Google Cloud Functions（1st / 2nd gen via `firebase-functions`） |
| 部署 region | `asia-southeast1` |
| Document AI region | `us`（`us-documentai.googleapis.com`） |
| Vector 儲存 | Upstash Vector |
| 全文搜尋 | Upstash Search |
| 快取 / 速率限制 | Upstash Redis |
| 審計事件 | Upstash QStash → `QSTASH_RAG_AUDIT_URL` |
| LLM / Embedding | OpenAI（`text-embedding-3-small` / `gpt-4o-mini`） |
| Firestore | Firebase Admin SDK（ADC — 不使用 client SDK） |
| GCS | `google-cloud-storage`（artifact 讀寫） |

---

## Cloud Functions

### 1. `on_document_uploaded` — Storage 觸發器

- **觸發條件**：`uploads/` 前綴物件建立（`WATCH_PREFIX` env 可覆寫）
- **支援格式**：`.pdf` / `.tiff` / `.tif` / `.png` / `.jpg` / `.jpeg`
- **解析器**：固定使用 `layout`，`run_rag=True`（自動 RAG ingestion）
- **流程**：init Firestore → Document AI (Layout Parser) → 寫 JSON artifact 至 GCS → 更新 Firestore → RAG ingestion

> **注意**：Sources tab 的上傳路徑為 `workspaces/{workspaceId}/sources/{accountId}/`，**不觸發**此 Storage trigger。Sources 解析需由客戶端手動呼叫 `parse_document` callable。

---

### 2. `parse_document` — HTTPS Callable

主動觸發單一文件解析。**必須由客戶端 Firebase callable SDK 呼叫**（自動攜帶 ID token）；raw fetch 無 Authorization header 會被拒絕（HTTP 401）。

**輸入欄位**：

| 欄位 | 必填 | 說明 |
|---|---|---|
| `account_id` | ✓ | 帳號 ID（用於 Firestore 隔離） |
| `workspace_id` | ✓ | 工作區 ID |
| `gcs_uri` | ✓ | `gs://bucket/path`（必須以 `gs://` 開頭） |
| `doc_id` | 選填 | 未提供時從 `gcs_uri` 的檔名推導 |
| `filename` | 選填 | 顯示名稱（未提供時從路徑取得） |
| `mime_type` | 選填 | 未提供時從副檔名推導 |
| `size_bytes` | 選填 | 檔案大小 |
| `run_rag` | 選填 | 是否自動執行 RAG ingestion（預設 `true`） |
| `parser` | 選填 | `"layout"`（預設）\| `"form"` \| `"ocr"` \| `"genkit"` |

**解析器說明**：

| Parser | 產出 | Firestore 欄位 | GCS artifact 路徑 |
|---|---|---|---|
| `layout` | 語意分塊 + 文字 | `parsedLayoutJsonGcsUri` | `files/{path}-layout.json` |
| `form` | KV entity 清單 | `parsedFormJsonGcsUri` | `files/{path}-form.json` |
| `ocr` | 全頁文字 | `parsedOcrJsonGcsUri` | `files/{path}-ocr.json` |
| `genkit` | Genkit AI 分塊 | `parsedGenkitJsonGcsUri` | `files/{path}-genkit.json` |

RAG ingestion 僅在 `parser` 為 `layout` 或 `ocr` 時執行。

---

### 3. `rag_query` — HTTPS Callable

RAG 檢索 + 生成查詢（向量 + 搜尋雙通道）。

- 快取：Upstash Redis，TTL = `RAG_QUERY_CACHE_TTL_SECONDS`（預設 300 秒）
- 速率限制：`RAG_QUERY_RATE_LIMIT_MAX` / `window_seconds`（預設 30 req/60 s）
- 過濾維度：workspace / account / freshness (`max_age_days`) / taxonomy / `ready_status`
- 審計：命中結果透過 QStash 發布至 `QSTASH_RAG_AUDIT_URL`

---

### 4. `rag_reindex_document` — HTTPS Callable

刪除舊向量後重新 normalize + ingest。**同樣需要 Firebase ID token**（不可 raw fetch）。

---

## 架構層次

```
interface/       ← 輸入 Schema 驗證 + handler 薄層（不含業務邏輯）
application/     ← 用例協作（orchestration）+ auth 驗證包裝
domain/          ← Protocol 介面 + 業務規則 + value objects（零外部依賴）
infrastructure/  ← Gateway 實作（DocAI / OpenAI / Upstash / Firestore / GCS）
app/             ← Firebase Admin 初始化 + DI 接線
core/            ← 全域常數（config.py）+ 工具（auth_errors / storage_uri）
```

依賴方向固定：`interface → application → domain ← infrastructure`

---

## Firestore 文件結構

Collection: `accounts/{accountId}/documents/{docId}`

| 欄位 | 類型 | 說明 |
|---|---|---|
| `status` | string | `processing` / `completed` / `error` / `rag_ready` |
| `gcs_uri` | string | 原始 GCS URI |
| `filename` | string | 顯示檔名 |
| `size_bytes` | int | 檔案大小 |
| `mime_type` | string | MIME 類型 |
| `account_id` | string | 帳號 ID |
| `workspace_id` | string | 工作區 ID |
| `page_count` | int | 頁數（解析後） |
| `parsedLayoutJsonGcsUri` | string | Layout Parser artifact URI |
| `parsedFormJsonGcsUri` | string | Form Parser artifact URI |
| `parsedOcrJsonGcsUri` | string | OCR artifact URI |
| `parsedGenkitJsonGcsUri` | string | Genkit artifact URI |
| `rag_chunk_count` | int | RAG chunk 數量 |
| `rag_vector_count` | int | 向量數量 |
| `error_message` | string | 錯誤訊息（失敗時） |

---

## 環境變數

複製 `.env.example` 為 `.env` 並填入實際值。唯一真實來源為 `src/core/config.py`。

**必填**：
- `OPENAI_API_KEY`
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
- `UPSTASH_VECTOR_REST_URL` / `UPSTASH_VECTOR_REST_TOKEN`
- `UPSTASH_SEARCH_REST_URL` / `UPSTASH_SEARCH_REST_TOKEN` / `UPSTASH_SEARCH_INDEX`
- `QSTASH_TOKEN` / `QSTASH_CURRENT_SIGNING_KEY` / `QSTASH_NEXT_SIGNING_KEY` / `QSTASH_RAG_AUDIT_URL`

**選填（有合理預設值）**：
- Document AI processor names（已預設指向 US region processors）
- RAG pipeline 參數（chunk size / overlap / top_k / rate limit 等）

Cloud Run 部署時透過 `set_global_options(secrets=[...])` 從 Secret Manager 注入；本機透過 `.env` 或 `gcloud auth application-default login`。

---

## 本機開發

```bash
# 1. 安裝依賴
cd fn
pip install -r requirements.txt -r requirements-dev.txt

# 2. 設定環境
cp .env.example .env   # 填入實際值

# 3. GCP 認證（ADC）
gcloud auth application-default login

# 4. 語法驗證
python -m compileall -q .

# 5. 單元測試
python -m pytest tests/ -v

# 6. 本機 emulator（需 Firebase CLI）
firebase emulators:start --only functions,storage,firestore
```

---

## 部署

```bash
# 部署所有 Functions
firebase deploy --only functions

# 僅部署特定 Function
firebase deploy --only functions:parse_document
```

---

## 測試策略

- `test_input_schemas.py` — ParseDocumentRequest / RagReindexRequest / RagQueryRequest schema 驗證
- `test_command_use_cases.py` — parse + reindex command 用例（mock gateway）
- `test_domain_repository_gateways.py` — gateway Protocol 合約
- `test_po_extraction.py` — AP8 採購訂單欄位抽取（domain service）
- `test_rag_ingestion_text.py` — clean / chunk / detect_language（domain service）
- `test_rag_query_use_case.py` — RAG query 用例（mock vector + search + LLM）

所有測試使用 `pytest-mock`；不依賴真實 Firebase / OpenAI / Upstash 連線。

---

## 跨運行時契約

`application/dto/chunk_job.py` 與 `application/dto/embedding_job.py` 是 TypeScript QStash payload schema 的 Python mirror，兩側必須保持語意對齊。  
參考：`docs/structure/contexts/ai/cross-runtime-contracts.md`

---

## 相關文件

- `fn/AGENTS.md` — AI agent 路由 index
- `fn/.env.example` — 環境變數樣板
- `fn/src/core/config.py` — 全域常數唯一真實來源
- `fn/main.py` — Cloud Function 宣告入口
- `docs/tooling/commands-reference.md` — 完整驗證命令參考
