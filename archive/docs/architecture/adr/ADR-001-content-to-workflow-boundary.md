# ADR-001: 內容模組與工作流模組的邊界與事件驅動整合

<!-- change: Complete and format ADR for content↔workspace-flow boundary; PR-NUM -->

*(Content to Workflow Boundary & Event-Driven Integration)*

**狀態（Status）：** 已接受（Accepted）  
**日期（Date）：** 2026-03-27  
**提案者（Proposers）：** Architecture Team  
**影響範圍（Scope）：** `modules/content`, `modules/workspace-flow`, `modules/shared`

---

## 決策背景

系統導入 AI 合約解析與攝入管線（`py_fn/` 工作者）後，面臨「非結構化內容（如合約 PDF）如何轉換為強結構化業務實體（如 Task、Invoice）」的核心架構挑戰。

若 AI 解析結果直接寫入 `workspace-flow`，將面臨三個致命問題：

1. **AI 容錯率低**：`workspace-flow` 具有嚴格的狀態機（XState 概念），若 AI 解析金額或條款錯誤，直接寫入後撤銷成本極高，甚至觸發錯誤的審核流程或通知。
2. **上下文丟失（Context Loss）**：Task / Invoice 是「執行單元」，無法承載合約的完整脈絡（前言、雙方義務、免責條款）。
3. **缺乏 Human-in-the-loop**：合約通常需要業務人員「確認」後才生效，不應由 AI 自動完成所有狀態轉換。

此外，在探索 `bounded-contexts.md` 的設計後確認：`workspace-flow` 與 `content`（Pages + 計畫中的 Database）之間存在職責重疊與邊界模糊，需要明確的 DDD 關係模式定義。

---

## 決策內容

### 原則一：確立緩衝區機制（Buffer Zone）

AI 解析結果**必須**先落地於 `content` 模組，生成 `ContentPage` 與 Database Blocks，作為「草稿與人工審閱視圖」：

```text
[AI 攝入管線 py_fn]
      │
      ▼  寫入草稿
[content: ContentPage + Database Blocks]
      │  使用者審閱、修改
      ▼  核准
[content.page_approved 事件]
      │
      ▼  實體化
[workspace-flow: Task / Invoice]
```

`content` 作為非結構化資料與 AI 解析結果的**緩衝區（Buffer Zone）**，提供 Database Block 作為審閱視圖，並在使用者確認後觸發 `content.page_approved` 事件。

### 原則二：事件驅動的實體化（Materialization via Domain Events）

使用者在 `content` 介面確認無誤並「核准（Approve）」後，由 `content` 模組派發領域事件：

```typescript
interface ContentPageApprovedEvent {
  readonly type: "content.page_approved";
  readonly aggregateId: string;          // ContentPage ID
  readonly occurredAtISO: string;
  readonly pageId: string;
  readonly extractedTasks: Array<{ title: string; dueDate?: string; description?: string }>;
  readonly extractedInvoices: Array<{ amount: number; description: string; currency?: string }>;
  readonly actorId: string;              // 執行核准的使用者 ID
  readonly causationId: string;          // 觸發此事件的命令 ID（ApproveContentPageUseCase）
  readonly correlationId: string;        // 整個業務流程的追蹤 ID
}
```

### 原則三：單向依賴與溯源（Unidirectional Dependency & Source Tracing）

`workspace-flow` 模組由 Process Manager（`contentToWorkflowMaterializer`）監聽 `content.page_approved` 事件，進而生成具備狀態機的業務實體。生成的實體**必須**帶有 `sourceReference` 指回原始 `ContentPage`：

```typescript
// workspace-flow 實體的 sourceReference 結構
interface SourceReference {
  readonly type: "ContentPage";
  readonly id: string;          // ContentPage ID（因果 ID）
  readonly causationId: string; // 事件 causationId
  readonly correlationId: string;
}

// 範例：Task 聚合根新增欄位
interface Task {
  // ...既有欄位
  readonly sourceReference?: SourceReference; // 由事件派生時必填
}
```

### 原則四：動態視圖參照（Read-Only View Reference）

`content` 模組內的 Database 可透過 Read Model（CQRS 唯讀查詢）嵌入並展示 `workspace-flow` 的任務最新狀態，但**不允許**直接覆寫其狀態機：

