# Billing Module

`src/modules/billing` 是蒸餾自 `modules/billing` 的精簡等價版，以 `src/modules/template` 骨架為基線。
保留兩個 **active** 子域：**subscription**（方案、配額、續期）與 **entitlement**（有效權益解算），略過 pricing、invoice、quota-policy 等 gap subdomains。

## 蒸餾來源

`modules/billing`（2 完整子域：subscription、entitlement）→ `src/modules/billing`（精簡骨架）

## 目錄結構

```
src/modules/billing/
  index.ts                                    ← 模組對外唯一入口（具名匯出）
  domain/
    index.ts
    entities/
      Subscription.ts                         ← 方案、配額、續期狀態
      Entitlement.ts                          ← 有效權益計算結果
    value-objects/
      SubscriptionId.ts
      EntitlementId.ts
      PlanTier.ts                             ← "free" | "pro" | "enterprise"
    repositories/
      SubscriptionRepository.ts              ← domain port
      EntitlementRepository.ts               ← domain port
    events/
      SubscriptionCreated.ts
      SubscriptionCancelled.ts
      EntitlementGranted.ts
      EntitlementRevoked.ts
  application/
    index.ts
    use-cases/
      create-subscription.use-case.ts
      cancel-subscription.use-case.ts
      check-entitlement.use-case.ts
      grant-entitlement.use-case.ts
    dto/
      SubscriptionDTO.ts
      EntitlementDTO.ts
  adapters/
    inbound/
      index.ts
      http/                                   ← billing HTTP endpoints（webhook handler）
      rpc/                                    ← tRPC routers
    outbound/
      index.ts
      stripe/
        StripeSubscriptionAdapter.ts          ← implements SubscriptionRepository
      firestore/
        FirestoreEntitlementAdapter.ts        ← implements EntitlementRepository
```

## Barrel 結構

| Barrel | 覆蓋範圍 |
|---|---|
| `index.ts` | domain + application 的公開符號 |
| `domain/index.ts` | entities, value-objects, repositories, events |
| `application/index.ts` | use-cases + dto |
| `adapters/inbound/index.ts` | http, rpc |
| `adapters/outbound/index.ts` | stripe/, firestore/ |

所有 barrel 使用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾範圍

| src 概念 | 蒸餾自 modules/billing | 狀態 |
|---|---|---|
| Subscription entity | subdomains/subscription/domain/ | ✅ 保留 |
| Entitlement entity | subdomains/entitlement/domain/ | ✅ 保留 |
| SubscriptionRepository port | subdomains/subscription/domain/ | ✅ 保留 |
| EntitlementRepository port | subdomains/entitlement/domain/ | ✅ 保留 |
| stripe/ adapter | subdomains/subscription/infrastructure/ | ✅ 保留 |
| pricing, invoice, quota-policy | gap subdomains（未實作） | ❌ 跳過 |
| referral | 有骨架但非 core | ❌ 跳過（可後補） |

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

`domain/` 絕對不依賴 Stripe SDK、Firestore SDK 或任何外部框架。

## 外部消費方式

```ts
// types（client-safe）
import type { EntitlementDTO, PlanTier } from "@/src/modules/billing";

// server-only
import { checkEntitlement } from "@/src/modules/billing";
```

原始 API 合約參考：`modules/billing/api/index.ts`。
