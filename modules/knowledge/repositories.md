# knowledge — Repositories

> **Canonical DDD reference:** `../../docs/ddd/knowledge/repositories.md`

本文件對齊 `docs/ddd/knowledge/repositories.md`，整理 `knowledge` 的 repository ports 與 infrastructure 實作。

## Domain Repository Ports
- `domain/repositories/WikiPageRepository.ts`
- `domain/repositories/knowledge.repositories.ts`

## Infrastructure Implementations
- `infrastructure/InMemoryKnowledgeRepository.ts`
- `infrastructure/firebase/FirebaseContentBlockRepository.ts`
- `infrastructure/firebase/FirebaseContentPageRepository.ts`
- `infrastructure/index.ts`
- `infrastructure/repositories/firebase-wiki-page.repository.ts`
- `infrastructure/repositories/in-memory-wiki-page.repository.ts`

## 設計規則

- `domain/repositories/` 定義抽象
- `infrastructure/` 提供實作
- `application/` 只依賴抽象，不依賴具體實作

## 參考

- `../../docs/ddd/knowledge/repositories.md`
- `./application-services.md`
