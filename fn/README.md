# fn — Python Cloud Functions 架構規範

`fn/` 是 Python Cloud Functions worker 層，負責 ingestion、parsing、chunking、embedding 與 background job。
這份規範以「路徑級依賴」為核心，看完整路徑判斷依賴方向，而非單看資料夾名稱。

> **遷移說明**：`fn/` 取代舊的 `fn/`，依相同 Hexagonal Architecture 重建，
> 全面對齊 `.github/copilot-instructions.md` 的 20 條 Mandatory Compliance Rules。

---

## 0. Document AI 雙通道設計（US Region）

⚠️ 兩個 processor 均位於 **US region**，`DOCAI_API_ENDPOINT` 必須為 `us-documentai.googleapis.com`。

| Processor | 用途 | 完整 Resource Name |
|---|---|---|
| **Layout Parser（主）** | 語意分塊：標題、段落、表格各自成 chunk，保留溯源引用鏈 | `projects/65970295651/locations/us/processors/929c4719f45b1eee` |
| **Form Parser（副）** | 結構化欄位擷取：PO號、金額、日期、供應商等 KV entity | `projects/65970295651/locations/us/processors/7318076ba71e0758` |

**API Endpoint（強制）**：
```
https://us-documentai.googleapis.com/v1/...
```

### 雙通道流程

```text
GCS Document
    ├─ Layout Parser  → ParsedDocument.chunks   → RAG 語意分塊（chunking_strategy="layout-v1"）
    └─ Form Parser    → ParsedDocument.entities → 結構化欄位存 JSON GCS（best-effort）
```

- **主通道（Layout Parser）**失敗 → 整體 pipeline 失敗（拋例外，Rule 10）
- **副通道（Form Parser）**失敗 → 記錄 `WARNING`，以空 `entities` 繼續，不阻斷主流程（Rule 10）

### 環境變數

| 變數 | 預設值 | 說明 |
|---|---|---|
| `DOCAI_LAYOUT_PROCESSOR_NAME` | `projects/65970295651/locations/us/processors/929c4719f45b1eee` | Layout Parser 資源名稱（主通道，不可空） |
| `DOCAI_FORM_PROCESSOR_NAME` | `projects/65970295651/locations/us/processors/7318076ba71e0758` | Form Parser 資源名稱（設為空字串可停用副通道） |
| `DOCAI_API_ENDPOINT` | `us-documentai.googleapis.com` | **不可改為 eu 或 global** |
| `DOCAI_LOCATION` | `us` | processor 所在 region |

### Form Parser 擷取欄位（AP8 採購訂購單示例）

| 欄位 | Document AI Entity Type |
|---|---|
| 訂購單號 | `id` / 自定義 KV |
| 供應商 | `organization` |
| 買方 | `organization` |
| 金額小計 | `price` / `quantity` |
| 交貨日期 | `date_time` |
| 聯絡人 | `person` + `phone` + `email` |

---

## 1. 全域依賴方向（Rule 12、13）

```text
interface  → application → domain
infrastructure → application → domain
app        → interface / application / infrastructure / core
core       → all layers（只允許向外）
domain     → only core（零框架依賴）
```

**禁止反向**：`domain` 不得 import `infrastructure`、`application`、`interface`。

---

## 2. 目錄結構

```text
fn/
├─ src/
│  ├─ app/                    # 應用入口
│  │  ├─ bootstrap/           # Firebase Admin SDK 一次初始化
│  │  ├─ container/           # DI / runtime_dependencies
│  │  ├─ config/              # 僅 app-layer 設定（功能開關等）
│  │  └─ settings/            # 部署環境設定覆寫
│  ├─ application/            # Use Cases、DTO、Ports、Services、Mappers
│  │  ├─ use_cases/           # 業務流程編排（不含 domain invariant）
│  │  ├─ dto/                 # 跨層傳輸物件（不含 domain entity）
│  │  ├─ ports/               # Port 介面（input / output）
│  │  │  ├─ input/
│  │  │  └─ output/
│  │  ├─ services/            # Application services（不含 domain rule）
│  │  └─ mappers/             # domain ↔ DTO 轉換
│  ├─ domain/                 # 純業務規則（零外部依賴）
│  │  ├─ entities/            # 聚合、子實體
│  │  ├─ value_objects/       # 不可變值對象
│  │  ├─ repositories/        # Repository 介面（僅介面）
│  │  ├─ services/            # Domain services（無狀態業務邏輯）
│  │  ├─ events/              # Domain events
│  │  └─ exceptions/          # Domain exceptions
│  ├─ infrastructure/         # 外部依賴實作（永遠在最外層）
│  │  ├─ external/
│  │  │  └─ documentai/       # Document AI client（US endpoint）
│  │  ├─ persistence/
│  │  │  ├─ firestore/        # Firestore repository 實作
│  │  │  └─ storage/          # GCS client
│  │  ├─ cache/               # Redis / Upstash cache
│  │  ├─ audit/               # QStash audit publisher
│  │  └─ external/
│  │     └─ openai/           # OpenAI embeddings / LLM
│  ├─ interface/              # Function handler（inbound adapter）
│  │  ├─ handlers/            # Cloud Functions handler 實作
│  │  └─ schemas/             # Input schema validation（Pydantic / dataclass）
│  └─ core/                   # 全層共用常數、型別、config
│     └─ config.py            # 所有環境變數讀取（唯一真實來源）
├─ tests/                     # pytest 單元測試
├─ main.py                    # Firebase Functions 入口（裝飾器宣告）
├─ requirements.txt
├─ requirements-dev.txt
├─ AGENTS.md                  # Agent 任務指引
└─ README.md                  # 本文件
```

