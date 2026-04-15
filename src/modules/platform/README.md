# Platform Module

`src/modules/platform` 是蒸餾自 `modules/platform` 的精簡等價版，以 `src/modules/template` 骨架為基線。
保留 1 個 **core** 子域：**notification**（通知路由與投遞）。
**Account 與 Organization 已遷至 `src/modules/iam`。**
略過 background-job、search、platform-config、observability 等 stub/secondary 子域。

## 領域定位

| 項目 | 內容 |
|---|---|
| **DDD 分類** | Generic / Supporting |
| **定位** | 系統級能力抽象層（notification routing）|
| **核心價值** | 讓其他 domain 不碰 infra 細節（FCM 投遞、通知路由、偏好管理）|
| **不做** | business logic、user model；Account / Organization 已遷至 `src/modules/iam` |
| **依賴方向** | 被所有 domain 使用；不依賴 domain logic |

## 蒸餾來源

`modules/platform`（7 個已實作子域）→ `src/modules/platform`（notification core）

## 目錄結構

```
src/modules/platform/
  index.ts                                    ← 模組對外唯一入口（具名匯出）
  domain/
    index.ts
    entities/
      NotificationRoute.ts                    ← 通知投遞端點
    value-objects/
      NotificationChannelType.ts              ← "email" | "push" | "in-app"
    repositories/
      NotificationRouteRepository.ts          ← domain port
    events/
      NotificationSent.ts
  application/
    index.ts
    use-cases/
      send-notification.use-case.ts
    dto/
      NotificationDTO.ts
  adapters/
    inbound/
      index.ts
      http/                                   ← notification HTTP endpoints
      rpc/                                    ← tRPC routers
    outbound/
      index.ts
      firestore/
        FirestoreNotificationRouteAdapter.ts
      fcm/
        FcmNotificationAdapter.ts             ← Firebase Cloud Messaging
```

## Barrel 結構

| Barrel | 覆蓋範圍 |
|---|---|
| `index.ts` | domain + application 的公開符號 |
| `domain/index.ts` | entities, value-objects, repositories, events |
| `application/index.ts` | use-cases + dto |
| `adapters/inbound/index.ts` | http, rpc |
| `adapters/outbound/index.ts` | firestore/, fcm/ |

所有 barrel 使用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾範圍

| src 概念 | 蒸餾自 modules/platform | 狀態 |
|---|---|---|
| NotificationRoute | subdomains/notification/domain/ | ✅ 保留 |
| Account aggregate | subdomains/account/domain/ | ➡️ 已移至 src/modules/iam |
| Organization + OrganizationTeam | subdomains/organization/domain/ | ➡️ 已移至 src/modules/iam |
| background-job, search, platform-config | stubs / secondary | ❌ 跳過 |
| observability, audit-log, onboarding | secondary subdomains | ❌ 跳過（後補） |

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

`domain/` 絕對不依賴 Firestore SDK、FCM SDK 或任何外部框架。

## 外部消費方式

```ts
// types
import type { NotificationDTO } from "@/src/modules/platform";

// server-only
import { sendNotification } from "@/src/modules/platform";
```

帳號與組織相關 API：`modules/platform/api/index.ts` 查閱 Account / Organization，但實作位移至 `src/modules/iam`。
