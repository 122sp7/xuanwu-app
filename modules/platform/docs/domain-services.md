# platform — Domain Services

platform 的 domain services 承載那些無法只靠單一 aggregate 完成、但仍屬於純平台規則的決策。它們不做 persistence、不直接發送事件，也不接觸 transport 或 SDK。

## Domain Services 清單

| Domain Service | 處理的問題 | 主要輸入 |
|---|---|---|
| `CapabilityEntitlementPolicy` | capability 是否可因 entitlement 生效 | `PlatformCapability`, `SubscriptionAgreement` |
| `PermissionResolutionService` | 如何根據主體、資源與政策做授權決策 | `SubjectScope`, `PolicyCatalog`, `ResourceDescriptor` |
| `ConfigurationCompositionService` | 多層配置如何組裝成單一有效視圖 | `ConfigurationProfile`, `PolicyCatalog`, `SubscriptionAgreement` |
| `IntegrationCompatibilityService` | 外部契約是否與 policy、plan、protocol 相容 | `IntegrationContract`, `SubscriptionAgreement`, `PolicyCatalog` |
| `WorkflowDispatchPolicy` | 某個 trigger 是否該被允許、延遲、抑制或升級 | `WorkflowTrigger`, `PolicyCatalog`, `PermissionDecision` |
| `NotificationRoutingPolicy` | 某條通知該走哪個通道、是否應被抑制 | `NotificationDispatch`, `PolicyCatalog`, `SubjectPreference` |
| `AuditClassificationService` | 什麼樣的行為需要記錄、記成何種等級 | `AuditSignal`, `PolicyCatalog` |
| `ObservabilityCorrelationService` | 如何把 workflow、integration、notification、audit 連成可追蹤鏈 | `ObservabilitySignal`, `CorrelationContext` |

## 何時該抽成 Domain Service

以下情況適合使用 domain service：

- 規則跨越兩個以上 aggregates
- 規則本身不需要持有狀態
- 規則對 adapters 完全不感興趣，但對平台語意很重要

以下情況不該抽成 domain service：

- 只是某個 aggregate 自己的不變數
- 只是資料庫查詢方便性的封裝
- 只是 HTTP、queue、webhook 的轉譯邏輯

## 與 Application Layer 的關係

- application services 可以呼叫 domain services
- domain services 不應反向知道 application service 的存在
- 若規則需要 I/O，應拆成 domain service + output port，而不是把 I/O 留在 domain service 裡

## 設計原則

- domain services 應優先回傳明確的 decision object，而不是鬆散布林值
- 錯誤應描述治理語意，例如 `entitlement_denied`, `policy_conflict`, `delivery_not_allowed`
- 每個 service 都應可在不啟動任何 adapter 的情況下被測試

## 主要 Decision Objects

| Decision Object | 用途 |
|---|---|
| `PermissionDecision` | 表達允許、拒絕、條件允許或需要升級 |
| `DispatchOutcome` | 表達通知或外部交付的結果 |
| `AuditClassification` | 表達此事實需要何種稽核等級 |
| `PlanConstraint` | 表達 subscription 對 capability 或 delivery 的限制 |
| `DeliveryAllowance` | 表達整合或通知在當前條件下是否允許交付 |

## 與平台子域的對應

- `identity`, `account`, `organization` 主要提供主體與邊界輸入
- `access-control`, `platform-config`, `subscription` 提供治理輸入
- `integration`, `workflow`, `notification` 提供執行輸入
- `audit`, `observability` 將決策轉成可追蹤訊號

## 與 docs/README 的分工

- 本文件只描述跨聚合純規則與 decision objects
- 聚合結構與不變數請見 `aggregates.md`
- 事件命名與事件擁有者請見 `domain-events.md`
