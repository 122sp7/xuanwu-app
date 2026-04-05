# shared — Repositories

> **Canonical DDD reference:** `../../docs/ddd/shared/repositories.md`

本文件對齊 `docs/ddd/shared/repositories.md`，整理 `shared` 的 repository ports 與 infrastructure 實作。

## Domain Repository Ports
- 目前沒有對應檔案。

## Infrastructure Implementations
- `infrastructure/InMemoryEventStoreRepository.ts`
- `infrastructure/NoopEventBusRepository.ts`
- `infrastructure/SimpleEventBus.ts`

## 設計規則

- `domain/repositories/` 定義抽象
- `infrastructure/` 提供實作
- `application/` 只依賴抽象，不依賴具體實作

## 參考

- `../../docs/ddd/shared/repositories.md`
- `./application-services.md`
