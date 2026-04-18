# 5101 Accidental Complexity — `platform/domain/` 102 個 TODO Stub 文件

- Status: Resolved
- Date: 2026-04-13
- Resolved: 2026-04-13
- Category: Complexity Smells > Accidental Complexity

> **路徑說明**：此 ADR 中的路徑使用舊版 `modules/` 前綴（架構遷移前）。現行實作位置為 `src/modules/` 下的對應路徑。

> **路徑說明**：此 ADR 中的路徑使用舊版 `modules/` 前綴（架構遷移前）。現行實作位置為 `src/modules/` 下的對應路徑。

## Context

意外複雜性（Accidental Complexity）指超出解決問題所必要的複雜度，由工具選擇、結構決定或偶然因素引入。
空殼占位文件（Hollow Stub Files）是一種特殊形式：它們在文件系統上創造了大量的「代碼位置」幻覺，
但不承載任何可執行的業務邏輯，反而製造了以下複雜性：
- 目錄瀏覽時看似豐富的 domain 模型，實際上無法運行
- 每個 stub 文件都是「未完成工作的信號雜訊」
- IDE 自動補全和搜索索引中充滿了不可用的符號

掃描 `modules/platform/domain/` 發現 **102 個 TODO 標記**，主要集中在：

### Stub 分佈

**24 個 domain event 文件（全部都是純 TODO）：**

```
modules/platform/domain/events/
  AnalyticsEventRecordedEvent.ts        → // TODO: implement
  AuditSignalRecordedEvent.ts           → // TODO: implement
  BackgroundJobEnqueuedEvent.ts         → // TODO: implement
  CompliancePolicyVerifiedEvent.ts      → // TODO: implement
  ConfigProfileAppliedEvent.ts          → // TODO: implement
  ContentAssetPublishedEvent.ts         → // TODO: implement
  IntegrationContractRegisteredEvent.ts → // TODO: implement
  IntegrationDeliveryFailedEvent.ts     → // TODO: implement
  NotificationDispatchRequestedEvent.ts → // TODO: implement
  ObservabilitySignalEmittedEvent.ts    → // TODO: implement
  OnboardingFlowCompletedEvent.ts       → // TODO: implement
  PermissionDecisionRecordedEvent.ts    → // TODO: implement
  PlatformCapabilityDisabledEvent.ts    → // TODO: implement
  PlatformCapabilityEnabledEvent.ts     → // TODO: implement
  PlatformContextRegisteredEvent.ts     → // TODO: implement
  PolicyCatalogPublishedEvent.ts        → // TODO: implement
  ReferralRewardRecordedEvent.ts        → // TODO: implement
  SearchQueryExecutedEvent.ts           → // TODO: implement
  SubscriptionAgreementActivatedEvent.ts→ // TODO: implement
  SupportTicketOpenedEvent.ts           → // TODO: implement
  WorkflowTriggerFiredEvent.ts          → // TODO: implement
  + 3 個 published/ utility stubs
```

**3 個 entity stub 文件：**

```
modules/platform/domain/entities/
  PolicyRuleEntity.ts        → // TODO: implement PolicyRuleEntity
  SignalSubscriptionEntity.ts→ // TODO: implement SignalSubscriptionEntity
  DispatchContextEntity.ts   → // TODO: implement DispatchContextEntity
```

**2 個 constants stub 文件：**

```
modules/platform/domain/constants/
  PlatformLifecycleConstants.ts → // TODO: implement
  PlatformErrorCodeConstants.ts → // TODO: implement
```

**3 個 published/ utility stub 文件：**

```
modules/platform/domain/events/published/
  publishSinglePlatformEvent.ts    → // TODO: implement
  publishBatchPlatformEvents.ts    → // TODO: implement
  buildPublishedEventEnvelope.ts   → // TODO: implement
```

### Stub 的實際內容

以 `AuditSignalRecordedEvent.ts` 為例（代表 24 個 event stubs 的共同結構）：

