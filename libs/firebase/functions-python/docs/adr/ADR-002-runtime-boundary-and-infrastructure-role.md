# ADR 002: functions-python 的 runtime 邊界與基礎設施定位

## 狀態 (Status)
**Accepted**

## 背景 (Context)

目前倉庫同時存在兩個 Firebase Functions codebase：

- `libs/firebase/functions`（TypeScript）
- `libs/firebase/functions-python`（Python）

若沒有明確定義 `functions-python` 的定位，後續很容易發生以下問題：

1. 把瀏覽器直接使用的 API 也搬到 Python Functions。
2. 把 Next.js / Genkit / auth/session 責任錯誤地下放到 worker runtime。
3. 讓 `functions-python` 變成第二個產品後端，導致 runtime 邊界混亂。
4. 遷移 `libs/firebase/functions` 時沒有階段規劃，造成雙邊重複實作與責任重疊。

## 決策 (Decision)

`libs/firebase/functions-python` 被定義為：

- **Firebase worker runtime**
- **文件 ingestion / parsing / taxonomy / chunking / embedding 的基礎設施**
- **internal callable / trigger / maintenance 任務執行層**

它**不是**：

- 主要產品 API server
- 瀏覽器直接依賴的 query / chat / streaming runtime
- 負責 auth/session/cookies 的邊界層

## 設計細節 (Design)

### Runtime ownership

#### Next.js owns

- browser-facing APIs
- upload initialization / file submission
- auth / session / cookies / request context
- Route Handlers / Server Actions
- Genkit query preprocessing
- Firestore vector search orchestration for user-facing queries
- prompt assembly and streaming response shaping

#### functions-python owns

- Storage / Firestore driven worker execution
- file download and binary access
- parse / clean / taxonomy / chunk / embedding
- Firestore write-side processing outputs
- status transition: `uploaded -> processing -> ready`
- reprocess / backfill / admin-safe maintenance entrypoints

### API placement rule

若某 API 具備以下任一條件，應優先放在 **Next.js**：

- 直接被瀏覽器或頁面流程呼叫
- 需要 auth/session/cookies
- 需要 streaming UI response
- 與 Genkit 對話體驗強耦合

若某能力具備以下任一條件，應優先放在 **functions-python**：

- 背景執行
- 高 CPU / 高 IO / 高延遲
- 可重試
- 由 Storage / Firestore trigger 驅動
- 屬於 admin / reprocess / backfill

## Alternatives Considered

### 方案 A：把 functions-python 做成第二個完整產品後端

**不採用。**

原因：

- 會重複實作 auth / validation / response-shaping
- 讓瀏覽器入口分散到兩個 runtime
- 使 Copilot 難以判斷 product API 應放在哪裡

### 方案 B：只保留 Next.js，不使用 functions-python

**不採用。**

原因：

- 文件解析與 embedding pipeline 屬於長時任務，不應放在 request/response path
- Python 在文件處理與 AI/data pipeline 的長期可維護性更高

## 後果 (Consequences)

### 正面影響

1. 產品 API 與 worker pipeline 責任明確分離。
2. `functions-python` 可以專注在基礎設施與可重試背景流程。
3. 未來引入更多 parser / embedding / maintenance capability 時，不會污染 Next.js product edge。

### 負面影響

1. 需要維護雙 runtime 共存期。
2. 需要更清楚的文件與 migration plan，否則容易產生邊界漂移。

## Migration Impact

- 新增的 ingestion / worker 能力，應預設實作在 `functions-python`。
- 既有 Node Functions 不應再承接新的重型文件處理責任。
- 瀏覽器直連 API 不應從 Next.js 遷往 Python，除非重新做出新的 ADR 並明確接受風險。