```text
content (Database View) ──reads──► workspace-flow
  └── 透過 modules/workspace-flow/api 的 getWorkspaceFlowTasks() 唯讀查詢
  └── 不可繞過 workspace-flow/application/use-cases 直接寫入
```

---

## 關係模式（DDD Patterns）

| 維度 | 內容 |
|------|------|
| **關係類型** | Customer/Supplier + Event-Driven |
| **上游（Supplier）** | `content`：定義 `content.page_approved` 事件契約 |
| **下游（Customer）** | `workspace-flow`：消費事件並實體化業務實體 |
| **整合機制** | `shared` 模組 Event Store（`EventRecord` + `PublishDomainEventUseCase`） |
| **溯源機制** | `causationId` + `correlationId` + `sourceReference` |

---

## 取捨與影響

### 優點

- **業務正確性保障**：`workspace-flow` 強狀態機（Task/Invoice 生命週期）受到保護，不會被 AI 幻覺污染。
- **人機協作（Human-in-the-loop）**：提供明確的「審閱 → 核准 → 實體化」三步驟，確保業務人員對所有任務/發票的建立具有最終控制權。
- **完整上下文溯源**：每個 Task/Invoice 都能透過 `sourceReference` 追溯到原始合約頁面，支援稽核與爭議解決。
- **解耦 AI 攝入與核心業務**：`py_fn/` 攝入管線只需寫入 `content`，不需了解 `workspace-flow` 的內部結構。

### 缺點

- **非同步複雜性**：需要實作 Event Bus 或 Process Manager 處理事件的非同步傳遞，增加基礎設施複雜度。
- **兩階段 UI 流程**：前端需處理「審閱草稿（content）→ 確認產生任務/發票（workspace-flow）」兩個獨立步驟，UX 設計複雜度增加。
- **最終一致性（Eventual Consistency）**：核准事件至任務建立之間可能存在短暫延遲。

### 被否決的方案

| 方案 | 否決原因 |
|------|---------|
| AI 解析後直接寫入 `workspace-flow` | 容錯率低，業務錯誤難以撤銷，丟失合約上下文 |
| `workspace-flow` 直接讀取 `content` 的 domain 層 | 違反 MDDD 邊界規則（禁止跨模組 domain 層直接 import） |
| `content` 直接呼叫 `workspace-flow` Server Action | 同步耦合，無法保留事件溯源，破壞模組邊界 |

---

## 後續行動

| 優先級 | 行動項目 | 負責模組 | 計畫版本 |
|--------|---------|---------|---------|
| 🔴 高 | 在 `content` 模組新增 `ApproveContentPageUseCase` | `content` | v1.1 |
| 🔴 高 | 在 `content/domain/events` 完善 `ContentPageApprovedEvent` 介面定義（含 actorId、causationId、correlationId） | `content` | v1.1 |
| 🔴 高 | 實作 `contentToWorkflowMaterializer` Process Manager | `workspace-flow` 或 `shared` | v1.1 |
| 🔴 高 | 在 `workspace-flow` 的 Task/Invoice 聚合根新增 `sourceReference` 欄位 | `workspace-flow` | v1.1 |
| 🟡 中 | 建立 `modules/content/api/events.ts` 匯出事件契約供跨模組訂閱 | `content` | v1.1 |
| 🟡 中 | 建立 `modules/workspace-flow/api/listeners.ts` 定義事件監聽介面 | `workspace-flow` | v1.1 |
| 🟡 中 | UI 審閱流程納入 Tasks Tab 的 UI Steps（審閱 → 批准 → 實體化） | `workspace-flow` interfaces | v1.1 |
| 🟢 低 | `content` Database Block 新增 `workflow-ref` BlockType，透過 Read Model 嵌入任務狀態 | `content` | v1.2 |

---

## 相關文件

- [`context-map.md`](../context-map.md) — 上下文關係圖（content → workspace-flow Customer/Supplier 關係）
- [`domain-events.md`](../domain-events.md) — `content.page_approved` 事件完整定義
- [`bounded-contexts.md`](../bounded-contexts.md) — content Buffer Zone 與 workspace-flow Source of Truth 描述
- [`domain-services.md`](../domain-services.md) — `contentToWorkflowMaterializer` Process Manager 設計
- [`use-cases.md`](../use-cases.md) — `ApproveContentPageUseCase` 與 `MaterializeTasksFromContentUseCase`
- [`workspace-ui-gap-analysis.md`](../workspace-ui-gap-analysis.md) — UI 審閱流程缺口分析
