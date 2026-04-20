# ADR 0002 — Cross-Runtime Bridge：Next.js ↔ fn/ Python Worker

## Status

Accepted

## Date

2025-02-11

## Context

Repo 有兩個分開的 runtime：

1. **`src/`（Next.js + TypeScript）**：App Router、Server Actions、使用者互動、模組業務邏輯。
2. **`fn/`（Python Cloud Functions）**：文件 ingestion、DocumentAI 解析、chunking、embedding、Upstash Vector/Redis/Search 更新。

問題：`src/modules/ai/` 目前包含 `chunk`、`citation`、`embedding`、`pipeline` 子域，這些能力**在概念上屬於 fn/ Python pipeline**，卻被建在 TypeScript 模組層。這造成：

- 邊界混淆：TypeScript `ai` module 聲稱擁有只有 Python 才能執行的能力
- 重複定義：fn/ 與 ai/ 都試圖描述同一個 chunking/embedding 語言
- 部署耦合風險：fn/ pipeline 的 schema 變更無法在 TypeScript 層同步驗證

此外，Next.js runtime 與 fn/ runtime 之間**沒有共享程式碼**，只能透過：
- **Firestore events**（fn/ 寫入，Next.js 讀取）
- **QStash 訊息**（Next.js enqueue，fn/ consume）
- **GCS / Storage URLs**（fn/ 寫入路徑，Next.js 讀取 URL）

## Decision

### 固定邊界

| 責任 | 所屬 runtime | 禁止 |
|---|---|---|
| Upload UX、瀏覽器互動、Server Action | Next.js (`src/`) | 不得執行 parse/chunk/embed |
| DocumentAI 解析、chunking、embedding、RAG 寫入 | fn/ (Python) | 不得包含 browser auth / session / chat logic |
| 跨 runtime 通訊 | Firestore event + QStash | 不得直接呼叫彼此的 API |

### ai module TypeScript subdomain 重分類

以下 TypeScript `ai/` 子域需重新評估歸屬：

| 子域 | 當前位置 | 正確歸屬 |
|---|---|---|
| `chunk` | `ai/subdomains/chunk/` | fn/ Python pipeline（概念）；若需 TypeScript 契約則移至 `notebooklm/source/` |
| `embedding` | `ai/subdomains/embedding/` | 同上 |
| `pipeline` | `ai/subdomains/pipeline/` | 同上 |
| `citation` | `ai/subdomains/citation/` | notebooklm/synthesis 的引用追蹤能力 |
| `generation` | `ai/subdomains/generation/` | ✅ 保留，AI 文本生成屬於 shared ai capability |
| `retrieval` | `ai/subdomains/retrieval/` | ✅ 保留，向量搜尋是 shared ai capability |
| `context` | `ai/subdomains/context/` | ✅ 保留，prompt 上下文組裝屬於 shared ai |
| `memory` | `ai/subdomains/memory/` | ✅ 保留，跨輪次記憶屬於 shared ai |
| `evaluation` | `ai/subdomains/evaluation/` | ✅ 保留，AI 輸出品質評估屬於 shared ai |
| `tool-calling` | `ai/subdomains/tool-calling/` | ✅ 保留 |

### QStash 訊息契約

fn/ pipeline 的 trigger 格式必須在 fn/src/interface/schemas/ 定義並版本化。Next.js 只能以 QStash client 發送已定義格式，不得 hardcode JSON key。

## Consequences

**正面：** 防止 TypeScript ai 模組膨脹為 ETL 模組；fn/ 保有 Python pipeline 語意所有權。  
**負面：** 需要評估 `chunk`/`embedding`/`pipeline` 的現有 TypeScript 程式碼，確認是否只有 type/contract（可保留）或有 runtime 邏輯（需移除/遷移）。  
**中性：** QStash 訊息契約是兩個 runtime 的唯一耦合點，需維護版本化 schema。

## References

- `fn/AGENTS.md` — Python worker 架構規則
- `fn/src/interface/schemas/` — QStash 訊息入口 schema
- `docs/structure/system/architecture-overview.md` — 全域架構敘事
- ADR ai/0001 — ai chunk/embedding/pipeline 子域歸屬決策
