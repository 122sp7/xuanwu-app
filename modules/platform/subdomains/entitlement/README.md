# platform/subdomains/entitlement

## 子域職責

`entitlement` 子域負責有效權益與功能可用性統一解算的正典邊界：

- 計算特定主體在當前時間點「有效擁有哪些功能或配額」（`EffectiveEntitlement`）
- 整合 `subscription`、`feature-flag`、`billing` 的訊號，產生統一的權益快照
- 提供功能可用性查詢 API，避免各子域各自實作判斷邏輯

## 核心語言

| 術語 | 說明 |
|---|---|
| `Entitlement` | 一個主體的有效功能可用性聚合根 |
| `EntitlementGrant` | 一條已授予的功能或配額授權記錄 |
| `EffectiveEntitlement` | 整合多來源訊號後的有效權益快照 |
| `FeatureAvailability` | 特定功能對特定主體的可用狀態 |
| `QuotaLimit` | 特定資源的配額上限定義 |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`ResolveEntitlement`、`CheckFeatureAvailability`、`QueryQuotaUsage`）
- `domain/`: `Entitlement`、`EntitlementGrant`、`EffectiveEntitlement`
- `infrastructure/`: Firestore 權益快照存取、快取層（Redis）
- `interfaces/`: server action 接線

## 整合規則

- `entitlement` 不等同於 `feature-flag`：feature-flag 控制漸進發布，entitlement 控制授權可用性
- 消費 `subscription.plan-changed`、`billing.payment-succeeded` 事件重新計算有效權益
- 父模組 public API（`@/modules/platform/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/platform/subdomains.md 建議建立
