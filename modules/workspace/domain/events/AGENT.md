# domain/events — Domain Events（領域事件）

此目錄放 **workspace bounded context 對外發布的事件語言**。

> Domain Event 是 published language，不是 event bus adapter，也不是 process manager。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Event type / discriminated union | `workspace.created`、`workspace.lifecycle_transitioned` |
| Event payload type | `WorkspaceCreatedEvent` |
| Event 建構 helper | 只服務事件建立的薄型 helper |

**判斷準則**：如果它描述的是「workspace 發生了什麼」，而不是「系統要怎麼處理」，就放這裡。

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| Event bus / dispatcher implementation | 放 `infrastructure/events/` |
| Event subscriber / process manager | 放 `application/services/` |
| Retry / dead-letter / transport 細節 | 屬於 infrastructure |
| UI notification、toast、路由邏輯 | 不屬於 domain event 語言 |

---

## 依賴箭頭

```txt
domain/aggregates
    -> domain/events
domain/services
    -> domain/events (type only, optional)
application/use-cases
    -> domain/events
ports/output/WorkspaceDomainEventPublisher
    -> domain/events (type only)
```

`domain/events` **不可**依賴 `infrastructure/`、`interfaces/`、`application/services/`。

---

## 命名慣例

```
workspace.events.ts
create-workspace-created-event.ts
```

事件名稱優先使用 `workspace.<verb_past_tense>` 風格，保持 published language 穩定。