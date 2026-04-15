# IAM Module Agent Guide

## Purpose

`src/modules/iam` 等價蒸餾身份與帳號治理能力：
identity（主體）、access-control（授權判定）、session（token lifecycle）、authentication（驗證流程）、account（帳號聚合根）、organization（組織 + team）。
**Account 與 Organization 從 `src/modules/platform` 遷入此模組。**

## Boundary Rules

- `domain/` 禁止依賴 Firebase Auth SDK、Firestore SDK、React 或任何外部框架。
- `application/` 只依賴 `domain/` 的 repository + service 抽象。
- Firebase Auth SDK 只能出現在 `adapters/outbound/firebase-auth/`。
- Firestore SDK 只能出現在 `adapters/outbound/firestore/`。
- 外部消費者只透過 `src/modules/iam/index.ts`（具名匯出）存取。
- 所有 barrel 用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾規則

- 保留 identity + access-control + session + authentication 4 個 iam core 概念。
- 保留 account + organization（含 OrganizationTeam）從 platform 遷入的 2 個概念。
- team 已合併進 organization 子域（OrganizationTeam aggregate）。
- AccountProfile 輕量保留為 Account 上的 profile value-object，不獨立子域。
- federation、consent、secret-governance 等 gap subdomains 不進 src/modules/iam。
- `Actor` 是 identity token，不可用 `User` 替代。
- `AccessDecision` 是授權判定結果 token，不可用 `Permission` 或 `Role` 替代。
- `AccountType = "user" | "organization"` 是 Published Language token，不可用 `"personal"` 替代。

## Identifier Naming Rules（嚴格）

- `accountId`：shell route scope identifier（不等於 workspaceId）。
- `organizationId`：org-scoped domain identifier（不取代 shell 的 accountId）。
- `userId`：具體使用者欄位（createdByUserId 等），不混指 actorId。
- `actorId`：audit / event initiator（可能是 userId 或 system actor）。
- `tenantId`：tenant isolation identifier（不等於 workspaceId 或 accountId）。

## Route Here When

- 需要驗證使用者身份（`authenticateActor`）。
- 需要判斷主體是否有權限做某個動作（`authorizeAccess`）。
- 需要建立或撤銷 session（`createSession` / `revokeSession`）。
- 需要從 Firebase token 解析 Actor identity。
- 需要建立或管理帳號（`createAccount` / `updateAccountProfile`）。
- 需要建立或管理組織、邀請成員（`createOrganization` / `inviteOrganizationMember`）。
- 需要建立或管理 team（`createTeam`，team 屬於 Organization）。
- 需要解析 `AccountType`（判斷 personal account 或 organization account）。

## Route Elsewhere When

- 訂閱、配額商業政策 → `src/modules/billing`。
- 工作區角色與 membership → `src/modules/workspace`（消費 actor reference）。
- 跨模組通知發送 → `src/modules/platform`（notification）。
- AI 能力 → `src/modules/ai`。
- 知識內容 → `src/modules/notion`。

## Development Order

```
domain/entities/ + services/ + repositories/ → application/use-cases/ → adapters/outbound/ → adapters/inbound/ → 更新 barrel
```

## Delivery Style

- 優先實作 `authorizeAccess` + `createAccount`（被其他模組最頻繁消費的 gate）。
- `Actor` + `AccessDecision` + `AccountType` 是 Published Language token，跨模組消費時只傳遞這幾個型別。
- `AccessControlService` 與 `AccountGovernanceService` 是 domain services，規則不要讓它們漏入 application 或 UI。
- Firebase Auth token 驗證屬於 adapter 邏輯，不要讓它滲透進 domain 或 application。
- 奧卡姆剃刀：`AccessControlService` 一個 domain service 通常已足夠，不預建 RBAC engine。
