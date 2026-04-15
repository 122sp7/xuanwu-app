# IAM Module Agent Guide

## Purpose

`src/modules/iam` 等價蒸餾 `modules/iam` 的核心身份與存取治理能力：
identity（主體）、access-control（授權判定）、session（token lifecycle）、authentication（驗證流程）。

## Boundary Rules

- `domain/` 禁止依賴 Firebase Auth SDK、Firestore SDK、React 或任何外部框架。
- `application/` 只依賴 `domain/` 的 repository + service 抽象。
- Firebase Auth SDK 只能出現在 `adapters/outbound/firebase-auth/`。
- 外部消費者只透過 `src/modules/iam/index.ts`（具名匯出）存取。
- 所有 barrel 用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾規則

- 只移植 identity + access-control + session + authentication 4 個 core 概念。
- federation、consent、secret-governance 等 gap subdomains 不進 src/modules/iam。
- authorization、tenant、security-policy 為 core-first stubs，待需求具體化才納入。
- `Actor` 是 identity token，不可用 `User` 替代（Naming Rule）。
- `AccessDecision` 是授權判定結果 token，不可用 `Permission` 或 `Role` 替代。

## Route Here When

- 需要驗證使用者身份（`authenticateActor`）。
- 需要判斷主體是否有權限做某個動作（`authorizeAccess`）。
- 需要建立或撤銷 session（`createSession` / `revokeSession`）。
- 需要從 Firebase token 解析 Actor identity。

## Route Elsewhere When

- 帳號 profile、organization 範疇 → `src/modules/platform`。
- 訂閱、配額商業政策 → `src/modules/billing`。
- 工作區角色與 membership → `src/modules/workspace`（消費 actor reference）。
- AI 能力 → `src/modules/ai`。

## Development Order

```
domain/entities/ + services/ → application/use-cases/ → adapters/outbound/ → adapters/inbound/ → 更新 barrel
```

## Delivery Style

- 優先實作 `authorizeAccess`（被其他模組最頻繁消費的 gate）。
- `Actor` + `AccessDecision` 是 Published Language token，跨模組消費時只傳遞這兩個型別。
- 奧卡姆剃刀：`AccessControlService` 一個 domain service 通常已足夠，不預建 RBAC engine。
- Firebase Auth token 驗證屬於 adapter 邏輯，不要讓它滲透進 domain 或 application。
