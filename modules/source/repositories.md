# source — Repositories

> **Canonical DDD reference:** `../../docs/ddd/source/repositories.md`

本文件對齊 `docs/ddd/source/repositories.md`，整理 `source` 的 repository ports 與 infrastructure 實作。

## Domain Repository Ports
- `domain/repositories/FileRepository.ts`
- `domain/repositories/RagDocumentRepository.ts`
- `domain/repositories/WikiLibraryRepository.ts`

## Infrastructure Implementations
- `infrastructure/firebase/FirebaseFileRepository.ts`
- `infrastructure/firebase/FirebaseRagDocumentRepository.ts`
- `infrastructure/index.ts`
- `infrastructure/repositories/in-memory-wiki-library.repository.ts`

## 設計規則

- `domain/repositories/` 定義抽象
- `infrastructure/` 提供實作
- `application/` 只依賴抽象，不依賴具體實作

## 參考

- `../../docs/ddd/source/repositories.md`
- `./application-services.md`
