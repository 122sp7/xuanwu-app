# search — Repositories

> **Canonical DDD reference:** `../../docs/ddd/search/repositories.md`

本文件對齊 `docs/ddd/search/repositories.md`，整理 `search` 的 repository ports 與 infrastructure 實作。

## Domain Repository Ports
- `domain/repositories/RagGenerationRepository.ts`
- `domain/repositories/RagQueryFeedbackRepository.ts`
- `domain/repositories/RagRetrievalRepository.ts`
- `domain/repositories/WikiContentRepository.ts`

## Infrastructure Implementations
- `infrastructure/firebase/FirebaseRagQueryFeedbackRepository.ts`
- `infrastructure/firebase/FirebaseRagRetrievalRepository.ts`
- `infrastructure/firebase/FirebaseWikiContentRepository.ts`
- `infrastructure/genkit/GenkitRagGenerationRepository.ts`
- `infrastructure/genkit/client.ts`

## 設計規則

- `domain/repositories/` 定義抽象
- `infrastructure/` 提供實作
- `application/` 只依賴抽象，不依賴具體實作

## 參考

- `../../docs/ddd/search/repositories.md`
- `./application-services.md`
