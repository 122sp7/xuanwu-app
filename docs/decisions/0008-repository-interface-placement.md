# 0008 Repository Interface Placement

- Status: Accepted
- Date: 2026-04-13

## Context

DDD Hexagonal Architecture 要求 domain layer 只定義**端口（port）介面**，由 infrastructure layer 實作。端口可以是 repository interface、gateway interface 或任何驅動端 / 被驅動端抽象。

掃描後發現 domain 層存在兩套並行的端口放置慣例：

### 慣例 A：`domain/repositories/` 目錄（23 個子域）

沿用 DDD 傳統命名，將 repository interface 放在 `domain/repositories/`：

```
platform/subdomains/account/domain/repositories/AccountRepository.ts
platform/subdomains/entitlement/domain/repositories/EntitlementGrantRepository.ts
platform/subdomains/access-control/domain/repositories/AccessPolicyRepository.ts
platform/subdomains/subscription/domain/repositories/SubscriptionRepository.ts
workspace/subdomains/workspace-workflow/domain/repositories/...
notion/subdomains/knowledge/domain/repositories/...
```

### 慣例 B：`domain/ports/` 目錄（24 個子域）

較新的子域使用 Hexagonal Architecture 的 port 術語，將所有端口（包括 repository、gateway、event publisher）放在 `domain/ports/`：

```
platform/subdomains/organization/domain/ports/OrganizationTeamPort.ts
platform/subdomains/organization/domain/ports/OrganizationTeamPort.ts
notebooklm/subdomains/source/domain/ports/KnowledgePageGatewayPort.ts
workspace/subdomains/workspace-workflow/domain/ports/...
```

### 混用問題

部分子域（如 `workspace/subdomains/workspace-workflow/`）同時存在 `domain/repositories/` 與 `domain/ports/`，造成：

- 開發者不清楚新的端口應放哪個目錄。
- ESLint 邊界規則難以同時覆蓋兩個路徑。
- `api/index.ts` re-export 時有時從 `domain/repositories`、有時從 `domain/ports` import，增加合約不穩定性。

### 補充發現：inline port interface

`modules/workspace/api/runtime/factories.ts` 中定義了 `OrganizationDirectoryGateway` 作為 inline interface，這個 port 沒有放在任何 `domain/ports/` 或 `domain/repositories/` 目錄，違反了端口定義必須在 domain 層的規則（見 ADR 0007）。

## Decision

採用以下規則，統一全庫端口放置位置：

1. **Repository interface** → 放在 `domain/repositories/`，命名 `PascalCaseRepository`（無 I 前綴）。
2. **Non-repository port**（Gateway、Publisher、Adapter port）→ 放在 `domain/ports/`，命名 `PascalCasePort` 或 `PascalCaseGateway`。
3. **禁止 inline port**：所有端口 interface 必須在 domain 層獨立文件中定義，不允許在 api/ 或 application/ 內定義 inline interface。
4. **`domain/ports/` 與 `domain/repositories/` 可以共存**：若子域同時有 repository 與 gateway port，兩個目錄都允許存在。
5. **禁止在 `domain/ports/` 放 repository interface**，反之亦然（不混用）。

### 現有文件遷移規則

| 現況 | 行動 |
|------|------|
| `domain/repositories/*.ts` 中只有標準 CRUD repository interface | 維持不動，符合規則 |
| `domain/ports/*.ts` 中有 repository interface（如 `TeamRepository.ts`）| 可保留，無需移動（符合 ports 廣義定義） |
| `api/runtime/factories.ts` 中的 `OrganizationDirectoryGateway` | 移入 `workspace/domain/ports/OrganizationDirectoryGateway.ts` |
| 同一子域同時有 `domain/repositories/` 和 `domain/ports/` | 確認放置規則：repo → repositories/，non-repo gateway → ports/ |

## Consequences

正面影響：

- 開發者只需看路徑就能判斷端口類型（資料存取 vs. 跨域閘道）。
- ESLint 邊界規則可以精確覆蓋 `domain/repositories/` 和 `domain/ports/` 兩個路徑。
- 減少 api/ 層 inline interface 造成的「端口洩漏」。

代價與限制：

- 需要確認 23 個 `domain/repositories/` 的子域是否混入了 non-repository port，若有則需移至 `domain/ports/`。
- `OrganizationDirectoryGateway` 遷移需同步更新 `workspace/api/runtime/factories.ts` 的 import（見 ADR 0007）。

## Conflict Resolution

- 若舊端口已在 api/index.ts 匯出（例如 `export type { TeamRepository } from "./domain/ports"`），遷移後 re-export 路徑不變；只改動目錄下的物理文件位置，外部合約不受影響。
- 若有消費端直接 import `domain/repositories/` 或 `domain/ports/`（違反 API 邊界），應優先修正消費端改從 `api/` import，再考慮目錄整合。
