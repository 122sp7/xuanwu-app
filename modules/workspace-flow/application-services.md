# workspace-flow — Application Services

> **Canonical bounded context:** `workspace-flow`
> **模組路徑:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-flow` 的 application layer 服務與 use cases。內容與 `modules/workspace-flow/application/` 實作保持一致。

## Application Layer 職責

管理 Task / Issue / Invoice 三條工作流程狀態機與流程物化。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/add-invoice-item.dto.ts`
- `application/dto/create-task.dto.ts`
- `application/dto/invoice-query.dto.ts`
- `application/dto/issue-query.dto.ts`
- `application/dto/materialize-from-knowledge.dto.ts`
- `application/dto/open-issue.dto.ts`
- `application/dto/pagination.dto.ts`
- `application/dto/remove-invoice-item.dto.ts`
- `application/dto/resolve-issue.dto.ts`
- `application/dto/task-query.dto.ts`
- `application/dto/update-invoice-item.dto.ts`
- `application/dto/update-task.dto.ts`
- `application/ports/InvoiceService.ts`
- `application/ports/IssueService.ts`
- `application/ports/TaskService.ts`
- `application/process-managers/knowledge-to-workflow-materializer.ts`
- `application/use-cases/add-invoice-item.use-case.ts`
- `application/use-cases/approve-invoice.use-case.ts`
- `application/use-cases/approve-task-acceptance.use-case.ts`
- `application/use-cases/archive-task.use-case.ts`
- `application/use-cases/assign-task.use-case.ts`
- `application/use-cases/close-invoice.use-case.ts`
- `application/use-cases/close-issue.use-case.ts`
- `application/use-cases/create-invoice.use-case.ts`
- `application/use-cases/create-task.use-case.ts`
- `application/use-cases/fail-issue-retest.use-case.ts`
- `application/use-cases/fix-issue.use-case.ts`
- `application/use-cases/materialize-tasks-from-knowledge.use-case.ts`
- `application/use-cases/open-issue.use-case.ts`
- `application/use-cases/pass-issue-retest.use-case.ts`
- `application/use-cases/pass-task-qa.use-case.ts`
- `application/use-cases/pay-invoice.use-case.ts`
- `application/use-cases/reject-invoice.use-case.ts`
- `application/use-cases/remove-invoice-item.use-case.ts`
- `application/use-cases/resolve-issue.use-case.ts`
- `application/use-cases/review-invoice.use-case.ts`
- `application/use-cases/start-issue.use-case.ts`
- `application/use-cases/submit-invoice.use-case.ts`
- `application/use-cases/submit-issue-retest.use-case.ts`
- `application/use-cases/submit-task-to-qa.use-case.ts`
- `application/use-cases/update-invoice-item.use-case.ts`
- `application/use-cases/update-task.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-flow/README.md`
- 模組 AGENT：`../../../modules/workspace-flow/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-flow/application-services.md`