---

## 3. 層級職責（Rule 12、17、18）

| 路徑前綴 | 職責 | 禁止 |
|---|---|---|
| `domain/` | 業務規則、不變量、Entity、Value Object、Repository 介面 | import Firebase、HTTP、ORM、任何 SDK |
| `application/` | Use case 編排、DTO、Port 定義、Application service | 直接呼叫 SDK；包含 domain invariant |
| `infrastructure/` | Port 實作、Firestore repo、Storage client、Document AI client | 包含 business rule；反向依賴 domain 實作 |
| `interface/` | Cloud Function handler、input schema 驗證 | 直接呼叫 repository；bypass use case |
| `core/` | 環境變數、常數、工具函式 | 依賴 domain/application/infrastructure |
| `app/` | Bootstrap、DI container、全域選項 | 包含 business logic |

---

## 4. Schema 驗證規則（Rule 4）

所有進入系統的外部輸入（Cloud Function request、Storage event）必須先通過 schema 驗證，才能傳遞給 use case。

```python
# ✅ 正確：interface/handlers/ 在呼叫 use case 前先驗證
from interface.schemas.parse_document import ParseDocumentRequest
req_data = ParseDocumentRequest(**raw_data)   # raises ValidationError if invalid
result = handle_parse_document_use_case(req_data)

# ❌ 錯誤：直接將 req.data 傳給 use case
result = ingest_document_for_rag(**req.data)
```

---

## 5. Failure Strategy（Rule 10）

| 呼叫類型 | 策略 |
|---|---|
| Layout Parser（主通道） | 失敗時拋例外，pipeline 整體中止 |
| Form Parser（副通道） | 失敗時 `logger.warning`，以空 `entities` 繼續 |
| OpenAI Embeddings | 失敗時拋例外，由上層 retry / dead-letter |
| Upstash Search 同步 | 失敗時 `logger.warning`，不阻斷主流程 |
| Redis doc summary | 失敗時 `logger.warning`，不阻斷主流程 |
| Firestore 寫入 | 失敗時拋例外，由上層 retry |

---

## 6. 命名規則（Rule 3）

| 概念 | 命名 | 禁止 |
|---|---|---|
| Use case 函式 | `verb_noun(…)` e.g. `ingest_document_for_rag` | `doXxx`, `processXxx` |
| Repository 介面 | `XxxGateway` / `XxxRepository` | `IXxx`, `XxxService`（用於 domain service） |
| Domain event | 過去式 e.g. `DocumentIngested` | 現在式 |
| DTO | `XxxRequest` / `XxxResult` / `XxxJob` | `XxxData`, `XxxPayload`（除非已在 glossary） |
| Config 常數 | `UPPER_SNAKE_CASE` | camelCase |

---

## 7. RAG Pipeline 流程

```text
1. Cloud Storage trigger → on_document_uploaded
2. interface/handlers/storage.py → handle_object_finalized
3. application/services/document_pipeline.py → orchestrate
4. infrastructure/external/documentai/client.py → process_document_gcs_with_form
   ├─ Layout Parser → ParsedDocument.chunks
   └─ Form Parser   → ParsedDocument.entities (best-effort)
5. application/use_cases/rag_ingestion.py → ingest_document_for_rag
   ├─ layout_chunks 非空 → layout_chunks_to_rag_chunks (chunking_strategy="layout-v1")
   └─ layout_chunks 為空 → chunk_text char-split (chunking_strategy="char-split-v2")
6. gateway.embed_texts → OpenAI text-embedding-3-small
7. gateway.upsert_vectors → Upstash Vector
8. gateway.upsert_search_documents → Upstash Search (best-effort)
9. gateway.redis_set_json → Upstash Redis doc summary (best-effort)
10. infrastructure/persistence/firestore/document_repository.py → mark status=ready
```

---

## 8. 驗證指令

```bash
cd fn
python -m compileall -q .
python -m pytest tests/ -v
```

---

## 9. 相關文件

- `.github/copilot-instructions.md` — 全系統 20 條 Mandatory Compliance Rules
- `.github/instructions/cloud-functions.instructions.md` — Cloud Functions 邊界規則
- `.github/instructions/rag-architecture.instructions.md` — RAG 架構規則
- `docs/structure/system/architecture-overview.md` — 主域關係圖
