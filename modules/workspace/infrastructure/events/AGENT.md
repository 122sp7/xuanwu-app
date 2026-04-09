# infrastructure/events — Event Adapters（事件基礎設施適配器）

此目錄放 **workspace 對外事件發布的 concrete implementation**。

> 這裡只實作「怎麼發佈事件」，不定義「什麼是事件」或「何時該發」。

---

## ✅ 屬於此處

| 類型 | 範例 |
|------|------|
| Event publisher implementation | `SharedWorkspaceDomainEventPublisher` |
| Bus / dispatcher adapter | 連接 shared event bus、event store、pubsub |
| Event envelope mapper | 將 domain event 轉成外部 transport payload |
| 發布基礎設施細節 | retry、dispatch、transport glue code |

---

## ❌ 禁止放入

| 禁止項目 | 原因 |
|----------|------|
| Domain event 定義 | 放 `domain/events/` |
| Use case 分支決策 / 業務規則 | 放 `application/` 或 `domain/services/` |
| Process Manager / Saga | 放 `application/services/` |
| React / Route Handler / CLI code | 放 `interfaces/` |

---

## 依賴箭頭

```txt
application/use-cases
    -> ports/output/WorkspaceDomainEventPublisher
infrastructure/events
    -> ports/output
infrastructure/events
    -> domain/events
```

`infrastructure/events` **不可**依賴 `interfaces/`，也不應承擔 domain 決策。