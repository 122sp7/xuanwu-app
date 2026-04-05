# Aggregates ??shared

## 瘜冽?

`shared` ??Shared Kernel嚗??璆剖????嫘??芣?靘蝷??亙?蝢押?

---

## ?箇?隞嚗omainEvent

```typescript
// modules/shared/domain/events.ts
interface DomainEvent {
  readonly type: string;       // discriminant: "module.action"
  readonly occurredAt: string; // ISO 8601 ??銝 Date嚗???occurredAtISO
}
```

**??芋蝯???鈭辣隞?賜匱?踵迨?箇?隞??*

---

## ?箇?隞嚗ventRecord

```typescript
// modules/shared/domain/event-record.ts
interface EventRecord {
  readonly eventId: string;    // UUID v4
  readonly occurredAt: string; // ISO 8601
  readonly actorId?: string;   // ????ID嚗?賂?
  readonly correlationId?: string;
  readonly causationId?: string;
}
```

---

## 撌亙?

| ? / 撌亙 | 隤芣? |
|------------|------|
| `ID` | string alias嚗?潭??平??ID |
| `Timestamp` | Firebase Timestamp ??亙? |
| `domain/slug-utils.ts` | URL-safe slug ??嚗toSlug()`, `isValidSlug()`嚗?|
