# Context Map — platform

本文件描述 platform 的 23 個子域如何在本地 bounded context 內協作。這是一張 local platform map，不是全系統上下文圖。

## Local Platform Map

以下是核心協作關係圖。隨著 subdomain 從 14 擴展到 23 個，部分新子域（如 `account`、`onboarding`、`compliance`、`content`、`search`、`analytics`、`support`、`background-job`、`referral`）的協作路徑尚待細化。

```text
identity -> account -> account-profile -> access-control
identity -> audit-log

organization -> access-control
organization -> audit-log

security-policy -> access-control
security-policy -> compliance
security-policy -> workflow
security-policy -> audit-log

platform-config -> feature-flag
platform-config -> access-control
platform-config -> integration
platform-config -> workflow
platform-config -> notification
platform-config -> observability

onboarding -> account-profile
onboarding -> notification

subscription -> billing
subscription -> feature-flag
subscription -> access-control
subscription -> integration
subscription -> workflow

referral -> account
referral -> billing
referral -> analytics

access-control -> integration
access-control -> workflow
access-control -> audit-log

workflow -> notification
workflow -> background-job
workflow -> audit-log
workflow -> observability

integration -> audit-log
integration -> observability

notification -> audit-log
notification -> observability

billing -> audit-log
billing -> observability

content -> search
content -> audit-log

search -> analytics
search -> observability

background-job -> observability
background-job -> audit-log

compliance -> audit-log
compliance -> observability

support -> analytics
support -> audit-log

audit-log -> observability
audit-log -> analytics

analytics -> observability
```

## 協作關係

| Source | Target | 共享語言 | 為何需要這個關係 |
|---|---|---|---|
| `identity` | `account-profile` | `AuthenticatedSubject`, `SubjectScope` | 驗證過的主體需要被映射成可治理輪廓 |
| `account-profile` | `access-control` | `AccountProfile`, `SubjectPreference` | 授權決策需要主體屬性與偏好 |
| `organization` | `access-control` | `MembershipBoundary`, `RoleAssignment` | 存取控制需要群組與角色資訊 |
| `security-policy` | `access-control` | `PolicyCatalog`, `AccessPolicy` | 授權判斷要遵守安全政策 |
| `platform-config` | `feature-flag` | `ConfigurationProfile`, `CapabilityToggle` | 能力開關需要設定輪廓與 rollout 參數 |
| `platform-config` | `workflow` | `ConfigurationProfile` | 流程啟動依賴設定化規則與參數 |
| `subscription` | `feature-flag` | `Entitlement`, `UsageLimit` | feature rollout 必須受方案權益約束 |
| `subscription` | `integration` | `PlanConstraint`, `DeliveryAllowance` | 某些整合只在特定方案與配額下可用 |
| `subscription` | `billing` | `SubscriptionAgreement`, `BillingState` | 訂閱生命週期與計費狀態互相影響 |
| `access-control` | `workflow` | `PermissionDecision` | 流程觸發前要先通過授權 |
| `workflow` | `notification` | `WorkflowTrigger`, `NotificationDispatch` | 流程結果常需轉成通知請求 |
| `workflow` | `audit-log` | `AuditSignal`, `CorrelationContext` | 重要流程節點需要留下證據 |
| `integration` | `audit-log` | `AuditSignal`, `DispatchOutcome` | 外部交付結果屬治理軌跡 |
| `notification` | `audit-log` | `DispatchOutcome`, `AuditSignal` | 派送成功或失敗都要記錄 |
| `audit-log` | `observability` | `AuditClassification`, `ObservabilitySignal` | 稽核分類可轉為運維診斷訊號 |
| `billing` | `observability` | `BillingState`, `ObservabilitySignal` | 計費異常需要被量測與告警 |

## Context Map Rule

若某個新需求無法被這張 map 中的既有節點與共享語言吸收，先調整 map 與 `subdomains.md`，而不是直接再加新資料夾。
