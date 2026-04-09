# Subdomains — platform

本文件列出 platform blueprint 內部的 11 個子域。它們的用途是切分語言與責任焦點，讓 platform 不會退化成單一的共享雜物間。

## 子域總覽

| 子域 | 核心問題 | 主要輸出語言 |
|---|---|---|
| `identity` | 誰是已驗證主體 | `AuthenticatedSubject`, `IdentitySignal` |
| `account` | 主體有哪些可治理屬性 | `AccountProfile`, `SubjectPreference` |
| `organization` | 主體處於何種群組邊界 | `MembershipBoundary`, `RoleAssignment` |
| `permission` | 主體現在能做什麼 | `PermissionDecision`, `AccessPolicy` |
| `subscription` | 此範圍擁有哪些商業權益與限制 | `Entitlement`, `UsageLimit` |
| `config` | 此範圍以何種設定與策略運作 | `ConfigurationProfile`, `CapabilityToggle` |
| `integration` | 如何安全地連接外部系統 | `IntegrationContract`, `DeliveryPolicy` |
| `workflow` | 哪些事件需要被轉成可執行流程 | `WorkflowTrigger`, `WorkflowPolicy` |
| `notification` | 哪些對象應收到什麼訊息 | `NotificationDispatch`, `NotificationRoute` |
| `audit` | 什麼事必須被永久追蹤 | `AuditSignal`, `AuditClassification` |
| `observability` | 如何量測、追蹤與告警 | `ObservabilitySignal`, `HealthIndicator` |

## 子域與 Port 焦點

| 子域 | 主要 input / output 關注 |
|---|---|
| `identity` | `PlatformEventIngressPort`, `SubjectDirectory` |
| `account` | `PlatformEventIngressPort`, `SubjectDirectory` |
| `organization` | `PlatformEventIngressPort`, `SubjectDirectory` |
| `permission` | `PlatformCommandPort`, `PolicyCatalogRepository` |
| `subscription` | `PlatformCommandPort`, `SubscriptionAgreementRepository`, `UsageMeterRepository` |
| `config` | `PlatformCommandPort`, `ConfigurationProfileStore` |
| `integration` | `PlatformCommandPort`, `IntegrationContractRepository`, `ExternalSystemGateway` |
| `workflow` | `PlatformCommandPort`, `WorkflowPolicyRepository`, `WorkflowDispatcherPort` |
| `notification` | `PlatformCommandPort`, `NotificationGateway`, `DeliveryHistoryRepository` |
| `audit` | `PlatformCommandPort`, `AuditSignalStore` |
| `observability` | `PlatformCommandPort`, `ObservabilitySink` |

## 子域分群

### 主體與邊界

- `identity`
- `account`
- `organization`

這一組提供平台決策所需的主體真相與群組邊界。

### 治理與限制

- `permission`
- `subscription`
- `config`

這一組決定平台能力何時可用、誰可存取，以及採用哪一組政策。

### 執行與外部交付

- `integration`
- `workflow`
- `notification`

這一組把內部決策轉成實際 side effects 與流程輸出。

### 追蹤與診斷

- `audit`
- `observability`

這一組讓平台能回答「發生過什麼」與「現在狀況如何」。

## 子域協作原則

- `identity` 不直接決定授權；它提供主體語言給 `permission`
- `subscription` 不直接派送通知；它決定哪些能力與額度允許被使用
- `config` 不直接替代 policy；它提供具體配置值與 capability toggles
- `workflow` 不直接持有外部端點；它透過 `integration` 與 `notification` 交付
- `audit` 與 `observability` 消費訊號，但不主導業務政策

## 子域與聚合的關係

這 11 個子域不是要求一個子域對應一個 aggregate。相反地，它們提供的是語言切分與責任視角：

- `PlatformContext` 主要落在 `config`, `subscription`, `permission` 的交界
- `PolicyCatalog` 主要落在 `permission`, `workflow`, `notification`, `audit`
- `IntegrationContract` 主要落在 `integration`
- `SubscriptionAgreement` 主要落在 `subscription`

## 擴張規則

若未來要新增新的平台子域，至少要回答：

1. 它提供的是新的語言，還是既有語言的延伸？
2. 它是否真的需要新的 aggregates / ports / adapters？
3. 它會與哪個既有子域共享事件或政策？
4. 它是否會讓現有子域責任變模糊？

若答不出來，通常代表還不需要新的子域。
