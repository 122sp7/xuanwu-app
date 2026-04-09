# Context Map — platform

本文件描述 platform 的 14 個子域如何在本地 bounded context 內協作。這是一張 local platform map，不是全系統上下文圖。

## Local Platform Map

```text
identity -> account-profile -> access-control
identity -> audit-trail

organization-directory -> access-control
organization-directory -> audit-trail

security-policies -> access-control
security-policies -> process-workflows
security-policies -> audit-trail

platform-configuration -> feature-toggles
platform-configuration -> access-control
platform-configuration -> external-integrations
platform-configuration -> process-workflows
platform-configuration -> notification-delivery
platform-configuration -> observability

user-subscriptions -> billing
user-subscriptions -> feature-toggles
user-subscriptions -> access-control
user-subscriptions -> external-integrations
user-subscriptions -> process-workflows

access-control -> external-integrations
access-control -> process-workflows
access-control -> audit-trail

process-workflows -> notification-delivery
process-workflows -> audit-trail
process-workflows -> observability

external-integrations -> audit-trail
external-integrations -> observability

notification-delivery -> audit-trail
notification-delivery -> observability

billing -> audit-trail
billing -> observability

audit-trail -> observability
```

## 協作關係

| Source | Target | 共享語言 | 為何需要這個關係 |
|---|---|---|---|
| `identity` | `account-profile` | `AuthenticatedSubject`, `SubjectScope` | 驗證過的主體需要被映射成可治理輪廓 |
| `account-profile` | `access-control` | `AccountProfile`, `SubjectPreference` | 授權決策需要主體屬性與偏好 |
| `organization-directory` | `access-control` | `MembershipBoundary`, `RoleAssignment` | 存取控制需要群組與角色資訊 |
| `security-policies` | `access-control` | `PolicyCatalog`, `AccessPolicy` | 授權判斷要遵守安全政策 |
| `platform-configuration` | `feature-toggles` | `ConfigurationProfile`, `CapabilityToggle` | 能力開關需要設定輪廓與 rollout 參數 |
| `platform-configuration` | `process-workflows` | `ConfigurationProfile` | 流程啟動依賴設定化規則與參數 |
| `user-subscriptions` | `feature-toggles` | `Entitlement`, `UsageLimit` | feature rollout 必須受方案權益約束 |
| `user-subscriptions` | `external-integrations` | `PlanConstraint`, `DeliveryAllowance` | 某些整合只在特定方案與配額下可用 |
| `user-subscriptions` | `billing` | `SubscriptionAgreement`, `BillingState` | 訂閱生命週期與計費狀態互相影響 |
| `access-control` | `process-workflows` | `PermissionDecision` | 流程觸發前要先通過授權 |
| `process-workflows` | `notification-delivery` | `WorkflowTrigger`, `NotificationDispatch` | 流程結果常需轉成通知請求 |
| `process-workflows` | `audit-trail` | `AuditSignal`, `CorrelationContext` | 重要流程節點需要留下證據 |
| `external-integrations` | `audit-trail` | `AuditSignal`, `DispatchOutcome` | 外部交付結果屬治理軌跡 |
| `notification-delivery` | `audit-trail` | `DispatchOutcome`, `AuditSignal` | 派送成功或失敗都要記錄 |
| `audit-trail` | `observability` | `AuditClassification`, `ObservabilitySignal` | 稽核分類可轉為運維診斷訊號 |
| `billing` | `observability` | `BillingState`, `ObservabilitySignal` | 計費異常需要被量測與告警 |

## Context Map Rule

若某個新需求無法被這張 map 中的既有節點與共享語言吸收，先調整 map 與 `subdomains.md`，而不是直接再加新資料夾。
