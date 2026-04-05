# workspace-audit — Repositories

> **Canonical bounded context:** `workspace-audit`
> **模組路徑:** `modules/workspace-audit/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-audit` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/AuditRepository.ts`

## Infrastructure Implementations

- `infrastructure/.gitkeep`
- `infrastructure/firebase/FirebaseAuditRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-audit/repositories.md`
- `../../../docs/ddd/workspace-audit/aggregates.md`
