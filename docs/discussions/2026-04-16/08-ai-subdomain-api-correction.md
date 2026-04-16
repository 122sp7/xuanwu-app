# 問題八：src/modules/ai/subdomains/*/api/ 的架構謬誤修正

**Date**: 2026-04-16  
**Context**: 針對問題七中 `EmbeddingJobPayload` 放在 `subdomains/embedding/api/` 的設計提出修正。  
**觸發問題**：「src/modules/ai/subdomains/*/api/ 我們是調用方，怎麼會在這個地方做 Api」

---

## 診斷：三層錯誤

### 錯誤一：路徑根本不存在

`src/modules/` 的 lean skeleton 結構是：

```
src/modules/<context>/subdomains/<name>/
  domain/
  application/
  adapters/inbound/
  adapters/outbound/
```

**沒有 `api/` 層**。`api/` 只存在於 `modules/<context>/`（完整六邊形結構）。  
問題七建議的 `src/modules/ai/subdomains/embedding/api/` 這個路徑在 lean skeleton 裡根本不存在，不應該被建立。

---

### 錯誤二：混淆了「調用方 DTO」與「被調用方 API」

`api/` 在六邊形架構中的語意是：

> **「這個 module 對外暴露的穩定能力合約」（Provider 視角）**

消費方（caller）引用 `modules/<provider>/api/` 來調用能力。  
**Provider 才在自己的 `api/` 定義合約，Caller 不該在自己的 subdomain 建 `api/`。**

```
notebooklm（caller）→ ai.api（provider api） → ai.application → ai.adapters.outbound → QStash → py_fn
```

`ai` 對 `notebooklm` 是 **Provider**（有 `api/`，在 `modules/ai/api/`）。  
`ai` 對 `py_fn` 是 **Dispatcher / Caller**（發 QStash 訊息出去的那方）。

---

### 錯誤三：QStash payload DTO 的正確位置

QStash payload 是 `ai.adapters.outbound` 的**輸出 DTO**（outbound adapter 在發送訊息時定義的資料形狀），不是 API 合約。

```
# 錯誤（問題七的建議）
src/modules/ai/subdomains/embedding/api/index.ts  ← 不存在此路徑，語意也錯誤

# 正確
src/modules/ai/subdomains/embedding/adapters/outbound/dto/embedding-job-payload.ts
```

---

## 正確的架構圖

```
┌─────────────────────────────────────────────────────────────┐
│ src/modules/ai/subdomains/embedding/                        │
│                                                             │
│  domain/          Embedding entity, EmbeddingPort interface │
│  application/     GenerateEmbedding use-case                │
│  adapters/                                                  │
│    outbound/                                                │
│      qstash-embedding-dispatcher.ts  ← sends QStash job    │
│      dto/                                                   │
│        embedding-job-payload.ts      ← payload DTO（HERE） │
│    inbound/                                                 │
│      (empty or future: webhook callback handler)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 誰擁有 published language contract？

QStash payload 有兩個視角：

| 視角 | 位置 | 形式 |
|---|---|---|
| TypeScript（dispatcher side） | `src/modules/ai/subdomains/embedding/adapters/outbound/dto/embedding-job-payload.ts` | Zod schema + TypeScript type |
| Python（handler side） | `py_fn/src/application/dto/rag.py` 或 `interface/handlers/rag_ingestion.py` | Pydantic model（鏡像驗證） |

**重要**：這不是「API」，這是「outbound contract」。  
兩邊透過文件（published language）保持語意對齊，不透過程式碼共享。

---

## cross-module 能力邊界（正確位置）

`notebooklm` 要調用 `ai` 的能力，走的是：

```typescript
// modules/ai/api/index.ts（完整六邊形結構中的 published API）
// 或
// src/modules/ai/index.ts（lean skeleton 中的 module 根匯出）
export type { EmbeddingPort } from './subdomains/embedding/domain/ports';
export type { GenerateEmbeddingInput } from './subdomains/embedding/application/dto';
```

`notebooklm` 只能從 `@/modules/ai/api` 或 `@/src/modules/ai`（index） 引入，  
**不應直接 import 任何 subdomain 內部路徑**。

---

## 修正行動清單（取代問題七的 P0）

| 優先級 | 動作 | 正確路徑 |
|---|---|---|
| P0 | 定義 `EmbeddingJobPayload` schema | `src/modules/ai/subdomains/embedding/adapters/outbound/dto/embedding-job-payload.ts` |
| P0 | 定義 `ChunkJobPayload` schema | `src/modules/ai/subdomains/chunk/adapters/outbound/dto/chunk-job-payload.ts` |
| P0 | QStash dispatcher adapter | `src/modules/ai/subdomains/embedding/adapters/outbound/qstash-embedding-dispatcher.ts` |
| P1 | py_fn 鏡像驗證 | `py_fn/src/application/dto/embedding_job.py`（Pydantic） |
| P1 | published language 文件 | `docs/contexts/ai/cross-runtime-contracts.md` |

---

## 一句話原則

> **`api/` 是 Provider 對外暴露的入口，Dispatcher（outbound）的 payload DTO 屬於 `adapters/outbound/dto/`，不是 `api/`。**
