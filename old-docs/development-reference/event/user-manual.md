---
title: Event Core user manual
description: User manual for the Event Core domain — how domain events are captured, stored, and dispatched across Xuanwu modules.
---

# Event Core 使用手冊

> **文件版本**：v1.0.0
> **最後更新**：2026-03-20
> **目標讀者**：工程師、平台架構師、模組 Owner

---

## 概覽

Event Core 是 xuanwu-app 的**領域事件基礎**。它讓每個模組能以統一方式：

- 📌 **捕捉**業務狀態變更（例如：任務指派、發票發出、文件建立）
- 💾 **持久化**事件紀錄（事件即真相）
- 📡 **派送**事件至其他模組（解耦模組間的直接依賴）
- 🔍 **查詢**聚合根的完整事件時間線

---

## 事件是什麼？

在 xuanwu-app 中，**Domain Event（領域事件）**代表一個業務事實——某件事**確實已發生**。

範例：

| 事件名稱 | 意義 |
|---------|------|
| `Task.Task.Assigned` | 某個任務被指派給成員 |
| `Wiki.WikiDocument.Created` | 知識文件被建立 |
| `Schedule.ScheduleRequest.Submitted` | 資源請求已提交 |
| `Billing.Invoice.Issued` | 發票已開立 |

---

## 事件生命週期

```
1. 模組 write-side 完成業務操作
        ↓
2. 呼叫 PublishDomainEventUseCase
        ↓
3. 事件寫入 EventStore（狀態：undispatched）
        ↓
4. 事件發布至 EventBus
        ↓
5. 事件標記為 dispatched
        ↓
6. 訂閱方接收事件 → 更新 projection / 觸發 side-effect
```

---

## 如何查詢某個聚合根的事件歷史？

使用 `ListEventsByAggregateUseCase`（透過 `EventController`）：

```typescript
const events = await eventController.listByAggregate({
  aggregateType: 'Task',
  aggregateId:   'task_abc123',
})
// 回傳：按 occurredAt 升序排列的 DomainEvent[]
```

---

## 事件追蹤欄位（EventMetadata）

每個事件可攜帶追蹤用的 metadata：

| 欄位 | 用途 |
|------|------|
| `correlationId` | 跨服務追蹤同一筆業務流程 |
| `causationId` | 指出哪個事件觸發了這個事件 |
| `actorId` | 誰執行了這個操作 |
| `organizationId` | 多租戶隔離 |
| `workspaceId` | 工作區範圍 |
| `traceId` | 分散式追蹤 |

---

## 重試機制

若事件派送失敗，系統依據 **dispatch policy** 決定是否重試：

| 設定 | 預設值 |
|------|--------|
| 最大重試次數（`RETRY_LIMIT`） | 3 次 |
| 批次查詢大小（`BATCH_SIZE`） | 100 |
| 延遲策略 | Exponential back-off（指數退避） |

---

## 常見問題

### Q: 事件會重複嗎？
A: 系統保證 **at-least-once** 派送語意，代表事件可能重複派送。訂閱方應以 `event.id` 作為冪等鍵，避免重複處理同一事件。

### Q: 能不能直接查 EventStore 而不用 use-case？
A: 不建議。應透過 `EventController` → `ListEventsByAggregateUseCase` → `IEventStoreRepository` 的標準路徑，保持層次清晰。

### Q: in-memory adapter 可以上線嗎？
A: 不行。`InMemoryEventStoreRepository` 和 `NoopEventBusRepository` 僅用於本地開發和測試。生產環境需替換為 Firestore / Pub/Sub adapter。

### Q: 我的模組需要訂閱事件怎麼做？
A: 目前 event bus adapter 為 noop scaffold。完整訂閱實作（例如 Firestore trigger / Pub/Sub push）待後續 infrastructure adapter 完成後對接。

---

## 參考文件

| 文件 | 路徑 |
|------|------|
| 架構設計 | `docs/decision-architecture/architecture/event.md` |
| 開發契約 | `docs/development-reference/reference/development-contracts/event-contract.md` |
| 開發指南 | `docs/development-reference/event/development-guide.md` |
| 整體架構指南 | `agents/knowledge-base.md` |
