# knowledge — Repositories

> **Canonical bounded context:** `knowledge`
> **模組路徑:** `modules/knowledge/`
> **Domain Type:** Core Domain

本文件整理 `knowledge` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/knowledge.repositories.ts` — `KnowledgePageRepository`, `KnowledgeBlockRepository`, `KnowledgeVersionRepository`, `KnowledgeCollectionRepository`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseContentPageRepository.ts`
- `infrastructure/firebase/FirebaseContentBlockRepository.ts`
- `infrastructure/firebase/FirebaseContentCollectionRepository.ts`
- `infrastructure/index.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/knowledge/repositories.md`
- `../../../docs/ddd/knowledge/aggregates.md`
