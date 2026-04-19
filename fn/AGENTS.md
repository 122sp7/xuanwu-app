# fn — Agent Guide

## Purpose

`fn/` 是 Python Cloud Functions 的 worker 層，負責 ingestion、parsing、chunking、embedding 與 background job 等需要高資源消耗或可重試的批次作業。

> **遷移說明**：`fn/` 取代舊的 `fn/`，採相同 Hexagonal Architecture，
> 全面對齊 `.github/copilot-instructions.md` 20 條 Mandatory Compliance Rules。

---

## Runtime Boundary

| 執行時 | 負責項目 |
|---|---|
| `fn/` (Python) | parse、clean、taxonomy、chunk、embed、persistence pipeline |
| Next.js (`src/`) | upload UX、browser-facing API、response orchestration |

兩者互動**只透過**：
- QStash 訊息
- Firestore trigger
- 事件契約

---

## Route Here When

- 需要解析、清洗文件內容（PDF、Markdown、HTML）
- 需要呼叫 Document AI（Layout Parser / Form Parser）
- 需要 chunk、embed、存入向量資料庫（Upstash Vector）
- 需要可重試的背景作業或批次處理
- 需要 Firestore 寫入（ingestion 管線）

## Route Elsewhere When

- 需要 browser-facing API 或即時回應 → `src/app/`
- 需要 use case 業務邏輯（workspace、notion、notebooklm 邊界） → `src/modules/<context>/`
- 需要 session / auth / permission 判斷 → `src/modules/iam/`

---

## Architecture（Hexagonal）

```text
fn/src/
├─ app/           # 應用入口（bootstrap、container、設定）
├─ application/   # use cases、DTO、ports、application services
├─ domain/        # entities、value objects、repositories、domain services（零外部依賴）
├─ infrastructure/# Firestore、Storage、Document AI、OpenAI、Upstash adapters
├─ interface/     # Cloud Function handler（inbound adapter）+ schema validation
└─ core/          # 全層共用常數、config（環境變數唯一入口）
```

**依賴方向**（不可逆）：
```
interface → application → domain ← infrastructure
app → interface / application / infrastructure / core
domain → only core
```

詳細架構規範見 [README.md](README.md)。

---

## Document AI Processors（US Region）

⚠️ 兩個 processor 均位於 **US region**，client endpoint 必須使用 `us-documentai.googleapis.com`。

| Processor | 用途 | Resource Name |
|---|---|---|
| **Layout Parser（主）** | 語意分塊（標題、段落、表格各自成 chunk） | `projects/65970295651/locations/us/processors/929c4719f45b1eee` |
| **Form Parser（副）** | 結構化欄位擷取（PO號、金額、日期、供應商） | `projects/65970295651/locations/us/processors/7318076ba71e0758` |

### 雙通道設計

```text
GCS Document
    ├─ Layout Parser  →  ParsedDocument.chunks   →  RAG 語意分塊（主）
    └─ Form Parser    →  ParsedDocument.entities  →  結構化欄位（副，best-effort）
```

- 主通道（Layout Parser）失敗 → 整體 pipeline 失敗（拋例外）
- 副通道（Form Parser）失敗 → 記錄 `WARNING`，以空 `entities` 繼續（不阻斷主流程）

### 環境變數

| 變數 | 預設值 | 說明 |
|---|---|---|
| `DOCAI_LAYOUT_PROCESSOR_NAME` | `projects/65970295651/locations/us/processors/929c4719f45b1eee` | Layout Parser（主，不可空） |
| `DOCAI_FORM_PROCESSOR_NAME` | `projects/65970295651/locations/us/processors/7318076ba71e0758` | Form Parser（設空字串可停用） |
| `DOCAI_API_ENDPOINT` | `us-documentai.googleapis.com` | 不可改為 eu 或 global |

---

## Mandatory Compliance Mapping

| Rule | 在 fn/ 的體現 |
|---|---|
| Rule 4 — Contract / Schema | `interface/schemas/` 驗證所有 Cloud Function input |
| Rule 10 — Failure Strategy | 每個外部呼叫皆有 raise / warning / dead-letter 路徑 |
| Rule 12 — Hexagonal Architecture | `domain/` 零 SDK import；所有外部依賴在 `infrastructure/` |
| Rule 13 — Dependency Direction | interface → application → domain ← infrastructure（不可逆） |
| Rule 15 — Observability | 所有跨層呼叫使用 `logging.getLogger(__name__)`，不用 print |

---

## Cloud Functions Entry Points

| 函式名稱 | 觸發類型 | 說明 |
|---|---|---|
| `on_document_uploaded` | Storage trigger（`UPLOAD_BUCKET`） | GCS 新物件 → Document AI → Firestore |
| `parse_document` | HTTPS Callable | 手動觸發解析，回傳解析摘要 |
| `rag_query` | HTTPS Callable | RAG 檢索 + 生成查詢 |
| `rag_reindex_document` | HTTPS Callable | 手動重新 chunk + embed 文件 |

---

## Development Checklist

修改 `fn/` 時，依序確認：

1. **依賴方向**：`domain/` 是否引入了外部 SDK？ → 移到 `infrastructure/`
2. **Schema 驗證**：新的 Cloud Function input 是否在 `interface/schemas/` 驗證？
3. **Failure Strategy**：新的外部呼叫是否定義了失敗路徑（raise / warning / dead-letter）？
4. **Observability**：新的跨層呼叫是否用 `logger.info/warning/error` 記錄？
5. **US Endpoint**：Document AI client 是否仍使用 `us-documentai.googleapis.com`？
6. **Tests**：`tests/` 中是否有對應覆蓋？

---

## Validation Commands

```bash
cd fn
python -m compileall -q .
python -m pytest tests/ -v
```
