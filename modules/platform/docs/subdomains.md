# Subdomains — platform

本文件是 platform 的正式子域 inventory。這份清單是 **closed by default** 的：後續開發必須先把能力映射到既有子域，而不是再新增新的子域名稱。

## Subdomain Rule in Hexagonal DDD

- 每個子域描述的是平台核心能力，不是資料夾便利分類
- `Port 焦點` 欄位代表該子域主要透過哪些 input/output contracts 參與六邊形邊界
- 子域之間共享語言時，應先落地到 `ubiquitous-language.md`、`context-map.md` 與相關 ports 文件

## Canonical Inventory

| 子域 | 核心問題 | 主要語言 | Port 焦點 |
|---|---|---|---|
| `identity` | 誰是已驗證主體 | `AuthenticatedSubject`, `IdentitySignal` | `PlatformEventIngressPort`, `SubjectDirectory` |
| `account` | 帳號聚合根與生命週期狀態 | `Account`, `AccountLifecycle` | `PlatformCommandPort`, `AccountRepository` |
| `account-profile` | 主體有哪些可治理屬性與偏好 | `AccountProfile`, `SubjectPreference` | `PlatformEventIngressPort`, `SubjectDirectory` |
| `organization` | 主體處於哪些組織與角色邊界 | `MembershipBoundary`, `RoleAssignment` | `PlatformEventIngressPort`, `SubjectDirectory` |
| `access-control` | 主體現在能做什麼 | `PermissionDecision`, `AccessPolicy` | `PlatformCommandPort`, `PolicyCatalogRepository` |
| `security-policy` | 平台安全規則如何被定義與發佈 | `PolicyCatalog`, `PolicyRule` | `PlatformCommandPort`, `PolicyCatalogRepository` |
| `platform-config` | 平台以何種設定輪廓運作 | `ConfigurationProfile`, `ConfigurationProfileRef` | `PlatformCommandPort`, `ConfigurationProfileStore` |
| `feature-flag` | 哪些能力在哪種條件下被打開 | `PlatformCapability`, `CapabilityToggle` | `PlatformCommandPort`, `ConfigurationProfileStore` |
| `onboarding` | 新主體如何被引導完成初始設定 | `OnboardingFlow`, `SetupProgress` | `PlatformCommandPort`, `OnboardingRepository` |
| `compliance` | 資料保留、隱私與法規要求如何被執行 | `CompliancePolicy`, `DataRetentionRule` | `PlatformCommandPort`, `CompliancePolicyStore` |
| `billing` | 計費狀態、收費結果與財務證據如何被管理 | `BillingState`, `DispatchOutcome` | `PlatformCommandPort`, `DeliveryHistoryRepository`, `AuditSignalStore` |
| `subscription` | 方案、權益、配額與有效期間如何被管理 | `SubscriptionAgreement`, `Entitlement`, `UsageLimit` | `PlatformCommandPort`, `SubscriptionAgreementRepository`, `UsageMeterRepository` |
| `referral` | 推薦關係與獎勵如何被追蹤 | `ReferralLink`, `ReferralReward` | `PlatformCommandPort`, `ReferralRepository` |
| `integration` | 平台如何與外部系統安全協作 | `IntegrationContract`, `DeliveryPolicy` | `PlatformCommandPort`, `IntegrationContractRepository`, `ExternalSystemGateway` |
| `workflow` | 哪些事實要被轉成可執行流程 | `WorkflowTrigger`, `WorkflowPolicy` | `PlatformCommandPort`, `WorkflowPolicyRepository`, `WorkflowDispatcherPort` |
| `notification` | 哪些對象應收到什麼訊息 | `NotificationDispatch`, `NotificationRoute` | `PlatformCommandPort`, `NotificationGateway`, `DeliveryHistoryRepository` |
| `background-job` | 長時程或排程任務如何被提交與監控 | `JobSchedule`, `JobExecution` | `PlatformCommandPort`, `JobQueuePort` |
| `content` | 內容資產如何被管理與發布 | `ContentAsset`, `PublicationState` | `PlatformCommandPort`, `ContentRepository` |
| `search` | 跨域搜尋請求如何被路由與執行 | `SearchQuery`, `SearchResult` | `PlatformCommandPort`, `SearchIndexPort` |
| `audit-log` | 什麼事必須被永久追蹤 | `AuditSignal`, `AuditClassification` | `PlatformCommandPort`, `AuditSignalStore` |
| `observability` | 如何量測健康、追蹤與告警 | `ObservabilitySignal`, `HealthIndicator` | `PlatformCommandPort`, `ObservabilitySink` |
| `analytics` | 使用行為如何被量測與分析 | `AnalyticsEvent`, `BehaviorMetric` | `PlatformCommandPort`, `AnalyticsSink` |
| `support` | 客服工單與支援知識如何被管理 | `SupportTicket`, `KnowledgeArticle` | `PlatformCommandPort`, `SupportRepository` |

## Capability Groups

### 主體與名錄

- `identity`
- `account`
- `account-profile`
- `organization`

### 治理與安全

- `access-control`
- `security-policy`
- `platform-config`
- `feature-flag`
- `onboarding`
- `compliance`

### 商業與權益

- `billing`
- `subscription`
- `referral`

### 流程與交付

- `integration`
- `workflow`
- `notification`
- `background-job`

### 內容與檢索

- `content`
- `search`

### 證據與診斷

- `audit-log`
- `observability`
- `analytics`
- `support`

## Inventory Freeze Rule

後續若有人想新增 platform 子域，必須先證明以下三件事都成立：

1. 既有 23 個子域沒有任何一個能吸收該能力
2. 新能力需要獨立的語言、port 焦點與責任邊界
3. `README.md`、`bounded-context.md`、`context-map.md`、本文件都已先被更新

若無法同時滿足這三件事，預設不允許新增子域。
