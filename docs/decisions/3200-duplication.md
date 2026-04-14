# 3200 Duplication

- Status: Accepted
- Date: 2026-04-13
- Category: Modularity Smells > Duplication

## Context

重複（Duplication）指同一個概念（目錄命名慣例、型別、工具函式）在 codebase 中存在多個不一致的表達方式，造成維護時的判斷成本。

掃描後發現三類重複問題：

### 問題一：`dto` vs `dtos` 目錄命名（13 vs 11 個目錄）

```
# 使用 "dto"（13 目錄）
modules/notebooklm/subdomains/conversation/application/dto/
modules/notebooklm/subdomains/notebook/application/dto/
modules/notebooklm/subdomains/source/application/dto/
modules/notion/subdomains/authoring/application/dto/
modules/notion/subdomains/collaboration/application/dto/
modules/notion/subdomains/knowledge-database/application/dto/
modules/notion/subdomains/knowledge/application/dto/
modules/notion/subdomains/relations/application/dto/
modules/notion/subdomains/taxonomy/application/dto/
modules/workspace/subdomains/audit/application/dto/
modules/workspace/subdomains/feed/application/dto/
modules/workspace/subdomains/scheduling/application/dto/
modules/workspace/subdomains/workspace-workflow/application/dto/

# 使用 "dtos"（11 目錄）
modules/notebooklm/application/dtos/
modules/notion/application/dtos/
modules/platform/application/dtos/
modules/platform/subdomains/access-control/application/dtos/
modules/platform/subdomains/account-profile/application/dtos/
modules/platform/subdomains/account/application/dtos/
modules/platform/subdomains/entitlement/application/dtos/
modules/platform/subdomains/notification/application/dtos/
modules/platform/subdomains/organization/application/dtos/
modules/platform/subdomains/subscription/application/dtos/
modules/workspace/application/dtos/
```

`dto`（單數）vs `dtos`（複數）的混用，造成：
- 開發者不知道新增 DTO 文件應放入哪個命名的目錄
- grep/glob 搜尋需要同時匹配兩種 pattern

### 問題二：use-case 文件放置位置不一致

```
# 正常路徑（30 個子域使用）
modules/*/application/use-cases/

# 異常：use-case 文件直接放在 application/ 根目錄
modules/workspace/subdomains/scheduling/application/work-demand.use-cases.ts
```

`scheduling` 子域將 use-case 放在 `application/` 根（`work-demand.use-cases.ts`），而非標準的 `application/use-cases/` 子目錄。

### 問題三：timestamp/日期工具函式重複定義

```typescript
// modules/platform/domain/services/to-iso-timestamp.ts
export function toIsoTimestamp(value: Date | number): string { ... }

// modules/workspace/domain/aggregates/Workspace.ts (inline)
function createWorkspaceTimestamp(date = new Date()): Timestamp { ... }

// modules/workspace/interfaces/web/components/layout/workspace-detail-helpers.ts
export function formatTimestamp(...) { ... }
```

三個不同的 timestamp 轉換函式，分散在 domain service、aggregate、interfaces 中，每次新增需要時開發者不知道應復用哪個。

## Decision

1. **統一 DTO 目錄命名為 `dto`（單數）**：
   - 理由：subdomain 已採用 `dto`（13 個）；`dtos` 主要出現在 root-level application/ 和 platform subdomains。
   - 遷移：將 `dtos/` 目錄重命名為 `dto/`，更新所有 import 路徑。
2. **use-case 文件統一放入 `application/use-cases/`**：
   - `work-demand.use-cases.ts` 移入 `application/use-cases/` 目錄。
3. **timestamp 工具統一至 shared package**：
   - `toIsoTimestamp` 移至 `packages/` 的 shared utilities，供所有 domain、interfaces 使用。
   - domain 層可引用 shared pure utility（無框架依賴），無 DDD 違規。

## Consequences

正面：
- 目錄命名統一後，新增文件有明確歸屬，不需要判斷應用哪種慣例。
- 工具函式集中後，行為一致性由單一實作保證。

代價：
- 重命名 `dtos/` → `dto/` 涉及約 11 個目錄、大量 import 路徑更新，需要腳本輔助批量替換。
- `work-demand.use-cases.ts` 移動後，確認沒有其他文件透過相對路徑引用該文件位置。
