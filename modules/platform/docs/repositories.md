# platform — Repositories

在這份 blueprint 中，repository 與各種 gateway / sink 都屬於 **output ports**。repository 專門負責聚合狀態的載入與保存；其他 output ports 則處理查詢支援、事件發佈、外部交付與診斷輸出。契約由 core/application 擁有，具體技術實作放在 `infrastructure/`。

## Output Port Ownership Rule

- repository、query port、support port、delivery port 的語言來源在 `application/` 與 `domain/`
- `api/` 只做 public boundary projection，不是 output port 的真實來源
- infrastructure adapters 實作 ports，但不改寫其業務語意

## Aggregate Repository Ports

| Repository Port | 服務的聚合 | 核心職責 |
|---|---|---|
| `PlatformContextRepository` | `PlatformContext` | `findById`, `save`, `findBySubjectScope` |
| `PolicyCatalogRepository` | `PolicyCatalog` | `findActiveByContextId`, `saveRevision`, `findByRevision` |
| `IntegrationContractRepository` | `IntegrationContract` | `findById`, `save`, `findActiveByContextId` |
| `SubscriptionAgreementRepository` | `SubscriptionAgreement` | `findEffectiveByContextId`, `save`, `findByPlanCode` |

## Subdomain Repository / Store Ports

下列 ports 在 `subdomains.md` 與 `application-services.md` 已被使用，需在 repository 契約層明確列出，避免文件引用缺口。

| Port | 子域 | 用途 |
|---|---|---|
| `AccountRepository` | `account` | 載入與保存帳號聚合與生命週期狀態 |
| `OnboardingRepository` | `onboarding` | 載入與保存 onboarding flow / setup progress |
| `CompliancePolicyStore` | `compliance` | 查詢與保存合規規則、保留策略、審查結果 |
| `ReferralRepository` | `referral` | 載入與保存推薦關係、獎勵狀態與結算參照 |
| `ContentRepository` | `content` | 載入與保存內容資產與發布狀態 |
| `SupportRepository` | `support` | 載入與保存支援工單與知識關聯狀態 |

## Query / Read-model Ports

某些查詢模型不需要完整 aggregate，可透過專門的 query ports 提供：

| Query Port | 用途 |
|---|---|
| `PlatformContextViewRepository` | 提供平台範圍總覽 |
| `PolicyCatalogViewRepository` | 提供規則摘要與 revision history |
| `UsageMeterRepository` | 提供 entitlement / quota 的使用情況 |
| `DeliveryHistoryRepository` | 提供 integration / notification 的交付紀錄查詢 |
| `WorkflowPolicyRepository` | 提供 trigger 與 workflow policy 的讀取介面 |

## Supporting State / Lookup Ports

這些 ports 不直接保存聚合，但會為 application services 與 domain services 提供必要支援資料：

| Support Port | 用途 |
|---|---|
| `ConfigurationProfileStore` | 提供可套用的 configuration profile |
| `SubjectDirectory` | 提供主體輪廓、偏好與角色對照 |
| `SecretReferenceResolver` | 解析整合契約所需的認證參照 |

## 非 Repository 的 Output Ports

Hexagonal 分層要求事件發佈與外部交付不要混入 repository 介面。platform blueprint 因此區分以下非持久化 ports：

| Output Port | 用途 |
|---|---|
| `DomainEventPublisher` | 發佈 domain events 到 event bus 或 topic |
| `WorkflowDispatcherPort` | 把 workflow trigger 交給執行引擎 |
| `NotificationGateway` | 派送 email、SMS、push、chat 等通知 |
| `AuditSignalStore` | 寫入不可變的 audit trail |
| `ObservabilitySink` | 發送 metrics、trace、alert |
| `AnalyticsSink` | 發送 analytics 事件與行為指標 |
| `ExternalSystemGateway` | 呼叫外部 API、webhook 或 queue |
| `JobQueuePort` | 提交與追蹤背景作業 |
| `SearchIndexPort` | 寫入搜尋索引與查詢搜尋結果 |
| `SecretReferenceResolver` | 解析整合契約所需的密鑰或憑證參照 |

## Migration-Pending Repository Ports

下列 repository ports 目前定義於對應的**獨立模組**，計畫在模組合并進 platform 時成為 platform output port 契約的一部分。合并前，platform blueprint 以此為目標定義；合并後，獨立模組的同名 port 應退役。

### 來自 `modules/identity/`

| Port | 目標子域 | 現有方法 | 說明 |
|---|---|---|---|
| `IdentityRepository` | `identity` | `signIn()`, `signOut()`, `getCurrentIdentity()` | Firebase Auth 操作入口；合并後成為 `identity` 子域的 output port |
| `TokenRefreshRepository` | `identity` | `listenToTokenRefresh()` | token 刷新訊號監聽；合并後成為 `identity` 子域的 support port |

### 來自 `modules/account/`

| Port | 目標子域 | 現有方法 | 說明 |
|---|---|---|---|
| `AccountRepository` | `account` | `save()`, `findById()`, `delete()` | 帳號聚合根倉儲；platform `AccountRepository` 已在 ports/output 有對應定義 |
| `AccountQueryRepository` | `account` | `findById()`, `findByEmail()` | CQRS 讀取側；合并後納入 `account` 的 query port |
| `AccountPolicyRepository` | `account` | `save()`, `findByAccountId()` | AccountPolicy 倉儲；合并後納入 `account` 子域 |

### 來自 `modules/organization/`

| Port | 目標子域 | 現有方法 | 說明 |
|---|---|---|---|
| `OrganizationRepository` | `organization` | `save()`, `findById()`, `findByMemberId()` | Organization 聚合根倉儲；合并後成為 `organization` 子域的 repository port |
| `OrgPolicyRepository` | `organization` | 組織政策 | 組織政策規則倉儲；合并後納入 `organization` 子域 |

### 來自 `modules/notification/`

| Port | 目標子域 | 現有方法 | 說明 |
|---|---|---|---|
| `NotificationRepository` | `notification` | `save()`, `findByRecipient()`, `markAsRead()` | 通知記錄倉儲；合并後成為 `notification` 子域的 repository port |

## Adapter 實作原則

- repository adapter 只處理資料映射與永續化，不重寫 platform policy
- event publisher adapter 只處理 transport 與 delivery，不擁有事件語言
- 外部系統 gateway 應以 integration contract 為依據，不直接從 UI 或 controller 讀設定
- infrastructure adapter 可以組合 SDK，但 SDK 細節不能回滲到 port 契約命名

## Persistence 與 Delivery 的切分

推薦把 platform 層的 driven adapters 至少切成三類：

- state adapters：資料庫、KV、文件儲存等 repository implementations
- messaging adapters：event publisher、queue producer、topic publisher
- external delivery adapters：HTTP client、webhook sender、notification provider、telemetry exporter

## Repository 設計規則

- repository 方法名稱應描述聚合語意，不描述資料庫語意
- application layer 只能依賴 ports，不直接依賴 adapter class
- repository 回傳 domain model 或 read model，不回傳 adapter 原生型別
- 若某個依賴沒有聚合狀態可載入，優先考慮把它建模成一般 output port，而不是硬塞成 repository
- 若 `application-services.md` 引用了某個 repository 或 support port，該名稱必須在本文件出現，否則表示文件之間仍然有缺口