```typescript
/**
 * AuditSignalRecordedEvent
 * Event type: "audit.signal_recorded"
 * Owner:      application layer (audit-log)
 * [rich documentation block ~20 lines]
 */

// TODO: implement AuditSignalRecordedEvent payload type and factory function
```

每個 stub 文件都有精心書寫的 JSDoc，但沒有任何可執行代碼。
文件傳達了「設計意圖」，但同時也傳達了「這是一個無法使用的佔位符」。

### Accidental Complexity 的具體表現

1. **目錄遍歷噪音**：`platform/domain/events/` 有 21 個 .ts 文件，但 20 個是空殼，只有 `index.ts` 包含實際的 event type 常數定義。
2. **IDE 索引膨脹**：20 個 empty 文件被 TypeScript compiler 和 IDE 索引，增加分析負擔但無法提供任何自動補全或類型支援。
3. **搜索干擾**：搜索 `AuditSignalRecorded` 會同時找到 `index.ts` 的常數定義 和 `AuditSignalRecordedEvent.ts` 的空殼，造成搜索結果歧義。
4. **錯誤的完整感**：新加入開發者看到 `platform/domain/events/` 有 20 個文件，可能誤以為 domain events 已實作完整，而忽略了深入閱讀的必要。

### 文件記錄了有價值的設計意圖

值得注意的是：這些 stub 文件的 JSDoc **確實有價值**——它們記錄了 event 的語意、發出時機、payload 結構。
問題不在於文件本身，而在於「設計文件」與「可執行代碼的佔位符」混在了同一個 `.ts` 文件中。

## Decision

1. **不刪除設計意圖文件**：stub 文件中的 JSDoc 應保留，但調整形式。
2. **將設計意圖從 `.ts` stub 移出至 `.md` 設計文件**：
   - 新建 `modules/platform/domain/events/DESIGN.md`，集中記錄所有 24 個 event 的設計意圖。
   - 刪除對應的 `.ts` stub 文件（或將其保留為最小 export：`export type { SomethingPayload }` 一旦實作）。
3. **備選：立即實作**：若某些 event（如 `AuditSignalRecordedEvent`、`BackgroundJobEnqueuedEvent`）業務上已就緒，直接實作而非保留 stub。
4. **建立「stub 追蹤機制」**：對確實需要未來實作的 stub，使用 GitHub Issues 追蹤，而非在代碼庫中留下空殼文件。

## Consequences

正面：
- `platform/domain/events/` 目錄只包含實際可用的代碼，目錄遍歷不產生噪音。
- TypeScript compiler 需要索引的文件數量減少。
- 設計意圖以 `.md` 形式保存，不被 TypeScript 工具處理。

代價：
- 需要決定哪些 event 立即實作、哪些以 DESIGN.md 記錄、哪些以 Issue 追蹤。
- 21 個文件的處理決策（但每個決策很小）。

## Resolution

**已解決（2026-04-13）**

- 21 個 TODO stub .ts 文件（event payload placeholders）已刪除
- 3 個 published/ utility stub 文件已刪除
- 設計意圖已集中記錄至 `modules/platform/domain/events/DESIGN.md`
- `published/index.ts` 已簡化為 JSDoc 指向 DESIGN.md 的最小佔位

刪除前：`platform/domain/events/` 包含 27 個 .ts 文件（20 個 TODO stub + 3 個 published stub + index.ts + published/index.ts + mapper + published events）
刪除後：`platform/domain/events/` 包含 `index.ts`、`published/index.ts`、`DESIGN.md`，加上已實作的文件

## 關聯 ADR

- **3201** (Duplication)：stub 文件中的 event type 常數已在 `domain/events/index.ts` 定義，存在文件層面的重複（已解決）
- **5201** (Cognitive Load)：大量 stub 文件增加了閱讀 platform domain 的認知負荷（解決此 ADR 有助於降低認知負荷）
