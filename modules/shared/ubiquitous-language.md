# Ubiquitous Language — shared

> **範圍：** 跨所有 BC 的共享基礎術語（Shared Kernel）

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 領域事件 | DomainEvent | 所有領域事件的基礎介面，含 `type` 和 `occurredAt` | `modules/shared/domain/events.ts` |
| 事件記錄 | EventRecord | 稽核/追蹤用的事件記錄（`eventId`, `occurredAt`, `actorId`） | `modules/shared/domain/event-record.ts` |
| 發生時間 | occurredAt | 事件發生時間，**ISO 8601 字串**格式（非 Date 物件） | `DomainEvent.occurredAt` |
| Slug | Slug | URL-safe 的識別符字串 | `modules/shared/domain/slug-utils.ts` |

## 關鍵規則

`occurredAt` 必須是 **ISO 8601 字串**（`string`），不是 `Date`、`Timestamp` 或數字。所有繼承 `DomainEvent` 的事件介面都必須遵守此規範。

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `occurredAt` | `occurredAtISO`, `timestamp`, `createdAt`（作為事件時間戳） |
| `DomainEvent` | `BaseEvent`, `Event` |
