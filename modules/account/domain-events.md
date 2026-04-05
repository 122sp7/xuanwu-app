# account — Domain Events

> **Canonical DDD reference:** `../../docs/ddd/account/domain-events.md`

本文件對齊 `docs/ddd/account/domain-events.md`，作為 `account` 的事件程式碼入口索引。

## Event Files
- 目前沒有獨立的 `domain/events/*` 檔案。

## Event Design Rules

- 事件命名與 payload 設計以 canonical DDD 文件為準
- 涉及 Shared Kernel 時，遵循 `modules/shared/domain/events.ts` 的基礎契約
- 跨模組消費事件時，只依賴公開事件語意，不依賴私有實作細節

## 參考

- `../../docs/ddd/account/domain-events.md`
- `../../docs/ddd/account/context-map.md`
