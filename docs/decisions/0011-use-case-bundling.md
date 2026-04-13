# 0011 Use Case Bundling and Query-Command Mixing

- Status: Accepted
- Date: 2026-04-13

## Context

架構規範要求 use-case 文件遵守以下兩個原則：

1. **一個文件一個 use-case**：文件名為 `verb-noun.use-case.ts`，只包含一個 `export class`。
2. **命令與查詢分離（CQS）**：命令 use-case 文件（`VerbNounUseCase`）不包含查詢類別；查詢類別放在 `application/queries/` 目錄。

掃描後發現兩類違規：

### 違規一：多類別 use-case 捆綁（Multi-Class Bundle）— 30 個文件

單一 `.use-cases.ts` 文件包含 3–6 個 use-case class，實際上是「分組容器」而非獨立 use-case：

**platform 域（13 個文件）**

| 文件 | Class 數 |
|------|---------|
| `platform/subdomains/account/application/use-cases/account.use-cases.ts` | 6 |
| `platform/subdomains/identity/application/use-cases/identity.use-cases.ts` | 5 |
| `platform/subdomains/entitlement/application/use-cases/entitlement.use-cases.ts` | 5 |
| `platform/subdomains/subscription/application/use-cases/subscription.use-cases.ts` | 5 |
| `platform/subdomains/organization/application/use-cases/organization-member.use-cases.ts` | 4 |
| `platform/subdomains/organization/application/use-cases/organization-lifecycle.use-cases.ts` | 4 |
| `platform/subdomains/access-control/application/use-cases/access-control.use-cases.ts` | 4 |
| `platform/subdomains/background-job/application/use-cases/ingestion.use-cases.ts` | 3 |
| `platform/subdomains/team/application/use-cases/team.use-cases.ts` | 3 |
| `platform/subdomains/account/application/use-cases/account-policy.use-cases.ts` | 3 |
| `platform/subdomains/notification/application/use-cases/notification.use-cases.ts` | 3 |
| `platform/subdomains/organization/application/use-cases/organization-policy.use-cases.ts` | 3 |
| `platform/subdomains/organization/application/use-cases/organization-team.use-cases.ts` | 3 |

**notion 域（11 個文件）**

| 文件 | Class 數 |
|------|---------|
| `notion/subdomains/knowledge/application/use-cases/manage-knowledge-collection.use-cases.ts` | 6 |
| `notion/subdomains/collaboration/application/use-cases/manage-comment.use-cases.ts` | 5 |
| `notion/subdomains/knowledge/application/use-cases/manage-knowledge-page.use-cases.ts` | 5 |
| `notion/subdomains/authoring/application/use-cases/manage-article-lifecycle.use-cases.ts` | 4 |
| `notion/subdomains/authoring/application/use-cases/manage-category.use-cases.ts` | 4 |
| `notion/subdomains/database/application/use-cases/manage-database.use-cases.ts` | 4 |
| `notion/subdomains/database/application/use-cases/manage-record.use-cases.ts` | 3 |
| `notion/subdomains/database/application/use-cases/manage-automation.use-cases.ts` | 3 |
| `notion/subdomains/taxonomy/application/use-cases/manage-taxonomy.use-cases.ts` | 4 |
| `notion/subdomains/relations/application/use-cases/manage-relation.use-cases.ts` | 4 |
| `notion/subdomains/database/application/use-cases/manage-view.use-cases.ts` | 3 |

**workspace 域（4 個文件）**

| 文件 | Class 數 |
|------|---------|
| `workspace/subdomains/feed/application/use-cases/workspace-feed-interaction.use-cases.ts` | 4 |
| `workspace/subdomains/scheduling/application/work-demand.use-cases.ts` | 4 |
| `workspace/subdomains/knowledge/application/use-cases/review-knowledge-page.use-cases.ts` | 4 |
| `workspace/subdomains/feed/application/use-cases/workspace-feed-post.use-cases.ts` | 3 |

**notebooklm 域（2 個文件）**

| 文件 | Class 數 |
|------|---------|
| `notebooklm/subdomains/source/application/use-cases/source-pipeline.use-cases.ts` | 2 |

---

### 違規二：命令 use-case 文件 re-export 查詢類別（8 處）

下列 `manage-*.use-cases.ts` 或 `*.use-cases.ts` 文件使用 `export {...} from "../queries/..."` 將查詢類別重新暴露，混淆了命令與查詢責任界線：

