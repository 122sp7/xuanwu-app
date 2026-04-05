# workspace-flow — Repositories

> **Canonical DDD reference:** `../../docs/ddd/workspace-flow/repositories.md`

本文件對齊 `docs/ddd/workspace-flow/repositories.md`，整理 `workspace-flow` 的 repository ports 與 infrastructure 實作。

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

- `domain/repositories/` 定義抽象
- `infrastructure/` 提供實作
- `application/` 只依賴抽象，不依賴具體實作

## 參考

- `../../docs/ddd/workspace-flow/repositories.md`
- `./application-services.md`
