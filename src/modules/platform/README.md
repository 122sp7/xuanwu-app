# Platform Module

`src/modules/platform` 是蒸餾自 `modules/platform` 的精簡等價版，以 `src/modules/template` 骨架為基線。
保留 3 個 **core** 子域：**account**（帳號聚合根）、**organization**（組織、Team 已合併進此子域）、**notification**（通知路由）。略過 background-job、search、platform-config、observability 等 stub/secondary 子域。

## 蒸餾來源

`modules/platform`（7 個已實作子域，Team 已合併進 organization）→ `src/modules/platform`（3 core）

## 目錄結構

```
src/modules/platform/
  index.ts                                    ← 模組對外唯一入口（具名匯出）
  domain/
    index.ts
    entities/
      Account.ts                              ← aggregate root（Personal / Organization）
      Organization.ts                         ← org scope + team members
      OrganizationTeam.ts                     ← team（Organization 內部）
      NotificationRoute.ts                    ← 通知投遞端點
    value-objects/
      AccountId.ts
      OrganizationId.ts
      TeamId.ts
      AccountType.ts                          ← "user" | "organization"
      NotificationChannelType.ts              ← "email" | "push" | "in-app"
    services/
      AccountGovernanceService.ts             ← 帳號狀態轉換規則
    repositories/
      AccountRepository.ts                    ← domain port
      OrganizationRepository.ts              ← domain port
      NotificationRouteRepository.ts         ← domain port
    events/
      AccountCreated.ts
      OrganizationCreated.ts
      TeamCreated.ts
      TeamMemberAdded.ts
      NotificationSent.ts
  application/
    index.ts
    use-cases/
      create-account.use-case.ts
      update-account-profile.use-case.ts
      create-organization.use-case.ts
      invite-organization-member.use-case.ts
      create-team.use-case.ts
      send-notification.use-case.ts
    dto/
      AccountDTO.ts
      OrganizationDTO.ts
      TeamDTO.ts
      NotificationDTO.ts
  adapters/
    inbound/
      index.ts
      http/                                   ← account / org / notification HTTP endpoints
      rpc/                                    ← tRPC routers
    outbound/
      index.ts
      firestore/
        FirestoreAccountAdapter.ts
        FirestoreOrganizationAdapter.ts
        FirestoreNotificationRouteAdapter.ts
      fcm/
        FcmNotificationAdapter.ts             ← Firebase Cloud Messaging
```

## Barrel 結構

| Barrel | 覆蓋範圍 |
|---|---|
| `index.ts` | domain + application 的公開符號 |
| `domain/index.ts` | entities, value-objects, services, repositories, events |
| `application/index.ts` | use-cases + dto |
| `adapters/inbound/index.ts` | http, rpc |
| `adapters/outbound/index.ts` | firestore/, fcm/ |

所有 barrel 使用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾範圍

| src 概念 | 蒸餾自 modules/platform | 狀態 |
|---|---|---|
| Account aggregate | subdomains/account/domain/ | ✅ 保留 |
| Organization + OrganizationTeam | subdomains/organization/domain/ | ✅ 保留（team 已合併） |
| NotificationRoute | subdomains/notification/domain/ | ✅ 保留 |
| AccountProfile（VO） | subdomains/account（已合併進 account） | ✅ 輕量保留 |
| AccountType = "user" \| "organization" | 跨模組 Published Language token | ✅ 保留 |
| background-job, search, platform-config | stubs / secondary | ❌ 跳過 |
| observability, audit-log, onboarding | secondary subdomains | ❌ 跳過（後補） |

## Identifier Contract

| Identifier | 角色 | 說明 |
|---|---|---|
| accountId | shell route scope | `AccountType` 判斷 personal 或 org account |
| organizationId | org-scoped identifier | org / team / relations，不取代 shell accountId |
| userId | 具體使用者 | `createdByUserId`、`verifiedByUserId` 等欄位 |
| actorId | 行為主體 | audit / event initiator，可能是 userId 或 system actor |

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

`domain/` 絕對不依賴 Firestore SDK、FCM SDK 或任何外部框架。

## 外部消費方式

```ts
// types
import type { AccountDTO, AccountType, OrganizationDTO } from "@/src/modules/platform";

// server-only
import { createAccount, sendNotification } from "@/src/modules/platform";
```

原始 API 合約參考：`modules/platform/api/index.ts`。
