# Platform Module Agent Guide

## Purpose

`src/modules/platform` 等價蒸餾 `modules/platform` 的 notification 能力：
notification（通知路由與投遞）。
**Account 與 Organization 已遷至 `src/modules/iam`。**

## Boundary Rules

- `domain/` 禁止依賴 Firestore SDK、FCM SDK、React 或任何外部框架。
- `application/` 只依賴 `domain/` 的 repository 抽象。
- Firestore SDK 只能出現在 `adapters/outbound/firestore/`。
- FCM SDK 只能出現在 `adapters/outbound/fcm/`。
- 外部消費者只透過 `src/modules/platform/index.ts`（具名匯出）存取。
- 所有 barrel 用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾規則

- 保留 notification 子域概念（NotificationRoute entity + send-notification use-case）。
- Account、Organization、OrganizationTeam 不在此模組，移至 src/modules/iam。
- background-job、search、platform-config、observability 等 stub/secondary 不進 src/modules/platform。
- 奧卡姆剃刀：notification 保持為簡單的 route + send 路徑，不預建複雜的 preference engine。

## Route Here When

- 需要發送跨模組通知（`sendNotification`）。
- 需要管理 NotificationRoute（通知投遞端點設定）。

## Route Elsewhere When

- 身份驗證、授權判定 → `src/modules/iam`。
- 帳號建立、帳號 profile → `src/modules/iam`（Account 已移入）。
- 組織建立、成員管理、team → `src/modules/iam`（Organization 已移入）。
- 訂閱商業政策 → `src/modules/billing`。
- 工作區協作 → `src/modules/workspace`。
- AI capability → `src/modules/ai`。
- 知識內容 → `src/modules/notion`。

## Development Order

```
domain/entities/ + repositories/ → application/use-cases/ → adapters/outbound/ → adapters/inbound/ → 更新 barrel
```

## Delivery Style

- 優先實作 `sendNotification`（其他 secondary subdomains 都依賴此 anchor）。
- FCM SDK 初始化與 token 管理只在 `adapters/outbound/fcm/` 內。