| 文件 | Re-export 查詢 |
|------|--------------|
| `notion/knowledge/use-cases/manage-knowledge-page.use-cases.ts` | `GetKnowledgePageUseCase`, `ListKnowledgePagesUseCase`, `GetKnowledgePageTreeUseCase` 等 5 個 |
| `notion/database/use-cases/manage-database.use-cases.ts` | `GetDatabaseUseCase`, `ListDatabasesUseCase` |
| `notion/database/use-cases/manage-view.use-cases.ts` | `ListViewsUseCase` |
| `notion/database/use-cases/manage-record.use-cases.ts` | `ListRecordsUseCase` |
| `notion/database/use-cases/manage-automation.use-cases.ts` | `ListAutomationsUseCase` |
| `platform/notification/use-cases/notification.use-cases.ts` | `GetNotificationsForRecipientUseCase`, `GetUnreadCountUseCase` |
| `platform/subscription/use-cases/subscription.use-cases.ts` | `GetActiveSubscriptionUseCase`（混在命令類別中） |
| `platform/background-job/use-cases/ingestion.use-cases.ts` | `ListWorkspaceIngestionJobsUseCase`（混在命令類別中） |

---

### 危害分析

- **可測試性下降**：6 個 class 共用一個 Jest 文件，測試文件也被迫捆綁，coverage 難以追蹤。
- **單一職責違反**：`manage-comment.use-cases.ts` 同時負責 Create/Update/Resolve/Delete + List，任何需求變更都打開同一文件。
- **查詢 use-case 暴露路徑不一致**：部分查詢從 `api/` re-export，部分藏在命令文件的 re-export 中，消費方無法依賴一致的 import 路徑。
- **命名格式違反**：`manage-*.use-cases.ts` 不符合 `verb-noun.use-case.ts` 格式規範（archive、manage 屬於非具體動詞）。

## Decision

確立以下規則：

1. **每個 use-case 文件只含一個 class**，命名格式 `verb-noun.use-case.ts`（例如 `create-workspace.use-case.ts`）。
2. **命令 use-case 文件禁止 re-export 查詢類別**。查詢類別只從 `application/queries/` 目錄發布，並由 `api/index.ts` 選擇性 re-export。
3. **查詢類別命名**：`GetXxxUseCase` / `ListXxxUseCase` 若只做純讀取（無業務邏輯），應改為 QueryHandler 並放入 `application/queries/`，命名為 `get-xxx.queries.ts` / `list-xxx.queries.ts`。
4. **過渡期容忍**：既有 `*.use-cases.ts` 多類別文件允許在當前版本中保留，但新增 use-case 必須遵守一文件一類別規則。

### 分批拆分路徑

| 優先 | 域 | 行動 |
|------|----|------|
| 高 | notion/knowledge `manage-knowledge-page.use-cases.ts` (5 classes) | 拆成 5 個獨立文件，queries re-export 移除 |
| 高 | platform/account `account.use-cases.ts` (6 classes) | 拆成 6 個獨立文件 |
| 中 | platform/subscription `subscription.use-cases.ts` — `GetActiveSubscriptionUseCase` | 移至 `queries/get-active-subscription.queries.ts` |
| 中 | platform/background-job `ingestion.use-cases.ts` — `ListWorkspaceIngestionJobsUseCase` | 移至 `queries/list-ingestion-jobs.queries.ts` |
| 低 | 其餘 manage-*.use-cases.ts | 按功能逐步拆分 |

## Consequences

正面影響：

- 每個文件責任邊界清晰，Git blame / code review 更準確。
- 命令與查詢可獨立測試、獨立擴展。
- api/index.ts 可精確控制對外暴露的 use-case 表面積。

代價與限制：

- 拆分 30 個 multi-class 文件需同步更新所有 `import` 路徑（包括 api/index.ts barrel、composition root）。
- `manage-*.use-cases.ts` 的 backward-compat re-export 路徑需要版本窗口確保消費方無感遷移。

## Conflict Resolution

- 拆分時若舊 `manage-*.use-cases.ts` 已在多個 composition root import，可先保留舊文件作為 re-export barrel（只做 `export {...} from "./split-file"`），待消費方全部切換後再移除。
- 查詢類別從命令文件移除後，api/index.ts 需直接從 `application/queries/` import，確保對外合約不中斷。
