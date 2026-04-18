# GAP-02 Notion templates 與多子域仍大量 placeholder

| 欄位 | 值 |
|---|---|
| Gap ID | GAP-02 |
| 類型 | 業務缺口 |
| 優先級 | P2 |
| 影響範圍 | `notion.templates` / `notion.pages` / `notion.database` / `notion.knowledge` |
| 狀態 | 🔴 Open |

## 問題描述

Notion 子域（template / page / block / database / view / collaboration）中：

1. `template-actions.ts`：`queryTemplatesAction` 只解析輸入後直接回傳 `[]`，有明確 `// TODO: implement when TemplateUseCases are available`。
2. `TemplateUseCases.ts`：為 placeholder。
3. `notion-page-stub.ts`：`not yet implemented` stub。
4. `view` / `collaboration` / `block` 子域的 `adapters/inbound/index.ts` 大多為 `export {}`。

## 直接影響

- 使用者在「知識 / 頁面 / 模板」等功能頁面無法執行任何業務操作。
- 模板 scope 控制（workspace / org / global）無法實作，形成安全盲點。

---

## 20 準則逐項對齊

### 1. AI Operational Scope

**現狀**：修補範圍鎖定「notion 模組已存在子域的 stub 填充」，不新增子域或跨模組介面。  
**補救要求**：每次 PR 只針對單一子域（template 或 page 或 block），不批次填充所有 placeholder。

---

### 2. Bounded Context

**現狀**：page / block / database / view / template / collaboration 六個子域邊界已結構化，但無公開 API 讓 workspace 或 notebooklm 消費 notion 內容的語意令牌。  
**補救要求**：`notion/index.ts` 需明確公開「KnowledgeArtifact 參考令牌」（`pageId`、`databaseId`），其他模組只能持有令牌，不能直接引用 notion 內部聚合。

---

### 3. Ubiquitous Language Governance

**現狀**：`Template`、`KnowledgeArtifact`、`Page`、`Block`、`DatabaseRecord` 在 glossary 中有定義，但 `template-actions.ts` 的 `scope` 枚舉（`workspace/org/global`）未見於 ubiquitous language 文件。  
**補救要求**：`scope` 枚舉值必須以 domain 術語定義（`WorkspaceScope` / `OrganizationScope` / `GlobalScope`），並更新 glossary。

---

### 4. Contract / Schema

**現狀**：`QueryTemplatesInputSchema` 已在 action 邊界使用 Zod，但 `queryTemplatesAction` 回傳 `Template[]` 未定義回傳 schema——空陣列回傳掩蓋了 schema drift 風險。  
**補救要求**：
- 補 `TemplateOutputSchema`（Zod），對 repository 回傳的每個 item 做 `parse()`。
- 凡 stub 回傳 `[]` 的地方，補 TODO 標記禁止進入生產環境。

---

### 5. Breaking Change Policy

**現狀**：`Template` entity schema（`id / workspaceId / title / category / content / createdAtISO`）尚未公開，暫無版本問題。  
**補救要求**：一旦 template API 公開，`content` 欄位如涉及結構化 block 型別需版本化（`contentV1`），避免未來 block schema 演化破壞舊資料。

---

### 6. Aggregate Design

**現狀**：`Template` 實體定義已存在，但無工廠方法（`Template.create()`）或 domain event，屬裸資料結構（anemic model）。  
**補救要求**：
- 補 `Template.create(id, input)` 工廠方法，發布 `template.created` domain event。
- 補 `Template.publish()` / `Template.deprecate()` 命令方法，不讓 use case 直接修改屬性。

---

### 7. State Model / FSM

**現狀**：`Template` 無生命週期狀態（`draft / published / deprecated`），任何狀態均可被外部直接 overwrite。  
**補救要求**：
- 定義 `TemplateStatus: "draft" | "published" | "deprecated"`。
- 補 FSM guard：`draft → published` (合法) ; `published → deprecated` (合法) ; `deprecated → published` (禁止)。
- 非法轉換 throw，不 silent ignore。

