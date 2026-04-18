# 4203 Inconsistency — UUID v7 (`generateId`) 廣泛使用於 application 與 infrastructure 層

- Status: Accepted
- Date: 2026-04-14
- Category: Maintainability Smells > Inconsistency
- Extends: ADR 4202 (workspace.events.ts UUID v7 → v4)

## Context

ADR 4202 修正了 `workspace/domain/events/workspace.events.ts` 中的 UUID v7 用法，
使該檔案符合全 repo domain 層使用 v4 的規範。

然而，掃描 `application/` 與 `infrastructure/` 層後發現，更大範圍的 v7 使用問題仍然存在：
23 個檔案中將 `import { v7 as generateId } from "@infra/uuid"` 用於 entity/document ID 生成，
部分甚至在 **application use-case** 層（理論上應與 UUID strategy 無關的業務流程層）。

### 違規清單（23 個檔案）

#### workspace/subdomains/workspace-workflow — application 層（1）

```
workspace-workflow/application/use-cases/submit-task-materialization-batch-job.use-case.ts
```

#### workspace/subdomains/workspace-workflow — infrastructure 層（5）

```
FirebaseTaskRepository.ts
FirebaseTaskMaterializationBatchJobRepository.ts
FirebaseInvoiceRepository.ts
FirebaseIssueRepository.ts
FirebaseInvoiceItemRepository.ts (uses v7 via another file — indirect)
```

#### workspace/subdomains/feed — infrastructure 層（2）

```
FirebaseWorkspaceFeedInteractionRepository.ts
FirebaseWorkspaceFeedPostRepository.ts
```

#### notion/subdomains/knowledge — application 層（4）

```
content-block.queries.ts
review-knowledge-page.use-cases.ts
manage-knowledge-page.use-cases.ts
manage-knowledge-collection.use-cases.ts
```

#### notion/subdomains/authoring — application 層（2）

```
manage-category.use-cases.ts
manage-article-lifecycle.use-cases.ts
```

#### notion/infrastructure — firebase 層（7）

```
FirebaseContentBlockRepository.ts
FirebaseKnowledgePageRepository.ts
FirebaseAutomationRepository.ts
FirebaseViewRepository.ts
FirebaseDatabaseRecordRepository.ts
FirebaseVersionRepository.ts
FirebasePermissionRepository.ts
FirebaseCommentRepository.ts
```

#### notebooklm/infrastructure — firebase 層（1）

```
FirebaseRagQueryFeedbackAdapter.ts
```

### 根本原因

ADR 4202 只針對 domain event factory 函數中的 eventId 生成（`uuid()` 語意明確），
未涵蓋 document/entity ID 生成場景。

部分開發者選擇 v7（時序排序 UUID）以獲得 Firestore 查詢效能優勢（按插入時間排序），
但這一決策：
1. 從未被記錄為正式 architectural decision
2. 與 ADR 4101（全 repo domain 層統一 v4）規範衝突
3. 在 application 層（should be pure logic）中引入了 Firestore 效能考量（storage concern）

## Problem

- **Inconsistency**: 全 repo 23 個 application/infrastructure 檔案使用 v7，
  其餘所有 domain aggregates 使用 v4（品牌型別 uuid），形成雙軌標準。
- **ADR compliance gap**: ADR 4101 明確規定「domain 與 application 層只使用 v4」，
  v7 在 application use-case 中屬於明確違規。
- **Cross-layer concern leakage**: 在 application use-case 中使用 v7 意味著將
  「Firestore sorted query performance」這個 infrastructure concern 帶入業務流層。

## Decision

1. **Application 層**（`application/use-cases/`, `application/queries/`）中的 `v7 as generateId`
   必須更換為 `v4 as uuid`（符合 ADR 4101）：
   - `submit-task-materialization-batch-job.use-case.ts`
   - notion/knowledge 4 個 use-case/query 檔案
   - notion/authoring 2 個 use-case 檔案

2. **Infrastructure 層**（Firebase repos）是否統一到 v4，需先確認：
   - Firestore collection 是否有依賴 UUID 時序排序的 composite index query
   - 若有：保留 v7 並記錄為「infrastructure-local UUID strategy」，在 ADR 4204 中確立
   - 若無：一律改為 v4

3. **優先處理 application 層**（7 個 use-case 檔案），infrastructure 層在確認 index 影響後另行遷移。

## Consequences

正面：
- Application 層 UUID 策略完全符合 ADR 4101 規範。
- 消除 application use-case 中對 Firestore 效能策略的隱式依賴。

代價：
- Infrastructure 層若有 v7 時序排序依賴，需補充說明（ADR 4204）或留下 TODO 標記。
- 修改 infrastructure 層 ID 生成不影響業務邏輯，但 migration script 需注意歷史記錄格式不變。

## 關聯 ADR

- **ADR 4202** (Inconsistency — UUID v7 in workspace.events.ts) — 先驅修復
- **ADR 4101** (Change Amplification — UUID strategy → @infra/uuid) — 規範根源
- **ADR 4200** (Inconsistency) — 系列入口文件
