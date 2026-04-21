# fn — AI Agent Routing Index

`fn/` 是 Xuanwu App 的 Python Cloud Functions worker runtime，負責所有重度、可重試的 ingestion / embedding pipeline 工作，與 Next.js 的 browser-facing orchestration 嚴格分離。

---

## 系統邊界 (Runtime Split)

| 歸屬 | 職責 |
|---|---|
| **fn/** (此層) | Document AI 解析、GCS artifact 寫入、RAG ingestion、向量 / 搜尋索引更新、RAG 查詢、QStash 審計 |
| **Next.js (`src/`)** | 上傳 UX、帳號/工作區 auth、Server Actions 組裝、客戶端 Firebase callable 調用 |

> **Rule**: Next.js 不得直接執行 parse / chunk / embed 管線。`fn/` 不含 browser-facing auth / session / chat logic。

---

## 進入 fn/ 的決策樹

```
修改什麼？
├── Cloud Function 宣告（觸發器、secret 清單）  → main.py
├── 輸入 Schema 驗證                          → src/interface/schemas/
├── HTTPS handler 入口邏輯                    → src/interface/handlers/
├── Storage 觸發器邏輯                        → src/interface/handlers/storage.py
├── 用例協作（orchestration）                 → src/application/use_cases/
├── 跨用例共用服務                            → src/application/services/
├── DTO / payload 格式                        → src/application/dto/
├── Port/Gateway 介面（Protocol 定義）        → src/domain/repositories/rag.py
├── 業務規則、值對象                           → src/domain/
├── 外部服務 adapter（DocAI / OpenAI / Upstash）→ src/infrastructure/external/
├── Firestore / GCS 持久化                    → src/infrastructure/persistence/
├── Gateway 實作（實作 Protocol）             → src/infrastructure/gateways/
├── 依賴組裝（DI 接線）                       → src/app/container/runtime_dependencies.py
├── 全域設定 / env 讀取                       → src/core/config.py
└── 測試                                      → tests/
```

---

## Cloud Functions（main.py 宣告）

| Function | 類型 | 觸發條件 | 核心 handler |
|---|---|---|---|
| `on_document_uploaded` | Storage trigger | `uploads/` 前綴物件建立 | `handle_object_finalized` |
| `parse_document` | HTTPS Callable | 客戶端主動觸發 | `handle_parse_document` |
| `rag_query` | HTTPS Callable | 客戶端 RAG 查詢 | `handle_rag_query` |
| `rag_reindex_document` | HTTPS Callable | 客戶端主動重建索引 | `handle_rag_reindex_document` |

> **重要**：`parse_document` 與 `rag_reindex_document` 必須由客戶端 Firebase callable SDK 呼叫（附帶 ID token）；服務端 raw fetch 無 Authorization header 會直接被 `FirestoreAuthorizationGateway` 拒絕（HTTP 401）。

---

## 目錄結構與路由職責

```
fn/
├── main.py                         # Cloud Function 宣告（觸發器 + secret 清單）
├── requirements.txt                # 生產依賴
├── requirements-dev.txt            # 測試依賴（pytest / pytest-mock）
├── .env.example                    # 環境變數樣板（唯一真實來源：core/config.py）
├── src/
│   ├── app/
│   │   ├── bootstrap/__init__.py   # Firebase Admin SDK 初始化（只執行一次）
│   │   └── container/
│   │       └── runtime_dependencies.py  # DI 接線：gateway → registry
│   ├── core/
│   │   ├── config.py               # 全域常數與 env 讀取
│   │   ├── auth_errors.py          # UnauthenticatedError / AuthorizationError
│   │   └── storage_uri.py          # gs:// URI 解析工具
│   ├── domain/
│   │   ├── repositories/rag.py     # Gateway Protocol 介面（AuthorizationGateway 等 9 個）
│   │   ├── services/
│   │   │   ├── po_extraction.py    # PO 採購訂單欄位抽取（domain service）
│   │   │   ├── rag_ingestion_text.py  # clean / chunk / detect_language
│   │   │   └── rag_result_filter.py   # RAG 命中篩選規則
│   │   └── value_objects/rag.py    # RagCitation / RagQueryInput / RagQueryResult
│   ├── application/
│   │   ├── dto/                    # chunk_job.py / embedding_job.py / rag.py（DTO）
│   │   ├── ports/output/gateways.py  # domain repositories 的向後相容重匯出
│   │   ├── services/
│   │   │   ├── authorization.py       # get_authorization() 入口
│   │   │   ├── document_pipeline.py   # parser / artifact / status gateway 取用點
│   │   │   └── rag_query_effects.py   # cache write + audit publish（side-effects）
│   │   └── use_cases/
│   │       ├── parse_document_command.py   # auth 驗證包裝 + error recording
│   │       ├── parse_document_pipeline.py  # 完整解析管線（init → DocAI → GCS → Firestore → RAG）
│   │       ├── rag_ingestion.py            # clean → chunk → embed → upsert
│   │       ├── rag_query.py               # 向量 + 搜尋雙通道 + 生成
│   │       ├── rag_reindex_command.py      # auth 驗證包裝（reindex）
│   │       └── rag_reindex.py             # delete old vectors → re-ingest
│   ├── infrastructure/
│   │   ├── audit/qstash.py              # QStash RAG audit 事件發布
│   │   ├── cache/rag_query_cache.py     # Redis 查詢快取
│   │   ├── external/
│   │   │   ├── documentai/client.py     # Document AI（Layout / Form / OCR / Genkit）
│   │   │   └── openai/                  # embeddings.py / llm.py / rag_query.py
│   │   │   └── upstash/                 # vector_client.py / search_client.py / redis_client.py / qstash_client.py
│   │   ├── gateways/                    # 9 個 Gateway 實作（實作 domain Protocol）
│   │   └── persistence/
│   │       ├── firestore/document_repository.py  # Firestore 文件讀寫
│   │       └── storage/client.py                 # GCS artifact 讀寫
│   └── interface/
│       ├── handlers/
│       │   ├── parse_document.py        # handle_parse_document
│       │   ├── rag_query_handler.py     # handle_rag_query
│       │   ├── rag_reindex_handler.py   # handle_rag_reindex_document
│       │   ├── storage.py              # handle_object_finalized
│       │   └── _https_helpers.py       # _extract_auth_uid 共用工具
│       └── schemas/
│           ├── parse_document.py        # ParseDocumentRequest.from_raw()
│           ├── rag_reindex.py           # RagReindexRequest.from_raw()
│           └── rag_query.py             # RagQueryRequest.from_raw()
└── tests/
    ├── conftest.py
    ├── test_command_use_cases.py
    ├── test_domain_repository_gateways.py
    ├── test_input_schemas.py
    ├── test_po_extraction.py
    ├── test_rag_ingestion_text.py
    └── test_rag_query_use_case.py
```

---

## Route Here / Route Elsewhere

### Route Here（修改 fn/）
- Document AI 解析器切換（Layout / Form / OCR / Genkit）
- GCS artifact 路徑規則（layout_json_path / form_json_path / ocr_json_path / genkit_json_path）
- RAG ingestion 管線（chunk 策略 / embedding model / vector namespace）
- RAG query 過濾規則（workspace / freshness / taxonomy / ready_status）
- 速率限制（`RAG_QUERY_RATE_LIMIT_MAX` / `window_seconds`）
- QStash 審計事件格式
- Firestore document schema（accounts/{accountId}/documents/{docId}）
- Gateway Protocol 介面與實作
- parse_document / rag_reindex_document callable 的輸入 Schema 驗證

### Route Elsewhere（不在 fn/）
- 客戶端上傳 UX → `src/modules/notebooklm/adapters/inbound/react/NotebooklmSourcesSection.tsx`
- Firebase callable 呼叫包裝 → `src/modules/notebooklm/adapters/outbound/callable/FirebaseCallableAdapter.ts`
- Server Actions（create page / database）→ `src/modules/notebooklm/adapters/inbound/server-actions/`
- Firestore 安全規則 → `firestore.rules`
- Storage 安全規則 → `storage.rules`
- Genkit flow 定義（Next.js 側 AI orchestration）→ `src/modules/platform/subdomains/ai/`

---

## 依賴方向（Hexagonal）

```
interface/ → application/ → domain/ ← infrastructure/
```

- `domain/` 零外部依賴（無 Firebase / OpenAI / GCS import）
- `application/` 依賴 `domain/` Protocol，不依賴 infrastructure 實作
- `infrastructure/` 實作 `domain/repositories/rag.py` 中的 Protocol
- `interface/` 呼叫 `application/use_cases/`，不跳層直接呼叫 infrastructure

---

## 驗證命令

```bash
# 語法檢查（快速）
cd fn && python -m compileall -q .

# 單元測試
cd fn && python -m pytest tests/ -v

# 本機 emulator（需要 Firebase CLI）
firebase emulators:start --only functions,storage,firestore
```

---

## 跨運行時契約

`application/dto/chunk_job.py` 與 `application/dto/embedding_job.py` 是 Python mirror 的 TypeScript QStash payload schema；兩側必須保持語意對齊。  
參考：`docs/structure/contexts/ai/cross-runtime-contracts.md`
