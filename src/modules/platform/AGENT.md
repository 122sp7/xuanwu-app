# Platform Module Agent Guide

## Purpose

`src/modules/platform` 等價蒸餾 `modules/platform` 的平台治理能力：
account（帳號聚合根）、organization（組織 + team，已合併）、notification（通知路由與投遞）。

## Boundary Rules

- `domain/` 禁止依賴 Firestore SDK、FCM SDK、React 或任何外部框架。
- `application/` 只依賴 `domain/` 的 repository + service 抽象。
- Firestore SDK 只能出現在 `adapters/outbound/firestore/`。
- FCM SDK 只能出現在 `adapters/outbound/fcm/`。
- 外部消費者只透過 `src/modules/platform/index.ts`（具名匯出）存取。
- 所有 barrel 用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾規則

- 保留 account + organization + notification 3 個 core 子域概念。
- team 已合併進 organization 子域（OrganizationTeam aggregate）。
- AccountProfile 輕量保留為 Account 上的 profile value-object，不獨立子域。
- background-job、search、platform-config、observability 等 stub/secondary 不進 src/modules/platform。
- `AccountType = "user" | "organization"` 是 Published Language token，不可用 `"personal"` 替代。

## Identifier Naming Rules（嚴格）

- `accountId`：shell route scope identifier（不等於 workspaceId）。
- `organizationId`：org-scoped domain identifier（不取代 shell 的 accountId）。
- `userId`：具體使用者欄位（createdByUserId 等），不混指 actorId。
- `actorId`：audit / event initiator（可能是 userId 或 system actor）。
- `tenantId`：tenant isolation identifier（不等於 workspaceId 或 accountId）。

## Route Here When

- 需要建立或管理帳號（`createAccount` / `updateAccountProfile`）。
- 需要建立或管理組織、邀請成員（`createOrganization` / `inviteOrganizationMember`）。
- 需要建立或管理 team（`createTeam`，team 屬於 Organization）。
- 需要發送跨模組通知（`sendNotification`）。
- 需要解析 `AccountType`（判斷 personal account 或 organization account）。

## Route Elsewhere When

- 身份驗證、授權判定 → `src/modules/iam`。
- 訂閱商業政策 → `src/modules/billing`。
- 工作區協作 → `src/modules/workspace`（使用 accountId 作為 scope，不從 platform 直接讀）。
- AI capability → `src/modules/ai`。
- 知識內容 → `src/modules/notion`。

## Development Order

```
domain/entities/ + repositories/ → application/use-cases/ → adapters/outbound/ → adapters/inbound/ → 更新 barrel
```

## Delivery Style

- 優先實作 `createAccount`（所有 downstream 依賴此 anchor）。
- `AccountGovernanceService` 是 domain service，帳號狀態轉換規則不要讓它漏入 application 或 UI。
- Identifier 命名需嚴格遵守 Identifier Contract，不可用 `accountId` 指代 `organizationId`。
- 奧卡姆剃刀：notification 保持為簡單的 route + send 路徑，不預建複雜的 preference engine。
