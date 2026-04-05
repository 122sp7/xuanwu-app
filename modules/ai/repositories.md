# ai — Repositories

> **Canonical DDD reference:** `../../docs/ddd/ai/repositories.md`

本文件對齊 `docs/ddd/ai/repositories.md`，整理 `ai` 的 repository ports 與 infrastructure 實作。

## Domain Repository Ports
- `domain/repositories/GraphRepository.ts`
- `domain/repositories/IngestionJobRepository.ts`

## Infrastructure Implementations
- `infrastructure/InMemoryGraphRepository.ts`
- `infrastructure/InMemoryIngestionJobRepository.ts`

## 設計規則

- `domain/repositories/` 定義抽象
- `infrastructure/` 提供實作
- `application/` 只依賴抽象，不依賴具體實作

## 參考

- `../../docs/ddd/ai/repositories.md`
- `./application-services.md`
