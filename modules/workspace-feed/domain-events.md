# workspace-feed — Domain Events

> **Canonical DDD reference:** `../../docs/ddd/workspace-feed/domain-events.md`

本文件對齊 `docs/ddd/workspace-feed/domain-events.md`，作為 `workspace-feed` 的事件程式碼入口索引。

## Event Files
- `domain/events/workspace-feed.events.ts`

## Event Design Rules

- 事件命名與 payload 設計以 canonical DDD 文件為準
- 涉及 Shared Kernel 時，遵循 `modules/shared/domain/events.ts` 的基礎契約
- 跨模組消費事件時，只依賴公開事件語意，不依賴私有實作細節

## 參考

- `../../docs/ddd/workspace-feed/domain-events.md`
- `../../docs/ddd/workspace-feed/context-map.md`
