# workspace-flow — Repositories

> **Canonical bounded context:** `workspace-flow`
> **模組路徑:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-flow` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/InvoiceRepository.ts`
- `domain/repositories/IssueRepository.ts`
- `domain/repositories/TaskRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/invoice-item.converter.ts`
- `infrastructure/firebase/invoice.converter.ts`
- `infrastructure/firebase/issue.converter.ts`
- `infrastructure/firebase/sourceReference.converter.ts`
- `infrastructure/firebase/task.converter.ts`
- `infrastructure/firebase/workspace-flow.collections.ts`
- `infrastructure/repositories/FirebaseInvoiceItemRepository.ts`
- `infrastructure/repositories/FirebaseInvoiceRepository.ts`
- `infrastructure/repositories/FirebaseIssueRepository.ts`
- `infrastructure/repositories/FirebaseTaskRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-flow/repositories.md`
- `../../../modules/workspace-flow/aggregates.md`
