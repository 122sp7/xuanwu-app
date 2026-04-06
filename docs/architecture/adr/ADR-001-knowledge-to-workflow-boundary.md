# ADR-001: knowledge ↔ workspace-flow Boundary

## Status

Accepted

## Date

2026-04-06

## Context

Xuanwu 的知識攝入流程會先把 AI 解析結果寫入 `knowledge` 模組中的 `KnowledgePage` 草稿，再由人工審閱與核准。核准後，部分結構化結果需要被物化為 `workspace-flow` 的 `Task` 與 `Invoice`。

這個流程有三個邊界要求：

1. `knowledge` 保持對知識頁面生命週期的單一所有權。
2. `workspace-flow` 保持對 Task / Invoice 建立規則與持久化的單一所有權。
3. 兩個 bounded context 不得透過直接讀取對方 repository 來耦合。

歷史上曾使用 content-era naming 與 `content → workspace-flow` 說法，但目前現行語意與實作都應以 `knowledge → workspace-flow` 為準。

## Decision

### 1. Integration contract

- 跨模組整合事件使用 `knowledge.page_approved`。
- 事件 payload 至少包含 `pageId`、`workspaceId`、`extractedTasks`、`extractedInvoices`、`actorId`、`causationId`、`correlationId`。

### 2. Ownership split

- `knowledge` 負責：
  - `KnowledgePage` 建立、編輯、審閱、核准
  - `ApproveKnowledgePageUseCase`
  - 發布 `knowledge.page_approved`
- `workspace-flow` 負責：
  - `KnowledgeToWorkflowMaterializer`
  - `MaterializeTasksFromKnowledgeUseCase`
  - `TaskRepository` / `InvoiceRepository` 寫入

### 3. Collaboration model

- `knowledge` 與 `workspace-flow` 之間只透過公開事件契約與 `api/` surface 協作。
- `workspace-flow` 不直接 import `knowledge` 的 repository 或 infrastructure。
- `knowledge` 不直接建立 `Task` 或 `Invoice`。

### 4. Provenance and idempotency

- 由 `knowledge.page_approved` 派生的 `Task` / `Invoice` 必須攜帶 `sourceReference`。
- `sourceReference.type` 固定為 `KnowledgePage`。
- `sourceReference` 需保留 `id`、`causationId`、`correlationId` 以支援稽核與追溯。
- `KnowledgeToWorkflowMaterializer` 以 `causationId` 作為冪等性鍵，避免重複物化。

## Consequences

### Positive

- 邊界清楚：知識審閱與工作流程物化各自由自己的 bounded context 負責。
- 可追溯：Task / Invoice 可回推到來源 `KnowledgePage` 與原始事件。
- 可演進：未來若新增更多下游 consumer，仍可沿用 `knowledge.page_approved` 契約。

### Trade-offs

- 需要維護事件契約與 idempotency 邏輯。
- UI 若要呈現整段 review → approve → materialize 流程，必須組合多個 bounded context 的 read model，而不是假設單一模組全包。

## Implementation anchors

- `modules/knowledge/application/use-cases/knowledge-page.use-cases.ts`
- `modules/workspace-flow/application/process-managers/knowledge-to-workflow-materializer.ts`
- `modules/workspace-flow/application/use-cases/materialize-tasks-from-knowledge.use-case.ts`
- `modules/workspace-flow/api/listeners.ts`