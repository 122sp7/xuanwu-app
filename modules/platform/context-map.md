# Context Map — platform

本文件描述 platform blueprint 內部子域與外部世界之間的主要協作方向。這裡的 map 是本地平台地圖，用來說明 platform capabilities 如何透過 ports/adapters 組裝，而不是描述全系統所有上下文。

## Local Platform Map

```text
identity -> account -> permission
identity -> audit

organization -> permission
organization -> workflow
organization -> audit

subscription -> permission
subscription -> config
subscription -> integration
subscription -> workflow

config -> integration
config -> notification
config -> observability
config -> workflow

permission -> integration
permission -> notification
permission -> workflow

workflow -> notification
workflow -> audit
workflow -> observability

integration -> audit
integration -> observability

notification -> audit
notification -> observability

audit -> observability
```

## 子域協作關係

| Source | Target | 共享語言 | 為何需要這個關係 |
|---|---|---|---|
| `identity` | `account` | `AuthenticatedSubject`, `SubjectScope` | 已驗證主體需要被轉成可治理的帳戶輪廓 |
| `account` | `permission` | `AccountProfile`, `PermissionDecision` | 權限決策需要帳戶屬性與狀態 |
| `organization` | `permission` | `MembershipBoundary`, `RoleAssignment` | 存取控制常依賴組織成員語意 |
| `subscription` | `config` | `Entitlement`, `UsageLimit` | 配置與 capability toggle 不能超出方案權益 |
| `subscription` | `integration` | `PlanConstraint`, `DeliveryAllowance` | 某些整合只在特定方案可用 |
| `config` | `workflow` | `ConfigurationProfile`, `WorkflowPolicy` | workflow 需要使用被發佈的規則與參數 |
| `config` | `permission` | `AccessPolicy`, `ConfigurationProfile` | 授權決策常需要配置化的 policy 組態 |
| `permission` | `workflow` | `PermissionDecision` | workflow trigger 必須先通過授權 |
| `permission` | `audit` | `PermissionDecision`, `AuditClassification` | 關鍵授權決策需要留下證據 |
| `workflow` | `notification` | `NotificationDispatch` | 觸發結果常需通知人或系統 |
| `workflow` | `audit` | `AuditSignal` | 關鍵觸發必須留下不可變紀錄 |
| `integration` | `observability` | `ObservabilitySignal` | 外部交付結果需要被量測與告警 |
| `notification` | `audit` | `DispatchOutcome`, `AuditSignal` | 派送成功或失敗都屬治理軌跡 |
| `audit` | `observability` | `AuditClassification`, `ObservabilitySignal` | 稽核事件可轉為 operational diagnostics |

## 語言完整性規則

若 context map 引入新的共享語言，例如 `WorkflowPolicy`、`AuditClassification` 或 `DispatchOutcome`，該術語必須同時出現在 `ubiquitous-language.md`。若沒有，表示 map 仍然有設計缺口。

## 與外部世界的六邊形互動

### Driving Side

外部輸入通常來自：

- API / UI 請求
- scheduler
- queue consumer
- webhook receiver
- operator CLI

它們都不應直接觸碰 domain model，而必須先經過 input ports 與 application services。

### Driven Side

platform 會透過 output ports 驅動以下外部能力：

- repository persistence
- domain event publishing
- notification channels
- external integration endpoints
- metrics / tracing / alerting backends
- audit storage

## Context Map 規則

- `identity`, `account`, `organization` 組成主體與邊界語言
- `subscription`, `config`, `permission` 組成治理語言
- `workflow`, `integration`, `notification` 組成執行與交付語言
- `audit`, `observability` 組成追蹤與診斷語言

一個子域若同時扮演多種角色，應優先共享語言與事件，而不是直接共享內部結構。
