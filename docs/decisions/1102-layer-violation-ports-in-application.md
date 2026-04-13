# 1102 Layer Violation — Port 介面定義於 `application/ports/` 而非 `domain/ports/`

- Status: Accepted
- Date: 2026-04-13
- Category: Architectural Smells > Layer Violation

## Context

Hexagonal Architecture 的 Port 是由 **Domain 層定義**的依賴倒置合約（Dependency Inversion Contract）。
Port 表達「Domain/Application 需要什麼能力」，由 Infrastructure 層的 Adapter 實作。
Port **必須**放在 `domain/ports/`，使 domain 層對外部依賴保持控制。

掃描發現 `workspace/subdomains/workspace-workflow/application/ports/` 放置了 4 個 port 介面：

```
modules/workspace/subdomains/workspace-workflow/application/ports/
  IssueService.ts       ← Port: Issue 操作合約
  InvoiceService.ts     ← Port: Invoice 操作合約
  TaskService.ts        ← Port: Task 操作合約（推測）
  TaskCandidateExtractionAiPort.ts  ← AI 能力 Port
```

### 問題分析

**`IssueService.ts` 內容檢視：**

```typescript
// application/ports/IssueService.ts
import type { Issue } from "../../domain/entities/Issue";
import type { IssueStatus } from "../../domain/value-objects/IssueStatus";
import type { OpenIssueDto } from "../dto/open-issue.dto";
import type { IssueQueryDto } from "../dto/issue-query.dto";

export interface IssueService {
  openIssue(dto: OpenIssueDto): Promise<Issue>;
  transitionStatus(issueId: string, to: IssueStatus): Promise<Issue>;
  listIssues(query: IssueQueryDto): Promise<Issue[]>;
  getIssue(issueId: string): Promise<Issue | null>;
}
```

這個 `IssueService` 是一個 Port（依賴倒置介面），其 Input/Output 型別（`Issue`、`IssueStatus`）都來自 domain 層，
本身就是 domain 關注點的一部分，應定義在 `domain/ports/` 中。

**`TaskCandidateExtractionAiPort.ts` 內容檢視：**

```typescript
// application/ports/TaskCandidateExtractionAiPort.ts
export interface TaskCandidateExtractionAiPort {
  extractTaskCandidates(input: {
    readonly knowledgePageId: string;
    readonly content: string;
    readonly maxCandidates?: number;
  }): Promise<ReadonlyArray<AIExtractedTaskCandidate>>;
}
```

這個 AI 能力 Port 更清楚地屬於 domain 的 Output Port（定義業務流程所需的外部能力），
放在 `application/ports/` 打破了 `domain/ ← infrastructure/` 的依賴方向設計。

### 為何這是 Layer Violation？

| 正確位置 | 錯誤位置 | 問題 |
|----------|----------|------|
| `domain/ports/IssueRepository.ts` | `application/ports/IssueService.ts` | `domain/` 不知道 `application/ports/` 存在，造成隱式耦合 |
| `domain/ports/TaskCandidateExtractionAiPort.ts` | `application/ports/TaskCandidateExtractionAiPort.ts` | Infrastructure adapter 需 import application/ 才能知道要實作什麼 |

Infrastructure 層的 Adapter 必須 implement 某個 Port，如果 Port 定義在 `application/`，
則 `infrastructure/` → `application/` 方向依賴違反了「infrastructure 只依賴 domain ports」的原則。

### 對照正確模式

以下是 workspace-workflow 同域名下的正確 Port 放置：

```
modules/workspace/subdomains/workspace-workflow/domain/ports/   ← 正確：domain ports
  （注意：此目錄目前不存在，說明這些 port 應遷移至此）
```

其他模組的正確範例：

```
modules/notebooklm/subdomains/synthesis/domain/ports/VectorStore.ts   ✅ 正確
modules/notebooklm/subdomains/source/domain/ports/SourceDocumentPort.ts  ✅ 正確
modules/platform/subdomains/ai/domain/ports/   ✅ 正確
```

## Decision

1. **`application/ports/` 不是合法的目錄**：Port 介面必須放在 `domain/ports/`（Output Port）或在 domain 層的 use-case 中宣告（如需要，以 inner interface 形式）。
2. **遷移路徑**：
   - `application/ports/IssueService.ts` → `domain/ports/IssueServicePort.ts`
   - `application/ports/InvoiceService.ts` → `domain/ports/InvoiceServicePort.ts`
   - `application/ports/TaskService.ts` → `domain/ports/TaskServicePort.ts`
   - `application/ports/TaskCandidateExtractionAiPort.ts` → `domain/ports/TaskCandidateExtractionAiPort.ts`
3. **DTO 輸入型別**：若 Port 方法接收 DTO（定義在 `application/dto/`），則該 Port 視為 Application Port，可保留在 `application/`，但必須明確標示為 Application-layer Port，且不被 infrastructure 直接 implement。

## Consequences

正面：
- Infrastructure adapter 只需 import `domain/ports/`，依賴方向回歸正確。
- Domain tests 可以 mock 這些 ports 而不需要 import application 層型別。

代價：
- 4 個 port 文件需移動並更新所有 import 路徑（包含 use-case 和 adapter 文件）。
