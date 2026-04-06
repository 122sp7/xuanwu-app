# workspace-scheduling — Repositories

> **Canonical bounded context:** `workspace-scheduling`
> **模組路徑:** `modules/workspace-scheduling/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-scheduling` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- 目前沒有對應檔案。

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseDemandRepository.ts`
- `infrastructure/mock-demand-repository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-scheduling/repositories.md`
- `../../../modules/workspace-scheduling/aggregates.md`
