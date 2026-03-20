# ADR 005: 從 `libs/firebase/functions` 遷移到 `libs/firebase/functions-python`

## 狀態 (Status)
**Accepted**

## 背景 (Context)

在遷移開始時，倉庫中曾同時存在：

- `libs/firebase/functions` 是既有的 TypeScript Firebase Functions codebase
- `libs/firebase/functions-python` 是新的 Python codebase

兩者同時存在於 `firebase.json`，代表遷移起點是**雙 codebase 共存**。

若沒有 migration ADR，常見風險包括：

1. 兩邊重複維護同一能力。
2. 還沒能力對齊就直接刪除 Node Functions。
3. Next.js 端呼叫鏈路在遷移中頻繁變更，導致上層產品行為不穩。

## 決策 (Decision)

`libs/firebase/functions-python` 將作為 **document ingestion / worker runtime 的長期替代者**，並以**分階段遷移**取代 `libs/firebase/functions` 中的重型文件處理責任。

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

#### 不應新增到 `libs/firebase/functions`

- 新的 parser adapter
- 新的 embedding / chunk persistence 流程
- 新的 background ingestion orchestration

### 建議遷移階段

#### Phase 0 — 共存基線

- 保持 `firebase.json` 內兩個 codebase 併存
- 不移除既有 document-ai function
- 建立 ADR 與 runtime 邊界規則

#### Phase 1 — Scaffold parity

- 讓 Python 版 callable 與 Node 版具備足夠對齊能力
- 建立一致的 request / response / audit 行為

#### Phase 2 — New worker features only in Python

- 所有新增 ingestion 能力只放在 `functions-python`
- Node codebase 只維持既有能力，不再擴張

#### Phase 3 — Switch orchestration path

- Next.js / internal admin flow 改為優先呼叫 Python worker 路徑
- Firestore / Storage trigger 轉向 Python runtime

#### Phase 4 — Observe and freeze Node Functions

- 確認成功率、延遲、審計記錄、回滾策略
- 凍結 `libs/firebase/functions` 的 document-ai 相關能力

#### Phase 5 — Decommission

- 從 `firebase.json` 移除 Node codebase
- 移除 `libs/firebase/functions`
- 同步更新 README / AGENTS / ADR，避免後續設計仍以雙 runtime 為前提

## Alternatives Considered

### 方案 A：直接刪除 `libs/firebase/functions`

**不採用。**

原因：

- 在遷移起點仍有正式 codebase 宣告
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
3. `libs/firebase/functions` 的下線條件更清楚，不再依賴口頭共識。

### 負面影響

1. 短期內需要維護雙 runtime。
2. migration 期間需要更清楚的觀測與文件同步。

## Migration Outcome

- `firebase.json` 已移除 `default` Node codebase，只保留 `functions-python`。
- `libs/firebase/functions` 已正式刪除，Firebase worker 能力統一由 Python runtime 承接。
- Next.js 仍保留 user-facing upload / query / streaming responsibilities，不因這次收斂而改變。
- 這次淘汰不影響前端互動鏈路，因為被移除的 `libs/firebase/functions` 本來就不承接 browser-facing interaction；
  user-facing orchestration 一直都在 Next.js 邊界內。

## Operational Notes

- 正式下線已完成，不應重新引入 `libs/firebase/functions` 作為第二套 runtime。
- 若未來要新增 Firebase worker 能力，請直接在 `functions-python` 內擴充。
