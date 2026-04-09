# platform — Application Services

platform 的 application layer 是輸入介面與 domain core 之間的協調層。application services 的工作，是接收由 driving adapters 翻譯過的請求、實作 input port 語言、協調聚合與 output ports，並回傳穩定結果。

## Application Layer 職責

- 接住來自 API、webhook、scheduler、queue consumer、CLI 的輸入請求
- 將輸入模型轉成 domain 能理解的 command / query / event-ingress 語言
- 載入聚合、呼叫聚合行為與 domain services
- 透過 repositories 與其他 output ports 完成持久化、事件發佈與外部 side effects
- 組裝 command result 或 query projection

## Input Port Inventory

| Input Port | 用途 | 主要對應的 Driving Adapters |
|---|---|---|
| `PlatformCommandPort` | 接收命令型請求並執行狀態變更 | API controllers, CLI commands, scheduler, webhook handlers |
| `PlatformQueryPort` | 提供唯讀查詢與投影 | API queries, UI read adapters, reporting adapters |
| `PlatformEventIngressPort` | 吸收外部或相鄰子域的事實訊號 | event consumers, queue consumers, callback handlers |

## Use Case Execution Flow

1. driving adapter 完成 transport 驗證與輸入轉譯
2. application service 呼叫 input port 對應的 use case
3. use case 載入聚合或必要 read models
4. 聚合 / domain services 執行平台規則
5. application service 透過 output ports 保存狀態與發布事件
6. application service 回傳 command result 或 query projection

## Command-oriented Services

| Application Service | 主要用途 | 典型輸入 | 依賴的 Output Ports |
|---|---|---|---|
| `RegisterPlatformContextService` | 建立或啟用平台範圍 | `RegisterPlatformContext` | `PlatformContextRepository`, `SubscriptionAgreementRepository`, `DomainEventPublisher` |
| `PublishPolicyCatalogService` | 發佈新的規則版本 | `PublishPolicyCatalog` | `PolicyCatalogRepository`, `DomainEventPublisher` |
| `ApplyConfigurationProfileService` | 套用配置輪廓與 capability toggles | `ApplyConfigurationProfile` | `PlatformContextRepository`, `ConfigurationProfileStore`, `DomainEventPublisher` |
| `RegisterIntegrationContractService` | 建立或更新外部整合契約 | `RegisterIntegrationContract` | `IntegrationContractRepository`, `SecretReferenceResolver`, `DomainEventPublisher` |
| `ActivateSubscriptionAgreementService` | 啟用、續約或停用訂閱協議 | `ActivateSubscriptionAgreement` | `SubscriptionAgreementRepository`, `PlatformContextRepository`, `DomainEventPublisher` |
| `FireWorkflowTriggerService` | 發出 workflow trigger 並交給下游 adapter 執行 | `FireWorkflowTrigger` | `WorkflowPolicyRepository`, `WorkflowDispatcherPort`, `DomainEventPublisher` |
| `RequestNotificationDispatchService` | 建立通知派送請求 | `RequestNotificationDispatch` | `NotificationGateway`, `PolicyCatalogRepository`, `AuditSignalStore` |
| `RecordAuditSignalService` | 將決策或行為寫成稽核訊號 | `RecordAuditSignal` | `AuditSignalStore`, `DomainEventPublisher` |
| `EmitObservabilitySignalService` | 發出 metrics / trace / alert 訊號 | `EmitObservabilitySignal` | `ObservabilitySink`, `AuditSignalStore` |

## Query-oriented Services

| Application Service | 主要用途 | 典型輸入 | 依賴的 Query Ports |
|---|---|---|---|
| `GetPlatformContextViewService` | 查詢 platform 範圍總覽 | `GetPlatformContextView` | `PlatformContextViewRepository` |
| `ListEnabledCapabilitiesService` | 列出當前可用能力 | `ListEnabledCapabilities` | `PlatformContextViewRepository`, `SubscriptionAgreementRepository` |
| `GetPolicyCatalogViewService` | 查詢政策版本與規則摘要 | `GetPolicyCatalogView` | `PolicyCatalogViewRepository` |
| `GetSubscriptionEntitlementsService` | 查詢方案權益與限制 | `GetSubscriptionEntitlements` | `SubscriptionAgreementRepository`, `UsageMeterRepository` |
| `GetWorkflowPolicyViewService` | 查詢 trigger 對應的 workflow policy | `GetWorkflowPolicyView` | `WorkflowPolicyRepository`, `PolicyCatalogViewRepository` |

## Orchestration Rules

- application services 可以協調多個 aggregates，但不應把跨聚合規則硬塞進 handler 本身
- 所有 persistence 與 side effects 都必須透過 output ports，不直接寫在 service 裡
- 所有 transport concern 都由 driving adapters 處理；application services 不理解 HTTP status、queue headers 或 webhook signature
- input validation 可以在 driving adapters 與 application layer 邊界做，但 domain invariants 仍由 aggregates 與 domain services 守護
- domain events 應在狀態持久化成功後發布，而不是先發後存

## Input Ports 與 Use Case Handlers

輸入請求應先表達成 input ports 定義的語言，再交由 application services 實作。這讓 API controller、message consumer、CLI 或 scheduler 都能共用同一個 use case handler，而不必把業務邏輯寫進 adapter。若新增新的 handler，但沒有對應 input port 語言，表示藍圖仍有缺口。

## 輸出結果

application services 應回傳兩種結果之一：

- command result：描述是否成功、主體識別值與版本資訊
- query projection：為查詢或 UI 組裝的唯讀模型

無論哪一種，application services 都不應回傳 adapter-specific payload。
