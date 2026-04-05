# workspace — Repositories

> **Canonical DDD reference:** `../../docs/ddd/workspace/repositories.md`

本文件對齊 `docs/ddd/workspace/repositories.md`，整理 `workspace` 的 repository ports 與 infrastructure 實作。

## Domain Repository Ports
- `domain/repositories/WikiWorkspaceRepository.ts`
- `domain/repositories/WorkspaceQueryRepository.ts`
- `domain/repositories/WorkspaceRepository.ts`

## Infrastructure Implementations
- `infrastructure/firebase/FirebaseWikiWorkspaceRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceQueryRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceRepository.ts`

## 設計規則

- `domain/repositories/` 定義抽象
- `infrastructure/` 提供實作
- `application/` 只依賴抽象，不依賴具體實作

## 參考

- `../../docs/ddd/workspace/repositories.md`
- `./application-services.md`
