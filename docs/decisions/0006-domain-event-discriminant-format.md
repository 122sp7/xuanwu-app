# 0006 Domain Event Discriminant Format

- Status: Accepted
- Date: 2026-04-13

## Context

架構指引要求 domain event discriminant 遵守格式 `<module-name>.<subdomain>.<action>`，其中 action 部分必須使用 **kebab-case**（例如 `platform.identity.signed-in`）。但掃描後發現三類格式偏差，影響全庫共 112 處 domain event 類型宣告：

### 偏差一：action 部分使用 snake_case（83 處）

`snake_case` 出現在以下 24 個事件文件中，覆蓋所有四個主域：

| 主域 | 受影響文件 |
|------|-----------|
| platform | `access-control/domain/events/AccessPolicyDomainEvent.ts` |
| platform | `account/domain/events/AccountDomainEvent.ts` |
| platform | `background-job/domain/events/BackgroundJobDomainEvent.ts` |
| platform | `identity/domain/events/IdentityDomainEvent.ts` |
| platform | `notification/domain/events/NotificationDomainEvent.ts` |
| platform | `organization/domain/events/OrganizationDomainEvent.ts` |
| platform | `subscription/domain/events/SubscriptionDomainEvent.ts` |
| workspace | `audit/domain/events/AuditDomainEvent.ts` |
| workspace | `workspace-workflow/domain/events/InvoiceEvent.ts` |
| workspace | `workspace-workflow/domain/events/IssueEvent.ts` |
| workspace | `workspace-workflow/domain/events/TaskEvent.ts` |
| notion | `authoring/domain/events/AuthoringEvents.ts` |
| notion | `collaboration/domain/events/CollaborationEvents.ts` |
| notion | `database/domain/events/DatabaseEvents.ts` |
| notion | `knowledge/domain/events/KnowledgeBlockEvents.ts` |
| notion | `knowledge/domain/events/KnowledgeCollectionEvents.ts` |
| notion | `knowledge/domain/events/KnowledgePageEvents.ts` |
| notion | `relations/domain/events/RelationEvents.ts` |
| notion | `taxonomy/domain/events/TaxonomyEvents.ts` |
| notebooklm | `conversation/domain/events/ConversationEvents.ts` |
| notebooklm | `notebook/domain/events/NotebookEvents.ts` |
| notebooklm | `source/domain/events/SourceEvents.ts` |
| notebooklm | `synthesis/domain/events/EvaluationEvents.ts` |
| notebooklm | `synthesis/domain/events/SynthesisPipelineDomainEvent.ts` |

範例（snake_case 違規 → 應改為 kebab-case）：

```
"platform.identity.signed_in"         → "platform.identity.signed-in"
"platform.account.profile_updated"    → "platform.account.profile-updated"
"platform.access_policy.created"      → "platform.access-control.created"
"notion.knowledge.page_created"       → "notion.knowledge.page-created"
"notebooklm.synthesis.query_submitted" → "notebooklm.synthesis.query-submitted"
"workspace.audit.entry_recorded"      → "workspace.audit.entry-recorded"
```

### 偏差二：team 子域事件缺少主域前綴（4 處）

`modules/platform/subdomains/team/domain/events/OrganizationTeamDomainEvent.ts` 中四個事件使用 `team.*` 而非 `platform.team.*`：

```
"team.created"        → "platform.team.created"
"team.deleted"        → "platform.team.deleted"
"team.member-added"   → "platform.team.member-added"
"team.member-removed" → "platform.team.member-removed"
```

### 偏差三：workspace-workflow 事件使用 workspace-flow 縮寫前綴（25 處）

`modules/workspace/subdomains/workspace-workflow/domain/events/` 中所有事件使用 `workspace-flow.*` 前綴，與主域路徑 `workspace.workspace-workflow.*` 不一致：

```
"workspace-flow.task.created"     → "workspace.workspace-workflow.task-created"
"workspace-flow.invoice.approved" → "workspace.workspace-workflow.invoice-approved"
"workspace-flow.issue.opened"     → "workspace.workspace-workflow.issue-opened"
```

## Decision

確立以下全庫 domain event discriminant 格式規則，作為後續修復的唯一基準：

```
<main-domain>.<subdomain>.<action>
```

格式約束：

1. **主域前綴**：必須是四個主域之一（`platform`、`workspace`、`notion`、`notebooklm`）。
2. **子域段**：與 `modules/<main-domain>/subdomains/<subdomain>/` 路徑一致，使用 **kebab-case**。
3. **action 段**：使用 **kebab-case**，不允許 `snake_case` 或 `PascalCase`。
4. **三段結構**：格式固定為三段，不允許省略主域前綴或子域段。

正確範例：

```
platform.identity.signed-in
platform.team.member-added
platform.access-control.policy-created
workspace.workspace-workflow.task-created
workspace.audit.entry-recorded
notion.knowledge.page-created
notebooklm.synthesis.query-submitted
```

## Consequences

正面影響：

- 所有 domain event 可以透過主域前綴在 event bus 做一致的路由與訂閱過濾。
- 不再需要用不同命名規則判斷事件來源。
- 工具自動化（訂閱規則、QStash routing）可以依賴一致格式。

代價與限制：

- 需要同步修改 112 個 discriminant 值，並更新所有消費方的 switch/case 與型別衛語句。
- `workspace-flow.*` 的修改會觸及 listeners、facades 與測試合約，需要版本協議窗口。
- 建議以 subdomain 為單位分批遷移，每批修改後執行 `npm run build && npm run lint` 驗證。

## Conflict Resolution

- 若現有消費方（py_fn 訂閱器、QStash 路由）使用 `snake_case` 鍵，遷移期間需同時保留舊值為 alias，在新版確認無消費後才移除。
- `workspace-flow` 縮寫前綴遷移至 `workspace.workspace-workflow` 為破壞性變更，需事先對齊 py_fn 與任何外部訂閱合約。
