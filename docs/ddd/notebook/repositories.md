# notebook — Repositories

> **Canonical bounded context:** `notebook`
> **模組路徑:** `modules/notebook/`
> **Domain Type:** Supporting Subdomain

本文件整理 `notebook` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/NotebookRepository.ts`
- `domain/repositories/RagGenerationRepository.ts`
- `domain/repositories/RagRetrievalRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseRagRetrievalRepository.ts`
- `infrastructure/firebase/index.ts`
- `infrastructure/genkit/GenkitNotebookRepository.ts`
- `infrastructure/genkit/client.ts`
- `infrastructure/genkit/index.ts`
- `infrastructure/index.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/notebook/repositories.md`
- `../../../docs/ddd/notebook/aggregates.md`
