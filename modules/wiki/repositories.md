# wiki — Repositories

> **Canonical bounded context:** `wiki`
> **模組路徑:** `modules/wiki/`
> **Domain Type:** Core Domain

本文件整理 `wiki` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/GraphRepository.ts`

## Infrastructure Implementations

- `infrastructure/InMemoryGraphRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/wiki/repositories.md`
- `../../../docs/ddd/wiki/aggregates.md`
