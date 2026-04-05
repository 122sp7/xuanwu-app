# Ubiquitous Language ??shared

> **蝭?嚗?* 頝冽???BC ?鈭怠蝷?隤?Shared Kernel嚗?

## 銵?摰儔

| 銵? | ?望? | 摰儔 | 隞?Ⅳ雿蔭 |
|------|------|------|---------|
| ??鈭辣 | DomainEvent | ?????隞嗥??箇?隞嚗 `type` ??`occurredAt` | `modules/shared/domain/events.ts` |
| 鈭辣閮? | EventRecord | 蝔賣/餈質馱?函?鈭辣閮?嚗eventId`, `occurredAt`, `actorId`嚗?| `modules/shared/domain/event-record.ts` |
| ?潛??? | occurredAt | 鈭辣?潛???嚗?*ISO 8601 摮葡**?澆?嚗? Date ?拐辣嚗?| `DomainEvent.occurredAt` |
| Slug | Slug | URL-safe ???亦泵摮葡 | `modules/shared/domain/slug-utils.ts` |

## ?閬?

`occurredAt` 敹???**ISO 8601 摮葡**嚗string`嚗?銝 `Date`?Timestamp` ?摮??匱??`DomainEvent` ??隞嗡??ａ敹??萄?甇方?蝭?

## 蝳迫?踵?銵?

| 甇?Ⅱ | 蝳迫 |
|------|------|
| `occurredAt` | `occurredAtISO`, `timestamp`, `createdAt`嚗??箔?隞嗆??嚗?|
| `DomainEvent` | `BaseEvent`, `Event` |
