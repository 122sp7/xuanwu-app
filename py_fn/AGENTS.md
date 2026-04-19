# fn — Agent Guide

## Purpose

`fn/` 是 Python Cloud Functions 的 worker 層，負責 ingestion、parsing、chunking、embedding 與 background job 等需要高資源消耗或可重試的批次作業。

## Runtime Boundary

- `fn/` 處理：parse、clean、taxonomy、chunk、embed、persistence pipeline
- Next.js 處理：upload UX、browser-facing API、response orchestration
- 兩者互動只透過 QStash 訊息、Firestore trigger 或事件契約

## Route Here When

- 需要解析、清洗文件內容（PDF、Markdown、HTML）
- 需要 chunk、embed、存入向量資料庫
- 需要可重試的背景作業或批次處理

## Route Elsewhere When

- 需要 browser-facing API 或即時回應 → `src/app/`
- 需要 use case 業務邏輯 → `src/modules/<context>/`

## Architecture

`fn/src/` 採用同樣的 Hexagonal Architecture 分層：
- `app/` — 應用入口（config、bootstrap、container、settings）
- `application/` — use cases、DTO、ports、services、mappers
- `domain/` — entities、value objects、repositories、events
- `infrastructure/` — Firestore、Storage、AI SDK adapters

詳細架構規範見 [README.md](README.md)。

## Document AI Processors（US Region）

⚠️ 兩個 processor 均位於 **US region**，client endpoint 必須使用 `us-documentai.googleapis.com`。

| Processor | 用途 | Resource Name |
|---|---|---|
| Layout Parser | 主通道 — 語意分塊（標題、段落、表格各自成 chunk） | `projects/65970295651/locations/us/processors/929c4719f45b1eee` |
| Form Parser | 副通道 — 結構化欄位擷取（PO號、金額、日期、供應商） | `projects/65970295651/locations/us/processors/7318076ba71e0758` |

### 雙通道設計

```text
GCS Document
    → Layout Parser  →  ParsedDocument.chunks  →  RAG 語意分塊（主）
    → Form Parser    →  ParsedDocument.entities →  結構化欄位（副，best-effort）
```

- 主通道（Layout Parser）失敗 → 整體 pipeline 失敗（拋例外）
- 副通道（Form Parser）失敗 → 記錄 WARNING，以空 entities 繼續（不阻斷主流程）

### 環境變數

| 變數 | 預設值 | 說明 |
|---|---|---|
| `DOCAI_LAYOUT_PROCESSOR_NAME` | `projects/65970295651/locations/us/processors/929c4719f45b1eee` | Layout Parser 資源名稱 |
| `DOCAI_FORM_PROCESSOR_NAME` | `projects/65970295651/locations/us/processors/7318076ba71e0758` | Form Parser 資源名稱（設為空字串可停用） |

### Form Parser 擷取欄位（AP8 採購訂購單）

| 欄位 | Document AI Entity Type |
|---|---|
| 訂購單號 | `id` 或自定義 KV |
| 供應商 | `organization` |
| 買方 | `organization` |
| 金額小計 | `price` / `quantity` |
| 交貨日期 | `date_time` |
| 聯絡人 | `person` + `phone` + `email` |
