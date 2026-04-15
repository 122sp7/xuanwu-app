# IAM Module

`src/modules/iam` 是蒸餾自 `modules/iam` + `modules/platform`（account / organization）的精簡等價版，以 `src/modules/template` 骨架為基線。
保留 6 個 **core** 子域概念：**identity**（已驗證主體）、**access-control**（授權判定）、**session**（token / session lifecycle）、**authentication**（驗證流程）、**account**（帳號聚合根）、**organization**（組織 + Team）。略過 federation、consent、secret-governance 等 gap subdomains。

## 領域定位

| 項目 | 內容 |
|---|---|
| **DDD 分類** | Core Domain |
| **定位** | 整個系統的「入口與安全層」|
| **核心價值** | 誰可以做什麼（Firebase Auth + RBAC/ABAC + Account + Organization）|
| **不做** | business logic、AI 邏輯、billing |
| **依賴方向** | 所有 domain 都依賴 IAM；IAM 不依賴其他 domain |

## 蒸餾來源

- `modules/iam`（identity + access-control + session + authentication）→ 核心身份治理
- `modules/platform/subdomains/account/` + `modules/platform/subdomains/organization/` → 帳號與組織聚合根

## 目錄結構

```
src/modules/iam/
  index.ts                                    ← 模組對外唯一入口（具名匯出）
  domain/
    index.ts
    entities/
      Actor.ts                                ← 已驗證主體（core identity）
      Session.ts                              ← session lifecycle
      Account.ts                              ← aggregate root（Personal / Organization）
      Organization.ts                         ← org scope + team members
      OrganizationTeam.ts                     ← team（Organization 內部）
    value-objects/
      ActorId.ts
      SessionId.ts
      TenantId.ts
      AccessDecision.ts                       ← allow | deny + reason
      AccountId.ts
      OrganizationId.ts
      TeamId.ts
      AccountType.ts                          ← "user" | "organization"
    services/
      AccessControlService.ts                 ← 授權判定邏輯（domain service）
      AccountGovernanceService.ts             ← 帳號狀態轉換規則（domain service）
    repositories/
      ActorRepository.ts                      ← domain port
      SessionRepository.ts                    ← domain port
      AccountRepository.ts                    ← domain port
      OrganizationRepository.ts               ← domain port
    events/
      ActorAuthenticated.ts
      SessionCreated.ts
      SessionRevoked.ts
      AccessDenied.ts
      AccountCreated.ts
      OrganizationCreated.ts
      TeamCreated.ts
      TeamMemberAdded.ts
  application/
    index.ts
    use-cases/
      authenticate-actor.use-case.ts
      authorize-access.use-case.ts
      create-session.use-case.ts
      revoke-session.use-case.ts
      create-account.use-case.ts
      update-account-profile.use-case.ts
      create-organization.use-case.ts
      invite-organization-member.use-case.ts
      create-team.use-case.ts
    dto/
      ActorDTO.ts
      SessionDTO.ts
      AccessDecisionDTO.ts
      AccountDTO.ts
      OrganizationDTO.ts
      TeamDTO.ts
  adapters/
    inbound/
      index.ts
      http/                                   ← auth callback / account / session endpoints
      rpc/                                    ← tRPC routers
    outbound/
      index.ts
      firebase-auth/
        FirebaseActorAdapter.ts               ← implements ActorRepository
        FirebaseAuthenticationAdapter.ts      ← Firebase sign-in / verify token
      firestore/
        FirestoreSessionAdapter.ts            ← implements SessionRepository
        FirestoreAccountAdapter.ts            ← implements AccountRepository
        FirestoreOrganizationAdapter.ts       ← implements OrganizationRepository
```

## Barrel 結構

| Barrel | 覆蓋範圍 |
|---|---|
| `index.ts` | domain + application 的公開符號 |
| `domain/index.ts` | entities, value-objects, services, repositories, events |
| `application/index.ts` | use-cases + dto |
| `adapters/inbound/index.ts` | http, rpc |
| `adapters/outbound/index.ts` | firebase-auth/, firestore/ |

所有 barrel 使用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾範圍

| src 概念 | 蒸餾自 | 狀態 |
|---|---|---|
| Actor entity | modules/iam/subdomains/identity/domain/ | ✅ 保留 |
| Session entity | modules/iam/subdomains/session/domain/ | ✅ 保留 |
| AccessDecision value-object | modules/iam/subdomains/access-control/domain/ | ✅ 保留 |
| AccessControlService | modules/iam/subdomains/access-control/domain/ | ✅ 保留 |
| Account aggregate | modules/platform/subdomains/account/domain/ | ✅ 遷入（從 platform 移入） |
| Organization + OrganizationTeam | modules/platform/subdomains/organization/domain/ | ✅ 遷入（從 platform 移入） |
| AccountGovernanceService | modules/platform/subdomains/account/domain/ | ✅ 遷入（從 platform 移入） |
| federat ion, consent, secret-governance | gap subdomains | ❌ 跳過 |
| authorization, tenant, security-policy | core-first stubs | ❌ 跳過（待需求） |

## Identifier Contract

| Identifier | 角色 | 說明 |
|---|---|---|
| accountId | shell route scope | `AccountType` 判斷 personal 或 org account |
| organizationId | org-scoped identifier | org / team / relations，不取代 shell accountId |
| userId | 具體使用者 | `createdByUserId`、`verifiedByUserId` 等欄位 |
| actorId | 行為主體 | audit / event initiator，可能是 userId 或 system actor |
| tenantId | tenant isolation | storage path / security rules，不等於 workspaceId |

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

`domain/` 絕對不依賴 Firebase Auth SDK、Firestore SDK 或任何外部框架。

## Published Language Token

`Actor`（不是 `User`）是跨模組存取身份時使用的核心 token。
`AccessDecision`（不是 `Permission` 或 `Role`）是跨模組授權判定結果的 token。
`AccountType = "user" | "organization"`（不是 `"personal"`）是 account scope 判斷的 Published Language token。

## 外部消費方式

```ts
// types（client-safe）
import type { ActorDTO, AccessDecisionDTO, AccountDTO, AccountType, OrganizationDTO } from "@/src/modules/iam";

// server-only
import { authorizeAccess, createSession, createAccount, createOrganization } from "@/src/modules/iam";
```

原始 API 合約參考：`modules/iam/api/index.ts`、`modules/platform/api/index.ts`（account / org）。
