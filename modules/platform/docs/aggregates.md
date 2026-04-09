# Aggregates — platform

本文件定義 platform blueprint 中的核心聚合、值物件與不變數。它們屬於 `domain/` 核心，目的是把平台層的關鍵決策留在 domain，而把 persistence、delivery 與 transport 留給 output ports 與 adapters。

## Aggregate Lifecycle in Hexagonal Architecture

在 platform blueprint 中，聚合遵循以下生命週期：

1. driving adapter 把外部請求翻譯成 command 或 query
2. application service 透過 repository port 載入聚合
3. 聚合執行命令方法並守住不變數
4. application service 透過 repository port 保存新狀態
5. application service 在持久化成功後拉取並發布 domain events

聚合本身不直接呼叫 repository、gateway、queue、event bus 或任何 SDK。

## 聚合根：PlatformContext

### Hexagonal role

`PlatformContext` 是 platform 範圍能力啟用與治理基準的 aggregate root。它回答的是：「這個平台範圍目前允許哪些能力，並以什麼政策與配置運作？」

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|---|---|---|
| `contextId` | `PlatformContextId` | 平台範圍識別值 |
| `subjectScope` | `SubjectScope` | 此範圍允許的 actor / account / organization 邊界 |
| `capabilities` | `PlatformCapability[]` | 已註冊的能力集合 |
| `policyCatalogId` | `PolicyCatalogId` | 生效中的政策集合 |
| `configurationProfileRef` | `ConfigurationProfileRef` | 生效中的配置輪廓參照 |
| `subscriptionAgreementId` | `SubscriptionAgreementId` | 生效中的訂閱協議 |
| `lifecycleState` | `PlatformLifecycleState` | `draft | active | suspended | retired` |

### 不變數

- `active` 狀態的 context 必須指向一份有效的 `SubscriptionAgreement`
- capability 只有在 entitlement 允許時才能被啟用
- `suspended` 或 `retired` 的 context 不得再發出新的 workflow 或 integration delivery 命令

---

## 聚合根：PolicyCatalog

### Hexagonal role

`PolicyCatalog` 擁有平台範圍內用來評估權限、通知、工作流與稽核規則的版本化政策集合。它是 domain 對治理語意的單一來源，而不是 adapter 設定容器。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|---|---|---|
| `policyCatalogId` | `PolicyCatalogId` | 政策集合識別值 |
| `contextId` | `PlatformContextId` | 所屬平台範圍 |
| `permissionRules` | `PolicyRule[]` | 存取控制與授權規則 |
| `workflowRules` | `PolicyRule[]` | 觸發條件與步驟規則 |
| `notificationRules` | `PolicyRule[]` | 通知路由與抑制規則 |
| `auditRules` | `PolicyRule[]` | 必須記錄的決策與行為規則 |
| `revision` | `number` | 單調遞增的版本號 |

### 不變數

- 同一個 `contextId` 在同一時間只能有一份生效中的 catalog revision
- 每一條規則都必須有明確的 `subject`, `condition`, `effect`
- permission、workflow、notification、audit 的規則不得互相覆蓋成不可判定狀態

---

## 聚合根：IntegrationContract

### Hexagonal role

`IntegrationContract` 管理平台與外部系統互動時所需的 endpoint、通訊協議、認證參照與 delivery policy。它定義 business-facing integration 語言，但不直接執行外部呼叫。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|---|---|---|
| `integrationContractId` | `IntegrationContractId` | 整合契約識別值 |
| `contextId` | `PlatformContextId` | 所屬平台範圍 |
| `endpointRef` | `EndpointRef` | 外部端點參照 |
| `protocol` | `IntegrationProtocol` | `http | webhook | queue | topic | file` |
| `authenticationRef` | `SecretReference` | 認證資料參照 |
| `subscribedSignals` | `SignalSubscription[]` | 外部系統需要的訊號清單 |
| `deliveryPolicy` | `DeliveryPolicy` | 重試、超時與冪等策略 |
| `contractState` | `ContractState` | `draft | active | paused | revoked` |

### 不變數

- `active` 的 integration contract 必須有 endpoint 與 authentication reference
- 非同步 delivery 必須定義 retry / timeout policy
- 訂閱的 signals 必須對應到 platform published language 中存在的事件名稱

---

## 聚合根：SubscriptionAgreement

### Hexagonal role

`SubscriptionAgreement` 代表一個平台範圍目前採用的方案、權益與限制。它是 capability enablement 與 usage governance 的商業邊界。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|---|---|---|
| `subscriptionAgreementId` | `SubscriptionAgreementId` | 訂閱協議識別值 |
| `contextId` | `PlatformContextId` | 所屬平台範圍 |
| `planCode` | `PlanCode` | 方案代碼 |
| `entitlements` | `Entitlement[]` | 可使用能力與配額 |
| `usageLimits` | `UsageLimit[]` | 量化限制 |
| `billingState` | `BillingState` | `pending | active | delinquent | expired | cancelled` |
| `validPeriod` | `EffectivePeriod` | 生效區間 |

### 不變數

- 權益只能由 `planCode` 推導，不得任意脫離方案定義
- `expired` 或 `cancelled` 的 agreement 不能讓新 capability 生效
- usage limit 超量時，平台必須回傳明確的治理結果，而不是無聲失敗

---

## 主要值物件

| 值物件 | 用途 |
|---|---|
| `PlatformCapability` | 能力名稱、狀態、對應 entitlement 與生命週期 |
| `SubjectScope` | actor、account、organization 等主體邊界 |
| `PolicyRule` | `subject`, `condition`, `effect`, `priority` 的規則表達 |
| `ConfigurationProfileRef` | 生效配置輪廓的參照 |
| `Entitlement` | 某方案允許的 capability 與額度 |
| `UsageLimit` | 用量限制與超限策略 |
| `SignalSubscription` | integration contract 所需接收的事件集合 |
| `DeliveryPolicy` | timeout、retry、idempotency、backoff 設定 |
| `NotificationRoute` | 通知通道與對象語言 |
| `ObservabilitySignal` | 指標、追蹤、告警語言的統一封裝 |

## 主要識別值與狀態值

| 型別 | 用途 |
|---|---|
| `PlatformContextId` | `PlatformContext` 的識別值 |
| `PolicyCatalogId` | `PolicyCatalog` 的識別值 |
| `IntegrationContractId` | `IntegrationContract` 的識別值 |
| `SubscriptionAgreementId` | `SubscriptionAgreement` 的識別值 |
| `PlatformLifecycleState` | `draft | active | suspended | retired` |
| `ContractState` | `draft | active | paused | revoked` |
| `BillingState` | `pending | active | delinquent | expired | cancelled` |
| `EffectivePeriod` | 生效起訖區間 |
| `EndpointRef` | 外部端點參照 |
| `SecretReference` | 認證資料參照 |

## 聚合邊界規則

- `PlatformContext` 負責 capability enablement，不直接儲存外部 integration 細節
- `PolicyCatalog` 負責規則版本化，不直接執行通知或外呼
- `IntegrationContract` 負責外部交付契約，不直接決定權限或訂閱方案
- `SubscriptionAgreement` 負責 entitlement 與限制，不直接承載通知或 workflow 規則
- repository ports 負責聚合的載入與保存；聚合本身不持有 persistence 策略

跨聚合規則若無法收斂到單一聚合，應交由 `domain-services.md` 中的 domain services 處理。
