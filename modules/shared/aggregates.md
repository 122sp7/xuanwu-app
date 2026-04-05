# Aggregates — shared

## 注意

`shared` 是 Shared Kernel，不包含業務聚合根。它只提供基礎型別定義。

---

## 基礎介面：DomainEvent

```typescript
// modules/shared/domain/events.ts
interface DomainEvent {
  readonly type: string;       // discriminant: "module.action"
  readonly occurredAt: string; // ISO 8601 — 不是 Date，不是 occurredAtISO
}
```

**所有模組的領域事件介面都繼承此基礎介面。**

---

## 基礎介面：EventRecord

```typescript
// modules/shared/domain/event-record.ts
interface EventRecord {
  readonly eventId: string;    // UUID v4
  readonly occurredAt: string; // ISO 8601
  readonly actorId?: string;   // 操作者 ID（可選）
  readonly correlationId?: string;
  readonly causationId?: string;
}
```

---

## 工具型別

| 型別 / 工具 | 說明 |
|------------|------|
| `ID` | string alias，用於所有業務 ID |
| `Timestamp` | Firebase Timestamp 型別別名 |
| `domain/slug-utils.ts` | URL-safe slug 生成（`toSlug()`, `isValidSlug()`） |
