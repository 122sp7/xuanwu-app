# notebook — Repositories

> **Canonical DDD reference:** `../../docs/ddd/notebook/repositories.md`

本文件對齊 `docs/ddd/notebook/repositories.md`，整理 `notebook` 的 repository ports 與 infrastructure 實作。

## Domain Repository Ports
- `domain/repositories/AgentRepository.ts`
- `domain/repositories/RagGenerationRepository.ts`
- `domain/repositories/RagRetrievalRepository.ts`

## Infrastructure Implementations
- `infrastructure/firebase/FirebaseRagRetrievalRepository.ts`
- `infrastructure/firebase/index.ts`
- `infrastructure/genkit/GenkitAgentRepository.ts`
- `infrastructure/genkit/client.ts`
- `infrastructure/genkit/index.ts`
- `infrastructure/index.ts`

## 設計規則

- `domain/repositories/` 定義抽象
- `infrastructure/` 提供實作
- `application/` 只依賴抽象，不依賴具體實作

## 參考

- `../../docs/ddd/notebook/repositories.md`
- `./application-services.md`
