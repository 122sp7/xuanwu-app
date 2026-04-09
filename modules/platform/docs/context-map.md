# Context Map — platform

本文件描述 platform 的 23 個子域如何在同一個 bounded context 內協作。這是一張 **local platform map**，目的是說明共享語言、事件事實與 use case 協作，不是全系統上下文圖。

## Collaboration Rule

- 子域之間透過 published language、input ports、output ports 與 read models 協作
- 不應讓某個子域的 adapter 直接依賴另一個子域的 adapter
- 若跨子域互動需要新的共享語言，先更新 `ubiquitous-language.md` 與本文件
- 若跨子域互動需要新的依賴契約，先更新 `application-services.md` 或 `repositories.md`

## Local Platform Map

以下是核心協作關係圖。新增到 canonical inventory 的子域（例如 `onboarding`、`compliance`、`content`、`search`、`analytics`、`support`、`background-job`、`referral`）在不同實作階段可先以最小路徑接入，待對應 port 穩定後再擴展協作邊。

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
| `identity` | `account` | `AuthenticatedSubject`, `AccountLifecycle` | 驗證後主體需映射到可治理帳戶 |
| `identity` | `account-profile` | `AuthenticatedSubject`, `SubjectScope` | 驗證過的主體需要被映射成可治理輪廓 |
| `account-profile` | `access-control` | `AccountProfile`, `SubjectPreference` | 授權決策需要主體屬性與偏好 |
| `organization` | `access-control` | `MembershipBoundary`, `RoleAssignment` | 存取控制需要群組與角色資訊 |
| `onboarding` | `account-profile` | `OnboardingFlow`, `SetupProgress` | 初始設定結果要轉成可治理輪廓 |
| `security-policy` | `access-control` | `PolicyCatalog`, `AccessPolicy` | 授權判斷要遵守安全政策 |
| `security-policy` | `compliance` | `PolicyCatalog`, `CompliancePolicy` | 合規檢查需套用統一政策版本 |
| `platform-config` | `feature-flag` | `ConfigurationProfile`, `CapabilityToggle` | 能力開關需要設定輪廓與 rollout 參數 |
| `platform-config` | `workflow` | `ConfigurationProfile` | 流程啟動依賴設定化規則與參數 |
| `subscription` | `feature-flag` | `Entitlement`, `UsageLimit` | feature rollout 必須受方案權益約束 |
| `subscription` | `integration` | `PlanConstraint`, `DeliveryAllowance` | 某些整合只在特定方案與配額下可用 |
| `subscription` | `billing` | `SubscriptionAgreement`, `BillingState` | 訂閱生命週期與計費狀態互相影響 |
| `referral` | `billing` | `ReferralReward`, `BillingState` | 推薦回饋會影響帳務處理 |
| `access-control` | `workflow` | `PermissionDecision` | 流程觸發前要先通過授權 |
| `workflow` | `notification` | `WorkflowTrigger`, `NotificationDispatch` | 流程結果常需轉成通知請求 |
| `workflow` | `background-job` | `WorkflowTrigger`, `JobSchedule` | 長時程任務由背景排程承接 |
| `workflow` | `audit-log` | `AuditSignal`, `CorrelationContext` | 重要流程節點需要留下證據 |
| `integration` | `audit-log` | `AuditSignal`, `DispatchOutcome` | 外部交付結果屬治理軌跡 |
| `notification` | `audit-log` | `DispatchOutcome`, `AuditSignal` | 派送成功或失敗都要記錄 |
| `content` | `search` | `ContentAsset`, `SearchQuery` | 內容發布需可被檢索索引與查詢 |
| `support` | `analytics` | `SupportTicket`, `BehaviorMetric` | 支援流程輸出服務品質指標 |
| `audit-log` | `observability` | `AuditClassification`, `ObservabilitySignal` | 稽核分類可轉為運維診斷訊號 |
| `analytics` | `observability` | `BehaviorMetric`, `ObservabilitySignal` | 分析結果需進入告警與健康視圖 |
| `billing` | `observability` | `BillingState`, `ObservabilitySignal` | 計費異常需要被量測與告警 |

## Context Map Rule

若某個新需求無法被這張 map 中的既有節點、共享語言與既有 ports 吸收，先調整 map、`subdomains.md` 與相關 ports 文件，而不是直接再加新資料夾。
