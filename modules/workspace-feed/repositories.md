# workspace-feed — Repositories

> **Canonical DDD reference:** `../../docs/ddd/workspace-feed/repositories.md`

本文件對齊 `docs/ddd/workspace-feed/repositories.md`，整理 `workspace-feed` 的 repository ports 與 infrastructure 實作。

## Domain Repository Ports
- `domain/repositories/workspace-feed.repositories.ts`

## Infrastructure Implementations
- `infrastructure/firebase/FirebaseWorkspaceFeedInteractionRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceFeedPostRepository.ts`
- `infrastructure/index.ts`

## 設計規則

- `domain/repositories/` 定義抽象
- `infrastructure/` 提供實作
- `application/` 只依賴抽象，不依賴具體實作

## 參考

- `../../docs/ddd/workspace-feed/repositories.md`
- `./application-services.md`