---

### 8. Consistency / Transaction Strategy

**現狀**：模板套用至頁面（`applyTemplate → createPage`）涉及跨聚合操作，目前無交易策略（stub 回傳空陣列迴避了此問題）。  
**補救要求**：模板套用使用 saga 或 outbox pattern：先建立 `Page`（page subdomain），再記錄「模板已套用」事件——不用單一同步交易跨兩個聚合。

---

### 9. Event Ordering / Causality Model

**現狀**：notion 子域無任何 domain events 定義（template / page / block 均無 `_domainEvents`）。  
**補救要求**：
- 補 `template.created`、`template.published`、`template.applied` domain events，含 `eventId`、`occurredAt`（ISO string）。
- 消費端（例如 workspace 取用 template）需以 `eventId` 做冪等鍵。

---

### 10. Failure Strategy

**現狀**：`queryTemplatesAction` 回傳空陣列不回報錯誤，失敗路徑完全被 silent—— 使用者無法區分「無資料」與「服務失敗」。  
**補救要求**：
- 區分 `QueryResult.empty`（確實無資料）vs `QueryResult.error`（系統錯誤）。
- 錯誤情況不得回傳空陣列，需回傳含 `error_code` 的結構，讓 UI 可呈現錯誤狀態。

---

### 11. Authorization / Security

**現狀**：`queryTemplatesAction` 接受 `scope: "global"` 但無 actor 驗證——任何人可查詢全域模板。  
**補救要求**：
- `global` scope 需 admin role 驗證。
- `org` scope 需 actorId 屬於該 org 驗證。
- `workspace` scope 需 actorId 為 workspace member 驗證。
- 每個 scope 需獨立 permission check，不合併到單一條件。

---

### 12. Hexagonal Architecture

**現狀**：`notion-page-stub.ts`（outbound adapter stub）放在 `adapters/outbound/`，但 `queryTemplatesAction` 跳過 use case 直接回傳 `[]`——domain / application / infrastructure 三層未串接。  
**補救要求**：`queryTemplatesAction` → `TemplateUseCases.query()` → `TemplateRepository.findByScope()` → Firestore，不得在 action 直接回傳資料。

---

### 13. Dependency Rule Enforcement

**現狀**：目前 notion 模組間尚無跨子域直接 import，但 stub 的存在意味著實際依賴尚未建立。  
**補救要求**：
- 填充時遵循 `interfaces → application → domain ← infrastructure`。
- template / page / block 子域互相不直接 import 對方 domain 層——跨子域呼叫需透過 notion `index.ts`。

---

### 14. Testability / Specification

**現狀**：notion 模組無任何 `.test.ts` 檔案。  
**補救要求**：填充每個 use case 前，先補：
- `Template.create()` / `publish()` / `deprecate()` 的 unit test。
- `queryTemplatesAction` 的 scope permission 測試（三個 scope 各自正反例）。

---

### 15. Observability

**現狀**：stub 回傳無任何 log，無法區分 stub 執行與正常執行路徑。  
**補救要求**：
- 填充 use case 後，記錄 `{ traceId, actorId, workspaceId, scope, resultCount }` 結構化 log。
- Template 套用操作記錄 `{ templateId, targetPageId, actorId, duration }`。

---

### 16. ADR / Design Rationale

**現狀**：template `content` 的儲存格式（rich text block tree vs. JSON string vs. structured schema）有多個選項，尚無 ADR。  
**補救要求**：在實作 `Template.content` 前，列出：
- Option A：`content` 為 JSON string（最簡，難 query）
- Option B：`content` 為 block array schema（可 query，需 migration）  
選定後記錄，不可跳過。

---

### 17. Minimum Necessary Design / YAGNI Enforcement

