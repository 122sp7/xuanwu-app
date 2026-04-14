# 1402 Dependency Leakage — Use-case class names exported from `platform/api`

- Status: Resolved
- Resolved: 2026-04-14
- Date: 2026-04-14
- Category: Architectural Smells > Dependency Leakage

## Context

ADR 1400 記錄了 15 個 `api/index.ts` 使用 `export * from "../application"` 的問題，
並確立了「use-case class 不應出現在 api/ 邊界」的原則。

然而即使在 ADR 1400 Accepted 之後，`platform/api/index.ts` 仍然透過**顯式具名 export**
將 17 個 use-case class 直接暴露在 platform 主域的公開能力邊界：

```typescript
// modules/platform/api/index.ts (lines 87–103) — organization subdomain
export {
  organizationService,
  // ... service facade functions ...
  CreateOrganizationUseCase,
  CreateOrganizationWithTeamUseCase,
  UpdateOrganizationSettingsUseCase,
  DeleteOrganizationUseCase,
  InviteMemberUseCase,
  RecruitMemberUseCase,
  RemoveMemberUseCase,
  UpdateMemberRoleUseCase,
  CreateTeamUseCase,
  DeleteTeamUseCase,
  UpdateTeamMembersUseCase,
  CreatePartnerGroupUseCase,
  SendPartnerInviteUseCase,
  DismissPartnerMemberUseCase,
  CreateOrgPolicyUseCase,
  UpdateOrgPolicyUseCase,
  DeleteOrgPolicyUseCase,
} from "../subdomains/organization/api";
```

另外，兩個子域仍使用 wildcard re-export（涵蓋 application 層的所有符號）：

```typescript
// platform/subdomains/access-control/api/index.ts
export * from "../application";  // 包含 use-case classes

// platform/subdomains/account/api/index.ts
export * from "../application";  // 包含 use-case classes
```

### 問題分析

#### 為何 use-case class 不應出現在 api/ 邊界

Use-case class（`CreateOrganizationUseCase` 等）是 **application 層的內部實作單元**：
- 它們由 **composition root**（`interfaces/composition/organization-service.ts`）負責實例化和注入依賴。
- 消費者應呼叫 `organizationService.createOrganization(input)` 取得功能，而非 `new CreateOrganizationUseCase(repo, events)` 自行實例化。
- Use-case class 的 **constructor 簽名**是 infrastructure 依賴的細節（Repository、EventPublisher），不應成為公開合約的一部分。

#### 具體危害

1. **繞過 Composition Root 的風險**：消費者可以直接 `new CreateOrganizationUseCase(...)` 繞過依賴注入，
   自行提供 mock repository，導致應用在生產環境使用不正確的依賴。

2. **Constructor 簽名成為 breaking change**：若 use-case 重構需要新增一個依賴（如事件發布者），
   constructor 簽名改變會透過 `api/index.ts` 擴散為 platform 公開邊界的 breaking change。

3. **版本合約不穩定**：use-case 命名反映內部技術決策（`CreateOrganizationWithTeamUseCase`），
   而非穩定的業務能力名稱。任何 internal refactor（合并、拆分）都需要所有消費者同步更新。

4. **測試污染**：若消費者在測試中直接 `import { CreateOrganizationUseCase }` 做 spy/mock，
   測試耦合了 use-case 的具體 class，而非 service facade 的 function 合約。

#### 當前違規清單

| 位置 | 洩漏類型 | 暴露內容 |
|------|----------|----------|
| `platform/api/index.ts:87–103` | 顯式具名 export | 17 個 organization use-case classes |
| `access-control/api/index.ts:4` | `export * from "../application"` | access-control use-case classes（數量待確認） |
| `platform/subdomains/account/api/index.ts:10` | `export * from "../application"` | account use-case classes（數量待確認） |

## Decision

1. **從 `platform/api/index.ts` 移除所有 use-case class 具名 export**：
   - 移除 17 個 `*UseCase` 具名 export（lines 87–103）
   - 保留 service facade functions（`organizationService`、`createOrganization` 等）和型別（`OrganizationEntity` 等）
   
2. **修正 `access-control/api/index.ts` 和 `account/api/index.ts` 的 wildcard export**：
   - 以精確 `export { ... }` 替換 `export * from "../application"`
   - 只 export 公開需要的 service facade functions 和 DTO types
   - Use-case class 本身不列入精確 export

3. **確認沒有外部消費者依賴 use-case class 本身**：
   - 若有消費者（如 `interfaces/composition/` 的 factory）需要 use-case class，
     它們應直接從 `../subdomains/organization/api` 或 `../interfaces/composition/` import，
     而非透過 `platform/api` 的公開邊界

4. **遷移優先級**：platform organization（17 個 class，影響最廣）優先

## Consequences

正面：
- `platform/api/index.ts` 的公開合約穩定：重構 use-case constructor 不影響 api 邊界消費者。
- Composition Root 是唯一知道 use-case class 的地方，依賴注入邊界清晰。

代價：
- 若有外部測試文件直接 `import { CreateOrganizationUseCase }` from `platform/api`，
  需要調整 import 路徑（可能指向 `platform/subdomains/organization/api` 或直接 application 路徑）。
- 需要確認 organization subdo API 中 service facade functions 是否已覆蓋所有消費者需要的功能，
  否則需補充 facade functions 後再移除 class exports。

## 關聯 ADR

- **1400** (Dependency Leakage)：本 ADR 是 ADR 1400 的具體 sub-case，針對 platform organization 子域的明確實例
- **2100** (Tight Coupling)：platform/api monolith 造成的廣泛依賴，use-case class 暴露加劇此問題
- **4100** (Change Amplification)：use-case class export 讓 application 重構自動成為 api 邊界的 breaking change

## Resolution

Removed all 17 UseCase class name exports from:
- `modules/platform/subdomains/organization/api/index.ts` — removed 5 export blocks (CreateOrganizationUseCase, CreateOrganizationWithTeamUseCase, UpdateOrganizationSettingsUseCase, DeleteOrganizationUseCase, InviteMemberUseCase, RecruitMemberUseCase, RemoveMemberUseCase, UpdateMemberRoleUseCase, CreateTeamUseCase, DeleteTeamUseCase, UpdateTeamMembersUseCase, CreatePartnerGroupUseCase, SendPartnerInviteUseCase, DismissPartnerMemberUseCase, CreateOrgPolicyUseCase, UpdateOrgPolicyUseCase, DeleteOrgPolicyUseCase)
- `modules/platform/api/index.ts` — removed all 17 names from the organization re-export block

No external consumers of these class names were found. organizationService facade functions remain accessible.
