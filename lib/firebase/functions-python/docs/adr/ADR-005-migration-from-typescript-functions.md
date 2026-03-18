# ADR 005: 從 `lib/firebase/functions` 遷移到 `lib/firebase/functions-python`

## 狀態 (Status)
**Accepted**

## 背景 (Context)

目前倉庫中：

- `lib/firebase/functions` 是既有的 TypeScript Firebase Functions codebase
- `lib/firebase/functions-python` 是新的 Python codebase

兩者目前都存在於 `firebase.json`，代表現況是**雙 codebase 共存**。

若沒有 migration ADR，常見風險包括：

1. 兩邊重複維護同一能力。
2. 還沒能力對齊就直接刪除 Node Functions。
3. Next.js 端呼叫鏈路在遷移中頻繁變更，導致上層產品行為不穩。

## 決策 (Decision)

`lib/firebase/functions-python` 將作為 **document ingestion / worker runtime 的長期替代者**，並以**分階段遷移**取代 `lib/firebase/functions` 中的重型文件處理責任。

## 設計細節 (Design)

### 遷移原則

1. **先共存，再替換**
2. **先搬重型 worker responsibility，不搬 product-facing API**
3. **先做能力對齊與觀測，再停用 Node Functions**

### 遷移範圍

#### 優先遷移到 functions-python

- Document AI parsing
- raw file ingestion
- status transition
- chunking / embedding pipeline
- reprocess / backfill / maintenance

#### 留在 Next.js

- upload initialization
- user-facing document query APIs
- RAG query / chat / streaming flows
- auth/session-aware product behavior

#### 不應新增到 `lib/firebase/functions`

- 新的 parser adapter
- 新的 embedding / chunk persistence 流程
- 新的 background ingestion orchestration

### 建議遷移階段

#### Phase 0 — 共存基線

- 保持 `firebase.json` 內兩個 codebase 併存
- 不移除既有 `processDocumentWithAi`
- 建立 ADR 與 runtime 邊界規則

#### Phase 1 — Scaffold parity

- 讓 Python 版 `process_document_with_ai` 與 Node 版具備足夠對齊能力
- 建立一致的 request / response / audit 行為

#### Phase 2 — New worker features only in Python

- 所有新增 ingestion 能力只放在 `functions-python`
- Node codebase 只維持既有能力，不再擴張

#### Phase 3 — Switch orchestration path

- Next.js / internal admin flow 改為優先呼叫 Python worker 路徑
- Firestore / Storage trigger 轉向 Python runtime

#### Phase 4 — Observe and freeze Node Functions

- 確認成功率、延遲、審計記錄、回滾策略
- 凍結 `lib/firebase/functions` 的 document-ai 相關能力

#### Phase 5 — Decommission

- 從 `lib/firebase/functions/src/index.ts` 移除對應 export
- 移除不再使用的 TypeScript document-ai module
- 最後再調整 `firebase.json`

### 目前對應關係

| TypeScript Functions | Python Functions | 說明 |
| --- | --- | --- |
| `src/index.ts` | `main.py` | runtime entrypoint |
| `document-ai/interfaces/callable/processDocumentWithAi.ts` | `app/document_ai/interfaces/callables/process_document_with_ai.py` | callable adapter |
| `document-ai/application/use-cases/*` | `app/document_ai/application/use_cases/*` | use case orchestration |
| `document-ai/infrastructure/documentai/*` | `app/document_ai/infrastructure/google/*` | Document AI adapter |
| `document-ai/infrastructure/firebase/*` | `app/document_ai/infrastructure/firebase/*` | audit/persistence adapter |

## Alternatives Considered

### 方案 A：直接刪除 `lib/firebase/functions`

**不採用。**

原因：

- 現況仍有正式 codebase 宣告
- 直接刪除風險過高，且沒有回滾空間

### 方案 B：永久雙寫、雙維護

**不採用。**

原因：

- 長期成本過高
- 容易產生功能分歧與文件失真

## 後果 (Consequences)

### 正面影響

1. 遷移可控，可逐步驗證。
2. `functions-python` 能自然承接長期 worker / infrastructure 角色。
3. `lib/firebase/functions` 的下線條件更清楚，不再依賴口頭共識。

### 負面影響

1. 短期內需要維護雙 runtime。
2. migration 期間需要更清楚的觀測與文件同步。

## Operational Notes

- 在 Phase 4 完成前，不應修改 `firebase.json` 移除 `default` codebase。
- 在正式下線前，README / AGENTS / ADR 必須同步更新，避免 Copilot 仍以舊架構做設計判斷。
