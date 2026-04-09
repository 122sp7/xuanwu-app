# Domain Events — platform

platform blueprint 將 domain event 視為已發生事實的 published language。事件 schema 由 domain 擁有，transport 與 delivery 由 event publisher adapter 實作。

## Event Envelope

platform 事件應至少包含以下欄位：

| 欄位 | 用途 |
|---|---|
| `type` | 事件名稱，格式採用 `<subdomain>.<fact>` |
| `aggregateType` | 事件所屬聚合型別 |
| `aggregateId` | 聚合識別值 |
| `contextId` | 平台範圍識別值 |
| `occurredAt` | 事件發生時間，使用 ISO 8601 |
| `version` | 聚合版本或事件版本 |
| `correlationId` | 關聯整串工作流程 |
| `causationId` | 指出直接觸發來源 |
| `actorId` | 觸發此事實的主體 |
| `payload` | 事件特定資料 |

## 發出事件

| 事件 | 何時發出 | 核心 payload |
|---|---|---|
| `platform.context_registered` | 平台範圍建立完成 | `subjectScope`, `lifecycleState` |
| `platform.capability_enabled` | 某項 capability 被啟用 | `capabilityKey`, `entitlementRef` |
| `platform.capability_disabled` | 某項 capability 被停用 | `capabilityKey`, `reason` |
| `policy.catalog_published` | 新的政策版本生效 | `policyCatalogId`, `revision` |
| `config.profile_applied` | 配置輪廓完成套用 | `configurationProfileRef`, `changedKeys` |
| `permission.decision_recorded` | 完成一次可追蹤授權決策 | `decision`, `subjectRef`, `resourceRef` |
| `integration.contract_registered` | 整合契約生效或更新 | `integrationContractId`, `protocol`, `endpointRef` |
| `integration.delivery_failed` | 外部交付失敗 | `integrationContractId`, `deliveryAttempt`, `failureCode` |
| `subscription.agreement_activated` | 訂閱協議進入生效狀態 | `subscriptionAgreementId`, `planCode`, `validUntil` |
| `onboarding.flow_completed` | 新主體完成 onboarding 主要流程 | `onboardingId`, `subjectRef`, `completedSteps` |
| `compliance.policy_verified` | 合規政策檢核通過或更新 | `policyRef`, `verificationResult`, `effectivePeriod` |
| `referral.reward_recorded` | 推薦獎勵被核算並記錄 | `referralId`, `rewardType`, `rewardAmount` |
| `workflow.trigger_fired` | workflow trigger 被成功發出 | `triggerKey`, `triggeredBy`, `triggeredAt` |
| `background-job.enqueued` | 背景作業被提交到佇列 | `jobId`, `jobType`, `scheduleAt` |
| `content.asset_published` | 內容資產進入發布狀態 | `assetId`, `publicationState`, `publishedAt` |
| `search.query_executed` | 搜尋查詢完成並產生結果 | `queryId`, `queryText`, `resultCount` |
| `notification.dispatch_requested` | 建立通知派送請求 | `channel`, `recipientRef`, `templateKey` |
| `audit.signal_recorded` | 寫入一條不可變 audit signal | `signalType`, `severity`, `subjectRef` |
| `observability.signal_emitted` | 發出指標、追蹤或告警訊號 | `signalName`, `signalLevel`, `sourceRef` |
| `analytics.event_recorded` | 分析事件被記錄與聚合 | `eventName`, `metricRef`, `subjectRef` |
| `support.ticket_opened` | 支援工單被建立 | `ticketId`, `priority`, `requesterRef` |

## 事件擁有者

| 事件 | 主要擁有者 |
|---|---|
| `platform.context_registered` / `platform.capability_*` | `PlatformContext` |
| `policy.catalog_published` | `PolicyCatalog` |
| `integration.contract_registered` / `integration.delivery_failed` | `IntegrationContract` |
| `subscription.agreement_activated` | `SubscriptionAgreement` |
| `onboarding.flow_completed` | application layer 在 onboarding 決策完成後發出 |
| `compliance.policy_verified` | application layer 在合規檢核完成後發出 |
| `referral.reward_recorded` | application layer 在推薦獎勵核算後發出 |
| `workflow.trigger_fired` | application layer 在 domain rule 通過後發出 |
| `background-job.enqueued` | application layer 在工作流轉交背景作業後發出 |
| `content.asset_published` | application layer 在內容發布決策完成後發出 |
| `search.query_executed` | application layer 在搜尋執行完成後發出 |
| `notification.dispatch_requested` | application layer 在 delivery request 建立後發出 |
| `audit.signal_recorded` | application layer 在 evidence sink 接受記錄後發出 |
| `observability.signal_emitted` | application layer 在 observability sink 接受訊號後發出 |
| `analytics.event_recorded` | application layer 在分析匯流接收事件後發出 |
| `support.ticket_opened` | application layer 在支援案件建立後發出 |

## 訂閱事件

platform 也會透過 input ports 接收外部或相鄰子域傳入的事件型訊號。這些訊號通常會被轉成 application commands，再由 use case handlers 處理。

| 輸入訊號 | 用途 |
|---|---|
| `identity.subject_authenticated` | 建立或更新主體上下文 |
| `account.profile_amended` | 更新帳戶輪廓相關治理判斷 |
| `organization.membership_changed` | 更新組織邊界與角色映射 |
| `subscription.entitlement_changed` | 調整 capability enablement 與限制 |
| `integration.callback_received` | 接收外部系統回呼結果 |
| `workflow.execution_completed` | 接收工作流執行結果以觸發後續通知、稽核與觀測 |

## 事件設計規則

- 事件名稱必須描述事實，而不是請求
- domain event 只描述業務語意，不攜帶 adapter-specific metadata
- event publisher 是 output port，不能被聚合直接取代
- 事件 payload 應足以讓下游 adapter 或 handler 理解事實，但不應把整個聚合序列化出去
- 若事件來自 application orchestration 而不是單一 aggregate，必須在文件中標示其擁有位置，避免假裝它來自不存在的 aggregate

## 事件命名規則

推薦格式：

```text
<subdomain>.<fact>
```

例如：

- `policy.catalog_published`
- `workflow.trigger_fired`
- `notification.dispatch_requested`
- `audit.signal_recorded`

這種命名能讓事件在 transport 層之外仍保持可讀性與一致性。

## 與 docs/README 的分工

- 本文件只描述事件命名、事件擁有者與事件收發清單
- 聚合不變數請見 `aggregates.md`
- 跨聚合規則請見 `domain-services.md`
