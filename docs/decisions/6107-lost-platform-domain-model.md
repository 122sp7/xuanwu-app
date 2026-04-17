# 6107 Migration Gap — platform domain model


> ⚠️ **本文件為「僅記錄」文件 — 不執行實施**
> 此 ADR 的唯一目的是記錄遷移缺口，作為未來蒸餾工作的基線參考。
> **任何 agent 或開發者不得依據本文件直接新增、修改或刪除任何程式碼。**

- Status: ⛔ 僅記錄 — 不實施（Record Only — Do Not Implement）
- Date: 2026-04-17
- Category: Migration Gap > platform

## Context

`xuanwu-app-skill` 快照的 `modules/platform/domain/` 包含 100+ 文件、~3,000 lines 的完整領域模型。

對應的 `src/modules/platform/` 只有 adapters（shell UI + firebase）層，**沒有獨立的 domain 目錄**，損失率 69%（6,074 → 1,854 lines）。

### 遺失的 Aggregates（domain/aggregates/）

```
platform/domain/aggregates/
  IntegrationContract.ts    — 整合合約聚合根（第三方 API 整合生命週期）
  PlatformContext.ts        — 平台情境聚合根（account/org/tenant 跨域情境）
  PolicyCatalog.ts          — 政策目錄聚合根（合規政策版本管理）
  SubscriptionAgreement.ts  — 訂閱協議聚合根（billing ↔ platform 邊界橋接）
```

### 遺失的 Output Ports（domain/ports/）

共 20+ 個獨立 port 文件：

```
AccountRepository.ts         — Account 倉儲介面
AnalyticsSink.ts             — 分析事件發送 port
AuditSignalStore.ts          — 審計信號儲存 port
CompliancePolicyStore.ts     — 合規政策儲存 port
DomainEventPublisher.ts      — 跨域事件發布 port
JobQueuePort.ts              — 背景任務佇列 port
NotificationGateway.ts       — 通知推送閘道 port
WorkflowDispatcherPort.ts    — 工作流程派送 port
FileStoragePort.ts           — 文件儲存抽象 port
PermissionStorePort.ts       — 權限儲存 port
SearchIndexPort.ts           — 搜索索引 port
ConfigStorePort.ts           — 配置儲存 port
ObservabilityPort.ts         — 可觀測性信號 port
IntegrationRegistryPort.ts   — 整合登錄 port
TenantIsolationPort.ts       — 租戶隔離 port
...（共 20+ 個）
```

### 遺失的 Value Objects（domain/value-objects/）

共 25+ 個，核心包括：

```
Entitlement.ts           (28 lines) — 功能授權值物件
PermissionDecision.ts    (32 lines) — 權限決策結果
PlanConstraint.ts        (30 lines) — 計畫約束（用量上限等）
ResourceQuota.ts         — 資源配額
ComplianceFlag.ts        — 合規標記
AuditSignal.ts           — 審計信號
OrganizationScope.ts     — 組織作用域
TenantIsolationKey.ts    — 租戶隔離鍵
...（共 25+ 個）
```

### 遺失的 Domain Services（domain/services/）

共 9 個：

```
CapabilityEntitlementPolicy.ts      — 能力授權策略服務
PermissionResolutionService.ts      — 權限解析服務
WorkflowDispatchPolicy.ts           — 工作流程派送策略服務
AuditSignalService.ts               — 審計信號服務
CompliancePolicyService.ts          — 合規政策服務
IntegrationContractService.ts       — 整合合約服務
NotificationDispatchService.ts      — 通知派送服務
ResourceQuotaEnforcementService.ts  — 資源配額執行服務
TenantIsolationService.ts           — 租戶隔離服務
```

### 遺失的 Domain Events（domain/events/）

共 24 個 event 定義（見 ADR 5101，已記錄為舊版 stub，需補充為完整實作）：

```
AuditSignalRecordedEvent, BackgroundJobEnqueuedEvent,
CompliancePolicyVerifiedEvent, DomainEventPublishedEvent,
NotificationDispatchRequestedEvent, PermissionDecisionRecordedEvent,
PlatformCapabilityEnabledEvent, PlatformContextRegisteredEvent,
SubscriptionAgreementActivatedEvent, WorkflowTriggerFiredEvent...（共 24 個）
```

## Decision

**不實施**。僅記錄缺口。

`Entitlement`（28 lines）、`PermissionDecision`（32 lines）、`PermissionResolutionService` 是影響跨域最廣的三個缺口，應優先補回。

## Consequences

- platform 模組沒有 domain layer，所有業務決策（權限、配額、合規）無 domain 層保護。
- 跨域 API（FileAPI、PermissionAPI）缺少對應的 domain aggregate 作為業務根基。

## 關聯 ADR

- **6108** platform API contracts：contracts.ts 引用此 domain model 中的型別。
- **0014** 八主域重切：platform domain 的邊界已由 ADR 0014 確定，蒸餾時需對齊。
