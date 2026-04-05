# workspace — Repositories

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件整理 `workspace` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/WikiWorkspaceRepository.ts`
- `domain/repositories/WorkspaceQueryRepository.ts`
- `domain/repositories/WorkspaceRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseWikiWorkspaceRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceQueryRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace/repositories.md`
- `../../../docs/ddd/workspace/aggregates.md`