**現狀**：`collaboration` 子域（即時共同編輯）目前無確定業務需求觸發。  
**補救要求**：此次填充只補 template + page 的主鏈路，不建立 collaboration / view 子域的 infrastructure——待有明確業務需求再開啟。

---

### 18. Single Responsibility / No Redundancy

**現狀**：`page` 子域的 stub 存在、`block` 子域的 stub 存在，兩者均有「頁面內容」的概念，目前未明確切分 page 與 block 的職責邊界。  
**補救要求**：
- `Page` 只持有 metadata（`title / parentId / workspaceId / status`）。
- `Block` 只持有 content unit（`type / content / order`）。
- 兩者不重複持有「內容文字」欄位。

---

### 19. Design Activation Rules

**現狀**：notion 模組尚無複雜工作流需要 XState 或 saga，目前缺口是基礎 CRUD 缺失。  
**補救要求**：填充以 CRUD 為起點。template `content` 如日後涉及版本化 diff，再評估是否引入 CRDT 或 event sourcing。

---

### 20. Lint / Policy as Code

**現狀**：無靜態規則阻止「server action 直接回傳 `[]` 而不呼叫 use case」。  
**補救要求**：
- 考慮建立 custom ESLint rule 或 biome rule：server action 函式體不得直接 `return []` 或 `return {}`（需經由 use case）。
- 或加入 CI 的 grep check：`grep -rn "return \[\]" src/modules/*/adapters/inbound/server-actions/` 回報警告。

---

## 修補路徑（最小必要步驟）

1. 撰寫 ADR（Rule 16）選定 template content 儲存格式。
2. 補 `Template` aggregate 工廠方法 + FSM（Rule 6, 7）。
3. 更新 glossary 補 `TemplateStatus` 術語（Rule 3）。
4. 補 `TemplateRepository` port + `FirestoreTemplateRepository` 實作（Rule 12）。
5. 補 `QueryTemplatesUseCase`（Rule 12）。
6. 更新 `queryTemplatesAction` 呼叫 use case + scope permission check（Rule 11）。
7. 補 unit tests（Rule 14）。
8. 補結構化 log（Rule 15）。

---

## Context7 驗證錨點

> 本節所有 API 建議均已透過 Context7 查閱官方文件確認（confidence ≥ 99.99%）。

| 函式庫 | Context7 ID | 用途 |
|---|---|---|
| Zod | `/colinhacks/zod` | `TemplateOutputSchema` output 驗證 + `QueryTemplatesInputSchema` strict boundary + `TemplateStatus` brand type |
| XState | `/statelyai/xstate` | `TemplateStatus` FSM：`draft → published → deprecated` 的 `guard` 組合（`not('isDeprecated')`）|
| Stately Docs | `/statelyai/docs` | 狀態命名規範：`draft / published / deprecated`（業務語意）|
| ESLint | `/eslint/eslint` | flat-config 規則：server action 函式體不得直接 `return []` 不呼叫 use case（防止 stub 入生產） |

**Zod 關鍵模式（Context7 確認）**：
- `TemplateOutputSchema.parse(item)` 對 repository 回傳每個 item 驗證，schema drift 立即可見（Rule 4）；
- `z.discriminatedUnion('type', [...])` 用於 template `content` block 型別的 union schema（Rule 5）；
- `QueryTemplatesInputSchema = z.object({ scope: z.enum(['workspace', 'org', 'global']), ... }).strict()` — `.strict()` 阻止未宣告欄位穿透（Rule 4）。

**XState 關鍵模式（Context7 確認）**：
- `setup({ guards: { canPublish: ({ context }) => context.status === 'draft' } }).createMachine(...)` — guard 禁止 `deprecated → published` 非法轉換（Rule 7）；
- 非法轉換不 silent ignore，guard 失敗後事件被機器丟棄並保持原狀態，上層 use case 需 handle 此 case 後回傳 `commandFailureFrom('INVALID_TRANSITION')`（Rule 7）。
