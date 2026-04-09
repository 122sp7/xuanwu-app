# platform — Repositories

在這份 blueprint 中，repository 是 output ports 的一部分，專門負責聚合狀態的載入與保存。不是所有 output ports 都是 repository，但所有 repository 都必須以 port 的形式由 domain / application 依賴，再由 adapters 實作。

## Aggregate Repository Ports

| Repository Port | 服務的聚合 | 核心職責 |
|---|---|---|
| `PlatformContextRepository` | `PlatformContext` | `findById`, `save`, `findBySubjectScope` |
| `PolicyCatalogRepository` | `PolicyCatalog` | `findActiveByContextId`, `saveRevision`, `findByRevision` |
| `IntegrationContractRepository` | `IntegrationContract` | `findById`, `save`, `findActiveByContextId` |
| `SubscriptionAgreementRepository` | `SubscriptionAgreement` | `findEffectiveByContextId`, `save`, `findByPlanCode` |

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

Context7 範例顯示，事件發佈與外部交付不該混入 repository 介面。platform blueprint 因此區分以下非持久化 ports：

| Output Port | 用途 |
|---|---|
| `DomainEventPublisher` | 發佈 domain events 到 event bus 或 topic |
| `WorkflowDispatcherPort` | 把 workflow trigger 交給執行引擎 |
| `NotificationGateway` | 派送 email、SMS、push、chat 等通知 |
| `AuditSignalStore` | 寫入不可變的 audit trail |
| `ObservabilitySink` | 發送 metrics、trace、alert |
| `ExternalSystemGateway` | 呼叫外部 API、webhook 或 queue |
| `SecretReferenceResolver` | 解析整合契約所需的密鑰或憑證參照 |

## Adapter 實作原則

- repository adapter 只處理資料映射與永續化，不重寫 platform policy
- event publisher adapter 只處理 transport 與 delivery，不擁有事件語言
- 外部系統 gateway 應以 integration contract 為依據，不直接從 UI 或 controller 讀設定

## Persistence 與 Delivery 的切分

推薦把平台層的 driven adapters 至少切成三類：

- state adapters：資料庫、KV、文件儲存等 repository implementations
- messaging adapters：event publisher、queue producer、topic publisher
- external delivery adapters：HTTP client、webhook sender、notification provider、telemetry exporter

## Repository 設計規則

- repository 方法名稱應描述聚合語意，不描述資料庫語意
- application layer 只能依賴 ports，不直接依賴 adapter class
- repository 回傳 domain model 或 read model，不回傳 adapter 原生型別
- 若某個依賴沒有聚合狀態可載入，優先考慮把它建模成一般 output port，而不是硬塞成 repository
- 若 application-services.md 引用了某個 repository 或 support port，該名稱必須在本文件出現，否則表示文件之間仍然有缺口

## 與 docs/README 的分工

- 本文件專注於 repository / support / delivery ports 的契約面
- 協作流程與 handlers 請見 `application-services.md`
- 通用命名請見 `ubiquitous-language.md`
