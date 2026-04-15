# Billing Module Agent Guide

## Purpose

`src/modules/billing` 等價蒸餾 `modules/billing` 的商業生命週期能力：
subscription（方案、配額、續期）與 entitlement（有效功能可用性解算）。

## Boundary Rules

- `domain/` 禁止依賴 Stripe SDK、Firestore SDK、React 或任何外部框架。
- `application/` 只依賴 `domain/` 的 repository port 抽象。
- Stripe SDK 只能出現在 `adapters/outbound/stripe/`。
- Firestore SDK 只能出現在 `adapters/outbound/firestore/`。
- 外部消費者只透過 `src/modules/billing/index.ts`（具名匯出）存取。
- 所有 barrel 用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾規則

- 只移植 subscription + entitlement 兩個 **active** 子域的 domain 概念。
- pricing、invoice、quota-policy 等 gap subdomains 不進 src/modules/billing。
- referral 有骨架但非 core，待需求明確化後才納入。
- Stripe webhook handler 屬於 `adapters/inbound/http/`，不是 domain 或 application。

## Route Here When

- 需要判斷使用者當前方案（`PlanTier`）。
- 需要查詢或解算有效權益（`checkEntitlement`）。
- 需要建立、取消、續期 subscription。
- 需要處理 Stripe webhook 觸發的方案變更。

## Route Elsewhere When

- 身份、存取治理 → `src/modules/iam`。
- 通知使用者帳單事件 → `src/modules/platform`。
- AI 配額政策執行 → `src/modules/ai`（消費 entitlement signal）。
- 工作區功能開關 → `src/modules/workspace`（消費 entitlement signal）。

## Development Order

```
domain/entities/ + repositories/ → application/use-cases/ → adapters/outbound/ → adapters/inbound/ → 更新 barrel
```

## Delivery Style

- 優先實作 `checkEntitlement` use-case（被其他模組最頻繁消費）。
- Entitlement signal 跨模組消費時，下游透過 billing api 取得，不允許直接存取 billing domain。
- 奧卡姆剃刀：subscription + entitlement 兩個 entity 通常已足夠，不預建 quota-policy service。
- Stripe webhook handler 屬於 inbound adapter，不要讓它承載業務判斷邏輯。
